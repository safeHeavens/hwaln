"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    BellCheck, BookText,
    Check,
    Search,
    ShieldCheck, Sparkles, SquareText,
    Trophy,
    Users,
    X,
} from "lucide-react";

type ChallengeStatus = "Active" | "Starting Soon" | "Completed";

type ChallengeTab = "overview" | "schedule" | "leaderboard";

type StreakDay = {
    day: number;
    targetRoiPercent: number;
    projectedBalanceUsd: number;
    status: "completed" | "in_progress" | "upcoming";
};

type ChallengeParticipant = {
    id: string;
    username: string;
    initials: string;
    startingCapitalUsd: number;
    currentBalanceUsd: number;
    currentRoiPercent: number;
    rank: number;
};

type ChallengeItem = {
    id: string;
    title: string;
    masterName: string;
    masterHandle: string;
    masterInitials: string;
    isVerifiedMaster: boolean;
    durationDays: number;
    currentDay: number;
    dailyTargetTurnoverPercent: number;
    minEntryUsd: number;
    poolSizeUsd: number;
    participantsCount: number;
    maxParticipants: number;
    status: ChallengeStatus;
    startDate: string;
    endDate: string;
    description: string;
    rules: string[];
    compoundingSchedule: StreakDay[];
    participantsList: ChallengeParticipant[];
};

const CHALLENGES_DATA: ChallengeItem[] = [
    {
        id: "challenge-10d-compound",
        title: "10-Day Profit Compounding Streak",
        masterName: "Alex 'Alpha' Vance",
        masterHandle: "@alpha_fx",
        masterInitials: "AV",
        isVerifiedMaster: true,
        durationDays: 10,
        currentDay: 3,
        dailyTargetTurnoverPercent: 20,
        minEntryUsd: 20,
        poolSizeUsd: 84_500,
        participantsCount: 342,
        maxParticipants: 500,
        status: "Active",
        startDate: "Oct 15, 2026",
        endDate: "Oct 25, 2026",
        description:
            "A high-velocity 10-day streak engineered to compound daily profits at a target 20% turnover rate per session. Designed for discipline and structured position Sizing.",
        rules: [
            "Minimum stake required: $20. Max allocation per user: $2,000.",
            "Execution signals are auto-copied via the quantitative FastAPI bridge.",
            "Stop Loss circuit breaker hard-set at 15% overall pool drawdown.",
            "Daily compounding calculations update at midnight UTC.",
        ],
        compoundingSchedule: Array.from({ length: 10 }, (_, i) => {
            const day = i + 1;
            const startAmount = 20;
            const projected = Math.round(startAmount * Math.pow(1.2, day));
            return {
                day,
                targetRoiPercent: 20,
                projectedBalanceUsd: projected,
                status: day < 3 ? "completed" : day === 3 ? "in_progress" : "upcoming",
            };
        }),
        participantsList: [
            {
                id: "p-1",
                username: "CryptoRunner_99",
                initials: "CR",
                startingCapitalUsd: 100,
                currentBalanceUsd: 172.8,
                currentRoiPercent: 72.8,
                rank: 1,
            },
            {
                id: "p-2",
                username: "SafeHavenDev",
                initials: "SH",
                startingCapitalUsd: 50,
                currentBalanceUsd: 86.4,
                currentRoiPercent: 72.8,
                rank: 2,
            },
            {
                id: "p-3",
                username: "TradeMaster_X",
                initials: "TM",
                startingCapitalUsd: 20,
                currentBalanceUsd: 34.5,
                currentRoiPercent: 72.5,
                rank: 3,
            },
        ],
    },
    {
        id: "challenge-7d-crypto-sprint",
        title: "7-Day Volatility Breakout Pool",
        masterName: "Macro Quantum",
        masterHandle: "@macro_quant",
        masterInitials: "MQ",
        isVerifiedMaster: true,
        durationDays: 7,
        currentDay: 1,
        dailyTargetTurnoverPercent: 15,
        minEntryUsd: 50,
        poolSizeUsd: 120_000,
        participantsCount: 890,
        maxParticipants: 1000,
        status: "Active",
        startDate: "Oct 18, 2026",
        endDate: "Oct 25, 2026",
        description:
            "Exploiting 7-day crypto market volatility cycles across BTC & ETH breakout channels with controlled risk parameters.",
        rules: [
            "Minimum stake: $50.",
            "Profit sharing model: 10% fee on net profits earned.",
            "Instant detachment available anytime.",
        ],
        compoundingSchedule: Array.from({ length: 7 }, (_, i) => {
            const day = i + 1;
            const startAmount = 50;
            const projected = Math.round(startAmount * Math.pow(1.15, day));
            return {
                day,
                targetRoiPercent: 15,
                projectedBalanceUsd: projected,
                status: day === 1 ? "in_progress" : "upcoming",
            };
        }),
        participantsList: [
            {
                id: "p-4",
                username: "AlphaTrader",
                initials: "AT",
                startingCapitalUsd: 500,
                currentBalanceUsd: 575,
                currentRoiPercent: 15.0,
                rank: 1,
            },
        ],
    },
];

