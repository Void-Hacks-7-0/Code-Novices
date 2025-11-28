import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function useApp() {
    return useContext(AppContext);
}

export function AppProvider({ children }) {
    const [transactions, setTransactions] = useState([]);
    const [budget, setBudget] = useState(null);
    const [ledger, setLedger] = useState([]);

    // Load data from localStorage on mount
    useEffect(() => {
        const savedTransactions = localStorage.getItem('securefin_transactions');
        const savedBudget = localStorage.getItem('securefin_budget');
        const savedLedger = localStorage.getItem('securefin_ledger');

        if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
        if (savedBudget) setBudget(JSON.parse(savedBudget));
        if (savedLedger) setLedger(JSON.parse(savedLedger));
    }, []);

    // Save data to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('securefin_transactions', JSON.stringify(transactions));
    }, [transactions]);

    useEffect(() => {
        if (budget) {
            localStorage.setItem('securefin_budget', JSON.stringify(budget));
        } else {
            localStorage.removeItem('securefin_budget');
        }
    }, [budget]);

    useEffect(() => {
        localStorage.setItem('securefin_ledger', JSON.stringify(ledger));
    }, [ledger]);

    const addTransaction = (transaction) => {
        setTransactions(prev => [transaction, ...prev]);
    };

    const setBudgetGoal = (amount, date) => {
        setBudget({ amount, date });
    };

    const addToLedger = (block) => {
        setLedger(prev => [block, ...prev]);
    };

    const clearAllData = () => {
        setTransactions([]);
        setBudget(null);
        setLedger([]);
        localStorage.removeItem('securefin_transactions');
        localStorage.removeItem('securefin_budget');
        localStorage.removeItem('securefin_ledger');
    };

    const value = {
        transactions,
        budget,
        ledger,
        addTransaction,
        setBudgetGoal,
        addToLedger,
        clearAllData
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}
