'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    ArrowLeft,
    Check,
    Copy,
    QrCode,
    Building2,
    UserSearch,
    Info,
    Search,
} from 'lucide-react';

// Helper function to fetch high-res crypto logos via LogoKit API
const getCryptoLogo = (symbol: string) =>
    `https://img.logokit.com/crypto/${symbol.toLowerCase()}?token=pk_fr61cb1469e51c423e5b06`;

const CRYPTO_ASSETS = [
    { id: 'usdt', name: 'Tether', symbol: 'USDT', recommended: true },
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', recommended: false },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', recommended: false },
    { id: 'usdc', name: 'USD Coin', symbol: 'USDC', recommended: false },
];

const NETWORKS: Record<string, Array<{ id: string; name: string; fee: string; time: string; recommended?: boolean }>> = {
    usdt: [
        { id: 'trc20', name: 'Tron (TRC20)', fee: '0 USDT', time: '~2 mins', recommended: true },
        { id: 'erc20', name: 'Ethereum (ERC20)', fee: '3.5 USDT', time: '~5 mins', recommended: false },
        { id: 'bep20', name: 'BNB Smart Chain (BEP20)', fee: '0.2 USDT', time: '~1 min', recommended: false },
    ],
    btc: [{ id: 'btc', name: 'Bitcoin Network', fee: '0.0001 BTC', time: '~15 mins', recommended: true }],
    eth: [
        { id: 'erc20', name: 'Ethereum Mainnet', fee: '0.001 ETH', time: '~5 mins', recommended: true },
        { id: 'arbitrum', name: 'Arbitrum One', fee: '0.0001 ETH', time: '~1 min', recommended: false },
    ],
    usdc: [
        { id: 'solana', name: 'Solana (SOL)', fee: '0 USDC', time: '~30 secs', recommended: true },
        { id: 'polygon', name: 'Polygon', fee: '0 USDC', time: '~1 min', recommended: false },
    ],
};

