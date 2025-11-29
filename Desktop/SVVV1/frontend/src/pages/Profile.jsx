import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, CreditCard, Copy, CheckCircle, Edit2, Save, X } from 'lucide-react';

export default function Profile() {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });

    const handleCopyUID = () => {
        navigator.clipboard.writeText(user.uid);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await updateProfile(formData);
        if (result.success) {
            setIsEditing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">My Profile</h2>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                    >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-secondary/50 backdrop-blur-lg p-8 rounded-2xl border border-slate-700 text-center">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-white">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{user?.name}</h3>
                        <p className="text-slate-400 mb-6">{user?.email}</p>

                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-4">
                            <p className="text-sm text-emerald-400 mb-2">Current Balance</p>
                            <p className="text-3xl font-bold text-emerald-500">₹{user?.balance?.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Details Card */}
                <div className="lg:col-span-2">
                    <div className="bg-secondary/50 backdrop-blur-lg p-8 rounded-2xl border border-slate-700">
                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <h3 className="text-xl font-bold text-white mb-6">Edit Profile Information</h3>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        type="submit"
                                        className="flex-1 flex items-center justify-center px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors"
                                    >
                                        <Save className="w-5 h-5 mr-2" />
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({ name: user.name, email: user.email });
                                        }}
                                        className="flex-1 flex items-center justify-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 mr-2" />
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white mb-6">Profile Information</h3>

                                <div className="space-y-4">
                                    <div className="bg-slate-800/50 rounded-xl p-4">
                                        <div className="flex items-center mb-2">
                                            <User className="w-5 h-5 text-emerald-500 mr-2" />
                                            <p className="text-sm text-slate-400">Full Name</p>
                                        </div>
                                        <p className="text-lg text-white font-medium">{user?.name}</p>
                                    </div>

                                    <div className="bg-slate-800/50 rounded-xl p-4">
                                        <div className="flex items-center mb-2">
                                            <Mail className="w-5 h-5 text-emerald-500 mr-2" />
                                            <p className="text-sm text-slate-400">Email Address</p>
                                        </div>
                                        <p className="text-lg text-white font-medium">{user?.email}</p>
                                    </div>

                                    <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center">
                                                <CreditCard className="w-5 h-5 text-emerald-500 mr-2" />
                                                <p className="text-sm text-emerald-400">Your Unique ID (UID)</p>
                                            </div>
                                            <button
                                                onClick={handleCopyUID}
                                                className="flex items-center px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-colors text-sm"
                                            >
                                                {copied ? (
                                                    <>
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-4 h-4 mr-1" />
                                                        Copy
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <p className="text-2xl text-white font-bold tracking-wide">{user?.uid}</p>
                                        <p className="text-xs text-slate-400 mt-2">Share this ID to receive payments</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
