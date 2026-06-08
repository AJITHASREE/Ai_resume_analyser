package com.ai.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendResetEmail(
            String to,
            String resetLink
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();
        message.setFrom("ajigopal210@gmail.com");

        message.setTo(to);
        message.setSubject("Password Reset");

        message.setText(
                "Click the link below to reset password:\n\n"
                        + resetLink
        );

        mailSender.send(message);
    }
}