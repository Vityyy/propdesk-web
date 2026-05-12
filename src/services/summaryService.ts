import { API_BASE_URL } from "../config/api";
import { apiRequest } from "../utils/httpUtils";
import authService from "./authService";
import { isMockEnabled } from "../utils/mockApi";

export interface SummaryBreakdownData {
    grossRevenue: number;
    totalExpenses: number;
    adminCommission: number;
    netProfit: number;
}

export interface MonthlySummaryData {
    month: string;
    revenue: number;
    profit: number;
}

export interface SummaryResponse {
    totalCollectedThisMonth: number;
    collectedTrend: string;
    unpaidTenantsCount: number;
    totalTenantsCount: number;
    unpaidAmount: number;
    totalExpensesThisMonth: number;
    expensesTrend: string;
    monthlyBreakdown: SummaryBreakdownData;
    historicalData: MonthlySummaryData[];
}

const getRequiredToken = (): string => {
    const token = authService.getToken();
    if (!token) {
        if (isMockEnabled()) {
            return "mock-token";
        }
        throw new Error("No authentication token");
    }
    return token;
};

export const summaryService = {
    getSummary: (ownerId: string): Promise<SummaryResponse> => {
        return apiRequest<SummaryResponse>(`${API_BASE_URL}/owners/${ownerId}/summary`, {
            method: "GET",
            token: getRequiredToken(),
        });
    }
};
