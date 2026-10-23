package com.example.demo;

import com.example.demo.dto.ProblemSubmissionDTO;
import com.example.demo.dto.SkillScoreBreakdownDTO;
import com.example.demo.repository.EvidenceRepository;
import com.example.demo.repository.ProblemProgressRepository;
import com.example.demo.service.PerformanceScoringService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/problem-progress")
public class ProblemProgressController {

    private final ProblemProgressRepository problemProgressRepository;
    private final EvidenceRepository evidenceRepository;
    private final PerformanceScoringService performanceScoringService;

    public ProblemProgressController(ProblemProgressRepository problemProgressRepository,
                                     EvidenceRepository evidenceRepository,
                                     PerformanceScoringService performanceScoringService) {
        this.problemProgressRepository = problemProgressRepository;
        this.evidenceRepository = evidenceRepository;
        this.performanceScoringService = performanceScoringService;
    }

    // ==========================================
    // GET USER PROBLEM PROGRESS
    // ==========================================
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProblemProgress>> getUserProgress(@PathVariable Long userId) {
        return ResponseEntity.ok(problemProgressRepository.findByUserId(userId));
    }

    // ==========================================
    // GET BY USER AND SKILL
    // ==========================================
    @GetMapping("/user/{userId}/skill/{skillName}")
    public ResponseEntity<List<ProblemProgress>> getUserSkillProgress(
            @PathVariable Long userId,
            @PathVariable String skillName) {
        return ResponseEntity.ok(problemProgressRepository.findByUserIdAndSkillName(userId, skillName));
    }

    // ==========================================
    // GET SPECIFIC PROBLEM PROGRESS
    // ==========================================
    @GetMapping("/user/{userId}/problem/{problemId}")
    public ResponseEntity<?> getSpecificProblemProgress(
            @PathVariable Long userId,
            @PathVariable String problemId) {
        return problemProgressRepository.findByUserIdAndProblemId(userId, problemId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok(new ProblemProgress(userId, problemId, "", "")));
    }

