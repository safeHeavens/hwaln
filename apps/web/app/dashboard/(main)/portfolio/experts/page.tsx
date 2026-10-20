"use client";

import { useCallback, useEffect, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Clock3,
    Eye,
    EyeOff,
    LoaderCircle,
    Share2,
    ShieldAlert,
    ShieldCheck,
    TrendingDown,
    TrendingUp,
    Users,
    X,
} from "lucide-react";

type ExpertStrategy = {
    id: string;
    name: string;
    initials: string;
    market: string;
    allocatedCapitalUsd: number;
    totalPnlUsd: number;
    totalReturnPercent: number;
    weeklyPnlUsd: number;
    weeklyReturnPercent: number;
    openPnlUsd: number;
    realizedPnlUsd: number;
    openPositions: number;
    lastUpdated: string;
    copyStartedAt: string;
    status: "Copying" | "Stopped";
};

type CurrencyType = "USD" | "EUR" | "GBP" | "NGN";

const CURRENCY_RATES: Record<CurrencyType, { symbol: string; rate: number; locale: string }> = {
    USD: { symbol: "USD", rate: 1, locale: "en-US" },
    EUR: { symbol: "EUR", rate: 0.92, locale: "de-DE" },
    GBP: { symbol: "GBP", rate: 0.79, locale: "en-GB" },
    NGN: { symbol: "NGN", rate: 1500, locale: "en-NG" },
};

type TimeframePeriod = "7D" | "1M" | "3M" | "YTD" | "ALL";

const PERFORMANCE_MOCK_DATA: Record<TimeframePeriod, { returnPercent: string; isPositive: boolean; points: number[] }> = {
    "7D": { returnPercent: "+2.50%", isPositive: true, points: [10, 15, 12, 22, 18, 28, 35] },
    "1M": { returnPercent: "+6.40%", isPositive: true, points: [5, 12, 20, 18, 30, 42, 50] },
    "3M": { returnPercent: "+14.80%", isPositive: true, points: [10, 8, 25, 30, 48, 65, 80] },
    "YTD": { returnPercent: "+22.10%", isPositive: true, points: [15, 25, 35, 40, 55, 75, 95] },
    "ALL": { returnPercent: "+34.50%", isPositive: true, points: [20, 30, 45, 50, 70, 85, 120] },
};

function PerformanceChart({ period }: { period: TimeframePeriod }) {
    const data = PERFORMANCE_MOCK_DATA[period];
    const maxPoint = Math.max(...data.points);
    const minPoint = Math.min(...data.points);
    const height = 120;
    const width = 500;

    const pointsCoordinates = data.points.map((val, idx) => {
        const x = (idx / (data.points.length - 1)) * width;
        const y = height - ((val - minPoint) / (maxPoint - minPoint || 1)) * (height - 20) - 10;
        return `${x},${y}`;
    }).join(" ");

    return (
        <div className="relative mt-4 w-full overflow-hidden">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32 overflow-visible">
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                </defs>
                <path
                    d={`M 0,${height} L ${pointsCoordinates} L ${width},${height} Z`}
                    fill="url(#chartGradient)"
                />
                <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={pointsCoordinates}
                />
            </svg>
        </div>
    );
}

const INITIAL_STRATEGIES: ExpertStrategy[] = [
    {
        id: "expert-alpha",
        name: "Expert Alpha",
        initials: "EA",
        market: "Forex",
        allocatedCapitalUsd: 333.33,
        totalPnlUsd: 21.33,
        totalReturnPercent: 6.4,
        weeklyPnlUsd: 8.33,
        weeklyReturnPercent: 2.5,
        openPnlUsd: 2.83,
        realizedPnlUsd: 18.50,
        openPositions: 3,
        lastUpdated: "Demo data",
        copyStartedAt: "2026-09-18",
        status: "Copying",
    },
    {
        id: "expert-beta",
        name: "Expert Beta",
        initials: "EB",
        market: "Crypto",
        allocatedCapitalUsd: 266.67,
        totalPnlUsd: 8.27,
        totalReturnPercent: 3.1,
        weeklyPnlUsd: 5.60,
        weeklyReturnPercent: 2.1,
        openPnlUsd: -0.80,
        realizedPnlUsd: 9.07,
        openPositions: 2,
        lastUpdated: "Demo data",
        copyStartedAt: "2026-10-02",
        status: "Copying",
    },
];

