CREATE TABLE IF NOT EXISTS user_favorites (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users(id) NOT NULL,
  salon_id   uuid REFERENCES salones(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, salon_id)
);

ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_read_own_favorites"
  ON user_favorites FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "user_insert_own_favorites"
  ON user_favorites FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_delete_own_favorites"
  ON user_favorites FOR DELETE
  USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites (user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_salon_id ON user_favorites (salon_id);
