"use client";

import { Sidebar, NotificationPanel } from "@/components/Sidebar";
import { WalletModalProvider } from "@/Context/WalletModalContext";
import { DashboardProvider, useDashboard } from "@/Context/DashboardContext";
import { MobileBottomNav } from "@/components/MobileStickyNav";
import { ProfileDrawer } from "@/components/ModalsAndNavigation";

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { panel, setPanel } = useDashboard();
    const isProfileOpen = panel === "profile";

    return (
        <main className="hw-app relative min-h-screen">
            <div className="hw-shell flex min-h-screen">
                <Sidebar setPanel={setPanel} />

                <section className="hw-main flex-1 w-full pb-24 md:pb-0">
                    {children}
                </section>
            </div>

            {/* Notifications Panel Drawer */}
            <NotificationPanel panel={panel} setPanel={setPanel} />

            {/* Full-Screen Mobile Profile Side Drawer */}
            <ProfileDrawer panel={panel} setPanel={setPanel} />

            {/* Mobile Bottom Navigation Bar - Slides down smoothly when profile is open */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out md:hidden ${
                    isProfileOpen
                        ? "translate-y-full opacity-0 pointer-events-none"
                        : "translate-y-0 opacity-100 pointer-events-auto"
                }`}
            >
                <MobileBottomNav />
            </div>
        </main>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <WalletModalProvider>
            <DashboardProvider>
                <LayoutContent>{children}</LayoutContent>
            </DashboardProvider>
        </WalletModalProvider>
    );
}