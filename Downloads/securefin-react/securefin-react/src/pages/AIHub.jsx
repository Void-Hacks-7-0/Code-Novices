import { useState } from 'react';
import { Bot, Zap, Activity, Search, Calendar, MessageSquare, ArrowRight } from 'lucide-react';

export default function AIHub() {
    const [activeFeature, setActiveFeature] = useState(null);
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [chatInput, setChatInput] = useState('');

    const features = [
        {
            id: 'savings',
            title: 'Smart Savings Advisor',
            icon: Zap,
            color: 'text-yellow-400',
            bg: 'bg-yellow-400/10',
            desc: 'Get personalized tips to save more money based on your spending habits.',
            action: () => {
                return [
                    "1. You spent 15% more on dining out this week. Consider cooking at home.",
                    "2. Switch your subscription plan to annual billing to save 20%.",
                    "3. Invest your ₹5,000 surplus in a high-yield savings account."
                ];
            }
        },
        {
            id: 'anomaly',
            title: 'Anomaly Detection',
            icon: Activity,
            color: 'text-red-400',
            bg: 'bg-red-400/10',
            desc: 'Scan your recent transactions for suspicious or unusual activity.',
            action: () => {
                return "✅ No anomalies detected in your last 50 transactions. Your account is secure.";
            }
        },
        {
            id: 'health',
            title: 'Financial Health Score',
            icon: Activity,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
            desc: 'Calculate your financial wellness score based on income, savings, and debt.',
            action: () => {
                return "Your Financial Health Score is 85/100 (Excellent). You are saving 20% of your income!";
            }
        },
        {
            id: 'subscription',
            title: 'Subscription Manager',
            icon: Search,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
            desc: 'Identify recurring payments and potential unused subscriptions.',
            action: () => {
                return "Found 3 recurring subscriptions: Netflix (₹499), Spotify (₹119), Amazon Prime (₹1499/yr).";
            }
        },
        {
            id: 'forecast',
            title: 'Future Forecaster',
            icon: Calendar,
            color: 'text-purple-400',
            bg: 'bg-purple-400/10',
            desc: 'Predict your account balance for the next 30 days based on trends.',
            action: () => {
                return "Based on your spending, your projected balance next month will be ₹45,200 (+5% growth).";
            }
        },
    ];

    const handleFeatureClick = (feature) => {
        setActiveFeature(feature);
        setIsLoading(true);
        setResponse(null);

        // Simulate AI processing delay
        setTimeout(() => {
            const result = feature.action();
            setResponse(result);
            setIsLoading(false);
        }, 1500);
    };

    const handleChatSubmit = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        setActiveFeature({ title: 'Finance Chatbot', icon: MessageSquare, color: 'text-white', bg: 'bg-slate-700' });
        setIsLoading(true);
        setResponse(null);

        setTimeout(() => {
            setResponse(`I analyzed your query: "${chatInput}". Based on your data, you spent ₹2,400 on food this week.`);
            setIsLoading(false);
            setChatInput('');
        }, 1500);
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
                            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                                {Array.isArray(response) ? (
                                    <ul className="space-y-3 text-left">
                                        {response.map((item, idx) => (
                                            <li key={idx} className="text-slate-300 flex items-start">
                                                <span className="mr-2 text-accent">•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-slate-300 text-lg leading-relaxed">{response}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
