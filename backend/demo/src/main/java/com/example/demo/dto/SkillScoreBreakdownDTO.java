package com.example.demo.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class SkillScoreBreakdownDTO {

    private Long userId;
    private String skillName;
    private Double performanceScore;
    private Integer displayConfidence;
    private String evidenceStrength;
    private int evidenceCount;
    private LocalDateTime lastAssessedAt;
    private boolean isProvisional;
    private boolean hasSufficientEvidence;
    private String statusLabel;
    private String formulaExplanation;
    private List<CategoryScoreDTO> categories = new ArrayList<>();
    private List<String> missingCategories = new ArrayList<>();
    private List<String> availableCategories = new ArrayList<>();

    public SkillScoreBreakdownDTO() {
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

    public Double getPerformanceScore() {
        return performanceScore;
    }

    public void setPerformanceScore(Double performanceScore) {
        this.performanceScore = performanceScore;
    }

    public Integer getDisplayConfidence() {
        return displayConfidence;
    }

    public void setDisplayConfidence(Integer displayConfidence) {
        this.displayConfidence = displayConfidence;
    }

    public String getEvidenceStrength() {
        return evidenceStrength;
    }

    public void setEvidenceStrength(String evidenceStrength) {
        this.evidenceStrength = evidenceStrength;
    }

    public int getEvidenceCount() {
        return evidenceCount;
    }

    public void setEvidenceCount(int evidenceCount) {
        this.evidenceCount = evidenceCount;
    }

    public LocalDateTime getLastAssessedAt() {
        return lastAssessedAt;
    }

    public void setLastAssessedAt(LocalDateTime lastAssessedAt) {
        this.lastAssessedAt = lastAssessedAt;
    }

    public boolean isProvisional() {
        return isProvisional;
    }

    public void setProvisional(boolean provisional) {
        isProvisional = provisional;
    }

    public boolean isHasSufficientEvidence() {
        return hasSufficientEvidence;
    }

    public void setHasSufficientEvidence(boolean hasSufficientEvidence) {
        this.hasSufficientEvidence = hasSufficientEvidence;
    }

    public String getStatusLabel() {
        return statusLabel;
    }

    public void setStatusLabel(String statusLabel) {
        this.statusLabel = statusLabel;
    }

    public String getFormulaExplanation() {
        return formulaExplanation;
    }

    public void setFormulaExplanation(String formulaExplanation) {
        this.formulaExplanation = formulaExplanation;
    }

    public List<CategoryScoreDTO> getCategories() {
        return categories;
    }

    public void setCategories(List<CategoryScoreDTO> categories) {
        this.categories = categories;
    }

    public List<String> getMissingCategories() {
        return missingCategories;
    }

    public void setMissingCategories(List<String> missingCategories) {
        this.missingCategories = missingCategories;
    }

    public List<String> getAvailableCategories() {
        return availableCategories;
    }

    public void setAvailableCategories(List<String> availableCategories) {
        this.availableCategories = availableCategories;
    }
}
