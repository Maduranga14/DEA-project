package com.enterprise.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class SubmissionRequest {

    @NotBlank(message = "Client ID is required")
    private String clientId;

    @NotBlank(message = "Project ID is required")
    private String projectId;

    @NotBlank(message = "Work title is required")
    private String workTitle;

    @NotBlank(message = "File URL is required")
    @Pattern(regexp = "^https?://.*", message = "Must be a valid URL starting with http:// or https://")
    private String fileUrl;

    private String description;

    // Constructors
    public SubmissionRequest() {}

    public SubmissionRequest(String clientId, String projectId, String workTitle, String fileUrl, String description) {
        this.clientId = clientId;
        this.projectId = projectId;
        this.workTitle = workTitle;
        this.fileUrl = fileUrl;
        this.description = description;
    }


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
}