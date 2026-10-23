package com.example.demo;

import com.example.demo.dto.SkillScoreBreakdownDTO;
import com.example.demo.repository.EvidenceRepository;
import com.example.demo.service.PerformanceScoringService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/evidence")
public class EvidenceController {

    private final EvidenceRepository evidenceRepository;
    private final PerformanceScoringService performanceScoringService;

    public EvidenceController(EvidenceRepository evidenceRepository,
                              PerformanceScoringService performanceScoringService) {
        this.evidenceRepository = evidenceRepository;
        this.performanceScoringService = performanceScoringService;
    }

    @PostMapping
    public ResponseEntity<?> addEvidence(@RequestBody Evidence evidence) {

        if (evidence.getUserId() == null) {
            return ResponseEntity.badRequest().body("User ID is required");
        }

        if (evidence.getSkillName() == null || evidence.getSkillName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Skill name is required");
        }

        if (evidence.getEvidenceType() == null || evidence.getEvidenceType().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Evidence type is required");
        }

        // Validate Marks and Score
        if (evidence.getMarksObtained() != null || evidence.getMaxMarks() != null) {
            if (evidence.getMarksObtained() == null || evidence.getMarksObtained() < 0) {
                return ResponseEntity.badRequest().body("Marks obtained must be non-negative");
            }
            if (evidence.getMaxMarks() == null || evidence.getMaxMarks() <= 0) {
                return ResponseEntity.badRequest().body("Maximum marks must be greater than zero");
            }
            if (evidence.getMarksObtained() > evidence.getMaxMarks()) {
                return ResponseEntity.badRequest().body("Marks obtained cannot exceed maximum marks");
            }
            int calculatedScore = (int) Math.round((evidence.getMarksObtained() / evidence.getMaxMarks()) * 100.0);
            evidence.setScore(calculatedScore);
        } else {
            if (evidence.getScore() == null) {
                return ResponseEntity.badRequest().body("Evidence score or marks are required");
            }
            if (evidence.getScore() < 0 || evidence.getScore() > 100) {
                return ResponseEntity.badRequest().body("Evidence score must be between 0 and 100");
            }
            evidence.setMarksObtained(evidence.getScore().doubleValue());
            evidence.setMaxMarks(100.0);
        }

        if (evidence.getIsVerified() == null) {
            evidence.setIsVerified(true);
        }

        Evidence savedEvidence = evidenceRepository.save(evidence);

        // Automatically recalculate performance score for this skill
        UserSkill updatedSkill = performanceScoringService.recalculateSkillScore(
                savedEvidence.getUserId(), savedEvidence.getSkillName()
        );
        SkillScoreBreakdownDTO breakdown = performanceScoringService.calculateSkillBreakdown(
                savedEvidence.getUserId(), savedEvidence.getSkillName()
        );

        Map<String, Object> response = new HashMap<>();
        response.put("evidence", savedEvidence);
        response.put("userSkill", updatedSkill);
        response.put("breakdown", breakdown);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvidence(@PathVariable Long id, @RequestBody Evidence updated) {
        Evidence existing = evidenceRepository.findById(id).orElse(null);
        if (existing == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Evidence not found");
        }

        if (updated.getTitle() != null) {
            existing.setTitle(updated.getTitle());
        }
        if (updated.getEvidenceType() != null && !updated.getEvidenceType().trim().isEmpty()) {
            existing.setEvidenceType(updated.getEvidenceType());
        }
        if (updated.getDescription() != null) {
            existing.setDescription(updated.getDescription());
        }
        if (updated.getEvidenceUrl() != null) {
            existing.setEvidenceUrl(updated.getEvidenceUrl());
        }
        if (updated.getIsVerified() != null) {
            existing.setIsVerified(updated.getIsVerified());
        }

        if (updated.getMarksObtained() != null || updated.getMaxMarks() != null) {
            Double marks = updated.getMarksObtained() != null ? updated.getMarksObtained() : existing.getMarksObtained();
            Double maxMarks = updated.getMaxMarks() != null ? updated.getMaxMarks() : existing.getMaxMarks();
            if (marks == null || marks < 0) {
                return ResponseEntity.badRequest().body("Marks obtained must be non-negative");
            }
            if (maxMarks == null || maxMarks <= 0) {
                return ResponseEntity.badRequest().body("Maximum marks must be greater than zero");
            }
            if (marks > maxMarks) {
                return ResponseEntity.badRequest().body("Marks obtained cannot exceed maximum marks");
            }
            existing.setMarksObtained(marks);
            existing.setMaxMarks(maxMarks);
            existing.setScore((int) Math.round((marks / maxMarks) * 100.0));
        } else if (updated.getScore() != null) {
            if (updated.getScore() < 0 || updated.getScore() > 100) {
                return ResponseEntity.badRequest().body("Evidence score must be between 0 and 100");
            }
            existing.setScore(updated.getScore());
            existing.setMarksObtained(updated.getScore().doubleValue());
            existing.setMaxMarks(100.0);
        }

        Evidence saved = evidenceRepository.save(existing);
        UserSkill updatedSkill = performanceScoringService.recalculateSkillScore(saved.getUserId(), saved.getSkillName());
        SkillScoreBreakdownDTO breakdown = performanceScoringService.calculateSkillBreakdown(saved.getUserId(), saved.getSkillName());

        Map<String, Object> response = new HashMap<>();
        response.put("evidence", saved);
        response.put("userSkill", updatedSkill);
        response.put("breakdown", breakdown);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Evidence>> getUserEvidence(@PathVariable Long userId) {
        return ResponseEntity.ok(
                evidenceRepository.findByUserIdOrderByCreatedAtDesc(userId)
        );
    }

    @GetMapping("/user/{userId}/skill/{skillName}")
    public ResponseEntity<List<Evidence>> getSkillEvidence(
            @PathVariable Long userId,
            @PathVariable String skillName) {

        return ResponseEntity.ok(
                evidenceRepository.findByUserIdAndSkillNameOrderByCreatedAtDesc(
                        userId, skillName
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvidence(@PathVariable Long id) {
        Evidence evidence = evidenceRepository.findById(id).orElse(null);
        if (evidence == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Evidence not found");
        }

        Long userId = evidence.getUserId();
        String skillName = evidence.getSkillName();

        evidenceRepository.delete(evidence);

        // Recalculate score after deleting evidence
        UserSkill updatedSkill = performanceScoringService.recalculateSkillScore(userId, skillName);
        SkillScoreBreakdownDTO breakdown = performanceScoringService.calculateSkillBreakdown(userId, skillName);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Evidence deleted successfully");
        response.put("userSkill", updatedSkill);
        response.put("breakdown", breakdown);

        return ResponseEntity.ok(response);
    }
}