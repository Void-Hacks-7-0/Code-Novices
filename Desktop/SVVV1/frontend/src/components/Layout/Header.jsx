import { Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useState } from 'react';

export default function Header({ title }) {
    const { user } = useAuth();
    const { budgetGoals, transactions } = useApp();
    const [showNotifications, setShowNotifications] = useState(false);

    // Calculate notifications for budget goals
    const notifications = budgetGoals.filter(goal => {
        const dueDate = new Date(goal.date);
        const now = new Date();
        const hoursUntilDue = (dueDate - now) / (1000 * 60 * 60);

        // Show notification if within 48 hours of due date
        return hoursUntilDue > 0 && hoursUntilDue <= 48;
    });

    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const currentBalance = totalIncome - totalExpenses;

    return (
        <header className="bg-secondary/50 backdrop-blur-lg border-b border-slate-700 p-4 sticky top-0 z-10">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">{title}</h2>

                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 text-slate-400 hover:text-white relative"
                        >
                            <Bell className="w-5 h-5" />
                            {notifications.length > 0 && (
                                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-4 z-50">
                                <h3 className="text-white font-semibold mb-3">Notifications</h3>
                                {notifications.length > 0 ? (
                                    <div className="space-y-3">
                                        {notifications.map(goal => {
                                            const shortage = goal.amount - currentBalance;
                                            const dueDate = new Date(goal.date);
                                            const hoursUntilDue = Math.floor((dueDate - new Date()) / (1000 * 60 * 60));

                                            return (
                                                <div key={goal.id} className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                                                    <p className="text-yellow-400 font-medium text-sm">⚠️ Budget Goal Alert</p>
                                                    <p className="text-slate-300 text-sm mt-1">
                                                        <strong>{goal.name}</strong> is due in {hoursUntilDue} hours
                                                    </p>
                                                    {shortage > 0 && (
                                                        <p className="text-red-400 text-xs mt-1">
                                                            Short by ₹{shortage.toFixed(2)}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-slate-400 text-sm">No new notifications</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-3 border-l border-slate-700 pl-4">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-medium text-white">{user?.name}</p>
                            <p className="text-xs text-slate-400">Premium Member</p>
                        </div>
                        <img
                            src={user?.avatar}
                            alt="Profile"
                            className="w-10 h-10 rounded-full border-2 border-accent"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
