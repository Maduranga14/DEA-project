import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ExternalLink, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const SubmissionsList = ({ userType = 'freelancer' }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSubmissions();
  }, [userType, filter]);

  const fetchSubmissions = async () => {
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      
      if (!token) {
        toast.error('No authentication token found. Please login again.');
        setLoading(false);
        return;
      }
      
      let endpoint = `/api/submissions/${userType}`;
      
      if (userType === 'client' && filter === 'pending') {
        endpoint = '/api/submissions/client/pending';
      }
      
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let filteredSubmissions = response.data;
      if (filter !== 'all' && filter !== 'pending') {
        filteredSubmissions = response.data.filter(sub => sub.status === filter.toUpperCase());
      }
      
      setSubmissions(filteredSubmissions);
    } catch (error) {
      toast.error('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (submissionId, status, feedback) => {
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      
      if (!token) {
        toast.error('No authentication token found. Please login again.');
        return;
      }
      
      await axios.put(`/api/submissions/${submissionId}/review`, {
        status,
        feedback
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Submission reviewed successfully');
      fetchSubmissions();
    } catch (error) {
      toast.error('Failed to review submission');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'APPROVED': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'REJECTED': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'REVISION_REQUESTED': return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'REVISION_REQUESTED': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading submissions...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {userType === 'client' ? 'Received Submissions' : 'My Submissions'}
        </h2>
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Submissions</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="revision_requested">Revision Requested</option>
        </select>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No submissions found
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <SubmissionCard
              key={submission.id}
              submission={submission}
              userType={userType}
              onReview={handleReview}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SubmissionCard = ({ submission, userType, onReview, getStatusIcon, getStatusColor }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [reviewStatus, setReviewStatus] = useState('APPROVED');

  const handleSubmitReview = () => {
    onReview(submission.id, reviewStatus, feedback);
    setShowReviewForm(false);
    setFeedback('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{submission.workTitle}</h3>
          <p className="text-sm text-gray-600">
            {userType === 'client' ? `From: ${submission.freelancerId}` : `To: ${submission.clientId}`}
          </p>
          <p className="text-sm text-gray-600">Project: {submission.projectId}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {getStatusIcon(submission.status)}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
            {submission.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {submission.description && (
        <p className="text-gray-700 mb-4">{submission.description}</p>
      )}

      <div className="flex items-center justify-between mb-4">
        <a
          href={submission.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <ExternalLink className="w-4 h-4" />
          <span>View Work</span>
        </a>
        
        <div className="text-sm text-gray-500">
          Submitted: {new Date(submission.submittedDate).toLocaleDateString()}
        </div>
      </div>

      {submission.clientFeedback && (
        <div className="bg-gray-50 p-3 rounded-md mb-4">
          <p className="text-sm font-medium text-gray-700">Client Feedback:</p>
          <p className="text-sm text-gray-600">{submission.clientFeedback}</p>
          {submission.reviewedDate && (
            <p className="text-xs text-gray-500 mt-1">
              Reviewed: {new Date(submission.reviewedDate).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {userType === 'client' && submission.status === 'PENDING' && (
        <div className="border-t pt-4">
          {!showReviewForm ? (
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Review Submission
            </button>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Decision
                </label>
                <select
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="APPROVED">Approve</option>
                  <option value="REJECTED">Reject</option>
                  <option value="REVISION_REQUESTED">Request Revision</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Provide feedback to the freelancer..."
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleSubmitReview}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Submit Review
                </button>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubmissionsList;