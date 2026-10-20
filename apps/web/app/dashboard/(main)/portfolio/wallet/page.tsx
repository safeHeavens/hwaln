'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowDownLeft,
    ArrowLeftRight,
    ChevronDown,
    ChevronRight,
    CircleDollarSign,
    Eye,
    EyeOff,
    Plus,
    TrendingUp,
    Wallet,
    Bitcoin,
    Gem,
} from 'lucide-react';
import PortfolioActions from "@/components/portfolio/PortfolioActions";
import "./wallet.css";

const periods = ['1W', '1M', '3M', '6M', '1Y', 'ALL'] as const;
type Period = (typeof periods)[number];
type WalletAction = 'Deposit' | 'Transfer' | 'Withdraw';
type Currency = 'USD' | 'NGN';

// Demo FX rate fallback. Replace with live database/API rate when available.
const DEFAULT_USD_TO_NGN = 1500;

const performance: Record<Period, number[]> = {
    '1W': [32, 38, 35, 47, 43, 55, 51, 65, 61, 74, 70, 83],
    '1M': [22, 30, 27, 40, 35, 48, 45, 57, 52, 68, 64, 82],
    '3M': [18, 26, 22, 34, 30, 46, 42, 55, 50, 68, 61, 82],
    '6M': [15, 21, 18, 32, 27, 40, 38, 53, 47, 62, 59, 82],
    '1Y': [10, 18, 14, 26, 23, 36, 33, 45, 43, 60, 56, 82],
    ALL: [8, 13, 11, 22, 19, 31, 28, 42, 39, 57, 63, 82],
};

// ==========================================
// PRODUCTION DATA TYPES (Match your DB schema)
// ==========================================
export interface WalletPageData {
    portfolioNgn: number;
    overallReturnNgn: number;
    availableBalanceNgn: number;
    allocatedCapitalNgn: number;
    expertFollowing: number;
    activeStreaks: number;
    cryptoBalances: {
        bitcoin: number;
        ethereum: number;
        usdt: number;
    };
    usdToNgnRate?: number;
}

interface PortfolioWalletPageProps {
    initialData?: WalletPageData;
}

function formatMoney(amountNgn: number, currency: Currency, fxRate: number) {
    const amount = currency === 'USD' ? amountNgn / fxRate : amountNgn;

    const formattedValue = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: currency === 'USD' ? 2 : 0,
        maximumFractionDigits: currency === 'USD' ? 2 : 0,
    }).format(amount);

    return `${formattedValue} ${currency}`;
}

type CryptoPrices = {
    bitcoin: number;
    ethereum: number;
    tether: number;
};

function formatCryptoAmount(amount: number, decimals: number) {
    return amount.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

function formatUsdEquivalent(amount: number) {
    return `${amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} USD`;
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
                        onClick,
                        accent = 'default',
                        variant = 'default',
                        usdEquivalent,
                    }: {
    label: string;
    value: string | number;
    detail: string;
    icon: typeof Wallet;
    onClick?: () => void;
    accent?: 'default' | 'bitcoin' | 'ethereum' | 'usdt' | 'add';
    variant?: 'default' | 'fiat' | 'crypto';
    usdEquivalent?: string;
}) {
    const cardClassName = `
        group relative min-w-0 rounded-xl border-0
        sm:border-b sm:border-border/60
        bg-[#f5f5f5] bg-card p-3 transition-colors
        hover:bg-muted/30 sm:px-4 sm:py-3 lg:p-4
        ${onClick ? 'w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring' : ''}
    `;

    const accentStyles = {
        default: '',
        bitcoin: 'text-orange-500',
        ethereum: 'text-violet-500',
        usdt: 'text-emerald-600 dark:text-emerald-400',
        add: 'text-muted-foreground',
    };

    const content = (
        <div
            className={
                variant === 'fiat' || variant === 'crypto'
                    ? 'flex min-w-0 items-center justify-between gap-2'
                    : 'flex min-w-0 flex-col justify-between gap-1 sm:flex-row sm:items-center sm:gap-2.5'
            }
        >
            <div className="flex min-w-0 flex-1 items-center gap-2">
                <div
                    className={`flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted/70 ${
                        accentStyles[accent]
                    }`}
                >
                    <Icon size={20} className="shrink-0" />
                </div>

                <div className="flex min-w-0 items-center gap-1">
                    <p className="truncate text-sm font-medium text-muted-foreground sm:text-sm">
                        {label}
                    </p>
                </div>
            </div>

            <div
                className={
                    variant === 'fiat' || variant === 'crypto'
                        ? 'flex min-w-0 shrink-0 items-end gap-1'
                        : 'flex min-w-0 items-center justify-between gap-2 pl-10 sm:shrink-0 sm:pl-0'
                }
            >
                <div
                    className={
                        variant === 'crypto'
                            ? 'flex w-full flex-col text-right items-end justify-end gap-1'
                            : 'flex min-w-0 items-end'
                    }
                >
                    <p
                        className={
                            variant === 'fiat' || variant === 'crypto'
                                ? 'whitespace-nowrap text-right text-sm font-medium tracking-tight tabular-nums text-foreground sm:text-sm lg:text-base'
                                : 'ml-auto shrink-0 pl-2 text-right text-base font-semibold tracking-tight tabular-nums text-foreground sm:ml-0 sm:pl-0 sm:text-sm lg:text-base'
                        }
                    >
                        {value}
                    </p>

                    {variant === 'crypto' && usdEquivalent && (
                        <span className="block w-full whitespace-nowrap text-right text-[10px] font-medium tabular-nums text-muted-foreground sm:text-xs">
                            {usdEquivalent}
                        </span>
                    )}
                </div>

                {onClick && variant !== 'fiat' && variant !== 'crypto' && (
                    <ChevronRight
                        size={15}
                        className="hidden shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                    />
                )}
            </div>
        </div>
    );

    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                className={cardClassName}
                aria-label={`${label}: ${value}. ${detail}`}
            >
                {content}
            </button>
        );
    }

    return <div className={cardClassName}>{content}</div>;
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

