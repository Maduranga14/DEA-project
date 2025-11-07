import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Briefcase, FileText, TrendingUp, Activity, 
  CheckCircle, XCircle, Clock, DollarSign, BarChart3,
  UserCheck, UserX, AlertCircle, Eye
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [recentJobs, setRecentJobs] = useState([]);
    const [recentApplications, setRecentApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAdminData();
    }, []);

    const loadAdminData = async () => {
        try {
            setLoading(true);

            const [jobsResponse, applicationsResponse] = await Promise.all([
                jobService.getAllJobs(),
                applicationService.getApplicationsForMyJobs()
            ]);

            const jobsData = jobsResponse.data || jobsResponse;
            const applicationsData = applicationsResponse.data || applicationsResponse;

            setRecentJobs(jobsData.slice(0, 10));
            setRecentApplications(applicationsData.slice(0, 10));

            // Calculate comprehensive stats
            const openJobs = jobsData.filter(job => job.status === 'OPEN').length;
            const closedJobs = jobsData.filter(job => job.status === 'CLOSED').length;
            const pendingApps = applicationsData.filter(app => app.status === 'PENDING').length;
            const acceptedApps = applicationsData.filter(app => app.status === 'ACCEPTED').length;
            const rejectedApps = applicationsData.filter(app => app.status === 'REJECTED').length;

            setStats({
                totalJobs: jobsData.length,
                openJobs,
                closedJobs,
                totalApplications: applicationsData.length,
                pendingApps,
                acceptedApps,
                rejectedApps,
                avgApplicationsPerJob: jobsData.length > 0 
                    ? Math.round(applicationsData.length / jobsData.length) 
                    : 0
            });

            setLoading(false);
        } catch (error) {
            console.error('Error loading admin data:', error);
            toast.error('Failed to load admin dashboard');
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, value, label, color = 'blue', subtitle }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${color}-100`}>
                    <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
            <div className="text-gray-600 text-sm mb-1">{label}</div>
            {subtitle && <div className="text-gray-400 text-xs">{subtitle}</div>}
        </motion.div>
    );

    const JobRow = ({ job }) => (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {job.title?.charAt(0) || 'J'}
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{job.title}</div>
                        <div className="text-sm text-gray-500">{job.location}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    job.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                    job.status === 'CLOSED' ? 'bg-gray-100 text-gray-800' :
                    'bg-blue-100 text-blue-800'
                }`}>
                    {job.status}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${job.budget}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {job.type}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="text-blue-600 hover:text-blue-900"
                >
                    <Eye className="w-5 h-5" />
                </button>
            </td>
        </tr>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 pt-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse space-y-8">
                        <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
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
                        Admin Dashboard 🎯
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Platform overview and management
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={Briefcase}
                        value={stats?.totalJobs || 0}
                        label="Total Jobs"
                        subtitle={`${stats?.openJobs || 0} open, ${stats?.closedJobs || 0} closed`}
                        color="blue"
                    />
                    <StatCard
                        icon={Activity}
                        value={stats?.openJobs || 0}
                        label="Active Jobs"
                        subtitle="Currently open"
                        color="green"
                    />
                    <StatCard
                        icon={FileText}
                        value={stats?.totalApplications || 0}
                        label="Total Applications"
                        subtitle={`${stats?.pendingApps || 0} pending review`}
                        color="purple"
                    />
                    <StatCard
                        icon={TrendingUp}
                        value={stats?.avgApplicationsPerJob || 0}
                        label="Avg Apps/Job"
                        subtitle="Platform average"
                        color="orange"
                    />
                    <StatCard
                        icon={Clock}
                        value={stats?.pendingApps || 0}
                        label="Pending Review"
                        subtitle="Awaiting decision"
                        color="yellow"
                    />
                    <StatCard
                        icon={CheckCircle}
                        value={stats?.acceptedApps || 0}
                        label="Accepted"
                        subtitle="Approved applications"
                        color="green"
                    />
                    <StatCard
                        icon={XCircle}
                        value={stats?.rejectedApps || 0}
                        label="Rejected"
                        subtitle="Declined applications"
                        color="red"
                    />
                    <StatCard
                        icon={BarChart3}
                        value={stats?.totalApplications > 0 
                            ? `${Math.round((stats?.acceptedApps / stats?.totalApplications) * 100)}%`
                            : '0%'
                        }
                        label="Acceptance Rate"
                        subtitle="Overall platform"
                        color="indigo"
                    />
                </div>

                {/* Recent Jobs Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
                >
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">Recent Jobs</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Job
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Budget
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentJobs.length > 0 ? (
                                    recentJobs.map(job => (
                                        <JobRow key={job.id} job={job} />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                            No jobs found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Recent Applications */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                >
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Applications</h2>
                    <div className="space-y-4">
                        {recentApplications.length > 0 ? (
                            recentApplications.slice(0, 5).map(app => (
                                <div 
                                    key={app.id}
                                    className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-all"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
                                            app.status === 'ACCEPTED' ? 'bg-green-500' :
                                            app.status === 'REJECTED' ? 'bg-red-500' :
                                            'bg-yellow-500'
                                        }`}>
                                            {app.status === 'ACCEPTED' ? <CheckCircle className="w-5 h-5" /> :
                                             app.status === 'REJECTED' ? <XCircle className="w-5 h-5" /> :
                                             <Clock className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {app.job?.title || 'Job Application'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Applied {new Date(app.appliedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                        app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                        app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {app.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No applications found
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
