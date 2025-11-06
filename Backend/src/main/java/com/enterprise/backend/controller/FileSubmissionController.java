package com.enterprise.backend.controller;

import com.enterprise.backend.dto.SubmissionRequest;
import com.enterprise.backend.dto.SubmissionResponse;
import com.enterprise.backend.entity.SubmissionStatus;
import com.enterprise.backend.entity.User;
import com.enterprise.backend.service.FileSubmissionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/submissions")
@CrossOrigin(origins = "*")
public class FileSubmissionController {

    @Autowired
    private FileSubmissionService submissionService;

    @PostMapping("/submit")
    public ResponseEntity<SubmissionResponse> submitWork(
            @Valid @RequestBody SubmissionRequest request,
            Authentication authentication) {

        User currentUser = (User) authentication.getPrincipal();
        String freelancerId = currentUser.getId().toString();
        SubmissionResponse response = submissionService.submitWork(freelancerId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/freelancer")
    public ResponseEntity<List<SubmissionResponse>> getFreelancerSubmissions(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        String freelancerId = currentUser.getId().toString();
        List<SubmissionResponse> submissions = submissionService.getFreelancerSubmissions(freelancerId);
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/client")
    public ResponseEntity<List<SubmissionResponse>> getClientSubmissions(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        String clientId = currentUser.getId().toString();
        List<SubmissionResponse> submissions = submissionService.getClientSubmissions(clientId);
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/client/pending")
    public ResponseEntity<List<SubmissionResponse>> getPendingSubmissions(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        String clientId = currentUser.getId().toString();
        List<SubmissionResponse> submissions = submissionService.getPendingSubmissions(clientId);
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<SubmissionResponse>> getProjectSubmissions(@PathVariable String projectId) {
        List<SubmissionResponse> submissions = submissionService.getProjectSubmissions(projectId);
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubmissionResponse> getSubmission(@PathVariable Long id) {
        return submissionService.getSubmissionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/review")
    public ResponseEntity<SubmissionResponse> reviewSubmission(
            @PathVariable Long id,
            @RequestBody Map<String, Object> reviewData) {

        SubmissionStatus status = SubmissionStatus.valueOf((String) reviewData.get("status"));
        String feedback = (String) reviewData.get("feedback");

        SubmissionResponse response = submissionService.updateSubmissionStatus(id, status, feedback);
        return ResponseEntity.ok(response);
    }
}