
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    TrendingUp,
    TrendingDown,
    PauseCircle,
    PlayCircle,
    ShieldAlert,
    Search,
    X,
    SlidersHorizontal,
    RefreshCw,
    Zap,
    Info,
    DollarSign,
    Activity,
    AlertTriangle,
    UserCheck,
    ChevronRight,
    CheckCircle2,
    BookText,
} from 'lucide-react';

// --- Types ---
type TradeType = 'BUY' | 'SELL';
type TabType = 'active-trades' | 'experts' | 'risk-controls' | 'history';

interface ActiveTrade {
    id: string;
    symbol: string;
    type: TradeType;
    openPrice: number;
    currentPrice: number;
    pnl: number;
    pnlPercentage: number;
    lotSize: number;
    leverage: string;
    expert: {
        id: string;
        name: string;
        avatar: string;
        copyRatio: number;
    };
    openTime: string;
    broker: string;
    spread: number;
}

interface ExpertAllocation {
    id: string;
    name: string;
    avatar: string;
    allocatedAmount: number;
    activePnl: number;
    status: 'ACTIVE' | 'PAUSED';
    tradesCount: number;
    winRate: number;
}

interface HistoricalTrade {
    id: string;
    symbol: string;
    type: TradeType;
    openPrice: number;
    closePrice: number;
    pnl: number;
    closeTime: string;
    expertName: string;
}

// --- Mock Initial Data ---
const initialTrades: ActiveTrade[] = [
    {
        id: 'TRD-8901',
        symbol: 'EUR/USD',
        type: 'BUY',
        openPrice: 1.0842,
        currentPrice: 1.0876,
        pnl: 170,
        pnlPercentage: 3.13,
        lotSize: 0.5,
        leverage: '1:100',
        expert: {
            id: 'exp-1',
            name: 'Alex Rivera',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            copyRatio: 100,
        },
        openTime: '2026-10-20 09:15:22',
        broker: 'IC Markets PRIME',
        spread: 0.2,
    },
    {
        id: 'TRD-8904',
        symbol: 'XAU/USD',
        type: 'BUY',
        openPrice: 2715.5,
        currentPrice: 2732.1,
        pnl: 415,
        pnlPercentage: 6.11,
        lotSize: 0.25,
        leverage: '1:50',
        expert: {
            id: 'exp-2',
            name: 'Sarah Chen',
            avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
            copyRatio: 80,
        },
        openTime: '2026-10-20 10:04:11',
        broker: 'Pepperstone FX',
        spread: 1.1,
    },
    {
        id: 'TRD-8908',
        symbol: 'BTC/USD',
        type: 'SELL',
        openPrice: 68450,
        currentPrice: 68920,
        pnl: -235,
        pnlPercentage: -1.72,
        lotSize: 0.1,
        leverage: '1:20',
        expert: {
            id: 'exp-3',
            name: 'Crypto Sentinel',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
            copyRatio: 50,
        },
        openTime: '2026-10-20 11:20:00',
        broker: 'Binance Direct',
        spread: 3.5,
    },
    {
        id: 'TRD-8912',
        symbol: 'GBP/JPY',
        type: 'BUY',
        openPrice: 194.2,
        currentPrice: 194.85,
        pnl: 130,
        pnlPercentage: 2.1,
        lotSize: 0.4,
        leverage: '1:100',
        expert: {
            id: 'exp-1',
            name: 'Alex Rivera',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            copyRatio: 100,
        },
        openTime: '2026-10-20 11:45:09',
        broker: 'IC Markets PRIME',
        spread: 0.6,
    },
];

const initialExperts: ExpertAllocation[] = [
    {
        id: 'exp-1',
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        allocatedAmount: 15000,
        activePnl: 300,
        status: 'ACTIVE',
        tradesCount: 2,
        winRate: 78.4,
    },
    {
        id: 'exp-2',
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
        allocatedAmount: 10000,
        activePnl: 415,
        status: 'ACTIVE',
        tradesCount: 1,
        winRate: 84.1,
    },
    {
        id: 'exp-3',
        name: 'Crypto Sentinel',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        allocatedAmount: 8000,
        activePnl: -235,
        status: 'ACTIVE',
        tradesCount: 1,
        winRate: 62.8,
    },
];

const mockHistory: HistoricalTrade[] = [
    {
        id: 'HIST-101',
        symbol: 'NAS100',
        type: 'BUY',
        openPrice: 20120,
        closePrice: 20310,
        pnl: 380,
        closeTime: '2026-10-19 18:30',
        expertName: 'Alex Rivera',
    },
    {
        id: 'HIST-102',
        symbol: 'EUR/USD',
        type: 'SELL',
        openPrice: 1.089,
        closePrice: 1.0855,
        pnl: 175,
        closeTime: '2026-10-19 14:15',
        expertName: 'Alex Rivera',
    },
    {
        id: 'HIST-103',
        symbol: 'ETH/USD',
        type: 'BUY',
        openPrice: 2640,
        closePrice: 2590,
        pnl: -125,
        closeTime: '2026-10-18 21:00',
        expertName: 'Crypto Sentinel',
    },
];

