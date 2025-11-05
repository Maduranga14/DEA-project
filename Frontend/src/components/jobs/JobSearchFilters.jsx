import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Filter, 
    X, 
    DollarSign, 
    Clock, 
    MapPin, 
    Search,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

const JobSearchFilters = ({ filters, onFilterChange, onClearFilters }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters);

    const skillOptions = [
        'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java',
        'UI/UX', 'Figma', 'Photoshop', 'HTML', 'CSS', 'MongoDB', 'SQL',
        'AWS', 'Docker', 'Git', 'Angular', 'Vue.js', 'PHP', 'Laravel'
    ];

    const jobTypeOptions = [
        { value: 'FIXED', label: 'Fixed Price' },
        { value: 'HOURLY', label: 'Hourly Rate' }
    ];

    const experienceOptions = [
        { value: 'ENTRY', label: 'Entry Level' },
        { value: 'INTERMEDIATE', label: 'Intermediate' },
        { value: 'EXPERT', label: 'Expert' }
    ];

    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleSkillToggle = (skill) => {
        const currentSkills = localFilters.skills || [];
        const newSkills = currentSkills.includes(skill)
            ? currentSkills.filter(s => s !== skill)
            : [...currentSkills, skill];
        handleFilterChange('skills', newSkills);
    };

    const handleClearAll = () => {
        const clearedFilters = {
            skills: [],
            minBudget: '',
            maxBudget: '',
            jobType: '',
            experience: '',
            searchQuery: ''
        };
        setLocalFilters(clearedFilters);
        onFilterChange(clearedFilters);
        onClearFilters && onClearFilters();
    };

    const hasActiveFilters = () => {
        return localFilters.skills?.length > 0 ||
               localFilters.minBudget ||
               localFilters.maxBudget ||
               localFilters.jobType ||
               localFilters.experience ||
               localFilters.searchQuery;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
            {/* Filter Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Filter className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                        {hasActiveFilters() && (
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                                Active
                            </span>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        {hasActiveFilters() && (
                            <button
                                onClick={handleClearAll}
                                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                Clear All
                            </button>
                        )}
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-1 text-gray-500 hover:text-gray-700 transition-colors lg:hidden"
                        >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Content */}
            <AnimatePresence>
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className={`overflow-hidden ${!isExpanded ? 'hidden lg:block' : ''}`}
                >
                    <div className="p-6 space-y-6">
                        {/* Budget Range */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-3">
                                Budget Range
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={localFilters.minBudget || ''}
                                        onChange={(e) => handleFilterChange('minBudget', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={localFilters.maxBudget || ''}
                                        onChange={(e) => handleFilterChange('maxBudget', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Job Type */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-3">
                                Job Type
                            </label>
                            <div className="space-y-2">
                                {jobTypeOptions.map((option) => (
                                    <label key={option.value} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="jobType"
                                            value={option.value}
                                            checked={localFilters.jobType === option.value}
                                            onChange={(e) => handleFilterChange('jobType', e.target.value)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                                    </label>
                                ))}
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="jobType"
                                        value=""
                                        checked={!localFilters.jobType}
                                        onChange={(e) => handleFilterChange('jobType', '')}
                                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">All Types</span>
                                </label>
                            </div>
                        </div>

                        {/* Experience Level */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-3">
                                Experience Level
                            </label>
                            <select
                                value={localFilters.experience || ''}
                                onChange={(e) => handleFilterChange('experience', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Levels</option>
                                {experienceOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Skills */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-3">
                                Skills ({localFilters.skills?.length || 0} selected)
                            </label>
                            <div className="max-h-48 overflow-y-auto">
                                <div className="grid grid-cols-2 gap-2">
                                    {skillOptions.map((skill) => (
                                        <label key={skill} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={localFilters.skills?.includes(skill) || false}
                                                onChange={() => handleSkillToggle(skill)}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{skill}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Selected Skills Display */}
                        {localFilters.skills?.length > 0 && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Selected Skills
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {localFilters.skills.map((skill) => (
                                        <motion.span
                                            key={skill}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                                        >
                                            {skill}
                                            <button
                                                onClick={() => handleSkillToggle(skill)}
                                                className="ml-2 text-blue-500 hover:text-blue-700"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

export default JobSearchFilters;