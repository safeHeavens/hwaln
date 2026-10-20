"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    ArrowLeft,
    Bell,
    BellCheck, BookText,
    Check,
    ChevronDown,
    Repeat,
    Search,
    Share2,
    ShieldCheck,
    SlidersHorizontal,
    Star,
    Users,
    X,
} from "lucide-react";

type ExpertMarket = "All" | "Forex" | "Crypto" | "Indices" | "Stocks";

type PresetFilter =
    | "All"
    | "Top Balanced Traders"
    | "Top ROI"
    | "Top New Masters"
    | "Highest Follower Profit"
    | "Lowest Drawdown";

type SortOption = "return" | "copiers" | "sharpe" | "drawdown" | "aum";

type DetailTab = "overview" | "trades" | "followers";

type ChartDuration = "7D" | "30D" | "90D" | "All";

type CopierFollower = {
    id: string;
    username: string;
    initials: string;
    accumulatedOrderCostUsd: number;
    cumulativeProfitUsd: number;
    cumulativeRoiPercent: number;
    followingDurationDays: number;
};

type DiscoverExpert = {
    id: string;
    name: string;
    handle: string;
    initials: string;
    market: ExpertMarket;
    returnPercent30d: number;
    sharpeRatio30d: number;
    winRatePercent: number;
    maxDrawdownPercent: number;
    copiersCount: number;
    maxCopiersSlots: number;
    followerProfitUsd: number;
    aumUsd: number;
    profitSharingPercent: number;
    stabilityIndexScore: number;
    minInvestmentUsd: number;
    isNewMaster: boolean;
    tradingDaysHistory: number;
    isVerified: boolean;
    chartPoints: number[];
    performanceChartData: Record<ChartDuration, number[]>;
    summaryBio: string;
    behaviorTags: string[];
    followersList: CopierFollower[];
    tradingRecords: {
        totalOrdersExecuted: number;
        winningOrdersCount: number;
        losingOrdersCount: number;
        avgHoldingTime: string;
        profitFactor: number;
        avgLossRatioPercent: number;
    };
};

const DISCOVER_EXPERTS: DiscoverExpert[] = [
    {
        id: "expert-alpha",
        name: "Alex 'Alpha' Vance",
        handle: "@alpha_fx",
        initials: "AV",
        market: "Forex",
        returnPercent30d: 148.2,
        sharpeRatio30d: 3.12,
        winRatePercent: 88.5,
        maxDrawdownPercent: -4.12,
        copiersCount: 486,
        maxCopiersSlots: 500,
        followerProfitUsd: 125_400,
        aumUsd: 450_000,
        profitSharingPercent: 10,
        stabilityIndexScore: 4.8,
        minInvestmentUsd: 200,
        isNewMaster: false,
        tradingDaysHistory: 340,
        isVerified: true,
        chartPoints: [10, 18, 15, 28, 24, 38, 45, 52],
        performanceChartData: {
            "7D": [120, 128, 124, 135, 142, 140, 148.2],
            "30D": [45, 58, 62, 85, 94, 110, 128, 148.2],
            "90D": [10, 25, 42, 65, 80, 95, 120, 148.2],
            All: [0, 20, 50, 75, 110, 130, 148.2],
        },
        summaryBio:
            "Quantitative Forex trader specializing in low-drawdown EUR/USD momentum & volatility arbitrage algorithms.",
        behaviorTags: ["Swing Trader", "High Risk", "Forex Veteran", "Algorithmic"],
        tradingRecords: {
            totalOrdersExecuted: 1420,
            winningOrdersCount: 1256,
            losingOrdersCount: 164,
            avgHoldingTime: "1d 4h",
            profitFactor: 2.84,
            avgLossRatioPercent: -1.8,
        },
        followersList: [
            {
                id: "f-1",
                username: "CryptoWhale_88",
                initials: "CW",
                accumulatedOrderCostUsd: 12_500,
                cumulativeProfitUsd: 3_420,
                cumulativeRoiPercent: 27.36,
                followingDurationDays: 120,
            },
            {
                id: "f-2",
                username: "Daniel_K",
                initials: "DK",
                accumulatedOrderCostUsd: 5_000,
                cumulativeProfitUsd: 1_150,
                cumulativeRoiPercent: 23.0,
                followingDurationDays: 85,
            },
            {
                id: "f-3",
                username: "SatoshiVault",
                initials: "SV",
                accumulatedOrderCostUsd: 25_000,
                cumulativeProfitUsd: 6_800,
                cumulativeRoiPercent: 27.2,
                followingDurationDays: 140,
            },
        ],
    },
    {
        id: "expert-beta",
        name: "Macro Quantum",
        handle: "@macro_quant",
        initials: "MQ",
        market: "Crypto",
        returnPercent30d: 92.45,
        sharpeRatio30d: 2.84,
        winRatePercent: 91.2,
        maxDrawdownPercent: -2.8,
        copiersCount: 3109,
        maxCopiersSlots: 3500,
        followerProfitUsd: 210_800,
        aumUsd: 890_000,
        profitSharingPercent: 12,
        stabilityIndexScore: 5.0,
        minInvestmentUsd: 500,
        isNewMaster: false,
        tradingDaysHistory: 280,
        isVerified: true,
        chartPoints: [12, 14, 22, 20, 32, 30, 42, 48],
        performanceChartData: {
            "7D": [80, 82, 85, 88, 90, 89, 92.45],
            "30D": [30, 42, 50, 65, 72, 84, 92.45],
            "90D": [15, 30, 45, 60, 75, 85, 92.45],
            All: [0, 18, 35, 52, 70, 88, 92.45],
        },
        summaryBio:
            "Data-driven swing trading across BTC, ETH, and layer-1 ecosystems with automated risk management filters.",
        behaviorTags: ["Crypto Veteran", "Low Risk", "Trend Following"],
        tradingRecords: {
            totalOrdersExecuted: 890,
            winningOrdersCount: 811,
            losingOrdersCount: 79,
            avgHoldingTime: "2d 12h",
            profitFactor: 3.15,
            avgLossRatioPercent: -1.2,
        },
        followersList: [
            {
                id: "f-4",
                username: "Marcus_Trader",
                initials: "MT",
                accumulatedOrderCostUsd: 8_200,
                cumulativeProfitUsd: 1_850,
                cumulativeRoiPercent: 22.56,
                followingDurationDays: 95,
            },
        ],
    },
];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
    { label: "Highest 30D ROI", value: "return" },
    { label: "Most Copiers", value: "copiers" },
    { label: "Highest Sharpe Ratio", value: "sharpe" },
    { label: "Lowest Drawdown", value: "drawdown" },
    { label: "Highest AUM", value: "aum" },
];

