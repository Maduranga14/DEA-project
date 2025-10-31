import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Building, 
  Briefcase, 
  Check,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
    const [step, setStep] = useState(1);
    const [userType, setUserType] = useState('freelancer');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',


        title: '',
        bio: '',
        hourlyRate: '',
        skills: [],


        companyName: '',
        companyDescription: '',

    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState([]);

    const { register } = useAuth();
    const navigate = useNavigate();

    const skillsList = [
        'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript',
        'UI/UX Design', 'Graphic Design', 'Mobile Development',
        'DevOps', 'AWS', 'Docker', 'Kubernetes', 'Machine Learning',
        'Data Analysis', 'Content Writing', 'Digital Marketing', 'SEO'
    ];
    const handleSkillToggle = (skill) => {
        setSelectedSkills(prev => 
        prev.includes(skill) 
            ? prev.filter(s => s !== skill)
            : [...prev, skill]
        );
    };

    const UserTypeCard = ({ type, icon: Icon, title, description, selected, onClick }) => (
        <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                selected
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
        >
            <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl ${
                selected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
                </div>
                {selected && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                    >
                        <Check className="w-4 h-4 text-white" />
                    </motion.div>
                )}
            </div>
        </motion.div>
    );

    const StepIndicator = () => (
        <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
            {[1, 2, 3].map((stepNumber) => (
                <React.Fragment key={stepNumber}>
                    <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                        step >= stepNumber
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                            {stepNumber}
                        </div>
                        <span className={`text-xs mt-2 font-medium ${
                            step >= stepNumber ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                            {stepNumber === 1 ? 'Account' : stepNumber === 2 ? 'Profile' : 'Details'}
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
    );

    const handleNext = () => {
        // Validation for step 1
        if (step === 1) {
            if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
                toast.error('Please fill in all required fields');
                return;
            }
            
            if (!/\S+@\S+\.\S+/.test(formData.email)) {
                toast.error('Please enter a valid email address');
                return;
            }
            
            if (formData.password.length < 6) {
                toast.error('Password must be at least 6 characters long');
                return;
            }
            
            if (formData.password !== formData.confirmPassword) {
                toast.error('Passwords do not match');
                return;
            }
        }
        
        // Validation for step 2
        if (step === 2) {
            if (!formData.firstName || !formData.lastName) {
                toast.error('Please fill in your name');
                return;
            }
            
            if (userType === 'freelancer' && !formData.title) {
                toast.error('Please enter your professional title');
                return;
            }
            
            if (userType === 'client' && !formData.companyName) {
                toast.error('Please enter your company name');
                return;
            }
        }
        
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const registrationData = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            userType: userType,
            ...(userType === 'freelancer' && {
                title: formData.title,
                bio: formData.bio,
                hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : 0,
                skills: selectedSkills
            }),
            ...(userType === 'client' && {
                companyName: formData.companyName,
                companyDescription: formData.companyDescription
            })
        };

        const result = await register(registrationData, userType);
        
        if (result.success) {
            toast.success(`Welcome! Your ${userType} account has been created.`);
            navigate('/login');
        } else {
            toast.error(result.error);
        }
        
        setLoading(false);
    };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 py-8">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-6xl">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="lg:flex">

                        <div className="lg:w-2/5 bg-gradient-to-br from-blue-600 to-purple-700 p-8 text-white relative overflow-hidden">

                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="relative z-10">
                                    <Link to="/" className='inline-flex items-center space-x-2 mb-8'>
                                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                            <span className='font-bold text-lg'>FH</span>
                                        </div>
                                        <span className="text-2xl font-bold">FreelanceHub</span>
                                    </Link>

                                    <h1 className="text-4xl font-bold mb-6 leading-tight">
                                        Start Your
                                        <br />
                                        <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                                            Freelance Journey
                                        </span>
                                    </h1>
                                    <p className='ext-4xl font-bold mb-6 leading-tight'>
                                        Join thousands of talented professionals and clients building amazing projects together.
                                    </p>

                                    <div className="space-y-6">
                                        {[
                                            { text: 'Access to premium projects', icon: '🚀', color: 'from-yellow-400 to-orange-400' },
                                            { text: 'Secure payment protection', icon: '💳', color: 'from-green-400 to-blue-400' },
                                            { text: 'Build your professional network', icon: '🌐', color: 'from-purple-400 to-pink-400' },
                                            { text: '24/7 customer support', icon: '🛡️', color: 'from-blue-400 to-cyan-400' }
                                        ].map((item, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 + index * 0.1 }}
                                                className="flex items-center space-x-4">
                                                    <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center text-xl shadow-lg`}>
                                                        {item.icon}
                                                    </div>
                                                    <span className='text-blue-100 text-lg'>{item.text}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                            </motion.div>
                        </div>
                        
                        {/*registration form*/}
                        <div className="lg:w-3/5 p-8">
                            <div className="max-w-2xl mx-auto">
                                <div className="text-center mb-8">
                                    <motion.h2
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-3xl font-bold text-gray-900 mb-3">
                                            {step === 1 && 'Join Our Community'}
                                            {step === 2 && 'Complete Your Profile'}
                                            {step === 3 && 'Final Details'}
                                    </motion.h2>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="text-gray-600 text-lg">
                                            {step === 1 && 'Create your account in just a few steps'}
                                            {step === 2 && 'Tell us more about yourself'}
                                            {step === 3 && 'Almost there! Add your professional details'}
                                    </motion.p>
                                </div>

                                <StepIndicator />

                                <AnimatePresence mode="wait">
                                    {step === 1 && (
                                        <motion.div
                                         key="step1"
                                         initial={{opacity: 0, x: 20}}
                                         animate={{ opacity: 1, x: 0 }}
                                         exit={{ opacity: 0, x: -20 }}
                                         className="space-y-8">
                                            <div>
                                                <label className="block text-lg font-semibold text-gray-900 mb-4">
                                                    I want to Join as:
                                                </label>
                                                <div className="grid gap-4">
                                                    <UserTypeCard
                                                        type="freelancer"
                                                        icon={Briefcase}
                                                        title="Freelancer"
                                                        description="Find work, build your portfolio, and grow your career"
                                                        selected={userType === 'freelancer'}
                                                        onClick={() => setUserType('freelancer')}
                                                    />
                                                    <UserTypeCard
                                                        type="client"
                                                        icon={Building}
                                                        title="Client"
                                                        description="Hire talented freelancers for your projects"
                                                        selected={userType === 'client'}
                                                        onClick={() => setUserType('client')}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                                        Username*
                                                    </label>
                                                    <div className="relative">
                                                        <User className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                                                        <input type="text"
                                                        required
                                                        value={formData.username}
                                                        onChange={(e) => setFormData({... formData,username:e.target.value})} className='w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg'
                                                        placeholder='Choose a username' />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                                        Email Address*
                                                    </label>
                                                    <div className="relative">
                                                        <Mail className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                                                        <input type="email"
                                                        required
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({... formData,email:e.target.value})} className='w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg'
                                                        placeholder='Enter your email' />
                                                    </div>
                                                </div>

                                                <div className="grid gap-6 md:grid-cols-2">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                                            Password *
                                                        </label>
                                                        <div className="relative">
                                                            <Lock className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5'/>
                                                            <input 
                                                            type={showPassword ? 'text' : 'password'}
                                                            required
                                                            value={formData.password}
                                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                            className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                                                            placeholder="Create password" 
                                                            />
                                                            <button
                                                             type='button'
                                                             onClick={() => setShowPassword (!showPassword)}
                                                             className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                                                                {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                                                             </button>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-2">
                                                            Minimum 6 characters
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                                            Confirm Password *
                                                        </label>
                                                        <div className="relative">
                                                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                            <input
                                                                type={showConfirmPassword ? 'text' : 'password'}
                                                                required
                                                                value={formData.confirmPassword}
                                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                                className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                                                                placeholder="Confirm password"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                            >
                                                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleNext}
                                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-3">
                                                    <span>Continue to Profile</span>
                                                    <ArrowRight className='w-5 h-5'/>
                                            </motion.button>
                                        </motion.div>
                                    )}

                                    {step === 2 && (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-8">
                                                <div className="grid gap-6 md:grid-cols-2">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                                            First Name *
                                                        </label>
                                                        <div className="relative">
                                                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                            <input
                                                            type="text"
                                                            required
                                                            value={formData.firstName}
                                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                                                            placeholder="First name"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                                            Last Name *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={formData.lastName}
                                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                            className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                                                            placeholder="Last name"
                                                        />
                                                    </div>
                                                </div>

                                                {userType === 'freelancer' && (
                                                    <>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                                                Professional Title *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                required
                                                                value={formData.title}
                                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                                                                placeholder="e.g., Senior React Developer"
                                                                />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                                                Hourly Rate ($)
                                                            </label>
                                                            <div className="relative">
                                                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                                                <input
                                                                    type="number"
                                                                    value={formData.hourlyRate}
                                                                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                                                                    className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                                                                    placeholder="e.g., 50"
                                                                    min="0"
                                                                    step="5"
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {userType === 'client' && (
                                                    <>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                                                Company Name *
                                                            </label>
                                                            <div className="relative">
                                                                <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                                <input
                                                                    type="text"
                                                                    required
                                                                    value={formData.companyName}
                                                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                                                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                                                                    placeholder="Your company name"
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                <div className="flex space-x-4 pt-4">
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={handleBack}
                                                        className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all flex items-center justify-center space-x-2">
                                                            <ArrowLeft className="w-5 h-5" />
                                                            <span>Back</span>
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={handleNext}
                                                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                                                        >
                                                        <span>Continue</span>
                                                        <ArrowRight className="w-5 h-5" />
                                                    </motion.button>
                                                </div>
                                        </motion.div>
                                    )}

                                    {step === 3 && (
                                        <motion.div
                                            key="step3"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}>
                                                {userType === 'freelancer' && (
                                                    <div className="space-y-8">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                                                Your Skills *
                                                            </label>
                                                            <div className="flex flex-wrap gap-3">
                                                                {skillsList.map((skill) => (
                                                                <motion.button
                                                                    key={skill}
                                                                    type="button"
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => handleSkillToggle(skill)}
                                                                    className={`px-4 py-3 rounded-full text-sm font-medium transition-all border-2 ${
                                                                        selectedSkills.includes(skill)
                                                                        ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                                                                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                                                                    }`}
                                                                >
                                                                    {skill}
                                                                </motion.button>
                                                                ))}
                                                            </div>
                                                            <p className="text-sm text-gray-500 mt-3">
                                                                {selectedSkills.length} skills selected
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                                                Bio
                                                            </label>
                                                            <textarea
                                                                value={formData.bio}
                                                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                                rows="5"
                                                                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-lg"
                                                                placeholder="Tell us about yourself, your experience, and what you love to work on..."
                                                            />
                                                            <p className="text-sm text-gray-500 mt-2">
                                                                 will be visible on your public profile
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {userType === 'client' && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                                            Company Description
                                                        </label>
                                                        <textarea
                                                            value={formData.companyDescription}
                                                            onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
                                                            rows="5"
                                                            className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-lg"
                                                            placeholder="Tell us about your company and the types of projects you work on..."
                                                        />
                                                        <p className="text-sm text-gray-500 mt-2">
                                                            This helps freelancers understand your business better
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="flex space-x-4 pt-8">
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={handleBack}
                                                        className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all flex items-center justify-center space-x-2">
                                                            <ArrowLeft className="w-5 h-5" />
                                                            <span>Back</span>
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={handleSubmit}
                                                        disabled={loading}
                                                        className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-2">
                                                            {loading ? (
                                                                <>
                                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                                    <span>Creating Account...</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span>Create Account</span>
                                                                    <Check className="w-5 h-5" />
                                                                </>
                                                            )}
                                                    </motion.button>
                                                </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                
                                <div className="mt-8 text-center">
                                    <p className="text-gray-600">
                                        Already have an account?{' '}
                                        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold text-lg">
                                            Sign in here
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </motion.div>
    </div>
  );
};


export default Register;