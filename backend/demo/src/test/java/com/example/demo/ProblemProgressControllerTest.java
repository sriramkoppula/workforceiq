package com.example.demo;

import com.example.demo.dto.ProblemSubmissionDTO;
import com.example.demo.dto.SkillScoreBreakdownDTO;
import com.example.demo.repository.EvidenceRepository;
import com.example.demo.repository.ProblemProgressRepository;
import com.example.demo.service.PerformanceScoringService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProblemProgressControllerTest {

    @Mock
    private ProblemProgressRepository problemProgressRepository;

    @Mock
    private EvidenceRepository evidenceRepository;

    @Mock
    private PerformanceScoringService performanceScoringService;

    @InjectMocks
    private ProblemProgressController controller;

    private ProblemProgress existingProgress;

    @BeforeEach
    void setUp() {
        existingProgress = new ProblemProgress(1L, "dsa-arr-01", "Data Structures", "Arrays and strings");
    }

    @Test
    @DisplayName("Status update to IN_PROGRESS does not mark completed or record evidence")
    void testStatusUpdate() {
        when(problemProgressRepository.findByUserIdAndProblemId(1L, "dsa-arr-01"))
                .thenReturn(Optional.of(existingProgress));
        when(problemProgressRepository.save(any(ProblemProgress.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        Map<String, Object> body = new HashMap<>();
        body.put("userId", 1L);
        body.put("problemId", "dsa-arr-01");
        body.put("status", "IN_PROGRESS");

        ResponseEntity<?> response = controller.updateStatus(body);
        assertEquals(200, response.getStatusCode().value());
        ProblemProgress result = (ProblemProgress) response.getBody();
        assertNotNull(result);
        assertEquals("IN_PROGRESS", result.getStatus());
        assertNull(result.getCompletedAt());
        assertNull(result.getScore());

        verify(evidenceRepository, never()).save(any());
        verify(performanceScoringService, never()).recalculateSkillScore(any(), any());
    }

    @Test
    @DisplayName("Failed submission increments attempts, updates code, does not mark COMPLETED")
    void testFailedSubmission() {
        when(problemProgressRepository.findByUserIdAndProblemId(1L, "dsa-arr-01"))
                .thenReturn(Optional.of(existingProgress));
        when(problemProgressRepository.save(any(ProblemProgress.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        ProblemSubmissionDTO dto = new ProblemSubmissionDTO();
        dto.setUserId(1L);
        dto.setProblemId("dsa-arr-01");
        dto.setSkillName("Data Structures");
        dto.setTopicName("Arrays and strings");
        dto.setSolutionCode("public int[] twoSum() { return new int[]{0,0}; }");
        dto.setPassed(false);
        dto.setScore(40.0);
        dto.setTestCasesPassed(2);
        dto.setTotalTestCases(5);

        ResponseEntity<?> response = controller.submitSolution(dto);
        assertEquals(200, response.getStatusCode().value());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertNotNull(body);
        assertEquals(false, body.get("passed"));
        assertEquals(false, body.get("evidenceRecorded"));

        ProblemProgress saved = (ProblemProgress) body.get("progress");
        assertEquals("IN_PROGRESS", saved.getStatus());
        assertEquals(1, saved.getAttempts());
        assertNull(saved.getCompletedAt());

        verify(evidenceRepository, never()).save(any());
    }

    @Test
    @DisplayName("Successful submission marks COMPLETED, records Practical Coding evidence, recalculates score")
    void testSuccessfulSubmissionWithEvidence() {
        when(problemProgressRepository.findByUserIdAndProblemId(1L, "dsa-arr-01"))
                .thenReturn(Optional.of(existingProgress));
        when(problemProgressRepository.save(any(ProblemProgress.class)))
                .thenAnswer(inv -> inv.getArgument(0));
        when(evidenceRepository.findByUserIdAndSkillNameOrderByCreatedAtDesc(1L, "Data Structures"))
                .thenReturn(Collections.emptyList());

        SkillScoreBreakdownDTO breakdown = new SkillScoreBreakdownDTO();
        breakdown.setPerformanceScore(85.0);
        breakdown.setDisplayConfidence(85);
        when(performanceScoringService.calculateSkillBreakdown(1L, "Data Structures")).thenReturn(breakdown);

        ProblemSubmissionDTO dto = new ProblemSubmissionDTO();
        dto.setUserId(1L);
        dto.setProblemId("dsa-arr-01");
        dto.setProblemTitle("Two Sum - Pair Indices");
        dto.setSkillName("Data Structures");
        dto.setTopicName("Arrays and strings");
        dto.setSolutionCode("public int[] twoSum(int[] nums, int target) { ... }");
        dto.setPassed(true);
        dto.setScore(100.0);
        dto.setTestCasesPassed(5);
        dto.setTotalTestCases(5);
        dto.setRecordEvidence(true);

        ResponseEntity<?> response = controller.submitSolution(dto);
        assertEquals(200, response.getStatusCode().value());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertNotNull(body);
        assertEquals(true, body.get("passed"));
        assertEquals(true, body.get("evidenceRecorded"));

        ProblemProgress saved = (ProblemProgress) body.get("progress");
        assertEquals("COMPLETED", saved.getStatus());
        assertEquals(100.0, saved.getScore());
        assertNotNull(saved.getCompletedAt());
        assertEquals(1, saved.getAttempts());

        // Verify Evidence was created with type 'problems' (which maps to Practical Coding)
        ArgumentCaptor<Evidence> evCaptor = ArgumentCaptor.forClass(Evidence.class);
        verify(evidenceRepository, times(1)).save(evCaptor.capture());
        Evidence captured = evCaptor.getValue();
        assertEquals(1L, captured.getUserId());
        assertEquals("Data Structures", captured.getSkillName());
        assertEquals("problems", captured.getEvidenceType());
        assertEquals(100.0, captured.getMarksObtained());
        assertEquals(100.0, captured.getMaxMarks());
        assertTrue(captured.getIsVerified());
        assertTrue(captured.getTitle().contains("Two Sum - Pair Indices"));

        // Verify score recalculation was called
        verify(performanceScoringService, times(1)).recalculateSkillScore(1L, "Data Structures");
    }

    @Test
    @DisplayName("Re-submitting completed problem updates existing evidence rather than duplicating")
    void testReSubmissionUpdatesExistingEvidence() {
        existingProgress.setStatus("COMPLETED");
        existingProgress.setScore(90.0);
        existingProgress.setAttempts(1);

        Evidence existingEv = new Evidence();
        existingEv.setId(10L);
        existingEv.setUserId(1L);
        existingEv.setSkillName("Data Structures");
        existingEv.setTitle("Must-Learn: Two Sum - Pair Indices");
        existingEv.setMarksObtained(90.0);
        existingEv.setMaxMarks(100.0);

        when(problemProgressRepository.findByUserIdAndProblemId(1L, "dsa-arr-01"))
                .thenReturn(Optional.of(existingProgress));
        when(problemProgressRepository.save(any(ProblemProgress.class)))
                .thenAnswer(inv -> inv.getArgument(0));
        when(evidenceRepository.findByUserIdAndSkillNameOrderByCreatedAtDesc(1L, "Data Structures"))
                .thenReturn(Collections.singletonList(existingEv));

        ProblemSubmissionDTO dto = new ProblemSubmissionDTO();
        dto.setUserId(1L);
        dto.setProblemId("dsa-arr-01");
        dto.setProblemTitle("Two Sum - Pair Indices");
        dto.setSkillName("Data Structures");
        dto.setTopicName("Arrays and strings");
        dto.setPassed(true);
        dto.setScore(100.0);
        dto.setTestCasesPassed(5);
        dto.setTotalTestCases(5);

        ResponseEntity<?> response = controller.submitSolution(dto);
        assertEquals(200, response.getStatusCode().value());

        // Check that attempts was incremented to 2
        assertEquals(2, existingProgress.getAttempts());
        assertEquals(100.0, existingProgress.getScore());

        // Evidence was updated, not newly created
        ArgumentCaptor<Evidence> evCaptor = ArgumentCaptor.forClass(Evidence.class);
        verify(evidenceRepository, times(1)).save(evCaptor.capture());
        assertEquals(10L, evCaptor.getValue().getId());
        assertEquals(100.0, evCaptor.getValue().getMarksObtained());
    }
}
