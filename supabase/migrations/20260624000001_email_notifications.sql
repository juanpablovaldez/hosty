-- ============================================================
-- Email Notifications Infrastructure
-- ============================================================
-- 0. private schema (must exist before functions below)
-- 1. SECURITY DEFINER function to read emails from auth.users
-- 2. Database webhooks that invoke the send-emails Edge Function
-- 3. pg_cron job for 24h-before reminders
-- ============================================================

-- ------------------------------------------------------------
-- 0. Ensure private schema exists
-- ------------------------------------------------------------
create schema if not exists private;

-- ------------------------------------------------------------
-- 1. Helper: get_user_email
-- Runs as postgres (SECURITY DEFINER) so it can read auth.users,
-- which is off-limits to the anon/authenticated roles via RLS.
-- Only callable by the service_role or by functions with the
-- right privileges — not exposed through PostgREST by default.
-- ------------------------------------------------------------
create or replace function public.get_user_email(target_user_id uuid)
returns text
language sql
security definer
stable
set search_path = public
as $$
  select email::text
  from auth.users
  where id = target_user_id
  limit 1;
$$;

-- Restrict direct execution to postgres and service_role only.
revoke execute on function public.get_user_email(uuid) from public, anon, authenticated;
grant  execute on function public.get_user_email(uuid) to service_role;

-- ------------------------------------------------------------
-- 2. Enable pg_net extension (required for HTTP calls from SQL)
-- pg_net is available on all Supabase hosted projects.
-- For local dev, it is bundled with supabase start.
-- ------------------------------------------------------------
create extension if not exists pg_net schema extensions;

-- ------------------------------------------------------------
-- 3. Helper: invoke_send_emails
-- Fires an HTTP POST to the send-emails Edge Function.
-- Called from trigger functions below.
-- ------------------------------------------------------------
create or replace function private.invoke_send_emails(payload jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  edge_function_url text;
  webhook_secret    text;
begin
  -- These are set as Supabase project secrets and accessible via
  -- the current_setting mechanism in hosted Supabase environments.
  -- On local dev they fall back to the local edge runtime URL.
  edge_function_url := coalesce(
    current_setting('app.edge_function_base_url', true),
    'http://host.docker.internal:54321'
  ) || '/functions/v1/send-emails';

  webhook_secret := coalesce(
    current_setting('app.webhook_secret', true),
    ''
  );

  perform extensions.http_post(
    url     := edge_function_url,
    body    := payload,
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || webhook_secret
    )
  );
exception
  -- Never let email failures break the originating transaction.
  when others then
    raise warning 'invoke_send_emails failed: %', sqlerrm;
end;
$$;

-- Restrict to postgres/service_role only
revoke execute on function private.invoke_send_emails(jsonb) from public, anon, authenticated;
grant  execute on function private.invoke_send_emails(jsonb) to service_role;

-- ------------------------------------------------------------
-- 4. Trigger: on new booking INSERT
-- Fires both "confirmation" (to guest) and "host_notification"
-- (to host) when a booking is created.
-- Both are sent as separate async HTTP calls so one failure
-- does not block the other.
-- ------------------------------------------------------------
create or replace function private.trg_booking_insert_notify()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Email to guest: booking confirmation
  perform private.invoke_send_emails(
    jsonb_build_object(
      'type',   'confirmation',
      'record', row_to_json(NEW)::jsonb
    )
  );

  -- Email to host: new booking notification
  perform private.invoke_send_emails(
    jsonb_build_object(
      'type',   'host_notification',
      'record', row_to_json(NEW)::jsonb
    )
  );

  return NEW;
end;
$$;

drop trigger if exists trg_booking_insert_notify on public.bookings;
create trigger trg_booking_insert_notify
  after insert on public.bookings
  for each row
  execute function private.trg_booking_insert_notify();

-- ------------------------------------------------------------
-- 5. Trigger: on booking status UPDATE
-- Fires "status_update" (to guest) when host changes status
-- from pending → confirmed | declined.
-- ------------------------------------------------------------
create or replace function private.trg_booking_status_notify()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Only react when status actually changes to a terminal state
  if OLD.status = NEW.status then
    return NEW;
  end if;

  if NEW.status in ('confirmed', 'declined') then
    perform private.invoke_send_emails(
      jsonb_build_object(
        'type',       'status_update',
        'record',     row_to_json(NEW)::jsonb,
        'old_record', row_to_json(OLD)::jsonb
      )
    );
  end if;

  return NEW;
end;
$$;

drop trigger if exists trg_booking_status_notify on public.bookings;
create trigger trg_booking_status_notify
  after update of status on public.bookings
  for each row
  execute function private.trg_booking_status_notify();

-- ------------------------------------------------------------
-- 6. pg_cron: daily reminder job
-- Runs at 10:00 AM UTC every day.
-- Queries for bookings with event_date = tomorrow that are
-- still confirmed, then fires a reminder email for each.
-- pg_cron is available on all Supabase hosted projects.
-- For local dev, cron jobs can be triggered manually via SQL.
-- ------------------------------------------------------------
create extension if not exists pg_cron schema extensions;

-- Remove existing job if it exists (safe re-run)
select cron.unschedule('hosty-booking-reminders')
where exists (
  select 1 from cron.job where jobname = 'hosty-booking-reminders'
);

select cron.schedule(
  'hosty-booking-reminders',
  '0 10 * * *',
  $$
    select private.invoke_send_emails(
      jsonb_build_object(
        'type',   'reminder',
        'record', row_to_json(b)::jsonb
      )
    )
    from public.bookings b
    where b.event_date = current_date + interval '1 day'
      and b.status     = 'confirmed';
  $$
);

-- (private schema was created at the top of this migration)
