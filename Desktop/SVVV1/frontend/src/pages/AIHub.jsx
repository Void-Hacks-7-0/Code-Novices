import { useState } from 'react';
import { Bot, Zap, Activity, Search, Calendar, MessageSquare, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

// IMPORTANT: Replace this with your actual API key
const GEMINI_API_KEY = "AIzaSyC3FTbeQA3NxuClB2hkX4yJ2lP-ni6APrs";

export default function AIHub() {
    const { transactions, budgetGoals } = useApp();
    const [activeFeature, setActiveFeature] = useState(null);
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [chatInput, setChatInput] = useState('');

    const generateAIResponse = async (prompt) => {
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }]
                    })
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error("AI Error:", error);
            return `Error: ${error.message}\n\nPlease check:\n1. Your API key is correct\n2. Billing is enabled in Google Cloud Console\n3. The Gemini API is enabled for your project`;
        }
    };

    const features = [
        {
            id: 'savings',
            title: 'Smart Savings Advisor',
            icon: Zap,
            color: 'text-yellow-400',
            bg: 'bg-yellow-400/10',
            desc: 'Get personalized tips to save more money based on your spending habits.',
            generatePrompt: () => {
                const totalIncome = transactions
                    .filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
                const totalExpenses = transactions
                    .filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
                const balance = totalIncome - totalExpenses;

                const budgetInfo = budgetGoals.length > 0
                    ? `Active Budget Goals: ${budgetGoals.map(g => `₹${g.amount} (${g.name}) due on ${new Date(g.date).toLocaleDateString()}`).join(', ')}`
                    : 'No budget goals set';

                const recentTransactions = transactions.slice(0, 10);

                return `Role: You are a personal finance coach for an Indian student/young professional.

Input Data:

Current Financial Situation:
- Current Balance: ₹${balance.toFixed(2)}
- Total Income: ₹${totalIncome.toFixed(2)}
- Total Expenses: ₹${totalExpenses.toFixed(2)}
- ${budgetInfo}

Recent Transactions (last 10):
${recentTransactions.map(t => `- ${t.type.toUpperCase()}: ₹${t.amount} in ${t.category} on ${new Date(t.date).toLocaleDateString()}`).join('\n')}

Based on this data, provide 1-2 specific, actionable ways to save money (reference specific expense categories) OR recommend a low-risk savings/investment scheme relevant to the Indian context to help meet the payment goal faster. Keep it concise and practical.`;
            }
        },
        {
            id: 'anomaly',
            title: 'Anomaly Detection',
            icon: Activity,
            color: 'text-red-400',
            bg: 'bg-red-400/10',
            desc: 'Scan your recent transactions for suspicious or unusual activity.',
            generatePrompt: () => {
                if (transactions.length === 0) {
                    return "No transactions available to analyze.";
                }

                const latestTransaction = transactions[0];
                const allTransactions = transactions.slice(0, 50);

                return `Role: You are a Financial Anomaly Detector analyzing transaction patterns.

Input Data:

Transaction History (up to 50 transactions):
${allTransactions.map(t => `- ${t.type.toUpperCase()}: ₹${t.amount} in ${t.category} on ${new Date(t.date).toLocaleDateString()}`).join('\n')}

Latest Transaction:
- Type: ${latestTransaction.type.toUpperCase()}
- Amount: ₹${latestTransaction.amount}
- Category: ${latestTransaction.category}
- Date: ${new Date(latestTransaction.date).toLocaleString()}
- Time: ${new Date(latestTransaction.date).toLocaleTimeString()}

Question: Does this latest transaction of ₹${latestTransaction.amount} in the ${latestTransaction.category} category look genuinely suspicious based on past spending patterns?

Provide your answer in this format:
VERDICT: YES or NO
REASON: [Brief explanation in max 2 sentences]`;
            }
        },
        {
            id: 'health',
            title: 'Financial Health Score',
            icon: Activity,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
            desc: 'Calculate your financial wellness score based on income, savings, and debt.',
            generatePrompt: () => {
                const totalIncome = transactions
                    .filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
                const totalExpenses = transactions
                    .filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

                return `Calculate a "Financial Health Score" out of 100 based on these financial metrics:
- Total Income: ₹${totalIncome.toFixed(2)}
- Total Expenses: ₹${totalExpenses.toFixed(2)}
- Savings Rate: ${totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0}%

Provide:
1. A score out of 100
2. Brief explanation (2-3 sentences)
3. One key recommendation`;
            }
        },
        {
            id: 'subscription',
            title: 'Subscription Manager',
            icon: Search,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
            desc: 'Identify recurring payments and potential unused subscriptions.',
            generatePrompt: () => {
                const recentTransactions = transactions.slice(0, 50).map(t => ({
                    description: t.description,
                    amount: t.amount,
                    category: t.category,
                    date: t.date
                }));

                return `Analyze these transactions and identify potential recurring subscriptions or regular payments:
${JSON.stringify(recentTransactions, null, 2)}

List any subscriptions you find with:
- Name
- Estimated monthly cost
- Suggestion (keep/review/cancel)`;
            }
        },
        {
            id: 'forecast',
            title: 'Future Forecaster',
            icon: Calendar,
            color: 'text-purple-400',
            bg: 'bg-purple-400/10',
            desc: 'Predict your account balance for the next 30 days based on trends.',
            generatePrompt: () => {
                const totalIncome = transactions
                    .filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
                const totalExpenses = transactions
                    .filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
                const balance = totalIncome - totalExpenses;

                return `Based on these financial patterns:
- Current Balance: ₹${balance.toFixed(2)}
- Average Monthly Income: ₹${totalIncome.toFixed(2)}
- Average Monthly Expenses: ₹${totalExpenses.toFixed(2)}

Predict the account balance for the next 30 days. Provide:
1. Projected balance
2. Key assumptions
3. One risk factor to watch`;
            }
        },
    ];

    const handleFeatureClick = async (feature) => {
        setActiveFeature(feature);
        setIsLoading(true);
        setResponse(null);

        const prompt = feature.generatePrompt();
        const result = await generateAIResponse(prompt);
        setResponse(result);
        setIsLoading(false);
    };

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        setActiveFeature({ title: 'Finance Chatbot', icon: MessageSquare, color: 'text-white', bg: 'bg-slate-700' });
        setIsLoading(true);
        setResponse(null);

        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const totalExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const recentTransactions = transactions.slice(0, 20).map(t => ({
            date: new Date(t.date).toLocaleDateString(),
            amount: t.amount,
            type: t.type,
            category: t.category,
            description: t.description
        }));

        const prompt = `You are a helpful financial assistant for an Indian user.

Financial Summary:
- Total Income: ₹${totalIncome.toFixed(2)}
- Total Expenses: ₹${totalExpenses.toFixed(2)}
- Current Balance: ₹${(totalIncome - totalExpenses).toFixed(2)}

Recent Transactions:
${JSON.stringify(recentTransactions, null, 2)}

User Question: "${chatInput}"

Answer the user's question based on their financial data. Be helpful, concise, and use Indian Rupees (₹) in your response.`;

        const result = await generateAIResponse(prompt);
        setResponse(result);
        setIsLoading(false);
        setChatInput('');
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature) => (
                    <button
                        key={feature.id}
                        onClick={() => handleFeatureClick(feature)}
                        className="text-left bg-secondary/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700 hover:border-accent/50 hover:bg-slate-800 transition-all group"
                    >
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.bg}`}>
                            <feature.icon className={`w-6 h-6 ${feature.color}`} />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-accent transition-colors">
                            {feature.title}
                        </h3>
                        <p className="text-slate-400 text-sm">{feature.desc}</p>
                    </button>
                ))}

                {/* Chatbot Card */}
                <div className="md:col-span-2 lg:col-span-3 bg-secondary/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-indigo-500/10 p-2 rounded-lg">
                            <Bot className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Ask SecureFin AI</h3>
                    </div>
                    <form onSubmit={handleChatSubmit} className="relative">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Ask anything, e.g., 'How much did I spend on food?'"
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-4 pr-12 py-3 text-white focus:outline-none focus:border-accent"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-accent rounded-md text-white hover:bg-emerald-600 transition-colors"
                            disabled={isLoading}
                        >
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>

            {/* AI Response Modal/Area */}
            {(isLoading || response) && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-2xl p-8 max-w-lg w-full border border-slate-700 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => { setResponse(null); setIsLoading(false); setActiveFeature(null); }}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            ✕
                        </button>

                        <div className="text-center mb-6">
                            <div className={`inline-flex p-3 rounded-full mb-4 ${activeFeature?.bg || 'bg-slate-700'}`}>
                                {activeFeature?.icon && <activeFeature.icon className={`w-8 h-8 ${activeFeature.color}`} />}
                            </div>
                            <h3 className="text-xl font-bold text-white">{activeFeature?.title}</h3>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center py-8">
                                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-slate-400 animate-pulse">Analyzing financial data...</p>
                            </div>
                        ) : (
                            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700 max-h-[60vh] overflow-y-auto">
                                <div className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                                    {response}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
