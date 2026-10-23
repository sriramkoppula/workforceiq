package com.example.demo.repository;

import com.example.demo.ProblemProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProblemProgressRepository extends JpaRepository<ProblemProgress, Long> {

    List<ProblemProgress> findByUserId(Long userId);

    List<ProblemProgress> findByUserIdAndSkillName(Long userId, String skillName);

    List<ProblemProgress> findByUserIdAndTopicName(Long userId, String topicName);

    Optional<ProblemProgress> findByUserIdAndProblemId(Long userId, String problemId);

    long countByUserIdAndSkillNameAndStatus(Long userId, String skillName, String status);
}
