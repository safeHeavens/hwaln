'use client';

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
    UserRound,
    ShieldCheck,
    Wallet,
    Settings,
    Headphones,
    LockKeyhole,
    LogOut,
    ChevronRight,
    X,
} from "lucide-react";
import Link from "next/link";
import { Panel } from "@/types/home";

interface ProfileDrawerProps {
    panel: Panel;
    setPanel: (panel: Panel) => void;
}

export function ProfileDrawer({ panel, setPanel }: ProfileDrawerProps) {
    const [mounted, setMounted] = useState(false);
    const isOpen = panel === "profile";

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed min-w-screen inset-0 z-[99999] flex md:hidden">
            {/* Full-Screen Mobile Drawer Panel with Smooth Scale/Fade-In */}
            <aside
                aria-label="Profile navigation menu"
                className="relative flex w-screen h-screen flex-col justify-between bg-white dark:bg-[#13161D] p-6 shadow-2xl overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
            >
                {/* Top Section */}
                <div>
                    {/* Header with Brand & Close Button */}
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4">
                        <div className="flex items-center gap-2.5">
                            <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-500 font-black text-white shadow-sm">
                                H
                            </span>
                            <span className="font-bold tracking-tight text-gray-950 dark:text-white">
                                HWALN
                            </span>
                        </div>
                        <button
                            type="button"
                            className="flex size-10 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition active:scale-95"
                            aria-label="Close profile menu"
                            onClick={() => setPanel(null)}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* User Profile Card */}
                    <div className="my-6 flex items-center gap-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] p-4 border border-gray-100 dark:border-white/5">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 font-bold text-emerald-600 dark:text-emerald-400 text-lg">
                            S
                        </div>
                        <div className="flex flex-col">
                            <strong className="text-base font-bold text-gray-950 dark:text-white">
                                Shekinah
                            </strong>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                Personal account
                            </span>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-6">
                        <div>
                            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                Your Account
                            </p>
                            <div className="space-y-1.5">
                                <DrawerItem
                                    href="/dashboard/profile"
                                    icon={<UserRound size={19} />}
                                    label="Personal details"
                                    onClick={() => setPanel(null)}
                                />
                                <DrawerItem
                                    href="/dashboard/security"
                                    icon={<ShieldCheck size={19} />}
                                    label="Verification & security"
                                    onClick={() => setPanel(null)}
                                />
                                <DrawerItem
                                    href="/dashboard/deposit"
                                    icon={<Wallet size={19} />}
                                    label="Funding & withdrawals"
                                    onClick={() => setPanel(null)}
                                />
                                <DrawerItem
                                    href="/dashboard/settings"
                                    icon={<Settings size={19} />}
                                    label="Settings"
                                    onClick={() => setPanel(null)}
                                />
                            </div>
                        </div>

                        <div>
                            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                Support
                            </p>
                            <div className="space-y-1.5">
                                <DrawerItem
                                    href="/dashboard/support"
                                    icon={<Headphones size={19} />}
                                    label="Help & support"
                                    onClick={() => setPanel(null)}
                                />
                                <DrawerItem
                                    href="/dashboard/privacy"
                                    icon={<LockKeyhole size={19} />}
                                    label="Privacy & legal"
                                    onClick={() => setPanel(null)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="pt-4 pb-8 border-t border-gray-100 dark:border-white/10 space-y-4">
                    <button
                        type="button"
                        onClick={() => setPanel(null)}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/10 p-4 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/20 transition active:scale-[0.99]"
                    >
                        <LogOut size={18} />
                        <span>Sign out</span>
                    </button>
                    <div className="text-center">
                        <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                            HWALN · Pilot Beta
                        </span>
                    </div>
                </div>
            </aside>
        </div>,
        document.body
    );
}

function DrawerItem({
                        href,
                        icon,
                        label,
                        onClick,
                    }: {
    href: string;
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="group flex w-full items-center justify-between rounded-2xl p-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300 transition hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-950 dark:hover:text-white"
        >
            <div className="flex items-center gap-3.5">
                <span className="text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {icon}
                </span>
                <span>{label}</span>
            </div>
            <ChevronRight size={16} className="text-gray-400 transition-transform group-hover:translate-x-0.5" />
        </Link>
    );
}