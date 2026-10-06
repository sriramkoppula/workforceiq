package com.example.demo;

import com.example.demo.repository.UserSkillRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-skills")
@CrossOrigin(origins = "*")
public class UserSkillController {

    private final UserSkillRepository userSkillRepository;

    public UserSkillController(
            UserSkillRepository userSkillRepository) {

        this.userSkillRepository = userSkillRepository;
    }


    // ==========================================
    // GET ALL SKILLS FOR USER
    // ==========================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserSkill>> getUserSkills(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                userSkillRepository.findByUserId(userId)
        );
    }


    // ==========================================
    // ADD NEW SKILL
    // ==========================================

    @PostMapping
    public ResponseEntity<?> addSkill(
            @RequestBody UserSkill skill) {

        if (skill.getUserId() == null) {

            return ResponseEntity.badRequest()
                    .body("User ID is required");
        }

        if (skill.getSkillName() == null ||
                skill.getSkillName().trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Skill name is required");
        }

        if (skill.getConfidence() == null) {

            return ResponseEntity.badRequest()
                    .body("Confidence is required");
        }

        if (skill.getConfidence() < 0 ||
                skill.getConfidence() > 100) {

            return ResponseEntity.badRequest()
                    .body(
                        "Confidence must be between 0 and 100"
                    );
        }

        /*
         * Do not create duplicate skills.
         */

        if (userSkillRepository
                .findByUserIdAndSkillName(
                        skill.getUserId(),
                        skill.getSkillName()
                )
                .isPresent()) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                        "Skill already exists. Use update."
                    );
        }

        UserSkill savedSkill =
                userSkillRepository.save(skill);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedSkill);
    }


    // ==========================================
    // UPDATE CONFIDENCE
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSkill(
            @PathVariable Long id,
            @RequestBody UserSkill skillData) {

        UserSkill existingSkill =
                userSkillRepository
                        .findById(id)
                        .orElse(null);

        if (existingSkill == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Skill not found");
        }

        if (skillData.getConfidence() == null) {

            return ResponseEntity.badRequest()
                    .body("Confidence is required");
        }

        if (skillData.getConfidence() < 0 ||
                skillData.getConfidence() > 100) {

            return ResponseEntity.badRequest()
                    .body(
                        "Confidence must be between 0 and 100"
                    );
        }

        existingSkill.setConfidence(
                skillData.getConfidence()
        );

        UserSkill updatedSkill =
                userSkillRepository.save(
                        existingSkill
                );

        return ResponseEntity.ok(updatedSkill);
    }


    // ==========================================
    // DELETE SKILL
    // ==========================================

    @DeleteMapping(
            "/user/{userId}/skill/{skillName}"
    )
    public ResponseEntity<?> deleteSkill(
            @PathVariable Long userId,
            @PathVariable String skillName) {

        UserSkill existingSkill =
                userSkillRepository
                        .findByUserIdAndSkillName(
                                userId,
                                skillName
                        )
                        .orElse(null);

        if (existingSkill == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Skill not found");
        }

        userSkillRepository.delete(
                existingSkill
        );

        return ResponseEntity.ok(
                "Skill deleted successfully"
        );
    }
}