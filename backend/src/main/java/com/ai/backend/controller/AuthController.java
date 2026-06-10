package com.ai.backend.controller;

import com.ai.backend.model.User;
import com.ai.backend.model.LoginHistory;
import com.ai.backend.repository.UserRepository;
import com.ai.backend.repository.LoginHistoryRepository;
import com.ai.backend.jwt.JwtUtil;
import com.ai.backend.model.PasswordResetToken;
import com.ai.backend.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.UUID;
import com.ai.backend.service.EmailService;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://ai-resume-analyser-six-silk.vercel.app"
})
public class AuthController {

    @Autowired
    private LoginHistoryRepository loginHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private PasswordResetTokenRepository resetRepo;

    @Autowired
    private EmailService emailService;

    // REGISTER
    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return "Email already exists";
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return "User registered successfully";
    }

    // VALIDATE TOKEN
    @GetMapping("/validate")
    public String validateToken(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        try {
            String email = JwtUtil.extractEmail(token);
            return email;
        } catch (Exception e) {
            return "Invalid Token";
        }
    }

    // PROFILE
    @GetMapping("/profile")
    public User getProfile(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = JwtUtil.extractEmail(token);
        return userRepository.findByEmail(email).orElse(null);
    }

    // LOGIN
    @PostMapping("/login")
    public String loginUser(@RequestBody User user) {
        Optional<User> existingUserOpt = userRepository.findByEmail(user.getEmail());

        if (existingUserOpt.isEmpty()) {
            return "User not found";
        }

        User existingUser = existingUserOpt.get();

        if (!passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            return "Invalid password";
        }

        LoginHistory history = new LoginHistory(existingUser.getEmail(), LocalDateTime.now());
        loginHistoryRepository.save(history);

        return JwtUtil.generateToken(existingUser.getEmail());
    }

    // FORGOT PASSWORD
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return "User not found";
        }

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setEmail(email);
        resetToken.setToken(token);
        resetToken.setExpiryTime(LocalDateTime.now().plusMinutes(30));
        resetRepo.save(resetToken);

       String resetlink = "https://ai-resume-analyser-six-silk.vercel.app/reset-password?token=" + token;
        emailService.sendResetEmail(email, resetLink);

        return "Reset link sent to email";
    }

    // RESET PASSWORD
    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        PasswordResetToken resetToken = resetRepo.findByToken(token);
        if (resetToken == null) {
            return "Invalid token";
        }

        if (resetToken.getExpiryTime().isBefore(LocalDateTime.now())) {
            return "Token expired";
        }

        Optional<User> userOpt = userRepository.findByEmail(resetToken.getEmail());
        if (userOpt.isEmpty()) {
            return "User not found";
        }

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        resetRepo.delete(resetToken);

        return "Password reset successful";
    }
}