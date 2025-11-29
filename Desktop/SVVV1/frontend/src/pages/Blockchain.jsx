import { useState, useEffect } from 'react';
import { Database, Hash, Clock, Link as LinkIcon } from 'lucide-react';
import { blockchainAPI } from '../utils/api';

export default function Blockchain() {
    const [ledger, setLedger] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLedger();
    }, []);

    const fetchLedger = async () => {
        try {
            setLoading(true);
            const response = await blockchainAPI.getLedger();
            setLedger(response.data);
        } catch (error) {
            console.error('Failed to fetch blockchain ledger:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Blockchain Ledger</h2>
                    <p className="text-slate-400 mt-2">Public, immutable transaction records</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2">
                    <p className="text-sm text-emerald-400">Total Blocks: {ledger.length}</p>
                </div>
            </div>

            {ledger.length === 0 ? (
                <div className="bg-secondary/50 backdrop-blur-lg p-12 rounded-2xl border border-slate-700 text-center">
                    <Database className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Blocks Yet</h3>
                    <p className="text-slate-400">
                        Transactions will appear here once they are logged on the blockchain
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {ledger.map((block) => (
                        <div
                            key={block._id}
                            className="bg-secondary/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-emerald-500/10 p-3 rounded-lg">
                                        <Database className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Block #{block.blockNumber}</h3>
                                        <p className="text-sm text-slate-400 flex items-center mt-1">
                                            <Clock className="w-4 h-4 mr-1" />
                                            {new Date(block.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-emerald-500">₹{block.amount.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="bg-slate-800/50 rounded-lg p-4">
                                    <div className="flex items-center mb-2">
                                        <Hash className="w-4 h-4 text-emerald-500 mr-2" />
                                        <p className="text-sm text-slate-400">Block Hash</p>
                                    </div>
                                    <p className="text-xs font-mono text-white break-all">{block.hash}</p>
                                </div>

                                <div className="bg-slate-800/50 rounded-lg p-4">
                                    <div className="flex items-center mb-2">
                                        <LinkIcon className="w-4 h-4 text-blue-500 mr-2" />
                                        <p className="text-sm text-slate-400">Previous Hash</p>
                                    </div>
                                    <p className="text-xs font-mono text-white break-all">{block.previousHash}</p>
                                </div>

                                <div className="bg-slate-800/50 rounded-lg p-4">
                                    <p className="text-sm text-slate-400 mb-2">Transaction Data</p>
                                    <p className="text-white">{block.transactionData}</p>
                                    {block.fromUid && block.toUid && (
                                        <div className="mt-3 flex items-center justify-between text-sm">
                                            <span className="text-red-400">From: {block.fromUid}</span>
                                            <span className="text-slate-500">→</span>
                                            <span className="text-emerald-400">To: {block.toUid}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
