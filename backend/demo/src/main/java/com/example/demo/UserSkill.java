package com.example.demo;

import jakarta.persistence.*;

@Entity
@Table(
    name = "user_skills",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {"user_id", "skill_name"}
        )
    },
    indexes = {
        // The unique constraint above already covers (user_id, skill_name) lookups.
        // This index on user_id alone ensures fast findByUserId() queries.
        @Index(name = "idx_user_skills_user_id", columnList = "user_id")
    }
)
public class UserSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "skill_name", nullable = false)
    private String skillName;

    @Column(nullable = false)
    private Integer confidence = 0;

    @Column(name = "performance_score")
    private Double performanceScore;

    @Column(name = "evidence_strength", length = 50)
    private String evidenceStrength = "None";

    @Column(name = "evidence_count")
    private Integer evidenceCount = 0;

    @Column(name = "last_assessed_at")
    private java.time.LocalDateTime lastAssessedAt;

    public UserSkill() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public Integer getConfidence() {
        return confidence;
    }

    public void setConfidence(Integer confidence) {
        this.confidence = confidence;
    }

    public Double getPerformanceScore() {
        return performanceScore;
    }

    public void setPerformanceScore(Double performanceScore) {
        this.performanceScore = performanceScore;
    }

    public String getEvidenceStrength() {
        return evidenceStrength;
    }

    public void setEvidenceStrength(String evidenceStrength) {
        this.evidenceStrength = evidenceStrength;
    }

    public Integer getEvidenceCount() {
        return evidenceCount;
    }

    public void setEvidenceCount(Integer evidenceCount) {
        this.evidenceCount = evidenceCount;
    }

    public java.time.LocalDateTime getLastAssessedAt() {
        return lastAssessedAt;
    }

    public void setLastAssessedAt(java.time.LocalDateTime lastAssessedAt) {
        this.lastAssessedAt = lastAssessedAt;
    }
}