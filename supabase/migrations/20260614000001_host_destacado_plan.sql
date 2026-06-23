-- Plan Destacado: subscription visibility plan for salon owners

ALTER TABLE salones
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS salon_subscriptions (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id                     uuid REFERENCES auth.users(id) NOT NULL,
  status                      text NOT NULL
    CHECK (status IN ('pending', 'active', 'cancelled', 'expired')),
  plan_id                     text NOT NULL DEFAULT 'destacado',
  amount_monthly              numeric(10,2) NOT NULL DEFAULT 4999,
  mercadopago_subscription_id text,
  started_at                  timestamptz,
  current_period_end          timestamptz,
  cancelled_at                timestamptz,
  created_at                  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE salon_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "host_read_own_subscription"
  ON salon_subscriptions FOR SELECT
  USING (host_id = auth.uid());

CREATE POLICY "host_insert_own_subscription"
  ON salon_subscriptions FOR INSERT
  WITH CHECK (host_id = auth.uid());

CREATE POLICY "host_update_own_subscription"
  ON salon_subscriptions FOR UPDATE
  USING (host_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_salones_is_featured
  ON salones (is_featured DESC);

CREATE INDEX IF NOT EXISTS idx_salon_subscriptions_host_id
  ON salon_subscriptions (host_id);
