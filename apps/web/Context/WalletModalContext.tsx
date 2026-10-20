"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import WalletActionModal from "@/components/portfolio/WalletActionModal";

type WalletModalType = "deposit" | "withdraw" | null;

interface WalletModalContextType {
    openModal: (type: WalletModalType) => void;
    closeModal: () => void;
}

const WalletModalContext = createContext<WalletModalContextType | undefined>(undefined);

export function WalletModalProvider({ children }: { children: ReactNode }) {
    const [modalType, setModalType] = useState<WalletModalType>(null);

    const openModal = (type: WalletModalType) => setModalType(type);
    const closeModal = () => setModalType(null);

    return (
        <WalletModalContext.Provider value={{ openModal, closeModal }}>
            {children}
            <WalletActionModal
                isOpen={modalType !== null}
                onClose={closeModal}
                type={modalType || "deposit"}
                onSelectRoute={(route) => {
                    window.location.href = route;
                }}
            />
        </WalletModalContext.Provider>
    );
}

export function useWalletModal() {
    const context = useContext(WalletModalContext);
    if (!context) {
        throw new Error("useWalletModal must be used within a WalletModalProvider");
    }
    return context;
}