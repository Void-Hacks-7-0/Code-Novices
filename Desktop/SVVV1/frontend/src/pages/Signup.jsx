import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Mail, Lock, Key, CheckCircle, AlertCircle } from 'lucide-react';

export default function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        securityPin: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.securityPin) {
            newErrors.securityPin = 'Security PIN is required';
        } else if (!/^\d{4}$/.test(formData.securityPin)) {
            newErrors.securityPin = 'PIN must be exactly 4 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        const result = await signup(
            formData.name,
            formData.email,
            formData.password,
            formData.securityPin
        );

        setIsLoading(false);

        if (result.success) {
            setSuccess({
                uid: result.data.uid,
                balance: result.data.balance
            });

            // Redirect to dashboard after 3 seconds
            setTimeout(() => {
                navigate('/dashboard');
            }, 3000);
        } else {
            setErrors({ submit: result.message });
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error for this field
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
                <div className="w-full max-w-md">
                    <div className="bg-secondary/50 backdrop-blur-lg rounded-2xl p-8 border border-emerald-500 shadow-2xl shadow-emerald-500/20 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 mb-6 animate-bounce">
                            <CheckCircle className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Welcome to SecureFin!</h2>
                        <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
                            <p className="text-slate-300 mb-4">Your account has been created successfully</p>
                            <div className="space-y-3">
                                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                                    <p className="text-sm text-emerald-400 mb-1">Your Unique ID</p>
                                    <p className="text-2xl font-bold text-emerald-500">{success.uid}</p>
                                </div>
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                    <p className="text-sm text-blue-400 mb-1">Starting Balance</p>
                                    <p className="text-2xl font-bold text-blue-500">₹{success.balance}</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm">Redirecting to dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 mb-6 animate-pulse">
                        <Shield className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                        Create Account
                    </h1>
                    <p className="text-slate-400 mt-2">Join SecureFin and get ₹5000 free!</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-secondary/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700 shadow-2xl space-y-5">
                    {errors.submit && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                            <p className="text-red-400 text-sm">{errors.submit}</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full bg-slate-800 border ${errors.name ? 'border-red-500' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                                placeholder="John Doe"
                            />
                        </div>
                        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full bg-slate-800 border ${errors.email ? 'border-red-500' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                                placeholder="john@example.com"
                            />
                        </div>
                        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full bg-slate-800 border ${errors.password ? 'border-red-500' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full bg-slate-800 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Security PIN (4 digits)</label>
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                            <input
                                type="password"
                                name="securityPin"
                                value={formData.securityPin}
                                onChange={handleChange}
                                maxLength="4"
                                className={`w-full bg-slate-800 border ${errors.securityPin ? 'border-red-500' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                                placeholder="••••"
                            />
                        </div>
                        {errors.securityPin && <p className="text-red-400 text-sm mt-1">{errors.securityPin}</p>}
                        <p className="text-slate-500 text-xs mt-1">This PIN will be required for all transactions</p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>

                    <p className="text-center text-slate-400 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-emerald-500 hover:text-emerald-400 font-medium">
                            Login here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
