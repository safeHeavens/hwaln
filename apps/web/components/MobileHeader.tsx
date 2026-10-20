
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Inbox, Search, Sparkles } from "lucide-react";
import { useDashboard } from "@/Context/DashboardContext";

interface UserProfileData {
    firstName: string;
    lastName: string;
    avatarUrl?: string | null;
}

interface MobileHeaderProps {
    user?: UserProfileData;
}

// Change to "greeting" to restore the original greeting.
const HEADER_MODE: "avena" | "greeting" = "avena";

// Update this if your Avena AI page uses a different route.
const AVENA_ROUTE = "/dashboard/avena";

export function MobileHeader({
                                 user = {
                                     firstName: "Samson",
                                     lastName: "Belario",
                                     avatarUrl: null,
                                 },
                             }: MobileHeaderProps) {
    const { setPanel } = useDashboard();
    const [greeting, setGreeting] = useState("Good day");

    // Dynamic greeting functionality — preserved for later use.
    useEffect(() => {
        const updateGreeting = () => {
            const hour = new Date().getHours();

            if (hour >= 5 && hour < 12) {
                setGreeting("Good morning");
            } else if (hour >= 12 && hour < 17) {
                setGreeting("Good afternoon");
            } else if (hour >= 17 && hour < 22) {
                setGreeting("Good evening");
            } else {
                setGreeting("Good night");
            }
        };

        updateGreeting();

        const interval = setInterval(updateGreeting, 60000);

        return () => clearInterval(interval);
    }, []);

    // Generate user initials for the avatar fallback.
    const getInitials = (first: string, last: string) => {
        const f = first?.trim().charAt(0) || "";
        const l = last?.trim().charAt(0) || "";

        return `${f}${l}`.toUpperCase() || "U";
    };

    const initials = getInitials(user.firstName, user.lastName);

    return (
        <header className="mobile-headerd right-0 z-10 flex items-center justify-between gap-3 px-4 py-3 md:hidden">
            {/* User Avatar */}
            <Link
                href="/dashboard/profile"
                className="group relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 font-extrabold text-white shadow-md shadow-emerald-500/20 ring-2 ring-emerald-500/20 transition active:scale-95"
                aria-label="Go to profile page"
            >
                {user.avatarUrl ? (
                    <Image
                        src={user.avatarUrl}
                        alt={`${user.firstName} ${user.lastName}`}
                        fill
                        sizes="36px"
                        className="object-cover"
                    />
                ) : (
                    <span className="text-xs font-black tracking-wider">
                        {initials}
                    </span>
                )}
            </Link>

            {/* Search-style Avena button or original greeting */}
            {HEADER_MODE === "greeting" ? (
                <div className="flex min-w-0 flex-1 flex-col">
                    <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                        {greeting},
                    </span>

                    <strong className="truncate text-sm font-extrabold text-gray-950 dark:text-white">
                        {user.firstName}
                    </strong>
                </div>
            ) : (
                <Link
                    href={AVENA_ROUTE}
                    aria-label="Ask Avena, HWALN's AI assistant"
                    className="flex min-w-0 items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2.5 transition hover:border-emerald-500/40 hover:bg-gray-100 active:scale-[0.99] dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.07]"
                >
                    <Search
                        size={17}
                        strokeWidth={2}
                        className="shrink-0 text-gray-500 dark:text-gray-400"
                    />

                    <span className="truncate text-sm text-gray-500 dark:text-gray-400">
                        Ask Avena ...
                    </span>

                    <Sparkles
                        size={15}
                        strokeWidth={2}
                        className="ml-auto shrink-0 text-emerald-500"
                    />
                </Link>
            )}

            {/* Notifications */}
            <button
                type="button"
                className="icon-buttonw relative flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition hover:text-gray-950 active:scale-95 dark:bg-white/5 dark:text-gray-300 dark:hover:text-white"
                aria-label="Open notifications"
                onClick={() => setPanel("notifications")}
            >
                <Inbox size={19} />

                <span className="absolute right-2 top-2 size-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0D0F14]" />
            </button>
        </header>
    );
}
