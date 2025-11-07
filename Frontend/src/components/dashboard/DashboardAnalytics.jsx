import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';


const DashboardAnalytics = ({ data, period = 'week' }) => {
    const calculateTrend = (current, previous) => {
        if (!previous || previous === 0) return { value: 0, direction: 'neutral' };
        const change = ((current - previous) / previous) * 100;
        return {
            value: Math.abs(Math.round(change)),
            direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
        };
    };

    const TrendIndicator = ({ trend }) => {
        const Icon = trend.direction === 'up' ? TrendingUp : 
                     trend.direction === 'down' ? TrendingDown : Minus;
        
        const colorClass = trend.direction === 'up' ? 'text-green-600' :
                          trend.direction === 'down' ? 'text-red-600' :
                          'text-gray-600';

        return (
            <div className={`flex items-center gap-1 ${colorClass}`}>
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{trend.value}%</span>
            </div>
        );
    };

    const MetricCard = ({ label, current, previous, format = 'number' }) => {
        const trend = calculateTrend(current, previous);
        const displayValue = format === 'currency' ? `$${current.toLocaleString()}` :
                           format === 'percentage' ? `${current}%` :
                           current.toLocaleString();

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow"
            >
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{label}</span>
                    <TrendIndicator trend={trend} />
                </div>
                <div className="text-2xl font-bold text-gray-900">{displayValue}</div>
                <div className="text-xs text-gray-500 mt-1">
                    vs last {period}
                </div>
            </motion.div>
        );
    };

    const ProgressBar = ({ label, value, max, color = 'blue' }) => {
        const percentage = Math.min((value / max) * 100, 100);
        
        return (
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <span className="text-sm text-gray-600">{value} / {max}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className={`bg-${color}-500 h-2 rounded-full`}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Metrics Grid */}
            {data?.metrics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {data.metrics.map((metric, index) => (
                        <MetricCard
                            key={index}
                            label={metric.label}
                            current={metric.current}
                            previous={metric.previous}
                            format={metric.format}
                        />
                    ))}
                </div>
            )}

            {/* Progress Bars */}
            {data?.progress && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-6 border border-gray-100"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Progress Overview</h3>
                    {data.progress.map((item, index) => (
                        <ProgressBar
                            key={index}
                            label={item.label}
                            value={item.value}
                            max={item.max}
                            color={item.color}
                        />
                    ))}
                </motion.div>
            )}

            {/* Simple Bar Chart Alternative */}
            {data?.comparison && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-6 border border-gray-100"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Comparison</h3>
                    <div className="space-y-4">
                        {data.comparison.map((item, index) => {
                            const maxValue = Math.max(...data.comparison.map(i => i.value));
                            const percentage = (item.value / maxValue) * 100;
                            
                            return (
                                <div key={index}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            {item.label}
                                        </span>
                                        <span className="text-sm font-bold text-gray-900">
                                            {item.value}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default DashboardAnalytics;

