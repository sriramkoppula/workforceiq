package com.example.demo;

import com.example.demo.repository.ProgressHistoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class ProgressHistoryController {

    private final ProgressHistoryRepository repository;

    public ProgressHistoryController(
            ProgressHistoryRepository repository) {

        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<?> saveProgress(
            @RequestBody ProgressHistory progress) {

        if (progress.getUserId() == null) {
            return ResponseEntity
                    .badRequest()
                    .body("User ID is required");
        }

        if (progress.getReadinessScore() == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Readiness score is required");
        }

        if (
            progress.getReadinessScore() < 0 ||
            progress.getReadinessScore() > 100
        ) {
            return ResponseEntity
                    .badRequest()
                    .body("Readiness score must be between 0 and 100");
        }

        ProgressHistory saved =
                repository.save(progress);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(saved);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProgressHistory>> getProgress(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                repository.findByUserIdOrderByCreatedAtAsc(userId)
        );
    }
}