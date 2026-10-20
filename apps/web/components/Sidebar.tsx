
"use client";

import {
    Home,
    Compass,
    Wallet,
    Settings,
    ChevronRight,
    Bell,
    X,
    Galaxy,
    Sparkles, Trophy, SquareChartGantt,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { Panel } from "@/types/home";

interface SidebarProps {
    setPanel: (panel: Panel) => void;
}

interface NavItemProps {
    icon: ReactNode;
    label: string;
    href: string;
    active: boolean;
}

interface NotificationPanelProps {
    panel: Panel;
    setPanel: (panel: Panel) => void;
}

const navItems = [
    {
        label: "Home",
        href: "/dashboard",
        icon: <Home size={20} />,
    },
    {
        label: "Discover",
        href: "/dashboard/discover",
        icon: <Compass size={20} />,
    },
    {
        label: "Trade",
        href: "/dashboard/trade",
        icon: <SquareChartGantt size={20} />,
    },
    {
        label: "Challenges",
        href: "/dashboard/challenges",
        icon: <Trophy size={20} />,
    },
    {
        label: "Portfolio",
        href: "/dashboard/portfolio",
        icon: <Wallet size={20} />,
    },
];

function isRouteActive(pathname: string, href: string) {
    if (href === "/dashboard") {
        return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({ setPanel }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="desktop-sidebar">
            <div className="flex justify-between">
                <Link
                    href="/dashboard"
                    className="brand"
                    aria-label="HWALN home"
                >
                    <span className="brand-mark">H</span>
                    <span>HWALN</span>
                </Link>

                <button
                    type="button"
                    className="icon-button notification-icon bg-none"
                    aria-label="Open notifications"
                    onClick={() => setPanel("notifications")}
                >
                    <Bell size={15} />
                    <span className="notification-dot hidden" />
                </button>
            </div>

            <div className="sidebar-label" />

            <nav className="sidebar-nav mb-10" aria-label="Main navigation">
                {navItems.map((item) => (
                    <NavItem
                        key={item.href}
                        {...item}
                        active={isRouteActive(pathname, item.href)}
                    />
                ))}
            </nav>

            <div className="pt-4">
                <button
                    aria-label="Talk with Avena"
                    aria-current={
                        isRouteActive(pathname, "/dashboard/avena")
                            ? "page"
                            : undefined
                    }
                    className={`
                        group relative mb-10 flex w-full items-center gap-3
                        overflow-hidden rounded-2xl border p-2.5 text-left
                        border-emerald-200/70
                        bg-gradient-to-br from-emerald-50 via-teal-50 to-violet-100/80
                        text-slate-800 shadow-sm shadow-emerald-950/5
                        transition-all duration-300
                        hover:-translate-y-0.5 hover:border-emerald-300
                        hover:shadow-md hover:shadow-emerald-900/10
                        active:translate-y-0
                        dark:border-white/10
                        dark:bg-gradient-to-br dark:from-emerald-950/70
                        dark:via-slate-900 dark:to-violet-950/60
                        dark:text-slate-100
                        dark:hover:border-emerald-400/30
                        dark:hover:shadow-emerald-950/30
                    `}
                >
                    <div
                        aria-hidden="true"
                        className="
                            pointer-events-none absolute -right-8 -top-10
                            h-24 w-24 rounded-full
                            bg-gradient-to-br from-emerald-400/20 to-violet-400/20
                            blur-2xl transition-opacity duration-300
                            group-hover:opacity-100
                            dark:from-emerald-400/15 dark:to-violet-400/20
                        "
                    />

                    <div
                        className="
                            relative flex h-10 w-10 shrink-0 items-center
                            justify-center rounded-xl
                            bg-gradient-to-br from-emerald-500 to-teal-600
                            text-white shadow-sm shadow-emerald-900/20
                            transition-transform duration-300
                            group-hover:scale-105
                            dark:from-emerald-400 dark:to-teal-600
                        "
                    >
                        <Sparkles size={19} strokeWidth={2} />
                    </div>

                    <div className="relative min-w-0 flex-1">
                        <strong className="block text-sm font-semibold tracking-tight">
                            Talk with Avena
                        </strong>
                    </div>

                    <ChevronRight
                        size={17}
                        className="
                            hidden shrink-0 text-slate-400
                            transition-all duration-300
                            group-hover:translate-x-0.5
                            group-hover:text-emerald-600
                            dark:text-slate-500
                            dark:group-hover:text-emerald-400
                        "
                    />
                </button>
            </div>

            <div className="sidebar-bottom">

                {/*
                    <NavItem
                        icon={<Settings size={20} />}
                        label="Settings"
                        href="/dashboard/settings"
                        active={isRouteActive(pathname, "/dashboard/settings")}
                    />
                    */}

                <Link
                    href="/dashboard/profile"
                    aria-label="Open profile"
                    aria-current={
                        isRouteActive(pathname, "/dashboard/profile")
                            ? "page"
                            : undefined
                    }
                    className="sidebar-user flex items-center justify-between gap-5"
                >
                    <div className="avatar">S</div>

                    <div className="sidebar-user-copy col mr-auto gap-1">
                        <strong>Shekinah Ayibatari</strong>
                        <span>belariosammy@gmail.com</span>
                    </div>

                    <ChevronRight size={16} />
                </Link>
            </div>
        </aside>
    );
}

function NavItem({
                     icon,
                     label,
                     href,
                     active,
                 }: NavItemProps) {
    return (
        <Link
            href={href}
            className={`sidebar-nav-item ${
                active ? "sidebar-nav-active" : ""
            }`}
            aria-current={active ? "page" : undefined}
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}

export function NotificationPanel({
                                      panel,
                                      setPanel,
                                  }: NotificationPanelProps) {
    const isOpen = panel === "notifications";

    return (
        <aside
            className={`notification-panel ${
                isOpen ? "notification-open" : ""
            }`}
            aria-hidden={!isOpen}
            inert={!isOpen}
        >
            <div className="notification-panel-header">
                <div>
                    <h2>Notifications</h2>
                    <p>Your account updates will appear here.</p>
                </div>

                <button
                    type="button"
                    className="icon-button"
                    aria-label="Close notifications"
                    onClick={() => setPanel(null)}
                >
                    <X size={20} />
                </button>
            </div>

            <div className="empty-notifications">
                <div className="empty-notification-icon">
                    <Bell size={23} />
                </div>

                <strong>You're all caught up</strong>

                <span>
                    Important account, funding, and copy-trading
                    updates will show up here.
                </span>
            </div>
        </aside>
    );
}
