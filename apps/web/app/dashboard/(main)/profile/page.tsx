"use client";

import { useState } from "react";
import Link from "next/link";
import {
    BadgeCheck,
    Bell,
    ChevronRight,
    CircleHelp,
    CreditCard,
    FileText,
    KeyRound,
    LifeBuoy,
    Lock,
    LogOut,
    Mail,
    Moon,
    Shield,
    ShieldCheck,
    SlidersHorizontal,
    User,
    UserCheck,
    Wallet,
    Globe2,
    UserRoundX,
} from "lucide-react";

type ProfileNavItem = {
    id: string;
    label: string;
    description?: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
    badgeVariant?: "emerald" | "amber" | "gray";
};

type ProfileSection = {
    sectionTitle: string;
    items: ProfileNavItem[];
};

export default function ProfilePage() {
    const [user] = useState({
        fullName: "Samson Belario",
        username: "@samsonbe",
        email: "belariosammy@gmail.com",
        initials: "SB",
        isKycVerified: false,
        hasSubmittedKyc: false, // Set to true only when user has submitted and is waiting for review
        accountTier: "Tier 2 Verified",
        joinedDate: "Member since Nov 2025",
    });

    const PROFILE_SECTIONS: ProfileSection[] = [
        {
            sectionTitle: "About You",
            items: [
                {
                    id: "personal-info",
                    label: "Personal details",
                    description: "Full name, contact email, and phone verification",
                    href: "/dashboard/profile/personal-info",
                    icon: User,
                },
                {
                    id: "account-overview",
                    label: "Home address",
                    description: "",
                    href: "/dashboard/profile/account-details",
                    icon: FileText,
                },
            ],
        },
        {
            sectionTitle: "Verification",
            items: [
                {
                    id: "kyc-verification",
                    label: "Proof of identity",
                    description: "Verification needed",
                    href: "/dashboard/profile/kyc",
                    icon: ShieldCheck,
                    badge: user.isKycVerified ? "Verified" : user.hasSubmittedKyc ? "Pending" : undefined,
                    badgeVariant: user.isKycVerified ? "emerald" : "amber",
                },
                {
                    id: "address-verification",
                    label: "Proof of address",
                    description: "Verify current home address",
                    href: "/dashboard/profile/kyc",
                    icon: ShieldCheck,
                    badge: user.isKycVerified ? "Verified" : user.hasSubmittedKyc ? "Pending" : undefined,
                    badgeVariant: user.isKycVerified ? "emerald" : "amber",
                },
            ],
        },
        {
            sectionTitle: "Security",
            items: [
                {
                    id: "security-settings",
                    label: "Change password",
                    description: "Change password ",
                    href: "/dashboard/profile/security",
                    icon: KeyRound,
                },
                {
                    id: "mobile-number",
                    label: "Phone number",
                    description: "Not added",
                    href: "/dashboard/profile/sessions",
                    icon: Lock,
                },
                {
                    id: "two-factor-auth",
                    label: "Two-factor authentication",
                    description: "Not added",
                    href: "/dashboard/profile/2fa",
                    icon: Lock,
                },
                {
                    id: "close-account",
                    label: "Close account",
                    description: "",
                    href: "/dashboard/profile/close-account",
                    icon: UserRoundX,
                },
            ],
        },
        {
            sectionTitle: "Preferences",
            items: [
                {
                    id: "language",
                    label: "Language",
                    description: "",
                    href: "/dashboard/profile/language-preference",
                    icon: Globe2,
                },
                {
                    id: "app-appearance",
                    label: "Display & Theme",
                    description: "Dark mode preferences",
                    href: "/dashboard/profile/appearance",
                    icon: Moon,
                },
            ],
        },
        {
            sectionTitle: "Support",
            items: [
                {
                    id: "help-center",
                    label: "Help Center & FAQs",
                    description: "Guides on challenges, pools, and API bridge setup",
                    href: "/help-center",
                    icon: CircleHelp,
                },
                {
                    id: "live-chat",
                    label: "Live chat",
                    description: "",
                    href: "/dashboard/support",
                    icon: LifeBuoy,
                },
            ],
        },
    ];

    return (
        <div className="home-content relative min-w-0 space-y-8 pb-12">
            {/* Centered Top Avatar & User Info Card */}
            <section className="relative overflow-hidden rounded-3xl border border-black/5 bg-gradient-to-b from-emerald-500/10 via-[#f5f5f5] to-[#f5f5f5] p-6 text-center dark:border-white/10 dark:from-emerald-500/10 dark:via-[#1A1D24] dark:to-[#1A1D24] sm:p-8">
                <div className="mx-auto flex flex-col items-center">
                    {/* Avatar Container */}
                    <div className="relative mb-4">
                        <div className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-2xl font-extrabold text-white shadow-xl shadow-emerald-600/20 ring-4 ring-white dark:ring-[#1A1D24]">
                            {user.initials}
                        </div>
                        {user.isKycVerified && (
                            <span
                                title="Verified Account"
                                className="absolute bottom-1 right-1 flex size-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ring-2 ring-white dark:ring-[#1A1D24]"
                            >
                                <BadgeCheck size={16} />
                            </span>
                        )}
                    </div>

                    {/* User Full Name & Username */}
                    <h1 className="text-xl font-extrabold text-gray-950 dark:text-white sm:text-2xl">
                        {user.fullName}
                    </h1>
                    <p className="mt-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 sm:text-sm">
                        {user.username}
                    </p>

                    {/* Account Metadata Tags */}
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
                        <span className="hidden items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                            <ShieldCheck size={13} />
                            {user.accountTier}
                        </span>
                        <span className="rounded-full bg-gray-200/80 px-3 py-1 font-medium text-gray-600 dark:bg-white/10 dark:text-gray-300">
                            {user.email}
                        </span>
                        <span className="rounded-full bg-gray-200/80 px-3 py-1 font-medium text-gray-500 dark:bg-white/10 dark:text-gray-400">
                            {user.joinedDate}
                        </span>
                    </div>
                </div>
            </section>

            {/* Profile Navigation Sections */}
            <div className="space-y-6">
                {PROFILE_SECTIONS.map((section) => (
                    <section key={section.sectionTitle} className="space-y-2">
                        <h2 className="px-1 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                            {section.sectionTitle}
                        </h2>

                        <div className="divide-y divide-gray-200/60 overflow-hidden rounded-2xl border border-black/5 bg-[#f5f5f5] dark:divide-white/5 dark:border-white/10 dark:bg-[#1A1D24]">
                            {section.items.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className="group flex items-center justify-between p-4 transition-colors hover:bg-gray-200/60 dark:hover:bg-white/5"
                                    >
                                        <div className="flex items-center gap-3.5 min-w-0 pr-2">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-transparent text-gray-700 -shadow-sm transition-colors group-hover:text-gray-500 dark:bg-white/5 dark:text-gray-300 dark:group-hover:bg-emerald-500 dark:group-hover:text-gray-300">
                                                <IconComponent size={19} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="truncate text-sm font-bold text-gray-950 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-400">
                                                        {item.label}
                                                    </p>
                                                    {item.badge && (
                                                        <span
                                                            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                                                                item.badgeVariant === "emerald"
                                                                    ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400"
                                                                    : "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400"
                                                            }`}
                                                        >
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                {item.description && (
                                                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <ChevronRight
                                            size={18}
                                            className="shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 dark:text-gray-500"
                                        />
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>

            {/* Logout CTA Button */}
            <div className="pt-2">
                <button
                    type="button"
                    onClick={() => {
                        if (typeof window !== "undefined") {
                            window.location.href = "/login";
                        }
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 py-3.5 text-xs font-bold text-red-600 transition hover:bg-red-500 hover:text-white dark:bg-red-500/15 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white active:scale-[0.99]"
                >
                    <LogOut size={16} />
                    <span>Log Out of Account</span>
                </button>
            </div>
        </div>
    );
}