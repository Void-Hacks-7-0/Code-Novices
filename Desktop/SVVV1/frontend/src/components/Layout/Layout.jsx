import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
    const location = useLocation();

    const getPageTitle = (pathname) => {
        switch (pathname) {
            case '/dashboard': return 'Dashboard';
            case '/dashboard/transactions': return 'Transactions';
            case '/dashboard/budget': return 'Budget & Goals';
            case '/dashboard/history': return 'Transaction History';
            case '/dashboard/ai-hub': return 'AI Financial Hub';
            case '/dashboard/blockchain': return 'Blockchain Ledger';
            case '/dashboard/profile': return 'My Profile';
            case '/dashboard/schemes': return 'Government Schemes';
            case '/dashboard/leaderboard': return 'Savings Leaderboard';
            default: return 'SecureFin';
        }
    };

    return (
        <div className="flex h-screen bg-primary text-white font-sans antialiased overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Header title={getPageTitle(location.pathname)} />
                <main className="flex-1 overflow-y-auto p-6 bg-slate-900">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
