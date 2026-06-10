package com.ai.backend.service;

import com.ai.backend.jwt.JwtUtil;
import com.ai.backend.model.LoginHistory;
import com.ai.backend.model.User;
import com.ai.backend.repository.LoginHistoryRepository;
import com.ai.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class GoogleOAuthSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LoginHistoryRepository loginHistoryRepository; // ← add this

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // ✅ Create user if not exists
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isEmpty()) {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setPassword("GOOGLE_AUTH");
            userRepository.save(newUser);
        }

        // ✅ Save login history
        LoginHistory history = new LoginHistory(email, LocalDateTime.now());
        loginHistoryRepository.save(history);

        // ✅ Generate JWT token
        String token = JwtUtil.generateToken(email);

        // ✅ Redirect to React frontend with token
        response.sendRedirect("https://ai-resume-analyser-six-silk.vercel.app/oauth2/callback?token=" + token);
}





























































