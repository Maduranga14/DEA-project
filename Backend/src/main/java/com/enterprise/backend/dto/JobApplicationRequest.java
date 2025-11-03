package com.enterprise.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class JobApplicationRequest {
    @NotNull
    private Long jobId;

    @NotBlank
    private String coverLetter;

    @NotNull
    @Positive
    private BigDecimal proposedRate;

    private Integer estimatedDeliveryDays;

    private String portfolioLinks;

    // Constructors
    public JobApplicationRequest() {}

    public JobApplicationRequest(Long jobId, String coverLetter, BigDecimal proposedRate) {
        this.jobId = jobId;
        this.coverLetter = coverLetter;
        this.proposedRate = proposedRate;
    }

    // Getters and Setters
    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    public BigDecimal getProposedRate() {
        return proposedRate;
    }

    public void setProposedRate(BigDecimal proposedRate) {
        this.proposedRate = proposedRate;
    }

    public Integer getEstimatedDeliveryDays() {
        return estimatedDeliveryDays;
    }

    public void setEstimatedDeliveryDays(Integer estimatedDeliveryDays) {
        this.estimatedDeliveryDays = estimatedDeliveryDays;
    }

    public String getPortfolioLinks() {
        return portfolioLinks;
    }

    public void setPortfolioLinks(String portfolioLinks) {
        this.portfolioLinks = portfolioLinks;
    }
}
