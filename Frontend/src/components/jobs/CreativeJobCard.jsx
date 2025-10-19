import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  DollarSign, 
  MapPin, 
  Bookmark, 
  Share2, 
  Eye,
  Calendar,
  User,
  Star
} from 'lucide-react';

const CreativeJobCard = ({ job, viewMode = 'grid' }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleSaveJob = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    //job logic
  };

    const handleShare = (e) => {
        e.stopPropagation();
        // share logic 
        if (navigator.share) {
            navigator.share({
                title: job.title,
                text: job.description,
                url: window.location.href,
            });
        }
    };

    if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -2 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
      >
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            {/* Left*/}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>{job.client.name}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{job.posted}</span>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSaveJob}
                  className={`p-2 rounded-lg transition-colors ${
                    isSaved ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                </motion.button>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">
                {job.description}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.slice(0, 4).map((skill, index) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 4 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    +{job.skills.length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/*Right*/}
            <div className="flex lg:flex-col lg:items-end lg:justify-between lg:pl-6 lg:border-l lg:border-gray-200 lg:min-w-[200px]">
              <div className="text-right mb-4">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {job.type === 'HOURLY' ? `$${job.budget}/hr` : `$${job.budget}`}
                </div>
                <div className="text-sm text-gray-500 capitalize">
                  {job.type.toLowerCase()} • {job.duration}
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  <span>{job.proposals} proposals</span>
                </div>
                
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex space-x-2"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleShare}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
                      >
                        Apply Now
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }


  return (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">

            <div className="relative">

                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                    <div className="flex justify-between items-start mb-4">
                        <motion.h3 
                            className="text-xl font-bold leading-tight"
                            layoutId={`title-${job.id}`}>

                                {job.title}
                        </motion.h3>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleSaveJob}
                            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                                isSaved ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'
                            }`}>

                             <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />   
                        </motion.button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                            <Clock className="w-4 h-4 mr-1" />
                            {job.type}
                        </div>
                        <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                            <DollarSign className='w-4 h-4 mr-1' />
                            {job.type === 'HOURLY' ? `$${job.budget}/hr` : `$${job.budget}`}
                        </div>
                        <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.location}
                        </div>
                    </div>
                </div>

                {/* Job content */}
                <div className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-3">
                        {job.description}
                    </p>


                    <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.slice(0, 3).map((skill, index) => (
                            <motion.span
                                key={skill}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                            >
                                {skill}
                            </motion.span>
                        ))}
                        {job.skills.length > 3 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                                +{job.skills.length - 3} more
                            </span>
                        )}
                    </div>

                    {/* client */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                {job.client.name.charAt(0)}
                            </div>
                            <div className="ml-3">
                                <div className="font-semibold text-gray-900">{job.client.name}</div>
                                <div className="text-sm text-gray-500 flex items-center">
                                    <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                                    {job.client.rating}/5
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                                {job.type === 'HOURLY' ? `$${job.budget}/hr` : `$${job.budget}`}
                            </div>
                            <div className="text-sm text-gray-500">{job.duration}</div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {isHovered ? (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="flex gap-2 pt-4 border-t border-gray-200">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold text-center shadow-lg hover:shadow-xl transition-all"
                                    >
                                        Apply Now
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleShare}
                                        className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-200"
                            >
                                <div className="flex items-center">
                                    <Eye className="w-4 h-4 mr-1" />
                                    {job.proposals} proposals
                                </div>
                                <div>{job.posted}</div>
                            </motion.div>
                            )}
                    </AnimatePresence>
                </div>
            </div>
    </motion.div>
  )
}

export default CreativeJobCard