"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    Clock3,
    Compass,
    Eye,
    EyeOff,
    Flame,
    Info,
    ShieldCheck,
    TrendingDown,
    TrendingUp,
    Users,
    X,
} from "lucide-react";

export type ActiveChallenge = {
    id: string;
    title: string;
    host: string;
    market: string;
    contributionUsd: number;
    todayAllocatedProfitUsd: number;
    day: number;
    durationDays: number;
    daysLeft: number;
    streakDays: number;
    streakPnlUsd: number;
    startedAt: string;
    totalParticipants: number;
    totalPoolVaultUsd: number;
    streakTradesCount: number;
    streakWinRatePercent: number;
    avgDailyReturnPercent: number;
    compoundingSchedule: {
        day: number;
        targetRoiPercent: number;
        projectedBalanceUsd: number;
        status: "completed" | "in_progress" | "upcoming";
    }[];
};

export interface ChallengePageData {
    challenges: ActiveChallenge[];
    fxRate?: number;
}

interface PortfolioChallengesPageProps {
    initialData?: ChallengePageData;
}

const DEFAULT_FX_RATE = 1500;

const DEFAULT_CHALLENGES: ActiveChallenge[] = [
    {
        id: "challenge-alpha",
        title: "100 USD in 30 days",
        host: "Expert Alpha",
        market: "Crypto",
        contributionUsd: 25,
        todayAllocatedProfitUsd: 2.10,
        day: 12,
        durationDays: 30,
        daysLeft: 18,
        streakDays: 5,
        streakPnlUsd: 14.5,
        startedAt: "Oct 7, 2026",
        totalParticipants: 1420,
        totalPoolVaultUsd: 35500,
        streakTradesCount: 18,
        streakWinRatePercent: 83.3,
        avgDailyReturnPercent: 2.4,
        compoundingSchedule: Array.from({ length: 30 }, (_, i) => {
            const day = i + 1;
            const startAmount = 25;
            const projected = Math.round(startAmount * Math.pow(1.05, day));
            return {
                day,
                targetRoiPercent: 5,
                projectedBalanceUsd: projected,
                status: day < 12 ? "completed" : day === 12 ? "in_progress" : "upcoming",
            };
        }),
    },
    {
        id: "pool-beta",
        title: "30-day Forex pool",
        host: "Expert Beta",
        market: "Forex",
        contributionUsd: 50,
        todayAllocatedProfitUsd: -0.75,
        day: 8,
        durationDays: 30,
        daysLeft: 22,
        streakDays: 3,
        streakPnlUsd: -4.2,
        startedAt: "Oct 11, 2026",
        totalParticipants: 890,
        totalPoolVaultUsd: 44500,
        streakTradesCount: 11,
        streakWinRatePercent: 63.6,
        avgDailyReturnPercent: -0.8,
        compoundingSchedule: Array.from({ length: 30 }, (_, i) => {
            const day = i + 1;
            const startAmount = 50;
            const projected = Math.round(startAmount * Math.pow(1.04, day));
            return {
                day,
                targetRoiPercent: 4,
                projectedBalanceUsd: projected,
                status: day < 8 ? "completed" : day === 8 ? "in_progress" : "upcoming",
            };
        }),
    },
];

function formatMoney(amountUsd: number, currency: "USD" | "NGN", fxRate: number) {
    const amount = currency === "NGN" ? amountUsd * fxRate : amountUsd;
    const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: currency === "USD" ? 2 : 0,
        maximumFractionDigits: currency === "USD" ? 2 : 0,
    }).format(amount);

    return `${formatted} ${currency}`;
}