export default function ChallengesPage() {

    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("All");

    // Detail Screen State
    const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
    const [detailClosing, setDetailClosing] = useState(false);
    const [activeTab, setActiveTab] = useState<ChallengeTab>("overview");

    // Join Pool Participation Screen State
    const [joinTargetChallengeId, setJoinTargetChallengeId] = useState<string | null>(null);
    const [stakeAmount, setStakeAmount] = useState<string>("50");
    const [joinClosing, setJoinClosing] = useState(false);

    // Toast Notice State
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const selectedChallenge =
        CHALLENGES_DATA.find((c) => c.id === selectedChallengeId) ?? null;

    const joinTargetChallenge =
        CHALLENGES_DATA.find((c) => c.id === joinTargetChallengeId) ?? null;

    const money = (amountUsd: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(amountUsd);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        window.setTimeout(() => setToastMessage(null), 3200);
    };

    const closeDetail = useCallback(() => {
        if (detailClosing) return;
        setDetailClosing(true);
        window.setTimeout(() => {
            setSelectedChallengeId(null);
            setDetailClosing(false);
            setActiveTab("overview");
        }, 480);
    }, [detailClosing]);

    const closeJoinScreen = useCallback(() => {
        if (joinClosing) return;
        setJoinClosing(true);
        window.setTimeout(() => {
            setJoinTargetChallengeId(null);
            setJoinClosing(false);
        }, 480);
    }, [joinClosing]);

    // Keyboard ESC Listener
    useEffect(() => {
        if (!selectedChallengeId && !joinTargetChallengeId) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                if (joinTargetChallengeId) closeJoinScreen();
                else if (selectedChallengeId) closeDetail();
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedChallengeId, joinTargetChallengeId, closeDetail, closeJoinScreen]);

    const filteredChallenges = CHALLENGES_DATA.filter((item) => {
        const matchesSearch =
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.masterName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
            selectedStatusFilter === "All" || item.status === selectedStatusFilter;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="home-content relative min-w-0 space-y-6 pb-8">
            {/* Notification Toast */}
            {toastMessage && (
                <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-2xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
                    <BellCheck size={18} />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Render Selected Challenge Detail View in same layout context */}
            {selectedChallenge ? (
                <section
                    className={`
                        min-w-0 lg:max-w-4xl fixed inset-0 z-[60]
                        flex flex-col
                        overflow-y-auto overscroll-contain
                        bg-white dark:bg-[#12141A]
                        p-4 pb-8 sm:p-6 lg:p-8 lg:left-[var(--dashboard-sidebar-width,440px)]
                        ${
                        detailClosing
                            ? "animate-out slide-out-to-right duration-[400ms] ease-in-out"
                            : "animate-in slide-in-from-right duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                        }
                    `}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="challenge-detail-title"
                >
                    {/* Header */}
                    <header className="flex items-center justify-between _border-b _border-gray-100 pb-4 dark:border-white/10">
                        <button
                            type="button"
                            onClick={closeDetail}
                            className="flex size-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 dark:text-white dark:hover:bg-white/10"
                        >
                            <ArrowLeft size={21} />
                        </button>
                        <h2 className="text-base font-bold text-gray-950 dark:text-white truncate max-w-[220px] sm:max-w-none">
                            {selectedChallenge.title}
                        </h2>
                        <div className="w-10" />
                    </header>

                    {/* Body */}
                    <div className="space-y-6">
                        {/* Master Summary Card */}
                        <div className="rounded-3xl bg-gray-50 p-5 dark:bg-white/[0.04] border border-gray-100 dark:border-white/10 space-y-4">
                            <div className="flex items-center gap-3.5">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 font-bold text-emerald-800 dark:from-emerald-400/20 dark:to-teal-400/10 dark:text-emerald-200">
                                    {selectedChallenge.masterInitials}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="font-bold text-gray-950 dark:text-white truncate">
                                            {selectedChallenge.masterName}
                                        </h3>
                                        {selectedChallenge.isVerifiedMaster && (
                                            <Check size={14} className="text-emerald-500 shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Host Trader · {selectedChallenge.masterHandle}
                                    </p>
                                </div>
                            </div>

                            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                                {selectedChallenge.description}
                            </p>

                            <div className="grid grid-cols-3 gap-2 text-center rounded-2xl bg-white p-3 dark:bg-white/5 border border-black/5 dark:border-transparent">
                                <div>
                                    <p className="text-[10px] uppercase font-medium text-gray-400">Total Pool</p>
                                    <p className="mt-0.5 text-sm font-bold text-gray-950 dark:text-white tabular-nums">
                                        {money(selectedChallenge.poolSizeUsd)}
                                    </p>
                                </div>
                                <div className="border-x border-gray-200 dark:border-white/10">
                                    <p className="text-[10px] uppercase font-medium text-gray-400">Daily Target</p>
                                    <p className="mt-0.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                                        +{selectedChallenge.dailyTargetTurnoverPercent}%
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-medium text-gray-400">Participants</p>
                                    <p className="mt-0.5 text-sm font-bold text-gray-950 dark:text-white tabular-nums">
                                        {selectedChallenge.participantsCount} / {selectedChallenge.maxParticipants}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center gap-1 border-b border-gray-200 dark:border-white/10">
                            {(["overview", "schedule", "leaderboard"] as ChallengeTab[]).map((tab) => (
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
                                    {tab === "schedule" ? "Compounding Plan" : tab}
                                </button>
                            ))}
                        </div>

                        {/* Tab 1: Rules & Details */}
                        {activeTab === "overview" && (
                            <div className="space-y-4 animate-in fade-in duration-200">
                                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/[0.04] space-y-3">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                        Challenge Execution Rules
                                    </h4>
                                    <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                                        {selectedChallenge.rules.map((rule, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                                                    {idx + 1}
                                                </span>
                                                <span>{rule}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Tab 2: Compounding Schedule */}
                        {activeTab === "schedule" && (
                            <div className="space-y-3 animate-in fade-in duration-200">
                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-medium pb-1">
                                    <span>Based on ${selectedChallenge.minEntryUsd} Min Stake</span>
                                    <span>Target: +{selectedChallenge.dailyTargetTurnoverPercent}% / Day</span>
                                </div>

                                <div className="divide-y divide-gray-200/70 dark:divide-white/10 rounded-2xl border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/[0.04] overflow-hidden">
                                    {selectedChallenge.compoundingSchedule.map((streak) => (
                                        <div
                                            key={streak.day}
                                            className="flex items-center justify-between p-3.5 text-xs transition hover:bg-gray-100/50 dark:hover:bg-white/5"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`flex size-7 items-center justify-center rounded-xl text-xs font-extrabold ${
                                                        streak.status === "completed"
                                                            ? "bg-emerald-500 text-white"
                                                            : streak.status === "in_progress"
                                                                ? "bg-amber-500 text-white animate-pulse"
                                                                : "bg-gray-200 text-gray-600 dark:bg-white/10 dark:text-gray-400"
                                                    }`}
                                                >
                                                    D{streak.day}
                                                </span>
                                                <div>
                                                    <p className="font-bold text-gray-950 dark:text-white">
                                                        Day {streak.day} Growth
                                                    </p>
                                                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                                        Target ROI: +{streak.targetRoiPercent}%
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                                                    ${streak.projectedBalanceUsd}
                                                </p>
                                                <span className="text-[10px] font-semibold text-gray-400 capitalize">
                                                    {streak.status.replace("_", " ")}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tab 3: Leaderboard */}
                        {activeTab === "leaderboard" && (
                            <div className="space-y-3 animate-in fade-in duration-200">
                                {selectedChallenge.participantsList.map((p) => (
                                    <div
                                        key={p.id}
                                        className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 p-3.5 dark:border-white/10 dark:bg-white/[0.04] text-xs"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className="font-extrabold text-amber-500 text-sm">
                                                #{p.rank}
                                            </span>
                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 font-bold text-emerald-800 dark:from-emerald-400/20 dark:to-teal-400/10 dark:text-emerald-200">
                                                {p.initials}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-gray-950 dark:text-white truncate">
                                                    {p.username}
                                                </p>
                                                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                                    Stake: ${p.startingCapitalUsd}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <p className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                                                ${p.currentBalanceUsd.toFixed(1)} (+{p.currentRoiPercent}%)
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Action Footer */}
                        <div className="pt-4 border-t border-gray-100 dark:border-white/10">
                            <button
                                type="button"
                                onClick={() => {
                                    setStakeAmount(String(selectedChallenge.minEntryUsd));
                                    setJoinTargetChallengeId(selectedChallenge.id);
                                }}
                                className="w-full rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-600/20 transition hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 active:scale-[0.99]"
                            >
                                Join Challenge Pool (Min ${selectedChallenge.minEntryUsd})
                            </button>
                        </div>
                    </div>
                </section>
            ) : (
                <>
                    {/* Banner Header */}
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div className="w-full">
                            <div className={"flex justify-between w-full"}>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white sm:text-3xl">
                                    Challenges
                                </h1>
                                <button
                                    type="button"
                                    aria-label="Learn about HWALN challenges with Avena"
                                    onClick={() => router.push("/dashboard/avena?manual=challenges")}
                                    className="flex size-8 items-center justify-center rounded-full hover:bg-gray-200"
                                >
                                    <BookText size={20} className="animate-pulsed" />
                                </button>
                            </div>

                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                                Follow expert-led plans and keep your streak going
                            </p>
                        </div>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
                        <div className="relative flex-1">
                            <Search
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                placeholder="Search challenges by title or trader..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-4xl border border-black/5 bg-[#f5f5f5] pl-10 pr-4 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:border-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-[#1A1D24] dark:text-white sm:text-sm"
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

                        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                            {["All", "Active", "Starting Soon", "Completed"].map((filter) => (
                                <button
                                    key={filter}
                                    type="button"
                                    onClick={() => setSelectedStatusFilter(filter)}
                                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition ${
                                        selectedStatusFilter === filter
                                            ? "bg-gray-600 text-white shadow-sm dark:bg-emerald-500"
                                            : "bg-[#f5f5f5] text-gray-600 hover:bg-gray-200 dark:bg-[#1A1D24] dark:text-gray-300 dark:hover:bg-[#222630]"
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Challenges Grid */}
                    {filteredChallenges.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-300 px-5 py-12 text-center dark:border-white/15">
                            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400">
                                <Trophy size={22} />
                            </div>
                            <h3 className="mt-4 font-semibold text-gray-950 dark:text-white">
                                No challenges found
                            </h3>
                            <p className="mx-auto mt-1 max-w-xs text-xs text-gray-500 dark:text-gray-400">
                                Try adjusting your search query or filter settings.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {filteredChallenges.map((challenge) => (
                                <div
                                    key={challenge.id}
                                    className="group flex flex-col justify-between rounded-2xl border border-black/5 bg-[#f5f5f5] p-5 transition-all hover:border-emerald-500/30 hover:shadow-md dark:border-white/10 dark:bg-[#1A1D24] dark:hover:bg-[#222630]"
                                >
                                    <div className="space-y-4">
                                        {/* Top Header: Trader & Status */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 font-bold text-emerald-800 dark:from-emerald-400/20 dark:to-teal-400/10 dark:text-emerald-200">
                                                    {challenge.masterInitials}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <h3 className="truncate text-sm font-bold text-gray-950 dark:text-white">
                                                            {challenge.masterName}
                                                        </h3>
                                                        {challenge.isVerifiedMaster && (
                                                            <Check size={14} className="text-emerald-500 shrink-0" />
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                                        {challenge.masterHandle}
                                                    </p>
                                                </div>
                                            </div>

                                            <span
                                                className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${
                                                    challenge.status === "Active"
                                                        ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400"
                                                        : "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400"
                                                }`}
                                            >
                                                <span className="size-1.5 rounded-full bg-current animate-pulse" />
                                                {challenge.status}
                                            </span>
                                        </div>

                                        {/* Challenge Title & Stats Grid */}
                                        <div
                                            onClick={() => setSelectedChallengeId(challenge.id)}
                                            className="cursor-pointer space-y-3"
                                        >
                                            <h2 className="text-base font-extrabold text-gray-950 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                {challenge.title}
                                            </h2>

                                            <div className="grid grid-cols-3 gap-2 rounded-xl bg-white p-3 text-center dark:bg-white/5 border border-black/5 dark:border-transparent">
                                                <div>
                                                    <p className="text-[10px] uppercase font-medium text-gray-400">Duration</p>
                                                    <p className="mt-0.5 text-xs font-bold text-gray-950 dark:text-white">
                                                        {challenge.durationDays} Days
                                                    </p>
                                                </div>
                                                <div className="border-x border-gray-200 dark:border-white/10">
                                                    <p className="text-[10px] uppercase font-medium text-gray-400">Daily Target</p>
                                                    <p className="mt-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                                        +{challenge.dailyTargetTurnoverPercent}%/day
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase font-medium text-gray-400">Min Entry</p>
                                                    <p className="mt-0.5 text-xs font-bold text-gray-950 dark:text-white">
                                                        ${challenge.minEntryUsd}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Progress Streak Indicator */}
                                            <div className="space-y-1.5 pt-1">
                                                <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                                                    <span>Streak Progress: Day {challenge.currentDay} of {challenge.durationDays}</span>
                                                    <span>{money(challenge.poolSizeUsd)} Pool</span>
                                                </div>
                                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
                                                    <div
                                                        className="h-full bg-emerald-500 transition-all duration-500"
                                                        style={{
                                                            width: `${(challenge.currentDay / challenge.durationDays) * 100}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Footer Actions - Single line layout */}
                                    <div className="mt-5 flex flex-row items-center justify-between gap-2 pt-3 border-t border-gray-200/70 dark:border-white/10">
                                        <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 shrink-0">
                                            <Users size={13} className="text-emerald-500" />
                                            <span>{challenge.participantsCount} Joined</span>
                                        </div>

                                        <div className="flex flex-row items-center gap-1.5 shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedChallengeId(challenge.id)}
                                                className="rounded-xl bg-gray-200/80 px-3 py-1.5 text-[11px] font-semibold text-gray-800 transition hover:bg-gray-300 dark:bg-white/10 dark:text-gray-200 dark:hover:bg-white/20 whitespace-nowrap"
                                            >
                                                View Schedule
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setStakeAmount(String(challenge.minEntryUsd));
                                                    setJoinTargetChallengeId(challenge.id);
                                                }}
                                                className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-[11px] font-bold text-white shadow-md transition hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 active:scale-[0.99] whitespace-nowrap"
                                            >
                                                Join Pool
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Join Challenge Stake Modal */}
            {joinTargetChallenge && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <section
                        key={joinTargetChallenge.id}
                        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#12141A] space-y-6 animate-in fade-in zoom-in-95 duration-200"
                        role="dialog"
                        aria-modal="true"
                    >
                        <header className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
                            <button
                                type="button"
                                onClick={closeJoinScreen}
                                className="flex size-9 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 dark:text-white dark:hover:bg-white/10"
                            >
                                <ArrowLeft size={18} />
                            </button>
                            <h2 className="text-base font-bold text-gray-950 dark:text-white">
                                Allocate Challenge Stake
                            </h2>
                            <div className="w-9" />
                        </header>

                        <div className="space-y-4">
                            <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/[0.04] border border-gray-100 dark:border-white/10 space-y-1">
                                <h3 className="font-bold text-gray-950 dark:text-white text-sm">
                                    {joinTargetChallenge.title}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Hosted by {joinTargetChallenge.masterName} · {joinTargetChallenge.durationDays} Days Streak
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Select Stake Amount (USD)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        value={stakeAmount}
                                        onChange={(e) => setStakeAmount(e.target.value)}
                                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-9 pr-4 py-3 text-base font-extrabold text-gray-950 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-[#1A1D24] dark:text-white"
                                        placeholder="Enter stake amount"
                                    />
                                </div>

                                <div className="flex items-center gap-2 pt-1">
                                    {["20", "50", "100", "500"].map((preset) => (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => setStakeAmount(preset)}
                                            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                                                stakeAmount === preset
                                                    ? "bg-emerald-600 text-white shadow-sm"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20"
                                            }`}
                                        >
                                            +${preset}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 text-xs text-gray-600 dark:text-gray-300">
                                <ShieldCheck size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                                <span>
                                    Your stake joins the collective challenge pool with automated risk management and transparent profit updates.
                                </span>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    showToast(`Joined ${joinTargetChallenge.title} with $${stakeAmount}!`);
                                    closeJoinScreen();
                                }}
                                className="w-full rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-600/20 transition hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 active:scale-[0.99]"
                            >
                                Confirm & Join Pool (${stakeAmount || "0"})
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}