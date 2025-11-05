import React from 'react';
import { User, MapPin, Star, DollarSign } from 'lucide-react';
import { profileService } from '../../services/profileService';

const ProfileCard = ({ profile, compact = false, showRate = true }) => {
    const profilePictureUrl = profile?.profilePictureUrl
        ? profileService.getProfilePictureUrl(profile.profilePictureUrl)
        : null;

    if (!profile) return null;

    if (compact) {
        return (
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    {profilePictureUrl ? (
                        <img
                            src={profilePictureUrl}
                            alt={`${profile.firstName} ${profile.lastName}`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-400" />
                        </div>
                    )}
                </div>
                <div>
                    <h4 className="font-medium text-gray-900">
                        {profile.firstName} {profile.lastName}
                    </h4>
                    <p className="text-sm text-gray-500 capitalize">
                        {profile.role?.toLowerCase()}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    {profilePictureUrl ? (
                        <img
                            src={profilePictureUrl}
                            alt={`${profile.firstName} ${profile.lastName}`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <User className="w-8 h-8 text-gray-400" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {profile.firstName} {profile.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 capitalize mb-2">
                        {profile.role?.toLowerCase()}
                    </p>

                    {profile.location && (
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            {profile.location}
                        </div>
                    )}

                    {profile.bio && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {profile.bio}
                        </p>
                    )}

                    {profile.role === 'FREELANCER' && showRate && profile.hourlyRate && (
                        <div className="flex items-center text-sm text-green-600 font-medium">
                            <DollarSign className="w-4 h-4 mr-1" />
                            ${profile.hourlyRate}/hour
                        </div>
                    )}

                    {profile.skills && profile.skills.length > 0 && (
                        <div className="mt-3">
                            <div className="flex flex-wrap gap-1">
                                {profile.skills.slice(0, 3).map((skill, index) => (
                                    <span
                                        key={index}
                                        className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium"
                                    >
                    {skill}
                  </span>
                                ))}
                                {profile.skills.length > 3 && (
                                    <span className="text-xs text-gray-500 px-2 py-1">
                    +{profile.skills.length - 3} more
                  </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;