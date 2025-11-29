import { Building2, Shield, Heart, Briefcase, GraduationCap, Smartphone } from 'lucide-react';

export default function Schemes() {
    const schemes = [
        {
            icon: Building2,
            acronym: 'PMJDY',
            title: 'Pradhan Mantri Jan Dhan Yojana',
            description: 'Gives every adult a basic bank account with no minimum balance, RuPay debit card and access to government benefit transfers directly into the account.',
            benefits: 'It aims to bring unbanked people into the formal banking system and support savings, insurance and credit for poor households.',
            color: 'emerald'
        },
        {
            icon: Heart,
            acronym: 'PMJJBY',
            title: 'Pradhan Mantri Jeevan Jyoti Bima Yojana',
            description: 'Provides low-cost life insurance cover for eligible bank account holders for a fixed sum assured in case of death from any cause.',
            benefits: 'The premium is auto-deducted from the bank account once a year, making it easy to maintain coverage for low-income users.',
            color: 'blue'
        },
        {
            icon: Shield,
            acronym: 'PMSBY',
            title: 'Pradhan Mantri Suraksha Bima Yojana',
            description: 'Offers very affordable accident insurance that pays a benefit in case of accidental death or disability.',
            benefits: 'It is targeted at workers and daily earners who face higher physical risk but cannot afford regular commercial policies.',
            color: 'purple'
        },
        {
            icon: GraduationCap,
            acronym: 'APY',
            title: 'Atal Pension Yojana',
            description: 'A pension scheme for workers in the unorganised sector where they contribute small amounts regularly and receive a guaranteed pension after 60 years.',
            benefits: 'The government supports the scheme so that low-income people can have old-age income security even without formal jobs.',
            color: 'orange'
        },
        {
            icon: Briefcase,
            acronym: 'PMMY',
            title: 'Pradhan Mantri MUDRA Yojana',
            description: 'Provides small business loans to micro and small entrepreneurs, such as shopkeepers, artisans and street vendors, to start or expand their work.',
            benefits: 'Loans are categorised as Shishu, Kishor and Tarun based on size, helping different growth stages of small enterprises.',
            color: 'pink'
        },
        {
            icon: Smartphone,
            acronym: 'Digital Literacy',
            title: 'Digital Literacy & Access Initiatives',
            description: 'Covers programmes that train citizens to use bank accounts, digital payments, UPI and ATMs safely so they can actually benefit from these schemes.',
            benefits: 'Such initiatives support financial inclusion by reducing fear of technology and helping first-time users avoid fraud.',
            color: 'cyan'
        }
    ];

    const colorClasses = {
        emerald: {
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/30',
            text: 'text-emerald-500',
            hover: 'hover:border-emerald-500/50'
        },
        blue: {
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/30',
            text: 'text-blue-500',
            hover: 'hover:border-blue-500/50'
        },
        purple: {
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/30',
            text: 'text-purple-500',
            hover: 'hover:border-purple-500/50'
        },
        orange: {
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/30',
            text: 'text-orange-500',
            hover: 'hover:border-orange-500/50'
        },
        pink: {
            bg: 'bg-pink-500/10',
            border: 'border-pink-500/30',
            text: 'text-pink-500',
            hover: 'hover:border-pink-500/50'
        },
        cyan: {
            bg: 'bg-cyan-500/10',
            border: 'border-cyan-500/30',
            text: 'text-cyan-500',
            hover: 'hover:border-cyan-500/50'
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-4">Government Financial Schemes</h2>
                <p className="text-slate-400 text-lg max-w-3xl mx-auto">
                    Explore government initiatives designed to promote financial inclusion and support citizens across India
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {schemes.map((scheme, index) => {
                    const colors = colorClasses[scheme.color];
                    return (
                        <div
                            key={index}
                            className={`bg-secondary/50 backdrop-blur-lg p-8 rounded-2xl border ${colors.border} ${colors.hover} transition-all transform hover:scale-[1.02] hover:shadow-xl`}
                        >
                            <div className="flex items-start space-x-4 mb-6">
                                <div className={`${colors.bg} p-4 rounded-xl`}>
                                    <scheme.icon className={`w-8 h-8 ${colors.text}`} />
                                </div>
                                <div className="flex-1">
                                    <div className={`inline-block px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-sm font-bold mb-2`}>
                                        {scheme.acronym}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{scheme.title}</h3>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-400 mb-2">Description</h4>
                                    <p className="text-slate-300 leading-relaxed">{scheme.description}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-slate-400 mb-2">Benefits</h4>
                                    <p className="text-slate-300 leading-relaxed">{scheme.benefits}</p>
                                </div>

                                <button className={`w-full ${colors.bg} ${colors.text} hover:bg-opacity-80 font-medium py-3 rounded-lg transition-colors`}>
                                    Learn More & Apply
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Need Help?</h3>
                <p className="text-slate-300 mb-6">
                    Contact your nearest bank branch or visit the official government portals for more information and application procedures.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="https://pmjdy.gov.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
                    >
                        PMJDY Portal
                    </a>
                    <a
                        href="https://www.india.gov.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                    >
                        India.gov.in
                    </a>
                </div>
            </div>
        </div>
    );
}
