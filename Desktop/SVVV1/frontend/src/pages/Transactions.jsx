import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ArrowDownLeft, ArrowUpRight, Copy, CheckCircle, Send } from 'lucide-react';
import PinModal from '../components/PinModal';

export default function Transactions() {
    const { user } = useAuth();
    const { transactions, addTransaction } = useApp();
    const [activeTab, setActiveTab] = useState('receive');
    const [filter, setFilter] = useState('all');

    // ✅ Hardcoded Balance for Prototype (Fixed at 5000)
    const fixedBalance = 5000;

    // Send form
    const [sendData, setSendData] = useState({
        recipientUid: '',
        amount: '',
        description: '',
        category: ''
    });

    const [copied, setCopied] = useState(false);
    const [showPinModal, setShowPinModal] = useState(false);
    const [pendingSendData, setPendingSendData] = useState(null);

    const sendCategories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Education', 'Other'];

    const handleCopyUID = () => {
        navigator.clipboard.writeText(user.uid);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSendSubmit = (e) => {
        e.preventDefault();

        // Store the send data and show PIN modal
        setPendingSendData(sendData);
        setShowPinModal(true);
    };

    const handlePinConfirm = async (pin) => {
        setShowPinModal(false);

        const result = await addTransaction({
            type: 'send',
            recipientUid: pendingSendData.recipientUid,
            amount: parseFloat(pendingSendData.amount),
            description: pendingSendData.description,
            category: pendingSendData.category,
            securityPin: pin
        });

        if (result.success) {
            setSendData({ recipientUid: '', amount: '', description: '', category: '' });
            setPendingSendData(null);
            alert(`✅ Payment successful! ₹${pendingSendData.amount} sent to ${pendingSendData.recipientUid}`);
        } else {
            alert(`❌ ${result.message}`);
        }
    };

    const filteredTransactions = transactions.filter(t => {
        if (filter === 'all') return true;
        return t.type === filter;
    });

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Transaction Form */}
                <div className="bg-secondary/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700 h-fit">
                    <div className="flex space-x-2 mb-6">
                        <button
                            onClick={() => setActiveTab('receive')}
                            className={`flex-1 py-3 rounded-lg font-medium transition-all flex items-center justify-center ${activeTab === 'receive'
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            <ArrowDownLeft className="w-5 h-5 mr-2" />
                            Receive
                        </button>
                        <button
                            onClick={() => setActiveTab('send')}
                            className={`flex-1 py-3 rounded-lg font-medium transition-all flex items-center justify-center ${activeTab === 'send'
                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            <ArrowUpRight className="w-5 h-5 mr-2" />
                            Send
                        </button>
                    </div>

                    {activeTab === 'receive' ? (
                        <div>
                            <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-emerald-400 font-medium">Your UID</p>
                                    <button
                                        onClick={handleCopyUID}
                                        className="flex items-center px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-colors text-sm"
                                    >
                                        {copied ? (
                                            <>
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4 mr-1" />
                                                Copy
                                            </>
                                        )}
                                    </button>
                                </div>
                                <p className="text-2xl font-bold text-white tracking-wide">{user?.uid}</p>
                                <p className="text-xs text-slate-400 mt-2">Share this ID to receive payments</p>
                            </div>

                            <div className="text-center py-8">
                                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                                    <p className="text-slate-300 text-lg mb-2">
                                        To receive money, simply share your UID with other users.
                                    </p>
                                    <p className="text-slate-400 text-sm">
                                        When they send money to your UID, it will automatically appear in your balance and transaction history.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                                <p className="text-sm text-blue-400 mb-1">Available Balance</p>
                                {/* ✅ Updated to use fixedBalance */}
                                <p className="text-3xl font-bold text-white">₹{fixedBalance.toFixed(2)}</p>
                            </div>

                            <form onSubmit={handleSendSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Recipient UID</label>
                                    <input
                                        type="text"
                                        value={sendData.recipientUid}
                                        onChange={(e) => setSendData({ ...sendData, recipientUid: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter recipient's UID"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Amount (₹)</label>
                                    <input
                                        type="number"
                                        value={sendData.amount}
                                        onChange={(e) => setSendData({ ...sendData, amount: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                                    <select
                                        value={sendData.category}
                                        onChange={(e) => setSendData({ ...sendData, category: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Category...</option>
                                        {sendCategories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                                    <input
                                        type="text"
                                        value={sendData.description}
                                        onChange={(e) => setSendData({ ...sendData, description: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., Payment for services"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center"
                                >
                                    <Send className="w-5 h-5 mr-2" />
                                    Send Money
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Transaction List */}
                <div className="bg-secondary/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700 h-[600px] flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
                        <div className="flex space-x-2">
                            {['all', 'receive', 'send'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1 rounded-lg text-xs capitalize transition-colors ${filter === f
                                        ? 'bg-emerald-500 text-white'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((t) => (
                                <div
                                    key={t._id || t.id}
                                    className="bg-slate-800/50 rounded-xl p-4 hover:bg-slate-800/70 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3 flex-1">
                                            <div className={`p-2 rounded-lg ${t.type === 'receive'
                                                ? 'bg-emerald-500/10 text-emerald-500'
                                                : 'bg-blue-500/10 text-blue-500'
                                                }`}>
                                                {t.type === 'receive' ? (
                                                    <ArrowDownLeft className="w-5 h-5" />
                                                ) : (
                                                    <ArrowUpRight className="w-5 h-5" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-white">{t.description}</h4>
                                                <p className="text-sm text-slate-400">{t.category}</p>
                                                {t.recipientUid && (
                                                    <p className="text-xs text-blue-400 mt-1">To: {t.recipientUid}</p>
                                                )}
                                                {t.senderUid && (
                                                    <p className="text-xs text-emerald-400 mt-1">From: {t.senderUid}</p>
                                                )}
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {new Date(t.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`font-bold text-lg ${t.type === 'receive' ? 'text-emerald-400' : 'text-blue-400'
                                            }`}>
                                            {t.type === 'receive' ? '+' : '-'}₹{t.amount.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 text-slate-500">
                                <p>No transactions yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <PinModal
                isOpen={showPinModal}
                onClose={() => {
                    setShowPinModal(false);
                    setPendingSendData(null);
                }}
                onSubmit={handlePinConfirm}
                title="Confirm Payment"
            />
        </div>
    );
}