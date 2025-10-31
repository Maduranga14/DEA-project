import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  ArrowLeft,
  DollarSign,
  Clock,
  Calendar,
  FileText,
  Plus,
  X,
  Upload
} from 'lucide-react';
import { jobService } from '../../services/jobService';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const JobPost = () => {
  const [step, setStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const { user } = useAuth();
  const [currentSkill, setCurrentSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const watchJobType = watch('jobType');

  const addSkill = () => {
    if (currentSkill.trim() && !selectedSkills.includes(currentSkill.trim())) {
      setSelectedSkills([...selectedSkills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      // Check if user is authenticated and is a client
      if (!user) {
        toast.error('Please log in to post a project');
        navigate('/login');
        return;
      }
      
      if (user.role !== 'CLIENT') {
        toast.error('Only clients can post projects');
        return;
      }

      const projectData = {
        title: data.title,
        description: data.description,
        budget: parseFloat(data.budget),
        requiredSkills: selectedSkills, // Use selectedSkills from state
        deadline: data.deadline ? new Date(data.deadline).toISOString() : null
      };

      console.log('Sending project data:', projectData);
      console.log('User:', user);
      
      const response = await jobService.createJob(projectData);
      
      toast.success('Project posted successfully!');
      navigate('/jobs');
    } catch (error) {
      console.error('Error creating project:', error);
      
      if (error.response?.status === 401) {
        toast.error('Please log in to post a project');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('You need to be a client to post projects');
      } else {
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error || 
                            'Failed to post project. Please try again.';
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!watch('title') || !watch('description') || !watch('jobType')) {
        toast.error('Please fill in all required fields');
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Jobs
          </button>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Post a New Job
          </h1>
          <p className="text-gray-600 text-lg">
            Find the perfect freelancer for your project
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-300 ${
                    step >= stepNumber
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {stepNumber}
                  </div>
                  <span className={`text-sm mt-2 font-medium ${
                    step >= stepNumber ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {stepNumber === 1 ? 'Details' : stepNumber === 2 ? 'Skills' : 'Review'}
                  </span>
                </div>
                {stepNumber < 3 && (
                  <div className={`flex-1 h-1 mx-4 transition-all duration-300 ${
                    step > stepNumber ? 'bg-blue-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="max-w-4xl mx-auto">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Job Details
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      {...register('title', { required: 'Job title is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                      placeholder="e.g., Senior React Developer needed for SaaS platform"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-2">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Job Description *
                    </label>
                    <textarea
                      rows={6}
                      {...register('description', { required: 'Description is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg resize-none"
                      placeholder="Describe the project, responsibilities, and requirements..."
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-2">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Job Type *
                      </label>
                      <select
                        {...register('jobType', { required: 'Job type is required' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                      >
                        <option value="">Select job type</option>
                        <option value="FIXED">Fixed Price</option>
                        <option value="HOURLY">Hourly</option>
                      </select>
                      {errors.jobType && (
                        <p className="text-red-500 text-sm mt-2">{errors.jobType.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Budget {watchJobType === 'HOURLY' ? '($/hr)' : '($)'} *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="number"
                          step="0.01"
                          {...register('budget', { 
                            required: 'Budget is required',
                            min: { value: 1, message: 'Budget must be at least $1' }
                          })}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                          placeholder={watchJobType === 'HOURLY' ? 'e.g., 50' : 'e.g., 5000'}
                        />
                      </div>
                      {errors.budget && (
                        <p className="text-red-500 text-sm mt-2">{errors.budget.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Project Duration
                      </label>
                      <select
                        {...register('duration')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                      >
                        <option value="">Select duration</option>
                        <option value="<1month">Less than 1 month</option>
                        <option value="1-3months">1-3 months</option>
                        <option value="3-6months">3-6 months</option>
                        <option value=">6months">More than 6 months</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Application Deadline *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="date"
                          {...register('deadline', { required: 'Deadline is required' })}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                        />
                      </div>
                      {errors.deadline && (
                        <p className="text-red-500 text-sm mt-2">{errors.deadline.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Location
                    </label>
                    <input
                      type="text"
                      {...register('location')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                      placeholder="e.g., Remote, New York, NY, etc."
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-8">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={nextStep}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    Continue to Skills
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Required Skills
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Add Skills *
                    </label>
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                        placeholder="e.g., React, Node.js, UI/UX Design..."
                      />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addSkill}
                        className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Add</span>
                      </motion.button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Press Enter or click Add to include skills
                    </p>
                  </div>

                  {skills.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Selected Skills ({skills.length})
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <motion.span
                            key={skill}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2"
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Experience Level
                    </label>
                    <select
                      {...register('experienceLevel')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                    >
                      <option value="">Any experience level</option>
                      <option value="entry">Entry Level</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between pt-8">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={prevStep}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={nextStep}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    Review & Post
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Review & Post
                </h2>

                <div className="space-y-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Title</dt>
                          <dd className="text-gray-900">{watch('title')}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Type</dt>
                          <dd className="text-gray-900 capitalize">{watch('jobType')?.toLowerCase()}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Budget</dt>
                          <dd className="text-gray-900">
                            ${watch('budget')} {watchJobType === 'HOURLY' ? '/hr' : ''}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Duration</dt>
                          <dd className="text-gray-900">{watch('duration') || 'Not specified'}</dd>
                        </div>
                      </dl>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Skills</dt>
                          <dd className="text-gray-900">
                            {skills.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {skills.map(skill => (
                                  <span key={skill} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              'No skills specified'
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Experience</dt>
                          <dd className="text-gray-900 capitalize">{watch('experienceLevel') || 'Any level'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Deadline</dt>
                          <dd className="text-gray-900">{watch('deadline')}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {watch('description')}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={prevStep}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Posting Job...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5" />
                        <span>Post Job</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobPost;