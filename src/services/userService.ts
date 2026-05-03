import { API_ENDPOINTS } from "../config/api";
import authService from "./authService";
import { ApiError, apiRequest } from "../utils/httpUtils";

export interface PropertyCreateRequest {
  name: string;
  address: string;
  ownerId: string;
}

export interface ApartmentRangeData {
  startFloor: number;
  endFloor: number;
  startApartmentNumber: number;
  endApartmentNumber: number;
  squareMeters: number;
  rentValue: number;
}

export interface NewPropertyCreateRequest {
  propertyName: string;
  propertyAddress: string;
  pictureUrl: string;
  ownerId: string;
  apartmentRanges: ApartmentRangeData[];
}

export interface AdminSummary {
  id: string;
  name: string;
}

export interface PropertyResponse {
  id: string;
  name: string;
  address: string;
  ownerId: string;
}

export interface AssociateAdminRequest {
  adminId: string;
  adminCut?: number;
}

export interface OwnerAdminAssociationResponse {
  ownerId: string;
  ownerName: string;
  adminId: string;
  adminName: string;
  adminCut: number | null;
}

export interface ApartmentCreateRequest {
  name: string;
  propertyId: string;
  amount_due: number;
}

export interface ApartmentResponse {
  id: string;
  number: number;
  propertyId: string;
}

// ─── Tenant ──────────────────────────────────────────────────────────────────

export interface TenantGridResponse {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
}

export interface TenantRequest {
  name: string;
  phone?: string;
  email?: string;
}

// ─── Expense ─────────────────────────────────────────────────────────────────

export interface ApartmentExpenseResponse {
  id: string;
  amount: number;
  description: string;
}

export interface ApartmentExpenseRequest {
  amount: number;
  description: string;
}

// ─── Maintenance Fee ─────────────────────────────────────────────────────────

export interface MaintenanceFeeResponse {
  id: string;
  category: string;
  description: string;
  amount: number;
}

export interface MaintenanceFeeRequest {
  category: string;
  description: string;
  amount: number;
}

// ─── Apartment grid ──────────────────────────────────────────────────────────

export interface ApartmentGridResponse {
  id: string;
  number: number;
  dueDate: string;
  paymentStatus: 'PAID' | 'PENDING' | string;
  squareMeters: number;
  rent: number;
  tenant: TenantGridResponse | null;
  expenses: ApartmentExpenseResponse[];
  maintenanceFees: MaintenanceFeeResponse[];
}

export type PropertyApartmentsGridResponse = Record<number, Record<number, ApartmentGridResponse>>;
export type OwnerApartmentsGridResponse = Record<string, PropertyApartmentsGridResponse>;

export interface ExpenseCreateRequest {
  category: string;
  description: string;
  amount: number;
  date: string;
  propertyId: string;
}

export interface ExpenseResponse {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  propertyId: string;
}

const getRequiredToken = (): string => {
  const token = authService.getToken();
  if (!token) {
    throw new ApiError("No authentication token", 401);
  }
  return token;
};

const propertyApartmentsGridCache = new Map<string, PropertyApartmentsGridResponse>();
const propertyApartmentsGridRequests = new Map<string, Promise<PropertyApartmentsGridResponse>>();

