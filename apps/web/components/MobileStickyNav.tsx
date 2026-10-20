'use client';

import {Home, Users, Sparkles, Galaxy, Wallet, Trophy, SquareChartGantt} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const mobileNavItems = [
    {
        label: 'Home',
        href: '/dashboard',
        icon: Home,
        iconSize: 20,
        isAvena: false,
    },
    {
        label: 'Experts',
        href: '/dashboard/discover', // or /dashboard/experts depending on your route
        icon: Users,
        iconSize: 20,
        isAvena: false,
    },
    {
        label: 'Trade',
        href: '/dashboard/trade',
        icon: SquareChartGantt,
        iconSize: 20,
        isAvena: false,
    },
    {
        label: 'Challenges',
        href: '/dashboard/challenges',
        icon: Trophy,
        iconSize: 20,
        isAvena: false,
    },
    {
        label: 'Portfolio',
        href: '/dashboard/portfolio',
        icon: Wallet,
        iconSize: 20,
        isAvena: false,
    },
];

function isRouteActive(pathname: string, href: string) {
    if (href === '/dashboard') {
        return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileBottomNav() {
    const pathname = usePathname();

    return (
        <nav
            aria-label="Mobile Bottom Navigation"
            className="fixed -bottom-3 pb-4 left-0 right-0 z-40 flex items-center justify-around rounded-4xl _rounded-t-4xl border-t border-x border-gray-200/80 bg-white/95 px-2 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#13161D]/95 md:hidden _shadow-[0_-8px_25px_rgba(0,0,0,0.08)] _dark:shadow-[0_-8px_25px_rgba(0,0,0,0.4)]"
        >
            {mobileNavItems.map((item) => {
                const active = isRouteActive(pathname, item.href);
                const IconComponent = item.icon;

                // Special Floating Button styling for Avena (AI Assistant)
                if (item.isAvena) {
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={active ? 'page' : undefined}
                            className="group relative -top-3 flex flex-col items-center"
                        >
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 text-white shadow-md shadow-emerald-500/30 transition-transform group-active:scale-95 dark:from-emerald-400 dark:to-teal-600">
                                <Sparkles size={21} className="animate-pulse" />
                            </div>
                            <span
                                className={`mt-1 text-[10px] font-bold tracking-tight ${
                                    active
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : 'text-gray-500 dark:text-gray-400'
                                }`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                }

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={`flex flex-col items-center gap-1 rounded-xl px-2.5 py-1 transition-all active:scale-95 ${
                            active
                                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                        }`}
                    >
                        <span className={active ? 'scale-110 transition-transform' : ''}>
                            <IconComponent
                                size={item.iconSize}
                                {...(active ? { fill: 'currentColor', stroke: '#1a1a1a' } : {})}
                            />
                        </span>
                        <span className="text-[10px] font-medium tracking-tight">
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}