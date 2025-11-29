import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { transactionAPI, blockchainAPI } from '../utils/api';

const AppContext = createContext();

export function useApp() {
    return useContext(AppContext);
}

export function AppProvider({ children }) {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [budgetGoals, setBudgetGoals] = useState([]);
    const [ledger, setLedger] = useState([]);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(false);

    // Fetch transactions when user logs in
    useEffect(() => {
        if (user) {
            fetchTransactions();
            fetchBlockchainLedger();
            setBalance(user.balance || 0);
        }
    }, [user]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await transactionAPI.getAll();
            setTransactions(response.data);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBlockchainLedger = async () => {
        try {
            const response = await blockchainAPI.getLedger();
            setLedger(response.data);
        } catch (error) {
            console.error('Failed to fetch blockchain ledger:', error);
        }
    };

    const addTransaction = async (transactionData) => {
        try {
            let response;
            if (transactionData.type === 'receive') {
                response = await transactionAPI.receive(transactionData);
            } else if (transactionData.type === 'send') {
                response = await transactionAPI.send(transactionData);
            }

            // Update local state
            await fetchTransactions();
            await fetchBlockchainLedger();

            // Update balance
            if (response?.data?.newBalance !== undefined) {
                setBalance(response.data.newBalance);
            }

            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Transaction failed'
            };
        }
    };

    const addBudgetGoal = (goal) => {
        setBudgetGoals(prev => [...prev, goal]);
    };

    const removeBudgetGoal = (id) => {
        setBudgetGoals(prev => prev.filter(g => g.id !== id));
    };

    const refreshData = async () => {
        await fetchTransactions();
        await fetchBlockchainLedger();
    };

    const value = {
        transactions,
        budgetGoals,
        ledger,
        balance,
        loading,
        addTransaction,
        addBudgetGoal,
        removeBudgetGoal,
        refreshData
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