export default function PortfolioWalletPage({ initialData }: PortfolioWalletPageProps) {
    const router = useRouter();

    const [period, setPeriod] = useState<Period>('1M');
    const [action, setAction] = useState<WalletAction | null>(null);
    const [amount, setAmount] = useState('');
    const [notice, setNotice] = useState('');

    const [currency, setCurrency] = useState<Currency>('USD');
    const [balanceVisible, setBalanceVisible] = useState(true);
    const [cryptoPrices, setCryptoPrices] = useState<CryptoPrices | null>(null);

    // ==========================================
    // PRODUCTION DATA SOURCE HOOK / STATE
    // ==========================================
    const [data, setData] = useState<WalletPageData>(
        initialData || {
            portfolioNgn: 1284500,
            overallReturnNgn: 101500,
            availableBalanceNgn: 384500,
            allocatedCapitalNgn: 900000,
            expertFollowing: 3,
            activeStreaks: 2,
            cryptoBalances: {
                bitcoin: 0.045,
                ethereum: 0.85,
                usdt: 250,
            },
            usdToNgnRate: DEFAULT_USD_TO_NGN,
        }
    );

    const fxRate = data.usdToNgnRate || DEFAULT_USD_TO_NGN;

    // Optional: Example of fetching live database data via a useEffect API call
    useEffect(() => {
        if (initialData) return; // Skip if server-provided

        async function fetchWalletData() {
            try {
                // Replace with your real backend API endpoint (e.g., /api/user/wallet)
                // const res = await fetch('/api/user/wallet');
                // const json = await res.json();
                // setData(json);
            } catch (err) {
                console.error("Failed to fetch wallet data:", err);
            }
        }

        void fetchWalletData();
    }, [initialData]);

    // Fetch crypto market prices
    useEffect(() => {
        let cancelled = false;

        async function fetchCryptoPrices() {
            try {
                const response = await fetch(
                    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd',
                    { cache: 'no-store' },
                );

                if (!response.ok) return;

                const result = await response.json();
                if (cancelled || !result) return;

                setCryptoPrices({
                    bitcoin: result.bitcoin?.usd || 0,
                    ethereum: result.ethereum?.usd || 0,
                    tether: result.tether?.usd || 0,
                });
            } catch (error) {
                console.error('Crypto price update failed:', error);
            }
        }

        void fetchCryptoPrices();
        const interval = window.setInterval(fetchCryptoPrices, 60_000);

        return () => {
            cancelled = true;
            window.clearInterval(interval);
        };
    }, []);

    function openWallet(route: string) {
        router.push(route);
    }

    function displayMoney(amountNgn: number) {
        return balanceVisible ? formatMoney(amountNgn, currency, fxRate) : '********';
    }

    function submitAction(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const enteredAmount = Number(amount);

        if (!amount || !Number.isFinite(enteredAmount) || enteredAmount <= 0) {
            setNotice('Enter an amount greater than zero.');
            return;
        }

        if (action === 'Transfer' || action === 'Withdraw') {
            const amountInNgn = currency === 'USD' ? enteredAmount * fxRate : enteredAmount;

            if (amountInNgn > data.availableBalanceNgn) {
                setNotice('This amount exceeds your available wallet balance.');
                return;
            }
        }

        setNotice(`${action} request UI is ready. Connected to backend state.`);
    }

    return (
        <div className="relative space-y-6 pb-8">
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
                <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-teal-400/15 blur-3xl dark:bg-lime-200/30" />
                <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl dark:bg-emerald-950/20" />

                <div className="relative z-10 p-5 sm:p-7 lg:p-8">
                    <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10">
                        <div className="min-w-0">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 text-sm text-white/75">
                                    <span>Total wallet value</span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setBalanceVisible((v) => !v)}
                                    aria-label={balanceVisible ? 'Hide balances' : 'Show balances'}
                                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white lg:hidden"
                                >
                                    {balanceVisible ? <Eye size={19} /> : <EyeOff size={19} />}
                                </button>
                            </div>

                            <h2 className="mt-3 break-words text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
                                {displayMoney(data.portfolioNgn)}
                            </h2>
                        </div>

                        <PortfolioActions
                            balanceVisible={balanceVisible}
                            setBalanceVisible={setBalanceVisible}
                        />
                    </div>
                </div>
            </section>

            {/* Fiat Wallet */}
            <section>
                <div className="mb-1 flex py-4">
                    <h2 className="text-lg font-semibold text-primary lg:text-lg">
                        Fiat Wallet
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-2">
                    <MetricCard
                        label="US Dollar"
                        value={displayMoney(data.availableBalanceNgn)}
                        detail="Available for transfers or allocation"
                        icon={Wallet}
                        variant="fiat"
                        onClick={() => openWallet('/portfolio/wallets/usd')}
                    />

                    <MetricCard
                        label="Nigerian NGN"
                        value={balanceVisible ? formatMoney(data.allocatedCapitalNgn, 'NGN', fxRate) : '********'}
                        detail="Currently allocated to copy trading"
                        icon={CircleDollarSign}
                        variant="fiat"
                        onClick={() => openWallet('/portfolio/wallets/ngn')}
                    />
                </div>
            </section>

            {/* Cryptocurrencies */}
            <section className="flex flex-col gap-3">
                <div className="w-full py-4">
                    <h2 className="text-lg font-semibold text-primary">
                        Cryptocurrencies
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:gap-x-4 sm:grid-cols-2 xl:grid-cols-2 mb-2">
                    <MetricCard
                        label="Bitcoin"
                        value={balanceVisible ? `${formatCryptoAmount(data.cryptoBalances.bitcoin, 8)} BTC` : '********'}
                        detail="View your Bitcoin wallet"
                        icon={Bitcoin}
                        accent="bitcoin"
                        variant="crypto"
                        usdEquivalent={
                            balanceVisible
                                ? cryptoPrices
                                    ? formatUsdEquivalent(data.cryptoBalances.bitcoin * cryptoPrices.bitcoin)
                                    : 'Loading price…'
                                : '******** USD'
                        }
                        onClick={() => openWallet('/portfolio/wallets/crypto/bitcoin')}
                    />

                    <MetricCard
                        label="Ethereum"
                        value={balanceVisible ? `${formatCryptoAmount(data.cryptoBalances.ethereum, 8)} ETH` : '********'}
                        detail="View your Ethereum wallet"
                        icon={Gem}
                        accent="ethereum"
                        variant="crypto"
                        usdEquivalent={
                            balanceVisible
                                ? cryptoPrices
                                    ? formatUsdEquivalent(data.cryptoBalances.ethereum * cryptoPrices.ethereum)
                                    : 'Loading price…'
                                : '******** USD'
                        }
                        onClick={() => openWallet('/portfolio/wallets/crypto/ethereum')}
                    />

                    <MetricCard
                        label="USDT"
                        value={balanceVisible ? `${formatCryptoAmount(data.cryptoBalances.usdt, 6)} USDT` : '********'}
                        detail="View your Tether wallet"
                        icon={CircleDollarSign}
                        accent="usdt"
                        variant="crypto"
                        usdEquivalent={
                            balanceVisible
                                ? cryptoPrices
                                    ? formatUsdEquivalent(data.cryptoBalances.usdt * cryptoPrices.tether)
                                    : 'Loading price…'
                                : '******** USD'
                        }
                        onClick={() => openWallet('/portfolio/wallets/crypto/usdt')}
                    />

                    <button
                        type="button"
                        onClick={() => router.push('/portfolio/wallets/add')}
                        className="group sm:flex hidden min-h-[150px] items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 bg-card p-4 text-center transition-colors hover:border-primary/40 hover:bg-muted/30"
                    >
                        <div className="mr-3 flex size-8 items-center justify-center rounded-full border border-border bg-muted/60">
                            <Plus size={18} strokeWidth={2} className="text-muted-foreground" />
                        </div>
                        <span className="text-sm font-semibold text-foreground">Add wallet</span>
                    </button>
                </div>
            </section>

            {/* Transactions */}
            <section className="mt-12 grid">
                <div className="flex w-full items-center justify-center">
                    <button
                        type="button"
                        onClick={() => openWallet('/portfolio/transactions')}
                        className="flex gap-2 rounded-xl border border-border p-3 text-secondary transition hover:text-foreground"
                    >
                        <ArrowLeftRight size={16} />
                        View all transactions
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
                                <CurrencySwitch currency={currency} onChange={setCurrency} />
                            </div>

                            <div className="flex h-12 items-center rounded-xl border border-border bg-background pr-4">
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
                                    {displayMoney(data.availableBalanceNgn)}
                                </span>
                            </p>

                            {currency === 'USD' && (
                                <p className="text-xs text-muted-foreground">
                                    Exchange rate: 1 USD = {fxRate.toLocaleString('en-NG')} NGN
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
        </div>
    );
}