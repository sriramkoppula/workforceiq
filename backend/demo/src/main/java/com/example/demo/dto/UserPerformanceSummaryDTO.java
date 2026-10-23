package com.example.demo.dto;

import java.util.ArrayList;
import java.util.List;

public class UserPerformanceSummaryDTO {

    private Long userId;
    private Double overallPerformanceScore;
    private Double readinessScore;
    private String targetCareer;
    private int totalTrackedSkills;
    private int assessedSkillsCount;
    private List<String> strongEvidenceSkills = new ArrayList<>();
    private List<String> moderateEvidenceSkills = new ArrayList<>();
    private List<String> limitedEvidenceSkills = new ArrayList<>();
    private List<String> noEvidenceSkills = new ArrayList<>();
    private List<String> skillsNeedingImprovement = new ArrayList<>();
    private List<SkillScoreBreakdownDTO> skillBreakdowns = new ArrayList<>();

    public UserPerformanceSummaryDTO() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Double getOverallPerformanceScore() {
        return overallPerformanceScore;
    }

    public void setOverallPerformanceScore(Double overallPerformanceScore) {
        this.overallPerformanceScore = overallPerformanceScore;
    }

    public Double getReadinessScore() {
        return readinessScore;
    }

    public void setReadinessScore(Double readinessScore) {
        this.readinessScore = readinessScore;
    }

    public String getTargetCareer() {
        return targetCareer;
    }

    public void setTargetCareer(String targetCareer) {
        this.targetCareer = targetCareer;
    }

    public int getTotalTrackedSkills() {
        return totalTrackedSkills;
    }

    public void setTotalTrackedSkills(int totalTrackedSkills) {
        this.totalTrackedSkills = totalTrackedSkills;
    }

    public int getAssessedSkillsCount() {
        return assessedSkillsCount;
    }

    public void setAssessedSkillsCount(int assessedSkillsCount) {
        this.assessedSkillsCount = assessedSkillsCount;
    }

    public List<String> getStrongEvidenceSkills() {
        return strongEvidenceSkills;
    }

    public void setStrongEvidenceSkills(List<String> strongEvidenceSkills) {
        this.strongEvidenceSkills = strongEvidenceSkills;
    }

    public List<String> getModerateEvidenceSkills() {
        return moderateEvidenceSkills;
    }

    public void setModerateEvidenceSkills(List<String> moderateEvidenceSkills) {
        this.moderateEvidenceSkills = moderateEvidenceSkills;
    }

    public List<String> getLimitedEvidenceSkills() {
        return limitedEvidenceSkills;
    }

    public void setLimitedEvidenceSkills(List<String> limitedEvidenceSkills) {
        this.limitedEvidenceSkills = limitedEvidenceSkills;
    }

    public List<String> getNoEvidenceSkills() {
        return noEvidenceSkills;
    }

    public void setNoEvidenceSkills(List<String> noEvidenceSkills) {
        this.noEvidenceSkills = noEvidenceSkills;
    }

    public List<String> getSkillsNeedingImprovement() {
        return skillsNeedingImprovement;
    }

    public void setSkillsNeedingImprovement(List<String> skillsNeedingImprovement) {
        this.skillsNeedingImprovement = skillsNeedingImprovement;
    }

    public List<SkillScoreBreakdownDTO> getSkillBreakdowns() {
        return skillBreakdowns;
    }

    public void setSkillBreakdowns(List<SkillScoreBreakdownDTO> skillBreakdowns) {
        this.skillBreakdowns = skillBreakdowns;
    }
}
