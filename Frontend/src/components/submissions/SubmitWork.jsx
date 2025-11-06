import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';

const SubmitWork = ({ onSubmissionSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/submissions/submit', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Work submitted successfully!');
      reset();
      if (onSubmissionSuccess) onSubmissionSuccess(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit work');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Submit Completed Work</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client ID
          </label>
          <input
            type="text"
            {...register('clientId', { required: 'Client ID is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter client ID"
          />
          {errors.clientId && (
            <p className="text-red-500 text-sm mt-1">{errors.clientId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project ID
          </label>
          <input
            type="text"
            {...register('projectId', { required: 'Project ID is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter project ID"
          />
          {errors.projectId && (
            <p className="text-red-500 text-sm mt-1">{errors.projectId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Work Title
          </label>
          <input
            type="text"
            {...register('workTitle', { required: 'Work title is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter work title"
          />
          {errors.workTitle && (
            <p className="text-red-500 text-sm mt-1">{errors.workTitle.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            File URL
          </label>
          <input
            type="url"
            {...register('fileUrl', { 
              required: 'File URL is required',
              pattern: {
                value: /^https?:\/\/.*/,
                message: 'Must be a valid URL starting with http:// or https://'
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://drive.google.com/... or https://dropbox.com/..."
          />
          {errors.fileUrl && (
            <p className="text-red-500 text-sm mt-1">{errors.fileUrl.message}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Upload your files to Google Drive, Dropbox, or any cloud storage and paste the shareable link here
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add any notes or description about your work..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Work'}
        </button>
      </form>
    </div>
  );
};

export default SubmitWork;