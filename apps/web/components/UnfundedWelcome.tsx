"use client";

import { ArrowRight, Plus } from "lucide-react";

type UnfundedWelcomeProps = {
    onAddFunds: () => void;
};

function WalletGraffiti() {
    return (
        <div
            aria-hidden="true"
            className="relative mx-auto aspect-square w-full max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[210px]"
        >
            {/* Ambient glow */}
            <div className="absolute inset-[18%] rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-400/15" />

            <svg
                viewBox="0 0 320 300"
                fill="none"
                className="absolute inset-0 h-full w-full overflow-visible"
            >
                {/* Orbit */}
                <ellipse
                    cx="160"
                    cy="155"
                    rx="125"
                    ry="85"
                    stroke="url(#orbit)"
                    strokeWidth="2"
                    strokeDasharray="7 9"
                    className="origin-center animate-[spin_24s_linear_infinite]"
                />

                <defs>
                    <linearGradient
                        id="orbit"
                        x1="30"
                        y1="50"
                        x2="280"
                        y2="250"
                    >
                        <stop stopColor="#34D399" />
                        <stop offset="1" stopColor="#A78BFA" />
                    </linearGradient>
                </defs>

                {/* Graffiti crown */}
                <path
                    d="M62 76 L54 42 L77 60 L92 27 L106 63 L129 43 L123 79"
                    stroke="#34D399"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-[bounce_4s_ease-in-out_infinite] mt-4"
                />

                {/* Sparkles */}
                <path
                    d="M256 74 L262 89 L277 95 L262 101 L256 116 L250 101 L235 95 L250 89 Z"
                    fill="#A78BFA"
                    className="animate-pulse"
                />

                <path
                    d="M50 192 L54 202 L64 206 L54 210 L50 220 L46 210 L36 206 L46 202 Z"
                    fill="#34D399"
                    className="animate-pulse"
                />

                {/* Floating HWALN coin */}
                <g className="animate-[bounce_3.5s_ease-in-out_infinite]">
                    <circle
                        cx="252"
                        cy="151"
                        r="25"
                        fill="#8B5CF6"
                        fillOpacity=".2"
                    />

                    <circle cx="252" cy="146" r="21" fill="#8B5CF6" />

                    <circle
                        cx="252"
                        cy="146"
                        r="21"
                        stroke="#C4B5FD"
                        strokeWidth="2"
                    />

                    <text
                        x="252"
                        y="153"
                        textAnchor="middle"
                        fontSize="19"
                        fontWeight="700"
                        fill="white"
                    >
                        H
                    </text>
                </g>

                {/* Hand-drawn arrow */}
                <path
                    d="M225 245 Q254 230 271 207 M271 207 L267 224 M271 207 L254 211"
                    stroke="#A78BFA"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-pulse"
                />
            </svg>

            {/* Wallet */}
            <div className="absolute left-1/2 top-1/2 w-[65%] -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] animate-float">
                <div className="rounded-[20px] border border-white/25 bg-slate-950/40 p-1.5 shadow-2xl shadow-black/20 backdrop-blur-md dark:border-white/10 dark:bg-slate-800/70 sm:rounded-[22px] sm:p-2">
                    <div className="relative flex aspect-[1.15/1] items-center justify-center overflow-hidden rounded-[15px] bg-gradient-to-br from-emerald-400 via-teal-600 to-violet-700 sm:rounded-[18px]">
                        <div className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/30 blur-xl" />

                        <div className="absolute -bottom-8 -left-5 h-24 w-24 rounded-full bg-violet-300/60 blur-xl" />

                        <span className="relative text-5xl font-black tracking-tighter text-white sm:text-6xl">
              H
            </span>

                        <div className="absolute right-0 top-1/2 h-8 w-5 -translate-y-1/2 rounded-l-lg border border-white/60 bg-white/30 backdrop-blur-sm sm:h-10 sm:w-6" />
                    </div>
                </div>
            </div>

            {/* Floating dollar coin */}
            <div className="absolute left-[10%] top-[25%] flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-gradient-to-br from-emerald-400 to-teal-600 text-base font-bold text-white shadow-lg shadow-black/20 sm:h-10 sm:w-10 sm:text-lg">
                $
            </div>

            {/* Floating accent */}
            <div className="absolute bottom-[18%] left-[22%] h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
        </div>
    );
}

export default function UnfundedWelcome({
                                            onAddFunds,
                                        }: UnfundedWelcomeProps) {
    return (
        <section
            className="
        relative isolate overflow-hidden rounded-2xl
        border border-white/10
        bg-gradient-to-br from-[#102F2B] via-[#14272D] to-[#282044]
        p-4 shadow-xl shadow-slate-950/10
        sm:rounded-3xl sm:p-5
        md:px-6 md:py-3
        lg:px-7 lg:py-3
        dark:border-white/[0.08]
        dark:from-slate-950 dark:via-[#102C29] dark:to-[#211735]
        dark:shadow-black/20
      "
        >
            {/* Ambient lighting */}
            <div className="pointer-events-none absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl dark:bg-emerald-400/20" />

            <div className="pointer-events-none absolute -bottom-24 left-1/3 -z-10 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl dark:bg-violet-500/15" />

            <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-black/10 via-transparent to-white/[0.02]" />

            <div className="grid items-center gap-1 sm:gap-2 md:grid-cols-[1.2fr_0.8fr] lg:gap-3">
                {/* Illustration */}
                <div className="order-1 mx-auto w-full max-w-[150px] sm:max-w-[170px] md:order-2 md:max-w-[190px] lg:max-w-[220px]">
                    <WalletGraffiti />
                </div>

                {/* Welcome content */}
                <div className="relative z-10 order-2 min-w-0 md:order-1 text-center lg:text-left">
                    <h2 className="text-2xl font-bold leading-[1.08] tracking-tight text-white sm:text-3xl lg:text-4xl">
                        Welcome to
                        <span className="ml-1 sm:ml-0 inline mt-1 sm:block bg-gradient-to-r from-emerald-300 via-teal-300 to-violet-300 bg-clip-text text-transparent">
              HWALN.
            </span>
                    </h2>

                    <p className="mt-2 mb-2 max-w-md text-sm text-center lg:text-left leading-5 text-slate-300 sm:mt-3 sm:text-base sm:leading-6">
                        Fund your wallet to start trading with experts.
                    </p>

                    <button
                        type="button"
                        onClick={onAddFunds}
                        className="
              group mt-3 inline-flex min-h-11 max-w-3xl items-center gap-2
              rounded-xl border border-white/10
              bg-emerald-400 px-6 py-2.5
              text-sm font-semibold text-slate-950
              shadow-lg shadow-emerald-950/20
              transition duration-200
              hover:-translate-y-0.5 hover:bg-emerald-300
              focus-visible:outline-none
              focus-visible:ring-4 focus-visible:ring-emerald-400/40
              active:translate-y-0
              sm:mt-4 sm:min-h-12 sm:rounded-2xl sm:px-6
              dark:border-emerald-300/20
              dark:bg-emerald-400 dark:hover:bg-emerald-300
            "
                    >
                        <Plus size={18} strokeWidth={2.5} className={"hidden sm:block"} />
                        Add funds
                        <ArrowRight
                            size={17}
                            className="hidden ml-1 transition-transform group-hover:translate-x-1"
                        />
                    </button>
                    {/*
                    <p className="mt-2 text-xs leading-5 text-slate-400">
                        You stay in control of your funds and copying choices.
                    </p>
                    */}
                </div>
            </div>
        </section>
    );
}