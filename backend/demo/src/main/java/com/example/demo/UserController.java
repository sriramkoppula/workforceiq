package com.example.demo;

import com.example.demo.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ==============================
    // REGISTER USER
    // ==============================

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {

        if (user.getName() == null ||
                user.getName().trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Name is required");
        }

        if (user.getEmail() == null ||
                user.getEmail().trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Email is required");
        }

        if (user.getPassword() == null ||
                user.getPassword().trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Password is required");
        }

        if (userRepository.existsByEmail(user.getEmail())) {

            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email already registered");
        }

        User savedUser = userRepository.save(user);

        Map<String, Object> response = new HashMap<>();

        response.put("message", "User registered successfully");
        response.put("id", savedUser.getId());
        response.put("name", savedUser.getName());
        response.put("email", savedUser.getEmail());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // ==============================
    // LOGIN USER
    // ==============================

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
            @RequestBody Map<String, String> loginData) {

        String email = loginData.get("email");
        String password = loginData.get("password");

        if (email == null || email.trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Email is required");
        }

        if (password == null || password.trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Password is required");
        }

        User user =
                userRepository.findByEmail(email.trim())
                        .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }

        if (!user.getPassword().equals(password)) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }

        Map<String, Object> response = new HashMap<>();

        response.put("message", "Login successful");
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());

        response.put("education", user.getEducation());
        response.put("year", user.getYear());
        response.put("career", user.getCareer());
        response.put("goal", user.getGoal());
        response.put("studyHours", user.getStudyHours());
        response.put("studyDays", user.getStudyDays());

        return ResponseEntity.ok(response);
    }


    // ==============================
    // UPDATE USER PROFILE
    // ==============================

    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long id,
            @RequestBody User profileData) {

        User existingUser =
                userRepository.findById(id).orElse(null);

        if (existingUser == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }

        if (profileData.getName() != null &&
                !profileData.getName().trim().isEmpty()) {

            existingUser.setName(profileData.getName());
        }

        if (profileData.getEducation() != null) {
            existingUser.setEducation(profileData.getEducation());
        }

        if (profileData.getYear() != null) {
            existingUser.setYear(profileData.getYear());
        }

        if (profileData.getCareer() != null) {
            existingUser.setCareer(profileData.getCareer());
        }

        if (profileData.getGoal() != null) {
            existingUser.setGoal(profileData.getGoal());
        }

        if (profileData.getStudyHours() != null) {
            existingUser.setStudyHours(profileData.getStudyHours());
        }

        if (profileData.getStudyDays() != null) {
            existingUser.setStudyDays(profileData.getStudyDays());
        }

        User updatedUser =
                userRepository.save(existingUser);

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "message",
                "Profile updated successfully"
        );

        response.put("id", updatedUser.getId());
        response.put("name", updatedUser.getName());
        response.put("email", updatedUser.getEmail());
        response.put("education", updatedUser.getEducation());
        response.put("year", updatedUser.getYear());
        response.put("career", updatedUser.getCareer());
        response.put("goal", updatedUser.getGoal());
        response.put("studyHours", updatedUser.getStudyHours());
        response.put("studyDays", updatedUser.getStudyDays());

        return ResponseEntity.ok(response);
    }


    // ==============================
    // GET USER
    // ==============================

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(
            @PathVariable Long id) {

        User user =
                userRepository.findById(id).orElse(null);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }

        return ResponseEntity.ok(user);
    }
}