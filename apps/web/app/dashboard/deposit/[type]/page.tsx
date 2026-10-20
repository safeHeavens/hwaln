'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Check,
    Copy,
    QrCode,
    ShieldCheck,
    Building2,
    Bitcoin,
    UserSearch,
    ChevronRight,
    Info,
} from 'lucide-react';

interface PageParams {
    params: Promise<{
        type: string; // 'crypto' | 'fiat' | 'agent'
    }>;
}

// Mock Asset / Currency Configs
const CRYPTO_ASSETS = [
    { id: 'usdt', name: 'Tether', symbol: 'USDT', icon: '💲', popular: true },
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: '₿', popular: true },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', popular: false },
    { id: 'usdc', name: 'USD Coin', symbol: 'USDC', icon: '🪙', popular: false },
];

const NETWORKS: Record<string, Array<{ id: string; name: string; fee: string; time: string }>> = {
    usdt: [
        { id: 'trc20', name: 'Tron (TRC20)', fee: '0 USDT', time: '~2 mins' },
        { id: 'erc20', name: 'Ethereum (ERC20)', fee: '3.5 USDT', time: '~5 mins' },
        { id: 'bep20', name: 'BNB Smart Chain (BEP20)', fee: '0.2 USDT', time: '~1 min' },
    ],
    btc: [{ id: 'btc', name: 'Bitcoin Network', fee: '0.0001 BTC', time: '~15 mins' }],
    eth: [
        { id: 'erc20', name: 'Ethereum Mainnet', fee: '0.001 ETH', time: '~5 mins' },
        { id: 'arbitrum', name: 'Arbitrum One', fee: '0.0001 ETH', time: '~1 min' },
    ],
    usdc: [
        { id: 'solana', name: 'Solana (SOL)', fee: '0 USDC', time: '~30 secs' },
        { id: 'polygon', name: 'Polygon', fee: '0 USDC', time: '~1 min' },
    ],
};

