import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Users, DollarSign, Clock, Award, Star, Briefcase, Calendar,
  MessageCircle, Settings, Plus, ArrowUpRight, Eye, FileText, CheckCircle,
  XCircle, Search, BarChart3, PieChart, Activity, Target, Zap, Upload
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

const EnhancedDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [recentJobs, setRecentJobs] = useState([]);
    const [recentApplications, setRecentApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState('week');

    useEffect(() => {
        loadDashboardData();
    }, [user]);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            
            if (user?.role === 'ADMIN') {
                setLoading(false);
                return;
            }

            if (user?.role === 'FREELANCER') {
                
                const [jobsResponse, applicationsResponse] = await Promise.all([
                    jobService.getAllJobs(),
                    applicationService.getMyApplications()
                ]);

                const jobsData = jobsResponse.data || jobsResponse;
                const applicationsData = applicationsResponse.data || applicationsResponse;

                setRecentJobs(jobsData.slice(0, 5));
                setRecentApplications(applicationsData.slice(0, 5));

                
                const pendingApps = applicationsData.filter(app => app.status === 'PENDING').length;
                const acceptedApps = applicationsData.filter(app => app.status === 'ACCEPTED').length;
                const rejectedApps = applicationsData.filter(app => app.status === 'REJECTED').length;

                setStats({
                    totalApplications: applicationsData.length,
                    pending: pendingApps,
                    accepted: acceptedApps,
                    rejected: rejectedApps,
                    availableJobs: jobsData.length,
                    successRate: applicationsData.length > 0 
                        ? Math.round((acceptedApps / applicationsData.length) * 100) 
                        : 0
                });

            } else if (user?.role === 'CLIENT') {
                
                const [jobsResponse, applicationsResponse] = await Promise.all([
                    jobService.getMyJobs(),
                    applicationService.getApplicationsForMyJobs()
                ]);

                const jobsData = jobsResponse.data || jobsResponse;
                const applicationsData = applicationsResponse.data || applicationsResponse;

                setRecentJobs(jobsData.slice(0, 5));
                setRecentApplications(applicationsData.slice(0, 5));

                
                const activeJobs = jobsData.filter(job => job.status === 'OPEN').length;
                const closedJobs = jobsData.filter(job => job.status === 'CLOSED').length;
                const pendingReview = applicationsData.filter(app => app.status === 'PENDING').length;

                setStats({
                    totalJobs: jobsData.length,
                    activeJobs,
                    closedJobs,
                    totalApplications: applicationsData.length,
                    pendingReview,
                    avgApplicationsPerJob: jobsData.length > 0 
                        ? Math.round(applicationsData.length / jobsData.length) 
                        : 0
                });
            }

            setLoading(false);
        } catch (error) {
            console.error('Error loading dashboard:', error);
            toast.error('Failed to load dashboard data');
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, value, label, change, color = 'blue', trend, onClick }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.02 }}
            onClick={onClick}
            className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 ${onClick ? 'cursor-pointer' : ''}`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${color}-100`}>
                    <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>
                {change && (
                    <span className={`text-sm font-medium px-2 py-1 rounded-full flex items-center gap-1 ${
                        trend === 'up' ? 'bg-green-100 text-green-600' : 
                        trend === 'down' ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-600'
                    }`}>
                        {trend === 'up' && <TrendingUp className="w-3 h-3" />}
                        {change}
                    </span>
                )}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
            <div className="text-gray-600 text-sm">{label}</div>
        </motion.div>
    );

    const JobCard = ({ job, isClient = false }) => (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ x: 5 }}
            onClick={() => navigate(`/jobs/${job.id}`)}
            className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-200 group bg-white hover:shadow-md cursor-pointer"
        >
            <div className="flex items-center space-x-4 flex-1">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {job.title?.charAt(0) || 'J'}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                        {job.title}
                    </h3>
                    <p className="text-gray-600 text-sm truncate">
                        {job.location} • {job.type}
                    </p>
                </div>
            </div>
            
            <div className="flex items-center space-x-4">
                <div className="text-right">
                    <div className="font-bold text-green-600">
                        ${job.budget}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                        job.status === 'OPEN' ? 'bg-green-100 text-green-600' :
                        job.status === 'CLOSED' ? 'bg-gray-100 text-gray-600' :
                        'bg-blue-100 text-blue-600'
                    }`}>
                        {job.status}
                    </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
        </motion.div>
    );

    const ApplicationCard = ({ application }) => (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ x: 5 }}
            className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-200 group bg-white hover:shadow-md"
        >
            <div className="flex items-center space-x-4 flex-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                    application.status === 'ACCEPTED' ? 'bg-green-500' :
                    application.status === 'REJECTED' ? 'bg-red-500' :
                    'bg-yellow-500'
                }`}>
                    {application.status === 'ACCEPTED' ? <CheckCircle className="w-6 h-6" /> :
                     application.status === 'REJECTED' ? <XCircle className="w-6 h-6" /> :
                     <Clock className="w-6 h-6" />}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                        {application.job?.title || 'Job Application'}
                    </h3>
                    <p className="text-gray-600 text-sm truncate">
                        Applied {new Date(application.appliedAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
            
            <div className="flex items-center space-x-4">
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    application.status === 'ACCEPTED' ? 'bg-green-100 text-green-600' :
                    application.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                    'bg-yellow-100 text-yellow-600'
                }`}>
                    {application.status}
                </span>
            </div>
        </motion.div>
    );

    const QuickAction = ({ icon: Icon, label, description, color = 'blue', onClick }) => (
        <motion.button
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-200 group bg-white hover:shadow-md"
        >
            <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl bg-${color}-100 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{label}</h3>
                    <p className="text-gray-600 text-sm">{description}</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
        </motion.button>
    );

    
    if (user?.role === 'ADMIN') {
        return <AdminDashboard />;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 pt-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse space-y-8">
                        <div className="h-8 bg-gray-300 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-32 bg-gray-300 rounded-2xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 pt-20">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Welcome back, {user?.firstName}! 👋
                    </h1>
                    <p className="text-gray-600 text-lg">
                        {user?.role === 'FREELANCER' 
                            ? "Here's your freelance activity overview."
                            : "Manage your projects and review applications."
                        }
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {user?.role === 'FREELANCER' ? (
                        <>
                            <StatCard
                                icon={Briefcase}
                                value={stats?.totalApplications || 0}
                                label="Total Applications"
                                color="blue"
                                onClick={() => navigate('/my-applications')}
                            />
                            <StatCard
                                icon={Clock}
                                value={stats?.pending || 0}
                                label="Pending Review"
                                color="yellow"
                                onClick={() => navigate('/my-applications')}
                            />
                            <StatCard
                                icon={CheckCircle}
                                value={stats?.accepted || 0}
                                label="Accepted"
                                color="green"
                                trend="up"
                            />
                            <StatCard
                                icon={Target}
                                value={`${stats?.successRate || 0}%`}
                                label="Success Rate"
                                color="purple"
                            />
                        </>
                    ) : (
                        <>
                            <StatCard
                                icon={Briefcase}
                                value={stats?.totalJobs || 0}
                                label="Total Jobs Posted"
                                color="blue"
                            />
                            <StatCard
                                icon={Activity}
                                value={stats?.activeJobs || 0}
                                label="Active Jobs"
                                color="green"
                                onClick={() => navigate('/jobs')}
                            />
                            <StatCard
                                icon={Users}
                                value={stats?.totalApplications || 0}
                                label="Total Applications"
                                color="purple"
                                onClick={() => navigate('/client-applications')}
                            />
                            <StatCard
                                icon={TrendingUp}
                                value={stats?.avgApplicationsPerJob || 0}
                                label="Avg Apps/Job"
                                color="orange"
                            />
                        </>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Recent Jobs */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl shadow-lg p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {user?.role === 'FREELANCER' ? 'Available Jobs' : 'Your Posted Jobs'}
                                </h2>
                                <button 
                                    onClick={() => navigate('/jobs')}
                                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                >
                                    View All
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {recentJobs.length > 0 ? (
                                    recentJobs.map(job => (
                                        <JobCard key={job.id} job={job} isClient={user?.role === 'CLIENT'} />
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-600">No jobs available</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Recent Applications */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl shadow-lg p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {user?.role === 'FREELANCER' ? 'My Applications' : 'Recent Applications'}
                                </h2>
                                <button 
                                    onClick={() => navigate(user?.role === 'FREELANCER' ? '/my-applications' : '/client-applications')}
                                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                >
                                    View All
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {recentApplications.length > 0 ? (
                                    recentApplications.map(app => (
                                        <ApplicationCard key={app.id} application={app} />
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-600">No applications yet</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                            
                            <div className="space-y-4">
                                {user?.role === 'FREELANCER' ? (
                                    <>
                                        <QuickAction
                                            icon={Search}
                                            label="Browse Jobs"
                                            description="Find new opportunities"
                                            color="blue"
                                            onClick={() => navigate('/jobs')}
                                        />
                                        <QuickAction
                                            icon={FileText}
                                            label="My Applications"
                                            description="Track your applications"
                                            color="green"
                                            onClick={() => navigate('/my-applications')}
                                        />
                                        <QuickAction
                                            icon={Upload}
                                            label="My Submissions"
                                            description="View submitted work"
                                            color="purple"
                                            onClick={() => navigate('/my-submissions')}
                                        />
                                        <QuickAction
                                            icon={Settings}
                                            label="Profile Settings"
                                            description="Update your profile"
                                            color="orange"
                                            onClick={() => navigate('/profile')}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <QuickAction
                                            icon={Plus}
                                            label="Post New Job"
                                            description="Find talented freelancers"
                                            color="blue"
                                            onClick={() => navigate('/post-job')}
                                        />
                                        <QuickAction
                                            icon={Users}
                                            label="Review Applications"
                                            description="Check new proposals"
                                            color="green"
                                            onClick={() => navigate('/client-applications')}
                                        />
                                        <QuickAction
                                            icon={FileText}
                                            label="View Submissions"
                                            description="Review completed work"
                                            color="purple"
                                            onClick={() => navigate('/client-submissions')}
                                        />
                                        <QuickAction
                                            icon={Briefcase}
                                            label="My Jobs"
                                            description="Manage job postings"
                                            color="orange"
                                            onClick={() => navigate('/jobs')}
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Activity Summary */}
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                            <h3 className="text-lg font-bold mb-4">Activity Summary</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-blue-100">This Week</span>
                                    <span className="font-bold">
                                        {user?.role === 'FREELANCER' 
                                            ? `${stats?.totalApplications || 0} Applications`
                                            : `${stats?.activeJobs || 0} Active Jobs`
                                        }
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-blue-100">Success Rate</span>
                                    <span className="font-bold">
                                        {user?.role === 'FREELANCER' 
                                            ? `${stats?.successRate || 0}%`
                                            : `${stats?.avgApplicationsPerJob || 0} avg`
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedDashboard;
