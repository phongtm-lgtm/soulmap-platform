CREATE TABLE IF NOT EXISTS ai_readings (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255),
    type VARCHAR(50) NOT NULL,
    chapter_id VARCHAR(100),
    chapter_title VARCHAR(255),
    profile_key VARCHAR(64),
    model VARCHAR(255),
    request_json TEXT,
    la_so_json TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_readings_profile_key
    ON ai_readings (user_id, profile_key, type, chapter_id);
