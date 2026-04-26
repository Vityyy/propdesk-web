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
  propertyPicture: string;
  ranges: ApartmentRangeData[];
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
  name: string;
  propertyId: string;
}

export interface TenantGridResponse {
  id: string;
  name: string;
}

export interface ApartmentGridResponse {
  id: string;
  dueDate: string;
  paymentStatus: 'PAID' | string;
  squareMeters: number;
  rent: number;
  tenant: TenantGridResponse | null;
}

export type PropertyApartmentsGridResponse = Record<number, Record<number, ApartmentGridResponse>>;

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
    throw new ApiError("No hay token de autenticacion", 401);
  }
  return token;
};

export const userService = {
  // Loads available admins so owners can choose who to associate with.
  listAdmins(): Promise<AdminSummary[]> {
    return apiRequest<AdminSummary[]>(API_ENDPOINTS.ADMINS.LIST, {
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

  listProperties(): Promise<PropertyResponse[]> {
    return apiRequest<PropertyResponse[]>(API_ENDPOINTS.PROPERTIES.LIST, {
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

  deleteProperty(propertyId: string): Promise<void> {
    return apiRequest<void>(`${API_ENDPOINTS.PROPERTIES.BASE}/${propertyId}`, {
      method: "DELETE",
      token: getRequiredToken(),
    });
  },

  listApartments(): Promise<ApartmentResponse[]> {
    return apiRequest<ApartmentResponse[]>(API_ENDPOINTS.APARTMENTS.LIST, {
      method: "GET",
      token: getRequiredToken(),
    });
  },

  getPropertyApartmentsGrid(propertyId: string): Promise<PropertyApartmentsGridResponse> {
    return apiRequest<PropertyApartmentsGridResponse>(`${API_ENDPOINTS.PROPERTIES.BASE}/${propertyId}/apartments`, {
      method: "GET",
      token: getRequiredToken(),
    });
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
};

export default userService;
