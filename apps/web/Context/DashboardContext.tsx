"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Panel } from "@/types/home";

interface DashboardContextType {
    panel: Panel;
    setPanel: (panel: Panel) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
    const [panel, setPanel] = useState<Panel>(null);

    return (
        <DashboardContext.Provider value={{ panel, setPanel }}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error("useDashboard must be used within a DashboardProvider");
    }
    return context;
}