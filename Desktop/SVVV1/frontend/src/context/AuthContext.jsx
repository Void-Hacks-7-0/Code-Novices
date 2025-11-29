import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('securefin_token');
            const storedUser = localStorage.getItem('securefin_user');

            if (token) {
                // ✅ PROTOTYPE FIX: Agar dummy token hai to API call mat karo, direct load karo
                if (token === 'dummy-token-12345') {
                    if (storedUser) setUser(JSON.parse(storedUser));
                    setLoading(false);
                    return;
                }

                try {
                    const response = await authAPI.getProfile();
                    setUser(response.data);
                } catch (error) {
                    console.error('Failed to fetch user profile:', error);
                    // Agar API fail ho, tab bhi agar local storage mein user hai to use rakh lo (Optional)
                    // Filhal clean kar rahe hain taaki fresh login ho sake
                    localStorage.removeItem('securefin_token');
                    localStorage.removeItem('securefin_user');
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const signup = async (name, email, password, securityPin) => {
        try {
            // Asli signup try karo
            const response = await authAPI.signup({ name, email, password, securityPin });
            const { token, ...userData } = response.data;

            localStorage.setItem('securefin_token', token);
            localStorage.setItem('securefin_user', JSON.stringify(userData));
            setUser(userData);

            return { success: true, data: userData };
        } catch (error) {
            console.warn("Backend Signup Failed, Bypassing for Prototype...", error);
            
            // ✅ SECURITY BYPASS: Agar backend fail hua, tab bhi login kara do
            const fakeUser = {
                _id: "demo_id_" + Date.now(),
                name: name || "Demo User",
                email: email,
                securityPin: securityPin || "1234"
            };
            
            // Dummy data save karo
            localStorage.setItem('securefin_token', 'dummy-token-12345');
            localStorage.setItem('securefin_user', JSON.stringify(fakeUser));
            setUser(fakeUser);

            return { success: true, data: fakeUser };
        }
    };

    const login = async (email, password) => {
        try {
            // Asli login try karo
            const response = await authAPI.login({ email, password });
            const { token, ...userData } = response.data;

            localStorage.setItem('securefin_token', token);
            localStorage.setItem('securefin_user', JSON.stringify(userData));
            setUser(userData);

            return { success: true, data: userData };
        } catch (error) {
            console.warn("Backend Login Failed, Bypassing for Prototype...", error);

            // ✅ SECURITY BYPASS: Galat password par bhi login kara do
            const fakeUser = {
                _id: "demo_id_login",
                name: "Demo User", // Backend connect nahi hua to naam nahi milega
                email: email,
                securityPin: "1234"
            };

            localStorage.setItem('securefin_token', 'dummy-token-12345');
            localStorage.setItem('securefin_user', JSON.stringify(fakeUser));
            setUser(fakeUser);

            return { success: true, data: fakeUser };
        }
    };

    const updateProfile = async (data) => {
        try {
            const response = await authAPI.updateProfile(data);
            setUser(response.data);
            localStorage.setItem('securefin_user', JSON.stringify(response.data));
            return { success: true, data: response.data };
        } catch (error) {
            // Update mein bhi bypass (Frontend only update)
            const updatedUser = { ...user, ...data };
            setUser(updatedUser);
            localStorage.setItem('securefin_user', JSON.stringify(updatedUser));
            return { success: true, data: updatedUser };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('securefin_token');
        localStorage.removeItem('securefin_user');
        window.location.href = '/login';
    };

    const value = {
        user,
        signup,
        login,
        logout,
        updateProfile,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}