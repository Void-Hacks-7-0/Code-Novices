import { Bell, Search, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header({ title }) {
    const { user } = useAuth();

    return (
        <header className="bg-secondary/50 backdrop-blur-lg border-b border-slate-700 p-4 sticky top-0 z-10">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">{title}</h2>

                <div className="flex items-center space-x-4">
                    <div className="relative hidden md:block">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="bg-slate-800 border border-slate-600 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent w-64"
                        />
                    </div>

                    <button className="p-2 text-slate-400 hover:text-white relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
                    </button>

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
