import React from 'react';
import { motion } from 'framer-motion';
import { 
    Clock, 
    CheckCircle, 
    XCircle, 
    AlertCircle, 
    Pause,
    Play
} from 'lucide-react';

const JobStatusBadge = ({ status, size = 'sm' }) => {
    const getStatusConfig = (status) => {
        switch (status?.toUpperCase()) {
            case 'OPEN':
            case 'ACTIVE':
                return {
                    icon: Clock,
                    color: 'bg-green-100 text-green-700 border-green-200',
                    label: 'Open'
                };
            case 'CLOSED':
            case 'COMPLETED':
                return {
                    icon: CheckCircle,
                    color: 'bg-blue-100 text-blue-700 border-blue-200',
                    label: 'Completed'
                };
            case 'CANCELLED':
                return {
                    icon: XCircle,
                    color: 'bg-red-100 text-red-700 border-red-200',
                    label: 'Cancelled'
                };
            case 'PAUSED':
                return {
                    icon: Pause,
                    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
                    label: 'Paused'
                };
            case 'IN_PROGRESS':
                return {
                    icon: Play,
                    color: 'bg-purple-100 text-purple-700 border-purple-200',
                    label: 'In Progress'
                };
            default:
                return {
                    icon: AlertCircle,
                    color: 'bg-gray-100 text-gray-700 border-gray-200',
                    label: status || 'Unknown'
                };
        }
    };

    const config = getStatusConfig(status);
    const Icon = config.icon;
    
    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base'
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`inline-flex items-center space-x-1 rounded-full border font-medium ${config.color} ${sizeClasses[size]}`}
        >
            <Icon className={iconSizes[size]} />
            <span>{config.label}</span>
        </motion.span>
    );
};

export default JobStatusBadge;