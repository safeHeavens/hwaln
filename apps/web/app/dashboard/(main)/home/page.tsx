
"use client";

import { useState } from "react";
import type { AccountState, Panel, PortfolioData } from "@/types/home";

import {
    UnfundedState,
    FundedState,
    CopyingState,
    DiscoveryEntry,
} from "@/components/AccountState";

import {
    DesktopHeader,
    NotificationPanel,
    ProfileDrawer,
} from "@/components/ModalsAndNavigation";
import { MobileHeader } from "@/components/MobileHeader";

const sample: PortfolioData = {
    portfolioValue: 1250,
    available: 750,
    allocated: 500,
    monthlyPnl: 42.5,
    monthlyReturn: 3.5,
    expert: "Atlas FX",
    expertStrategy: "Forex · Risk-managed",
};

const money = (amount: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(amount);

// Example in page.tsx or parent component
const currentUser = {
    firstName: "Samson",
    lastName: "Belario",
    avatarUrl: null, // Or "https://your-storage-bucket.com/avatar.jpg"
};

export default function HomePage() {
    const [accountState] = useState<AccountState>("unfunded");
    const [panel, setPanel] = useState<Panel>(null);
    const [balanceVisible, setBalanceVisible] = useState(true);
    const [activeNav, setActiveNav] = useState("Home");

    const displayedMoney = (amount: number) =>
        balanceVisible ? money(amount) : "••••••";

    return (
        <div className="min-w-0 flex-1">

            <MobileHeader user={currentUser} />
            <DesktopHeader setPanel={setPanel} />

            <div className="home-content">
                {accountState === "unfunded" && (
                    <UnfundedState setActiveNav={setActiveNav} />
                )}

                {accountState === "funded" && (
                    <FundedState
                        sample={sample}
                        balanceVisible={balanceVisible}
                        setBalanceVisible={setBalanceVisible}
                        displayedMoney={displayedMoney}
                        setActiveNav={setActiveNav}
                    />
                )}

                {accountState === "copying" && (
                    <CopyingState
                        sample={sample}
                        balanceVisible={balanceVisible}
                        setBalanceVisible={setBalanceVisible}
                        displayedMoney={displayedMoney}
                        setActiveNav={setActiveNav}
                    />
                )}

                {accountState !== "copying" && (
                    <DiscoveryEntry setActiveNav={setActiveNav} />
                )}

                <div className="home-disclaimer">
                    Trading involves risk, including possible loss of capital. Past
                    performance does not guarantee future results.
                </div>
            </div>

        </div>
    );
}
