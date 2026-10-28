
"use client";

import Link from "next/link";
import {
    ArrowUpRight,
    ShieldCheck,
    TrendingUp,
    Wallet,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import {
    AnimatePresence,
    motion,
    useReducedMotion,
} from "framer-motion";

const slides = [
    {
        title: "Discover opportunities.",
        subtitle: "Follow experts. Stay in control.",
        number: "01",
    },
    {
        title: "Move money with ease.",
        subtitle: "Fund. Withdraw. Keep moving.",
        number: "02",
    },
    {
        title: "Build your winning streak.",
        subtitle: "Stay disciplined. Track progress.",
        number: "03",
    },
];

const benefits = [
    "Explore expert-led forex and crypto strategies",
    "Use AI-assisted insights to assess opportunities and risk",
    "Track performance and build consistent habits",
];

function Brand() {
    return (
        <Link
            href="/"
            aria-label="HWALN home"
            className="group inline-flex w-fit items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#528847]"
        >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#34243d]/10 bg-white shadow-sm transition-transform duration-200 group-hover:scale-[1.04]">
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
        <section
            aria-label="Discover HWALN"
            className="relative hidden min-h-0 overflow-hidden border-l border-[#34243d]/10 bg-[#f0f1eb] lg:block"
        >
            {/* Background */}
            <div
                aria-hidden="true"
                className="hw-grid pointer-events-none absolute inset-0 opacity-60"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-28 h-[390px] w-[390px] rounded-full bg-emerald-300/30 blur-[90px]"
                style={{
                    animation: reduceMotion
                        ? "none"
                        : "hw-pulse 8s ease-in-out infinite",
                }}
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 -left-20 h-[350px] w-[350px] rounded-full bg-purple-300/25 blur-[100px]"
                style={{
                    animation: reduceMotion
                        ? "none"
                        : "hw-pulse 10s ease-in-out infinite reverse",
                }}
            />

            {/* Main illustration */}
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    aria-hidden="true"
                    className="absolute h-[min(390px,32vw)] w-[min(390px,32vw)] rounded-full border border-[#34243d]/10"
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
                    className="absolute h-[min(290px,24vw)] w-[min(290px,24vw)] rounded-full border border-[#34243d]/10"
                    animate={reduceMotion ? undefined : { rotate: -360 }}
                    transition={{
                        duration: 38,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    <span className="absolute right-[12%] top-[15%] h-2 w-2 rounded-full bg-teal-500/80" />
                </motion.div>

                {/* Center symbol */}
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
                            aria-hidden="true"
                        />
                    </div>
                </motion.div>

                {/* Strategy insight card */}
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
                        <ShieldCheck
                            className="h-4 w-4 text-[#528847]"
                            aria-hidden="true"
                        />
                        Risk-aware tools
                    </div>
                </motion.div>

                {/* Portfolio card */}
                <motion.div
                    className="absolute bottom-[29%] right-[4%] rounded-2xl border border-[#34243d]/10 bg-white/90 p-3 shadow-[0_12px_35px_-18px_rgba(52,36,61,0.25)] backdrop-blur-xl xl:right-[7%] xl:p-4"
                    animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
                    transition={{
                        duration: 5.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <div className="flex items-center gap-2 text-xs text-[#777580]">
                        <Wallet
                            className="h-4 w-4 text-teal-600"
                            aria-hidden="true"
                        />
                        Portfolio tools
                    </div>

                    <div className="mt-2 text-sm font-semibold text-[#34243d]">
                        Your journey, organized
                    </div>
                </motion.div>
            </div>

            {/* Rotating message */}
            <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#f0f1eb] via-[#f0f1eb]/95 to-transparent px-8 pb-10 pt-32 xl:px-12 xl:pb-12">

                <div className="min-h-[100px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active}
                            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <h2 className="max-w-xl text-[clamp(25px,2.5vw,38px)] font-semibold leading-[1.12] tracking-[-0.045em] text-[#34243d]">
                                {slides[active].title}
                            </h2>

                            <h2 className="mt-2 max-w-xl text-[clamp(25px,2.5vw,38px)] font-semibold leading-[1.12] tracking-[-0.045em] text-[#34243d]">
                                {slides[active].subtitle}
                            </h2>
                        </motion.div>
                    </AnimatePresence>
                </div>
                <div className="mt-5 flex items-center gap-2">
                    {slides.map((slide, index) => (
                        <button
                            key={slide.number}
                            type="button"
                            aria-label={`Show introduction ${index + 1}`}
                            aria-pressed={active === index}
                            onClick={() => setActive(index)}
                            className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#528847] ${
                                active === index
                                    ? "w-18 bg-[#528847]"
                                    : "w-10 bg-[#34243d]/20 hover:bg-[#34243d]/40"
                            }`}
                        />
                    ))}
                    {/*
                    <span className="ml-auto text-xs font-medium tracking-[0.16em] text-[#777580]">
                        {slides[active].number} / 03
                      </span>
                      */}
                </div>

                <p className="hidden mt-5 max-w-lg text-sm leading-6 text-[#777580]">
                    A clearer way to explore expert-led strategies, understand risk, and
                    follow your trading journey.
                </p>
            </div>
        </section>
    );
}

export default function AuthLayout({
                                       children,
                                   }: Readonly<{ children: ReactNode }>) {
    return (
        <main className="hw-background relative min-h-screen overflow-x-hidden lg:grid lg:h-screen lg:min-h-[640px] lg:grid-cols-[0.92fr_1.08fr]">
            {/* Left: animated brand experience */}
            <VisualCanvas />

            {/* Left: authentication */}
            <section className="relative z-10 flex min-h-screen flex-col bg-transparent px-5 py-6 sm:px-10 sm:py-8 lg:min-h-0 lg:overflow-y-auto lg:px-12 xl:px-20">
                <header className="flex lg:hidden w-full items-center justify-between">
                    <Brand />
                </header>

                <div className="h-full flex flex-1 items-center justify-center py-10 _sm:py-14 _lg:py-12">
                    <div className="w-full h-full max-w-[480px]">
                        {children}
                    </div>
                </div>

            </section>

        </main>
    );
}
