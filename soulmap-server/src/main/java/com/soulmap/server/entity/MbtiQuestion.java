package com.soulmap.server.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(
        name = "mbti_questions",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_mbti_questions_stt", columnNames = {"stt"})
        }
)
public class MbtiQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "stt", nullable = false)
    private Integer stt;

    @Column(name = "group_index", nullable = false)
    private Integer groupIndex;

    @Column(name = "dimension_pair", nullable = false, length = 2)
    private String dimensionPair;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "option_a_text", nullable = false, columnDefinition = "TEXT")
    private String optionAText;

    @Column(name = "option_a_dimension", nullable = false, length = 1)
    private String optionADimension;

    @Column(name = "option_b_text", nullable = false, columnDefinition = "TEXT")
    private String optionBText;

    @Column(name = "option_b_dimension", nullable = false, length = 1)
    private String optionBDimension;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
