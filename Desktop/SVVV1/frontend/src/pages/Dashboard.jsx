import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement, Filler } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { useApp } from '../context/AppContext';
import { TrendingUp, TrendingDown, DollarSign, Activity, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement, Filler);

export default function Dashboard() {
    const { transactions } = useApp();

    // ✅ Hardcoded Balance for Prototype (Fixed at 5000)
    const fixedBalance = 5000;

    const received = transactions
        .filter(t => t.type === 'receive')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const sent = transactions
        .filter(t => t.type === 'send')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const barData = {
        labels: ['Received', 'Sent'],
        datasets: [
            {
                label: 'Amount',
                data: [received, sent],
                backgroundColor: ['#10B981', '#EF4444'],
                borderRadius: 8,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Received vs Sent', color: '#94a3b8' },
        },
        scales: {
            y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
        },
    };

    // Process categories for Doughnut chart
    const categories = {};
    transactions
        .filter(t => t.type === 'send')
        .forEach(t => {
            categories[t.category] = (categories[t.category] || 0) + parseFloat(t.amount);
        });

    const doughnutData = {
        labels: Object.keys(categories),
        datasets: [
            {
                data: Object.values(categories),
                backgroundColor: [
                    '#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6', '#10B981', '#6366F1'
                ],
                borderWidth: 0,
            },
        ],
    };

    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'right', labels: { color: '#94a3b8' } },
        },
        cutout: '70%',
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-secondary/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm">Total Balance</p>
                            {/* ✅ Fixed 5000 Display */}
                            <h3 className="text-3xl font-bold text-white mt-1">₹{fixedBalance.toFixed(2)}</h3>
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

                <div className="bg-secondary/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm">Total Received</p>
                            <h3 className="text-3xl font-bold text-emerald-400 mt-1">₹{received.toFixed(2)}</h3>
                        </div>
                        <div className="bg-emerald-500/10 p-3 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-emerald-500" />
                        </div>
                    </div>
                </div>

                <div className="bg-secondary/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm">Total Sent</p>
                            <h3 className="text-3xl font-bold text-red-400 mt-1">₹{sent.toFixed(2)}</h3>
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
                    <div className="h-64">
                        <Bar data={barData} options={barOptions} />
                    </div>
                </div>

                <div className="bg-secondary/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-6">Sent Breakdown</h3>
                    <div className="h-64 flex items-center justify-center">
                        {Object.keys(categories).length > 0 ? (
                            <Doughnut data={doughnutData} options={doughnutOptions} />
                        ) : (
                            <div className="text-center text-slate-500">
                                <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No sent transactions yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Balance Trend Line Chart */}
                <div className="bg-secondary/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-6">Balance Trend</h3>
                    <div className="h-64">
                        <Line
                            data={{
                                labels: transactions.slice().reverse().map(t => new Date(t.timestamp || t.date).toLocaleDateString()),
                                datasets: [{
                                    label: 'Balance History',
                                    data: transactions.slice().reverse().reduce((acc, t) => {
                                        const lastBalance = acc.length > 0 ? acc[acc.length - 1] : 0;
                                        const change = t.type === 'receive' ? parseFloat(t.amount) : -parseFloat(t.amount);
                                        acc.push(lastBalance + change);
                                        return acc;
                                    }, []),
                                    borderColor: '#10B981',
                                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                    tension: 0.4,
                                    fill: true
                                }]
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { display: false },
                                    tooltip: { mode: 'index', intersect: false },
                                },
                                scales: {
                                    y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
                                    x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
                                },
                                maintainAspectRatio: false
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Recent History */}
            <div className="bg-secondary/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-6">Recent History</h3>
                <div className="space-y-4">
                    {transactions.slice(0, 5).map((t) => (
                        <div key={t._id || t.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-full ${t.type === 'receive' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {t.type === 'receive' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h4 className="font-medium text-white">{t.description}</h4>
                                    <p className="text-sm text-slate-400">{t.category} • {new Date(t.timestamp || t.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <span className={`font-bold ${t.type === 'receive' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {t.type === 'receive' ? '+' : '-'}₹{t.amount}
                            </span>
                        </div>
                    ))}
                    {transactions.length === 0 && (
                        <p className="text-center text-slate-500 py-4">No transactions yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}