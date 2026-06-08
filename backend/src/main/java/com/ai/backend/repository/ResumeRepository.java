package com.ai.backend.repository;

import com.ai.backend.model.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByUserEmail(String userEmail);
}