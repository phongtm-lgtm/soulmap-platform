\set ON_ERROR_STOP on

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    google_sub VARCHAR(255) UNIQUE,
    email VARCHAR(320) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    avatar_url TEXT,
    mbti_type VARCHAR(4),
    mbti_updated_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS user_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_active
    ON user_sessions (token_hash, expires_at)
    WHERE revoked_at IS NULL;

CREATE TABLE IF NOT EXISTS user_tuvi_charts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id),
    profile_key VARCHAR(64),
    birth_data_json TEXT NOT NULL,
    chart_json TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mbti_questions (
    id BIGSERIAL PRIMARY KEY,
    stt INTEGER NOT NULL,
    group_index INTEGER NOT NULL,
    dimension_pair VARCHAR(2) NOT NULL,
    question_text TEXT NOT NULL,
    option_a_text TEXT NOT NULL,
    option_a_dimension VARCHAR(1) NOT NULL,
    option_b_text TEXT NOT NULL,
    option_b_dimension VARCHAR(1) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_mbti_questions_stt UNIQUE (stt),
    CONSTRAINT chk_mbti_questions_group_index CHECK (group_index BETWEEN 0 AND 3),
    CONSTRAINT chk_mbti_questions_dimension_pair CHECK (dimension_pair IN ('EI', 'SN', 'TF', 'JP')),
    CONSTRAINT chk_mbti_questions_option_a_dimension CHECK (option_a_dimension IN ('E', 'I', 'S', 'N', 'T', 'F', 'J', 'P')),
    CONSTRAINT chk_mbti_questions_option_b_dimension CHECK (option_b_dimension IN ('E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'))
);

CREATE TABLE IF NOT EXISTS mentor_conversations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL DEFAULT 'Cuộc trò chuyện mới',
    active_journey VARCHAR(32),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mentor_conversations_user_updated
    ON mentor_conversations (user_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS mentor_messages (
    id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL REFERENCES mentor_conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mentor_messages_conversation_created
    ON mentor_messages (conversation_id, created_at ASC);

\ir seed_mbti_questions.sql
