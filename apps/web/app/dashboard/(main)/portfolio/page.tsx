'use client';

import { useState, type FormEvent } from 'react';
import { useRouter} from "next/navigation";
import Link from 'next/link';
import {
    ArrowDownLeft,
    ArrowLeftRight,
    ArrowUpRight,
    ChevronDown,
    ChevronRight,
    CircleDollarSign,
    Clock3,
    Eye,
    EyeOff, Minus,
    Plus,
    ShieldCheck,
    TrendingUp,
    Wallet,
    Info,
    UsersRound,
    Flame,
} from 'lucide-react';
import PortfolioActions from "@/components/portfolio/PortfolioActions";
import WalletActionModal from "@/components/portfolio/WalletActionModal";

const periods = ['1W', '1M', '3M', '6M', '1Y', 'ALL'] as const;
type Period = (typeof periods)[number];
type WalletAction = 'Deposit' | 'Transfer' | 'Withdraw';
type Currency = 'USD' | 'NGN';

const expertFollowing = 3;
const activeStreaks = 2;

// Demo FX rate only. Replace with a trusted backend FX rate.
const USD_TO_NGN = 1500;

const performance: Record<Period, number[]> = {
    '1W': [32, 38, 35, 47, 43, 55, 51, 65, 61, 74, 70, 83],
    '1M': [22, 30, 27, 40, 35, 48, 45, 57, 52, 68, 64, 82],
    '3M': [18, 26, 22, 34, 30, 46, 42, 55, 50, 68, 61, 82],
    '6M': [15, 21, 18, 32, 27, 40, 38, 53, 47, 62, 59, 82],
    '1Y': [10, 18, 14, 26, 23, 36, 33, 45, 43, 60, 56, 82],
    ALL: [8, 13, 11, 22, 19, 31, 28, 42, 39, 57, 63, 82],
};

const experts = [
    {
        name: 'Alex Morgan',
        handle: '@alextrades',
        initials: 'AM',
        color: 'bg-violet-100 text-violet-700',
        return: '+12.8%',
        allocationNgn: 250000,
        status: 'Copying',
    },
    {
        name: 'Sarah Chen',
        handle: '@sarahfx',
        initials: 'SC',
        color: 'bg-emerald-100 text-emerald-700',
        return: '+8.4%',
        allocationNgn: 150000,
        status: 'Copying',
    },
];

const transactions = [
    {
        title: 'Deposit',
        detail: 'Wallet funding',
        date: 'Today, 10:42 AM',
        amountNgn: 50000,
        positive: true,
        icon: ArrowDownLeft,
    },
    {
        title: 'Expert allocation',
        detail: 'Alex Morgan',
        date: 'Yesterday',
        amountNgn: -25000,
        positive: false,
        icon: ArrowLeftRight,
    },
    {
        title: 'Trading profit',
        detail: 'Sarah Chen',
        date: 'Oct 14, 2026',
        amountNgn: 8450,
        positive: true,
        icon: TrendingUp,
    },
];

function formatMoney(amountNgn: number, currency: Currency) {
    const amount =
        currency === 'USD' ? amountNgn / USD_TO_NGN : amountNgn;

    const formattedValue = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: currency === 'USD' ? 2 : 0,
        maximumFractionDigits: currency === 'USD' ? 2 : 0,
    }).format(amount);

    return `${formattedValue} ${currency}`;
}

function formatSignedMoney(amountNgn: number, currency: Currency) {
    const formatted = formatMoney(Math.abs(amountNgn), currency);
    return `${amountNgn >= 0 ? '+' : '−'}${formatted}`;
}

