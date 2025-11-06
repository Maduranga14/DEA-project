package com.enterprise.backend.service;

import com.enterprise.backend.dto.SubmissionRequest;
import com.enterprise.backend.dto.SubmissionResponse;
import com.enterprise.backend.entity.FileSubmission;
import com.enterprise.backend.entity.SubmissionStatus;
import com.enterprise.backend.repository.FileSubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FileSubmissionService {

    @Autowired
    private FileSubmissionRepository submissionRepository;

    public SubmissionResponse submitWork(String freelancerId, SubmissionRequest request) {
        FileSubmission submission = new FileSubmission(
                freelancerId,
                request.getClientId(),
                request.getProjectId(),
                request.getWorkTitle(),
                request.getFileUrl(),
                request.getDescription()
        );

        FileSubmission saved = submissionRepository.save(submission);
        return convertToResponse(saved);
    }

    public List<SubmissionResponse> getFreelancerSubmissions(String freelancerId) {
        return submissionRepository.findByFreelancerIdOrderBySubmittedDateDesc(freelancerId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<SubmissionResponse> getClientSubmissions(String clientId) {
        return submissionRepository.findByClientIdOrderBySubmittedDateDesc(clientId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<SubmissionResponse> getProjectSubmissions(String projectId) {
        return submissionRepository.findByProjectIdOrderBySubmittedDateDesc(projectId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public Optional<SubmissionResponse> getSubmissionById(Long id) {
        return submissionRepository.findById(id)
                .map(this::convertToResponse);
    }

    public SubmissionResponse updateSubmissionStatus(Long id, SubmissionStatus status, String feedback) {
        FileSubmission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        submission.setStatus(status);
        submission.setClientFeedback(feedback);
        submission.setReviewedDate(LocalDateTime.now());

        FileSubmission updated = submissionRepository.save(submission);
        return convertToResponse(updated);
    }

    public List<SubmissionResponse> getPendingSubmissions(String clientId) {
        return submissionRepository.findByClientIdAndStatus(clientId, SubmissionStatus.PENDING)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private SubmissionResponse convertToResponse(FileSubmission submission) {
        SubmissionResponse response = new SubmissionResponse();
        response.setId(submission.getId());
        response.setFreelancerId(submission.getFreelancerId());
        response.setClientId(submission.getClientId());
        response.setProjectId(submission.getProjectId());
        response.setWorkTitle(submission.getWorkTitle());
        response.setFileUrl(submission.getFileUrl());
        response.setDescription(submission.getDescription());
        response.setSubmittedDate(submission.getSubmittedDate());
        response.setStatus(submission.getStatus());
        response.setClientFeedback(submission.getClientFeedback());
        response.setReviewedDate(submission.getReviewedDate());
        return response;
    }
}