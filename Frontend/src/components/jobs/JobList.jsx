import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, Plus } from 'lucide-react';
import { jobService } from '../../services/jobService';
import { sampleJobs } from '../../data/sampleData';
import CreativeJobCard from './CreativeJobCard';
//import InteractiveFilters from './InteractiveFilters';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';



const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [filters, setFilters] = useState({
        skills: [],
        minBudget: '',
        maxBudget: '',
        jobType: '',
        experience: '',
        searchQuery: ''
    });
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('newest');
    const { user } = useAuth();

    useEffect(() => {
        loadJobs();
    }, []);

    useEffect(() => {
        filterAndSortJobs();
    }, [jobs, filters, sortBy]);

    const loadJobs = async () => {
        try {
            setLoading(true);
            const response = await jobService.getAllJobs();

            setJobs(response.data || []);
        } catch (error) {
            console.error('Error loading jobs:', error);
            toast.error('Failed to load jobs');

            setJobs(sampleJobs || []);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortJobs = () => {
        if (!jobs || !Array.isArray(jobs)) {
            setFilteredJobs([]);
            return;
        }

        let filtered = [...jobs];

        //search filter
        if (filters.searchQuery) {
            filtered = filtered.filter(job =>
                (job.title && job.title.toLowerCase().includes(filters.searchQuery.toLowerCase())) ||
                (job.description && job.description.toLowerCase().includes(filters.searchQuery.toLowerCase())) ||
                (job.clientName && job.clientName.toLowerCase().includes(filters.searchQuery.toLowerCase())) ||
                (job.client?.name && job.client.name.toLowerCase().includes(filters.searchQuery.toLowerCase()))
            );
        }

        //skill filter
        if (filters.skills.length > 0) {
            filtered = filtered.filter(job => {
                const jobSkills = job.requiredSkills || job.skills || [];
                return jobSkills && filters.skills.some(skill =>
                    jobSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
                );
            });
        }

        //budget filter
        if (filters.minBudget) {
            filtered = filtered.filter(job => job.budget >= parseFloat(filters.minBudget));
        }
        if (filters.maxBudget) {
            filtered = filtered.filter(job => job.budget <= parseFloat(filters.maxBudget));
        }

        //job filter
        if (filters.jobType) {
            filtered = filtered.filter(job => (job.jobType || job.type) === filters.jobType);
        }

        //sort job
        switch (sortBy) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.createdAt || b.posted) - new Date(a.createdAt || a.posted));
                break;
            case 'budget_high':
                filtered.sort((a, b) => b.budget - a.budget);
                break;
            case 'budget_low':
                filtered.sort((a, b) => a.budget - b.budget);
                break;
            case 'proposals':
                filtered.sort((a, b) => (b.proposals || 0) - (a.proposals || 0));
                break;
            default:
                break;
        }

        setFilteredJobs(filtered);
    };

    const handleSearch = (e) => {
        setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 pt-20'>
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            <div className="lg:col-span-1">
                                <div className="h-96 bg-gray-300 rounded-2xl"></div>
                            </div>
                            <div className="lg:col-span-3">
                                <div className="grid gap-6">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-48 bg-gray-300 rounded-2xl"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }



    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 pt-20">
            <div className="container mx-auto px-4 py-8">
                {/*header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">

                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Find Your Next Project
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Discover amazing opportunities that match your skills
                        </p>
                    </div>

                    {user && (user.role === 'CLIENT' || user.role === 'ADMIN') && (
                        <Link to="/post-job">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all mt-4 lg:mt-0"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Post a Job</span>
                            </motion.button>
                        </Link>
                    )}
                </motion.div>

                {/*search bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20}}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8">

                    <div className="relative max-w-2xl">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search for projects, skills, or companies..."
                            value={filters.searchQuery}
                            onChange={handleSearch}
                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg shadow-sm" />

                    </div>
                </motion.div>

                {/*controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 bg-white rounded-xl p-1 border border-gray-300">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${
                                    viewMode === 'grid'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}>

                                <Grid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${
                                    viewMode === 'list'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}>

                                <List className="w-4 h-4" />
                            </button>
                        </div>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-white border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">

                            <option value="newest">Newest First</option>
                            <option value="budget_high">Budget: High to Low</option>
                            <option value="budget_low">Budget: Low to High</option>
                            <option value="proposals">Most Proposals</option>
                        </select>
                    </div>

                    <div className="text-gray-600">
                        Showing <span className="font-semibold text-gray-900">{filteredJobs.length}</span> of{' '}
                        <span className="font-semibold text-gray-900">{jobs.length}</span> jobs
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/*filters sidebar */}
                    <div className="lg:col-span-1">
                        {/* <InteractiveFilters filters={filters} onFilterChange={setFilters} /> */}
                    </div>

                    {/*job grid */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            {filteredJobs.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="text-center py-16">

                                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Search className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                                        No jobs found
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Try adjusting your filters or search terms
                                    </p>
                                    <button
                                        onClick={() => setFilters({
                                            skills: [],
                                            minBudget: '',
                                            maxBudget: '',
                                            jobType: '',
                                            experience: '',
                                            searchQuery: ''
                                        })}
                                        className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={viewMode}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className={viewMode === 'grid'
                                        ? "grid gap-6 md:grid-cols-2 xl:grid-cols-1"
                                        : "space-y-6"
                                    }>

                                    {filteredJobs.map((job, index) => (
                                        <motion.div
                                            key={job.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <CreativeJobCard job={job} viewMode={viewMode} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobList