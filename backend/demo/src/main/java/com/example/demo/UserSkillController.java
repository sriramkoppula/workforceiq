package com.example.demo;

import com.example.demo.dto.SkillScoreBreakdownDTO;
import com.example.demo.dto.UserPerformanceSummaryDTO;
import com.example.demo.repository.UserSkillRepository;
import com.example.demo.service.PerformanceScoringService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-skills")
public class UserSkillController {

    private final UserSkillRepository userSkillRepository;
    private final PerformanceScoringService performanceScoringService;

    public UserSkillController(UserSkillRepository userSkillRepository,
                               PerformanceScoringService performanceScoringService) {
        this.userSkillRepository = userSkillRepository;
        this.performanceScoringService = performanceScoringService;
    }


    // ==========================================
    // GET ALL SKILLS FOR USER
    // ==========================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserSkill>> getUserSkills(@PathVariable Long userId) {
        return ResponseEntity.ok(
                userSkillRepository.findByUserId(userId)
        );
    }


    // ==========================================
    // ADD NEW SKILL (Manual Confidence Removed)
    // ==========================================

    @PostMapping
    public ResponseEntity<?> addSkill(@RequestBody UserSkill skill) {

        if (skill.getUserId() == null) {
            return ResponseEntity.badRequest().body("User ID is required");
        }

        if (skill.getSkillName() == null || skill.getSkillName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Skill name is required");
        }

        String skillName = skill.getSkillName().trim();
        skill.setSkillName(skillName);

        /*
         * Do not create duplicate skills.
         */
        if (userSkillRepository.findByUserIdAndSkillName(skill.getUserId(), skillName).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Skill already exists in your profile.");
        }

        // Calculate performance score automatically from recorded evidence
        SkillScoreBreakdownDTO breakdown = performanceScoringService.calculateSkillBreakdown(
                skill.getUserId(), skillName
        );

        skill.setPerformanceScore(breakdown.getPerformanceScore());
        skill.setConfidence(breakdown.getDisplayConfidence());
        skill.setEvidenceStrength(breakdown.getEvidenceStrength());
        skill.setEvidenceCount(breakdown.getEvidenceCount());
        skill.setLastAssessedAt(breakdown.getLastAssessedAt());

        UserSkill savedSkill = userSkillRepository.save(skill);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedSkill);
    }


    // ==========================================
    // UPDATE SKILL / RECALCULATE
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSkill(
            @PathVariable Long id,
            @RequestBody(required = false) UserSkill skillData) {

        UserSkill existingSkill = userSkillRepository.findById(id).orElse(null);

        if (existingSkill == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Skill not found");
        }

        // Automatically recalculate from evidence
        UserSkill updatedSkill = performanceScoringService.recalculateSkillScore(
                existingSkill.getUserId(), existingSkill.getSkillName()
        );

        return ResponseEntity.ok(updatedSkill);
    }


    // ==========================================
    // GET SKILL SCORE BREAKDOWN & EXPLANATION
    // ==========================================

    @GetMapping({"/user/{userId}/skill/{skillName}/breakdown", "/user/{userId}/skill-breakdown"})
    public ResponseEntity<?> getSkillBreakdown(
            @PathVariable Long userId,
            @PathVariable(required = false) String skillName,
            @RequestParam(value = "skill", required = false) String skillParam) {

        String effectiveSkill = (skillName != null && !skillName.trim().isEmpty())
                ? skillName.trim()
                : (skillParam != null ? skillParam.trim() : "");

        if (effectiveSkill.isEmpty()) {
            return ResponseEntity.badRequest().body("Skill name is required");
        }

        SkillScoreBreakdownDTO breakdown = performanceScoringService.calculateSkillBreakdown(
                userId, effectiveSkill
        );

        return ResponseEntity.ok(breakdown);
    }


    // ==========================================
    // GET OVERALL PERFORMANCE & READINESS SUMMARY
    // ==========================================

    @GetMapping("/user/{userId}/performance-summary")
    public ResponseEntity<UserPerformanceSummaryDTO> getUserPerformanceSummary(
            @PathVariable Long userId) {

        UserPerformanceSummaryDTO summary = performanceScoringService.getUserPerformanceSummary(userId);
        return ResponseEntity.ok(summary);
    }


    // ==========================================
    // RECALCULATE ALL SKILLS FOR USER
    // ==========================================

    @PostMapping("/user/{userId}/recalculate")
    public ResponseEntity<List<UserSkill>> recalculateAllSkills(
            @PathVariable Long userId) {

        List<UserSkill> updatedList = performanceScoringService.recalculateAllSkillsForUser(userId);
        return ResponseEntity.ok(updatedList);
    }


    // ==========================================
    // DELETE SKILL
    // ==========================================

    @DeleteMapping("/user/{userId}/skill/{skillName}")
    public ResponseEntity<?> deleteSkill(
            @PathVariable Long userId,
            @PathVariable String skillName) {

        UserSkill existingSkill = userSkillRepository
                .findByUserIdAndSkillName(userId, skillName)
                .orElse(null);

        if (existingSkill == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Skill not found");
        }

        userSkillRepository.delete(existingSkill);

        return ResponseEntity.ok("Skill deleted successfully");
    }
}