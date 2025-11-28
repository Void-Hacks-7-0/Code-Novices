import { useApp } from '../context/AppContext';
import { Database, Link, Clock, Hash } from 'lucide-react';

export default function Blockchain() {
    const { ledger } = useApp();

    return (
        <div className="space-y-6">
            <div className="bg-secondary/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="bg-indigo-500/10 p-2 rounded-lg">
                        <Database className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Blockchain Ledger</h3>
                        <p className="text-slate-400 text-sm">Immutable record of all financial transactions</p>
                    </div>
                </div>
            </div>

            <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-700"></div>

                <div className="space-y-8">
                    {ledger.length > 0 ? (
                        ledger.map((block, index) => (
                            <div key={block.id} className="relative pl-20 animate-in slide-in-from-left duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                                {/* Connector Node */}
                                <div className="absolute left-6 top-6 w-4 h-4 bg-slate-900 border-2 border-accent rounded-full z-10"></div>

                                {/* Block Card */}
                                <div className="bg-secondary/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700 hover:border-accent/50 transition-colors">
                                    <div className="flex items-center justify-between mb-4 border-b border-slate-700/50 pb-4">
                                        <div className="flex items-center space-x-2">
                                            <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs font-mono">
                                                Block #{ledger.length - index}
                                            </span>
                                            <span className="text-slate-500 text-xs flex items-center">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {new Date(block.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-accent text-xs">
                                            <Link className="w-3 h-3 mr-1" />
                                            Verified
                                        </div>
                                    </div>

                                    <div className="space-y-3 font-mono text-xs md:text-sm">
                                        <div>
                                            <span className="text-slate-500 block mb-1">Data</span>
                                            <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50 text-emerald-400">
                                                {block.data}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-slate-500 block mb-1 flex items-center">
                                                    <Hash className="w-3 h-3 mr-1" /> Previous Hash
                                                </span>
                                                <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50 text-slate-400 truncate">
                                                    {block.prevHash}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 block mb-1 flex items-center">
                                                    <Hash className="w-3 h-3 mr-1" /> Current Hash
                                                </span>
                                                <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50 text-indigo-400 truncate">
                                                    {block.hash}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 pl-20">
                            <div className="inline-flex p-4 rounded-full bg-slate-800 mb-4">
                                <Link className="w-8 h-8 text-slate-500" />
                            </div>
                            <p className="text-slate-400">No blocks mined yet.</p>
                            <p className="text-slate-500 text-sm mt-1">Enable "Log to Blockchain Ledger" when adding transactions.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
