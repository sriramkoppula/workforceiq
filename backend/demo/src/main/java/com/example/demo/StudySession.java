package com.example.demo;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "study_sessions")
public class StudySession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String skill;

    @Column(nullable = false)
    private Long duration;

    @Column(nullable = false)
    private LocalDateTime sessionDate;

    public StudySession() {
    }

    @PrePersist
    @PreUpdate
    public void beforeSave() {
        if (sessionDate == null) {
            sessionDate = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getSkill() {
        return skill;
    }

    public Long getDuration() {
        return duration;
    }

    public LocalDateTime getSessionDate() {
        return sessionDate;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setSkill(String skill) {
        this.skill = skill;
    }

    public void setDuration(Long duration) {
        this.duration = duration;
    }

    public void setSessionDate(LocalDateTime sessionDate) {
        this.sessionDate = sessionDate;
    }
}