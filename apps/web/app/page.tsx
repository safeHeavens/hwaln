
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    AnimatePresence,
    motion,
    useReducedMotion,
} from "framer-motion";
import {
    ArrowUpRight,
    Check,
    ShieldCheck,
    TrendingUp,
    Wallet,
} from "lucide-react";

const slides = [
    ["Discover Opportunities.", "Follow Experts. Stay in Control."],
    ["Move Money With Ease.", "Fund. Withdraw. Keep Moving."],
    ["Build Your Winning Streak.", "Stay Disciplined. Track Progress."],
];

const benefits = [
    "Discover expert-led strategies across forex and crypto",
    "Use AI-assisted insights to assess opportunities and risk",
    "Follow trading plans, track performance, and build consistency",
];

function Brand() {
    return (
        <Link
            href="/"
            aria-label="HWALN home"
            className="inline-flex items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#528847]"
        >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#34243d]/10 bg-white shadow-sm">
        <span className="text-xl font-black tracking-[-0.12em] text-[#34243d]">
          H<span className="text-[#528847]">.</span>
        </span>
      </span>

            <span className="text-lg font-bold tracking-[0.19em] text-[#34243d]">
        HWALN
      </span>
        </Link>
    );
}

function VisualCanvas() {
    const [active, setActive] = useState(0);
    const reduceMotion = useReducedMotion();

    useEffect(() => {
        if (reduceMotion) return;

        const timer = window.setInterval(() => {
            setActive((current) => (current + 1) % slides.length);
        }, 6000);

        return () => window.clearInterval(timer);
    }, [reduceMotion]);

    return (
        <div className="relative hidden h-full min-h-0 overflow-hidden rounded-xl border-l border-[#34243d]/10 bg-[#f0f1eb] lg:block">
            {/* Background grid */}
            <div className="hw-grid pointer-events-none absolute inset-0 opacity-60" />

            {/* Ambient light */}
            <div
                className="absolute -right-20 -top-28 h-[390px] w-[390px] rounded-full bg-emerald-300/30 blur-[90px]"
                style={{ animation: "hw-pulse 8s ease-in-out infinite" }}
            />

            <div
                className="absolute -bottom-24 -left-20 h-[350px] w-[350px] rounded-full bg-purple-300/25 blur-[100px]"
                style={{ animation: "hw-pulse 10s ease-in-out infinite reverse" }}
            />

            {/* Animated orbit illustration */}
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    aria-hidden="true"
                    className="absolute h-[min(390px,40vw)] w-[min(390px,40vw)] rounded-full border border-[#34243d]/10"
                    animate={reduceMotion ? undefined : { rotate: 360 }}
                    transition={{
                        duration: 55,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    <span className="absolute left-[18%] top-[9%] h-2 w-2 rounded-full bg-[#80bd58] shadow-[0_0_22px_rgba(128,189,88,0.55)]" />
                    <span className="absolute bottom-[17%] right-[5%] h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_18px_rgba(192,132,252,0.4)]" />
                </motion.div>

                <motion.div
                    aria-hidden="true"
                    className="absolute h-[min(290px,30vw)] w-[min(290px,30vw)] rounded-full border border-[#34243d]/10"
                    animate={reduceMotion ? undefined : { rotate: -360 }}
                    transition={{
                        duration: 38,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    <span className="absolute right-[12%] top-[15%] h-2 w-2 rounded-full bg-teal-500/80" />
                </motion.div>

                {/* Central animated symbol */}
                <motion.div
                    className="relative z-10 flex h-40 w-40 items-center justify-center rounded-full border border-emerald-700/10 bg-white/80 shadow-[0_0_100px_rgba(74,160,90,0.15)] backdrop-blur-sm sm:h-48 sm:w-48"
                    animate={reduceMotion ? undefined : { y: [0, -9, 0] }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <div className="absolute inset-3 rounded-full border border-[#34243d]/[0.06]" />

                    <div className="flex h-20 w-20 items-center justify-center rounded-[26px] border border-emerald-700/10 bg-gradient-to-br from-[#dff3d2] to-[#c6e8bd] shadow-sm sm:h-24 sm:w-24">
                        <TrendingUp
                            className="h-10 w-10 text-[#386d40] sm:h-12 sm:w-12"
                            strokeWidth={1.5}
                        />
                    </div>
                </motion.div>

                {/* Floating strategy card */}
                <motion.div
                    className="absolute left-[5%] top-[17%] rounded-2xl border border-[#34243d]/10 bg-white/90 p-3 shadow-[0_12px_35px_-18px_rgba(52,36,61,0.25)] backdrop-blur-xl xl:left-[8%] xl:p-4"
                    animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
                    transition={{
                        duration: 4.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <div className="flex items-center gap-2 text-xs text-[#777580]">
                        <span className="h-2 w-2 rounded-full bg-[#80bd58]" />
                        Strategy insights
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#34243d]">
                        <ShieldCheck className="h-4 w-4 text-[#528847]" />
                        Risk-aware tools
                    </div>
                </motion.div>

                {/* Floating portfolio card */}
                <motion.div
                    className="absolute bottom-[24%] right-[4%] rounded-2xl border border-[#34243d]/10 bg-white/90 p-3 shadow-[0_12px_35px_-18px_rgba(52,36,61,0.25)] backdrop-blur-xl xl:right-[7%] xl:p-4"
                    animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
                    transition={{
                        duration: 5.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <div className="flex items-center gap-2 text-xs text-[#777580]">
                        <Wallet className="h-4 w-4 text-teal-600" />
                        Portfolio tools
                    </div>

                    <div className="mt-2 text-sm font-semibold text-[#34243d]">
                        Your journey, organized
                    </div>
                </motion.div>
            </div>

            {/* Rotating headline */}
            <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#f0f1eb] via-[#f0f1eb]/95 to-transparent px-6 pb-10 pt-28 sm:px-8 xl:px-12">
                <div className="min-h-[82px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active}
                            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                            transition={{ duration: 0.45, ease: "easeOut" }}
                            className="text-left"
                        >
                            <p className="text-[clamp(23px,2.3vw,34px)] font-semibold leading-[1.12] tracking-[-0.045em] text-[#34243d]">
                                {slides[active][0]}
                            </p>

                            <p className="text-[clamp(23px,2.3vw,34px)] font-semibold leading-[1.12] tracking-[-0.045em] text-[#34243d]">
                                {slides[active][1]}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function WelcomeContent() {

    return(
        <>
            <header className="mb-20 lg:mb-10 lg:mt-0 mt-8 lg:py-0">
                <Brand />
            </header>
            <section className="flex flex-col gap-3 ">
                <h1 className="max-w-[560px] text-[clamp(42px,5.2vw,68px)] font-semibold leading-[1.02] tracking-[-0.065em] text-[#28212f]">
                    Trade with purpose,
                    <span className="mt-1 block text-[#528847]">
                      not guesswork.
                    </span>
                </h1>

                <ul className="mt-8 mb-5 space-y-4">
                    {benefits.map((benefit) => (
                        <li
                            key={benefit}
                            className="flex items-start gap-3 text-sm text-[#494451] sm:text-[15px]"
                        >
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[#528847] bg-transparent _bg-[#e8f4e2] text-[#386d40]">
                                  <Check className="h-2.5 w-2.5" strokeWidth={4.5} />
                                </span>

                            <span className="leading-6">{benefit}</span>
                        </li>
                    ))}
                </ul>

                {/* CTA buttons */}
                <div className="mt-9 flex flex-wrap items-center gap-3">
                    <button

                        className="bg-[#528847] hover:bg-[#28212f] text-gray-100 text-center font-medium px-3 py-3 w-[100px] rounded-xl transition"
                    >
                        Log In
                    </button>
                    <button
                        className="bg-transparent hover:opacity-[0.5] border border-[#28212f] dark:border-[#f5f5f5] text-[#28212f] dark:text-[#f5f5f5] text-center font-medium px-3 py-3 w-[100px] rounded-xl
                        hover:bg-[4A3E57] transition
                        "
                    >
                        Sign Up
                    </button>
                </div>

            </section>
        </>
    );
}

export default function WelcomePage() {
    return (
        <main className="hw-background_ relative min-h-screen p-2 lg:px-20 lg:py-8 overflow-x-hidden lg:grid lg:h-screen lg:min-h-[640px] lg:grid-cols-[1.12fr_1.12fr]">

            {/* Left column: full-height animation */}
            <VisualCanvas />

            {/* Right column: header, welcome content, and footer */}
            <div className="relative flex min-h-screen flex-col px-5 sm:px-8 lg:min-h-0 lg:px-10 xl:px-14 2xl:px-16">
                <div className="hw-grid pointer-events-none absolute inset-0 opacity-70" />

                {/* Welcome content */}
                <WelcomeContent />

            </div>


        </main>
    );
}
