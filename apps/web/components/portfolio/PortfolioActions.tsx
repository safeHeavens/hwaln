'use client';

import {
  ArrowLeftRight,
  Plus,
  Minus,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useWalletModal } from '@/Context/WalletModalContext'

interface PortfolioActionsProps {
  onNavigate: (route: string) => void;
  balanceVisible?: boolean;
  setBalanceVisible?: (visible: boolean) => void;
  showBalanceToggle?: boolean;
  className?: string;
}

const actions = [
  {
    label: 'Deposit',
    route: '/portfolio/wallet/deposit',
    Icon: Plus,
    primary: true,
    actionType: 'deposit' as const,
  },
  {
    label: 'Transfer',
    route: '/portfolio/wallet/transfer',
    Icon: ArrowLeftRight,
    primary: false,
    actionType: 'transfer' as const,
  },
  {
    label: 'Withdraw',
    route: '/portfolio/wallet/withdraw',
    Icon: Minus,
    primary: false,
    actionType: 'withdraw' as const,
  },
];

export default function PortfolioActions({
                                           onNavigate,
                                           balanceVisible,
                                           setBalanceVisible,
                                           showBalanceToggle = true,
                                           className = '',
                                         }: PortfolioActionsProps) {
  const { openModal } = useWalletModal();

  const handleActionClick = (route: string, actionType: 'deposit' | 'transfer' | 'withdraw') => {
    if (actionType === 'deposit') {
      openModal('deposit');
    } else if (actionType === 'withdraw') {
      openModal('withdraw');
    } else {
      onNavigate(route);
    }
  };

  return (
      <div className={`flex flex-col gap-4 sm:items-start lg:items-end sm:items-end xl:items-end ${className}`}>
        {/* Balance visibility: top-right, above the actions */}
        <div className="w-100 flex justify-end lg:-mb-6">
          {showBalanceToggle &&
              typeof balanceVisible === 'boolean' &&
              setBalanceVisible && (
                  <button
                      type="button"
                      onClick={() => setBalanceVisible(!balanceVisible)}
                      aria-label={
                        balanceVisible ? 'Hide balance' : 'Show balance'
                      }
                      className="hidden lg:inline-flex items-center justify-center
                text-white/75 transition-colors hover:text-white
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-white/50 rounded-full"
                  >
                    {balanceVisible ? (
                        <Eye size={19} />
                    ) : (
                        <EyeOff size={19} />
                    )}
                  </button>
              )}
        </div>

        {/* Navigation actions */}
        <div className="flex justify-around mt-0 lg:mt-8 gap-5 sm:gap-10">
          {actions.map(({ label, route, Icon, primary, actionType }) => (
              <button
                  key={label}
                  type="button"
                  onClick={() => handleActionClick(route, actionType)}
                  className="group flex w-14 shrink-0 flex-col items-center gap-2
              rounded-xl text-white/90 transition-colors
              hover:text-white focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-white/50"
              >
            <span
                className={`flex size-12 items-center justify-center
                rounded-full transition-transform group-hover:scale-105
                ${
                    primary
                        ? 'bg-emerald-400 text-emerald-950'
                        : 'bg-white/10 text-white backdrop-blur-sm'
                }`}
            >
              <Icon size={21} strokeWidth={1.8} />
            </span>

                <span className="text-xs font-medium">{label}</span>
              </button>
          ))}
        </div>
      </div>
  );
}