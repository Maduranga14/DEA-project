package com.enterprise.backend.service;

import com.enterprise.backend.dto.ProfileResponse;
import com.enterprise.backend.dto.ProfileUpdateRequest;
import com.enterprise.backend.entity.User;
import com.enterprise.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public ProfileResponse getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return mapToProfileResponse(user);
    }

    public ProfileResponse updateProfile(String username, ProfileUpdateRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Update user fields
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getLocation() != null) {
            user.setLocation(request.getLocation());
        }
        if (request.getHourlyRate() != null) {
            user.setHourlyRate(request.getHourlyRate());
        }
        if (request.getExperienceYears() != null) {
            user.setExperienceYears(request.getExperienceYears());
        }
        if (request.getPortfolioUrl() != null) {
            user.setPortfolioUrl(request.getPortfolioUrl());
        }
        if (request.getLinkedinUrl() != null) {
            user.setLinkedinUrl(request.getLinkedinUrl());
        }
        if (request.getGithubUrl() != null) {
            user.setGithubUrl(request.getGithubUrl());
        }
        if (request.getSkills() != null) {
            user.setSkills(request.getSkills());
        }

        User savedUser = userRepository.save(user);
        return mapToProfileResponse(savedUser);
    }

    public String updateProfilePicture(String username, MultipartFile file) throws IOException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Validate file
        if (!fileStorageService.isValidImageFile(file)) {
            throw new IllegalArgumentException("Invalid file type. Only JPEG, PNG, and GIF are allowed.");
        }

        // Check file size (5MB limit)
        long maxSize = 5 * 1024 * 1024; // 5MB
        if (!fileStorageService.isValidFileSize(file, maxSize)) {
            throw new IllegalArgumentException("File size exceeds 5MB limit.");
        }

        // Delete old profile picture if exists
        if (user.getProfilePictureUrl() != null) {
            try {
                fileStorageService.deleteFile(user.getProfilePictureUrl());
            } catch (IOException e) {
                // Log error but continue with upload
                System.err.println("Failed to delete old profile picture: " + e.getMessage());
            }
        }

        // Store new file
        String filename = fileStorageService.storeFile(file);
        user.setProfilePictureUrl(filename);
        userRepository.save(user);

        return filename;
    }

    private ProfileResponse mapToProfileResponse(User user) {
        ProfileResponse response = new ProfileResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setRole(user.getRole());
        response.setProfilePictureUrl(user.getProfilePictureUrl());
        response.setBio(user.getBio());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setLocation(user.getLocation());
        response.setHourlyRate(user.getHourlyRate());
        response.setExperienceYears(user.getExperienceYears());
        response.setPortfolioUrl(user.getPortfolioUrl());
        response.setLinkedinUrl(user.getLinkedinUrl());
        response.setGithubUrl(user.getGithubUrl());
        response.setSkills(user.getSkills());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        return response;
    }
}