const tabs: {
    id: TabType;
    label: string;
    icon: React.ElementType;
}[] = [
    { id: 'active-trades', label: 'Active Trades', icon: Zap },
    { id: 'experts', label: 'Experts & Allocation', icon: UserCheck },
    { id: 'risk-controls', label: 'Risk Controls', icon: ShieldAlert },
    { id: 'history', label: 'Trade History', icon: Info },
];

const formatMoney = (value: number) =>
    `${value < 0 ? '-' : ''}$${Math.abs(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

export default function TradePage() {
    const router = useRouter();

    // --- States ---
    const [activeTab, setActiveTab] = useState<TabType>('active-trades');
    const [trades, setTrades] = useState<ActiveTrade[]>(initialTrades);
    const [experts, setExperts] = useState<ExpertAllocation[]>(initialExperts);
    const [isGlobalPaused, setIsGlobalPaused] = useState(false);
    const [isLiveTicker, setIsLiveTicker] = useState(true);

    // Filters & Search
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');

    // Keep IDs rather than object snapshots so selected trades stay current.
    const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null);
    const [tradeToCloseId, setTradeToCloseId] = useState<string | null>(null);
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);
    const [showRiskDrawer, setShowRiskDrawer] = useState(false);
    const [riskSettingsNotice, setRiskSettingsNotice] = useState(false);

    // Risk Controls State
    const [maxDrawdown, setMaxDrawdown] = useState(15);
    const [dailyStopLoss, setDailyStopLoss] = useState(500);
    const [autoPauseOnLoss, setAutoPauseOnLoss] = useState(true);

    const selectedTrade = trades.find((trade) => trade.id === selectedTradeId) ?? null;
    const tradeToClose = trades.find((trade) => trade.id === tradeToCloseId) ?? null;

    // --- Mock price ticker: replace with provider data when integrating ---
    useEffect(() => {
        if (!isLiveTicker || isGlobalPaused) return;

        const interval = window.setInterval(() => {
            setTrades((prevTrades) =>
                prevTrades.map((trade) => {
                    const deltaPct = (Math.random() - 0.49) * 0.002;
                    const decimals = trade.symbol.includes('JPY')
                        ? 2
                        : trade.symbol.includes('BTC')
                            ? 1
                            : trade.symbol.includes('XAU')
                                ? 2
                                : 4;

                    const newPrice = Number(
                        (trade.currentPrice * (1 + deltaPct)).toFixed(decimals)
                    );

                    const priceDiff =
                        trade.type === 'BUY'
                            ? newPrice - trade.openPrice
                            : trade.openPrice - newPrice;

                    const multiplier = trade.symbol.includes('BTC')
                        ? 0.1
                        : trade.symbol.includes('XAU')
                            ? 10
                            : 1000;

                    const newPnl = Number(
                        (priceDiff * trade.lotSize * multiplier * 100).toFixed(2)
                    );

                    const newPnlPct = Number(((newPnl / 500) * 100).toFixed(2));

                    return {
                        ...trade,
                        currentPrice: newPrice,
                        pnl: newPnl,
                        pnlPercentage: newPnlPct,
                    };
                })
            );
        }, 2500);

        return () => window.clearInterval(interval);
    }, [isLiveTicker, isGlobalPaused]);

    // --- Calculations ---
    const totalFloatingPnl = useMemo(
        () => trades.reduce((acc, trade) => acc + trade.pnl, 0),
        [trades]
    );

    const totalAllocated = useMemo(
        () => experts.reduce((acc, expert) => acc + expert.allocatedAmount, 0),
        [experts]
    );

    // Intentionally mock values until the real account metrics are connected.
    const openExposure = trades.reduce((acc, trade) => acc + trade.lotSize * 1000, 0);

    const filteredTrades = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return trades.filter((trade) => {
            const matchesSearch =
                trade.symbol.toLowerCase().includes(query) ||
                trade.expert.name.toLowerCase().includes(query) ||
                trade.id.toLowerCase().includes(query);

            const matchesType = typeFilter === 'ALL' || trade.type === typeFilter;

            return matchesSearch && matchesType;
        });
    }, [trades, searchQuery, typeFilter]);

    // --- Handlers ---
    const handleCloseTrade = (tradeId: string) => {
        setTrades((prev) => prev.filter((trade) => trade.id !== tradeId));
        setTradeToCloseId(null);
        setSelectedTradeId(null);
    };

    const handleToggleExpertStatus = (expertId: string) => {
        setExperts((prev) =>
            prev.map((expert) =>
                expert.id === expertId
                    ? {
                        ...expert,
                        status: expert.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE',
                    }
                    : expert
            )
        );
    };

    const handleGlobalEmergencyPause = () => {
        setIsGlobalPaused((prev) => !prev);
        setShowEmergencyModal(false);
    };

    const handleSaveRiskSettings = () => {
        // UI preview only. Connect this action to the API when available.
        setRiskSettingsNotice(true);
    };

    const openCloseConfirmation = (tradeId: string) => {
        setSelectedTradeId(null);
        setTradeToCloseId(tradeId);
    };

    const closeAllOverlays = () => {
        setSelectedTradeId(null);
        setTradeToCloseId(null);
        setShowEmergencyModal(false);
        setShowRiskDrawer(false);
    };

    return (
        <div className="min-h-screen bg-primary text-slate-900 dark:bg-[#13161D] dark:text-slate-100 pb-24 md:pb-12">
            <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
                {/* ================= HEADER ================= */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex w-full items-center justify-between sm:w-auto">
                        <h1 className="text-xl font-bold text-gray-950 dark:text-white sm:text-2xl">
                            Copy trading
                        </h1>

                        <button
                            type="button"
                            aria-label="Learn about HWALN challenges with Avena"
                            onClick={() => router.push('/dashboard/avena?manual=challenges')}
                            className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-slate-800 sm:ml-3"
                        >
                            <BookText size={20} />
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={() => setIsLiveTicker((prev) => !prev)}
                            aria-pressed={isLiveTicker}
                            className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                                isLiveTicker
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                                    : 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                            title="Toggle mock price simulation"
                        >
                            <RefreshCw
                                className={`size-3.5 ${
                                    isLiveTicker
                                        ? 'animate-spin text-emerald-600 dark:text-emerald-400'
                                        : ''
                                }`}
                            />
                            <span>{isLiveTicker ? 'Live Ticker ON' : 'Ticker Paused'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowRiskDrawer(true)}
                            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                            <SlidersHorizontal className="size-4" />
                            <span>Risk Controls</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowEmergencyModal(true)}
                            className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-white shadow-sm transition-all sm:px-4 sm:text-sm ${
                                isGlobalPaused
                                    ? 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500'
                                    : 'bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500'
                            }`}
                        >
                            <ShieldAlert className="size-4" />
                            <span>{isGlobalPaused ? 'Copying Paused' : 'Emergency Pause'}</span>
                        </button>
                    </div>
                </div>

                {/* Global Pause Banner */}
                {isGlobalPaused && (
                    <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/40">
                        <div className="flex items-center gap-3">
                            <PauseCircle className="size-6 shrink-0 text-amber-600 dark:text-amber-400" />
                            <div>
                                <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                                    Global Copy Trading is Currently Suspended
                                </p>
                                <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
                                    No new trade signals will execute on your account.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGlobalEmergencyPause}
                            className="shrink-0 rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-amber-700"
                        >
                            Resume
                        </button>
                    </div>
                )}

                {/* ================= METRIC CARDS ================= */}
                <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700/70 dark:bg-slate-800/80 sm:p-5">
                        <div className="mb-2 flex items-center justify-between gap-2 text-slate-500 dark:text-slate-400">
                            <span className="text-[10px] font-medium uppercase tracking-wider sm:text-xs">
                                Active Exposure
                            </span>
                            <div className="rounded-lg bg-purple-50 p-1.5 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                                <Activity className="size-4" />
                            </div>
                        </div>
                        <div className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                            ${openExposure.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                            {trades.length} active {trades.length === 1 ? 'position' : 'positions'}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700/70 dark:bg-slate-800/80 sm:p-5">
                        <div className="mb-2 flex items-center justify-between gap-2 text-slate-500 dark:text-slate-400">
                            <span className="text-[10px] font-medium tracking-wider sm:text-xs">
                                Live PnL
                            </span>
                            <div
                                className={`rounded-lg p-1.5 ${
                                    totalFloatingPnl >= 0
                                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                                        : 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
                                }`}
                            >
                                {totalFloatingPnl >= 0 ? (
                                    <TrendingUp className="size-4" />
                                ) : (
                                    <TrendingDown className="size-4" />
                                )}
                            </div>
                        </div>
                        <div
                            className={`text-lg font-bold tracking-tight sm:text-2xl ${
                                totalFloatingPnl >= 0
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-rose-600 dark:text-rose-400'
                            }`}
                        >
                            {totalFloatingPnl >= 0 ? '+' : ''}
                            {formatMoney(totalFloatingPnl)}
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                            Unrealized return: {totalAllocated > 0
                            ? `${((totalFloatingPnl / totalAllocated) * 100).toFixed(2)}%`
                            : '—'}
                        </p>
                    </div>
                </div>


                {/* ================= BORDERLESS HORIZONTAL TAB NAV ================= */}
                <div className="mb-3">
                    <div className="flex items-center gap-1.25 overflow-x-auto no-scrollbar py-1 scroll-smooth">
                        {[
                            {
                                id: 'active-trades',
                                label: 'Active Trades',
                                count: trades.length,
                            },
                            {
                                id: 'experts',
                                label: 'Experts & Allocation',
                            },
                            {
                                id: 'risk-controls',
                                label: 'Risk Controls',
                            },
                            {
                                id: 'history',
                                label: 'Trade History',
                            },
                        ].map(({ id, label, count }) => {
                            const isActive = activeTab === id;

                            return (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => setActiveTab(id as TabType)}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={`
                        relative flex shrink-0 items-center gap-1
                        whitespace-nowrap rounded-xl px-2 py-2
                        text-sm transition-all duration-200
                        min-h-[36px] outline-none
                        focus-visible:ring-2
                        focus-visible:ring-emerald-500/50
                        ${
                                        isActive
                                            ? 'font-bold text-slate-800 dark:text-white bg-emerald-50/30 dark:bg-emerald-400/[0.08]'
                                            : 'font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/[0.04]'
                                    }
                    `}
                                >
                                    <span>{label}</span>

                                    {count !== undefined && (
                                        <span
                                            className={`
                                rounded-full px-2 py-0.5
                                text-[11px] tabular-nums
                                transition-colors
                                ${
                                                isActive
                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-300/15 dark:text-emerald-200'
                                                    : 'bg-slate-100 text-slate-500 dark:bg-white/[0.06] dark:text-slate-400'
                                            }
                            `}
                                        >
                            {count}
                        </span>
                                    )}

                                    {isActive && (
                                        <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-emerald-500 dark:bg-emerald-300" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>


                {/* ================= ACTIVE TRADES ================= */}
                {activeTab === 'active-trades' && (
                    <div
                        id="panel-active-trades"
                        role="tabpanel"
                        aria-labelledby="tab-active-trades"
                        className="space-y-4"
                    >
                        <div className="flex flex-col items-stretch justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-700/70 dark:bg-slate-800/60 sm:flex-row sm:items-center sm:p-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    aria-label="Search active trades"
                                    placeholder="Search market pair, trade ID or expert..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        aria-label="Clear search"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                                    >
                                        <X className="size-4" />
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-1.5 self-end rounded-xl bg-slate-100 p-1 dark:bg-slate-900/60 sm:self-auto">
                                {(['ALL', 'BUY', 'SELL'] as const).map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        aria-pressed={typeFilter === type}
                                        onClick={() => setTypeFilter(type)}
                                        className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                                            typeFilter === type
                                                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {filteredTrades.length === 0 ? (
                            <div className="rounded-2xl border border-slate-200/80 bg-white px-6 py-12 text-center dark:border-slate-700/70 dark:bg-slate-800/40">
                                <Zap className="mx-auto mb-3 size-10 text-slate-300 dark:text-slate-600" />
                                <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
                                    {trades.length === 0
                                        ? 'No active trades yet'
                                        : 'No matching trades found'}
                                </h3>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    {trades.length === 0
                                        ? 'Positions copied from your followed experts will appear here.'
                                        : 'Try another search or reset your filters.'}
                                </p>
                                {(searchQuery || typeFilter !== 'ALL') && trades.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setTypeFilter('ALL');
                                        }}
                                        className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
                                    >
                                        Reset filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3">
                                {filteredTrades.map((trade) => {
                                    const isProfit = trade.pnl >= 0;

                                    return (
                                        <div
                                            key={trade.id}
                                            className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:border-slate-300 dark:border-slate-700/70 dark:bg-slate-800/80 dark:hover:border-slate-600 sm:flex-row sm:items-center"
                                        >
                                            <div className="flex items-start gap-3 sm:items-center">
                                                <span
                                                    className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-black tracking-wider text-white ${
                                                        trade.type === 'BUY'
                                                            ? 'bg-emerald-600'
                                                            : 'bg-rose-600'
                                                    }`}
                                                >
                                                    {trade.type}
                                                </span>

                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                        <span className="text-base font-bold text-slate-900 dark:text-white">
                                                            {trade.symbol}
                                                        </span>
                                                        <span className="text-xs text-slate-400 dark:text-slate-500">
                                                            {trade.id}
                                                        </span>
                                                    </div>

                                                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                                        <img
                                                            src={trade.expert.avatar}
                                                            alt=""
                                                            className="size-4 rounded-full object-cover"
                                                        />
                                                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                                            {trade.expert.name}
                                                        </span>
                                                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                                                            {trade.expert.copyRatio}% Copy
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-xs dark:border-slate-700/50 sm:grid-cols-3 sm:border-t-0 sm:pt-0">
                                                <div>
                                                    <span className="mb-1 block text-[10px] font-medium uppercase text-slate-400">
                                                        Open Price
                                                    </span>
                                                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                                                        {trade.openPrice}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="mb-1 block text-[10px] font-medium uppercase text-slate-400">
                                                        Current Price
                                                    </span>
                                                    <span className="font-mono font-semibold text-slate-900 dark:text-white">
                                                        {trade.currentPrice}
                                                    </span>
                                                </div>
                                                <div className="col-span-2 sm:col-span-1">
                                                    <span className="mb-1 block text-[10px] font-medium uppercase text-slate-400">
                                                        Lot / Leverage
                                                    </span>
                                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                        {trade.lotSize} Lots ({trade.leverage})
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3 dark:border-slate-700/50 sm:justify-end sm:border-t-0 sm:pt-0">
                                                <div className="text-left sm:text-right">
                                                    <span className="mb-1 block text-[10px] font-medium uppercase text-slate-400">
                                                        Floating P/L
                                                    </span>
                                                    <div
                                                        className={`font-mono text-base font-extrabold ${
                                                            isProfit
                                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                                : 'text-rose-600 dark:text-rose-400'
                                                        }`}
                                                    >
                                                        {isProfit ? '+' : ''}
                                                        {formatMoney(trade.pnl)}
                                                        <span className="ml-1 text-xs font-normal">
                                                            ({isProfit ? '+' : ''}
                                                            {trade.pnlPercentage}%)
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        aria-label={`Inspect ${trade.symbol} position`}
                                                        onClick={() => setSelectedTradeId(trade.id)}
                                                        className="rounded-xl bg-slate-100 p-2.5 text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                                                    >
                                                        <Info className="size-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openCloseConfirmation(trade.id)}
                                                        className="min-h-[40px] rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/60"
                                                    >
                                                        Close
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ================= EXPERTS & ALLOCATION ================= */}
                {activeTab === 'experts' && (
                    <div
                        id="panel-experts"
                        role="tabpanel"
                        aria-labelledby="tab-experts"
                        className="grid grid-cols-1 gap-4 md:grid-cols-3"
                    >
                        {experts.length === 0 ? (
                            <div className="col-span-full rounded-2xl border border-slate-200/80 bg-white px-6 py-12 text-center dark:border-slate-700/70 dark:bg-slate-800/40">
                                <UserCheck className="mx-auto mb-3 size-10 text-slate-300 dark:text-slate-600" />
                                <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                                    No followed experts yet
                                </h3>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Experts you choose to copy will appear here.
                                </p>
                            </div>
                        ) : (
                            experts.map((expert) => (
                                <div
                                    key={expert.id}
                                    className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700/70 dark:bg-slate-800/80"
                                >
                                    <div>
                                        <div className="mb-4 flex items-center justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <img
                                                    src={expert.avatar}
                                                    alt=""
                                                    className="size-12 shrink-0 rounded-full border-2 border-slate-100 object-cover dark:border-slate-700"
                                                />
                                                <div className="min-w-0">
                                                    <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
                                                        {expert.name}
                                                    </h3>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                                        Win Rate:{' '}
                                                        <strong className="text-slate-800 dark:text-slate-200">
                                                            {expert.winRate}%
                                                        </strong>
                                                    </span>
                                                </div>
                                            </div>

                                            <span
                                                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                                                    expert.status === 'ACTIVE'
                                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                                }`}
                                            >
                                                {expert.status}
                                            </span>
                                        </div>

                                        <div className="mb-4 space-y-2 rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-900/50">
                                            <div className="flex justify-between gap-3">
                                                <span className="text-slate-500 dark:text-slate-400">
                                                    Allocated Funds
                                                </span>
                                                <span className="font-bold text-slate-900 dark:text-white">
                                                    ${expert.allocatedAmount.toLocaleString('en-US')}
                                                </span>
                                            </div>
                                            <div className="flex justify-between gap-3">
                                                <span className="text-slate-500 dark:text-slate-400">
                                                    Active Trade Floating P/L
                                                </span>
                                                <span
                                                    className={`font-bold ${
                                                        expert.activePnl >= 0
                                                            ? 'text-emerald-600 dark:text-emerald-400'
                                                            : 'text-rose-600 dark:text-rose-400'
                                                    }`}
                                                >
                                                    {expert.activePnl >= 0 ? '+' : ''}
                                                    {formatMoney(expert.activePnl)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between gap-3">
                                                <span className="text-slate-500 dark:text-slate-400">
                                                    Open Positions
                                                </span>
                                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                    {expert.tradesCount}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-700/60">
                                        <button
                                            type="button"
                                            aria-pressed={expert.status === 'PAUSED'}
                                            onClick={() => handleToggleExpertStatus(expert.id)}
                                            className={`flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-colors ${
                                                expert.status === 'ACTIVE'
                                                    ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:hover:bg-amber-950/70'
                                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-950/70'
                                            }`}
                                        >
                                            {expert.status === 'ACTIVE' ? (
                                                <>
                                                    <PauseCircle className="size-4" />
                                                    Pause Copying
                                                </>
                                            ) : (
                                                <>
                                                    <PlayCircle className="size-4" />
                                                    Resume Copying
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* ================= RISK CONTROLS ================= */}
                {activeTab === 'risk-controls' && (
                    <div
                        id="panel-risk-controls"
                        role="tabpanel"
                        aria-labelledby="tab-risk-controls"
                        className="mx-auto max-w-3xl rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700/70 dark:bg-slate-800/80 sm:p-6"
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <div className="rounded-2xl bg-rose-50 p-3 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                                <ShieldAlert className="size-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Account Safeguards & Drawdown Protection
                                </h2>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Configure rules designed to help protect your trading capital.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <label
                                        htmlFor="max-drawdown"
                                        className="text-sm font-semibold text-slate-800 dark:text-slate-200"
                                    >
                                        Max Allowed Portfolio Drawdown
                                    </label>
                                    <span className="shrink-0 text-sm font-bold text-rose-600 dark:text-rose-400">
                                        {maxDrawdown}%
                                    </span>
                                </div>
                                <input
                                    id="max-drawdown"
                                    type="range"
                                    min="5"
                                    max="40"
                                    step="1"
                                    value={maxDrawdown}
                                    onChange={(e) => {
                                        setMaxDrawdown(Number(e.target.value));
                                        setRiskSettingsNotice(false);
                                    }}
                                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-rose-600 dark:bg-slate-700"
                                />
                                <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                                    <span>5% — Lower limit</span>
                                    <span>40% — Higher limit</span>
                                </div>
                                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                    The configured threshold for your portfolio's drawdown protection.
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="daily-stop-loss"
                                    className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200"
                                >
                                    Daily Max Stop-Loss Cap (USD)
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        id="daily-stop-loss"
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={dailyStopLoss}
                                        onChange={(e) => {
                                            setDailyStopLoss(
                                                e.target.value === ''
                                                    ? 0
                                                    : Math.max(0, Number(e.target.value))
                                            );
                                            setRiskSettingsNotice(false);
                                        }}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    The maximum realized loss allowed per calendar day.
                                </p>
                            </div>

                            <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Auto-Pause Experts on Consecutive Losses
                                    </h4>
                                    <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                        Temporarily pause an expert after three consecutive losing trades.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={autoPauseOnLoss}
                                    aria-label="Auto-pause experts on consecutive losses"
                                    onClick={() => {
                                        setAutoPauseOnLoss((prev) => !prev);
                                        setRiskSettingsNotice(false);
                                    }}
                                    className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
                                        autoPauseOnLoss
                                            ? 'bg-emerald-600'
                                            : 'bg-slate-300 dark:bg-slate-700'
                                    }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow transition-transform ${
                                            autoPauseOnLoss ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                            </div>

                            {riskSettingsNotice && (
                                <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                                    <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                                    <span>
                                        Settings updated in this preview. They have not been saved to a server.
                                    </span>
                                </div>
                            )}

                            <button
                                type="button"
                                disabled={dailyStopLoss <= 0 || !Number.isFinite(dailyStopLoss)}
                                onClick={handleSaveRiskSettings}
                                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white shadow transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                            >
                                {riskSettingsNotice && <CheckCircle2 className="size-4" />}
                                {riskSettingsNotice ? 'Settings Updated' : 'Save Safeguard Settings'}
                            </button>
                        </div>
                    </div>
                )}

                {/* ================= TRADE HISTORY ================= */}
                {activeTab === 'history' && (
                    <div
                        id="panel-history"
                        role="tabpanel"
                        aria-labelledby="tab-history"
                        className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700/70 dark:bg-slate-800/80 sm:p-5"
                    >
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Recently Closed Trades
                                </h3>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Review the outcome of completed positions.
                                </p>
                            </div>
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                                {mockHistory.length}
                            </span>
                        </div>

                        {mockHistory.length === 0 ? (
                            <div className="py-12 text-center">
                                <Activity className="mx-auto mb-3 size-9 text-slate-300 dark:text-slate-600" />
                                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    No closed trades yet
                                </h4>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Your completed trades will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="-mx-4 overflow-x-auto sm:mx-0">
                                <table className="w-full min-w-[650px] text-left text-xs">
                                    <thead>
                                    <tr className="border-b border-slate-200 text-slate-400 dark:border-slate-700">
                                        <th className="px-3 pb-3 font-medium uppercase">Trade ID</th>
                                        <th className="px-3 pb-3 font-medium uppercase">Pair</th>
                                        <th className="px-3 pb-3 font-medium uppercase">Type</th>
                                        <th className="px-3 pb-3 font-medium uppercase">Open / Close</th>
                                        <th className="px-3 pb-3 font-medium uppercase">Expert</th>
                                        <th className="px-3 pb-3 text-right font-medium uppercase">Realized P/L</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                    {mockHistory.map((history) => (
                                        <tr
                                            key={history.id}
                                            className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30"
                                        >
                                            <td className="px-3 py-3 font-mono text-slate-500">
                                                {history.id}
                                            </td>
                                            <td className="px-3 py-3 font-bold text-slate-900 dark:text-white">
                                                {history.symbol}
                                            </td>
                                            <td className="px-3 py-3">
                                                    <span
                                                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                                                            history.type === 'BUY'
                                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                                        }`}
                                                    >
                                                        {history.type}
                                                    </span>
                                            </td>
                                            <td className="px-3 py-3 font-mono text-slate-600 dark:text-slate-300">
                                                {history.openPrice} → {history.closePrice}
                                            </td>
                                            <td className="px-3 py-3 text-slate-600 dark:text-slate-300">
                                                {history.expertName}
                                            </td>
                                            <td
                                                className={`px-3 py-3 text-right font-mono font-bold ${
                                                    history.pnl >= 0
                                                        ? 'text-emerald-600 dark:text-emerald-400'
                                                        : 'text-rose-600 dark:text-rose-400'
                                                }`}
                                            >
                                                {history.pnl >= 0 ? '+' : ''}
                                                {formatMoney(history.pnl)}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ================= STICKY MOBILE SUMMARY BAR ================= */}
            <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:hidden">
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <span className="block text-[10px] font-semibold uppercase text-slate-500 dark:text-slate-400">
                            Floating P/L
                        </span>
                        <div
                            className={`font-mono text-base font-black ${
                                totalFloatingPnl >= 0
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-rose-600 dark:text-rose-400'
                            }`}
                        >
                            {totalFloatingPnl >= 0 ? '+' : ''}
                            {formatMoney(totalFloatingPnl)}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowEmergencyModal(true)}
                        className="flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-rose-700"
                    >
                        <ShieldAlert className="size-3.5" />
                        {isGlobalPaused ? 'Resume' : 'Emergency'}
                    </button>
                </div>
            </div>

            {/* ================= TRADE DETAIL MODAL ================= */}
            {selectedTrade && (
                <div
                    className="fixed inset-0 z-50 flex animate-in fade-in items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) setSelectedTradeId(null);
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="trade-inspection-title"
                        className="max-h-[90vh] w-full space-y-4 overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800 sm:max-w-md sm:rounded-2xl"
                    >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-700">
                            <div>
                                <h3 id="trade-inspection-title" className="text-lg font-bold text-slate-900 dark:text-white">
                                    Trade Inspection
                                </h3>
                                <p className="text-xs text-slate-500">{selectedTrade.id}</p>
                            </div>
                            <button
                                type="button"
                                aria-label="Close trade details"
                                onClick={() => setSelectedTradeId(null)}
                                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <div className="space-y-3 text-sm">
                            {[
                                ['Market Symbol', selectedTrade.symbol],
                                ['Broker Source', selectedTrade.broker],
                                ['Average Spread', `${selectedTrade.spread} pips`],
                                ['Execution Time', selectedTrade.openTime],
                                ['Open Price', String(selectedTrade.openPrice)],
                                ['Current Price', String(selectedTrade.currentPrice)],
                                ['Position Size', `${selectedTrade.lotSize} lots`],
                                ['Leverage', selectedTrade.leverage],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="flex items-start justify-between gap-4 border-b border-slate-100 py-1.5 last:border-0 dark:border-slate-700/50"
                                >
                                    <span className="text-slate-500">{label}</span>
                                    <span className="max-w-[60%] break-words text-right font-medium text-slate-800 dark:text-slate-200">
                                        {value}
                                    </span>
                                </div>
                            ))}

                            <div className="flex items-center justify-between py-1">
                                <span className="text-slate-500">Position Type</span>
                                <span className={`font-bold ${selectedTrade.type === 'BUY' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {selectedTrade.type}
                                </span>
                            </div>

                            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-900/50">
                                <span className="text-xs text-slate-500">Floating P/L</span>
                                <span
                                    className={`font-mono font-bold ${
                                        selectedTrade.pnl >= 0
                                            ? 'text-emerald-600 dark:text-emerald-400'
                                            : 'text-rose-600 dark:text-rose-400'
                                    }`}
                                >
                                    {selectedTrade.pnl >= 0 ? '+' : ''}
                                    {formatMoney(selectedTrade.pnl)}
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => openCloseConfirmation(selectedTrade.id)}
                            className="min-h-[44px] w-full rounded-xl bg-rose-600 py-3 text-sm font-bold text-white transition-colors hover:bg-rose-700"
                        >
                            Close This Position
                        </button>
                    </div>
                </div>
            )}

            {/* ================= CLOSE CONFIRMATION MODAL ================= */}
            {tradeToClose && (
                <div
                    className="fixed inset-0 z-[60] flex animate-in fade-in items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) setTradeToCloseId(null);
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="close-trade-title"
                        className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-2xl dark:border-slate-700 dark:bg-slate-800"
                    >
                        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                            <AlertTriangle className="size-6" />
                        </div>

                        <h3 id="close-trade-title" className="text-lg font-bold text-slate-900 dark:text-white">
                            Confirm Manual Trade Close
                        </h3>

                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            Are you sure you want to exit{' '}
                            <strong>{tradeToClose.symbol}</strong>? This preview will remove the position from the list.
                        </p>

                        <div className="space-y-1 rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-900/60">
                            <div className="flex justify-between gap-3 text-slate-500">
                                <span>Estimated Realized P/L</span>
                                <span
                                    className={`font-mono font-bold ${
                                        tradeToClose.pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'
                                    }`}
                                >
                                    {formatMoney(tradeToClose.pnl)}
                                </span>
                            </div>
                            <p className="text-left text-[10px] leading-relaxed text-slate-400">
                                Actual execution price and final P/L may differ.
                            </p>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setTradeToCloseId(null)}
                                className="min-h-[44px] flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => handleCloseTrade(tradeToClose.id)}
                                className="min-h-[44px] flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white transition-colors hover:bg-rose-700"
                            >
                                Confirm Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= EMERGENCY PAUSE MODAL ================= */}
            {showEmergencyModal && (
                <div
                    className="fixed inset-0 z-[70] flex animate-in fade-in items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) setShowEmergencyModal(false);
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="emergency-modal-title"
                        className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-2xl dark:border-slate-700 dark:bg-slate-800"
                    >
                        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                            <ShieldAlert className="size-6" />
                        </div>

                        <h3 id="emergency-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">
                            {isGlobalPaused ? 'Resume Copy Trading?' : 'Global Emergency Switch'}
                        </h3>

                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            {isGlobalPaused
                                ? 'Resuming will allow experts to open new market trades on your account based on your configured copy ratios.'
                                : 'Activating Emergency Pause will stop incoming trade signals in this preview. Existing positions will remain open.'}
                        </p>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowEmergencyModal(false)}
                                className="min-h-[44px] flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                                Dismiss
                            </button>
                            <button
                                type="button"
                                onClick={handleGlobalEmergencyPause}
                                className={`min-h-[44px] flex-1 rounded-xl py-2.5 text-xs font-bold text-white transition-colors ${
                                    isGlobalPaused
                                        ? 'bg-emerald-600 hover:bg-emerald-700'
                                        : 'bg-rose-600 hover:bg-rose-700'
                                }`}
                            >
                                {isGlobalPaused ? 'Resume All' : 'Pause All Now'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= QUICK RISK DRAWER ================= */}
            {showRiskDrawer && (
                <div
                    className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) setShowRiskDrawer(false);
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="risk-drawer-title"
                        className="flex h-full w-full max-w-xs animate-in slide-in-from-right flex-col gap-6 overflow-y-auto bg-white p-6 shadow-2xl dark:bg-slate-800"
                    >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-700">
                            <div>
                                <h3 id="risk-drawer-title" className="font-bold text-slate-900 dark:text-white">
                                    Quick Risk Adjust
                                </h3>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Adjust your safeguard limits.
                                </p>
                            </div>
                            <button
                                type="button"
                                aria-label="Close risk controls"
                                onClick={() => setShowRiskDrawer(false)}
                                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <div>
                            <label htmlFor="drawer-drawdown" className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Max Drawdown ({maxDrawdown}%)
                            </label>
                            <input
                                id="drawer-drawdown"
                                type="range"
                                min="5"
                                max="40"
                                value={maxDrawdown}
                                onChange={(e) => {
                                    setMaxDrawdown(Number(e.target.value));
                                    setRiskSettingsNotice(false);
                                }}
                                className="w-full accent-rose-600"
                            />
                            <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                                <span>5%</span>
                                <span>40%</span>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="drawer-stop-loss" className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Daily Stop Loss (USD)
                            </label>
                            <input
                                id="drawer-stop-loss"
                                type="number"
                                min="1"
                                step="1"
                                value={dailyStopLoss}
                                onChange={(e) => {
                                    setDailyStopLoss(
                                        e.target.value === ''
                                            ? 0
                                            : Math.max(0, Number(e.target.value))
                                    );
                                    setRiskSettingsNotice(false);
                                }}
                                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            />
                        </div>

                        <div className="mt-auto space-y-3">
                            <button
                                type="button"
                                disabled={dailyStopLoss <= 0 || !Number.isFinite(dailyStopLoss)}
                                onClick={() => {
                                    handleSaveRiskSettings();
                                    setShowRiskDrawer(false);
                                }}
                                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                            >
                                <CheckCircle2 className="size-4" />
                                Apply Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowRiskDrawer(false);
                                    setActiveTab('risk-controls');
                                }}
                                className="min-h-[40px] w-full rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                                Advanced Risk Settings
                                <ChevronRight className="ml-1 inline size-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