function PerformanceChart({ period }: { period: Period }) {
    const values = performance[period];
    const width = 680;
    const height = 210;
    const padding = 8;
    const min = Math.min(...values) - 8;
    const max = Math.max(...values) + 8;

    const points = values
        .map((value, index) => {
            const x = padding + (index / (values.length - 1)) * (width - padding * 2);
            const y = height - padding - ((value - min) / (max - min)) * (height - padding * 2);

            return `${x},${y}`;
        })
        .join(' ');

    const lastPoint = points.split(' ').at(-1)?.split(',') ?? ['0', '0'];

    return (
        <div className="w-full">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="h-[190px] w-full overflow-visible sm:h-[230px]"
                role="img"
                aria-label={`Illustrative portfolio performance chart for ${period}`}
            >
                {[0, 1, 2, 3].map((line) => {
                    const y = (height / 3) * line;

                    return (
                        <line
                            key={line}
                            x1="0"
                            x2={width}
                            y1={y}
                            y2={y}
                            stroke="currentColor"
                            strokeOpacity="0.08"
                            strokeDasharray="4 6"
                        />
                    );
                })}

                <defs>
                    <linearGradient
                        id="portfolio-fill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop offset="0%" stopColor="#16a34a" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
                    </linearGradient>
                </defs>

                <polygon
                    points={`${padding},${height} ${points} ${width - padding},${height}`}
                    fill="url(#portfolio-fill)"
                />

                <polyline
                    points={points}
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                />

                <circle
                    cx={lastPoint[0]}
                    cy={lastPoint[1]}
                    r="5"
                    fill="#16a34a"
                    stroke="white"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>

            <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                <span>
                    {period === '1W'
                        ? '7 days ago'
                        : period === '1M'
                            ? '1 month ago'
                            : 'Period start'}
                </span>
                <span>Today</span>
            </div>
        </div>
    );
}

function MetricCard({
                        label,
                        value,
                        detail,
                        icon: Icon,
                    }: {
    label: string;
    value: string | number;
    detail: string;
    icon: typeof Wallet;
}) {
    return (
        <div className="group relative min-w-0 rounded-xl border-0 sm:border-b sm:border-border/60 bg-card light:bg-[#f5f7fb] bg-[#f5f5f5] p-3 transition-colors hover:bg-muted/30 sm:px-4 sm:py-3 lg:p-4">
            <div className="flex min-w-0 flex-col justify-between sm:flex-row gap-1 sm:items-center sm:gap-2.5">
                {/* Icon and label */}
                <div className="flex min-w-0 flex-1 items-center gap-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/70">
                        <Icon size={16} className="text-muted-foreground relative top-2 lg:top-0" />
                    </div>

                    <div className="flex min-w-0 items-center gap-1">
                        <p className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
                            {label}
                        </p>
                    </div>
                </div>

                {/* Value */}
                <p className="pl-10 text-base font-semibold tracking-tight tabular-nums text-foreground sm:shrink-0 sm:pl-0 sm:text-sm lg:text-base -mt-2 lg:-mt-0">
                    {value}
                </p>
            </div>
        </div>
    );
}

function CurrencySwitch({
                            currency,
                            onChange,
                        }: {
    currency: Currency;
    onChange: (currency: Currency) => void;
}) {
    return (
        <div
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-background p-1"
            aria-label="Display currency"
        >
            {(['USD', 'NGN'] as const).map((item) => (
                <button
                    key={item}
                    type="button"
                    onClick={() => onChange(item)}
                    aria-pressed={currency === item}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        currency === item
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    {item}
                </button>
            ))}
        </div>
    );
}

