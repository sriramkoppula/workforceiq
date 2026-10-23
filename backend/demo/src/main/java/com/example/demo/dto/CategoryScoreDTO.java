package com.example.demo.dto;

public class CategoryScoreDTO {

    private String categoryKey;
    private String displayName;
    private double baseWeight;
    private double effectiveWeight;
    private Double score;
    private double totalMarksObtained;
    private double totalPossibleMarks;
    private int evidenceCount;
    private boolean hasEvidence;

    public CategoryScoreDTO() {
    }

    public CategoryScoreDTO(String categoryKey, String displayName, double baseWeight,
                            double effectiveWeight, Double score, double totalMarksObtained,
                            double totalPossibleMarks, int evidenceCount, boolean hasEvidence) {
        this.categoryKey = categoryKey;
        this.displayName = displayName;
        this.baseWeight = baseWeight;
        this.effectiveWeight = effectiveWeight;
        this.score = score;
        this.totalMarksObtained = totalMarksObtained;
        this.totalPossibleMarks = totalPossibleMarks;
        this.evidenceCount = evidenceCount;
        this.hasEvidence = hasEvidence;
    }

    public String getCategoryKey() {
        return categoryKey;
    }

    public void setCategoryKey(String categoryKey) {
        this.categoryKey = categoryKey;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public double getBaseWeight() {
        return baseWeight;
    }

    public void setBaseWeight(double baseWeight) {
        this.baseWeight = baseWeight;
    }

    public double getEffectiveWeight() {
        return effectiveWeight;
    }

    public void setEffectiveWeight(double effectiveWeight) {
        this.effectiveWeight = effectiveWeight;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public double getTotalMarksObtained() {
        return totalMarksObtained;
    }

    public void setTotalMarksObtained(double totalMarksObtained) {
        this.totalMarksObtained = totalMarksObtained;
    }

    public double getTotalPossibleMarks() {
        return totalPossibleMarks;
    }

    public void setTotalPossibleMarks(double totalPossibleMarks) {
        this.totalPossibleMarks = totalPossibleMarks;
    }

    public int getEvidenceCount() {
        return evidenceCount;
    }

    public void setEvidenceCount(int evidenceCount) {
        this.evidenceCount = evidenceCount;
    }

    public boolean isHasEvidence() {
        return hasEvidence;
    }

    public void setHasEvidence(boolean hasEvidence) {
        this.hasEvidence = hasEvidence;
    }
}
