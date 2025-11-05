import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Clock,
    DollarSign,
    MapPin,
    Calendar,
    User,
    Star,
    Send,
    Bookmark,
    Share2,
    Eye,
    CheckCircle,
    AlertCircle,
    Building,
    Globe,
    Users,
    Award,
    MessageCircle
} from 'lucide-react';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../contexts/AuthContext';
import { sampleJobs } from '../../data/sampleData';
import JobApplicationForm from '../applications/JobApplicationForm';
import toast from 'react-hot-toast';

const JobDetailView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [applicationCount, setApplicationCount] = useState(0);
    const [hasApplied, setHasApplied] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [relatedJobs, setRelatedJobs] = useState([]);

    useEffect(() => {
        loadJobDetails();
        loadApplicationCount();
        if (user) {
            checkApplicationStatus();
        }
        loadRelatedJobs();
    }, [id, user]);

    const loadJobDetails = async () => {
        try {
            setLoading(true);
            console.log('Loading job details for ID:', id);
            const response = await jobService.getJobById(id);
            console.log('Job details loaded:', response.data);
            setJob(response.data);
        } catch (error) {
            console.error('Error loading job details:', error);
            
            // Try to find job in sample data as fallback
            const sampleJob = sampleJobs.find(job => job.id === parseInt(id));
            if (sampleJob) {
                console.log('Using sample job data:', sampleJob);
                setJob(sampleJob);
                return;
            }
            
            if (error.response?.status === 401) {
                setError('Please login to view job details');
            } else if (error.response?.status === 404) {
                setError('Job not found');
            } else {
                setError('Failed to load job details');
                toast.error('Failed to load job details');
            }
        } finally {
            setLoading(false);
        }
    };

    const loadApplicationCount = async () => {
        try {
            const response = await applicationService.getApplicationCount(id);
            setApplicationCount(response.data);
        } catch (error) {
            console.error('Error loading application count:', error);
            // Set default count if API fails
            setApplicationCount(0);
        }
    };

    const checkApplicationStatus = async () => {
        if (!user || user.role !== 'FREELANCER') return;
        
        try {
            // For now, we'll check by getting user's applications and seeing if this job is included
            const response = await applicationService.getMyApplications();
            const hasAppliedToJob = response.data.some(app => app.jobId === parseInt(id));
            setHasApplied(hasAppliedToJob);
        } catch (error) {
            console.error('Error checking application status:', error);
            // Don't show error for unauthenticated users
        }
    };

    const loadRelatedJobs = async () => {
        try {
            const response = await jobService.getAllJobs();
            const allJobs = response.data || [];
            // Filter out current job and get similar jobs based on skills
            const related = allJobs
                .filter(j => j.id !== parseInt(id))
                .slice(0, 3);
            setRelatedJobs(related);
        } catch (error) {
            console.error('Error loading related jobs:', error);
        }
    };

    const handleApply = () => {
        if (!user) {
            toast.error('Please login to apply for jobs');
            return;
        }
        if (user.role !== 'FREELANCER') {
            toast.error('Only freelancers can apply for jobs');
            return;
        }
        if (hasApplied) {
            toast.info('You have already applied for this job');
            return;
        }
        setShowApplicationForm(true);
    };

    const handleApplicationSuccess = () => {
        setApplicationCount(prev => prev + 1);
        setHasApplied(true);
        setShowApplicationForm(false);
        toast.success('Application submitted successfully!');
    };

    const handleSaveJob = () => {
        setIsSaved(!isSaved);
        toast.success(isSaved ? 'Job removed from saved' : 'Job saved successfully');
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: job.title,
                text: job.description,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Job link copied to clipboard');
        }
    };

    const formatBudget = (job) => {
        const jobType = job.jobType || job.type;
        const isHourly = jobType === 'HOURLY';
        return `$${job.budget}${isHourly ? '/hr' : ''}`;
    };

    const formatJobType = (job) => {
        const jobType = job.jobType || job.type || 'fixed';
        return jobType.toLowerCase().replace('_', ' ');
    };

    const formatDuration = (job) => {
        return job.estimatedDuration || job.duration || 'Not specified';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 pt-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/2 mb-6"></div>
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-300 rounded"></div>
                                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                                <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 pt-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
                        <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
                        <button
                            onClick={() => navigate('/jobs')}
                            className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                        >
                            Back to Jobs
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 pt-20">
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/jobs')}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Jobs</span>
                </motion.button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex-1">
                                        <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                                <Clock className="w-4 h-4 mr-2" />
                                                {formatJobType(job)}
                                            </div>
                                            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                                <DollarSign className="w-4 h-4 mr-2" />
                                                {formatBudget(job)}
                                            </div>
                                            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                {job.location || 'Remote'}
                                            </div>
                                            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                {formatDuration(job)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 ml-4">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleSaveJob}
                                            className={`p-3 rounded-full backdrop-blur-sm transition-colors ${
                                                isSaved ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'
                                            }`}
                                        >
                                            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleShare}
                                            className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
                                        >
                                            <Share2 className="w-5 h-5" />
                                        </motion.button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4 text-sm">
                                        <div className="flex items-center">
                                            <Eye className="w-4 h-4 mr-1" />
                                            {applicationCount} applications
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : job.posted || 'recently'}
                                        </div>
                                    </div>
                                    
                                    {hasApplied && (
                                        <div className="flex items-center bg-green-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Applied
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                {/* Description */}
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
                                    <div className="prose prose-gray max-w-none">
                                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                            {job.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Skills Required */}
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Skills Required</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {(job.requiredSkills || job.skills || []).map((skill, index) => (
                                            <motion.span
                                                key={skill}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium"
                                            >
                                                {skill}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>

                                {/* Project Details */}
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Project Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <div className="flex items-center mb-2">
                                                <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                                                <span className="font-semibold text-gray-900">Budget</span>
                                            </div>
                                            <p className="text-2xl font-bold text-green-600">{formatBudget(job)}</p>
                                            <p className="text-sm text-gray-600 capitalize">{formatJobType(job)} project</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <div className="flex items-center mb-2">
                                                <Clock className="w-5 h-5 text-blue-600 mr-2" />
                                                <span className="font-semibold text-gray-900">Duration</span>
                                            </div>
                                            <p className="text-xl font-bold text-gray-900">{formatDuration(job)}</p>
                                            <p className="text-sm text-gray-600">Estimated timeline</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <div className="flex items-center mb-2">
                                                <MapPin className="w-5 h-5 text-purple-600 mr-2" />
                                                <span className="font-semibold text-gray-900">Location</span>
                                            </div>
                                            <p className="text-xl font-bold text-gray-900">{job.location || 'Remote'}</p>
                                            <p className="text-sm text-gray-600">Work location</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <div className="flex items-center mb-2">
                                                <Users className="w-5 h-5 text-orange-600 mr-2" />
                                                <span className="font-semibold text-gray-900">Applications</span>
                                            </div>
                                            <p className="text-xl font-bold text-gray-900">{applicationCount}</p>
                                            <p className="text-sm text-gray-600">Total applications</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Apply Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl shadow-lg p-6 mb-6"
                        >
                            <div className="text-center mb-6">
                                <div className="text-3xl font-bold text-green-600 mb-2">
                                    {formatBudget(job)}
                                </div>
                                <div className="text-gray-600 capitalize">
                                    {formatJobType(job)} • {formatDuration(job)}
                                </div>
                            </div>

                            {user && user.role === 'FREELANCER' ? (
                                <motion.button
                                    whileHover={{ scale: hasApplied ? 1 : 1.02 }}
                                    whileTap={{ scale: hasApplied ? 1 : 0.98 }}
                                    onClick={handleApply}
                                    disabled={hasApplied}
                                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center space-x-2 ${
                                        hasApplied
                                            ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg'
                                    }`}
                                >
                                    {hasApplied ? (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            <span>Applied</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            <span>Apply Now</span>
                                        </>
                                    )}
                                </motion.button>
                            ) : (
                                <div className="text-center text-gray-600">
                                    {!user ? 'Please login to apply' : 'Only freelancers can apply'}
                                </div>
                            )}

                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Applications</span>
                                    <span className="font-semibold">{applicationCount}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Client Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl shadow-lg p-6 mb-6"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-4">About the Client</h3>
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                    {(job.clientName || job.client?.name || 'A').charAt(0)}
                                </div>
                                <div className="ml-4">
                                    <div className="font-semibold text-gray-900">
                                        {job.clientName || job.client?.name || 'Anonymous Client'}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                                        {job.client?.rating || '4.5'}/5 rating
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-gray-600">
                                        <Building className="w-4 h-4 mr-2" />
                                        <span>Company</span>
                                    </div>
                                    <span className="font-medium text-gray-900">
                                        {job.client?.company || 'Not specified'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-gray-600">
                                        <Globe className="w-4 h-4 mr-2" />
                                        <span>Location</span>
                                    </div>
                                    <span className="font-medium text-gray-900">
                                        {job.client?.location || job.location || 'Remote'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-gray-600">
                                        <Award className="w-4 h-4 mr-2" />
                                        <span>Jobs Posted</span>
                                    </div>
                                    <span className="font-medium text-gray-900">
                                        {job.client?.jobsPosted || '5+'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Related Jobs */}
                        {relatedJobs.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white rounded-2xl shadow-lg p-6"
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Similar Jobs</h3>
                                <div className="space-y-4">
                                    {relatedJobs.map((relatedJob) => (
                                        <div
                                            key={relatedJob.id}
                                            onClick={() => navigate(`/jobs/${relatedJob.id}`)}
                                            className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer"
                                        >
                                            <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                                {relatedJob.title}
                                            </h4>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-green-600 font-semibold">
                                                    ${relatedJob.budget}{relatedJob.type === 'HOURLY' ? '/hr' : ''}
                                                </span>
                                                <span className="text-gray-600">
                                                    {relatedJob.location || 'Remote'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Job Application Form Modal */}
            {showApplicationForm && (
                <JobApplicationForm
                    job={job}
                    onClose={() => setShowApplicationForm(false)}
                    onSuccess={handleApplicationSuccess}
                />
            )}
        </div>
    );
};

export default JobDetailView;