package com.example.demo.repository;

import com.example.demo.LearningProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LearningProgressRepository
        extends JpaRepository<LearningProgress, Long> {

    List<LearningProgress>
    findByUserIdOrderByUpdatedAtAsc(Long userId);

    Optional<LearningProgress>
    findByUserIdAndSkillNameAndTopicName(
            Long userId,
            String skillName,
            String topicName
    );
}