export default function DepositFlowPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Read query parameters
    const returnUrl = searchParams.get('returnTo') || 'portfolio';
    const initialFlow = searchParams.get('flow'); // 'usd' | 'crypto' | 'agent' | null

    // Flow states
    const [selectedFlow, setSelectedFlow] = useState<string | null>(initialFlow);
    const [step, setStep] = useState<number>(initialFlow ? 1 : 0);
    const [selectedAsset, setSelectedAsset] = useState(CRYPTO_ASSETS[0]);
    const [selectedNetwork, setSelectedNetwork] = useState('');
    const [copied, setCopied] = useState(false);
    const [cryptoSearchQuery, setCryptoSearchQuery] = useState('');

    const getPageTitle = () => {
        if (step === 0) return 'Deposit Funds';
        if (selectedFlow === 'crypto') {
            if (step === 1) return 'Select Crypto';
            if (step === 2) return `Choose ${selectedAsset.symbol} network`;
            return `Deposit ${selectedAsset.symbol} ${selectedNetwork}`;
        }
        if (selectedFlow === 'usd' || selectedFlow === 'fiat') return 'USD Deposit';
        if (selectedFlow === 'agent') return 'Payment Agent';
        return 'Deposit';
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else if (step === 1 && initialFlow) {
            router.push(`/dashboard/${returnUrl}`);
        } else if (step === 1) {
            setStep(0);
            setSelectedFlow(null);
        } else {
            router.push(`/dashboard/${returnUrl}`);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const dummyDepositAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';

    // Filter crypto assets based on search query
    const filteredCryptoAssets = CRYPTO_ASSETS.filter(
        (asset) =>
            asset.name.toLowerCase().includes(cryptoSearchQuery.toLowerCase()) ||
            asset.symbol.toLowerCase().includes(cryptoSearchQuery.toLowerCase())
    );

    // Final completion step check
    const isFinalStep = (selectedFlow === 'crypto' && step === 3) || (selectedFlow && selectedFlow !== 'crypto' && step > 0);

    return (
        <div className="min-h-screen w-full bg-white dark:bg-[#0D0F14] text-gray-900 dark:text-white flex flex-col justify-between transition-colors">
            {/* Top Header - Strictly Aligned Left */}
            <header className="sticky top-0 z-50 zborder-b border-gray-100 dark:border-white/10 bg-white/90 dark:bg-[#0D0F14]/90 backdrop-blur-md">
                <div className="mx-auto w-full max-w-xl px-4 py-4 sm:px-2 flex flex-col items-start gap-3.5">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white transition-all hover:bg-gray-200 dark:hover:bg-white/10 active:scale-95"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={19} />
                    </button>
                    <h1 className="text-lg font-semibold mt-2 sm:text-2xl text-gray-950 dark:text-white tracking-tight">{getPageTitle()}</h1>
                </div>
            </header>

            {/* Main Container */}
            <main className="mx-auto w-full max-w-xl flex-1 px-4 py-6 sm:px-1 space-y-6">
                {/* STEP 0: Selection Options */}
                {step === 0 && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Select your preferred deposit channel to begin.</p>
                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={() => { setSelectedFlow('usd'); setStep(1); }}
                                className="group w-full rounded-2xl bg-gray-100 dark:bg-[#161922] p-4 text-left transition-all hover:bg-gray-200/80 dark:hover:bg-white/[0.06]"
                            >
                                <div className="flex items-center gap-3.5">
                                    <span className="flex size-11 items-center justify-center rounded-xl bg-white dark:bg-white/5 text-gray-900 dark:text-white shadow-sm">
                                        <Building2 size={22} />
                                    </span>
                                    <div>
                                        <h3 className="font-bold text-gray-950 dark:text-white">USD Deposit</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Bank transfer, credit/debit cards & wire</p>
                                    </div>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => { setSelectedFlow('crypto'); setStep(1); }}
                                className="group w-full rounded-2xl bg-gray-100 dark:bg-[#161922] p-4 text-left transition-all hover:bg-gray-200/80 dark:hover:bg-white/[0.06]"
                            >
                                <div className="flex items-start justify-between gap-3.5">
                                    <div className="flex items-center gap-3.5">
                                        <span className="flex size-11 items-center justify-center rounded-xl bg-white dark:bg-white/5 p-2 shadow-sm shrink-0">
                                            <img
                                                src={getCryptoLogo('usdt')}
                                                alt="Crypto"
                                                className="size-full object-contain"
                                                loading="lazy"
                                            />
                                        </span>
                                        <div>
                                            <h3 className="font-bold text-gray-950 dark:text-white">Crypto</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Deposit USDT, BTC, ETH via multi-chain networks</p>
                                        </div>
                                    </div>
                                    <span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                        Recommended
                                    </span>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => { setSelectedFlow('agent'); setStep(1); }}
                                className="group w-full rounded-2xl bg-gray-100 dark:bg-[#161922] p-4 text-left transition-all hover:bg-gray-200/80 dark:hover:bg-white/[0.06]"
                            >
                                <div className="flex items-center gap-3.5">
                                    <span className="flex size-11 items-center justify-center rounded-xl bg-white dark:bg-white/5 text-gray-900 dark:text-white shadow-sm">
                                        <UserSearch size={22} />
                                    </span>
                                    <div>
                                        <h3 className="font-bold text-gray-950 dark:text-white">Payment Agent</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Local currency transfers via verified agents</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {/* CRYPTO FLOW */}
                {selectedFlow === 'crypto' && step > 0 && (
                    <>
                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Choose the cryptocurrency asset you wish to deposit.</p>

                                {/* Full-Width Crypto Search Input */}
                                <div className="relative w-full">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                                        <Search size={18} />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Search crypto asset (e.g. USDT, Bitcoin)..."
                                        value={cryptoSearchQuery}
                                        onChange={(e) => setCryptoSearchQuery(e.target.value)}
                                        className="w-full rounded-2xl bg-gray-100 dark:bg-[#161922] py-3.5 pl-11 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-gray-200/80 dark:focus:ring-white/10"
                                    />
                                </div>

                                <div className="space-y-2.5">
                                    {filteredCryptoAssets.length > 0 ? (
                                        filteredCryptoAssets.map((asset) => (
                                            <button
                                                key={asset.id}
                                                type="button"
                                                onClick={() => { setSelectedAsset(asset); setStep(2); }}
                                                className="group w-full rounded-2xl bg-gray-100 dark:bg-[#161922] p-4 text-left transition-all hover:bg-gray-200/80 dark:hover:bg-white/[0.06]"
                                            >
                                                <div className="flex items-center justify-between gap-3.5">
                                                    <div className="flex items-center gap-3.5">
                                                        <span className="flex size-11 items-center justify-center rounded-2xl bg-transparent dark:bg-transparent p-2 shrink-0">
                                                            <img
                                                                src={getCryptoLogo(asset.symbol)}
                                                                alt={asset.name}
                                                                className="size-full object-contain"
                                                                loading="lazy"
                                                            />
                                                        </span>
                                                        <div>
                                                            <h3 className="font-bold text-gray-950 dark:text-white">{asset.name}</h3>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">{asset.symbol}</p>
                                                        </div>
                                                    </div>
                                                    {asset.recommended && (
                                                        <span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                                                            Recommended
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center text-sm text-gray-400">
                                            No cryptocurrencies found matching "{cryptoSearchQuery}"
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Choose Network */}
                        {step === 2 && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Select the network corresponding to your withdrawal platform.</p>
                                <div className="space-y-3">
                                    {(NETWORKS[selectedAsset.id] || NETWORKS.usdt).map((net) => {
                                        const isErc20 = net.id === 'erc20' || net.name.toLowerCase().includes('erc20');
                                        const minDeposit = isErc20 ? '$20' : '$10';

                                        return (
                                            <button
                                                key={net.id}
                                                type="button"
                                                onClick={() => { setSelectedNetwork(net.name); setStep(3); }}
                                                className="group w-full rounded-2xl bg-gray-100 dark:bg-[#161922] p-4 text-left transition-all hover:bg-gray-200/80 dark:hover:bg-white/[0.06]"
                                            >
                                                <div className="flex items-start justify-between gap-3.5">
                                                    <div className="flex items-center gap-3.5">
                                                        <span className="flex size-11 items-center justify-center rounded-2xl bg-transparent p-2 shrink-0">
                                                            <img
                                                                src={getCryptoLogo(selectedAsset.symbol)}
                                                                alt={selectedAsset.symbol}
                                                                className="size-full object-contain"
                                                                loading="lazy"
                                                            />
                                                        </span>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-950 dark:text-white">{net.name}</h4>
                                                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                                                Min. deposit: <span className="font-semibold text-gray-900 dark:text-white">{minDeposit}</span>
                                                            </p>
                                                            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                                                                Est. arrival: {net.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in zoom-in-95 duration-300">
                                <div className="flex flex-col items-center justify-center rounded-3xl bg-gray-100 dark:bg-[#161922] p-6 text-center">
                                    <div className="flex items-center gap-2 mb-4 rounded-full bg-emerald-500/10 px-3 py-1">
                                        <img
                                            src={getCryptoLogo(selectedAsset.symbol)}
                                            alt={selectedAsset.symbol}
                                            className="size-4 object-contain"
                                        />
                                        <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                                            {selectedAsset.symbol} ({selectedNetwork})
                                        </span>
                                    </div>
                                    <div className="flex size-44 items-center justify-center rounded-2xl bg-white p-3 text-gray-900">
                                        <QrCode size={140} className="text-gray-900" />
                                    </div>
                                    <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">Scan QR code using your wallet app</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Deposit Address</label>
                                    <div className="flex items-center justify-between gap-2 rounded-2xl bg-gray-100 dark:bg-[#161922] p-3.5">
                                        <p className="font-mono text-xs text-gray-800 dark:text-gray-200 truncate">{dummyDepositAddress}</p>
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(dummyDepositAddress)}
                                            className="flex items-center gap-1 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 transition hover:bg-emerald-500/20 active:scale-95"
                                        >
                                            {copied ? <Check size={15} /> : <Copy size={15} />}
                                            {copied ? 'Copied' : 'Copy'}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 rounded-2xl bg-amber-500/10 p-4 text-xs text-amber-900 dark:text-amber-200/90 leading-relaxed">
                                    <Info size={18} className="shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                                    <p>Send only <strong className="font-bold">{selectedAsset.symbol}</strong> via <strong className="font-bold">{selectedNetwork}</strong> to this address.</p>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* FIAT / USD & AGENT FLOW */}
                {selectedFlow !== 'crypto' && selectedFlow !== null && step > 0 && (
                    <div className="rounded-3xl bg-gray-100 dark:bg-[#161922] p-6 space-y-4 animate-in fade-in duration-300">
                        <div className="flex items-center gap-3">
                            <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <Building2 size={24} />
                            </span>
                            <div>
                                <h3 className="text-lg font-bold text-gray-950 dark:text-white">Bank Transfer Details</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Use reference code below for fast matching</p>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 dark:border-white/10 pt-4 space-y-3 text-xs">
                            <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Bank Name</span><span className="font-bold text-gray-900 dark:text-white">Standard Chartered</span></div>
                            <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Account Number</span><span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">0092837411</span></div>
                            <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Reference Code</span><span className="font-mono font-bold text-amber-600 dark:text-amber-400">WP-8942-REF</span></div>
                        </div>
                    </div>
                )}

                {/* Done CTA Button */}
                {isFinalStep && (
                    <div className="pt-2 pb-6 animate-in fade-in duration-300">
                        <button
                            type="button"
                            onClick={() => router.push(returnUrl)}
                            className="w-full rounded-2xl bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-400 dark:hover:bg-emerald-300 py-4 text-center font-bold text-white dark:text-emerald-950 transition-all active:scale-[0.99] shadow-lg shadow-emerald-500/20"
                        >
                            Done
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}