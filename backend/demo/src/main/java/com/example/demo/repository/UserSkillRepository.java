package com.example.demo.repository;

import com.example.demo.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserSkillRepository
        extends JpaRepository<UserSkill, Long> {

    List<UserSkill> findByUserId(Long userId);

    Optional<UserSkill> findByUserIdAndSkillName(
            Long userId,
            String skillName
    );

    void deleteByUserIdAndSkillName(
            Long userId,
            String skillName
    );
}