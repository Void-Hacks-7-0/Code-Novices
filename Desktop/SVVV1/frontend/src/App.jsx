import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout/Layout';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import History from './pages/History';
import AIHub from './pages/AIHub';
import Blockchain from './pages/Blockchain';
import Profile from './pages/Profile';
import Schemes from './pages/Schemes';
import Leaderboard from './pages/Leaderboard';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
            <AppProvider>
                <Router>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Landing />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />

                        {/* Protected Routes */}
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }>
                            <Route index element={<Dashboard />} />
                            <Route path="transactions" element={<Transactions />} />
                            <Route path="budget" element={<Budget />} />
                            <Route path="history" element={<History />} />
                            <Route path="ai-hub" element={<AIHub />} />
                            <Route path="blockchain" element={<Blockchain />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="schemes" element={<Schemes />} />
                            <Route path="leaderboard" element={<Leaderboard />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </Router>
            </AppProvider>
        </AuthProvider>
    );
}

export default App;

