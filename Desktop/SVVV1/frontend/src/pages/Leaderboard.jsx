import { useState, useEffect } from 'react';
import { Trophy, Medal, TrendingUp, ArrowUpRight, Users } from 'lucide-react';
import { leaderboardAPI } from '../utils/api';

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const response = await leaderboardAPI.get();
            setLeaderboard(response.data);
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (rank) => {
        if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
        if (rank === 2) return <Medal className="w-6 h-6 text-slate-400" />;
        if (rank === 3) return <Medal className="w-6 h-6 text-orange-600" />;
        return <span className="text-lg font-bold text-slate-400">#{rank}</span>;
    };

    const getRankBg = (rank) => {
        if (rank === 1) return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/40';
        if (rank === 2) return 'bg-gradient-to-r from-slate-400/20 to-slate-500/20 border-slate-400/40';
        if (rank === 3) return 'bg-gradient-to-r from-orange-600/20 to-orange-700/20 border-orange-600/40';
        return 'bg-slate-800/50 border-slate-700';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 mb-4">
                    <Trophy className="w-10 h-10 text-yellow-500" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">Savings Leaderboard</h2>
                <p className="text-slate-400 text-lg">
                    Compare savings with users you've paid. Top savers are ranked by total savings (received - sent)
                </p>
            </div>

            {leaderboard.length === 0 ? (
                <div className="bg-secondary/50 backdrop-blur-lg p-12 rounded-2xl border border-slate-700 text-center">
                    <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Data Yet</h3>
                    <p className="text-slate-400">
                        Send money to other users to see them appear on your leaderboard
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {leaderboard.map((user, index) => (
                        <div
                            key={user.uid}
                            className={`backdrop-blur-lg p-6 rounded-2xl border ${getRankBg(user.rank)} transition-all transform hover:scale-[1.02]`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 flex-1">
                                    <div className="flex items-center justify-center w-16 h-16">
                                        {getRankIcon(user.rank)}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white">{user.name}</h3>
                                                <p className="text-sm text-slate-400">{user.uid}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden md:grid grid-cols-3 gap-6 text-center">
                                        <div className="bg-slate-900/50 rounded-lg p-3">
                                            <p className="text-xs text-slate-400 mb-1">Received</p>
                                            <p className="text-lg font-bold text-emerald-400">₹{user.totalReceived.toFixed(2)}</p>
                                        </div>
                                        <div className="bg-slate-900/50 rounded-lg p-3">
                                            <p className="text-xs text-slate-400 mb-1">Sent</p>
                                            <p className="text-lg font-bold text-red-400">₹{user.totalSent.toFixed(2)}</p>
                                        </div>
                                        <div className="bg-slate-900/50 rounded-lg p-3">
                                            <p className="text-xs text-slate-400 mb-1">You Sent</p>
                                            <p className="text-lg font-bold text-blue-400">₹{user.amountSentToUser.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-xl p-4 min-w-[140px] text-center">
                                        <div className="flex items-center justify-center mb-1">
                                            <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                                            <p className="text-xs text-emerald-400 font-medium">Savings</p>
                                        </div>
                                        <p className="text-2xl font-bold text-white">₹{user.savings.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Stats */}
                            <div className="md:hidden grid grid-cols-3 gap-3 mt-4">
                                <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-slate-400 mb-1">Received</p>
                                    <p className="text-sm font-bold text-emerald-400">₹{user.totalReceived.toFixed(2)}</p>
                                </div>
                                <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-slate-400 mb-1">Sent</p>
                                    <p className="text-sm font-bold text-red-400">₹{user.totalSent.toFixed(2)}</p>
                                </div>
                                <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-slate-400 mb-1">You Sent</p>
                                    <p className="text-sm font-bold text-blue-400">₹{user.amountSentToUser.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-start">
                    <ArrowUpRight className="w-5 h-5 text-blue-400 mr-3 mt-1" />
                    <div>
                        <h4 className="text-white font-semibold mb-2">How Rankings Work</h4>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Users are ranked by their total savings (Total Received - Total Sent). Only users you've sent money to appear on your leaderboard.
                            This helps you compare financial habits with your payment network.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