export const userService = {
  // Loads available admins so owners can choose who to associate with.
  listAdmins(): Promise<AdminSummary[]> {
    return apiRequest<AdminSummary[]>(API_ENDPOINTS.ADMINS.LIST, {
      method: "GET",
      token: getRequiredToken(),
    });
  },

  // Loads owners linked to the authenticated admin
  listMyOwners(): Promise<AdminSummary[]> {
    return apiRequest<AdminSummary[]>(API_ENDPOINTS.ADMINS.GET_MY_OWNERS, {
      method: "GET",
      token: getRequiredToken(),
    });
  },

  // Associates the authenticated owner with the selected admin account.
  associateAdmin(data: AssociateAdminRequest): Promise<OwnerAdminAssociationResponse> {
    return apiRequest<OwnerAdminAssociationResponse>(API_ENDPOINTS.OWNERS.ASSOCIATE_ADMIN, {
      method: "POST",
      body: data,
      token: getRequiredToken(),
    });
  },

  listProperties(currentOwnerId: string): Promise<PropertyResponse[]> {
    return apiRequest<PropertyResponse[]>(API_ENDPOINTS.PROPERTIES.LIST(currentOwnerId), {
      method: "GET",
      token: getRequiredToken(),
    });
  },

  createProperty(data: PropertyCreateRequest): Promise<PropertyResponse> {
    return apiRequest<PropertyResponse>(API_ENDPOINTS.PROPERTIES.CREATE, {
      method: "POST",
      body: data,
      token: getRequiredToken(),
    });
  },

  createPropertyWithRanges(data: NewPropertyCreateRequest): Promise<PropertyResponse> {
    return apiRequest<PropertyResponse>(API_ENDPOINTS.PROPERTIES.CREATE, {
      method: "POST",
      body: data,
      token: getRequiredToken(),
    });
  },

  updateProperty(propertyId: string, data: { propertyName?: string; propertyAddress?: string }): Promise<PropertyResponse> {
    return apiRequest<PropertyResponse>(`${API_ENDPOINTS.PROPERTIES.BASE}/${propertyId}`, {
      method: "PUT",
      body: data,
      token: getRequiredToken(),
    });
  },

  deleteProperty(propertyId: string): Promise<void> {
    return apiRequest<void>(`${API_ENDPOINTS.PROPERTIES.BASE}/${propertyId}`, {
      method: "DELETE",
      token: getRequiredToken(),
    });
  },

  listApartments(ownerId?: string): Promise<ApartmentResponse[]> {
    return apiRequest<ApartmentResponse[]>(`${API_ENDPOINTS.APARTMENTS.LIST(ownerId ?? '')}`, {
      method: "GET",
      token: getRequiredToken(),
    });
  },

  getPropertyApartmentsGrid(
    propertyId: string,
    options?: { forceRefresh?: boolean }
  ): Promise<PropertyApartmentsGridResponse> {
    if (!options?.forceRefresh) {
      const cached = propertyApartmentsGridCache.get(propertyId);
      if (cached) {
        return Promise.resolve(cached);
      }

      const inFlight = propertyApartmentsGridRequests.get(propertyId);
      if (inFlight) {
        return inFlight;
      }
    }

    const request = apiRequest<PropertyApartmentsGridResponse>(`${API_ENDPOINTS.PROPERTIES.BASE}/${propertyId}/apartments`, {
      method: "GET",
      token: getRequiredToken(),
    }).then((grid) => {
      propertyApartmentsGridCache.set(propertyId, grid);
      propertyApartmentsGridRequests.delete(propertyId);
      return grid;
    }).catch((error) => {
      propertyApartmentsGridRequests.delete(propertyId);
      throw error;
    });

    propertyApartmentsGridRequests.set(propertyId, request);
    return request;
  },

  getOwnerApartmentsGrid(ownerId?: string, options?: { forceRefresh?: boolean }): Promise<OwnerApartmentsGridResponse> {
    if (options?.forceRefresh) {
      propertyApartmentsGridCache.clear();
      propertyApartmentsGridRequests.clear();
    }

    const url = ownerId ? `${API_ENDPOINTS.PROPERTIES.APARTMENTS}?ownerId=${ownerId}` : API_ENDPOINTS.PROPERTIES.APARTMENTS;
    return apiRequest<OwnerApartmentsGridResponse>(url, {
      method: "GET",
      token: getRequiredToken(),
    }).then((response) => {
      Object.entries(response).forEach(([propertyId, grid]) => {
        propertyApartmentsGridCache.set(propertyId, grid);
      });
      return response;
    });
  },

  invalidatePropertyApartmentsGrid(propertyId: string): void {
    propertyApartmentsGridCache.delete(propertyId);
    propertyApartmentsGridRequests.delete(propertyId);
  },

  createApartments(data: ApartmentCreateRequest[]): Promise<ApartmentResponse[]> {
    return apiRequest<ApartmentResponse[]>(API_ENDPOINTS.APARTMENTS.CREATE, {
      method: "POST",
      body: data,
      token: getRequiredToken(),
    });
  },

  createExpense(data: ExpenseCreateRequest): Promise<ExpenseResponse> {
    return apiRequest<ExpenseResponse>(API_ENDPOINTS.EXPENSES.CREATE, {
      method: "POST",
      body: data,
      token: getRequiredToken(),
    });
  },

  updateApartment(apartmentId: string, data: { rent?: number; squareMeters?: number; dueDate?: string; paymentStatus?: 'PAID' | 'PENDING' | 'OVERDUE' | string }): Promise<ApartmentResponse> {
    return apiRequest<ApartmentResponse>(`${API_ENDPOINTS.APARTMENTS.BASE}/${apartmentId}`, {
      method: "PUT",
      body: data,
      token: getRequiredToken(),
    });
  },

  bulkUpdateApartments(data: { apartmentIds: string[]; rent?: number; squareMeters?: number }): Promise<void> {
    return apiRequest<void>(`${API_ENDPOINTS.APARTMENTS.BASE}/bulk`, {
      method: "PUT",
      body: data,
      token: getRequiredToken(),
    });
  },

  addSingleApartment(data: { propertyId: string; floor: number; number: number; rent: number; squareMeters: number }): Promise<ApartmentResponse> {
    return apiRequest<ApartmentResponse>(`${API_ENDPOINTS.APARTMENTS.BASE}/single`, {
      method: "POST",
      body: data,
      token: getRequiredToken(),
    });
  },

  deleteApartment(apartmentId: string): Promise<void> {
    return apiRequest<void>(`${API_ENDPOINTS.APARTMENTS.BASE}/${apartmentId}`, {
      method: "DELETE",
      token: getRequiredToken(),
    });
  },

  // ─── Tenant management ───────────────────────────────────────────────────

  assignTenant(apartmentId: string, data: TenantRequest): Promise<TenantGridResponse> {
    return apiRequest<TenantGridResponse>(API_ENDPOINTS.APARTMENTS.TENANT(apartmentId), {
      method: "POST",
      body: data,
      token: getRequiredToken(),
    });
  },

  updateTenant(apartmentId: string, data: TenantRequest): Promise<TenantGridResponse> {
    return apiRequest<TenantGridResponse>(API_ENDPOINTS.APARTMENTS.TENANT(apartmentId), {
      method: "PUT",
      body: data,
      token: getRequiredToken(),
    });
  },

  vacateApartment(apartmentId: string): Promise<void> {
    return apiRequest<void>(API_ENDPOINTS.APARTMENTS.TENANT(apartmentId), {
      method: "DELETE",
      token: getRequiredToken(),
    });
  },

  // ─── Expense management ──────────────────────────────────────────────────

  getExpenses(apartmentId: string): Promise<ApartmentExpenseResponse[]> {
    return apiRequest<ApartmentExpenseResponse[]>(API_ENDPOINTS.APARTMENTS.EXPENSES(apartmentId), {
      method: "GET",
      token: getRequiredToken(),
    });
  },

  addExpense(apartmentId: string, data: ApartmentExpenseRequest): Promise<ApartmentExpenseResponse> {
    return apiRequest<ApartmentExpenseResponse>(API_ENDPOINTS.APARTMENTS.EXPENSES(apartmentId), {
      method: "POST",
      body: data,
      token: getRequiredToken(),
    });
  },

  deleteExpense(apartmentId: string, expenseId: string): Promise<void> {
    return apiRequest<void>(API_ENDPOINTS.APARTMENTS.EXPENSE(apartmentId, expenseId), {
      method: "DELETE",
      token: getRequiredToken(),
    });
  },

  // ─── Maintenance Fee management ──────────────────────────────────────────

  getMaintenanceFees(apartmentId: string): Promise<MaintenanceFeeResponse[]> {
    return apiRequest<MaintenanceFeeResponse[]>(API_ENDPOINTS.APARTMENTS.MAINTENANCE_FEES(apartmentId), {
      method: "GET",
      token: getRequiredToken(),
    });
  },

  addMaintenanceFee(apartmentId: string, data: MaintenanceFeeRequest): Promise<MaintenanceFeeResponse> {
    return apiRequest<MaintenanceFeeResponse>(API_ENDPOINTS.APARTMENTS.MAINTENANCE_FEES(apartmentId), {
      method: "POST",
      body: data,
      token: getRequiredToken(),
    });
  },

  deleteMaintenanceFee(apartmentId: string, feeId: string): Promise<void> {
    return apiRequest<void>(API_ENDPOINTS.APARTMENTS.MAINTENANCE_FEE(apartmentId, feeId), {
      method: "DELETE",
      token: getRequiredToken(),
    });
  },
};

export default userService;
