package com.example.demo;

import com.example.demo.dto.SkillScoreBreakdownDTO;
import com.example.demo.repository.EvidenceRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.UserSkillRepository;
import com.example.demo.service.PerformanceScoringService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = {UserSkillController.class, EvidenceController.class})
public class PerformanceControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserSkillRepository userSkillRepository;

    @MockBean
    private EvidenceRepository evidenceRepository;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private PerformanceScoringService performanceScoringService;

    @Test
    @DisplayName("POST /api/user-skills succeeds without requiring manual confidence")
    void testAddSkillWithoutManualConfidence() throws Exception {
        when(userSkillRepository.findByUserIdAndSkillName(1L, "Java Fundamentals"))
                .thenReturn(Optional.empty());

        SkillScoreBreakdownDTO breakdown = new SkillScoreBreakdownDTO();
        breakdown.setPerformanceScore(null);
        breakdown.setDisplayConfidence(0);
        breakdown.setEvidenceStrength("None");
        breakdown.setEvidenceCount(0);

        when(performanceScoringService.calculateSkillBreakdown(1L, "Java Fundamentals"))
                .thenReturn(breakdown);

        UserSkill saved = new UserSkill();
        saved.setId(101L);
        saved.setUserId(1L);
        saved.setSkillName("Java Fundamentals");
        saved.setConfidence(0);
        saved.setEvidenceStrength("None");

        when(userSkillRepository.save(any(UserSkill.class))).thenReturn(saved);

        mockMvc.perform(post("/api/user-skills")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"userId\": 1, \"skillName\": \"Java Fundamentals\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(101))
                .andExpect(jsonPath("$.skillName").value("Java Fundamentals"))
                .andExpect(jsonPath("$.evidenceStrength").value("None"));
    }

    @Test
    @DisplayName("POST /api/evidence rejects invalid marks where marks obtained exceeds max marks")
    void testRejectInvalidMarks() throws Exception {
        mockMvc.perform(post("/api/evidence")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"userId\": 1, \"skillName\": \"Java\", \"evidenceType\": \"assessment\", \"marksObtained\": 120, \"maxMarks\": 100}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Marks obtained cannot exceed maximum marks"));
    }

    @Test
    @DisplayName("POST /api/evidence rejects non-positive max marks")
    void testRejectZeroMaxMarks() throws Exception {
        mockMvc.perform(post("/api/evidence")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"userId\": 1, \"skillName\": \"Java\", \"evidenceType\": \"assessment\", \"marksObtained\": 10, \"maxMarks\": 0}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Maximum marks must be greater than zero"));
    }

    @Test
    @DisplayName("POST /api/evidence accepts valid marks and returns updated breakdown")
    void testAddEvidenceCalculatesScore() throws Exception {
        Evidence saved = new Evidence();
        saved.setId(50L);
        saved.setUserId(1L);
        saved.setSkillName("Java");
        saved.setEvidenceType("assessment");
        saved.setMarksObtained(85.0);
        saved.setMaxMarks(100.0);
        saved.setScore(85);

        when(evidenceRepository.save(any(Evidence.class))).thenReturn(saved);

        UserSkill updatedSkill = new UserSkill();
        updatedSkill.setId(1L);
        updatedSkill.setUserId(1L);
        updatedSkill.setSkillName("Java");
        updatedSkill.setConfidence(85);
        updatedSkill.setPerformanceScore(85.0);
        updatedSkill.setEvidenceStrength("Limited");

        when(performanceScoringService.recalculateSkillScore(1L, "Java")).thenReturn(updatedSkill);

        SkillScoreBreakdownDTO breakdown = new SkillScoreBreakdownDTO();
        breakdown.setPerformanceScore(85.0);
        breakdown.setDisplayConfidence(85);
        breakdown.setEvidenceStrength("Limited");
        when(performanceScoringService.calculateSkillBreakdown(1L, "Java")).thenReturn(breakdown);

        mockMvc.perform(post("/api/evidence")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"userId\": 1, \"skillName\": \"Java\", \"evidenceType\": \"assessment\", \"marksObtained\": 85, \"maxMarks\": 100}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.evidence.score").value(85))
                .andExpect(jsonPath("$.userSkill.performanceScore").value(85.0))
                .andExpect(jsonPath("$.breakdown.evidenceStrength").value("Limited"));
    }

    @Test
    @DisplayName("GET /api/user-skills/user/{userId}/skill/{skillName}/breakdown returns score breakdown")
    void testGetSkillBreakdown() throws Exception {
        SkillScoreBreakdownDTO breakdown = new SkillScoreBreakdownDTO();
        breakdown.setUserId(1L);
        breakdown.setSkillName("Java");
        breakdown.setPerformanceScore(82.5);
        breakdown.setEvidenceStrength("Moderate");

        when(performanceScoringService.calculateSkillBreakdown(1L, "Java")).thenReturn(breakdown);

        mockMvc.perform(get("/api/user-skills/user/1/skill/Java/breakdown"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.performanceScore").value(82.5))
                .andExpect(jsonPath("$.evidenceStrength").value("Moderate"));
    }
}
