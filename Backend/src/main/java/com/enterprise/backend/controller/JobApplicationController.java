package com.enterprise.backend.controller;

import com.enterprise.backend.dto.JobApplicationRequest;
import com.enterprise.backend.dto.JobApplicationResponse;
import com.enterprise.backend.entity.ApplicationStatus;
import com.enterprise.backend.service.JobApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/applications")
public class JobApplicationController {

    @Autowired
    private JobApplicationService jobApplicationService;

    // Apply for a job (freelancers only)
    @PostMapping
    @PreAuthorize("hasRole('FREELANCER') or hasRole('ADMIN')")
    public ResponseEntity<?> applyForJob(@Valid @RequestBody JobApplicationRequest request) {
        try {
            JobApplicationResponse application = jobApplicationService.applyForJob(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(application);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error applying for job: " + e.getMessage());
        }
    }

    // Get my applications (freelancer's own applications)
    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('FREELANCER') or hasRole('ADMIN')")
    public ResponseEntity<List<JobApplicationResponse>> getMyApplications() {
        List<JobApplicationResponse> applications = jobApplicationService.getMyApplications();
        return ResponseEntity.ok(applications);
    }

    // Get applications for a specific job (job owner only)
    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<?> getApplicationsForJob(@PathVariable Long jobId) {
        try {
            List<JobApplicationResponse> applications = jobApplicationService.getApplicationsForJob(jobId);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving applications: " + e.getMessage());
        }
    }

    // Get all applications for my jobs (client's jobs)
    @GetMapping("/my-jobs")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<List<JobApplicationResponse>> getApplicationsForMyJobs() {
        List<JobApplicationResponse> applications = jobApplicationService.getApplicationsForMyJobs();
        return ResponseEntity.ok(applications);
    }

    // Get specific application by ID
    @GetMapping("/{applicationId}")
    @PreAuthorize("hasRole('FREELANCER') or hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<?> getApplicationById(@PathVariable Long applicationId) {
        try {
            Optional<JobApplicationResponse> application = jobApplicationService.getApplicationById(applicationId);
            if (application.isPresent()) {
                return ResponseEntity.ok(application.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving application: " + e.getMessage());
        }
    }

    // Update application status (job owner only)
    @PatchMapping("/{applicationId}/status")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status,
            @RequestParam(required = false) String feedback) {
        try {
            JobApplicationResponse updatedApplication = jobApplicationService
                    .updateApplicationStatus(applicationId, status, feedback);
            return ResponseEntity.ok(updatedApplication);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating application status: " + e.getMessage());
        }
    }

    // Withdraw application (freelancer only)
    @PatchMapping("/{applicationId}/withdraw")
    @PreAuthorize("hasRole('FREELANCER') or hasRole('ADMIN')")
    public ResponseEntity<?> withdrawApplication(@PathVariable Long applicationId) {
        try {
            jobApplicationService.withdrawApplication(applicationId);
            return ResponseEntity.ok("Application withdrawn successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error withdrawing application: " + e.getMessage());
        }
    }

    // Get application count for a job (public)
    @GetMapping("/job/{jobId}/count")
    public ResponseEntity<Long> getApplicationCountForJob(@PathVariable Long jobId) {
        try {
            long count = jobApplicationService.getApplicationCountForJob(jobId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(0L);
        }
    }

    // Shortlist application (job owner only)
    @PatchMapping("/{applicationId}/shortlist")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<?> shortlistApplication(@PathVariable Long applicationId) {
        try {
            JobApplicationResponse updatedApplication = jobApplicationService
                    .updateApplicationStatus(applicationId, ApplicationStatus.SHORTLISTED, "Application shortlisted for further review");
            return ResponseEntity.ok(updatedApplication);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error shortlisting application: " + e.getMessage());
        }
    }

    // Accept application (job owner only)
    @PatchMapping("/{applicationId}/accept")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<?> acceptApplication(
            @PathVariable Long applicationId,
            @RequestParam(required = false) String feedback) {
        try {
            JobApplicationResponse updatedApplication = jobApplicationService
                    .updateApplicationStatus(applicationId, ApplicationStatus.ACCEPTED,
                            feedback != null ? feedback : "Congratulations! Your application has been accepted.");
            return ResponseEntity.ok(updatedApplication);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error accepting application: " + e.getMessage());
        }
    }

    // Reject application (job owner only)
    @PatchMapping("/{applicationId}/reject")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<?> rejectApplication(
            @PathVariable Long applicationId,
            @RequestParam(required = false) String feedback) {
        try {
            JobApplicationResponse updatedApplication = jobApplicationService
                    .updateApplicationStatus(applicationId, ApplicationStatus.REJECTED,
                            feedback != null ? feedback : "Thank you for your interest. We have decided to move forward with another candidate.");
            return ResponseEntity.ok(updatedApplication);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error rejecting application: " + e.getMessage());
        }
    }
}