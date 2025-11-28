import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useApp } from '../context/AppContext';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function Dashboard() {
    const { transactions } = useApp();

    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const balance = income - expense;

    const barData = {
        labels: ['Income', 'Expenses'],
        datasets: [
            {
                label: 'Amount',
                data: [income, expense],
                backgroundColor: ['#10B981', '#EF4444'],
                borderColor: ['#059669', '#DC2626'],
                borderWidth: 2,
                borderRadius: 8,
                hoverBackgroundColor: ['#059669', '#DC2626'],
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Income vs Expenses', color: '#94a3b8' },
        },
        scales: {
            y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
        },
        backgroundColor: 'transparent',
        layout: {
            padding: 0,
        },
    };

    // Process categories for Doughnut chart
    const categories = {};
    transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
            categories[t.category] = (categories[t.category] || 0) + parseFloat(t.amount);
        });

    const doughnutData = {
        labels: Object.keys(categories),
        datasets: [
            {
                data: Object.values(categories),
                backgroundColor: [
                    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'
                ],
                borderColor: [
                    '#1E40AF', '#059669', '#D97706', '#DC2626', '#7C3AED', '#DB2777'
                ],
                borderWidth: 2,
                hoverBackgroundColor: [
                    '#1E40AF', '#059669', '#D97706', '#DC2626', '#7C3AED', '#DB2777'
                ],
            },
        ],
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right', labels: { color: '#94a3b8' } },
        },
        cutout: '70%',
        backgroundColor: 'transparent',
        layout: {
            padding: 0,
        },
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-secondary/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700 hover:bg-secondary/70 hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm">Total Balance</p>
                            <h3 className="text-3xl font-bold text-white mt-1">₹{balance.toFixed(2)}</h3>
                        </div>
                        <div className="bg-blue-500/10 p-3 rounded-lg">
                            <DollarSign className="w-6 h-6 text-blue-500" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-emerald-400 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1" /> +2.5%
                        </span>
                        <span className="text-slate-500 ml-2">from last month</span>
                    </div>
                </div>

                <div className="bg-secondary/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700 hover:bg-secondary/70 hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm">Total Income</p>
                            <h3 className="text-3xl font-bold text-emerald-400 mt-1">₹{income.toFixed(2)}</h3>
                        </div>
                        <div className="bg-emerald-500/10 p-3 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-emerald-500" />
                        </div>
                    </div>
                </div>

                <div className="bg-secondary/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700 hover:bg-secondary/70 hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm">Total Expenses</p>
                            <h3 className="text-3xl font-bold text-red-400 mt-1">₹{expense.toFixed(2)}</h3>
                        </div>
                        <div className="bg-red-500/10 p-3 rounded-lg">
                            <TrendingDown className="w-6 h-6 text-red-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-secondary/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-6">Financial Overview</h3>
                    <div className="h-64 w-full overflow-hidden">
                        <Bar data={barData} options={barOptions} />
                    </div>
                </div>

                <div className="bg-secondary/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-6">Expense Breakdown</h3>
                    <div className="h-64 w-full flex items-center justify-center overflow-hidden">
                        {Object.keys(categories).length > 0 ? (
                            <Doughnut data={doughnutData} options={doughnutOptions} />
                        ) : (
                            <div className="text-center text-slate-500">
                                <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No expenses recorded yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
