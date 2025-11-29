import { useState } from 'react';
import { X } from 'lucide-react';

export default function PinModal({ isOpen, onClose, onSubmit, title = "Enter Security PIN" }) {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. Length Validation (Sirf ye check karenge ki length sahi hai)
        if (pin.length < 4 || pin.length > 6) {
            setError('PIN/Password must be 4-6 characters');
            return;
        }

        // ✅ No Security Check: User ne jo bhi type kiya, use accept kar lo
        // Ab koi "Incorrect PIN" error nahi aayega.
        onSubmit(pin);
        
        setPin('');
        setError('');
    };

    const handleClose = () => {
        setPin('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-2xl border border-slate-700 p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-white">{title}</h3>
                    <button
                        onClick={handleClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-3">
                            Enter Any PIN or Password
                        </label>
                        <input
                            type="password"
                            value={pin}
                            onChange={(e) => {
                                setPin(e.target.value);
                                setError('');
                            }}
                            maxLength="6"
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-4 text-white text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="••••••"
                            autoFocus
                        />
                        {error && <p className="text-red-400 text-sm mt-2 font-bold">{error}</p>}
                    </div>

                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors"
                        >
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}