const PRESET_FILTERS: PresetFilter[] = [
    "All",
    "Top Balanced Traders",
    "Top ROI",
    "Top New Masters",
    "Highest Follower Profit",
    "Lowest Drawdown",
];

function MiniTrendChart({ points }: { points: number[] }) {
    const maxPoint = Math.max(...points);
    const minPoint = Math.min(...points);
    const width = 120;
    const height = 32;

    const coords = points
        .map((val, idx) => {
            const x = (idx / (points.length - 1)) * width;
            const y =
                height -
                ((val - minPoint) / (maxPoint - minPoint || 1)) * (height - 6) -
                3;
            return `${x},${y}`;
        })
        .join(" ");

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-28 sm:w-32 h-8 overflow-visible">
            <defs>
                <linearGradient id="miniGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
            </defs>
            <path
                d={`M 0,${height} L ${coords} L ${width},${height} Z`}
                fill="url(#miniGradient)"
            />
            <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={coords}
            />
        </svg>
    );
}

// Large Interactive Profit Chart Component for Overview Tab
function LargePerformanceChart({ points }: { points: number[] }) {
    const maxPoint = Math.max(...points);
    const minPoint = Math.min(...points);
    const width = 380;
    const height = 140;

    const coords = points
        .map((val, idx) => {
            const x = (idx / (points.length - 1)) * width;
            const y =
                height -
                ((val - minPoint) / (maxPoint - minPoint || 1)) * (height - 24) -
                12;
            return `${x},${y}`;
        })
        .join(" ");

    return (
        <div className="w-full space-y-2">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36 overflow-visible">
                <defs>
                    <linearGradient id="largeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                </defs>
                <path
                    d={`M 0,${height} L ${coords} L ${width},${height} Z`}
                    fill="url(#largeGradient)"
                />
                <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={coords}
                />
            </svg>
            <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400">
                <span>Start</span>
                <span>Mid Period</span>
                <span className="text-emerald-500">Current (+{points[points.length - 1]}%)</span>
            </div>
        </div>
    );
}

