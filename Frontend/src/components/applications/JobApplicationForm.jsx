import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  DollarSign, 
  Calendar, 
  FileText, 
  Link as LinkIcon,
  Send,
  X
} from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const JobApplicationForm = ({ job, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    if (!user || user.role !== 'FREELANCER') {
      toast.error('Only freelancers can apply for jobs');
      return;
    }

    setLoading(true);
    try {
      const applicationData = {
        jobId: job.id,
        coverLetter: data.coverLetter,
        proposedRate: parseFloat(data.proposedRate),
        estimatedDeliveryDays: parseInt(data.estimatedDeliveryDays),
        portfolioLinks: data.portfolioLinks
      };

      const response = await applicationService.applyForJob(applicationData);
      toast.success('Application submitted successfully!');
      onSuccess && onSuccess(response.data);
      onClose && onClose();
    } catch (error) {
      console.error('Error submitting application:', error);
      const errorMessage = error.response?.data || 'Failed to submit application';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Apply for Job</h2>
              <p className="text-gray-600 mt-1">{job.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Job Summary */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-500">Budget:</span>
              <p className="text-gray-900">${job.budget}</p>
            </div>
            <div>
              <span className="font-medium text-gray-500">Type:</span>
              <p className="text-gray-900 capitalize">{job.jobType?.toLowerCase().replace('_', ' ')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-500">Level:</span>
              <p className="text-gray-900 capitalize">{job.experienceLevel?.toLowerCase().replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Cover Letter *
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
              <textarea
                {...register('coverLetter', { 
                  required: 'Cover letter is required',
                  minLength: { value: 50, message: 'Cover letter must be at least 50 characters' }
                })}
                rows={6}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Tell the client why you're the perfect fit for this job..."
              />
            </div>
            {errors.coverLetter && (
              <p className="text-red-500 text-sm mt-2">{errors.coverLetter.message}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              {watch('coverLetter')?.length || 0} characters (minimum 50)
            </p>
          </div>

          {/* Proposed Rate and Delivery Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Your Proposed Rate ($) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  step="0.01"
                  {...register('proposedRate', { 
                    required: 'Proposed rate is required',
                    min: { value: 1, message: 'Rate must be at least $1' }
                  })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., 50.00"
                />
              </div>
              {errors.proposedRate && (
                <p className="text-red-500 text-sm mt-2">{errors.proposedRate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Estimated Delivery (Days) *
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  {...register('estimatedDeliveryDays', { 
                    required: 'Delivery time is required',
                    min: { value: 1, message: 'Delivery time must be at least 1 day' }
                  })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., 14"
                />
              </div>
              {errors.estimatedDeliveryDays && (
                <p className="text-red-500 text-sm mt-2">{errors.estimatedDeliveryDays.message}</p>
              )}
            </div>
          </div>

          {/* Portfolio Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Portfolio Links (Optional)
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
              <textarea
                {...register('portfolioLinks')}
                rows={3}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Add links to your portfolio, GitHub, or relevant work samples (one per line)"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Include links to showcase your relevant work and experience
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Application</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default JobApplicationForm;