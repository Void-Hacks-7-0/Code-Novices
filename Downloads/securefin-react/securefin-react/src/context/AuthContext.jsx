import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('securefin_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (email) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = {
                    name: 'Demo User',
                    email: email,
                    avatar: `https://ui-avatars.com/api/?name=Demo+User&background=random`
                };
                setUser(newUser);
                localStorage.setItem('securefin_user', JSON.stringify(newUser));
                resolve(newUser);
            }, 500);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('securefin_user');
    };

    const value = {
        user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
