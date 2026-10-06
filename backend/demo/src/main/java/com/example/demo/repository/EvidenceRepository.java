package com.example.demo.repository;

import com.example.demo.Evidence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EvidenceRepository
        extends JpaRepository<Evidence, Long> {

    List<Evidence> findByUserIdOrderByCreatedAtDesc(
            Long userId
    );

    List<Evidence> findByUserIdAndSkillNameOrderByCreatedAtDesc(
            Long userId,
            String skillName
    );
}