package com.example.demo.service;

import com.example.demo.Evidence;
import com.example.demo.User;
import com.example.demo.UserSkill;
import com.example.demo.dto.CategoryScoreDTO;
import com.example.demo.dto.SkillScoreBreakdownDTO;
import com.example.demo.dto.UserPerformanceSummaryDTO;
import com.example.demo.repository.EvidenceRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.UserSkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class PerformanceScoringService {

    // Configurable Category Weights
    public static final double WEIGHT_TESTS_AND_ASSIGNMENTS = 0.35;
    public static final double WEIGHT_PROJECTS = 0.30;
    public static final double WEIGHT_PRACTICAL_CODING = 0.20;
    public static final double WEIGHT_LEARNING_PRACTICE = 0.15;

    public static final String CAT_TESTS_AND_ASSIGNMENTS = "TESTS_AND_ASSIGNMENTS";
    public static final String CAT_PROJECTS = "PROJECTS";
    public static final String CAT_PRACTICAL_CODING = "PRACTICAL_CODING";
    public static final String CAT_LEARNING_PRACTICE = "LEARNING_PRACTICE";

    // Standard Career Requirements Map
    private static final Map<String, List<String>> CAREER_SKILLS_MAP = new HashMap<>();

    static {
        CAREER_SKILLS_MAP.put("Java Backend Developer", Arrays.asList(
                "Java Fundamentals", "OOP", "Data Structures", "SQL", "REST API", "Spring Boot", "Git"
        ));
        CAREER_SKILLS_MAP.put("Frontend Developer", Arrays.asList(
                "HTML", "CSS", "JavaScript", "Git", "React", "REST API"
        ));
        CAREER_SKILLS_MAP.put("Data Analyst", Arrays.asList(
                "Python", "SQL", "Statistics", "Excel", "Data Visualization", "Power BI"
        ));
        CAREER_SKILLS_MAP.put("Cloud Engineer", Arrays.asList(
                "Linux", "Networking", "Git", "AWS", "Docker", "Kubernetes"
        ));
    }

    private final EvidenceRepository evidenceRepository;
    private final UserSkillRepository userSkillRepository;
    private final UserRepository userRepository;

    public PerformanceScoringService(EvidenceRepository evidenceRepository,
                                     UserSkillRepository userSkillRepository,
                                     UserRepository userRepository) {
        this.evidenceRepository = evidenceRepository;
        this.userSkillRepository = userSkillRepository;
        this.userRepository = userRepository;
    }

    /**
     * Map evidenceType string to one of the 4 standard categories.
     */
    public String mapToCategory(String evidenceType) {
        if (evidenceType == null) {
            return CAT_LEARNING_PRACTICE;
        }
        String normalized = evidenceType.trim().toLowerCase();
        switch (normalized) {
            case "assessment":
            case "test":
            case "exam":
            case "quiz":
            case "assignment":
                return CAT_TESTS_AND_ASSIGNMENTS;
            case "project":
            case "capstone":
                return CAT_PROJECTS;
            case "problems":
            case "coding":
            case "practical":
            case "practical_coding":
            case "lab":
                return CAT_PRACTICAL_CODING;
            case "practice":
            case "learning":
            case "tutorial":
            case "activity":
            default:
                return CAT_LEARNING_PRACTICE;
        }
    }

    /**
     * Calculate score breakdown for a single skill of a user.
     */
    public SkillScoreBreakdownDTO calculateSkillBreakdown(Long userId, String skillName) {
        SkillScoreBreakdownDTO breakdown = new SkillScoreBreakdownDTO();
        breakdown.setUserId(userId);
        breakdown.setSkillName(skillName);

        List<Evidence> evidenceList = evidenceRepository.findByUserIdAndSkillNameOrderByCreatedAtDesc(userId, skillName);

        // Filter valid verified evidence
        List<Evidence> validEvidence = new ArrayList<>();
        LocalDateTime latestDate = null;

        for (Evidence e : evidenceList) {
            // Must be verified (null considered true for backward compatibility)
            if (Boolean.FALSE.equals(e.getIsVerified())) {
                continue;
            }
            // Must have a valid score or marks
            if (e.getMarksObtained() != null && e.getMaxMarks() != null) {
                if (e.getMarksObtained() < 0 || e.getMaxMarks() <= 0 || e.getMarksObtained() > e.getMaxMarks()) {
                    continue; // Skip invalid marks
                }
            } else if (e.getScore() == null || e.getScore() < 0 || e.getScore() > 100) {
                continue; // Skip invalid percentage score
            }

            validEvidence.add(e);
            LocalDateTime assessmentDate = e.getAssessmentDate() != null ? e.getAssessmentDate() : e.getCreatedAt();
            if (assessmentDate != null && (latestDate == null || assessmentDate.isAfter(latestDate))) {
                latestDate = assessmentDate;
            }
        }

        breakdown.setEvidenceCount(validEvidence.size());
        breakdown.setLastAssessedAt(latestDate);

        // Group evidence into categories
        Map<String, List<Evidence>> categoryMap = new HashMap<>();
        categoryMap.put(CAT_TESTS_AND_ASSIGNMENTS, new ArrayList<>());
        categoryMap.put(CAT_PROJECTS, new ArrayList<>());
        categoryMap.put(CAT_PRACTICAL_CODING, new ArrayList<>());
        categoryMap.put(CAT_LEARNING_PRACTICE, new ArrayList<>());

        for (Evidence e : validEvidence) {
            String cat = mapToCategory(e.getEvidenceType());
            categoryMap.get(cat).add(e);
        }

        // Calculate scores per category
        List<CategoryScoreDTO> categoryDTOs = new ArrayList<>();
        List<String> availableCategories = new ArrayList<>();
        List<String> missingCategories = new ArrayList<>();

        double availableWeightSum = 0.0;

        // 1. Tests & Assignments
        CategoryScoreDTO testsCat = buildCategoryScore(
                CAT_TESTS_AND_ASSIGNMENTS, "Tests and Assignments",
                WEIGHT_TESTS_AND_ASSIGNMENTS, categoryMap.get(CAT_TESTS_AND_ASSIGNMENTS)
        );
        categoryDTOs.add(testsCat);
        if (testsCat.isHasEvidence()) {
            availableCategories.add("Tests and Assignments");
            availableWeightSum += testsCat.getBaseWeight();
        } else {
            missingCategories.add("Tests and Assignments");
        }

        // 2. Projects
        CategoryScoreDTO projectsCat = buildCategoryScore(
                CAT_PROJECTS, "Projects",
                WEIGHT_PROJECTS, categoryMap.get(CAT_PROJECTS)
        );
        categoryDTOs.add(projectsCat);
        if (projectsCat.isHasEvidence()) {
            availableCategories.add("Projects");
            availableWeightSum += projectsCat.getBaseWeight();
        } else {
            missingCategories.add("Projects");
        }

        // 3. Practical Coding
        CategoryScoreDTO codingCat = buildCategoryScore(
                CAT_PRACTICAL_CODING, "Practical Coding Tasks",
                WEIGHT_PRACTICAL_CODING, categoryMap.get(CAT_PRACTICAL_CODING)
        );
        categoryDTOs.add(codingCat);
        if (codingCat.isHasEvidence()) {
            availableCategories.add("Practical Coding Tasks");
            availableWeightSum += codingCat.getBaseWeight();
        } else {
            missingCategories.add("Practical Coding Tasks");
        }

        // 4. Learning & Practice
        CategoryScoreDTO practiceCat = buildCategoryScore(
                CAT_LEARNING_PRACTICE, "Learning & Practice Activities",
                WEIGHT_LEARNING_PRACTICE, categoryMap.get(CAT_LEARNING_PRACTICE)
        );
        categoryDTOs.add(practiceCat);
        if (practiceCat.isHasEvidence()) {
            availableCategories.add("Learning & Practice Activities");
            availableWeightSum += practiceCat.getBaseWeight();
        } else {
            missingCategories.add("Learning & Practice Activities");
        }

        breakdown.setCategories(categoryDTOs);
        breakdown.setAvailableCategories(availableCategories);
        breakdown.setMissingCategories(missingCategories);

        // Evidence Strength
        int totalValidEvidence = validEvidence.size();
        int categoriesRepresented = availableCategories.size();
        String strength;
        if (totalValidEvidence == 0) {
            strength = "None";
        } else if (totalValidEvidence <= 2 || categoriesRepresented == 1) {
            strength = "Limited";
        } else if (totalValidEvidence >= 4 && categoriesRepresented >= 3) {
            strength = "Strong";
        } else {
            strength = "Moderate";
        }
        breakdown.setEvidenceStrength(strength);

        // Overall Performance Score with Weight Renormalization
        if (availableWeightSum == 0.0 || totalValidEvidence == 0) {
            breakdown.setPerformanceScore(null);
            breakdown.setDisplayConfidence(0);
            breakdown.setHasSufficientEvidence(false);
            breakdown.setProvisional(false);
            breakdown.setStatusLabel("Not enough evidence yet");
            breakdown.setFormulaExplanation(
                    "No valid performance evidence recorded for this skill yet. Add tests, projects, coding problems, or practice to calculate your score."
            );
        } else {
            double weightedSum = 0.0;
            StringBuilder formulaBuilder = new StringBuilder("Score calculated as: (");
            boolean first = true;

            for (CategoryScoreDTO cat : categoryDTOs) {
                if (cat.isHasEvidence()) {
                    // Renormalize effective weight across available categories
                    double effectiveWeight = cat.getBaseWeight() / availableWeightSum;
                    cat.setEffectiveWeight(Math.round(effectiveWeight * 1000.0) / 1000.0);

                    weightedSum += cat.getScore() * effectiveWeight;

                    if (!first) {
                        formulaBuilder.append(" + ");
                    }
                    formulaBuilder.append(String.format("%s: %.1f%% × %.1f%%",
                            cat.getDisplayName(), cat.getScore(), effectiveWeight * 100.0));
                    first = false;
                } else {
                    cat.setEffectiveWeight(0.0);
                }
            }
            formulaBuilder.append(")");

            double finalScore = Math.round(weightedSum * 10.0) / 10.0;
            breakdown.setPerformanceScore(finalScore);
            int displayConf = (int) Math.round(finalScore);
            breakdown.setDisplayConfidence(displayConf);
            breakdown.setHasSufficientEvidence(true);
            breakdown.setProvisional(categoriesRepresented < 4);

            if (breakdown.isProvisional()) {
                formulaBuilder.append(String.format(" [Provisional: renormalized over %d/4 categories. Missing: %s]",
                        categoriesRepresented, String.join(", ", missingCategories)));
            }

            breakdown.setFormulaExplanation(formulaBuilder.toString());

            if (displayConf >= 80) {
                breakdown.setStatusLabel("STRONG");
            } else if (displayConf >= 50) {
                breakdown.setStatusLabel("DEVELOPING");
            } else {
                breakdown.setStatusLabel("BASIC");
            }
        }

        return breakdown;
    }

    private CategoryScoreDTO buildCategoryScore(String key, String displayName, double baseWeight, List<Evidence> list) {
        CategoryScoreDTO dto = new CategoryScoreDTO();
        dto.setCategoryKey(key);
        dto.setDisplayName(displayName);
        dto.setBaseWeight(baseWeight);
        dto.setEvidenceCount(list.size());

        if (list.isEmpty()) {
            dto.setHasEvidence(false);
            dto.setScore(null);
            dto.setTotalMarksObtained(0);
            dto.setTotalPossibleMarks(0);
            dto.setEffectiveWeight(0);
            return dto;
        }

        dto.setHasEvidence(true);
        double totalObtained = 0;
        double totalPossible = 0;

        for (Evidence e : list) {
            if (e.getMarksObtained() != null && e.getMaxMarks() != null && e.getMaxMarks() > 0) {
                totalObtained += e.getMarksObtained();
                totalPossible += e.getMaxMarks();
            } else if (e.getScore() != null) {
                totalObtained += e.getScore();
                totalPossible += 100.0;
            }
        }

        dto.setTotalMarksObtained(Math.round(totalObtained * 10.0) / 10.0);
        dto.setTotalPossibleMarks(Math.round(totalPossible * 10.0) / 10.0);

        if (totalPossible > 0) {
            double rawScore = (totalObtained / totalPossible) * 100.0;
            dto.setScore(Math.round(rawScore * 10.0) / 10.0);
        } else {
            dto.setScore(0.0);
        }

        return dto;
    }

    /**
     * Recalculates and updates UserSkill record from evidence.
     */
    @Transactional
    public UserSkill recalculateSkillScore(Long userId, String skillName) {
        SkillScoreBreakdownDTO breakdown = calculateSkillBreakdown(userId, skillName);

        UserSkill userSkill = userSkillRepository.findByUserIdAndSkillName(userId, skillName)
                .orElseGet(() -> {
                    UserSkill newSkill = new UserSkill();
                    newSkill.setUserId(userId);
                    newSkill.setSkillName(skillName);
                    return newSkill;
                });

        userSkill.setPerformanceScore(breakdown.getPerformanceScore());
        userSkill.setConfidence(breakdown.getDisplayConfidence());
        userSkill.setEvidenceStrength(breakdown.getEvidenceStrength());
        userSkill.setEvidenceCount(breakdown.getEvidenceCount());
        userSkill.setLastAssessedAt(breakdown.getLastAssessedAt());

        return userSkillRepository.save(userSkill);
    }

    /**
     * Recalculates all skills for a user.
     */
    @Transactional
    public List<UserSkill> recalculateAllSkillsForUser(Long userId) {
        List<UserSkill> skills = userSkillRepository.findByUserId(userId);
        List<UserSkill> updatedList = new ArrayList<>();

        for (UserSkill skill : skills) {
            UserSkill updated = recalculateSkillScore(userId, skill.getSkillName());
            updatedList.add(updated);
        }

        return updatedList;
    }

    /**
     * Generates a comprehensive performance & readiness summary for the user.
     *
     * OPTIMIZED: loads all evidence for the user in a SINGLE query and groups by
     * skill name in memory, eliminating the previous N-per-skill DB round trips.
     */
    public UserPerformanceSummaryDTO getUserPerformanceSummary(Long userId) {
        UserPerformanceSummaryDTO summary = new UserPerformanceSummaryDTO();
        summary.setUserId(userId);

        User user = userRepository.findById(userId).orElse(null);
        String career = (user != null && user.getCareer() != null && !user.getCareer().trim().isEmpty())
                ? user.getCareer().trim() : "Java Backend Developer";
        summary.setTargetCareer(career);

        List<UserSkill> userSkills = userSkillRepository.findByUserId(userId);
        summary.setTotalTrackedSkills(userSkills.size());

        // ── ONE query for all evidence, grouped in memory ─────────────────────
        List<Evidence> allEvidence = evidenceRepository.findByUserIdOrderByCreatedAtDesc(userId);
        Map<String, List<Evidence>> evidenceBySkill = new HashMap<>();
        for (Evidence e : allEvidence) {
            if (e.getSkillName() != null) {
                evidenceBySkill
                        .computeIfAbsent(e.getSkillName(), k -> new ArrayList<>())
                        .add(e);
            }
        }
        // ─────────────────────────────────────────────────────────────────────

        double totalScoreSum = 0;
        int assessedCount = 0;

        List<SkillScoreBreakdownDTO> breakdowns = new ArrayList<>();

        for (UserSkill s : userSkills) {
            // Use pre-loaded evidence list (no additional DB call).
            // Defensive fallback: if bulk lookup returned nothing, query per skill (e.g. legacy mocks or selective caching)
            List<Evidence> skillEvidence;
            if (evidenceBySkill.containsKey(s.getSkillName())) {
                skillEvidence = evidenceBySkill.get(s.getSkillName());
            } else if (allEvidence == null || allEvidence.isEmpty()) {
                skillEvidence = evidenceRepository.findByUserIdAndSkillNameOrderByCreatedAtDesc(userId, s.getSkillName());
            } else {
                skillEvidence = Collections.emptyList();
            }

            SkillScoreBreakdownDTO b = calculateSkillBreakdownFromEvidence(userId, s.getSkillName(), skillEvidence);
            breakdowns.add(b);

            if (b.getPerformanceScore() != null) {
                totalScoreSum += b.getPerformanceScore();
                assessedCount++;

                if ("Strong".equalsIgnoreCase(b.getEvidenceStrength())) {
                    summary.getStrongEvidenceSkills().add(s.getSkillName());
                } else if ("Moderate".equalsIgnoreCase(b.getEvidenceStrength())) {
                    summary.getModerateEvidenceSkills().add(s.getSkillName());
                } else {
                    summary.getLimitedEvidenceSkills().add(s.getSkillName());
                }

                if (b.getPerformanceScore() < 60.0) {
                    summary.getSkillsNeedingImprovement().add(s.getSkillName());
                }
            } else {
                summary.getNoEvidenceSkills().add(s.getSkillName());
            }
        }

        summary.setAssessedSkillsCount(assessedCount);
        summary.setSkillBreakdowns(breakdowns);

        if (assessedCount > 0) {
            summary.setOverallPerformanceScore(Math.round((totalScoreSum / assessedCount) * 10.0) / 10.0);
        } else {
            summary.setOverallPerformanceScore(null);
        }

        // Calculate Role-Based Readiness Score
        List<String> requiredSkills = CAREER_SKILLS_MAP.getOrDefault(career, Collections.emptyList());
        if (!requiredSkills.isEmpty()) {
            double requiredScoreSum = 0;
            for (String reqSkill : requiredSkills) {
                SkillScoreBreakdownDTO match = breakdowns.stream()
                        .filter(b -> b.getSkillName().equalsIgnoreCase(reqSkill))
                        .findFirst()
                        .orElse(null);

                if (match != null && match.getPerformanceScore() != null) {
                    requiredScoreSum += match.getPerformanceScore();
                }
            }
            summary.setReadinessScore(Math.round((requiredScoreSum / requiredSkills.size()) * 10.0) / 10.0);
        } else {
            summary.setReadinessScore(summary.getOverallPerformanceScore());
        }

        return summary;
    }

    /**
     * Same logic as calculateSkillBreakdown() but accepts a pre-loaded evidence list
     * so the caller can avoid one DB round-trip per skill.
     */
    public SkillScoreBreakdownDTO calculateSkillBreakdownFromEvidence(
            Long userId, String skillName, List<Evidence> evidenceList) {
        SkillScoreBreakdownDTO breakdown = new SkillScoreBreakdownDTO();
        breakdown.setUserId(userId);
        breakdown.setSkillName(skillName);

        List<Evidence> validEvidence = new ArrayList<>();
        LocalDateTime latestDate = null;

        for (Evidence e : evidenceList) {
            if (Boolean.FALSE.equals(e.getIsVerified())) continue;
            if (e.getMarksObtained() != null && e.getMaxMarks() != null) {
                if (e.getMarksObtained() < 0 || e.getMaxMarks() <= 0 || e.getMarksObtained() > e.getMaxMarks()) continue;
            } else if (e.getScore() == null || e.getScore() < 0 || e.getScore() > 100) {
                continue;
            }
            validEvidence.add(e);
            LocalDateTime assessmentDate = e.getAssessmentDate() != null ? e.getAssessmentDate() : e.getCreatedAt();
            if (assessmentDate != null && (latestDate == null || assessmentDate.isAfter(latestDate))) {
                latestDate = assessmentDate;
            }
        }

        breakdown.setEvidenceCount(validEvidence.size());
        breakdown.setLastAssessedAt(latestDate);

        Map<String, List<Evidence>> categoryMap = new HashMap<>();
        categoryMap.put(CAT_TESTS_AND_ASSIGNMENTS, new ArrayList<>());
        categoryMap.put(CAT_PROJECTS, new ArrayList<>());
        categoryMap.put(CAT_PRACTICAL_CODING, new ArrayList<>());
        categoryMap.put(CAT_LEARNING_PRACTICE, new ArrayList<>());

        for (Evidence e : validEvidence) {
            String cat = mapToCategory(e.getEvidenceType());
            categoryMap.get(cat).add(e);
        }

        List<CategoryScoreDTO> categoryDTOs = new ArrayList<>();
        List<String> availableCategories = new ArrayList<>();
        List<String> missingCategories = new ArrayList<>();
        double availableWeightSum = 0.0;

        CategoryScoreDTO testsCat = buildCategoryScore(CAT_TESTS_AND_ASSIGNMENTS, "Tests and Assignments", WEIGHT_TESTS_AND_ASSIGNMENTS, categoryMap.get(CAT_TESTS_AND_ASSIGNMENTS));
        categoryDTOs.add(testsCat);
        if (testsCat.isHasEvidence()) { availableCategories.add("Tests and Assignments"); availableWeightSum += testsCat.getBaseWeight(); }
        else { missingCategories.add("Tests and Assignments"); }

        CategoryScoreDTO projectsCat = buildCategoryScore(CAT_PROJECTS, "Projects", WEIGHT_PROJECTS, categoryMap.get(CAT_PROJECTS));
        categoryDTOs.add(projectsCat);
        if (projectsCat.isHasEvidence()) { availableCategories.add("Projects"); availableWeightSum += projectsCat.getBaseWeight(); }
        else { missingCategories.add("Projects"); }

        CategoryScoreDTO codingCat = buildCategoryScore(CAT_PRACTICAL_CODING, "Practical Coding Tasks", WEIGHT_PRACTICAL_CODING, categoryMap.get(CAT_PRACTICAL_CODING));
        categoryDTOs.add(codingCat);
        if (codingCat.isHasEvidence()) { availableCategories.add("Practical Coding Tasks"); availableWeightSum += codingCat.getBaseWeight(); }
        else { missingCategories.add("Practical Coding Tasks"); }

        CategoryScoreDTO practiceCat = buildCategoryScore(CAT_LEARNING_PRACTICE, "Learning & Practice Activities", WEIGHT_LEARNING_PRACTICE, categoryMap.get(CAT_LEARNING_PRACTICE));
        categoryDTOs.add(practiceCat);
        if (practiceCat.isHasEvidence()) { availableCategories.add("Learning & Practice Activities"); availableWeightSum += practiceCat.getBaseWeight(); }
        else { missingCategories.add("Learning & Practice Activities"); }

        breakdown.setCategories(categoryDTOs);
        breakdown.setAvailableCategories(availableCategories);
        breakdown.setMissingCategories(missingCategories);

        int totalValidEvidence = validEvidence.size();
        int categoriesRepresented = availableCategories.size();
        String strength;
        if (totalValidEvidence == 0) strength = "None";
        else if (totalValidEvidence <= 2 || categoriesRepresented == 1) strength = "Limited";
        else if (totalValidEvidence >= 4 && categoriesRepresented >= 3) strength = "Strong";
        else strength = "Moderate";
        breakdown.setEvidenceStrength(strength);

        if (availableWeightSum == 0.0 || totalValidEvidence == 0) {
            breakdown.setPerformanceScore(null);
            breakdown.setDisplayConfidence(0);
            breakdown.setHasSufficientEvidence(false);
            breakdown.setProvisional(false);
            breakdown.setStatusLabel("Not enough evidence yet");
            breakdown.setFormulaExplanation("No valid performance evidence recorded for this skill yet. Add tests, projects, coding problems, or practice to calculate your score.");
        } else {
            double weightedSum = 0.0;
            StringBuilder formulaBuilder = new StringBuilder("Score calculated as: (");
            boolean first = true;
            for (CategoryScoreDTO cat : categoryDTOs) {
                if (cat.isHasEvidence()) {
                    double effectiveWeight = cat.getBaseWeight() / availableWeightSum;
                    cat.setEffectiveWeight(Math.round(effectiveWeight * 1000.0) / 1000.0);
                    weightedSum += cat.getScore() * effectiveWeight;
                    if (!first) formulaBuilder.append(" + ");
                    formulaBuilder.append(String.format("%s: %.1f%% × %.1f%%", cat.getDisplayName(), cat.getScore(), effectiveWeight * 100.0));
                    first = false;
                } else {
                    cat.setEffectiveWeight(0.0);
                }
            }
            formulaBuilder.append(")");
            double finalScore = Math.round(weightedSum * 10.0) / 10.0;
            breakdown.setPerformanceScore(finalScore);
            int displayConf = (int) Math.round(finalScore);
            breakdown.setDisplayConfidence(displayConf);
            breakdown.setHasSufficientEvidence(true);
            breakdown.setProvisional(categoriesRepresented < 4);
            if (breakdown.isProvisional()) {
                formulaBuilder.append(String.format(" [Provisional: renormalized over %d/4 categories. Missing: %s]", categoriesRepresented, String.join(", ", missingCategories)));
            }
            breakdown.setFormulaExplanation(formulaBuilder.toString());
            if (displayConf >= 80) breakdown.setStatusLabel("STRONG");
            else if (displayConf >= 50) breakdown.setStatusLabel("DEVELOPING");
            else breakdown.setStatusLabel("BASIC");
        }

        return breakdown;
    }
}
