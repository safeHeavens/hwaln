import {
    ShieldCheck,
    Sparkles,
    Plus,
    ArrowRight,
    Eye,
    EyeOff,
    ArrowUpRight,
    Check,
    ChevronRight,
    Compass
} from "lucide-react";
import {useRouter} from "next/navigation";
import { PortfolioData } from "@/types/home";
import UnfundedWelcome from "@/components/UnfundedWelcome";
import UnfundedAssistant from "@/components/UnfundedAssistant";

interface StateProps {
    sample: PortfolioData;
    balanceVisible: boolean;
    setBalanceVisible: (visible: boolean) => void;
    displayedMoney: (amount: number) => string;
    setActiveNav: (nav: string) => void;
}


export function UnfundedState({ setActiveNav }: { setActiveNav: (nav: string) => void }) {

    const router = useRouter();

    const handleAddFunds = () => {
        router.push("");
    }

    return (
        <>
           <UnfundedWelcome onAddFunds={handleAddFunds} />

            <UnfundedAssistant />

            {/* Add other unfunded state components */}
        </>
    );
}

export function FundedState({ sample, balanceVisible, setBalanceVisible, displayedMoney, setActiveNav }: StateProps) {
    return (
        <section className="portfolio-card">
            <div className="portfolio-card-header">
                <div className="eyebrow">YOUR PORTFOLIO</div>
                <button
                    className="visibility-button"
                    onClick={() => setBalanceVisible(!balanceVisible)}
                    aria-label={balanceVisible ? "Hide balances" : "Show balances"}
                >
                    {balanceVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
            </div>

            <div className="portfolio-label">Portfolio value</div>
            <div className="portfolio-amount">
                {displayedMoney(sample.portfolioValue)}
            </div>

            <div className="portfolio-note">
                Your account is funded. You're in control of what happens next.
            </div>

            <div className="balance-breakdown">
                <BalanceItem label="Available" value={displayedMoney(sample.available)} color="mint" />
                <BalanceItem label="Allocated" value={displayedMoney(sample.allocated)} color="violet" />
            </div>

            <div className="portfolio-actions">
                <button
                    className="button button-primary"
                    onClick={() => alert("Funding flow will be connected next.")}
                >
                    <Plus size={17} />
                    Add funds
                </button>
                <button
                    className="button button-secondary"
                    onClick={() => setActiveNav("Discover")}
                >
                    Discover experts
                    <ArrowRight size={16} />
                </button>
            </div>
        </section>
    );
}

export function CopyingState({ sample, balanceVisible, setBalanceVisible, displayedMoney, setActiveNav }: StateProps) {
    return (
        <>
            <section className="portfolio-card">
                <div className="portfolio-card-header">
                    <div className="eyebrow">YOUR PORTFOLIO</div>
                    <button
                        className="visibility-button"
                        onClick={() => setBalanceVisible(!balanceVisible)}
                        aria-label={balanceVisible ? "Hide balances" : "Show balances"}
                    >
                        {balanceVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                </div>

                <div className="portfolio-label">Portfolio value</div>
                <div className="portfolio-amount">
                    {displayedMoney(sample.portfolioValue)}
                </div>

                <div className="performance-line">
          <span className="performance-positive">
            <ArrowUpRight size={16} />
              {displayedMoney(sample.monthlyPnl)} ({sample.monthlyReturn}%)
          </span>
                    <span className="performance-period">This month</span>
                </div>

                <div className="mini-chart" aria-label="Illustrative performance chart">
                    <svg viewBox="0 0 320 74" role="img" aria-label="Sample portfolio performance line" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#62E6C0" stopOpacity=".22" />
                                <stop offset="100%" stopColor="#62E6C0" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M0 59 C18 52 22 60 38 47 S62 50 78 40 S101 47 120 32 S143 38 160 29 S186 38 204 22 S228 31 245 17 S276 22 292 9 S309 13 320 4 L320 74 L0 74 Z"
                            fill="url(#chartFill)"
                        />
                        <path
                            d="M0 59 C18 52 22 60 38 47 S62 50 78 40 S101 47 120 32 S143 38 160 29 S186 38 204 22 S228 31 245 17 S276 22 292 9 S309 13 320 4"
                            fill="none"
                            stroke="#62E6C0"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="chart-periods">
                        <span>1W</span>
                        <span className="period-active">1M</span>
                        <span>3M</span>
                        <span>1Y</span>
                    </div>
                </div>

                <div className="balance-breakdown">
                    <BalanceItem label="Available" value={displayedMoney(sample.available)} color="mint" />
                    <BalanceItem label="Allocated" value={displayedMoney(sample.allocated)} color="violet" />
                </div>
            </section>

            <section className="section-block">
                <SectionHeading title="Your active strategy" action="View details" onAction={() => setActiveNav("Portfolio")} />
                <div className="expert-card">
                    <div className="expert-avatar">A</div>
                    <div className="expert-copy">
                        <div className="expert-name">
                            {sample.expert}
                            <span className="verified-mark"><Check size={11} /></span>
                        </div>
                        <div className="expert-description">{sample.expertStrategy}</div>
                        <span className="copying-status">
              <span className="status-dot" />
              Copying active
            </span>
                    </div>
                    <ChevronRight size={19} />
                </div>
            </section>

            <section className="section-block">
                <SectionHeading title="Risk overview" />
                <div className="risk-card">
                    <div className="risk-icon">
                        <ShieldCheck size={21} />
                    </div>
                    <div className="risk-copy">
                        <strong>Stay informed</strong>
                        <span>Review your configured limits and current exposure.</span>
                    </div>
                    <ChevronRight size={18} />
                </div>
            </section>
        </>
    );
}

export function DiscoveryEntry({ setActiveNav }: { setActiveNav: (nav: string) => void }) {
    return (
        <section className="section-block discovery-section">
            <SectionHeading title="Explore expert strategies" action="See all" onAction={() => setActiveNav("Discover")} />
            <div className="discovery-card">
                <div className="discovery-icon">
                    <Compass size={22} />
                </div>
                <div className="discovery-copy">
                    <strong>Find a strategy that fits you</strong>
                    <span>Compare trading history, risk, and fees before deciding.</span>
                    <button className="inline-link" onClick={() => setActiveNav("Discover")}>
                        Discover experts <ArrowRight size={15} />
                    </button>
                </div>
            </div>
        </section>
    );
}

function BalanceItem({ label, value, color }: { label: string; value: string; color: "mint" | "violet" }) {
    return (
        <div className="balance-item">
            <span className={`balance-dot ${color}`} />
            <div>
                <span className="balance-label">{label}</span>
                <strong>{value}</strong>
            </div>
        </div>
    );
}

function SectionHeading({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
    return (
        <div className="section-heading">
            <h3>{title}</h3>
            {action && onAction && (
                <button onClick={onAction}>
                    {action} <ArrowRight size={14} />
                </button>
            )}
        </div>
    );
}