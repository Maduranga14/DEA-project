import React from 'react';
import { User, MapPin, Phone, Mail, Globe, Github, Linkedin, DollarSign, Calendar, Star } from 'lucide-react';
import { profileService } from '../../services/profileService';

const ProfileDisplay = ({ profile, showContactInfo = false }) => {
    const profilePictureUrl = profile?.profilePictureUrl
        ? profileService.getProfilePictureUrl(profile.profilePictureUrl)
        : null;

    if (!profile) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="animate-pulse">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                        <div className="flex-1">
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-white/20">
                        {profilePictureUrl ? (
                            <img
                                src={profilePictureUrl}
                                alt={`${profile.firstName} ${profile.lastName}`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <User className="w-8 h-8 text-white" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-white">
                            {profile.firstName} {profile.lastName}
                        </h2>
                        <p className="text-purple-100 capitalize">
                            {profile.role?.toLowerCase()}
                        </p>
                        {profile.location && (
                            <div className="flex items-center text-purple-100 text-sm mt-1">
                                <MapPin className="w-4 h-4 mr-1" />
                                {profile.location}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Bio */}
                {profile.bio && (
                    <div className="mb-6">
                        <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                    </div>
                )}

                {/* Professional Info for Freelancers */}
                {profile.role === 'FREELANCER' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {profile.hourlyRate && (
                            <div className="flex items-center text-gray-600">
                                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                                <span>${profile.hourlyRate}/hour</span>
                            </div>
                        )}
                        {profile.experienceYears && (
                            <div className="flex items-center text-gray-600">
                                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                                <span>{profile.experienceYears} years experience</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Skills */}
                {profile.skills && profile.skills.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {profile.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                                >
                  {skill}
                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Contact Information */}
                {showContactInfo && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact Information</h3>
                        <div className="space-y-2">
                            <div className="flex items-center text-gray-600">
                                <Mail className="w-5 h-5 mr-2" />
                                <a href={`mailto:${profile.email}`} className="hover:text-purple-600">
                                    {profile.email}
                                </a>
                            </div>
                            {profile.phoneNumber && (
                                <div className="flex items-center text-gray-600">
                                    <Phone className="w-5 h-5 mr-2" />
                                    <a href={`tel:${profile.phoneNumber}`} className="hover:text-purple-600">
                                        {profile.phoneNumber}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Social Links */}
                <div className="flex flex-wrap gap-4">
                    {profile.portfolioUrl && (
                        <a
                            href={profile.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
                        >
                            <Globe className="w-5 h-5 mr-1" />
                            <span className="text-sm">Portfolio</span>
                        </a>
                    )}
                    {profile.linkedinUrl && (
                        <a
                            href={profile.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            <Linkedin className="w-5 h-5 mr-1" />
                            <span className="text-sm">LinkedIn</span>
                        </a>
                    )}
                    {profile.githubUrl && (
                        <a
                            href={profile.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <Github className="w-5 h-5 mr-1" />
                            <span className="text-sm">GitHub</span>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileDisplay;