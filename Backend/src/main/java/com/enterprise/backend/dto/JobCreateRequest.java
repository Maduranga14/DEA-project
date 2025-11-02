package com.enterprise.backend.dto;

import com.enterprise.backend.entity.ExperienceLevel;
import com.enterprise.backend.entity.JobType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class JobCreateRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    @Positive
    private BigDecimal budget;

    @NotNull
    private JobType jobType;

    @NotNull
    private ExperienceLevel experienceLevel;

    private List<String> requiredSkills;

    private String estimatedDuration;

    private LocalDateTime deadline;

    // Constructors
    public JobCreateRequest() {}

    public JobCreateRequest(String title, String description, BigDecimal budget,
                            JobType jobType, ExperienceLevel experienceLevel) {
        this.title = title;
        this.description = description;
        this.budget = budget;
        this.jobType = jobType;
        this.experienceLevel = experienceLevel;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getBudget() {
        return budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }

    public JobType getJobType() {
        return jobType;
    }

    public void setJobType(JobType jobType) {
        this.jobType = jobType;
    }

    public ExperienceLevel getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(ExperienceLevel experienceLevel) {
        this.experienceLevel = experienceLevel;
    }

    public List<String> getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(List<String> requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    public String getEstimatedDuration() {
        return estimatedDuration;
    }

    public void setEstimatedDuration(String estimatedDuration) {
        this.estimatedDuration = estimatedDuration;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }
}