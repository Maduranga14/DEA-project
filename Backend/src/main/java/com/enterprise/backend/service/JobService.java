package com.enterprise.backend.service;

import com.enterprise.backend.dto.JobCreateRequest;
import com.enterprise.backend.dto.JobResponse;
import com.enterprise.backend.entity.Job;
import com.enterprise.backend.entity.JobStatus;
import com.enterprise.backend.entity.Role;
import com.enterprise.backend.entity.User;
import com.enterprise.backend.repository.JobRepository;
import com.enterprise.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    public JobResponse createJob(JobCreateRequest request) {
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        // Verify user is a client
        if (!currentUser.getRole().equals(Role.CLIENT) && !currentUser.getRole().equals(Role.ADMIN)) {
            throw new RuntimeException("Only clients can post jobs");
        }

        // Create new job
        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setBudget(request.getBudget());
        job.setJobType(request.getJobType());
        job.setExperienceLevel(request.getExperienceLevel());
        job.setEstimatedDuration(request.getEstimatedDuration());
        job.setDeadline(request.getDeadline());
        job.setClient(currentUser);

        if (request.getRequiredSkills() != null) {
            job.setRequiredSkills(request.getRequiredSkills());
        }

        Job savedJob = jobRepository.save(job);
        return convertToJobResponse(savedJob);
    }

    public List<JobResponse> getAllJobs() {
        List<Job> jobs = jobRepository.findByStatusOrderByCreatedAtDesc(JobStatus.OPEN);
        return jobs.stream()
                .map(this::convertToJobResponse)
                .collect(Collectors.toList());
    }

    public Page<JobResponse> getJobsPaginated(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortBy));
        Page<Job> jobPage = jobRepository.findByStatusOrderByCreatedAtDesc(JobStatus.OPEN, pageable);
        return jobPage.map(this::convertToJobResponse);
    }

    public Optional<JobResponse> getJobById(Long id) {
        Optional<Job> job = jobRepository.findById(id);
        return job.map(this::convertToJobResponse);
    }

    public List<JobResponse> getJobsByClient() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        List<Job> jobs = jobRepository.findByClientOrderByCreatedAtDesc(currentUser);
        return jobs.stream()
                .map(this::convertToJobResponse)
                .collect(Collectors.toList());
    }

    public List<JobResponse> getJobsByFreelancer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        List<Job> jobs = jobRepository.findByFreelancerOrderByCreatedAtDesc(currentUser);
        return jobs.stream()
                .map(this::convertToJobResponse)
                .collect(Collectors.toList());
    }

    public JobResponse updateJob(Long id, JobCreateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Verify user owns this job
        if (!job.getClient().getId().equals(currentUser.getId()) &&
                !currentUser.getRole().equals(Role.ADMIN)) {
            throw new RuntimeException("You can only update your own jobs");
        }

        // Update job fields
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setBudget(request.getBudget());
        job.setJobType(request.getJobType());
        job.setExperienceLevel(request.getExperienceLevel());
        job.setEstimatedDuration(request.getEstimatedDuration());
        job.setDeadline(request.getDeadline());

        if (request.getRequiredSkills() != null) {
            job.setRequiredSkills(request.getRequiredSkills());
        }

        Job updatedJob = jobRepository.save(job);
        return convertToJobResponse(updatedJob);
    }

    public void deleteJob(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Verify user owns this job
        if (!job.getClient().getId().equals(currentUser.getId()) &&
                !currentUser.getRole().equals(Role.ADMIN)) {
            throw new RuntimeException("You can only delete your own jobs");
        }

        jobRepository.delete(job);
    }

    public JobResponse updateJobStatus(Long id, JobStatus status) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Verify user has permission to update status
        if (!job.getClient().getId().equals(currentUser.getId()) &&
                !currentUser.getRole().equals(Role.ADMIN)) {
            throw new RuntimeException("You don't have permission to update this job");
        }

        job.setStatus(status);
        Job updatedJob = jobRepository.save(job);
        return convertToJobResponse(updatedJob);
    }

    public Page<JobResponse> searchJobs(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Job> jobPage = jobRepository.searchByKeywordAndStatus(keyword, JobStatus.OPEN, pageable);
        return jobPage.map(this::convertToJobResponse);
    }

    private JobResponse convertToJobResponse(Job job) {
        JobResponse response = new JobResponse();
        response.setId(job.getId());
        response.setTitle(job.getTitle());
        response.setDescription(job.getDescription());
        response.setBudget(job.getBudget());
        response.setStatus(job.getStatus());
        response.setJobType(job.getJobType());
        response.setExperienceLevel(job.getExperienceLevel());
        response.setRequiredSkills(job.getRequiredSkills());
        response.setEstimatedDuration(job.getEstimatedDuration());
        response.setDeadline(job.getDeadline());
        response.setCreatedAt(job.getCreatedAt());
        response.setUpdatedAt(job.getUpdatedAt());

        // Client information
        if (job.getClient() != null) {
            response.setClientId(job.getClient().getId());
            response.setClientName(job.getClient().getFirstName() + " " + job.getClient().getLastName());
            // You can add company name if you have it in User entity
        }

        // Freelancer information
        if (job.getFreelancer() != null) {
            response.setFreelancerId(job.getFreelancer().getId());
            response.setFreelancerName(job.getFreelancer().getFirstName() + " " + job.getFreelancer().getLastName());
        }

        return response;
    }
}