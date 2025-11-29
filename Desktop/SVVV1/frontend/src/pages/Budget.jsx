import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Target, AlertTriangle, CheckCircle, Trash2, TrendingUp } from 'lucide-react';

export default function Budget() {
    const { budgetGoals, addBudgetGoal, removeBudgetGoal, transactions } = useApp();
    const [category, setCategory] = useState('');
    const [limit, setLimit] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Budget Limit add kar rahe hain (e.g., Food ke liye 5000)
        addBudgetGoal({
            id: Date.now(),
            name: category, // Category ka naam (taaki transactions se match ho sake)
            amount: parseFloat(limit),
            date: new Date().toISOString()
        });
        setCategory('');
        setLimit('');
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Create Budget Limit Form */}
                <div className="bg-secondary/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-emerald-500/10 p-2 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-emerald-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Set Monthly Budget</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Category Name</label>
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                placeholder="e.g., Food, Travel, Shopping"
                                required
                            />
                            <p className="text-xs text-slate-500 mt-1">Make sure this matches your transaction category exactly.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Max Limit (₹)</label>
                            <input
                                type="number"
                                value={limit}
                                onChange={(e) => setLimit(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                placeholder="e.g., 5000"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors"
                        >
                            Set Budget Limit
                        </button>
                    </form>
                </div>

                {/* 2. Active Budgets Display */}
                <div className="bg-secondary/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-blue-500/10 p-2 rounded-lg">
                            <Shield className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Budget Status</h3>
                    </div>

                    {budgetGoals.length > 0 ? (
                        <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                            {budgetGoals.map((budget) => {
                                // Logic: Is Category (budget.name) par total kitna kharcha hua?
                                const spent = transactions
                                    .filter(t => 
                                        t.type === 'expense' && 
                                        t.category?.toLowerCase() === budget.name.toLowerCase()
                                    )
                                    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

                                const remaining = budget.amount - spent;
                                const isExceeded = spent > budget.amount;
                                const progress = Math.min((spent / budget.amount) * 100, 100);

                                return (
                                    <div key={budget.id} className={`bg-slate-800/50 p-4 rounded-xl border ${isExceeded ? 'border-red-500/50' : 'border-slate-700/50'}`}>
                                        
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-bold text-white text-lg capitalize">{budget.name}</h4>
                                                <p className="text-xs text-slate-400">Monthly Limit: ₹{budget.amount}</p>
                                            </div>
                                            <button
                                                onClick={() => removeBudgetGoal(budget.id)}
                                                className="text-slate-500 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full bg-slate-700 h-2 rounded-full mb-3 overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-500 ${isExceeded ? 'bg-red-500' : 'bg-emerald-500'}`}
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>

                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-xs text-slate-400">Spent</p>
                                                <p className={`text-lg font-bold ${isExceeded ? 'text-red-400' : 'text-white'}`}>
                                                    ₹{spent.toFixed(2)}
                                                </p>
                                            </div>
                                            
                                            <div className="text-right">
                                                {isExceeded ? (
                                                    <div className="flex items-center text-red-400 text-sm bg-red-500/10 p-2 rounded">
                                                        <AlertTriangle className="w-4 h-4 mr-2" />
                                                        <span>Over Budget by ₹{Math.abs(remaining).toFixed(0)}!</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center text-emerald-400 text-sm bg-emerald-500/10 p-2 rounded">
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        <span>₹{remaining.toFixed(0)} remaining</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-slate-500">
                            <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No budgets set</p>
                            <p className="text-xs mt-1">Set limits for Food, Travel, etc.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}