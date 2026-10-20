import {
    UserRound,
    Bell,
    X,
    ShieldCheck,
    Wallet,
    Settings,
    Headphones,
    LockKeyhole,
    LogOut,
    ChevronRight,
    Home,
    Compass,
    Activity
} from "lucide-react";
import { Panel } from "@/types/home";

interface NavigationProps {
    panel: Panel;
    setPanel: (panel: Panel) => void;
    activeNav: string;
    setActiveNav: (nav: string) => void;
}

export function MobileHeader({ setPanel }: { setPanel: (panel: Panel) => void }) {
    return (
        <header className="mobile-header">
            <button
                className="icon-button profile-trigger"
                aria-label="Open profile menu"
                onClick={() => setPanel("profile")}
            >
                <UserRound size={21} />
            </button>

            <div className="greeting">
                <span>Good morning,</span>
                <strong>Shekinah</strong>
            </div>

            <button
                className="icon-button notification-trigger"
                aria-label="Open notifications"
                onClick={() => setPanel("notifications")}
            >
                <Bell size={20} />
                <span className="notification-dot" />
            </button>
        </header>
    );
}

export function DesktopHeader({ setPanel }: { setPanel: (panel: Panel) => void }) {
    return (
        <header className="desktop-headerr hidden w-full bg-yellow">
            <button
                className="icon-button"
                aria-label="Open notifications"
                onClick={() => setPanel("notifications")}
            >
                <Bell size={20} />
                <span className="notification-dot" />
            </button>
        </header>
    );
}

export function MobileBottomNav({ activeNav, setActiveNav }: { activeNav: string; setActiveNav: (nav: string) => void }) {
    const navItems = [
        { label: "Home", icon: <Home /> },
        { label: "Discover", icon: <Compass /> },
        { label: "Portfolio", icon: <Wallet /> },
        { label: "Activity", icon: <Activity /> },
        { label: "Settings", icon: <Settings /> },
    ];

    return (
        <nav className="mobile-bottom-nav" aria-label="Main navigation">
            {navItems.map((item) => (
                <button
                    key={item.label}
                    className={activeNav === item.label ? "nav-active" : ""}
                    onClick={() => setActiveNav(item.label)}
                >
                    {item.icon}
                    <span>{item.label}</span>
                </button>
            ))}
        </nav>
    );
}

export function ProfileDrawer({ panel, setPanel }: { panel: Panel; setPanel: (panel: Panel) => void }) {
    return (
        <aside className={`side-drawer ${panel === "profile" ? "drawer-open" : ""}`}>
            <div className="drawer-header">
                <a className="brand" href="#">
                    <span className="brand-mark">H</span>
                    <span>HWALN</span>
                </a>
                <button
                    className="icon-button"
                    aria-label="Close profile menu"
                    onClick={() => setPanel(null)}
                >
                    <X size={20} />
                </button>
            </div>

            <div className="drawer-profile">
                <div className="drawer-avatar">S</div>
                <div>
                    <strong>Shekinah</strong>
                    <span>Personal account</span>
                </div>
            </div>

            <div className="drawer-label">YOUR ACCOUNT</div>
            <DrawerItem icon={<UserRound />} label="Personal details" />
            <DrawerItem icon={<ShieldCheck />} label="Verification & security" />
            <DrawerItem icon={<Wallet />} label="Funding & withdrawals" />
            <DrawerItem icon={<Settings />} label="Settings" />

            <div className="drawer-label">SUPPORT</div>
            <DrawerItem icon={<Headphones />} label="Help & support" />
            <DrawerItem icon={<LockKeyhole />} label="Privacy & legal" />

            <div className="drawer-footer">
                <DrawerItem icon={<LogOut />} label="Sign out" />
                <span>HWALN · Pilot Beta</span>
            </div>
        </aside>
    );
}

export function NotificationPanel({ panel, setPanel }: { panel: Panel; setPanel: (panel: Panel) => void }) {
    return (
        <aside
            className={`notification-panel ${
                panel === "notifications" ? "notification-open" : ""
            }`}
        >
            <div className="notification-panel-header">
                <div>
                    <h2>Notifications</h2>
                    <p>Your account updates will appear here.</p>
                </div>
                <button
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
                <strong>You&apos;re all caught up</strong>
                <span>
          Important account, funding, and copy-trading updates will show up here.
        </span>
            </div>
        </aside>
    );
}

function DrawerItem({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <button className="drawer-item">
            {icon}
            <span>{label}</span>
            <ChevronRight size={16} />
        </button>
    );
}