const INITIAL_PORTFOLIO = {
    capitalUsd: 600.00,
    overallPnlUsd: 29.60,
    weeklyPnlUsd: 13.93,
    overallReturnPercent: 8.58,
    weeklyReturnPercent: 1.97,
};

export default function PortfolioExpertsPage() {
    const [strategies, setStrategies] = useState<ExpertStrategy[]>(INITIAL_STRATEGIES);
    const [selectedStrategyId, setSelectedStrategyId] = useState<string | null>(null);

    const [stopConfirmationOpen, setStopConfirmationOpen] = useState(false);
    const [stopConfirmationClosing, setStopConfirmationClosing] = useState(false);
    const [detailClosing, setDetailClosing] = useState(false);

    const [balanceVisible, setBalanceVisible] = useState(true);
    const [endingCopy, setEndingCopy] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState<TimeframePeriod>("7D");

    const [currency, setCurrency] = useState<CurrencyType>("USD");

    const selectedStrategy =
        strategies.find((strategy) => strategy.id === selectedStrategyId) ?? null;

    const copyingStrategies = strategies.filter(
        (strategy) => strategy.status === "Copying",
    );

    function formatMoney(amountUsd: number) {
        const config = CURRENCY_RATES[currency];
        const converted = amountUsd * config.rate;

        const formattedValue = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(converted);

        return `${formattedValue} ${currency}`;
    }

    function displayMoney(amountUsd: number) {
        return balanceVisible ? formatMoney(amountUsd) : "••••••";
    }

    const openStopConfirmation = () => {
        setStopConfirmationOpen(true);
        setStopConfirmationClosing(false);
    };

    const closeStopConfirmation = useCallback(() => {
        if (endingCopy || stopConfirmationClosing) return;

        setStopConfirmationClosing(true);
        window.setTimeout(() => {
            setStopConfirmationOpen(false);
            setStopConfirmationClosing(false);
        }, 300);
    }, [endingCopy, stopConfirmationClosing]);

    const closeDetail = useCallback(() => {
        if (detailClosing) return;

        if (stopConfirmationOpen) {
            setStopConfirmationOpen(false);
            setStopConfirmationClosing(false);
        }

        setDetailClosing(true);
        window.setTimeout(() => {
            setSelectedStrategyId(null);
            setDetailClosing(false);
        }, 480);
    }, [detailClosing, stopConfirmationOpen]);

    useEffect(() => {
        if (!selectedStrategyId) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key !== "Escape" || endingCopy) return;

            if (stopConfirmationOpen) {
                closeStopConfirmation();
            } else {
                closeDetail();
            }
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [
        selectedStrategyId,
        stopConfirmationOpen,
        endingCopy,
        closeDetail,
        closeStopConfirmation,
    ]);

    async function confirmStopCopying() {
        if (!selectedStrategy || endingCopy) return;

        setEndingCopy(true);

        try {
            await new Promise((resolve) => window.setTimeout(resolve, 600));

            setStrategies((current) =>
                current.map((strategy) =>
                    strategy.id === selectedStrategy.id
                        ? { ...strategy, status: "Stopped" }
                        : strategy,
                ),
            );

            closeStopConfirmation();
            setTimeout(() => {
                closeDetail();
            }, 350);
        } catch (error) {
            console.error("Unable to stop copying strategy:", error);
        } finally {
            setEndingCopy(false);
        }
    }

    const periods: TimeframePeriod[] = ["7D", "1M", "3M", "YTD", "ALL"];
    const portfolio = INITIAL_PORTFOLIO;

    return (
        <div className="relative min-w-0 space-y-6 pb-8">
            {/* Portfolio Performance Card */}
            <section
                className="
                    -mt-4 relative isolate overflow-hidden rounded-3xl
                    border border-white/10
                    bg-gradient-to-br
                    from-[#302035] via-[#20232D] to-[#073B3A]
                    text-white shadow-xl shadow-black/5
                    dark:border-emerald-300/20
                    dark:from-[#064E3B]
                    dark:via-[#047857]
                    dark:to-[#A3E635]
                    dark:shadow-emerald-950/10
                "
            >
                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none absolute -right-20 -top-24
                        size-64 rounded-full bg-teal-400/15 blur-3xl
                        dark:bg-lime-200/30
                    "
                />

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none absolute -bottom-28 -left-16
                        size-64 rounded-full bg-purple-500/15 blur-3xl
                        dark:bg-emerald-950/20
                    "
                />

                <div className="relative z-10 p-5 sm:p-6 lg:p-7">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-white/75">
                            Capital with experts
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setBalanceVisible((visible) => !visible)
                            }
                            aria-label={
                                balanceVisible
                                    ? "Hide balances"
                                    : "Show balances"
                            }
                            className="
                                inline-flex size-9 items-center
                                justify-center rounded-full
                                text-white/80 transition
                                hover:bg-white/10 hover:text-white
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-white/60
                            "
                        >
                            {balanceVisible ? <Eye size={19} /> : <EyeOff size={19} />}
                        </button>
                    </div>

                    <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h2 className="break-words text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
                            {displayMoney(portfolio.capitalUsd)}
                        </h2>

                        <span className="text-sm text-white/70">
                            across {copyingStrategies.length} active experts
                        </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                            className={`
                                inline-flex items-center gap-1
                                rounded-full px-2.5 py-1 text-xs
                                font-semibold
                                ${
                                portfolio.overallPnlUsd >= 0
                                    ? "bg-emerald-300/20 text-emerald-100"
                                    : "bg-red-300/20 text-red-100"
                            }
                            `}
                        >
                            {portfolio.overallPnlUsd >= 0 ? (
                                <TrendingUp size={14} />
                            ) : (
                                <TrendingDown size={14} />
                            )}
                            {portfolio.overallReturnPercent >= 0 ? "+" : ""}
                            {portfolio.overallReturnPercent.toFixed(2)}%
                        </span>

                        <span className="text-sm text-white/75">
                            {portfolio.overallPnlUsd >= 0 ? "+" : ""}
                            {displayMoney(portfolio.overallPnlUsd)} overall return
                        </span>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/15 pt-4">
                        <div className="min-w-0">
                            <p className="text-xs text-white/70">
                                Last 7 days
                            </p>

                            <p
                                className={`
                                    mt-1 break-words text-lg font-semibold
                                    tabular-nums
                                    ${
                                    portfolio.weeklyPnlUsd >= 0
                                        ? "text-emerald-200"
                                        : "text-red-200"
                                }
                                `}
                            >
                                {portfolio.weeklyPnlUsd >= 0 ? "+" : ""}
                                {displayMoney(portfolio.weeklyPnlUsd)}
                            </p>
                        </div>

                        <p className="shrink-0 text-sm font-medium tabular-nums text-white/80">
                            {portfolio.weeklyReturnPercent >= 0 ? "+" : ""}
                            {portfolio.weeklyReturnPercent.toFixed(2)}%
                        </p>
                    </div>
                </div>
            </section>

            {/* My Experts Section */}
            <section className="space-y-4">
                <div className="flex items-end justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-950 dark:text-white sm:text-xl">
                            My experts
                        </h2>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Manage the strategies you're copying.
                        </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                        {copyingStrategies.length} following
                    </span>
                </div>

                {copyingStrategies.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 px-5 py-10 text-center dark:border-white/15">
                        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/5">
                            <TrendingUp
                                size={22}
                                className="text-gray-500 dark:text-gray-400"
                            />
                        </div>

                        <h3 className="mt-4 font-semibold text-gray-950 dark:text-white">
                            No active copying strategies
                        </h3>

                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">
                            When you start copying an expert, their strategy
                            and performance will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                        {copyingStrategies.map((strategy) => (
                            <button
                                key={strategy.id}
                                type="button"
                                onClick={() =>
                                    setSelectedStrategyId(strategy.id)
                                }
                                className="
                                    group w-full min-w-0 rounded-2xl
                                    border border-black/5 bg-[#f5f5f5] p-3.5 sm:p-4
                                    text-left transition-all duration-200
                                    hover:border-emerald-500/30
                                    hover:shadow-md
                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-emerald-500
                                    dark:border-white/10
                                    dark:bg-[#1A1D24]
                                    dark:hover:bg-[#222630]
                                    dark:hover:border-emerald-400/30
                                "
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="
                                            flex size-10 shrink-0
                                            items-center justify-center
                                            rounded-xl
                                            bg-gradient-to-br
                                            from-emerald-100 to-teal-100
                                            text-xs font-bold
                                            text-emerald-800
                                            dark:from-emerald-400/20
                                            dark:to-teal-400/10
                                            dark:text-emerald-200
                                        "
                                    >
                                        {strategy.initials}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate text-sm font-semibold text-gray-950 dark:text-white">
                                            {strategy.name}
                                        </h3>

                                        <div className="mt-0.5 flex items-center gap-1.5">
                                            <span className="size-1.5 rounded-full bg-emerald-500" />
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                Copying · {strategy.market}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="shrink-0 text-right">
                                        <p
                                            className={`
                                                text-sm font-semibold
                                                tabular-nums
                                                ${
                                                strategy.totalPnlUsd >= 0
                                                    ? "text-emerald-600 dark:text-emerald-400"
                                                    : "text-red-600 dark:text-red-400"
                                            }
                                            `}
                                        >
                                            {strategy.totalReturnPercent >= 0
                                                ? "+"
                                                : ""}
                                            {strategy.totalReturnPercent.toFixed(
                                                2,
                                            )}
                                            %
                                        </p>

                                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                            Overall
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3 grid grid-cols-2 gap-3 border-t border-gray-200/70 pt-3 dark:border-white/10 text-xs">
                                    <div className="min-w-0">
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                            Allocated capital
                                        </p>

                                        <p className="mt-0.5 break-words font-semibold tabular-nums text-gray-900 dark:text-white">
                                            {displayMoney(
                                                strategy.allocatedCapitalUsd,
                                            )}
                                        </p>
                                    </div>

                                    <div className="min-w-0 text-right">
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                            7-day P&L
                                        </p>

                                        <p
                                            className={`
                                                mt-0.5 break-words
                                                font-semibold tabular-nums
                                                ${
                                                strategy.weeklyPnlUsd >= 0
                                                    ? "text-emerald-600 dark:text-emerald-400"
                                                    : "text-red-600 dark:text-red-400"
                                            }
                                            `}
                                        >
                                            {strategy.weeklyPnlUsd >= 0
                                                ? "+"
                                                : ""}
                                            {displayMoney(
                                                strategy.weeklyPnlUsd,
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between border-t border-gray-200/70 pt-2.5 dark:border-white/10 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                    <span className="text-gray-500 dark:text-gray-400 font-normal">
                                        {strategy.openPositions} open positions
                                    </span>
                                    <span className="inline-flex items-center gap-1 transition group-hover:gap-1.5">
                                        Manage strategy
                                        <ArrowRight size={14} />
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </section>

            {/* Strategy details slide-in screen */}
            {selectedStrategy && (
                <div
                    className={`
                        fixed inset-0 z-40 overflow-y-auto overscroll-contain
                        bg-background text-foreground
                        lg:inset-y-0 lg:right-0
                        lg:left-[var(--dashboard-sidebar-width,440px)]
                        ${
                        detailClosing
                            ? "animate-out slide-out-to-right fade-out duration-500 ease-in"
                            : "animate-in slide-in-from-right fade-in duration-500 ease-out"
                    }
                        motion-reduce:animate-none
                    `}
                >
                    <section
                        key={selectedStrategy.id}
                        className="
                            relative flex min-h-full min-w-0 flex-col pb-28
                            bg-white dark:bg-[#12141A] text-foreground
                        "
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="expert-detail-title"
                    >
                        {/* Header */}
                        <header className="flex justify-between lg:pr-55 shrink-0 items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8 border-b border-gray-100 dark:border-white/10">
                            <button
                                type="button"
                                onClick={closeDetail}
                                aria-label="Back to my experts"
                                className="
                                    flex size-10 shrink-0 items-center
                                    justify-center rounded-full
                                    text-gray-700 transition lg:bg-gray-100
                                    hover:bg-gray-200
                                    dark:text-white dark:hover:bg-white/10
                                "
                            >
                                <ArrowLeft size={21} />
                            </button>

                            <span className="lg:mr-8 flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                                <span className="size-1.5 rounded-full bg-emerald-500" />
                                {selectedStrategy.status === "Copying" ? "Active Copying" : "Stopped"}
                            </span>
                        </header>

                        {/* Main Detail Content */}
                        <main className="min-w-0 flex-1 lg:pr-55 lg:pl-7">
                            <div className="w-full min-w-0 space-y-6 p-4 pb-8 sm:p-6 lg:p-8">

                                {/* Top Performance Banner */}
                                <section className="bg-gray-50 dark:bg-white/[0.04] p-5 rounded-2xl border border-gray-100 dark:border-white/10">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 text-sm font-bold text-emerald-800 dark:from-emerald-400/20 dark:to-teal-400/10 dark:text-emerald-200">
                                            {selectedStrategy.initials}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h2
                                                id="expert-detail-title"
                                                className="text-xl font-bold text-gray-950 dark:text-white truncate"
                                            >
                                                {selectedStrategy.name}
                                            </h2>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {selectedStrategy.market} Strategy · Copying since{" "}
                                                {new Intl.DateTimeFormat("en-GB", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                }).format(new Date(`${selectedStrategy.copyStartedAt}T12:00:00`))}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 flex flex-wrap items-baseline justify-between gap-3">
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Your Net Return
                                            </p>
                                            <h3
                                                className={`
                                                    mt-1 text-2xl font-bold
                                                    tracking-tight tabular-nums
                                                    ${
                                                    selectedStrategy.totalPnlUsd >= 0
                                                        ? "text-emerald-600 dark:text-emerald-400"
                                                        : "text-red-600 dark:text-red-400"
                                                }
                                                `}
                                            >
                                                {selectedStrategy.totalPnlUsd >= 0 ? "+" : ""}
                                                {displayMoney(selectedStrategy.totalPnlUsd)}
                                            </h3>
                                        </div>

                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                                            {selectedStrategy.totalReturnPercent >= 0 ? "+" : ""}
                                            {selectedStrategy.totalReturnPercent.toFixed(2)}% Return
                                        </span>
                                    </div>
                                </section>

                                {/* Performance Section with Chart & Timeframe Selectors */}
                                <section className="rounded-3xl border border-black/5 bg-[#f5f5f5] p-5 sm:p-7 dark:border-white/10 dark:bg-white/[0.04]">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-950 dark:text-white">
                                                Strategy Performance
                                            </h3>
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                Track progress across timeframes.
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1 rounded-full bg-gray-200/60 dark:bg-white/10 p-1">
                                            {periods.map((item) => (
                                                <button
                                                    key={item}
                                                    type="button"
                                                    onClick={() => setSelectedPeriod(item)}
                                                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                                                        selectedPeriod === item
                                                            ? "bg-white text-gray-950 shadow-sm dark:bg-emerald-500 dark:text-white"
                                                            : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                                    }`}
                                                >
                                                    {item}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                                {PERFORMANCE_MOCK_DATA[selectedPeriod].returnPercent}
                                            </span>
                                        </div>
                                        <PerformanceChart period={selectedPeriod} />
                                    </div>
                                </section>

                                {/* Action Buttons */}
                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={openStopConfirmation}
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 py-3.5 text-xs font-bold text-red-600 transition hover:bg-red-500 hover:text-white dark:bg-red-500/15 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white active:scale-[0.99]"
                                    >
                                        <ShieldAlert size={16} />
                                        <span>Stop Copying Strategy</span>
                                    </button>
                                </div>

                            </div>
                        </main>
                    </section>
                </div>
            )}
        </div>
    );
}