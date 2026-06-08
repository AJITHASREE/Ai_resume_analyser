package com.ai.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "login_history")
public class LoginHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private LocalDateTime loginTime;

    public LoginHistory() {
    }

    public LoginHistory(String email, LocalDateTime loginTime) {
        this.email = email;
        this.loginTime = loginTime;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public LocalDateTime getLoginTime() {
        return loginTime;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setLoginTime(LocalDateTime loginTime) {
        this.loginTime = loginTime;
    }
}