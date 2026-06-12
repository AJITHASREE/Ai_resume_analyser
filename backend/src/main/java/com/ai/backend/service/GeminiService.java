package com.ai.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.Map;
import java.util.List;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final WebClient webClient = WebClient.create();

    // ✅ Method 1: Analyze Resume
    public String analyzeResume(String resumeText) {

        String prompt = """
    You are a resume analyzer. The user has uploaded a document.
    
    First check if this is a valid resume. If it is NOT a resume, still respond in JSON format like this:
    {
      "atsScore": 0,
      "missingKeywords": [],
      "skillGaps": [],
      "suggestions": [],
      "error": "This does not appear to be a resume. Please upload a valid resume PDF."
    }
    
    If it IS a valid resume, analyze it and respond in this exact JSON format:
    {
      "atsScore": 75,
      "missingKeywords": ["keyword1", "keyword2"],
      "skillGaps": ["gap1", "gap2"],
      "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
      "error": null
    }
    
    IMPORTANT: Always respond with ONLY valid JSON. No extra text.
    
    Document content:
    """ + resumeText;

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                )
        );

        try {
            Map response = webClient.post()
                    .uri("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=" + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            List candidates = (List) response.get("candidates");
            Map firstCandidate = (Map) candidates.get(0);
            Map content = (Map) firstCandidate.get("content");
            List parts = (List) content.get("parts");
            Map firstPart = (Map) parts.get(0);
            String rawText = (String) firstPart.get("text");

            // ✅ DEBUG LOG ADDED HERE (correct method)
            System.out.println("=== GEMINI RAW RESPONSE ===");
            System.out.println(rawText);
            System.out.println("=== END GEMINI RESPONSE ===");

            return rawText.replaceAll("```json\\n?", "").replaceAll("```", "").trim();

        } catch (Exception e) {
            // ✅ DEBUG ERROR LOG ADDED HERE
            System.out.println("=== GEMINI ERROR ===");
            System.out.println(e.getMessage());
            e.printStackTrace();
            System.out.println("=== END GEMINI ERROR ===");
            return "{\"atsScore\": 0, \"missingKeywords\": [], \"skillGaps\": [], \"suggestions\": [], \"error\": \"" + e.getMessage() + "\"}";
        }
    }

    // ✅ Method 3: Check if PDF is a resume
    public boolean isResume(String extractedText) {

        String prompt = """
            Look at this document text and answer only "yes" or "no".
            Is this document a resume or CV?
            A resume contains: name, contact info, work experience, skills, education.
            
            Document:
            """ + extractedText;

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                )
        );

        try {
            Map response = webClient.post()
                    .uri("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=" + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            List candidates = (List) response.get("candidates");
            Map firstCandidate = (Map) candidates.get(0);
            Map content = (Map) firstCandidate.get("content");
            List parts = (List) content.get("parts");
            Map firstPart = (Map) parts.get(0);
            String answer = (String) firstPart.get("text");

            return answer.trim().toLowerCase().contains("yes");

        } catch (Exception e) {
            return true;
        }
    }

    // ✅ Method 2: Generate Interview Questions
    public String generateInterviewQuestions(String resumeText) {

        String prompt = """
            Based on this resume, generate interview questions.
            
            Respond in this exact JSON format:
            {
              "technical": [
                {"question": "...", "difficulty": "Easy"},
                {"question": "...", "difficulty": "Medium"},
                {"question": "...", "difficulty": "Hard"}
              ],
              "hr": [
                {"question": "...", "difficulty": "Easy"},
                {"question": "...", "difficulty": "Medium"},
                {"question": "...", "difficulty": "Hard"}
              ],
              "behavioral": [
                {"question": "...", "difficulty": "Easy"},
                {"question": "...", "difficulty": "Medium"},
                {"question": "...", "difficulty": "Hard"}
              ]
            }
            
            Resume:
            """ + resumeText;

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                )
        );

        try {
            Map response = webClient.post()
                    .uri("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=" + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            List candidates = (List) response.get("candidates");
            Map firstCandidate = (Map) candidates.get(0);
            Map content = (Map) firstCandidate.get("content");
            List parts = (List) content.get("parts");
            Map firstPart = (Map) parts.get(0);
            String rawText = (String) firstPart.get("text");

            return rawText.replaceAll("```json\\n?", "").replaceAll("```", "").trim();

        } catch (Exception e) {
            return "{\"error\": \"Interview generation failed: " + e.getMessage() + "\"}";
        }
    }
}