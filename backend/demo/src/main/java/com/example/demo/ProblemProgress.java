package com.example.demo;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "problem_progress", indexes = {
        @Index(name = "idx_problem_user", columnList = "userId"),
        @Index(name = "idx_problem_user_skill", columnList = "userId,skillName"),
        @Index(name = "idx_problem_user_problem", columnList = "userId,problemId")
})
public class ProblemProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 100)
    private String problemId;

    @Column(nullable = false, length = 100)
    private String skillName;

    @Column(nullable = false, length = 150)
    private String topicName;

    @Column(nullable = false, length = 30)
    private String status = "NOT_STARTED"; // NOT_STARTED, IN_PROGRESS, COMPLETED

    @Column(nullable = false)
    private Integer attempts = 0;

    @Column(name = "score")
    private Double score;

    @Column(name = "solution_code", columnDefinition = "TEXT")
    private String solutionCode;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "last_activity_at", nullable = false)
    private LocalDateTime lastActivityAt;

    public ProblemProgress() {
    }

    public ProblemProgress(Long userId, String problemId, String skillName, String topicName) {
        this.userId = userId;
        this.problemId = problemId;
        this.skillName = skillName;
        this.topicName = topicName;
        this.status = "NOT_STARTED";
        this.attempts = 0;
        this.lastActivityAt = LocalDateTime.now();
    }

    @PrePersist
    @PreUpdate
    public void beforeSave() {
        if (lastActivityAt == null) {
            lastActivityAt = LocalDateTime.now();
        }
        if (attempts == null) {
            attempts = 0;
        }
        if (status == null) {
            status = "NOT_STARTED";
        }
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

    public String getProblemId() {
        return problemId;
    }

    public void setProblemId(String problemId) {
        this.problemId = problemId;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public String getTopicName() {
        return topicName;
    }

    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getAttempts() {
        return attempts;
    }

    public void setAttempts(Integer attempts) {
        this.attempts = attempts;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public String getSolutionCode() {
        return solutionCode;
    }

    public void setSolutionCode(String solutionCode) {
        this.solutionCode = solutionCode;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public LocalDateTime getLastActivityAt() {
        return lastActivityAt;
    }

    public void setLastActivityAt(LocalDateTime lastActivityAt) {
        this.lastActivityAt = lastActivityAt;
    }
}
