package com.example.demo;

import com.example.demo.repository.LearningProgressRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning-progress")
@CrossOrigin(origins = "*")
public class LearningProgressController {

    private final LearningProgressRepository repository;

    public LearningProgressController(
            LearningProgressRepository repository) {
        this.repository = repository;
    }


    // ==========================================
    // SAVE OR UPDATE LEARNING PROGRESS
    // ==========================================

    @PostMapping
    public ResponseEntity<?> saveProgress(
            @RequestBody LearningProgress progress) {

        if (progress.getUserId() == null) {
            return ResponseEntity
                    .badRequest()
                    .body("User ID is required");
        }

        if (progress.getSkillName() == null ||
                progress.getSkillName().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Skill name is required");
        }

        if (progress.getTopicName() == null ||
                progress.getTopicName().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Topic name is required");
        }

        if (progress.getProgress() == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Progress is required");
        }

        if (progress.getProgress() < 0 ||
                progress.getProgress() > 100) {

            return ResponseEntity
                    .badRequest()
                    .body("Progress must be between 0 and 100");
        }

        if (progress.getCompleted() == null) {
            progress.setCompleted(false);
        }


        LearningProgress existing =
                repository
                        .findByUserIdAndSkillNameAndTopicName(
                                progress.getUserId(),
                                progress.getSkillName(),
                                progress.getTopicName()
                        )
                        .orElse(null);


        if (existing != null) {

            existing.setProgress(
                    progress.getProgress()
            );

            existing.setCompleted(
                    progress.getCompleted()
            );

            LearningProgress updated =
                    repository.save(existing);

            return ResponseEntity.ok(updated);
        }


        LearningProgress saved =
                repository.save(progress);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(saved);
    }


    // ==========================================
    // GET USER LEARNING PROGRESS
    // ==========================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LearningProgress>>
    getUserProgress(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                repository
                        .findByUserIdOrderByUpdatedAtAsc(
                                userId
                        )
        );
    }


    // ==========================================
    // GET SPECIFIC TOPIC
    // ==========================================

    @GetMapping("/user/{userId}/skill/{skillName}/topic/{topicName}")
    public ResponseEntity<?> getTopicProgress(
            @PathVariable Long userId,
            @PathVariable String skillName,
            @PathVariable String topicName) {

        return repository
                .findByUserIdAndSkillNameAndTopicName(
                        userId,
                        skillName,
                        topicName
                )
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(null)
                );
    }


    // ==========================================
    // DELETE PROGRESS
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProgress(
            @PathVariable Long id) {

        LearningProgress progress =
                repository.findById(id)
                        .orElse(null);

        if (progress == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Learning progress not found");
        }

        repository.delete(progress);

        return ResponseEntity.ok(
                "Learning progress deleted successfully"
        );
    }
}