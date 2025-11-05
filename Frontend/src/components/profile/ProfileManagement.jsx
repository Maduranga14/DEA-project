import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { User, Camera, Save, MapPin, Phone, Mail, Globe, Github, Linkedin, DollarSign, Calendar } from 'lucide-react';
import { profileService } from '../../services/profileService';
import { useAuth } from '../../contexts/AuthContext';

const ProfileManagement = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);

    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm();
    const { updateUser } = useAuth();

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const profileData = await profileService.getProfile();
            setProfile(profileData);


            Object.keys(profileData).forEach(key => {
                if (key === 'skills' && Array.isArray(profileData[key])) {

                    setValue(key, profileData[key].join(', '));
                } else {
                    setValue(key, profileData[key]);
                }
            });


            if (profileData.profilePictureUrl) {
                setProfilePictureUrl(profileService.getProfilePictureUrl(profileData.profilePictureUrl));
            }
        } catch (error) {
            toast.error('Failed to load profile');
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        try {

            if (typeof data.skills === 'string') {
                data.skills = data.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
            }

            const updatedProfile = await profileService.updateProfile(data);
            setProfile(updatedProfile);


            Object.keys(updatedProfile).forEach(key => {
                if (key === 'skills' && Array.isArray(updatedProfile[key])) {

                    setValue(key, updatedProfile[key].join(', '));
                } else {
                    setValue(key, updatedProfile[key]);
                }
            });


            updateUser({
                firstName: updatedProfile.firstName,
                lastName: updatedProfile.lastName,
                email: updatedProfile.email,
                profilePictureUrl: updatedProfile.profilePictureUrl
            });

            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update profile');
            console.error('Error updating profile:', error);
        }
    };

    const handleProfilePictureUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;


        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }


        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        setUploading(true);
        try {
            const result = await profileService.uploadProfilePicture(file);
            setProfilePictureUrl(profileService.getProfilePictureUrl(result.filename));


            await loadProfile();


            updateUser({
                profilePictureUrl: result.filename
            });

            toast.success('Profile picture updated successfully!');
        } catch (error) {
            toast.error('Failed to upload profile picture');
            console.error('Error uploading profile picture:', error);
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6">
                        <h1 className="text-3xl font-bold text-white">Profile Management</h1>
                        <p className="text-purple-100 mt-2">Update your profile information and settings</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-8">
                        {/* Profile Picture Section */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                                    {profilePictureUrl ? (
                                        <img
                                            src={profilePictureUrl}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User className="w-16 h-16 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 cursor-pointer hover:bg-purple-700 transition-colors">
                                    <Camera className="w-5 h-5 text-white" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePictureUpload}
                                        className="hidden"
                                        disabled={uploading}
                                    />
                                </label>
                            </div>
                            {uploading && (
                                <p className="text-sm text-gray-600 mt-2">Uploading...</p>
                            )}
                        </div>

                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    {...register('firstName', { required: 'First name is required' })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                {errors.firstName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    {...register('lastName', { required: 'Last name is required' })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                {errors.lastName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Mail className="inline w-4 h-4 mr-1" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    {...register('email', { required: 'Email is required' })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Phone className="inline w-4 h-4 mr-1" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    {...register('phoneNumber')}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <MapPin className="inline w-4 h-4 mr-1" />
                                    Location
                                </label>
                                <input
                                    type="text"
                                    {...register('location')}
                                    placeholder="City, Country"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Bio Section */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bio
                            </label>
                            <textarea
                                {...register('bio')}
                                rows={4}
                                placeholder="Tell us about yourself..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        {/* Professional Information (for freelancers) */}
                        {profile?.role === 'FREELANCER' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <DollarSign className="inline w-4 h-4 mr-1" />
                                        Hourly Rate (USD)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register('hourlyRate')}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Calendar className="inline w-4 h-4 mr-1" />
                                        Years of Experience
                                    </label>
                                    <input
                                        type="number"
                                        {...register('experienceYears')}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Skills (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        {...register('skills')}
                                        placeholder="JavaScript, React, Node.js, Python..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Social Links */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Globe className="inline w-4 h-4 mr-1" />
                                    Portfolio URL
                                </label>
                                <input
                                    type="url"
                                    {...register('portfolioUrl')}
                                    placeholder="https://yourportfolio.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Linkedin className="inline w-4 h-4 mr-1" />
                                    LinkedIn URL
                                </label>
                                <input
                                    type="url"
                                    {...register('linkedinUrl')}
                                    placeholder="https://linkedin.com/in/username"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Github className="inline w-4 h-4 mr-1" />
                                    GitHub URL
                                </label>
                                <input
                                    type="url"
                                    {...register('githubUrl')}
                                    placeholder="https://github.com/username"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileManagement;