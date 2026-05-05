import { type Tenant, type TenantAssignment } from '../app/types/index';
import { API_ENDPOINTS } from "../config/api";
import authService from "./authService";
import { ApiError, apiRequest } from "../utils/httpUtils";


export interface TenantRequest {
  name: string;
  email: string;
  phone: string;
}

export interface TenantResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const getRequiredToken = (): string => {
  const token = authService.getToken();
  if (!token) {
    throw new ApiError("No authentication token", 401);
  }
  return token;
};

export const tenantService = {
  // Delete tenant
  deleteTenant(tenantId: string, ownerId: string): Promise<void> {
    return apiRequest<void>(API_ENDPOINTS.TENANTS.DELETE(tenantId, ownerId), {
      method: "DELETE",
      token: getRequiredToken(),
    });
  },
};
