import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Target, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Budget() {
    const { budget, setBudgetGoal, transactions } = useApp();
    const [amount, setAmount] = useState(budget?.amount || '');
    const [date, setDate] = useState(budget?.date || '');

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        setBudgetGoal(amount, date);
    };

    const progress = budget ? Math.min((totalExpenses / budget.amount) * 100, 100) : 0;
    const isOverBudget = budget && totalExpenses > budget.amount;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Set Budget Form */}
                <div className="bg-secondary/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-accent/10 p-2 rounded-lg">
                            <Target className="w-6 h-6 text-accent" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Set Budget Goal</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Monthly Budget Limit (₹)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                                placeholder="e.g. 5000"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Target Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-accent hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors"
                        >
                            Set Budget Goal
                        </button>
                    </form>
                </div>

                {/* Budget Status */}
                <div className="bg-secondary/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-blue-500/10 p-2 rounded-lg">
                            <Shield className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Budget Status</h3>
                    </div>

                    {budget ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-slate-400 text-sm">Current Spending</p>
                                    <h4 className={`text-2xl font-bold ${isOverBudget ? 'text-red-400' : 'text-white'}`}>
                                        ₹{totalExpenses.toFixed(2)}
                                    </h4>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-400 text-sm">Goal Limit</p>
                                    <h4 className="text-2xl font-bold text-slate-300">₹{parseFloat(budget.amount).toFixed(2)}</h4>
                                </div>
                            </div>

                            <div className="relative pt-1">
                                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-slate-700">
                                    <div
                                        style={{ width: `${progress}%` }}
                                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${isOverBudget ? 'bg-red-500' : 'bg-accent'
                                            }`}
                                    ></div>
                                </div>
                            </div>

                            <div className={`p-4 rounded-lg border ${isOverBudget
                                    ? 'bg-red-500/10 border-red-500/20 text-red-400'
                                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                }`}>
                                <div className="flex items-start">
                                    {isOverBudget ? (
                                        <AlertTriangle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                                    ) : (
                                        <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                                    )}
                                    <div>
                                        <h5 className="font-bold">{isOverBudget ? 'Budget Exceeded!' : 'On Track'}</h5>
                                        <p className="text-sm opacity-90 mt-1">
                                            {isOverBudget
                                                ? 'You have exceeded your set budget limit. Emergency override required for further expenses.'
                                                : 'You are within your budget limits. Keep it up!'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-slate-500">
                            <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No budget goal set yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
