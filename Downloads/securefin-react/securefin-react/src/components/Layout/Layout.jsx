import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
    const location = useLocation();

    const getPageTitle = (pathname) => {
        switch (pathname) {
            case '/': return 'Dashboard';
            case '/transactions': return 'Transactions';
            case '/budget': return 'Budget & Goals';
            case '/ai-hub': return 'AI Financial Hub';
            case '/blockchain': return 'Blockchain Ledger';
            default: return 'SecureFin';
        }
    };

    return (
        <div className="flex h-screen bg-primary text-white font-sans antialiased overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Header title={getPageTitle(location.pathname)} />
                <main className="flex-1 overflow-y-auto py-6 bg-slate-900">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
