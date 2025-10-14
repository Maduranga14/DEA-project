import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, delay } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Rocket, 
  Users, 
  TrendingUp, 
  Star,
  Award,
  Clock,
  Shield,
  ArrowRight,
  Play,
  ChevronDown
} from 'lucide-react';

const HeroSection = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    const testimonials = [
        {
            text: "FreelanceHub helped me triple my income just 6 months.",
            author: "sarah chen",
            role: "Senior UI/UX Designer",
            avatar: "SC",
            rating: 5
        },
        {
            text: "As a startup, we found our perfect developer in 48 hours. The platform saved us months of hiring.",
            author: "Mike Rodriguez",
            role: "CEO at TechStart",
            avatar: "MR",
            rating: 5
        }
    ];

    const stats = [
        { icon: Users, number: "50K+", text: "Active Freelancers", color: "blue" },
        { icon: Rocket, number: "25K+", text: "Projects Completed", color: "purple" },
        { icon: TrendingUp, number: "98%", text: "Success Rate", color: "green" },
        { icon: Award, number: "4.9/5", text: "Client Rating", color: "orange" }
    ];

    const features = [
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Get paid on time with our milestone-based payment system"
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "Find perfect matches with our AI-powered recommendation engine"
    },
    {
      icon: Star,
      title: "Quality Work",
      description: "Work with top-rated professionals and clients"
    }
  ];

    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isPlaying, testimonials.length]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
        // Redirect to jobs page with search query
            window.location.href = `/jobs?search=${encodeURIComponent(searchQuery)}`;
        }
    };

    const scrollToFeatures = () => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    };

  return (
    <div className='relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden'>
        <div className="absolute inset-0">
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y:[0,-50,0],
                }}
                transition={{
                    duration:20,
                    Repeat: Infinity,
                    ease:"easeInOut"
                }}
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            />
            <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"
        />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

        <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
            <div className="text-container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
                >
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white/90 text-sm font-medium">
                    Trusted by 50,000+ professionals worldwide
                    </span>
                    <ArrowRight className="w-4 h-4 text-white/60" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.5}}
                    animate={{ opacity: 1, scale: 1}}
                    transition={{delay: 0.5, duration: 0.8}}
                    className='block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'
                >
                    Dream Career
                </motion.h1>
            </div>
        </div>
            
        </div>
    </div>
  )
}

export default HeroSection