package com.example.demo;

import com.example.demo.repository.StudySessionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/study-sessions")
@CrossOrigin(origins = "*")
public class StudySessionController {

    private final StudySessionRepository repository;

    public StudySessionController(
            StudySessionRepository repository) {

        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<?> saveSession(
            @RequestBody StudySession session) {

        if (session.getUserId() == null) {
            return ResponseEntity.badRequest()
                    .body("User ID is required");
        }

        if (session.getSkill() == null ||
                session.getSkill().trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Skill is required");
        }

        if (session.getDuration() == null ||
                session.getDuration() < 0) {

            return ResponseEntity.badRequest()
                    .body("Valid duration is required");
        }

        StudySession saved =
                repository.save(session);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(saved);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<StudySession>>
    getUserSessions(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                repository
                        .findByUserIdOrderBySessionDateAsc(
                                userId
                        )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSession(
            @PathVariable Long id) {

        StudySession session =
                repository.findById(id)
                        .orElse(null);

        if (session == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Study session not found");
        }

        repository.delete(session);

        return ResponseEntity.ok(
                "Study session deleted successfully"
        );
    }
}