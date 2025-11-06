package com.enterprise.backend.dto;

import com.enterprise.backend.entity.SubmissionStatus;
import java.time.LocalDateTime;

public class SubmissionResponse {

    private Long id;
    private String freelancerId;
    private String clientId;
    private String projectId;
    private String workTitle;
    private String fileUrl;
    private String description;
    private LocalDateTime submittedDate;
    private SubmissionStatus status;
    private String clientFeedback;
    private LocalDateTime reviewedDate;


    public SubmissionResponse() {}


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFreelancerId() { return freelancerId; }
    public void setFreelancerId(String freelancerId) { this.freelancerId = freelancerId; }

    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }

    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }

    public String getWorkTitle() { return workTitle; }
    public void setWorkTitle(String workTitle) { this.workTitle = workTitle; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getSubmittedDate() { return submittedDate; }
    public void setSubmittedDate(LocalDateTime submittedDate) { this.submittedDate = submittedDate; }

    public SubmissionStatus getStatus() { return status; }
    public void setStatus(SubmissionStatus status) { this.status = status; }

    public String getClientFeedback() { return clientFeedback; }
    public void setClientFeedback(String clientFeedback) { this.clientFeedback = clientFeedback; }

    public LocalDateTime getReviewedDate() { return reviewedDate; }
    public void setReviewedDate(LocalDateTime reviewedDate) { this.reviewedDate = reviewedDate; }
}