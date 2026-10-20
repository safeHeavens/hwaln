'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Wallet, Building2, Users, X, ArrowRight, Bitcoin, UserSearch } from 'lucide-react';

export type ModalOption = {
    id: string;
    title: string;
    summary: string;
    icon: React.ElementType;
    flow: 'usd' | 'crypto' | 'agent';
    badge?: string;
};

interface WalletActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'deposit' | 'withdraw';
    onSelectRoute: (route: string) => void;
    returnTo?: string;
}

const DEPOSIT_OPTIONS: ModalOption[] = [
    {
        id: 'usd-deposit',
        title: 'USD',
        summary: 'Fund via Bank transfer and credit/debit cards',
        icon: Building2,
        flow: 'usd',
        badge: '',
    },
    {
        id: 'crypto-deposit',
        title: 'Crypto',
        summary: 'Fund your account with Bitcoin, USDT, USDC and more',
        icon: Bitcoin,
        flow: 'crypto',
        badge: '',
    },
    {
        id: 'payment-agent-deposit',
        title: 'Payment Agent',
        summary: 'Local currency bank transfers via verified regional agents',
        icon: UserSearch,
        flow: 'agent',
    },
];

const WITHDRAW_OPTIONS: ModalOption[] = [
    {
        id: 'crypto-withdraw',
        title: 'Crypto',
        summary: 'Quickly withdraw to your own external crypto wallets',
        icon: Bitcoin,
        flow: 'crypto',
        badge: '',
    },
    {
        id: 'payment-agent-withdraw',
        title: 'Payment Agent',
        summary: 'Withdraw in your local currency via a verified agent',
        icon: UserSearch,
        flow: 'agent',
    },
];

export default function WalletActionModal({
                                              isOpen,
                                              onClose,
                                              type,
                                              onSelectRoute,
                                              returnTo = '/portfolio',
                                          }: WalletActionModalProps) {
    const [mounted, setMounted] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Strict multi-platform background scroll locking (Mobile & Desktop)
    useEffect(() => {
        if (!isOpen) return;

        const body = document.body;
        const html = document.documentElement;

        const originalBodyOverflow = body.style.overflow;
        const originalBodyTouchAction = body.style.touchAction;
        const originalHtmlOverflow = html.style.overflow;

        // Lock document scrolling
        body.style.overflow = 'hidden';
        body.style.touchAction = 'none';
        html.style.overflow = 'hidden';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            body.style.overflow = originalBodyOverflow;
            body.style.touchAction = originalBodyTouchAction;
            html.style.overflow = originalHtmlOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!mounted || !isOpen) return null;

    const modalTitle = type === 'deposit' ? 'Deposit' : 'Withdraw';
    const modalSubtitle =
        type === 'deposit'
            ? 'Select your preferred deposit channel'
            : 'Select your preferred payout channel';
    const optionsList = type === 'deposit' ? DEPOSIT_OPTIONS : WITHDRAW_OPTIONS;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    const handleOptionSelect = (option: ModalOption) => {
        onClose();
        // Generates the clean Deriv-style query URL structure
        const basePath = `/dashboard/${type}`;
        const query = `?from=portfolio&depositSheet=1&flow=${option.flow}&returnTo=${encodeURIComponent(returnTo)}`;
        onSelectRoute(`${basePath}${query}`);
    };

    return createPortal(
        <div
            onClick={handleBackdropClick}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
            className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-[1000000000] flex items-end sm:items-center justify-center p-0 sm:p-4 text-left transition-opacity duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] animate-in fade-in"
        >
            <div
                ref={modalRef}
                className="relative z-[1000000000] w-full h-[70vh] sm:h-auto sm:max-w-md rounded-t-[2.5rem] sm:rounded-4xl border border-black/10 bg-white p-6 shadow-2xl dark:border-white/15 dark:bg-[#13161D] dark:text-white space-y-5 flex flex-col justify-between sm:justify-start transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] animate-in slide-in-from-bottom sm:zoom-in-95"
                role="dialog"
                aria-modal="true"
            >
                {/* Mobile Drag Handle */}
                <div className="mx-auto w-12 h-1.5 rounded-full bg-gray-300 dark:bg-white/20 sm:hidden -mt-2 shrink-0" />

                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <div>
                            <h3 className="text-lg sm:text-2xl font-extrabold text-gray-950 dark:text-white">{modalTitle}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 hidden">{modalSubtitle}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-400 transition bg-gray-100 hover:bg-gray-200 hover:text-gray-600 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Method Option Buttons */}
                <div className="space-y-3 overflow-y-auto pr-1 flex-1 sm:flex-initial overscroll-contain">
                    {optionsList.map((option) => {
                        const IconComp = option.icon;
                        return (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => handleOptionSelect(option)}
                                className="group w-full text-left flex items-center justify-between rounded-2xl border border-gray-200/70 bg-[#f8f9fa] p-4 transition-all hover:border-gray-700/50 hover:bg-gray-700/[0.1] hover:shadow-sm dark:border-white/10 dark:bg-[#1A1D26] dark:hover:border-emerald-400/50 dark:hover:bg-emerald-400/[0.05]"
                            >
                                <div className="flex items-start gap-3.5 min-w-0 pr-2">
                                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-transparent text-primary shadow-sm border border-gray-700 transition-colors group-hover:bg-transparent group-hover:text-primary dark:bg-transparent dark:text-emerald-400 dark:border-transparent dark:group-hover:bg-emerald-500 dark:group-hover:text-white">
                                        <IconComp size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-bold text-gray-950 dark:text-white">
                                                {option.title}
                                            </h4>
                                            {option.badge && (
                                                <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                                                    {option.badge}
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                            {option.summary}
                                        </p>
                                    </div>
                                </div>

                                <ArrowRight
                                    size={18}
                                    className="hidden shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-600 dark:text-gray-500 dark:group-hover:text-emerald-400"
                                />
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>,
        document.body
    );
}