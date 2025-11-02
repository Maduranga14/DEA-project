package com.enterprise.backend.repository;

import com.enterprise.backend.entity.Job;
import com.enterprise.backend.entity.JobStatus;
import com.enterprise.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    // Find jobs by client
    List<Job> findByClientOrderByCreatedAtDesc(User client);

    // Find jobs by status
    List<Job> findByStatusOrderByCreatedAtDesc(JobStatus status);

    // Find jobs by freelancer
    List<Job> findByFreelancerOrderByCreatedAtDesc(User freelancer);

    // Find open jobs (paginated)
    Page<Job> findByStatusOrderByCreatedAtDesc(JobStatus status, Pageable pageable);

    // Search jobs by title or description
    @Query("SELECT j FROM Job j WHERE " +
            "(LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "j.status = :status")
    Page<Job> searchByKeywordAndStatus(@Param("keyword") String keyword,
                                       @Param("status") JobStatus status,
                                       Pageable pageable);

    // Find jobs by skills
    @Query("SELECT DISTINCT j FROM Job j JOIN j.requiredSkills s WHERE " +
            "LOWER(s) IN :skills AND j.status = :status")
    Page<Job> findByRequiredSkillsInAndStatus(@Param("skills") List<String> skills,
                                              @Param("status") JobStatus status,
                                              Pageable pageable);

    // Count jobs by client
    long countByClient(User client);

    // Count jobs by status
    long countByStatus(JobStatus status);
}