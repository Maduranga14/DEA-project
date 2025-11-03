package com.enterprise.backend.repository;

import com.enterprise.backend.entity.ApplicationStatus;
import com.enterprise.backend.entity.Job;
import com.enterprise.backend.entity.JobApplication;
import com.enterprise.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    // Find applications by freelancer
    List<JobApplication> findByFreelancerOrderByAppliedAtDesc(User freelancer);

    // Find applications by job
    List<JobApplication> findByJobOrderByAppliedAtDesc(Job job);

    // Find applications by job and status
    List<JobApplication> findByJobAndStatusOrderByAppliedAtDesc(Job job, ApplicationStatus status);

    // Find applications by freelancer and status
    List<JobApplication> findByFreelancerAndStatusOrderByAppliedAtDesc(User freelancer, ApplicationStatus status);

    // Check if freelancer already applied to job
    boolean existsByJobAndFreelancer(Job job, User freelancer);

    // Find application by job and freelancer
    Optional<JobApplication> findByJobAndFreelancer(Job job, User freelancer);

    // Find applications for jobs owned by a client
    @Query("SELECT ja FROM JobApplication ja WHERE ja.job.client = :client ORDER BY ja.appliedAt DESC")
    List<JobApplication> findApplicationsForClientJobs(@Param("client") User client);

    // Find applications for jobs owned by a client with pagination
    @Query("SELECT ja FROM JobApplication ja WHERE ja.job.client = :client ORDER BY ja.appliedAt DESC")
    Page<JobApplication> findApplicationsForClientJobsPaginated(@Param("client") User client, Pageable pageable);

    // Count applications by job
    long countByJob(Job job);

    // Count applications by status for a job
    long countByJobAndStatus(Job job, ApplicationStatus status);

    // Count applications by freelancer
    long countByFreelancer(User freelancer);

    // Find recent applications (last 30 days)
    @Query("SELECT ja FROM JobApplication ja WHERE ja.appliedAt >= :since ORDER BY ja.appliedAt DESC")
    List<JobApplication> findRecentApplications(@Param("since") java.time.LocalDateTime since);
}