export default function PortfolioChallengesPage({ initialData }: PortfolioChallengesPageProps) {
    const [balanceVisible, setBalanceVisible] = useState(true);
    const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
    const [detailClosing, setDetailClosing] = useState(false);
    const [streakSummaryModalOpen, setStreakSummaryModalOpen] = useState(false);
    const [currency, setCurrency] = useState<"USD" | "NGN">("USD");

    const [data, setData] = useState<ChallengePageData>(
        initialData || {
            challenges: DEFAULT_CHALLENGES,
            fxRate: DEFAULT_FX_RATE,
        }
    );

    const fxRate = data.fxRate || DEFAULT_FX_RATE;
    const activeChallenges = data.challenges;

    const totalChallengeFunds = activeChallenges.reduce(
        (total, challenge) => total + challenge.contributionUsd,
        0,
    );

    const selectedChallenge =
        activeChallenges.find((challenge) => challenge.id === selectedChallengeId) ??
        null;

    const displayMoney = (amountUsd: number) =>
        balanceVisible ? formatMoney(amountUsd, currency, fxRate) : "••••••";

    const closeDetail = useCallback(() => {
        if (detailClosing) return;

        setDetailClosing(true);
        window.setTimeout(() => {
            setSelectedChallengeId(null);
            setDetailClosing(false);
            setStreakSummaryModalOpen(false);
        }, 480);
    }, [detailClosing]);

    useEffect(() => {
        if (!selectedChallengeId) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                if (streakSummaryModalOpen) {
                    setStreakSummaryModalOpen(false);
                } else {
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
    }, [selectedChallengeId, streakSummaryModalOpen, closeDetail]);

    return (
        <div className="relative min-w-0 space-y-6 pb-8">
            {/* Challenge balance + active streak summary */}
            <section
                className="
                    -mt-4 relative isolate overflow-hidden rounded-3xl
                    border border-white/10 bg-gradient-to-br
                    from-[#302035] via-[#20232D] to-[#073B3A]
                    text-white shadow-xl shadow-black/5
                    dark:border-emerald-300/20 dark:from-[#064E3B]
                    dark:via-[#047857] dark:to-[#A3E635]
                    dark:shadow-emerald-950/10
                "
            >
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-teal-400/15 blur-3xl dark:bg-lime-200/30"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-28 -left-16 size-64 rounded-full bg-purple-500/15 blur-3xl dark:bg-emerald-950/20"
                />

                <div className="relative z-10 p-5 sm:p-6 lg:p-7">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-white/75">Funds in challenges</p>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setCurrency((c) => (c === "USD" ? "NGN" : "USD"))}
                                className="hidden rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white transition hover:bg-white/20"
                            >
                                {currency}
                            </button>
                            <button
                                type="button"
                                onClick={() => setBalanceVisible((visible) => !visible)}
                                aria-label={balanceVisible ? "Hide challenge funds" : "Show challenge funds"}
                                className="inline-flex size-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                            >
                                {balanceVisible ? <Eye size={19} /> : <EyeOff size={19} />}
                            </button>
                        </div>
                    </div>

                    <div className="mt-2 flex flex-col flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h1 className="break-words text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
                            {displayMoney(totalChallengeFunds)}
                        </h1>
                        <span className="text-sm text-white/70">
                            across {activeChallenges.length} active challenges
                        </span>
                    </div>

                    <div className="mt-5 border-t border-white/15 pt-4">
                        <p className="mb-3 text-xs font-medium text-white/65">Your active streaks</p>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {activeChallenges.map((challenge) => (
                                <div
                                    key={challenge.id}
                                    className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3 cursor-pointer transition hover:bg-white/[0.1]"
                                    onClick={() => setSelectedChallengeId(challenge.id)}
                                >
                                    <div className="flex min-w-0 items-center gap-2.5">
                                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-300/15 text-orange-100">
                                            <Flame size={16} />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-medium text-white">
                                                {challenge.title}
                                            </p>
                                            <p className="text-[11px] text-white/60">Current streak</p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-semibold tabular-nums text-white">
                                            {challenge.streakDays} <span className="text-xs font-normal text-white/65">days</span>
                                        </p>
                                        <p className={`text-[11px] font-medium tabular-nums ${challenge.streakPnlUsd >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                                            {challenge.streakPnlUsd >= 0 ? "+" : ""}{displayMoney(challenge.streakPnlUsd)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* My Challenges Section */}
            <section className="space-y-4">
                <div className="flex items-end justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-950 dark:text-white sm:text-xl">
                            My challenges
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Tap any card preview to inspect full streak analytics.
                        </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                        {activeChallenges.length} active
                    </span>
                </div>

                {activeChallenges.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 px-5 py-10 text-center dark:border-white/15">
                        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400">
                            <CalendarDays size={22} />
                        </div>
                        <h3 className="mt-4 font-semibold text-gray-950 dark:text-white">
                            No active challenges yet
                        </h3>
                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">
                            Join an expert's challenge or trading pool to see your progress here.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                        {activeChallenges.map((challenge) => {
                            const progress = Math.min(
                                100,
                                Math.round((challenge.day / challenge.durationDays) * 100),
                            );

                            return (
                                <button
                                    key={challenge.id}
                                    type="button"
                                    onClick={() => setSelectedChallengeId(challenge.id)}
                                    className="group w-full min-w-0 rounded-2xl border border-black/5 bg-[#f5f5f5] p-3.5 sm:p-4 text-left transition-all hover:border-emerald-500/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-white/10 dark:bg-[#1A1D24] dark:hover:bg-[#222630] dark:hover:border-emerald-400/30"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="min-w-0 flex items-center gap-2">
                                            <span className="shrink-0 rounded-md bg-white/80 dark:bg-white/10 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:text-gray-300 border border-black/5 dark:border-transparent">
                                                {challenge.market}
                                            </span>
                                            <h3 className="truncate text-sm font-semibold text-gray-950 dark:text-white">
                                                {challenge.title}
                                            </h3>
                                        </div>
                                        <span className="shrink-0 text-xs font-medium text-gray-500 dark:text-gray-400">
                                            Day {challenge.day}/{challenge.durationDays}
                                        </span>
                                    </div>

                                    <div className="mt-3">
                                        <div className="h-1.5 overflow-hidden rounded-full bg-gray-200/80 dark:bg-white/10">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-gray-200/70 dark:border-white/10 text-xs">
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Stake: <strong className="text-gray-900 dark:text-white font-semibold">{displayMoney(challenge.contributionUsd)}</strong>
                                            </span>
                                            <span className="text-gray-300 dark:text-gray-700">·</span>
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Today: <strong className={`font-semibold tabular-nums ${challenge.todayAllocatedProfitUsd >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                                                    {challenge.todayAllocatedProfitUsd >= 0 ? "+" : ""}{displayMoney(challenge.todayAllocatedProfitUsd)}
                                                </strong>
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                            <span className="inline-flex items-center gap-1 font-medium text-orange-500">
                                                <Flame size={13} />
                                                {challenge.streakDays}d
                                            </span>
                                            <span className={`inline-flex items-center gap-0.5 font-semibold tabular-nums ${challenge.streakPnlUsd >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                                                {challenge.streakPnlUsd >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                                                {challenge.streakPnlUsd >= 0 ? "+" : ""}{displayMoney(challenge.streakPnlUsd)}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Explore Ongoing Challenges CTA Section */}
            <section className="rounded-3xl border border-black/5 bg-gray-50/80 p-6 text-center dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                    <Compass size={24} />
                </div>
                <h3 className="mt-3 text-base font-semibold text-gray-950 dark:text-white sm:text-lg">
                    Looking for more opportunities?
                </h3>
                <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-gray-500 dark:text-gray-400 sm:text-sm">
                    Discover new expert pools and public trading challenges to expand your portfolio.
                </p>
                <div className="mt-5 flex justify-center">
                    <Link
                        href="/dashboard/challenges"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 sm:text-sm"
                    >
                        View ongoing challenges
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            {/* Comprehensive Streak & Challenge Detail Panel */}
            {selectedChallenge && (
                <div
                    className={`
                        fixed inset-0 z-40 overflow-y-auto overscroll-contain
                        bg-background text-foreground
                        lg:inset-y-0 lg:right-0
                        lg:left-[var(--dashboard-sidebar-width,440px)]
                        ${detailClosing
                        ? "animate-out slide-out-to-right fade-out duration-500 ease-in"
                        : "animate-in slide-in-from-right fade-in duration-500 ease-out"}
                        motion-reduce:animate-none
                    `}
                >
                    <section
                        key={selectedChallenge.id}
                        className="
                            relative flex min-h-full min-w-0 flex-col
                            bg-white dark:bg-[#12141A] text-foreground
                        "
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="challenge-detail-title"
                    >
                        <header className="flex justify-between lg:pr-55 shrink-0 items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8 border-b border-gray-100 dark:border-white/10">
                            <button
                                type="button"
                                onClick={closeDetail}
                                aria-label="Back to challenges"
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

                            <div className="lg:mr-8 flex items-center gap-2">
                                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                                    <span className="size-1.5 rounded-full bg-emerald-500" />
                                    Active Challenge
                                </span>

                                <button
                                    type="button"
                                    onClick={() => setStreakSummaryModalOpen(true)}
                                    aria-label="View streak summary overview"
                                    className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20"
                                >
                                    <Info size={16} />
                                </button>
                            </div>
                        </header>

                        <main className="min-w-0 flex-1 lg:pr-55 lg:pl-7">
                            <div className="w-full min-w-0 space-y-6 p-4 pb-8 sm:p-6 lg:p-8">
                                <section className="bg-gray-50 dark:bg-white/[0.04] p-5 rounded-2xl border border-gray-100 dark:border-white/10">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <span className="inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300 mb-1.5">
                                                {selectedChallenge.market} Strategy
                                            </span>
                                            <h2
                                                id="challenge-detail-title"
                                                className="text-xl font-bold text-gray-950 dark:text-white"
                                            >
                                                {selectedChallenge.title}
                                            </h2>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Hosted by <strong className="text-gray-700 dark:text-gray-300">{selectedChallenge.host}</strong> · Started {selectedChallenge.startedAt}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 pt-4 border-t border-gray-200/80 dark:border-white/10 grid grid-cols-3 gap-3 text-left">
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Your Allocation</p>
                                            <p className="mt-1 text-xl font-bold text-gray-950 dark:text-white tabular-nums">
                                                {displayMoney(selectedChallenge.contributionUsd)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Today's Profit</p>
                                            <p className={`mt-1 text-xl font-bold tabular-nums ${selectedChallenge.todayAllocatedProfitUsd >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                                                {selectedChallenge.todayAllocatedProfitUsd >= 0 ? "+" : ""}{displayMoney(selectedChallenge.todayAllocatedProfitUsd)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Net P&L</p>
                                            <p className={`mt-1 text-xl font-bold tabular-nums ${selectedChallenge.streakPnlUsd >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                                                {selectedChallenge.streakPnlUsd >= 0 ? "+" : ""}{displayMoney(selectedChallenge.streakPnlUsd)}
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <section className="grid grid-cols-2 gap-3">
                                    <div className="rounded-2xl border border-gray-200 p-4 dark:border-white/10 bg-gray-50 dark:bg-white/[0.04]">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                            <Users size={15} className="text-emerald-500" />
                                            <span>Participants</span>
                                        </div>
                                        <p className="mt-2 text-lg font-semibold tabular-nums text-gray-950 dark:text-white">
                                            {selectedChallenge.totalParticipants.toLocaleString()} Traders
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-gray-200 p-4 dark:border-white/10 bg-gray-50 dark:bg-white/[0.04]">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                            <ShieldCheck size={15} className="text-teal-500" />
                                            <span>Total Pool Vault</span>
                                        </div>
                                        <p className="mt-2 text-lg font-semibold tabular-nums text-gray-950 dark:text-white">
                                            {displayMoney(selectedChallenge.totalPoolVaultUsd)}
                                        </p>
                                    </div>
                                </section>

                                <section className="rounded-2xl border border-gray-200 p-4 dark:border-white/10 sm:p-5 bg-gray-50 dark:bg-white/[0.04] space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-950 dark:text-white flex items-center gap-2">
                                        <Flame size={17} className="text-orange-500" />
                                        Streak Performance Breakdown
                                    </h3>

                                    <div className="grid grid-cols-3 gap-3 pt-1 text-center">
                                        <div className="rounded-xl bg-white p-3 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active Streak</p>
                                            <p className="mt-1 text-base font-bold text-orange-500">{selectedChallenge.streakDays} Days</p>
                                        </div>
                                        <div className="rounded-xl bg-white p-3 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Win Rate</p>
                                            <p className="mt-1 text-base font-bold text-gray-900 dark:text-white">{selectedChallenge.streakWinRatePercent}%</p>
                                        </div>
                                        <div className="rounded-xl bg-white p-3 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trades Taken</p>
                                            <p className="mt-1 text-base font-bold text-gray-900 dark:text-white">{selectedChallenge.streakTradesCount}</p>
                                        </div>
                                    </div>
                                </section>

                                <section className="rounded-2xl border border-gray-200 p-4 dark:border-white/10 sm:p-5 bg-gray-50 dark:bg-white/[0.04] space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                            <Clock3 size={15} /> Timeline Progress
                                        </span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            Day {selectedChallenge.day} of {selectedChallenge.durationDays}
                                        </span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                                            style={{
                                                width: `${Math.min(100, Math.round((selectedChallenge.day / selectedChallenge.durationDays) * 100))}%`,
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 pt-1">
                                        <span>Started {selectedChallenge.startedAt}</span>
                                        <span>{selectedChallenge.daysLeft} days remaining</span>
                                    </div>
                                </section>
                            </div>
                        </main>
                    </section>
                </div>
            )}
        </div>
    );
}