export default function PortfolioOverviewPage() {
    const [period, setPeriod] = useState<Period>('1M');
    const [action, setAction] = useState<WalletAction | null>(null);
    const [amount, setAmount] = useState('');
    const [notice, setNotice] = useState('');

    const [activeModal, setActiveModal] = useState<'deposit' | 'withdraw' | null>(null);
    const router = useRouter();

    const [currency, setCurrency] = useState<Currency>('USD');
    const [balanceVisible, setBalanceVisible] = useState(true);

    const portfolioNgn = 1284500;
    const overallReturnNgn = 101500;
    const availableBalanceNgn = 384500;
    const allocatedCapitalNgn = 900000;

    function displayMoney(amountNgn: number) {
        return balanceVisible
            ? formatMoney(amountNgn, currency)
            : '********';
    }

    function submitAction(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const enteredAmount = Number(amount);

        if (!amount || !Number.isFinite(enteredAmount) || enteredAmount <= 0) {
            setNotice('Enter an amount greater than zero.');
            return;
        }

        if (action === 'Transfer' || action === 'Withdraw') {
            const amountInNgn =
                currency === 'USD'
                    ? enteredAmount * USD_TO_NGN
                    : enteredAmount;

            if (amountInNgn > availableBalanceNgn) {
                setNotice('This amount exceeds your available wallet balance.');
                return;
            }
        }

        setNotice(
            `${action} request UI is ready. Connect your wallet API to process real transactions.`,
        );
    }

    const handleRouteNavigation = (route: string) => {
        router.push(route);
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Portfolio total */}
            <section
                className="-mt-4
                    relative isolate overflow-hidden rounded-3xl
                    border border-white/10
                    bg-gradient-to-br
                    from-[#302035] via-[#20232D] to-[#073B3A]
                    text-white shadow-xl shadow-black/5
                    dark:border-emerald-300/20
                    dark:from-[#064E3B]
                    dark:via-[#047857]
                    dark:to-[#A3E635]
                    dark:shadow-emerald-950/10
                "
            >
                {/* Ambient lighting: subtle teal by day, emerald by night */}
                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none absolute -right-20 -top-24
                        h-64 w-64 rounded-full
                        bg-teal-400/15 blur-3xl
                        dark:bg-lime-200/30
                    "
                />

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none absolute -bottom-28 -left-16
                        h-64 w-64 rounded-full
                        bg-purple-500/15 blur-3xl
                        dark:bg-emerald-950/20
                    "
                />

                <div className="relative z-10 p-5 sm:p-7 lg:p-8">
                    <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10">

                        {/* Portfolio balance */}
                        <div className="min-w-0">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 text-sm text-white/75">
                                    <span>Total portfolio value</span>
                                    <ShieldCheck size={15} className="hidden" />
                                </div>

                                {/* Mobile privacy toggle */}
                                <button
                                    type="button"
                                    onClick={() => setBalanceVisible((visible) => !visible)}
                                    aria-label={balanceVisible ? 'Hide balances' : 'Show balances'}
                                    aria-pressed={!balanceVisible}
                                    title={balanceVisible ? 'Hide balances' : 'Show balances'}
                                    className="
                                        inline-flex size-9 shrink-0 items-center
                                        justify-center rounded-full
                                        text-white/75 transition
                                        hover:bg-white/10 hover:text-white
                                        focus-visible:outline-none
                                        focus-visible:ring-2 focus-visible:ring-white/60
                                        lg:hidden
                                    "
                                >
                                    {balanceVisible ? <Eye size={19} /> : <EyeOff size={19} />}
                                </button>
                            </div>

                            <h2 className="mt-3 break-words text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
                                {displayMoney(portfolioNgn)}
                            </h2>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className="
                                    inline-flex items-center gap-1 rounded-full
                                    border border-white/10 bg-white/10
                                    px-2.5 py-1 text-xs font-medium
                                    text-emerald-200 backdrop-blur-sm
                                    dark:border-white/15 dark:bg-white/15
                                    dark:text-white
                                ">
                                    <TrendingUp size={13} />
                                    +8.6%
                                </span>

                                <p className="text-sm text-white/70">
                                    <span className="font-medium text-emerald-200 dark:text-white">
                                        {balanceVisible
                                            ? `+${formatMoney(overallReturnNgn, currency)}`
                                            : '••••••'}
                                    </span>
                                    {' '}overall return
                                </p>
                            </div>
                        </div>

                        {/* Portfolio actions */}
                        <PortfolioActions
                            balanceVisible={balanceVisible}
                            setBalanceVisible={setBalanceVisible}
                        />
                    </div>
                </div>
            </section>

            {/* Key metrics */}
            <section className="">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2 grid-cols-2 mt-4">
                    <MetricCard
                        label="Available balance"
                        value={displayMoney(availableBalanceNgn)}
                        detail="Available for transfers or allocation"
                        icon={Wallet}
                    />
                    <MetricCard
                        label="Capital with experts"
                        value={displayMoney(allocatedCapitalNgn)}
                        detail="Currently allocated to copy trading"
                        icon={CircleDollarSign}
                    />
                </div>
            </section>

            <section className="flex flex-col gap-3">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2 grid-cols-2">
                    <MetricCard
                        label="Actively following"
                        value={expertFollowing}
                        detail="Traders you are actively copying"
                        icon={UsersRound}
                    />
                    <MetricCard
                        label="Active challenges"
                        value={activeStreaks}
                        detail="Ongoing challenges you are participating on"
                        icon={Flame}
                    />
                </div>
            </section>

            {/* Performance */}
            <section className="rounded-3xl border border-border bg-card bg-[#f5f5f5] p-5 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h3 className="text-base font-semibold">
                            Portfolio performance
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Track how your portfolio changes over time.
                        </p>
                    </div>

                    <div className="flex items-center gap-1 rounded-full bg-muted p-1">
                        {periods.map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => setPeriod(item)}
                                aria-pressed={period === item}
                                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                                    period === item
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-5">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-semibold">+8.6%</span>
                    </div>
                    <PerformanceChart period={period} />
                </div>

                <p className="mt-4 text-xs text-muted-foreground">
                    Demo chart only. Connect verified portfolio history before
                    displaying performance or returns to users.
                </p>
            </section>

            {/* Experts and transactions */}
            <section className="grid">
                <div className="w-full flex justify-center items-center">
                    <button className="flex gap-2 text-secondary border border-border rounded-xl p-3 group-hover:text-black/15">
                        <ArrowLeftRight size={16}/> View recent activities
                    </button>
                </div>
            </section>

            {/* Wallet action dialog */}
            {action && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
                    onClick={() => setAction(null)}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="wallet-action-title"
                        className="w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 id="wallet-action-title" className="text-xl font-semibold">
                                    {action}
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {action === 'Deposit'
                                        ? 'Add funds to your HWALN wallet.'
                                        : action === 'Transfer'
                                            ? 'Move funds between your wallet and an eligible destination.'
                                            : 'Request a withdrawal from your available balance.'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setAction(null)}
                                className="rounded-full p-2 text-muted-foreground transition hover:bg-muted"
                                aria-label="Close dialog"
                            >
                                <ChevronDown size={18} />
                            </button>
                        </div>

                        <form onSubmit={submitAction} className="mt-6 space-y-4">
                            <div className="flex items-center justify-between gap-3">
                                <label htmlFor="wallet-amount" className="text-sm font-medium">
                                    Amount
                                </label>
                                <CurrencySwitch
                                    currency={currency}
                                    onChange={setCurrency}
                                />
                            </div>

                            <div className="flex h-12 items-center rounded-xl border border-border bg-background focus-within:ring-2 focus-within:ring-ring pr-4">
                                <input
                                    id="wallet-amount"
                                    type="number"
                                    min="0.01"
                                    step={currency === 'USD' ? '0.01' : '1'}
                                    required
                                    value={amount}
                                    onChange={(event) => {
                                        setAmount(event.target.value);
                                        setNotice('');
                                    }}
                                    placeholder={currency === 'USD' ? 'e.g. 25.00' : 'e.g. 25000'}
                                    className="h-full w-full rounded-xl bg-transparent px-3 outline-none"
                                />
                                <span className="text-sm font-bold text-muted-foreground">
                                    {currency}
                                </span>
                            </div>

                            <p className="text-xs text-muted-foreground">
                                Available balance:{' '}
                                <span className="font-medium text-foreground">
                                    {displayMoney(availableBalanceNgn)}
                                </span>
                            </p>

                            {currency === 'USD' && (
                                <p className="text-xs text-muted-foreground">
                                    Demo conversion rate: 1 USD = {USD_TO_NGN.toLocaleString('en-NG')} NGN
                                </p>
                            )}

                            {amount && Number(amount) > 0 && (
                                <p className="text-xs text-muted-foreground">
                                    Approximate NGN equivalent:{' '}
                                    {formatMoney(
                                        Number(amount) * (currency === 'USD' ? USD_TO_NGN : 1),
                                        'NGN',
                                    )}
                                </p>
                            )}

                            {notice && (
                                <p role="status" className="rounded-xl bg-muted p-3 text-sm">
                                    {notice}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="h-12 w-full rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                            >
                                Continue
                            </button>
                        </form>
                    </section>
                </div>
            )}
            <WalletActionModal
                isOpen={activeModal !== null}
                onClose={() => setActiveModal(null)}
                type={activeModal || 'deposit'}
                onSelectRoute={handleRouteNavigation}
            />
        </div>
    );
}