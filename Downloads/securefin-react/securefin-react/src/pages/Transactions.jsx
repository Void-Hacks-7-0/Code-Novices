import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Zap, ArrowUpRight, ArrowDownLeft, Filter } from 'lucide-react';

export default function Transactions() {
    const { transactions, addTransaction, addToLedger, budget } = useApp();
    const [filter, setFilter] = useState('all');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('expense');
    const [category, setCategory] = useState('Food');
    const [isLedgerEnabled, setIsLedgerEnabled] = useState(false);

    // Categories
    const expenseCategories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health'];
    const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];

    const handleAutoFill = () => {
        const randomTransactions = [
            { desc: 'Grocery Shopping', amount: 1500, type: 'expense', cat: 'Food' },
            { desc: 'Uber Ride', amount: 350, type: 'expense', cat: 'Transport' },
            { desc: 'Freelance Project', amount: 15000, type: 'income', cat: 'Freelance' },
            { desc: 'Netflix Subscription', amount: 499, type: 'expense', cat: 'Entertainment' },
            { desc: 'Salary Credit', amount: 85000, type: 'income', cat: 'Salary' },
        ];

        randomTransactions.forEach(t => {
            const transaction = {
                id: Date.now() + Math.random(),
                description: t.desc,
                amount: t.amount,
                type: t.type,
                category: t.cat,
                date: new Date().toISOString()
            };
            addTransaction(transaction);

            if (isLedgerEnabled) {
                addToLedger({
                    id: Date.now() + Math.random(),
                    hash: '0x' + Math.random().toString(16).substr(2, 40),
                    prevHash: '0x' + Math.random().toString(16).substr(2, 40),
                    timestamp: new Date().toISOString(),
                    data: `Transaction: ${t.desc} - ₹${t.amount}`
                });
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const numAmount = parseFloat(amount);

        // Budget Guardrail
        if (type === 'expense' && budget) {
            const currentExpenses = transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + parseFloat(t.amount), 0);

            if (currentExpenses + numAmount > parseFloat(budget.amount)) {
                if (!window.confirm(`⚠️ Transaction Blocked!\n\nThis expense exceeds your budget goal of ₹${budget.amount}.\n\nIs this an EMERGENCY? Click OK to override.`)) {
                    return;
                }
            }
        }

        const transaction = {
            id: Date.now(),
            description,
            amount: numAmount,
            type,
            category,
            date: new Date().toISOString()
        };

        addTransaction(transaction);

        if (isLedgerEnabled) {
            addToLedger({
                id: Date.now(),
                hash: '0x' + Math.random().toString(16).substr(2, 40),
                prevHash: '0x' + Math.random().toString(16).substr(2, 40),
                timestamp: new Date().toISOString(),
                data: `Transaction: ${description} - ₹${numAmount}`
            });
        }

        setDescription('');
        setAmount('');
    };

    const filteredTransactions = transactions.filter(t => {
        if (filter === 'all') return true;
        return t.type === filter;
    });

    return (
        <div className="space-y-6">
            {/* Add Transaction Form */}
            <div className="bg-secondary/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-white">Add New Transaction</h3>
                    <button
                        onClick={handleAutoFill}
                        className="flex items-center px-4 py-2 bg-yellow-500/10 text-yellow-500 rounded-lg hover:bg-yellow-500/20 transition-colors"
                    >
                        <Zap className="w-4 h-4 mr-2" />
                        Auto-Fill Test Data
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="col-span-1 md:col-span-2">
                        <input
                            type="text"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                            required
                        />
                    </div>

                    <div>
                        <input
                            type="number"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                            required
                        />
                    </div>

                    <div>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                        >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                    </div>

                    <div>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                        >
                            {(type === 'expense' ? expenseCategories : incomeCategories).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="ledger"
                            checked={isLedgerEnabled}
                            onChange={(e) => setIsLedgerEnabled(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-600 text-accent focus:ring-accent bg-slate-800"
                        />
                        <label htmlFor="ledger" className="text-slate-400 text-sm">Log to Blockchain Ledger</label>
                    </div>

                    <div className="col-span-1 md:col-span-2 lg:col-span-2">
                        <button
                            type="submit"
                            className="w-full bg-accent hover:bg-emerald-600 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Transaction
                        </button>
                    </div>
                </form>
            </div>

            {/* Transaction List */}
            <div className="bg-secondary/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
                    <div className="flex space-x-2">
                        {['all', 'income', 'expense'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1 rounded-lg text-sm capitalize transition-colors ${filter === f
                                        ? 'bg-slate-700 text-white'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((t) => (
                            <div key={t.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-full ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {t.type === 'income' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-white">{t.description}</h4>
                                        <p className="text-sm text-slate-400">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className={`font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                                    }`}>
                                    {t.type === 'income' ? '+' : '-'}₹{t.amount}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-slate-500">
                            <Filter className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No transactions found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
