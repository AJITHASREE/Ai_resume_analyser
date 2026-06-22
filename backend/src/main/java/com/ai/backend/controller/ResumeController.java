package com.ai.backend.controller;

import com.ai.backend.service.GeminiService;
import com.ai.backend.model.Resume;
import com.ai.backend.repository.ResumeRepository;
import com.ai.backend.jwt.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://ai-resume-analyser-six-silk.vercel.app"
})
public class ResumeController {

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/upload")
    public Resume uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String authHeader
    ) throws Exception {

        String token = authHeader.replace("Bearer ", "");
        String email = JwtUtil.extractEmail(token);

        PDDocument document = Loader.loadPDF(file.getBytes());
        PDFTextStripper stripper = new PDFTextStripper();
        String extractedText = stripper.getText(document);
        document.close();

        Resume resume = new Resume();
        resume.setUserEmail(email);
        resume.setFilename(file.getOriginalFilename());
        resume.setUploadTime(LocalDateTime.now());
        resume.setExtractedText(extractedText);
        resume.setAtsScore(0);

        return resumeRepository.save(resume);
    }

    @GetMapping("/my-resumes")
    public List<Resume> getMyResumes(
            @RequestHeader("Authorization") String authHeader
    ) {

        String token = authHeader.replace("Bearer ", "");
        String email = JwtUtil.extractEmail(token);

        return resumeRepository.findByUserEmail(email);
    }

    @PostMapping("/analyze/{id}")
    public Resume analyzeResume(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader
    ) {

        Resume resume = resumeRepository.findById(id).orElseThrow();

        // Use cached analysis if already exists
        if (resume.getAtsScore() != null && resume.getAtsScore() > 0) {
            System.out.println("Using cached ATS analysis");
            return resume;
        }

        String analysis =
                geminiService.analyzeResume(
                        resume.getExtractedText());

        try {

            ObjectMapper mapper = new ObjectMapper();

            Map result =
                    mapper.readValue(analysis, Map.class);

            Number atsScoreNum =
                    (Number) result.get("atsScore");

            int atsScore =
                    atsScoreNum != null
                            ? atsScoreNum.intValue()
                            : 0;

            resume.setAtsScore(atsScore);

            resume.setMissingKeywords(
                    mapper.writeValueAsString(
                            result.get("missingKeywords"))
            );

            resume.setSkillGaps(
                    mapper.writeValueAsString(
                            result.get("skillGaps"))
            );

            resume.setSuggestions(
                    mapper.writeValueAsString(
                            result.get("suggestions"))
            );

            resumeRepository.save(resume);

        } catch (Exception e) {

            System.out.println(
                    "Could not parse analysis: "
                            + e.getMessage()
            );
        }

        return resume;
    }

    @GetMapping("/latest")
    public Resume getLatestResume(
            @RequestHeader("Authorization") String authHeader
    ) {

        String token = authHeader.replace("Bearer ", "");
        String email = JwtUtil.extractEmail(token);

        return resumeRepository.findByUserEmail(email)
                .stream()
                .max((a, b) ->
                        a.getUploadTime()
                                .compareTo(b.getUploadTime()))
                .orElseThrow(() ->
                        new RuntimeException("No resume found"));
    }

    @PostMapping("/interview/{id}")
    public String generateInterview(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader
    ) {

        Resume resume =
                resumeRepository.findById(id)
                        .orElseThrow();

        // Return cached questions
        if (resume.getInterviewQuestions() != null &&
                !resume.getInterviewQuestions().isBlank()) {

            System.out.println(
                    "Using cached interview questions");

            return resume.getInterviewQuestions();
        }

        String questions =
                geminiService.generateInterviewQuestions(
                        resume.getExtractedText());

        resume.setInterviewQuestions(questions);

        resumeRepository.save(resume);

        return questions;
    }
}