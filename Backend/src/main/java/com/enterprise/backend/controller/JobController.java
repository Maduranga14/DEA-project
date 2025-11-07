package com.enterprise.backend.controller;

import com.enterprise.backend.dto.JobCreateRequest;
import com.enterprise.backend.dto.JobResponse;
import com.enterprise.backend.entity.JobStatus;
import com.enterprise.backend.service.JobService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/jobs")
public class JobController {

    @Autowired
    private JobService jobService;


    @PostMapping
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<?> createJob(@Valid @RequestBody JobCreateRequest request) {
        try {
            JobResponse job = jobService.createJob(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(job);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating job: " + e.getMessage());
        }
    }


    @GetMapping
    public ResponseEntity<List<JobResponse>> getAllJobs() {
        List<JobResponse> jobs = jobService.getAllJobs();
        return ResponseEntity.ok(jobs);
    }


    @GetMapping("/paginated")
    public ResponseEntity<Page<JobResponse>> getJobsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy) {
        Page<JobResponse> jobs = jobService.getJobsPaginated(page, size, sortBy);
        return ResponseEntity.ok(jobs);
    }

    // Get job by ID (public access)
    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable Long id) {
        Optional<JobResponse> job = jobService.getJobById(id);
        if (job.isPresent()) {
            return ResponseEntity.ok(job.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/my-jobs")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<List<JobResponse>> getMyJobs() {
        List<JobResponse> jobs = jobService.getJobsByClient();
        return ResponseEntity.ok(jobs);
    }


    @GetMapping("/my-assignments")
    @PreAuthorize("hasRole('FREELANCER') or hasRole('ADMIN')")
    public ResponseEntity<List<JobResponse>> getMyAssignments() {
        List<JobResponse> jobs = jobService.getJobsByFreelancer();
        return ResponseEntity.ok(jobs);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<?> updateJob(@PathVariable Long id,
                                       @Valid @RequestBody JobCreateRequest request) {
        try {
            JobResponse updatedJob = jobService.updateJob(id, request);
            return ResponseEntity.ok(updatedJob);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating job: " + e.getMessage());
        }
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        try {
            jobService.deleteJob(id);
            return ResponseEntity.ok("Job deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting job: " + e.getMessage());
        }
    }


    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<?> updateJobStatus(@PathVariable Long id,
                                             @RequestParam JobStatus status) {
        try {
            JobResponse updatedJob = jobService.updateJobStatus(id, status);
            return ResponseEntity.ok(updatedJob);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating job status: " + e.getMessage());
        }
    }

    
    @GetMapping("/search")
    public ResponseEntity<Page<JobResponse>> searchJobs(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<JobResponse> jobs = jobService.searchJobs(keyword, page, size);
        return ResponseEntity.ok(jobs);
    }


    @GetMapping("/stats")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<?> getJobStats() {

        return ResponseEntity.ok("Job statistics endpoint - to be implemented");
    }
}