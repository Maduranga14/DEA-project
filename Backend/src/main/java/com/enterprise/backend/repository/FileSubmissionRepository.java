package com.enterprise.backend.repository;

import com.enterprise.backend.entity.FileSubmission;
import com.enterprise.backend.entity.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FileSubmissionRepository extends JpaRepository<FileSubmission, Long> {

    List<FileSubmission> findByFreelancerIdOrderBySubmittedDateDesc(String freelancerId);

    List<FileSubmission> findByClientIdOrderBySubmittedDateDesc(String clientId);

    List<FileSubmission> findByProjectIdOrderBySubmittedDateDesc(String projectId);

    List<FileSubmission> findByFreelancerIdAndProjectId(String freelancerId, String projectId);

    List<FileSubmission> findByClientIdAndStatus(String clientId, SubmissionStatus status);

    List<FileSubmission> findByFreelancerIdAndStatus(String freelancerId, SubmissionStatus status);
}