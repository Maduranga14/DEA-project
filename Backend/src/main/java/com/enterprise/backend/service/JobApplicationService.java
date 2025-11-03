package com.enterprise.backend.service;

import com.enterprise.backend.dto.JobApplicationRequest;
import com.enterprise.backend.dto.JobApplicationResponse;
import com.enterprise.backend.entity.*;
import com.enterprise.backend.repository.JobApplicationRepository;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class JobApplicationService {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    public JobApplicationResponse applyForJob(JobApplicationRequest request) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();


        if (!currentUser.getRole().equals(Role.FREELANCER) && !currentUser.getRole().equals(Role.ADMIN)) {
            throw new RuntimeException("Only freelancers can apply for jobs");
        }


        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));


        if (!job.getStatus().equals(JobStatus.OPEN)) {
            throw new RuntimeException("This job is no longer accepting applications");
        }


        if (jobApplicationRepository.existsByJobAndFreelancer(job, currentUser)) {
            throw new RuntimeException("You have already applied for this job");
        }


        if (job.getClient().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You cannot apply to your own job");
        }


        JobApplication application = new JobApplication();
        application.setJob(job);
        application.setFreelancer(currentUser);
        application.setCoverLetter(request.getCoverLetter());
        application.setProposedRate(request.getProposedRate());
        application.setEstimatedDeliveryDays(request.getEstimatedDeliveryDays());
        application.setPortfolioLinks(request.getPortfolioLinks());

        JobApplication savedApplication = jobApplicationRepository.save(application);
        return convertToJobApplicationResponse(savedApplication);
    }

    public List<JobApplicationResponse> getMyApplications() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        List<JobApplication> applications = jobApplicationRepository.findByFreelancerOrderByAppliedAtDesc(currentUser);
        return applications.stream()
                .map(this::convertToJobApplicationResponse)
                .collect(Collectors.toList());
    }

    public List<JobApplicationResponse> getApplicationsForJob(Long jobId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));


        if (!job.getClient().getId().equals(currentUser.getId()) &&
                !currentUser.getRole().equals(Role.ADMIN)) {
            throw new RuntimeException("You can only view applications for your own jobs");
        }

        List<JobApplication> applications = jobApplicationRepository.findByJobOrderByAppliedAtDesc(job);
        return applications.stream()
                .map(this::convertToJobApplicationResponse)
                .collect(Collectors.toList());
    }

    public List<JobApplicationResponse> getApplicationsForMyJobs() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        List<JobApplication> applications = jobApplicationRepository.findApplicationsForClientJobs(currentUser);
        return applications.stream()
                .map(this::convertToJobApplicationResponse)
                .collect(Collectors.toList());
    }

    public JobApplicationResponse updateApplicationStatus(Long applicationId, ApplicationStatus status, String feedback) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));


        if (!application.getJob().getClient().getId().equals(currentUser.getId()) &&
                !currentUser.getRole().equals(Role.ADMIN)) {
            throw new RuntimeException("You can only update applications for your own jobs");
        }

        application.setStatus(status);
        if (feedback != null && !feedback.trim().isEmpty()) {
            application.setClientFeedback(feedback);
        }


        if (status == ApplicationStatus.ACCEPTED) {
            Job job = application.getJob();
            job.setFreelancer(application.getFreelancer());
            job.setStatus(JobStatus.IN_PROGRESS);
            jobRepository.save(job);


            List<JobApplication> otherApplications = jobApplicationRepository
                    .findByJobAndStatusOrderByAppliedAtDesc(job, ApplicationStatus.PENDING);

            for (JobApplication otherApp : otherApplications) {
                if (!otherApp.getId().equals(applicationId)) {
                    otherApp.setStatus(ApplicationStatus.REJECTED);
                    otherApp.setClientFeedback("Position has been filled");
                    jobApplicationRepository.save(otherApp);
                }
            }
        }

        JobApplication updatedApplication = jobApplicationRepository.save(application);
        return convertToJobApplicationResponse(updatedApplication);
    }

    public void withdrawApplication(Long applicationId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));


        if (!application.getFreelancer().getId().equals(currentUser.getId()) &&
                !currentUser.getRole().equals(Role.ADMIN)) {
            throw new RuntimeException("You can only withdraw your own applications");
        }


        if (application.getStatus() != ApplicationStatus.PENDING &&
                application.getStatus() != ApplicationStatus.SHORTLISTED) {
            throw new RuntimeException("Cannot withdraw application with status: " + application.getStatus());
        }

        application.setStatus(ApplicationStatus.WITHDRAWN);
        jobApplicationRepository.save(application);
    }

    public Optional<JobApplicationResponse> getApplicationById(Long applicationId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        Optional<JobApplication> application = jobApplicationRepository.findById(applicationId);

        if (application.isPresent()) {
            JobApplication app = application.get();


            boolean canView = app.getFreelancer().getId().equals(currentUser.getId()) || // Freelancer owns it
                    app.getJob().getClient().getId().equals(currentUser.getId()) || // Client owns the job
                    currentUser.getRole().equals(Role.ADMIN); // Admin can view all

            if (!canView) {
                throw new RuntimeException("You don't have permission to view this application");
            }

            return Optional.of(convertToJobApplicationResponse(app));
        }

        return Optional.empty();
    }

    public long getApplicationCountForJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        return jobApplicationRepository.countByJob(job);
    }

    private JobApplicationResponse convertToJobApplicationResponse(JobApplication application) {
        JobApplicationResponse response = new JobApplicationResponse();
        response.setId(application.getId());
        response.setJobId(application.getJob().getId());
        response.setJobTitle(application.getJob().getTitle());
        response.setCoverLetter(application.getCoverLetter());
        response.setProposedRate(application.getProposedRate());
        response.setEstimatedDeliveryDays(application.getEstimatedDeliveryDays());
        response.setStatus(application.getStatus());
        response.setAppliedAt(application.getAppliedAt());
        response.setUpdatedAt(application.getUpdatedAt());
        response.setClientFeedback(application.getClientFeedback());
        response.setPortfolioLinks(application.getPortfolioLinks());


        response.setFreelancerId(application.getFreelancer().getId());
        response.setFreelancerName(application.getFreelancer().getFirstName() + " " +
                application.getFreelancer().getLastName());
        response.setFreelancerEmail(application.getFreelancer().getEmail());


        response.setClientName(application.getJob().getClient().getFirstName() + " " +
                application.getJob().getClient().getLastName());
        response.setJobBudget(application.getJob().getBudget());
        response.setJobType(application.getJob().getJobType().name());
        response.setJobDescription(application.getJob().getDescription());
        response.setJobCreatedAt(application.getJob().getCreatedAt());

        return response;
    }
}