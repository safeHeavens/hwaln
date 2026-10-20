
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Wallet,
    Users, Flame, UserRound,
} from 'lucide-react';

const portfolioItems = [
    {
        label: 'Overview',
        href: '/dashboard/portfolio',
        icon: LayoutDashboard,
    },
    {
        label: 'Wallet',
        href: '/dashboard/portfolio/wallet',
        icon: Wallet,
    },
    {
        label: 'My Experts',
        href: '/dashboard/portfolio/experts',
        icon: UserRound,
    },
    {
        label: 'Live Streaks',
        href: '/dashboard/portfolio/challenge',
        icon: Flame,
    },
];

export default function PortfolioNavigation() {
    const pathname = usePathname();

    return (
        <nav
            aria-label="Portfolio navigation"
            className="portfolio-nav lg:-mb-12"
        >
            {portfolioItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-current={isActive ? 'page' : undefined}
                        className={`portfolio-nav-pill ${
                            isActive ? 'active' : ''
                        }`}
                    >
                        {/*<Icon size={17} strokeWidth={1.8} />*/}
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
