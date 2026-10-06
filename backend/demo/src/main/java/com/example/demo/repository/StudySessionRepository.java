package com.example.demo.repository;

import com.example.demo.StudySession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudySessionRepository
        extends JpaRepository<StudySession, Long> {

    List<StudySession>
    findByUserIdOrderBySessionDateAsc(Long userId);
}