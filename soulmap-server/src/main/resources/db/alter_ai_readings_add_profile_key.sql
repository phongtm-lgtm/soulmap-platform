ALTER TABLE ai_readings ADD COLUMN IF NOT EXISTS profile_key VARCHAR(64);
ALTER TABLE user_tuvi_charts ADD COLUMN IF NOT EXISTS profile_key VARCHAR(64);
CREATE INDEX IF NOT EXISTS idx_ai_readings_profile_key
    ON ai_readings (user_id, profile_key, type, chapter_id);
