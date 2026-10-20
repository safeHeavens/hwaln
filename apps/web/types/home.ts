export type AccountState = "unfunded" | "funded" | "copying";
export type Panel = "profile" | "notifications" | null;

export interface PortfolioData {
    portfolioValue: number;
    available: number;
    allocated: number;
    monthlyPnl: number;
    monthlyReturn: number;
    expert: string;
    expertStrategy: string;
}