import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  Trash2
} from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationService.getMyApplications();
      setApplications(response.data);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    try {
      await applicationService.withdrawApplication(applicationId);
      toast.success('Application withdrawn successfully');
      loadApplications(); // Reload applications
    } catch (error) {
      console.error('Error withdrawing application:', error);
      toast.error(error.response?.data || 'Failed to withdraw application');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'SHORTLISTED':
        return <Eye className="w-5 h-5 text-blue-500" />;
      case 'WITHDRAWN':
        return <Trash2 className="w-5 h-5 text-gray-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'SHORTLISTED':
        return 'bg-blue-100 text-blue-800';
      case 'WITHDRAWN':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4">
        <div className="max-w-6xl mx-auto py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-300 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="max-w-6xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track the status of your job applications</p>
        </motion.div>

        {applications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-gray-600 mb-6">You haven't applied for any jobs yet.</p>
            <a
              href="/jobs"
              className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              Browse Jobs
            </a>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {applications.map((application, index) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  {/* Left Side - Job Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {application.jobTitle}
                        </h3>
                        <p className="text-gray-600 mb-3">Client: {application.clientName}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            <span>Proposed: ${application.proposedRate}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{application.estimatedDeliveryDays} days</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>Applied: {new Date(application.appliedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span>{application.status.replace('_', ' ')}</span>
                      </div>
                    </div>

                    {/* Cover Letter Preview */}
                    <div className="mb-4">
                      <p className="text-gray-700 line-clamp-2">
                        {application.coverLetter}
                      </p>
                    </div>

                    {/* Client Feedback */}
                    {application.clientFeedback && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-blue-900 mb-2">Client Feedback:</h4>
                        <p className="text-blue-800">{application.clientFeedback}</p>
                      </div>
                    )}
                  </div>

                  {/* Right Side - Actions */}
                  <div className="lg:ml-6 lg:min-w-[200px]">
                    <div className="text-right mb-4">
                      <div className="text-lg font-bold text-green-600">
                        Job Budget: ${application.jobBudget}
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {application.jobType?.toLowerCase().replace('_', ' ')}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2">
                      {(application.status === 'PENDING' || application.status === 'SHORTLISTED') && (
                        <button
                          onClick={() => handleWithdraw(application.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Withdraw</span>
                        </button>
                      )}
                      
                      <a
                        href={`/jobs/${application.jobId}`}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors text-center"
                      >
                        View Job
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;