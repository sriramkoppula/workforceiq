package com.example.demo;

import com.example.demo.repository.EvidenceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evidence")
@CrossOrigin(origins = "*")
public class EvidenceController {

    private final EvidenceRepository evidenceRepository;

    public EvidenceController(EvidenceRepository evidenceRepository) {
        this.evidenceRepository = evidenceRepository;
    }

    @PostMapping
    public ResponseEntity<?> addEvidence(
            @RequestBody Evidence evidence) {

        if (evidence.getUserId() == null) {
            return ResponseEntity
                    .badRequest()
                    .body("User ID is required");
        }

        if (evidence.getSkillName() == null ||
                evidence.getSkillName().trim().isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Skill name is required");
        }

        if (evidence.getEvidenceType() == null ||
                evidence.getEvidenceType().trim().isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Evidence type is required");
        }

        if (evidence.getScore() == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Evidence score is required");
        }

        if (evidence.getScore() < 0 ||
                evidence.getScore() > 100) {
            return ResponseEntity
                    .badRequest()
                    .body("Evidence score must be between 0 and 100");
        }

        Evidence savedEvidence =
                evidenceRepository.save(evidence);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedEvidence);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Evidence>> getUserEvidence(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                evidenceRepository
                        .findByUserIdOrderByCreatedAtDesc(userId)
        );
    }

    @GetMapping("/user/{userId}/skill/{skillName}")
    public ResponseEntity<List<Evidence>> getSkillEvidence(
            @PathVariable Long userId,
            @PathVariable String skillName) {

        return ResponseEntity.ok(
                evidenceRepository
                        .findByUserIdAndSkillNameOrderByCreatedAtDesc(
                                userId,
                                skillName
                        )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvidence(
            @PathVariable Long id) {

        Evidence evidence =
                evidenceRepository.findById(id).orElse(null);

        if (evidence == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Evidence not found");
        }

        evidenceRepository.delete(evidence);

        return ResponseEntity.ok(
                "Evidence deleted successfully"
        );
    }
}