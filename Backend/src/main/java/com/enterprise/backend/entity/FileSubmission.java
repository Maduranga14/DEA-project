package com.enterprise.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "file_submissions")
public class FileSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "freelancer_id")
    private String freelancerId;

    @NotBlank
    @Column(name = "client_id")
    private String clientId;

    @NotBlank
    @Column(name = "project_id")
    private String projectId;

    @NotBlank
    @Column(name = "work_title")
    private String workTitle;

    @NotBlank
    @Column(name = "file_url")
    private String fileUrl;

    @Column(name = "description")
    private String description;

    @NotNull
    @Column(name = "submitted_date")
    private LocalDateTime submittedDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private SubmissionStatus status = SubmissionStatus.PENDING;

    @Column(name = "client_feedback")
    private String clientFeedback;

    @Column(name = "reviewed_date")
    private LocalDateTime reviewedDate;


    public FileSubmission() {}

    public FileSubmission(String freelancerId, String clientId, String projectId,
                          String workTitle, String fileUrl, String description) {
        this.freelancerId = freelancerId;
        this.clientId = clientId;
        this.projectId = projectId;
        this.workTitle = workTitle;
        this.fileUrl = fileUrl;
        this.description = description;
        this.submittedDate = LocalDateTime.now();
    }

    
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