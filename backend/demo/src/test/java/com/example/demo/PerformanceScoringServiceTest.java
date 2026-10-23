package com.example.demo;

import com.example.demo.dto.CategoryScoreDTO;
import com.example.demo.dto.SkillScoreBreakdownDTO;
import com.example.demo.dto.UserPerformanceSummaryDTO;
import com.example.demo.repository.EvidenceRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.UserSkillRepository;
import com.example.demo.service.PerformanceScoringService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PerformanceScoringServiceTest {

    @Mock
    private EvidenceRepository evidenceRepository;

    @Mock
    private UserSkillRepository userSkillRepository;

    @Mock
    private UserRepository userRepository;

    private PerformanceScoringService scoringService;

    @BeforeEach
    void setUp() {
        scoringService = new PerformanceScoringService(evidenceRepository, userSkillRepository, userRepository);
    }

    private Evidence createEvidence(Long userId, String skill, String type, Double obtained, Double max, Boolean verified) {
        Evidence e = new Evidence();
        e.setUserId(userId);
        e.setSkillName(skill);
        e.setEvidenceType(type);
        e.setMarksObtained(obtained);
        e.setMaxMarks(max);
        if (obtained != null && max != null && max > 0) {
            e.setScore((int) Math.round((obtained / max) * 100.0));
        }
        e.setIsVerified(verified);
        e.setCreatedAt(LocalDateTime.now());
        e.setAssessmentDate(LocalDateTime.now());
        return e;
    }

    @Test
    @DisplayName("Scenario 1: User with no evidence returns null performance score and 'None' evidence strength")
    void testUserWithNoEvidence() {
        when(evidenceRepository.findByUserIdAndSkillNameOrderByCreatedAtDesc(1L, "Java"))
                .thenReturn(Collections.emptyList());

        SkillScoreBreakdownDTO breakdown = scoringService.calculateSkillBreakdown(1L, "Java");

        assertNull(breakdown.getPerformanceScore(), "Performance score should be null when no evidence exists");
        assertEquals(0, breakdown.getDisplayConfidence());
        assertEquals("None", breakdown.getEvidenceStrength());
        assertEquals(0, breakdown.getEvidenceCount());
        assertFalse(breakdown.isHasSufficientEvidence());
        assertEquals("Not enough evidence yet", breakdown.getStatusLabel());
        assertEquals(4, breakdown.getMissingCategories().size());
        assertTrue(breakdown.getAvailableCategories().isEmpty());
    }

    @Test
    @DisplayName("Scenario 2: User with one valid test result (85/100) renormalizes to 85.0% with 'Limited' evidence")
    void testUserWithOneValidTestResult() {
        Evidence testEvidence = createEvidence(1L, "Java", "assessment", 85.0, 100.0, true);
        when(evidenceRepository.findByUserIdAndSkillNameOrderByCreatedAtDesc(1L, "Java"))
                .thenReturn(Collections.singletonList(testEvidence));

        SkillScoreBreakdownDTO breakdown = scoringService.calculateSkillBreakdown(1L, "Java");

        assertNotNull(breakdown.getPerformanceScore());
        assertEquals(85.0, breakdown.getPerformanceScore(), 0.01);
        assertEquals(85, breakdown.getDisplayConfidence());
        assertEquals("Limited", breakdown.getEvidenceStrength(), "Single assessment must be 'Limited' evidence");
        assertEquals(1, breakdown.getEvidenceCount());
        assertTrue(breakdown.isProvisional(), "Score must be marked provisional when categories are missing");
        assertEquals(1, breakdown.getAvailableCategories().size());
        assertTrue(breakdown.getAvailableCategories().contains("Tests and Assignments"));
        assertEquals(3, breakdown.getMissingCategories().size());
    }

    @Test
    @DisplayName("Scenario 3: User with test and assignment results aggregates both into Tests & Assignments category")
    void testTestAndAssignmentCombinedWithoutDoubleCounting() {
        // Test: 40/50 (80%), Assignment: 45/50 (90%) -> Total 85/100 = 85.0%
        Evidence testEv = createEvidence(1L, "Java", "test", 40.0, 50.0, true);
        Evidence assignEv = createEvidence(1L, "Java", "assignment", 45.0, 50.0, true);

        when(evidenceRepository.findByUserIdAndSkillNameOrderByCreatedAtDesc(1L, "Java"))
                .thenReturn(Arrays.asList(testEv, assignEv));

        SkillScoreBreakdownDTO breakdown = scoringService.calculateSkillBreakdown(1L, "Java");

        CategoryScoreDTO cat = breakdown.getCategories().stream()
                .filter(c -> PerformanceScoringService.CAT_TESTS_AND_ASSIGNMENTS.equals(c.getCategoryKey()))
                .findFirst().orElseThrow();

        assertEquals(85.0, cat.getScore(), 0.01);
        assertEquals(85.0, cat.getTotalMarksObtained());
        assertEquals(100.0, cat.getTotalPossibleMarks());
        assertEquals(2, cat.getEvidenceCount());
        assertEquals(85.0, breakdown.getPerformanceScore(), 0.01);
    }

    @Test
    @DisplayName("Scenario 4: User with evidence in all 4 categories applies full 35-30-20-15 weights with 'Strong' evidence")
    void testAllFourEvidenceCategories() {
        // Tests (35% weight): 90%
        Evidence testEv = createEvidence(1L, "Java", "assessment", 90.0, 100.0, true);
        // Projects (30% weight): 80%
        Evidence projectEv = createEvidence(1L, "Java", "project", 80.0, 100.0, true);
        // Coding tasks (20% weight): 95%
        Evidence codingEv = createEvidence(1L, "Java", "problems", 95.0, 100.0, true);
        // Practice (15% weight): 70%
        Evidence practiceEv = createEvidence(1L, "Java", "practice", 70.0, 100.0, true);

        when(evidenceRepository.findByUserIdAndSkillNameOrderByCreatedAtDesc(1L, "Java"))
                .thenReturn(Arrays.asList(testEv, projectEv, codingEv, practiceEv));

        SkillScoreBreakdownDTO breakdown = scoringService.calculateSkillBreakdown(1L, "Java");

        // Expected score: 90*0.35 + 80*0.30 + 95*0.20 + 70*0.15 = 31.5 + 24.0 + 19.0 + 10.5 = 85.0
        assertNotNull(breakdown.getPerformanceScore());
        assertEquals(85.0, breakdown.getPerformanceScore(), 0.1);
        assertEquals(85, breakdown.getDisplayConfidence());
        assertEquals("Strong", breakdown.getEvidenceStrength());
        assertEquals(4, breakdown.getEvidenceCount());
        assertFalse(breakdown.isProvisional(), "All categories present so score is not provisional");
        assertTrue(breakdown.getMissingCategories().isEmpty());
    }

    @Test
    @DisplayName("Scenario 5: User with missing categories renormalizes available weights and marks provisional")
    void testRenormalizationWithMissingCategories() {
        // Only Projects (30% base weight) at 80% and Practical Coding (20% base weight) at 90%
        // Available weights = 0.30 + 0.20 = 0.50
        // Effective weights: Projects = 0.30/0.50 = 60%, Coding = 0.20/0.50 = 40%
        // Expected score: 80 * 0.60 + 90 * 0.40 = 48 + 36 = 84.0%
        Evidence projectEv = createEvidence(1L, "Java", "project", 80.0, 100.0, true);
        Evidence codingEv = createEvidence(1L, "Java", "problems", 90.0, 100.0, true);

        when(evidenceRepository.findByUserIdAndSkillNameOrderByCreatedAtDesc(1L, "Java"))
                .thenReturn(Arrays.asList(projectEv, codingEv));

        SkillScoreBreakdownDTO breakdown = scoringService.calculateSkillBreakdown(1L, "Java");

        assertNotNull(breakdown.getPerformanceScore());
        assertEquals(84.0, breakdown.getPerformanceScore(), 0.1);
        assertTrue(breakdown.isProvisional());
        assertEquals(2, breakdown.getMissingCategories().size());
        assertTrue(breakdown.getMissingCategories().contains("Tests and Assignments"));
        assertTrue(breakdown.getMissingCategories().contains("Learning & Practice Activities"));
    }

    @Test
    @DisplayName("Scenario 6: Invalid marks and non-positive maxMarks are skipped")
    void testInvalidMarksHandling() {
        Evidence validEv = createEvidence(1L, "Java", "assessment", 80.0, 100.0, true);
        Evidence negativeMarks = createEvidence(1L, "Java", "assessment", -10.0, 100.0, true);
        Evidence zeroMaxMarks = createEvidence(1L, "Java", "assessment", 50.0, 0.0, true);
        Evidence marksExceedingMax = createEvidence(1L, "Java", "assessment", 120.0, 100.0, true);

        when(evidenceRepository.findByUserIdAndSkillNameOrderByCreatedAtDesc(1L, "Java"))
                .thenReturn(Arrays.asList(validEv, negativeMarks, zeroMaxMarks, marksExceedingMax));

        SkillScoreBreakdownDTO breakdown = scoringService.calculateSkillBreakdown(1L, "Java");

        // Only the valid evidence should be processed
        assertEquals(1, breakdown.getEvidenceCount());
        assertEquals(80.0, breakdown.getPerformanceScore(), 0.01);
    }

    @Test
    @DisplayName("Scenario 7: Unverified evidence is not included in the score calculation")
    void testUnverifiedEvidenceIgnored() {
        Evidence verifiedEv = createEvidence(1L, "Java", "assessment", 80.0, 100.0, true);
        Evidence unverifiedEv = createEvidence(1L, "Java", "assessment", 100.0, 100.0, false);

        when(evidenceRepository.findByUserIdAndSkillNameOrderByCreatedAtDesc(1L, "Java"))
                .thenReturn(Arrays.asList(verifiedEv, unverifiedEv));

        SkillScoreBreakdownDTO breakdown = scoringService.calculateSkillBreakdown(1L, "Java");

        assertEquals(1, breakdown.getEvidenceCount());
        assertEquals(80.0, breakdown.getPerformanceScore(), 0.01);
    }

    @Test
    @DisplayName("Scenario 8: Evidence for one skill does not leak into another skill")
    void testSkillIsolation() {
        Evidence javaEv = createEvidence(1L, "Java", "project", 100.0, 100.0, true);

        when(evidenceRepository.findByUserIdAndSkillNameOrderByCreatedAtDesc(1L, "Java"))
                .thenReturn(Collections.singletonList(javaEv));
        when(evidenceRepository.findByUserIdAndSkillNameOrderByCreatedAtDesc(1L, "SQL"))
                .thenReturn(Collections.emptyList());

        SkillScoreBreakdownDTO javaBreakdown = scoringService.calculateSkillBreakdown(1L, "Java");
        SkillScoreBreakdownDTO sqlBreakdown = scoringService.calculateSkillBreakdown(1L, "SQL");

        assertNotNull(javaBreakdown.getPerformanceScore());
        assertEquals(100.0, javaBreakdown.getPerformanceScore(), 0.01);

        assertNull(sqlBreakdown.getPerformanceScore(), "SQL must have null score when it has no evidence");
        assertEquals("None", sqlBreakdown.getEvidenceStrength());
    }

    @Test
    @DisplayName("Scenario 9: Multiple users records remain strictly isolated")
    void testUserIsolation() {
        Evidence user1Evidence = createEvidence(1L, "Java", "assessment", 90.0, 100.0, true);

        when(evidenceRepository.findByUserIdAndSkillNameOrderByCreatedAtDesc(1L, "Java"))
                .thenReturn(Collections.singletonList(user1Evidence));
        when(evidenceRepository.findByUserIdAndSkillNameOrderByCreatedAtDesc(2L, "Java"))
                .thenReturn(Collections.emptyList());

        SkillScoreBreakdownDTO user1Breakdown = scoringService.calculateSkillBreakdown(1L, "Java");
        SkillScoreBreakdownDTO user2Breakdown = scoringService.calculateSkillBreakdown(2L, "Java");

        assertEquals(90.0, user1Breakdown.getPerformanceScore(), 0.01);
        assertNull(user2Breakdown.getPerformanceScore());
    }

    @Test
    @DisplayName("Scenario 10: recalculateSkillScore persists calculated score and evidence strength to UserSkill")
    void testRecalculateSkillScorePersists() {
        Evidence ev = createEvidence(1L, "Java", "assessment", 88.0, 100.0, true);
        when(evidenceRepository.findByUserIdAndSkillNameOrderByCreatedAtDesc(1L, "Java"))
                .thenReturn(Collections.singletonList(ev));

        UserSkill existing = new UserSkill();
        existing.setId(10L);
        existing.setUserId(1L);
        existing.setSkillName("Java");

        when(userSkillRepository.findByUserIdAndSkillName(1L, "Java"))
                .thenReturn(Optional.of(existing));
        when(userSkillRepository.save(any(UserSkill.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        UserSkill result = scoringService.recalculateSkillScore(1L, "Java");

        assertNotNull(result);
        assertEquals(88.0, result.getPerformanceScore());
        assertEquals(88, result.getConfidence());
        assertEquals("Limited", result.getEvidenceStrength());
        assertEquals(1, result.getEvidenceCount());
        verify(userSkillRepository, times(1)).save(existing);
    }

    @Test
    @DisplayName("Scenario 11: Overall performance summary and target career readiness computation")
    void testUserPerformanceSummary() {
        User user = new User();
        user.setId(1L);
        user.setCareer("Java Backend Developer");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        UserSkill skill1 = new UserSkill();
        skill1.setUserId(1L);
        skill1.setSkillName("Java Fundamentals");
        skill1.setConfidence(90);

        UserSkill skill2 = new UserSkill();
        skill2.setUserId(1L);
        skill2.setSkillName("SQL");
        skill2.setConfidence(80);

        when(userSkillRepository.findByUserId(1L)).thenReturn(Arrays.asList(skill1, skill2));

        Evidence ev1 = createEvidence(1L, "Java Fundamentals", "assessment", 90.0, 100.0, true);
        when(evidenceRepository.findByUserIdAndSkillNameOrderByCreatedAtDesc(1L, "Java Fundamentals"))
                .thenReturn(Collections.singletonList(ev1));

        Evidence ev2 = createEvidence(1L, "SQL", "assessment", 80.0, 100.0, true);
        when(evidenceRepository.findByUserIdAndSkillNameOrderByCreatedAtDesc(1L, "SQL"))
                .thenReturn(Collections.singletonList(ev2));

        UserPerformanceSummaryDTO summary = scoringService.getUserPerformanceSummary(1L);

        assertNotNull(summary);
        assertEquals(2, summary.getTotalTrackedSkills());
        assertEquals(2, summary.getAssessedSkillsCount());
        // Overall average: (90 + 80) / 2 = 85.0
        assertEquals(85.0, summary.getOverallPerformanceScore(), 0.01);
        // Java Backend Developer requires 7 skills: Java Fundamentals(90), OOP(0), Data Structures(0), SQL(80), REST API(0), Spring Boot(0), Git(0)
        // Readiness = (90 + 80) / 7 = 170 / 7 = 24.3
        assertEquals(24.3, summary.getReadinessScore(), 0.1);
    }
}
