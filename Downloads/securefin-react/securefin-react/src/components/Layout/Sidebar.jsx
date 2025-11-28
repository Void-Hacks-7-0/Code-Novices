import { LayoutDashboard, CreditCard, Shield, Bot, Database, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
    const { logout } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: CreditCard, label: 'Transactions', path: '/transactions' },
        { icon: Shield, label: 'Budget & Goals', path: '/budget' },
        { icon: Bot, label: 'AI Financial Hub', path: '/ai-hub' },
        { icon: Database, label: 'Blockchain Ledger', path: '/blockchain' },
    ];

    return (
        <aside className="w-64 bg-secondary/50 backdrop-blur-lg border-r border-slate-700 flex flex-col hidden md:flex h-screen sticky top-0">
            <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-center space-x-3">
                    <div className="bg-accent/10 p-2 rounded-lg">
                        <Shield className="w-6 h-6 text-accent" />
                    </div>
                    <span className="text-xl font-bold text-white">SecureFin</span>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center p-3 rounded-lg group cursor-pointer transition-colors ${isActive
                                ? 'bg-accent/10 text-accent'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 mr-3" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-700/50">
                <button
                    onClick={logout}
                    className="flex items-center w-full p-3 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
