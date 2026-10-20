"use client";

import { useState } from "react";
import { AccountState, Panel, PortfolioData } from "@/types/home";
import { Sidebar } from "@/components/Sidebar";
import {
  UnfundedState,
  FundedState,
  CopyingState,
  DiscoveryEntry
} from "@/components/AccountState";
import {
  MobileHeader,
  DesktopHeader,
  MobileBottomNav,
  ProfileDrawer,
  NotificationPanel
} from "@/components/ModalsAndNavigation";

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

export default function HomePage() {
  const [accountState, setAccountState] = useState<AccountState>("unfunded");
  const [panel, setPanel] = useState<Panel>(null);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeNav, setActiveNav] = useState("Home");


    const displayedMoney = (amount: number) =>
      balanceVisible ? money(amount) : "••••••";

  return (
      <main className="hw-app">
        <div className="hw-shell">
          {/* Desktop sidebar */}
          <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} setPanel={setPanel} />

          {/* Main content */}
          <section className="hw-main">
            <MobileHeader setPanel={setPanel} />
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
                Trading involves risk, including possible loss of capital.
                Past performance does not guarantee future results.
              </div>
            </div>

            <MobileBottomNav activeNav={activeNav} setActiveNav={setActiveNav} />
          </section>
        </div>

        {/* Backdrop for mobile drawer/panel */}
        {panel && (
            <button
                className="panel-backdrop"
                aria-label="Close panel"
                onClick={() => setPanel(null)}
            />
        )}

        <ProfileDrawer panel={panel} setPanel={setPanel} />
        <NotificationPanel panel={panel} setPanel={setPanel} />
      </main>
  );
}