export default function DepositPage({ params }: PageParams) {
    const resolvedParams = use(params);
    const depositType = resolvedParams.type || 'crypto';
    const router = useRouter();

    // Multi-step State Management
    // Step 1: Select Asset/Channel | Step 2: Select Network/Method | Step 3: Deposit Details & QR
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [selectedAsset, setSelectedAsset] = useState<typeof CRYPTO_ASSETS[0]>(CRYPTO_ASSETS[0]);
    const [selectedNetwork, setSelectedNetwork] = useState<string>('');
    const [copied, setCopied] = useState(false);

    // Dynamic Header Title Helper
    const getPageTitle = () => {
        if (depositType === 'crypto') {
            if (step === 1) return 'Select Crypto';
            if (step === 2) return `Select ${selectedAsset.symbol} Network`;
            return 'Deposit Details';
        }
        if (depositType === 'fiat') return 'USD Fiat Deposit';
        if (depositType === 'agent') return 'Payment Agent Transfer';
        return 'Deposit Funds';
    };

    const handleBack = () => {
        if (step > 1 && depositType === 'crypto') {
            setStep((prev) => (prev - 1) as 1 | 2 | 3);
        } else {
            router.push('/portfolio');
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const dummyDepositAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';

    return (
        <div className="min-h-screen w-full bg-[#0D0F14] text-white flex flex-col justify-between selection:bg-emerald-500/30">
            {/* Fixed Top Header (No Sidebar Layout) */}
            <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-[#0D0F14]/90 px-4 py-4 backdrop-blur-md sm:px-8">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="flex size-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white transition-all hover:bg-white/10 active:scale-95"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold sm:text-2xl">{getPageTitle()}</h1>
                        <p className="text-xs text-gray-400">Step {step} of 3</p>
                    </div>
                </div>

                {/* Step Progress Pills */}
                <div className="flex gap-1.5">
                    <span className={`h-1.5 w-6 rounded-full transition-all ${step >= 1 ? 'bg-emerald-400' : 'bg-white/20'}`} />
                    <span className={`h-1.5 w-6 rounded-full transition-all ${step >= 2 ? 'bg-emerald-400' : 'bg-white/20'}`} />
                    <span className={`h-1.5 w-6 rounded-full transition-all ${step >= 3 ? 'bg-emerald-400' : 'bg-white/20'}`} />
                </div>
            </header>

            {/* Main Content Area */}
            <main className="mx-auto w-full max-w-xl flex-1 px-4 py-6 sm:px-6">
                {/* ==================== CRYPTO DEPOSIT FLOW ==================== */}
                {depositType === 'crypto' && (
                    <>
                        {/* STEP 1: Select Crypto Asset */}
                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <p className="text-sm text-gray-400">Choose the cryptocurrency asset you wish to deposit into your account.</p>
                                <div className="space-y-2.5">
                                    {CRYPTO_ASSETS.map((asset) => (
                                        <button
                                            key={asset.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedAsset(asset);
                                                setStep(2);
                                            }}
                                            className="group flex w-full items-center justify-between rounded-2xl border border-white/10 bg-[#161922] p-4 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/[0.04] active:scale-[0.99]"
                                        >
                                            <div className="flex items-center gap-3.5">
                        <span className="flex size-11 items-center justify-center rounded-2xl bg-white/5 text-xl">
                          {asset.icon}
                        </span>
                                                <div className="text-left">
                                                    <h3 className="font-bold text-white group-hover:text-emerald-400">{asset.name}</h3>
                                                    <p className="text-xs text-gray-400">{asset.symbol}</p>
                                                </div>
                                            </div>
                                            <ChevronRight size={18} className="text-gray-500 transition-transform group-hover:translate-x-1 group-hover:text-emerald-400" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Select Network */}
                        {step === 2 && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <p className="text-sm text-gray-400">
                                    Ensure the selected network matches the network of your withdrawal platform to prevent loss of funds.
                                </p>
                                <div className="space-y-3">
                                    {(NETWORKS[selectedAsset.id] || NETWORKS.usdt).map((net) => (
                                        <button
                                            key={net.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedNetwork(net.name);
                                                setStep(3);
                                            }}
                                            className="group flex w-full items-center justify-between rounded-2xl border border-white/10 bg-[#161922] p-4 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/[0.04] active:scale-[0.99]"
                                        >
                                            <div className="text-left">
                                                <h4 className="font-bold text-white group-hover:text-emerald-400">{net.name}</h4>
                                                <p className="mt-0.5 text-xs text-gray-400">
                                                    Est. Arrival: <span className="text-gray-300">{net.time}</span> • Fee: <span className="text-emerald-400">{net.fee}</span>
                                                </p>
                                            </div>
                                            <ChevronRight size={18} className="text-gray-500 transition-transform group-hover:translate-x-1 group-hover:text-emerald-400" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* STEP 3: QR & Deposit Address Info */}
                        {step === 3 && (
                            <div className="space-y-6 animate-in zoom-in-95 duration-300">
                                {/* QR Code Card */}
                                <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#161922] p-6 text-center shadow-xl">
                                    <div className="flex items-center gap-2 mb-4">
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                      {selectedAsset.symbol} ({selectedNetwork})
                    </span>
                                    </div>

                                    {/* QR Code Container Placeholder */}
                                    <div className="flex size-44 items-center justify-center rounded-2xl bg-white p-3 text-black shadow-inner">
                                        <QrCode size={140} className="text-gray-900" />
                                    </div>
                                    <p className="mt-3 text-xs text-gray-400">Scan QR code using your wallet app</p>
                                </div>

                                {/* Deposit Address Copy Field */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        {selectedAsset.symbol} Deposit Address
                                    </label>
                                    <div className="flex items-center justify-between gap-2 rounded-2xl border border-white/10 bg-[#161922] p-3.5">
                                        <p className="truncate font-mono text-xs sm:text-sm text-gray-200">{dummyDepositAddress}</p>
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(dummyDepositAddress)}
                                            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500/20 active:scale-95"
                                        >
                                            {copied ? <Check size={16} /> : <Copy size={16} />}
                                            {copied ? 'Copied' : 'Copy'}
                                        </button>
                                    </div>
                                </div>

                                {/* Warning Card */}
                                <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-200/90 leading-relaxed">
                                    <Info size={18} className="shrink-0 text-amber-400 mt-0.5" />
                                    <p>
                                        Send only <strong className="text-white">{selectedAsset.symbol}</strong> via the{' '}
                                        <strong className="text-white">{selectedNetwork}</strong> network to this address. Sending any other asset or using an incorrect network will result in permanent loss.
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* ==================== FIAT / PAYMENT AGENT FLOW ==================== */}
                {depositType !== 'crypto' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="rounded-3xl border border-white/10 bg-[#161922] p-6 space-y-4">
                            <div className="flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                  {depositType === 'fiat' ? <Building2 size={24} /> : <UserSearch size={24} />}
                </span>
                                <div>
                                    <h3 className="text-lg font-bold text-white">
                                        {depositType === 'fiat' ? 'Bank Wire Deposit' : 'Verified Regional Agent'}
                                    </h3>
                                    <p className="text-xs text-gray-400">Instant local account assignment</p>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-4 space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">Bank Name</span>
                                    <span className="font-bold text-white">Standard Chartered</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">Account Name</span>
                                    <span className="font-bold text-white">WhalePips Global Ltd</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">Account Number</span>
                                    <span className="font-mono font-bold text-emerald-400">0092837411</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Sticky Bottom CTA Bar */}
            <footer className="sticky bottom-0 border-t border-white/10 bg-[#0D0F14]/95 p-4 backdrop-blur-md sm:px-8">
                <div className="mx-auto max-w-xl">
                    <button
                        type="button"
                        onClick={() => router.push('/portfolio')}
                        className="w-full rounded-2xl bg-emerald-400 py-4 text-center font-bold text-emerald-950 transition-all hover:bg-emerald-300 active:scale-[0.99] shadow-lg shadow-emerald-500/20"
                    >
                        Done
                    </button>
                </div>
            </footer>
        </div>
    );
}