    // ==========================================
    // DELETE PROGRESS BY ID
    // ==========================================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProgress(@PathVariable Long id) {
        if (!problemProgressRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        problemProgressRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // ==========================================
    // UPDATE STATUS (e.g. IN_PROGRESS on start/view)
    // NOTE: Does NOT count as completed and does NOT affect score
    // ==========================================
    @PostMapping("/status")
    public ResponseEntity<?> updateStatus(@RequestBody Map<String, Object> body) {
        if (!body.containsKey("userId") || !body.containsKey("problemId")) {
            return ResponseEntity.badRequest().body("userId and problemId are required");
        }

        Long userId = Long.valueOf(body.get("userId").toString());
        String problemId = (String) body.get("problemId");
        String skillName = body.containsKey("skillName") ? (String) body.get("skillName") : "";
        String topicName = body.containsKey("topicName") ? (String) body.get("topicName") : "";
        String newStatus = body.containsKey("status") ? (String) body.get("status") : "IN_PROGRESS";

        ProblemProgress progress = problemProgressRepository.findByUserIdAndProblemId(userId, problemId)
                .orElseGet(() -> new ProblemProgress(userId, problemId, skillName, topicName));

        // Only change to IN_PROGRESS if not already COMPLETED
        if (!"COMPLETED".equalsIgnoreCase(progress.getStatus())) {
            progress.setStatus(newStatus);
        }
        if (skillName != null && !skillName.trim().isEmpty()) {
            progress.setSkillName(skillName);
        }
        if (topicName != null && !topicName.trim().isEmpty()) {
            progress.setTopicName(topicName);
        }
        progress.setLastActivityAt(LocalDateTime.now());

        ProblemProgress saved = problemProgressRepository.save(progress);
        return ResponseEntity.ok(saved);
    }

    // ==========================================
    // SUBMIT PROBLEM SOLUTION
    // ==========================================
    @PostMapping("/submit")
    public ResponseEntity<?> submitSolution(@RequestBody ProblemSubmissionDTO submission) {
        if (submission.getUserId() == null) {
            return ResponseEntity.badRequest().body("userId is required");
        }
        if (submission.getProblemId() == null || submission.getProblemId().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("problemId is required");
        }

        Long userId = submission.getUserId();
        String problemId = submission.getProblemId().trim();
        String skillName = submission.getSkillName() != null ? submission.getSkillName().trim() : "General";
        String topicName = submission.getTopicName() != null ? submission.getTopicName().trim() : "General";

        ProblemProgress progress = problemProgressRepository.findByUserIdAndProblemId(userId, problemId)
                .orElseGet(() -> new ProblemProgress(userId, problemId, skillName, topicName));

        progress.setSkillName(skillName);
        progress.setTopicName(topicName);
        progress.setAttempts(progress.getAttempts() + 1);
        progress.setLastActivityAt(LocalDateTime.now());
        if (submission.getSolutionCode() != null) {
            progress.setSolutionCode(submission.getSolutionCode());
        }

        boolean isPassed = Boolean.TRUE.equals(submission.getPassed());
        boolean evidenceCreatedOrUpdated = false;
        SkillScoreBreakdownDTO breakdown = null;

        if (isPassed) {
            progress.setStatus("COMPLETED");
            if (progress.getCompletedAt() == null) {
                progress.setCompletedAt(LocalDateTime.now());
            }

            double score = submission.getScore() != null ? submission.getScore() : 100.0;
            // Best score preserved or updated
            if (progress.getScore() == null || score > progress.getScore()) {
                progress.setScore(score);
            }

            // Only create/update verified evidence if recordEvidence is requested and valid score
            if (Boolean.TRUE.equals(submission.getRecordEvidence()) && score > 0) {
                String evidenceTitle = "Must-Learn: " + (submission.getProblemTitle() != null ? submission.getProblemTitle() : problemId);

                // Look for existing evidence for this specific problem
                List<Evidence> userEvList = evidenceRepository.findByUserIdAndSkillNameOrderByCreatedAtDesc(userId, skillName);
                Evidence targetEvidence = null;
                for (Evidence ev : userEvList) {
                    if (evidenceTitle.equalsIgnoreCase(ev.getTitle()) ||
                            (ev.getTitle() != null && ev.getTitle().contains(problemId))) {
                        targetEvidence = ev;
                        break;
                    }
                }

                if (targetEvidence == null) {
                    targetEvidence = new Evidence();
                    targetEvidence.setUserId(userId);
                    targetEvidence.setSkillName(skillName);
                    targetEvidence.setEvidenceType("problems"); // Maps to Practical Coding (20% weight)
                    targetEvidence.setTitle(evidenceTitle);
                    targetEvidence.setCreatedAt(LocalDateTime.now());
                }

                targetEvidence.setMarksObtained(score);
                targetEvidence.setMaxMarks(100.0);
                targetEvidence.setScore((int) Math.round(score));
                targetEvidence.setIsVerified(true);
                targetEvidence.setAssessmentDate(LocalDateTime.now());

                int passedCases = submission.getTestCasesPassed() != null ? submission.getTestCasesPassed() : 1;
                int totalCases = submission.getTotalTestCases() != null ? submission.getTotalTestCases() : 1;
                targetEvidence.setDescription(String.format("Verified solution for must-learn problem '%s' in topic '%s'. Test cases: %d/%d passed.",
                        submission.getProblemTitle() != null ? submission.getProblemTitle() : problemId,
                        topicName, passedCases, totalCases));

                evidenceRepository.save(targetEvidence);
                evidenceCreatedOrUpdated = true;

                // Automatically recalculate skill performance score
                try {
                    performanceScoringService.recalculateSkillScore(userId, skillName);
                    breakdown = performanceScoringService.calculateSkillBreakdown(userId, skillName);
                } catch (Exception e) {
                    // Graceful fallback if calculation issue
                }
            }
        } else {
            // Failed attempt: mark IN_PROGRESS if not already completed
            if (!"COMPLETED".equalsIgnoreCase(progress.getStatus())) {
                progress.setStatus("IN_PROGRESS");
            }
        }

        ProblemProgress saved = problemProgressRepository.save(progress);

        Map<String, Object> response = new HashMap<>();
        response.put("progress", saved);
        response.put("passed", isPassed);
        response.put("evidenceRecorded", evidenceCreatedOrUpdated);
        if (breakdown != null) {
            response.put("skillScoreBreakdown", breakdown);
        }
        response.put("message", isPassed ? "Problem successfully completed and verified!" : "Solution submitted. Some test cases failed.");

        return ResponseEntity.ok(response);
    }
}
