DROP TABLE IF EXISTS mbti_questions;

CREATE TABLE mbti_questions (
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

CREATE INDEX IF NOT EXISTS idx_mbti_questions_stt
    ON mbti_questions (stt);
