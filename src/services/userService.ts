import { API_ENDPOINTS } from "../config/api";
import authService from "./authService";
import { ApiError, apiRequest } from "../utils/httpUtils";

export interface PropertyCreateRequest {
  name: string;
  address: string;
  ownerId: string;
}

export interface PropertyResponse {
  id: string;
  name: string;
  address: string;
  ownerId: string;
}

export interface ApartmentCreateRequest {
  name: string;
  propertyId: string;
}

export interface ApartmentResponse {
  id: string;
  name: string;
  propertyId: string;
}

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
  createProperty(data: PropertyCreateRequest): Promise<PropertyResponse> {
    return apiRequest<PropertyResponse>(API_ENDPOINTS.PROPERTIES.CREATE, {
      method: "POST",
      body: data,
      token: getRequiredToken(),
    });
  },

  createApartment(data: ApartmentCreateRequest): Promise<ApartmentResponse> {
    return apiRequest<ApartmentResponse>(API_ENDPOINTS.APARTMENTS.CREATE, {
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