function CustomSelect({
                          value,
                          onChange,
                          options,
                      }: {
    value: SortOption;
    onChange: (val: SortOption) => void;
    options: typeof SORT_OPTIONS;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative min-w-[180px]">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex w-full items-center justify-between gap-2 rounded-2xl border border-black/5 bg-[#f5f5f5] px-4 py-2.5 text-xs font-semibold text-gray-800 transition hover:bg-gray-200 dark:border-white/10 dark:bg-[#1A1D24] dark:text-gray-200 dark:hover:bg-[#222630] sm:text-sm"
            >
                <span className="truncate">{selectedOption?.label}</span>
                <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {open && (
                <div className="absolute right-0 top-full z-50 mt-2 w-full min-w-[200px] overflow-hidden rounded-2xl border border-black/5 bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-[#1A1D24]">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition sm:text-sm ${
                                value === opt.value
                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300 font-bold"
                                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                            }`}
                        >
                            <span>{opt.label}</span>
                            {value === opt.value && (
                                <Check size={14} className="text-emerald-500 shrink-0" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function DiscoverExpertsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMarket, setSelectedMarket] = useState<ExpertMarket>("All");
    const [sortBy, setSortBy] = useState<SortOption>("return");
    const [selectedPreset, setSelectedPreset] = useState<PresetFilter>("All");

    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

    // Strategy Detail Screen State
    const [selectedExpertId, setSelectedExpertId] = useState<string | null>(null);
    const [detailClosing, setDetailClosing] = useState(false);

    // Capital Allocation Screen State
    const [copyTargetExpertId, setCopyTargetExpertId] = useState<string | null>(null);
    const [allocationAmount, setAllocationAmount] = useState<string>("500");
    const [maxStopLossPercent, setMaxStopLossPercent] = useState<number>(15);
    const [copyClosing, setCopyClosing] = useState(false);

    // Strategy Detail Active Tab & Performance Chart Duration
    const [activeTab, setActiveTab] = useState<DetailTab>("overview");
    const [chartDuration, setChartDuration] = useState<ChartDuration>("30D");

    // Header Action States
    const [isFavorite, setIsFavorite] = useState(false);
    const [isNotified, setIsNotified] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const selectedExpert =
        DISCOVER_EXPERTS.find((e) => e.id === selectedExpertId) ?? null;

    const copyTargetExpert =
        DISCOVER_EXPERTS.find((e) => e.id === copyTargetExpertId) ?? null;

    const money = (amountUsd: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(amountUsd);

    const closeDetail = useCallback(() => {
        if (detailClosing) return;

        setDetailClosing(true);
        window.setTimeout(() => {
            setSelectedExpertId(null);
            setDetailClosing(false);
            setActiveTab("overview");
            setChartDuration("30D");
            setIsFavorite(false);
            setIsNotified(false);
        }, 480);
    }, [detailClosing]);

    const closeCopyScreen = useCallback(() => {
        if (copyClosing) return;

        setCopyClosing(true);
        window.setTimeout(() => {
            setCopyTargetExpertId(null);
            setCopyClosing(false);
        }, 480);
    }, [copyClosing]);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        window.setTimeout(() => setToastMessage(null), 3200);
    };

    const toggleNotification = () => {
        if (!isNotified) {
            setIsNotified(true);
            showToast(`Subscribed to real-time signal alerts for ${selectedExpert?.name}!`);
        } else {
            setIsNotified(false);
            showToast(`Unsubscribed from strategy signals.`);
        }
    };

    // Keyboard ESC listener
    useEffect(() => {
        if (!selectedExpertId && !copyTargetExpertId && !filterDrawerOpen) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                if (filterDrawerOpen) {
                    setFilterDrawerOpen(false);
                } else if (copyTargetExpertId) {
                    closeCopyScreen();
                } else if (selectedExpertId) {
                    closeDetail();
                }
            }
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedExpertId, copyTargetExpertId, filterDrawerOpen, closeDetail, closeCopyScreen]);

    // Preset Filter Logic
    const filteredExperts = DISCOVER_EXPERTS.filter((expert) => {
        const matchesSearch =
            expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            expert.handle.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesMarket =
            selectedMarket === "All" || expert.market === selectedMarket;

        let matchesPreset = true;
        if (selectedPreset === "Top Balanced Traders") {
            matchesPreset =
                expert.sharpeRatio30d >= 2.5 && expert.maxDrawdownPercent >= -5.0;
        } else if (selectedPreset === "Top ROI") {
            matchesPreset = expert.returnPercent30d >= 100;
        } else if (selectedPreset === "Top New Masters") {
            matchesPreset = expert.isNewMaster;
        } else if (selectedPreset === "Highest Follower Profit") {
            matchesPreset = expert.followerProfitUsd >= 100_000;
        } else if (selectedPreset === "Lowest Drawdown") {
            matchesPreset = expert.maxDrawdownPercent >= -3.5;
        }

        return matchesSearch && matchesMarket && matchesPreset;
    }).sort((a, b) => {
        if (sortBy === "return") return b.returnPercent30d - a.returnPercent30d;
        if (sortBy === "copiers") return b.copiersCount - a.copiersCount;
        if (sortBy === "sharpe") return b.sharpeRatio30d - a.sharpeRatio30d;
        if (sortBy === "drawdown") return b.maxDrawdownPercent - a.maxDrawdownPercent;
        if (sortBy === "aum") return b.aumUsd - a.aumUsd;
        return 0;
    });

    const marketTabs: ExpertMarket[] = ["All", "Forex", "Crypto", "Indices", "Stocks"];

    return (
        <div className="home-content relative min-w-0 space-y-6 pb-8">
            {/* Top Toast Alert Banner */}
            {toastMessage && (
                <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-2xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
                    <BellCheck size={18} />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Header Banner */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full">
                    <div className={"flex justify-between w-full"}>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white sm:text-3xl">
                            Expert traders
                        </h1>
                        <button
                            type="button"
                            aria-label="Learn about HWALN challenges with Avena"
                            onClick={() => router.push("/dashboard/avena?manual=copytrading")}
                            className="flex size-8 items-center justify-center rounded-full hover:bg-gray-200"
                        >
                            <BookText size={20} className="animate-pulsed" />
                        </button>
                    </div>
                    <p className="hidden lg:flex mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                        Follow verified experts with solid performance track records.
                    </p>
                </div>
            </div>

            {/* Search, Market Tabs & Custom Filter Bar */}
            <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search by expert name or handle..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-2xl border border-black/5 bg-[#f5f5f5] pl-10 pr-4 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:border-emerald-500/20 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-[#1A1D24] dark:text-white dark:placeholder-gray-500 sm:text-sm"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Filter Drawer CTA + Custom Select Dropdown */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setFilterDrawerOpen(true)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-black/5 bg-[#f5f5f5] px-4 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-200 dark:border-white/10 dark:bg-[#1A1D24] dark:text-gray-200 dark:hover:bg-[#222630] sm:text-sm"
                        >
                            <SlidersHorizontal size={16} className="text-emerald-500" />
                            <span>Filters</span>
                            {selectedPreset !== "All" && (
                                <span className="size-2 rounded-full bg-emerald-500" />
                            )}
                        </button>

                        <CustomSelect
                            value={sortBy}
                            onChange={setSortBy}
                            options={SORT_OPTIONS}
                        />
                    </div>
                </div>

                {/* Market Sector Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {marketTabs.map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setSelectedMarket(tab)}
                            className={`shrink-0 rounded-xl px-4 py-2 text-xs font-medium transition ${
                                selectedMarket === tab
                                    ? "bg-gray-700 text-white shadow-sm dark:bg-emerald-500"
                                    : "bg-[#f5f5f5] text-gray-600 hover:bg-gray-200 dark:bg-[#1A1D24] dark:text-gray-300 dark:hover:bg-[#222630]"
                            }`}
                        >
                            {tab === "All" ? "All Sector Markets" : tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Experts Grid */}
            {filteredExperts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 px-5 py-12 text-center dark:border-white/15">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400">
                        <Search size={22} />
                    </div>
                    <h3 className="mt-4 font-semibold text-gray-950 dark:text-white">
                        No experts match your filter
                    </h3>
                    <p className="mx-auto mt-1 max-w-xs text-xs text-gray-500 dark:text-gray-400">
                        Try adjusting your strategy presets or search criteria.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            setSearchQuery("");
                            setSelectedMarket("All");
                            setSelectedPreset("All");
                        }}
                        className="mt-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                        Reset filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredExperts.map((expert) => (
                        <div
                            key={expert.id}
                            className="group rounded-2xl border border-black/5 bg-[#f5f5f5] p-5 transition-all hover:border-emerald-500/30 hover:shadow-md dark:border-white/10 dark:bg-[#1A1D24] dark:hover:bg-[#222630] dark:hover:border-emerald-400/30"
                        >
                            {/* Card Top Header */}
                            <div className="flex items-center justify-between gap-3">
                                <div
                                    onClick={() => setSelectedExpertId(expert.id)}
                                    className="flex items-center gap-3 min-w-0 cursor-pointer"
                                >
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 text-sm font-bold text-emerald-800 dark:from-emerald-400/20 dark:to-teal-400/10 dark:text-emerald-200">
                                        {expert.initials}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <h3 className="truncate text-base font-bold text-gray-950 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                {expert.name}
                                            </h3>
                                            {expert.isVerified && (
                                                <Check size={14} className="text-emerald-500 shrink-0" />
                                            )}
                                        </div>
                                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                            <Users size={14} className="text-emerald-500" />
                                            <span>{expert.copiersCount.toLocaleString()} Copiers</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Direct Copy Trigger Button (Triggers Allocation Screen) */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAllocationAmount(String(expert.minInvestmentUsd));
                                        setCopyTargetExpertId(expert.id);
                                    }}
                                    className="shrink-0 rounded-xl bg-emerald-600 px-4 sm:px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 active:scale-[0.99]"
                                >
                                    <span className="inline sm:hidden">Copy</span>
                                    <span className="hidden sm:inline">Copy Strategy</span>
                                </button>
                            </div>

                            {/* Metrics & Chart Body (Triggers Strategy Profile Screen) */}
                            <div
                                onClick={() => setSelectedExpertId(expert.id)}
                                className="mt-4 space-y-3 cursor-pointer"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <div>
                                        <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">30D ROI</p>
                                        <p className="mt-0.5 text-base font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                                            +{expert.returnPercent30d.toFixed(1)}%
                                        </p>
                                    </div>
                                    <div className="shrink-0">
                                        <MiniTrendChart points={expert.chartPoints} />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-2 pt-1">
                                    <div>
                                        <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Max Drawdown</p>
                                        <p className="mt-0.5 text-sm font-bold text-red-500 dark:text-red-400 tabular-nums">
                                            {expert.maxDrawdownPercent.toFixed(1)}%
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">30D Sharpe</p>
                                        <p className="mt-0.5 text-sm font-bold text-gray-900 dark:text-white tabular-nums">
                                            {expert.sharpeRatio30d.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 1. Slide-Over Master Trader Strategy Profile Screen */}
            {selectedExpert && (
                <div
                    className={`
                        min-w-0 lg:max-w-4xl fixed inset-0 z-[60]
                        flex flex-col
                        _overflow-y-auto _overscroll-contain
                        bg-white dark:bg-[#12141A]
                        p- pb- 8 sm:p-2 lg:px-4 lg:left-[var(--dashboard-sidebar-width,440px)]
                        ${
                        detailClosing
                            ? "animate-out slide-out-to-right fade-out duration-500 ease-in"
                            : "animate-in slide-in-from-right fade-in duration-400 ease-out ease-[cubic-bezier(0.22,1,0.36,1)]"
                    }
                    `}
                >
                    <section
                        key={selectedExpert.id}
                        className="relative flex h-full min-w-0 flex-col bg-white dark:bg-[#12141A] overflow-hidden"
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* Fixed Top Header */}
                        <header className="shrink-0 z-30 relative flex items-center justify-between _border-b border-gray-100 bg-white/90 px-4 py-3 backdrop-blur-md dark:border-white/10 dark:bg-[#12141A]/90 sm:px-6 sm:py-3 lg:px-8">
                            <button
                                type="button"
                                onClick={closeDetail}
                                className="flex size-10 shrink-0 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 dark:text-white dark:hover:bg-white/10"
                            >
                                <ArrowLeft size={21} />
                            </button>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={toggleNotification}
                                    aria-label="Subscribe to signals"
                                    className={`flex size-10 items-center justify-center rounded-full transition ${
                                        isNotified
                                            ? "bg-emerald-500 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20"
                                    }`}
                                >
                                    <Bell size={18} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsFavorite((prev) => !prev);
                                        showToast(
                                            !isFavorite
                                                ? `Marked ${selectedExpert.name} as favorite!`
                                                : `Removed from favorites.`
                                        );
                                    }}
                                    aria-label="Mark as favorite"
                                    className={`flex size-10 items-center justify-center rounded-full transition ${
                                        isFavorite
                                            ? "bg-amber-100 text-amber-500 dark:bg-amber-400/20"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20"
                                    }`}
                                >
                                    <Star
                                        size={18}
                                        className={isFavorite ? "fill-amber-500 text-amber-500" : ""}
                                    />
                                </button>
                            </div>
                        </header>

                        {/* Scrollable Strategy Profile Body */}
                        <main className="min-w-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 lg:p-8 space-y-6">
                            <section className="bg-gray-50 dark:bg-white/[0.04] p-5 rounded-3xl border border-gray-100 dark:border-white/10 space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex flex-col sm:flex-row justify-center w-full sm:justify-start items-center gap-3.5 min-w-0">
                                        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 text-lg font-bold text-emerald-800 dark:from-emerald-400/20 dark:to-teal-400/10 dark:text-emerald-200">
                                            {selectedExpert.initials}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-lg sm:text-xl font-extrabold text-gray-950 dark:text-white dtruncate">
                                                    {selectedExpert.name}
                                                </h2>
                                                {selectedExpert.isVerified && (
                                                    <Check size={16} className="hidden text-emerald-500 shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {selectedExpert.handle} · {selectedExpert.market} Strategy
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200/80 dark:border-white/10">
                                    <div>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">AUM</p>
                                        <p className="mt-0.5 text-base font-bold text-gray-950 dark:text-white tabular-nums">
                                            {money(selectedExpert.aumUsd)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400 capitalize tracking-wider">Profit Sharing</p>
                                        <p className="mt-0.5 text-base font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                                            {selectedExpert.profitSharingPercent}%
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-center rounded-2xl bg-white p-3.5 dark:bg-white/5 border border-black/5 dark:border-transparent">
                                    <div>
                                        <p className="text-[10px] uppercase font-medium text-gray-400">Followers</p>
                                        <p className="mt-0.5 text-sm font-bold text-gray-950 dark:text-white tabular-nums">
                                            {selectedExpert.copiersCount.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="border-x border-gray-200 dark:border-white/10">
                                        <p className="text-[10px] uppercase font-medium text-gray-400">Trading Days</p>
                                        <p className="mt-0.5 text-sm font-bold text-gray-950 dark:text-white tabular-nums">
                                            {selectedExpert.tradingDaysHistory}d
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-medium text-gray-400">Stability Index</p>
                                        <p className="mt-0.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                                            {selectedExpert.stabilityIndexScore.toFixed(1)} / 5.0
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2.5 pt-1">
                                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {selectedExpert.summaryBio}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                        <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                                            Min Copy: ${selectedExpert.minInvestmentUsd}
                                        </span>
                                        {selectedExpert.behaviorTags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-lg bg-gray-200/70 px-2.5 py-1 text-[11px] font-medium text-gray-700 dark:bg-white/10 dark:text-gray-300"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Page Tabs Navigation */}
                            <div className="flex items-center gap-1 border-b border-gray-200 dark:border-white/10">
                                {(["overview", "trades", "followers"] as DetailTab[]).map((tab) => (
                                    <button
                                        key={tab}
                                        type="button"
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2.5 text-xs font-bold capitalize transition border-b-2 -mb-px ${
                                            activeTab === tab
                                                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                                                : "border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                        }`}
                                    >
                                        {tab === "followers"
                                            ? `Followers (${selectedExpert.copiersCount})`
                                            : tab}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content 1: Overview (With Bybit-style Trading Records & Profit Chart) */}
                            {activeTab === "overview" && (
                                <div className="space-y-6 animate-in fade-in duration-200">
                                    {/* Bybit-Style Trading Performance Records */}
                                    <div className="rounded-3xl border border-gray-200 p-5 dark:border-white/10 bg-gray-50 dark:bg-white/[0.04] space-y-4">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                            Trading Records & Analytics
                                        </h3>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            <div className="rounded-2xl bg-white p-3.5 dark:bg-white/5 border border-black/5 dark:border-transparent">
                                                <p className="text-[10px] text-gray-400 uppercase">Total Orders Executed</p>
                                                <p className="mt-1 text-base font-extrabold text-gray-950 dark:text-white tabular-nums">
                                                    {selectedExpert.tradingRecords.totalOrdersExecuted.toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="rounded-2xl bg-white p-3.5 dark:bg-white/5 border border-black/5 dark:border-transparent">
                                                <p className="text-[10px] text-gray-400 uppercase">Win Rate Ratio</p>
                                                <p className="mt-1 text-base font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                                                    {selectedExpert.winRatePercent}%
                                                </p>
                                            </div>
                                            <div className="rounded-2xl bg-white p-3.5 dark:bg-white/5 border border-black/5 dark:border-transparent">
                                                <p className="text-[10px] text-gray-400 uppercase">Profit Factor</p>
                                                <p className="mt-1 text-base font-extrabold text-gray-950 dark:text-white tabular-nums">
                                                    {selectedExpert.tradingRecords.profitFactor}
                                                </p>
                                            </div>
                                            <div className="rounded-2xl bg-white p-3.5 dark:bg-white/5 border border-black/5 dark:border-transparent">
                                                <p className="text-[10px] text-gray-400 uppercase">Avg Holding Time</p>
                                                <p className="mt-1 text-base font-bold text-gray-950 dark:text-white tabular-nums">
                                                    {selectedExpert.tradingRecords.avgHoldingTime}
                                                </p>
                                            </div>
                                            <div className="rounded-2xl bg-white p-3.5 dark:bg-white/5 border border-black/5 dark:border-transparent">
                                                <p className="text-[10px] text-gray-400 uppercase">Avg Loss / Trade</p>
                                                <p className="mt-1 text-base font-bold text-red-500 dark:text-red-400 tabular-nums">
                                                    {selectedExpert.tradingRecords.avgLossRatioPercent}%
                                                </p>
                                            </div>
                                            <div className="rounded-2xl bg-white p-3.5 dark:bg-white/5 border border-black/5 dark:border-transparent">
                                                <p className="text-[10px] text-gray-400 uppercase">Win / Loss Orders</p>
                                                <p className="mt-1 text-base font-bold text-gray-950 dark:text-white tabular-nums">
                                                    <span className="text-emerald-500">{selectedExpert.tradingRecords.winningOrdersCount}</span>
                                                    {" / "}
                                                    <span className="text-red-500">{selectedExpert.tradingRecords.losingOrdersCount}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Profit Performance Chart Section with Duration Filter */}
                                    <div className="rounded-3xl border border-gray-200 p-5 dark:border-white/10 bg-gray-50 dark:bg-white/[0.04] space-y-4">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                                    Cumulative Strategy Profit Performance
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                    Tracked profit trajectory over selected trading timeframe.
                                                </p>
                                            </div>

                                            {/* Duration Filter Pill Tabs */}
                                            <div className="flex items-center gap-1 self-start sm:self-auto rounded-xl bg-gray-200/80 p-1 dark:bg-white/10">
                                                {(["7D", "30D", "90D", "All"] as ChartDuration[]).map((dur) => (
                                                    <button
                                                        key={dur}
                                                        type="button"
                                                        onClick={() => setChartDuration(dur)}
                                                        className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                                                            chartDuration === dur
                                                                ? "bg-emerald-600 text-white shadow-sm"
                                                                : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                                        }`}
                                                    >
                                                        {dur}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Large SVG Profit Chart Component */}
                                        <div className="pt-2">
                                            <LargePerformanceChart
                                                points={selectedExpert.performanceChartData[chartDuration]}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tab Content 2: Trades */}
                            {activeTab === "trades" && (
                                <div className="space-y-3 animate-in fade-in duration-200">
                                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
                                        <span>Active Positions (2)</span>
                                        <span>Execution Engine: FastAPI Bridge</span>
                                    </div>

                                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3.5 dark:border-white/10 dark:bg-white/[0.04] flex items-center justify-between text-xs">
                                        <div>
                                            <span className="font-bold text-emerald-600 dark:text-emerald-400">BUY · EUR/USD</span>
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Entry: 1.08420</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-emerald-600 dark:text-emerald-400">+1.24% P&L</span>
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">10x Leverage</p>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3.5 dark:border-white/10 dark:bg-white/[0.04] flex items-center justify-between text-xs">
                                        <div>
                                            <span className="font-bold text-emerald-600 dark:text-emerald-400">BUY · GBP/USD</span>
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Entry: 1.29150</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-emerald-600 dark:text-emerald-400">+2.15% P&L</span>
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">5x Leverage</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tab Content 3: Followers List */}
                            {activeTab === "followers" && (
                                <div className="space-y-3 animate-in fade-in duration-200">
                                    {selectedExpert.followersList.map((follower) => (
                                        <div
                                            key={follower.id}
                                            className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 p-3.5 dark:border-white/10 dark:bg-white/[0.04] text-xs"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 font-bold text-emerald-800 dark:from-emerald-400/20 dark:to-teal-400/10 dark:text-emerald-200">
                                                    {follower.initials}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-gray-950 dark:text-white truncate">
                                                        {follower.username}
                                                    </p>
                                                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                                        Acc. Order Cost: {money(follower.accumulatedOrderCostUsd)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right shrink-0">
                                                <p className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                                                    +{money(follower.cumulativeProfitUsd)} (+{follower.cumulativeRoiPercent}%)
                                                </p>
                                                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                                                    Following {follower.followingDurationDays} days
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </main>

                        {/* Strictly Fixed & Stickied Bottom Detail Footer */}
                        <div className="shrink-0 z-20 border-t border-gray-200 bg-white/95 p-4 backdrop-blur-md dark:border-white/10 dark:bg-[#12141A]/95 sm:px-6">
                            <div className="flex items-center justify-between gap-3">
                                <button
                                    type="button"
                                    onClick={() => showToast(`Share link copied to clipboard!`)}
                                    className="flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-gray-600 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                >
                                    <Share2 size={18} />
                                    <span>Share</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => showToast(`Added ${selectedExpert.name} to comparison list.`)}
                                    className="flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-gray-600 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                >
                                    <Repeat size={18} />
                                    <span>Compare</span>
                                </button>

                                <div className="flex-1 min-w-0 pl-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAllocationAmount(String(selectedExpert.minInvestmentUsd));
                                            setCopyTargetExpertId(selectedExpert.id);
                                        }}
                                        className="w-full rounded-2xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 active:scale-[0.99]"
                                    >
                                        Copy Strategy
                                    </button>
                                    <p className="mt-1 text-center text-[10px] font-medium text-gray-500 dark:text-gray-400">
                                        {selectedExpert.maxCopiersSlots - selectedExpert.copiersCount} / {selectedExpert.maxCopiersSlots} slots left
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            )}

            {/* 2. Slide-Over Dedicated Capital Allocation / Copy Strategy Screen */}
            {copyTargetExpert && (
                <div
                    className={`
                        fixed inset-0 z-80 overflow-y-auto overscroll-contain
                        bg-background text-foreground
                        lg:inset-y-0 lg:right-0
                        lg:left-[var(--dashboard-sidebar-width,440px)]
                        ${
                        copyClosing
                            ? "animate-out slide-out-to-right fade-out duration-500 ease-in"
                            : "animate-in slide-in-from-right fade-in duration-500 ease-out"
                    }
                    `}
                >
                    <section
                        key={copyTargetExpert.id}
                        className="relative flex min-h-full min-w-0 flex-col pb-28 bg-white dark:bg-[#12141A]"
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* Header */}
                        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-100 bg-white/90 px-4 py-3 backdrop-blur-md dark:border-white/10 dark:bg-[#12141A]/90 sm:px-6 sm:py-4 lg:px-8">
                            <button
                                type="button"
                                onClick={closeCopyScreen}
                                className="flex size-10 shrink-0 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 dark:text-white dark:hover:bg-white/10"
                            >
                                <ArrowLeft size={21} />
                            </button>
                            <h2 className="text-base font-bold text-gray-950 dark:text-white">
                                Allocate Investment Capital
                            </h2>
                            <div className="w-10" />
                        </header>

                        {/* Allocation Screen Body */}
                        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
                            <div className="flex items-center gap-3.5 rounded-3xl bg-gray-50 p-4 dark:bg-white/[0.04] border border-gray-100 dark:border-white/10">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 font-bold text-emerald-800 dark:from-emerald-400/20 dark:to-teal-400/10 dark:text-emerald-200">
                                    {copyTargetExpert.initials}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-bold text-gray-950 dark:text-white truncate">
                                        {copyTargetExpert.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Profit Sharing: {copyTargetExpert.profitSharingPercent}% · Min ${copyTargetExpert.minInvestmentUsd}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Investment Amount (USD)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        value={allocationAmount}
                                        onChange={(e) => setAllocationAmount(e.target.value)}
                                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-9 pr-4 py-3.5 text-lg font-extrabold text-gray-950 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-[#1A1D24] dark:text-white"
                                        placeholder="Enter amount"
                                    />
                                </div>

                                <div className="flex items-center gap-2 pt-1">
                                    {["200", "500", "1000", "5000"].map((preset) => (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => setAllocationAmount(preset)}
                                            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                                                allocationAmount === preset
                                                    ? "bg-emerald-600 text-white shadow-sm"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20"
                                            }`}
                                        >
                                            +${preset}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3 rounded-2xl bg-gray-50 p-4 dark:bg-white/[0.04] border border-gray-100 dark:border-white/10">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold text-gray-950 dark:text-white">
                                        Max Copy Stop Loss Protection
                                    </span>
                                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                                        {maxStopLossPercent}% Capital Protect
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="5"
                                    max="50"
                                    step="5"
                                    value={maxStopLossPercent}
                                    onChange={(e) => setMaxStopLossPercent(Number(e.target.value))}
                                    className="w-full accent-emerald-500 cursor-pointer"
                                />
                                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                    Automatically detaches copy bridge if total portfolio drawdown reaches {maxStopLossPercent}%.
                                </p>
                            </div>

                            <div className="flex items-start gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-gray-600 dark:text-gray-300">
                                <ShieldCheck size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                                <span>
                                    Trades execute in real-time with zero latency via machine-learning automated risk filters.
                                </span>
                            </div>
                        </main>

                        {/* Execution Footer */}
                        <div className="sticky bottom-0 z-30 border-t border-gray-200 bg-white/95 p-4 backdrop-blur-md dark:border-white/10 dark:bg-[#12141A]/95 sm:px-6">
                            <button
                                type="button"
                                onClick={() => {
                                    showToast(`Successfully started copying ${copyTargetExpert.name} with $${allocationAmount}!`);
                                    closeCopyScreen();
                                }}
                                className="w-full rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-600/20 transition hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 active:scale-[0.99]"
                            >
                                Confirm & Start Copying (${allocationAmount || "0"})
                            </button>
                        </div>
                    </section>
                </div>
            )}

            {/* Filter Drawer Sheet */}
            {filterDrawerOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
                    <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#181B22] dark:text-white">
                        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4">
                            <h3 className="text-lg font-bold">Filter Strategy Presets</h3>
                            <button
                                type="button"
                                onClick={() => setFilterDrawerOpen(false)}
                                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4 py-5">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Strategy Preset
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {PRESET_FILTERS.map((preset) => (
                                    <button
                                        key={preset}
                                        type="button"
                                        onClick={() => setSelectedPreset(preset)}
                                        className={`rounded-xl px-3.5 py-2.5 text-xs font-semibold text-left transition ${
                                            selectedPreset === preset
                                                ? "bg-emerald-600 text-white shadow-sm"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20"
                                        }`}
                                    >
                                        {preset}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-white/10">
                            <button
                                type="button"
                                onClick={() => setFilterDrawerOpen(false)}
                                className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
                            >
                                Apply Preset ({filteredExperts.length} Results)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}