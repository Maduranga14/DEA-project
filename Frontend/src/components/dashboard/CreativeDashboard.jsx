import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  Award, 
  Star,
  Briefcase,
  Calendar,
  MessageCircle,
  Settings,
  Plus,
  ArrowUpRight,
  Eye,
  FileText,
  CheckCircle,
  XCircle,
  Search
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { jobService } from '../../services/jobService';
import { sampleJobs } from '../../data/sampleData';
import toast from 'react-hot-toast';

const CreativeDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [recentActivities, setRecentActivities] = useState([]);
    const [myJobs, setMyJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, [user]);

    const loadDashboardData = async () => {
        try{
            setLoading(true);

            await new Promise(resolve => setTimeout(resolve, 1500));

            if (user?.role === 'FREELANCER') {
                setStats({
                    applied: 24,
                    interviews: 8,
                    earnings: 12500,
                    successRate: 95,
                    activeProposals: 5,
                    completedJobs: 12
                });

                setRecentActivities([
                    { 
                        id: 1, 
                        type: 'application', 
                        job: 'Senior React Developer', 
                        company: 'TechCorp', 
                        time: '2 hours ago', 
                        status: 'pending',
                        icon: Briefcase,
                        color: 'blue'
                    },
                    { 
                        id: 2, 
                        type: 'message', 
                        from: 'Sarah Johnson', 
                        project: 'E-commerce App', 
                        time: '5 hours ago', 
                        unread: true,
                        icon: MessageCircle,
                        color: 'green'
                    },
                    { 
                        id: 3, 
                        type: 'offer', 
                        job: 'Full Stack Developer', 
                        company: 'StartupXYZ', 
                        amount: 15000, 
                        time: '1 day ago',
                        icon: DollarSign,
                        color: 'purple'
                    },
                    { 
                        id: 4, 
                        type: 'completion', 
                        job: 'Mobile App Design', 
                        company: 'DesignStudio', 
                        rating: 5, 
                        time: '2 days ago',
                        icon: CheckCircle,
                        color: 'green'
                    }
                ]);
            } else if (user?.role === 'CLIENT') {
                setStats({
                    posted: 15,
                    active: 3,
                    completed: 8,
                    totalSpent: 45000,
                    avgRating: 4.8,
                    hiringRate: 85
                });

                setRecentActivities([
                    {
                        id: 1, 
                        type: 'proposal', 
                        freelancer: 'John Smith', 
                        job: 'Senior React Developer', 
                        proposals: 12, 
                        time: '1 hour ago',
                        icon: Users,
                        color: 'blue'
                    },
                    { 
                        id: 2, 
                        type: 'completion', 
                        freelancer: 'Emma Wilson', 
                        job: 'Mobile App Development', 
                        rating: 5, 
                        time: '3 hours ago',
                        icon: CheckCircle,
                        color: 'green'
                    },
                    { 
                        id: 3, 
                        type: 'message', 
                        from: 'Mike Chen', 
                        project: 'API Integration', 
                        time: '6 hours ago', 
                        unread: true,
                        icon: MessageCircle,
                        color: 'purple'
                    }
                ]);
            }

            setMyJobs(sampleJobs.slice(0, 3));
            setLoading(false);
        } catch (error){
            toast.error('Failed to load dasboard data');
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, value, label, change, color = 'blue', loading }) => {
        if (loading) {
            return (
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
                >
                <div className="animate-pulse">
                    <div className="w-12 h-12 bg-gray-300 rounded-xl mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
                </motion.div>
            );
        }

        return (
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
                    {change && (
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        change.startsWith('+') 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                        {change}
                        </span>
                    )}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
                <div className="text-gray-600">{label}</div>
            </motion.div>
        );
    };

    const ActivityItem = ({ activity }) => {
        const getActivityContent = () => {
            switch (activity.type) {
                case 'application':
                    return {
                        title: `Applied to ${activity.job}`,
                        subtitle: `at ${activity.company}`,
                        status: activity.status
                    };
                    case 'message':
                        return {
                            title: `Message from ${activity.from}`,
                            subtitle: `regarding ${activity.project}`,
                            status: activity.unread ? 'unread' : 'read'
                        };
                    case 'offer':
                        return {
                            title: `Offer for ${activity.job}`,
                            subtitle: `$${activity.amount.toLocaleString()} • ${activity.company}`,
                            status: 'offer'
                        };
                    case 'completion':
                        return {
                            title: `Project completed: ${activity.job}`,
                            subtitle: `${activity.company} • ${'★'.repeat(activity.rating)}`,
                            status: 'completed'
                        };
                    case 'proposal':
                        return {
                            title: `New proposal for ${activity.job}`,
                            subtitle: `from ${activity.freelancer} • ${activity.proposals} proposals`,
                            status: 'new'
                        };
                    default:
                        return { title: '', subtitle: '', status: '' };
            }
        };
        const content = getActivityContent();
        const Icon = activity.icon;

        return (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: 5 }}
                className="flex items-center p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-200 group bg-white hover:shadow-md"
            >
                <div className={`flex-shrink-0 w-12 h-12 bg-${activity.color}-100 rounded-xl flex items-center justify-center mr-4`}>
                    <Icon className={`w-6 h-6 text-${activity.color}-600`} />
                </div>
        
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                        {content.title}
                    </h3>
                    {activity.unread && (
                        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 ml-2"></div>
                    )}
                </div>
                <p className="text-gray-600 text-sm truncate mb-2">
                    {content.subtitle}
                </p>
                <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">{activity.time}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    content.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                    content.status === 'completed' ? 'bg-green-100 text-green-600' :
                    content.status === 'offer' ? 'bg-purple-100 text-purple-600' :
                    content.status === 'new' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-600'
                    }`}>
                    {content.status}
                    </span>
                </div>
            </div>
        </motion.div>
        );
    };

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

    if (loading) {
        return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 pt-20">
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-300 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-gray-300 rounded-2xl"></div>
                    ))}
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 h-96 bg-gray-300 rounded-2xl"></div>
                    <div className="h-96 bg-gray-300 rounded-2xl"></div>
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
              ? "Here's what's happening with your freelance career today."
              : "Manage your projects and find talented freelancers."
            }
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex space-x-1 bg-white rounded-2xl p-1 shadow-lg border border-gray-200 mb-8 max-w-md"
        >
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'jobs', label: 'My Jobs', icon: Briefcase },
            { id: 'messages', label: 'Messages', icon: MessageCircle },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {user?.role === 'FREELANCER' ? (
                  <>
                    <StatCard
                      icon={Briefcase}
                      value={stats?.applied}
                      label="Applied Jobs"
                      change="+12%"
                      color="blue"
                    />
                    <StatCard
                      icon={Users}
                      value={stats?.interviews}
                      label="Interviews"
                      change="+5%"
                      color="green"
                    />
                    <StatCard
                      icon={DollarSign}
                      value={`$${stats?.earnings?.toLocaleString()}`}
                      label="Total Earnings"
                      change="+23%"
                      color="purple"
                    />
                    <StatCard
                      icon={Award}
                      value={`${stats?.successRate}%`}
                      label="Success Rate"
                      change="+2%"
                      color="orange"
                    />
                  </>
                ) : (
                  <>
                    <StatCard
                      icon={Briefcase}
                      value={stats?.posted}
                      label="Jobs Posted"
                      change="+3"
                      color="blue"
                    />
                    <StatCard
                      icon={Clock}
                      value={stats?.active}
                      label="Active Jobs"
                      change="+1"
                      color="green"
                    />
                    <StatCard
                      icon={CheckCircle}
                      value={stats?.completed}
                      label="Completed"
                      change="+2"
                      color="purple"
                    />
                    <StatCard
                      icon={DollarSign}
                      value={`$${stats?.totalSpent?.toLocaleString()}`}
                      label="Total Spent"
                      change="+15%"
                      color="orange"
                    />
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="lg:col-span-2"
                >
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        View All
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <ActivityItem key={activity.id} activity={activity} />
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                    
                    <div className="space-y-4">
                      {user?.role === 'FREELANCER' ? (
                        <>
                          <QuickAction
                            icon={Search}
                            label="Find New Projects"
                            description="Browse latest job postings"
                            color="blue"
                          />
                          <QuickAction
                            icon={FileText}
                            label="My Proposals"
                            description="View and manage your applications"
                            color="green"
                          />
                          <QuickAction
                            icon={DollarSign}
                            label="Withdraw Earnings"
                            description="Transfer funds to your account"
                            color="purple"
                          />
                          <QuickAction
                            icon={Award}
                            label="Update Portfolio"
                            description="Showcase your latest work"
                            color="orange"
                          />
                        </>
                      ) : (
                        <>
                          <QuickAction
                            icon={Plus}
                            label="Post New Job"
                            description="Find perfect freelancers"
                            color="blue"
                          />
                          <QuickAction
                            icon={Users}
                            label="Review Proposals"
                            description="Check new applications"
                            color="green"
                          />
                          <QuickAction
                            icon={MessageCircle}
                            label="Messages"
                            description="Chat with freelancers"
                            color="purple"
                          />
                          <QuickAction
                            icon={Settings}
                            label="Account Settings"
                            description="Update your preferences"
                            color="orange"
                          />
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Recent Jobs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      {user?.role === 'FREELANCER' ? 'Recommended Jobs' : 'Your Active Jobs'}
                    </h2>
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      See All
                    </button>
                  </div>

                  <div className="grid gap-4">
                    {myJobs.map((job, index) => (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-200 group"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                            {job.client.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {job.title}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {job.client.name} • {job.location}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-bold text-green-600">
                              {job.type === 'HOURLY' ? `$${job.budget}/hr` : `$${job.budget}`}
                            </div>
                            <div className="text-sm text-gray-500">{job.posted}</div>
                          </div>
                          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <ArrowUpRight className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'jobs' && (
            <motion.div
              key="jobs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Jobs</h2>
                {/* Jobs content would go here */}
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {user?.role === 'FREELANCER' ? 'Your Applications' : 'Your Job Postings'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {user?.role === 'FREELANCER' 
                      ? 'Track your job applications and proposals here.'
                      : 'Manage your job postings and review applications.'
                    }
                  </p>
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                    {user?.role === 'FREELANCER' ? 'Browse Jobs' : 'Post a Job'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'messages' && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Messages</h2>
                {/* Messages content would go here */}
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Your Messages
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Connect with {user?.role === 'FREELANCER' ? 'clients' : 'freelancers'} and discuss projects.
                  </p>
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                    Start Conversation
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
                {/* Settings content would go here */}
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Account Settings
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Manage your account preferences and notification settings.
                  </p>
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                    Edit Profile
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreativeDashboard