import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, 
    Clock, 
    DollarSign, 
    Calendar, 
    Eye, 
    Check, 
    X, 
    MessageSquare,
    ExternalLink,
    Star,
    Award,
    Briefcase
} from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import { toast } from 'react-hot-toast';

const ClientApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [actionType, setActionType] = useState(''); // 'accept' or 'reject'
    const [processingAction, setProcessingAction] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            console.log('Fetching applications for client...');
            const response = await applicationService.getApplicationsForMyJobs();
            console.log('Applications response:', response);
            setApplications(response.data);
        } catch (error) {
            console.error('Error fetching applications:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = (application, action) => {
        setSelectedApplication(application);
        setActionType(action);
        setShowFeedbackModal(true);
        setFeedback('');
    };

    const submitAction = async () => {
        if (!feedback.trim()) {
            toast.error('Please provide feedback');
            return;
        }

        try {
            setProcessingAction(true);
            console.log(`Attempting to ${actionType} application:`, {
                applicationId: selectedApplication.id,
                feedback: feedback,
                actionType: actionType
            });
            
            if (actionType === 'accept') {
                const response = await applicationService.acceptApplication(selectedApplication.id, feedback);
                console.log('Accept response:', response);
                toast.success('Application accepted successfully!');
            } else {
                const response = await applicationService.rejectApplication(selectedApplication.id, feedback);
                console.log('Reject response:', response);
                toast.success('Application rejected');
            }

            setShowFeedbackModal(false);
            setSelectedApplication(null);
            setFeedback('');
            fetchApplications(); // Refresh the list
        } catch (error) {
            console.error('Error processing application:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            toast.error(`Failed to ${actionType} application: ${error.response?.data || error.message}`);
        } finally {
            setProcessingAction(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            PENDING: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending Review' },
            SHORTLISTED: { color: 'bg-blue-100 text-blue-800', text: 'Shortlisted' },
            ACCEPTED: { color: 'bg-green-100 text-green-800', text: 'Accepted' },
            REJECTED: { color: 'bg-red-100 text-red-800', text: 'Rejected' },
            WITHDRAWN: { color: 'bg-gray-100 text-gray-800', text: 'Withdrawn' }
        };

        const config = statusConfig[status] || statusConfig.PENDING;
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                {config.text}
            </span>
        );
    };

    const groupApplicationsByJob = () => {
        const grouped = {};
        applications.forEach(app => {
            const jobId = app.jobId;
            if (!grouped[jobId]) {
                grouped[jobId] = {
                    job: {
                        id: app.jobId,
                        title: app.jobTitle,
                        description: app.jobDescription,
                        budget: app.jobBudget,
                        createdAt: app.jobCreatedAt
                    },
                    applications: []
                };
            }
            grouped[jobId].applications.push(app);
        });
        return grouped;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading applications...</p>
                </div>
            </div>
        );
    }

    const groupedApplications = groupApplicationsByJob();

    if (Object.keys(groupedApplications).length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Applications</h1>
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                        <p className="text-gray-600">
                            Applications for your posted jobs will appear here. 
                            Make sure your jobs are published and visible to freelancers.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Applications</h1>
                    <p className="text-gray-600">Review and manage applications for your posted jobs</p>
                </div>

                <div className="space-y-8">
                    {Object.entries(groupedApplications).map(([jobId, { job, applications }]) => (
                        <motion.div
                            key={jobId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg shadow-sm overflow-hidden"
                        >
                            {/* Job Header */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h2>
                                        <p className="text-gray-600 mb-3">{job.description}</p>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <DollarSign className="w-4 h-4 mr-1" />
                                                ${job.budget}
                                            </div>
                                            <div className="flex items-center">
                                                <User className="w-4 h-4 mr-1" />
                                                {applications.length} applications
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm text-gray-500">Posted</span>
                                        <p className="font-medium">
                                            {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Applications List */}
                            <div className="divide-y divide-gray-200">
                                {applications.map((application) => (
                                    <motion.div
                                        key={application.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="p-6 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                                                                        {application.freelancerName.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {application.freelancerName}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {application.freelancerEmail}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                {getStatusBadge(application.status)}
                                                <span className="text-sm text-gray-500">
                                                    {new Date(application.appliedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Application Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div className="flex items-center space-x-2">
                                                <DollarSign className="w-4 h-4 text-green-600" />
                                                <span className="text-sm text-gray-600">Proposed Rate:</span>
                                                <span className="font-medium">${application.proposedRate}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Clock className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm text-gray-600">Delivery:</span>
                                                <span className="font-medium">{application.estimatedDeliveryDays} days</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="w-4 h-4 text-purple-600" />
                                                <span className="text-sm text-gray-600">Applied:</span>
                                                <span className="font-medium">
                                                    {new Date(application.appliedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Cover Letter */}
                                        <div className="mb-4">
                                            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                                                <MessageSquare className="w-4 h-4 mr-2" />
                                                Cover Letter
                                            </h4>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-gray-700 leading-relaxed">
                                                    {application.coverLetter}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Portfolio Links */}
                                        {application.portfolioLinks && (
                                            <div className="mb-4">
                                                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                                                    <ExternalLink className="w-4 h-4 mr-2" />
                                                    Portfolio Links
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {application.portfolioLinks.split(',').map((link, index) => (
                                                        <a
                                                            key={index}
                                                            href={link.trim()}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                                                        >
                                                            <ExternalLink className="w-3 h-3 mr-1" />
                                                            Portfolio {index + 1}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Client Feedback */}
                                        {application.clientFeedback && (
                                            <div className="mb-4">
                                                <h4 className="font-medium text-gray-900 mb-2">Your Feedback</h4>
                                                <div className="bg-blue-50 rounded-lg p-4">
                                                    <p className="text-gray-700">{application.clientFeedback}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        {application.status === 'PENDING' && (
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => handleAction(application, 'accept')}
                                                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                >
                                                    <Check className="w-4 h-4 mr-2" />
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleAction(application, 'reject')}
                                                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                >
                                                    <X className="w-4 h-4 mr-2" />
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Feedback Modal */}
            <AnimatePresence>
                {showFeedbackModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={() => setShowFeedbackModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-lg p-6 w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-semibold mb-4">
                                {actionType === 'accept' ? 'Accept Application' : 'Reject Application'}
                            </h3>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Feedback for {selectedApplication?.freelancerName}
                                </label>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder={
                                        actionType === 'accept' 
                                            ? "Congratulations! Please provide next steps or project details..."
                                            : "Thank you for your application. Please provide constructive feedback..."
                                    }
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={submitAction}
                                    disabled={processingAction || !feedback.trim()}
                                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                                        actionType === 'accept'
                                            ? 'bg-green-600 hover:bg-green-700 text-white'
                                            : 'bg-red-600 hover:bg-red-700 text-white'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {processingAction ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Processing...
                                        </div>
                                    ) : (
                                        `${actionType === 'accept' ? 'Accept' : 'Reject'} Application`
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowFeedbackModal(false)}
                                    disabled={processingAction}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ClientApplications;