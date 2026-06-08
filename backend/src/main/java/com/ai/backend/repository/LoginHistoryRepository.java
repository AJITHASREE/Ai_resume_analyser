package com.ai.backend.repository;

import com.ai.backend.model.LoginHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoginHistoryRepository
        extends JpaRepository<LoginHistory, Long> {
}