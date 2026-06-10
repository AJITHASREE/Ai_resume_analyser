package com.ai.backend.controller;

import com.ai.backend.service.GeminiService;
import com.ai.backend.model.Resume;
import com.ai.backend.repository.ResumeRepository;
import com.ai.backend.jwt.JwtUtil;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import org.apache.pdfbox.Loader;
import java.util.Map;  // ← add this

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

        // Extract text from PDF
        PDDocument document = Loader.loadPDF(file.getBytes());
        PDFTextStripper stripper = new PDFTextStripper();
        String extractedText = stripper.getText(document);
        document.close();

        // Save to DB
        Resume resume = new Resume();
        resume.setUserEmail(email);
        resume.setFilename(file.getOriginalFilename());
        resume.setUploadTime(LocalDateTime.now());
        resume.setExtractedText(extractedText);
        resume.setAtsScore(0); // Will be updated after AI analysis

        return resumeRepository.save(resume);
    }

    @GetMapping("/my-resumes")
    public java.util.List<Resume> getMyResumes(
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
        String analysis = geminiService.analyzeResume(resume.getExtractedText());

        // Save analysis to DB
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            Map result = mapper.readValue(analysis, Map.class);

          Number atsScoreNum = (Number) result.get("atsScore");
int atsScore = atsScoreNum != null ? atsScoreNum.intValue() : 0;
            resume.setAtsScore(atsScore);

            // ✅ Save the full analysis as JSON strings
            resume.setMissingKeywords(mapper.writeValueAsString(result.get("missingKeywords")));
            resume.setSkillGaps(mapper.writeValueAsString(result.get("skillGaps")));
            resume.setSuggestions(mapper.writeValueAsString(result.get("suggestions")));

            resumeRepository.save(resume);
        } catch (Exception e) {
            System.out.println("Could not parse analysis: " + e.getMessage());
        }

        return resume;
    }
    @GetMapping("/latest")
    public Resume getLatestResume(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        String email = JwtUtil.extractEmail(token);
        return resumeRepository.findByUserEmail(email).stream()
                .max((a, b) -> a.getUploadTime().compareTo(b.getUploadTime()))
                .orElseThrow(() -> new RuntimeException("No resume found"));
    }
    @PostMapping("/interview/{id}")
    public String generateInterview(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader
    ) {
        Resume resume = resumeRepository.findById(id).orElseThrow();
        return geminiService.generateInterviewQuestions(resume.getExtractedText());
    }
}