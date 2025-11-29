import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, TrendingUp, Lock, Users, Zap, Globe, ArrowRight, Mail, Phone, MapPin, ChevronDown } from 'lucide-react';

export default function Landing() {
    const [faqOpen, setFaqOpen] = useState(null);

    const features = [
        {
            icon: Shield,
            title: 'Blockchain Security',
            description: 'Every transaction is recorded on an immutable blockchain ledger for complete transparency'
        },
        {
            icon: TrendingUp,
            title: 'Smart Analytics',
            description: 'AI-powered insights help you make better financial decisions and save more'
        },
        {
            icon: Users,
            title: 'Peer-to-Peer Payments',
            description: 'Send money instantly to anyone using their unique UID with security PIN protection'
        },
        {
            icon: Lock,
            title: 'Bank-Grade Security',
            description: 'Your data is protected with JWT authentication and encrypted security PINs'
        },
        {
            icon: Zap,
            title: 'Instant Transfers',
            description: 'Real-time balance updates and transaction processing with blockchain verification'
        },
        {
            icon: Globe,
            title: 'Government Schemes',
            description: 'Access information about financial inclusion schemes like PMJDY, APY, and more'
        }
    ];

    const faqs = [
        {
            question: 'What is SecureFin?',
            answer: 'SecureFin is a blockchain-powered financial management platform that helps you track transactions, send money securely, and access government financial schemes.'
        },
        {
            question: 'How do I get started?',
            answer: 'Simply sign up for a free account and you\'ll receive 5000 rupees as starting balance. You\'ll also get a unique UID for receiving payments.'
        },
        {
            question: 'What is a UID?',
            answer: 'UID (Unique Identifier) is your personal payment address. Share it with others to receive money instantly and securely.'
        },
        {
            question: 'Is my data secure?',
            answer: 'Absolutely! We use JWT authentication, encrypted security PINs, and blockchain technology to ensure your data and transactions are completely secure.'
        },
        {
            question: 'How does blockchain work here?',
            answer: 'Every transaction is logged on a public blockchain ledger with cryptographic hashing, making it transparent and tamper-proof.'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-lg border-b border-slate-700 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <Shield className="w-8 h-8 text-emerald-500" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                                SecureFin
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="text-slate-300 hover:text-white transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/10 mb-8 animate-pulse">
                        <Shield className="w-12 h-12 text-emerald-500" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-white via-emerald-200 to-blue-200 bg-clip-text text-transparent">
                            Financial Freedom
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                            Powered by Blockchain
                        </span>
                    </h1>
                    <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
                        Manage your finances with cutting-edge blockchain technology. Send money instantly,
                        track expenses, and access government schemes - all in one secure platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/signup"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/20 flex items-center justify-center"
                        >
                            Start Free - Get ₹5000
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                        <a
                            href="#features"
                            className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all border border-slate-600"
                        >
                            Learn More
                        </a>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 bg-slate-800/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Why Choose SecureFin?</h2>
                        <p className="text-slate-400 text-lg">Everything you need for modern financial management</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-slate-900/50 backdrop-blur-lg p-8 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/10"
                            >
                                <div className="bg-emerald-500/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                                    <feature.icon className="w-7 h-7 text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
                        <p className="text-slate-400 text-lg">Get started in three simple steps</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: '01', title: 'Sign Up', desc: 'Create your account and get your unique UID with ₹5000 starting balance' },
                            { step: '02', title: 'Add Transactions', desc: 'Track your income and expenses, or send money to other users via UID' },
                            { step: '03', title: 'Stay Secure', desc: 'All transactions are logged on blockchain for complete transparency' }
                        ].map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="bg-gradient-to-br from-emerald-500 to-blue-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                                    {item.step}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-4 bg-slate-800/50">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                        <p className="text-slate-400 text-lg">Everything you need to know</p>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-slate-900/50 backdrop-blur-lg rounded-xl border border-slate-700 overflow-hidden"
                            >
                                <button
                                    onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                                    className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-slate-800/50 transition-colors"
                                >
                                    <span className="text-lg font-semibold text-white">{faq.question}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-emerald-500 transition-transform ${faqOpen === index ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {faqOpen === index && (
                                    <div className="px-6 pb-5 text-slate-400">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Get in Touch</h2>
                        <p className="text-slate-400 text-lg">We're here to help you</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="bg-slate-900/50 backdrop-blur-lg p-8 rounded-2xl border border-slate-700 text-center">
                            <Mail className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Email</h3>
                            <p className="text-slate-400">support@securefin.com</p>
                        </div>
                        <div className="bg-slate-900/50 backdrop-blur-lg p-8 rounded-2xl border border-slate-700 text-center">
                            <Phone className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Phone</h3>
                            <p className="text-slate-400">+91 1800-123-4567</p>
                        </div>
                        <div className="bg-slate-900/50 backdrop-blur-lg p-8 rounded-2xl border border-slate-700 text-center">
                            <MapPin className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Address</h3>
                            <p className="text-slate-400">Mumbai, Maharashtra, India</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 border-t border-slate-800 py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <Shield className="w-8 h-8 text-emerald-500" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                                SecureFin
                            </span>
                        </div>
                        <div className="text-slate-400 text-center md:text-right">
                            <p>&copy; 2024 SecureFin. All rights reserved.</p>
                            <p className="text-sm mt-2">Powered by Blockchain Technology</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
