import type { TokenResponse, UserResponse } from "../services/authService";
import type { SummaryResponse } from "../services/summaryService";
import type {
  ApartmentExpenseResponse,
  ApartmentGridResponse,
  ApartmentResponse,
  MaintenanceFeeResponse,
  OwnerApartmentsGridResponse,
  OwnerAssociationRequestSummary,
  OwnerSummary,
  PropertyApartmentsGridResponse,
  PropertyResponse,
  TenantGridResponse,
} from "../services/userService";

const MOCK_OWNER_ID = "owner-portfolio";
const MOCK_ADMIN_ID = "admin-portfolio";

const base64UrlEncode = (value: string): string =>
  btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");

const buildMockToken = (role: "OWNER" | "ADMIN", sub: string): string => {
  const header = base64UrlEncode(JSON.stringify({ alg: "none", typ: "JWT" }));
  const payload = base64UrlEncode(
    JSON.stringify({ sub, role, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 })
  );
  return `${header}.${payload}.mock`;
};

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const isMockEnabled = (): boolean => {
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_USE_MOCK_DATA === "true") {
    return true;
  }

  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.localStorage.getItem("gdsi_mock_data") === "true";
  } catch {
    return false;
  }
};

const tenants: Record<string, TenantGridResponse> = {
  "tenant-olivia": { id: "tenant-olivia", name: "Olivia Hart", email: "olivia.hart@example.com", phone: "+1 617-555-0142" },
  "tenant-marcus": { id: "tenant-marcus", name: "Marcus Lee", email: "marcus.lee@example.com", phone: "+1 512-555-0118" },
  "tenant-sophia": { id: "tenant-sophia", name: "Sophia Reyes", email: "sophia.reyes@example.com", phone: "+1 303-555-0194" },
  "tenant-ethan": { id: "tenant-ethan", name: "Ethan Carter", email: "ethan.carter@example.com", phone: "+1 617-555-0128" },
  "tenant-ava": { id: "tenant-ava", name: "Ava Patel", email: "ava.patel@example.com", phone: "+1 512-555-0189" },
  "tenant-nora": { id: "tenant-nora", name: "Nora King", email: "nora.king@example.com", phone: "+1 303-555-0171" },
  "tenant-liam": { id: "tenant-liam", name: "Liam Brooks", email: "liam.brooks@example.com", phone: "+1 617-555-0156" },
  "tenant-maya": { id: "tenant-maya", name: "Maya Nguyen", email: "maya.nguyen@example.com", phone: "+1 512-555-0124" },
};

const createExpense = (id: string, amount: number, description: string): ApartmentExpenseResponse => ({
  id,
  amount,
  description,
});

const createFee = (id: string, category: string, description: string, amount: number): MaintenanceFeeResponse => ({
  id,
  category,
  description,
  amount,
});

const createApartment = (params: {
  id: string;
  number: number;
  rent: number;
  squareMeters: number;
  paymentStatus: "PAID" | "PENDING";
  tenant: TenantGridResponse | null;
  expenses: ApartmentExpenseResponse[];
  maintenanceFees: MaintenanceFeeResponse[];
  dueDate: string;
}): ApartmentGridResponse => ({
  id: params.id,
  number: params.number,
  dueDate: params.dueDate,
  paymentStatus: params.paymentStatus,
  squareMeters: params.squareMeters,
  rent: params.rent,
  tenant: params.tenant,
  expenses: params.expenses,
  maintenanceFees: params.maintenanceFees,
});

const mockProperties: PropertyResponse[] = [
  {
    id: "prop-aurora",
    name: "Aurora Heights",
    address: "1208 Beacon St, Brookline, MA",
    imageUrl: "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=900&q=80",
    ownerId: MOCK_OWNER_ID,
  },
  {
    id: "prop-riverview",
    name: "Riverview Lofts",
    address: "42 Riverwalk Ave, Austin, TX",
    imageUrl: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=900&q=80",
    ownerId: MOCK_OWNER_ID,
  },
  {
    id: "prop-summit",
    name: "Summit Gardens",
    address: "300 Highland Dr, Denver, CO",
    imageUrl: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=80",
    ownerId: MOCK_OWNER_ID,
  },
];

const mockApartments: ApartmentResponse[] = [
  { id: "apt-aurora-101", number: 101, propertyId: "prop-aurora" },
  { id: "apt-aurora-102", number: 102, propertyId: "prop-aurora" },
  { id: "apt-aurora-201", number: 201, propertyId: "prop-aurora" },
  { id: "apt-aurora-202", number: 202, propertyId: "prop-aurora" },
  { id: "apt-aurora-301", number: 301, propertyId: "prop-aurora" },
  { id: "apt-aurora-302", number: 302, propertyId: "prop-aurora" },
  { id: "apt-river-101", number: 101, propertyId: "prop-riverview" },
  { id: "apt-river-102", number: 102, propertyId: "prop-riverview" },
  { id: "apt-river-201", number: 201, propertyId: "prop-riverview" },
  { id: "apt-river-202", number: 202, propertyId: "prop-riverview" },
  { id: "apt-river-301", number: 301, propertyId: "prop-riverview" },
  { id: "apt-river-302", number: 302, propertyId: "prop-riverview" },
  { id: "apt-summit-101", number: 101, propertyId: "prop-summit" },
  { id: "apt-summit-102", number: 102, propertyId: "prop-summit" },
  { id: "apt-summit-201", number: 201, propertyId: "prop-summit" },
  { id: "apt-summit-202", number: 202, propertyId: "prop-summit" },
  { id: "apt-summit-301", number: 301, propertyId: "prop-summit" },
  { id: "apt-summit-302", number: 302, propertyId: "prop-summit" },
];

const mockPropertyGrids: Record<string, PropertyApartmentsGridResponse> = {
  "prop-aurora": {
    1: {
      101: createApartment({
        id: "apt-aurora-101",
        number: 101,
        rent: 2650,
        squareMeters: 68,
        paymentStatus: "PAID",
        tenant: tenants["tenant-olivia"],
        expenses: [createExpense("exp-aurora-101-1", 120, "Lobby lighting")],
        maintenanceFees: [createFee("fee-aurora-101-1", "CLEANING", "Weekly common area cleaning", 90)],
        dueDate: "2026-05-05",
      }),
      102: createApartment({
        id: "apt-aurora-102",
        number: 102,
        rent: 2450,
        squareMeters: 62,
        paymentStatus: "PENDING",
        tenant: tenants["tenant-ethan"],
        expenses: [createExpense("exp-aurora-102-1", 180, "Elevator service")],
        maintenanceFees: [createFee("fee-aurora-102-1", "SECURITY", "Front desk coverage", 140)],
        dueDate: "2026-05-10",
      }),
    },
    2: {
      201: createApartment({
        id: "apt-aurora-201",
        number: 201,
        rent: 2850,
        squareMeters: 74,
        paymentStatus: "PAID",
        tenant: tenants["tenant-liam"],
        expenses: [createExpense("exp-aurora-201-1", 220, "HVAC tune-up")],
        maintenanceFees: [createFee("fee-aurora-201-1", "GENERAL", "Building insurance", 160)],
        dueDate: "2026-05-03",
      }),
      202: createApartment({
        id: "apt-aurora-202",
        number: 202,
        rent: 2300,
        squareMeters: 60,
        paymentStatus: "PAID",
        tenant: null,
        expenses: [createExpense("exp-aurora-202-1", 95, "Window repairs")],
        maintenanceFees: [],
        dueDate: "2026-05-01",
      }),
    },
    3: {
      301: createApartment({
        id: "apt-aurora-301",
        number: 301,
        rent: 2950,
        squareMeters: 78,
        paymentStatus: "PAID",
        tenant: tenants["tenant-sophia"],
        expenses: [createExpense("exp-aurora-301-1", 140, "Roof inspection")],
        maintenanceFees: [createFee("fee-aurora-301-1", "AMENITIES", "Gym upkeep", 110)],
        dueDate: "2026-05-06",
      }),
      302: createApartment({
        id: "apt-aurora-302",
        number: 302,
        rent: 2550,
        squareMeters: 65,
        paymentStatus: "PENDING",
        tenant: tenants["tenant-maya"],
        expenses: [createExpense("exp-aurora-302-1", 160, "Fire alarm check")],
        maintenanceFees: [createFee("fee-aurora-302-1", "GENERAL", "Landscaping", 85)],
        dueDate: "2026-05-09",
      }),
    },
  },
  "prop-riverview": {
    1: {
      101: createApartment({
        id: "apt-river-101",
        number: 101,
        rent: 2100,
        squareMeters: 58,
        paymentStatus: "PAID",
        tenant: tenants["tenant-marcus"],
        expenses: [createExpense("exp-river-101-1", 110, "Pool maintenance")],
        maintenanceFees: [createFee("fee-river-101-1", "AMENITIES", "Pool service", 130)],
        dueDate: "2026-05-04",
      }),
      102: createApartment({
        id: "apt-river-102",
        number: 102,
        rent: 2050,
        squareMeters: 56,
        paymentStatus: "PAID",
        tenant: tenants["tenant-ava"],
        expenses: [createExpense("exp-river-102-1", 90, "Hallway paint")],
        maintenanceFees: [createFee("fee-river-102-1", "CLEANING", "Trash pickup", 75)],
        dueDate: "2026-05-02",
      }),
    },
    2: {
      201: createApartment({
        id: "apt-river-201",
        number: 201,
        rent: 2250,
        squareMeters: 63,
        paymentStatus: "PENDING",
        tenant: tenants["tenant-nora"],
        expenses: [createExpense("exp-river-201-1", 130, "Security patrol")],
        maintenanceFees: [createFee("fee-river-201-1", "SECURITY", "Evening guard", 145)],
        dueDate: "2026-05-11",
      }),
      202: createApartment({
        id: "apt-river-202",
        number: 202,
        rent: 2150,
        squareMeters: 61,
        paymentStatus: "PAID",
        tenant: null,
        expenses: [createExpense("exp-river-202-1", 75, "Pest control")],
        maintenanceFees: [],
        dueDate: "2026-05-08",
      }),
    },
    3: {
      301: createApartment({
        id: "apt-river-301",
        number: 301,
        rent: 2400,
        squareMeters: 67,
        paymentStatus: "PAID",
        tenant: tenants["tenant-olivia"],
        expenses: [createExpense("exp-river-301-1", 115, "Roof sealing")],
        maintenanceFees: [createFee("fee-river-301-1", "GENERAL", "Elevator service", 105)],
        dueDate: "2026-05-07",
      }),
      302: createApartment({
        id: "apt-river-302",
        number: 302,
        rent: 2200,
        squareMeters: 60,
        paymentStatus: "PAID",
        tenant: tenants["tenant-ethan"],
        expenses: [createExpense("exp-river-302-1", 95, "Window cleaning")],
        maintenanceFees: [createFee("fee-river-302-1", "CLEANING", "Exterior wash", 80)],
        dueDate: "2026-05-05",
      }),
    },
  },
  "prop-summit": {
    1: {
      101: createApartment({
        id: "apt-summit-101",
        number: 101,
        rent: 2350,
        squareMeters: 64,
        paymentStatus: "PAID",
        tenant: tenants["tenant-sophia"],
        expenses: [createExpense("exp-summit-101-1", 125, "Garden upkeep")],
        maintenanceFees: [createFee("fee-summit-101-1", "AMENITIES", "Rooftop lounge", 120)],
        dueDate: "2026-05-03",
      }),
      102: createApartment({
        id: "apt-summit-102",
        number: 102,
        rent: 2200,
        squareMeters: 59,
        paymentStatus: "PENDING",
        tenant: tenants["tenant-liam"],
        expenses: [createExpense("exp-summit-102-1", 140, "Fence repair")],
        maintenanceFees: [createFee("fee-summit-102-1", "SECURITY", "Camera monitoring", 135)],
        dueDate: "2026-05-12",
      }),
    },
    2: {
      201: createApartment({
        id: "apt-summit-201",
        number: 201,
        rent: 2550,
        squareMeters: 70,
        paymentStatus: "PAID",
        tenant: tenants["tenant-maya"],
        expenses: [createExpense("exp-summit-201-1", 155, "Elevator inspection")],
        maintenanceFees: [createFee("fee-summit-201-1", "GENERAL", "Insurance premium", 150)],
        dueDate: "2026-05-04",
      }),
      202: createApartment({
        id: "apt-summit-202",
        number: 202,
        rent: 2450,
        squareMeters: 66,
        paymentStatus: "PAID",
        tenant: tenants["tenant-ava"],
        expenses: [createExpense("exp-summit-202-1", 105, "Snow removal")],
        maintenanceFees: [createFee("fee-summit-202-1", "CLEANING", "Lobby cleaning", 85)],
        dueDate: "2026-05-06",
      }),
    },
    3: {
      301: createApartment({
        id: "apt-summit-301",
        number: 301,
        rent: 2650,
        squareMeters: 72,
        paymentStatus: "PAID",
        tenant: tenants["tenant-nora"],
        expenses: [createExpense("exp-summit-301-1", 135, "HVAC filters")],
        maintenanceFees: [createFee("fee-summit-301-1", "AMENITIES", "Gym service", 115)],
        dueDate: "2026-05-02",
      }),
      302: createApartment({
        id: "apt-summit-302",
        number: 302,
        rent: 2500,
        squareMeters: 68,
        paymentStatus: "PAID",
        tenant: null,
        expenses: [createExpense("exp-summit-302-1", 90, "Paint touch-ups")],
        maintenanceFees: [],
        dueDate: "2026-05-09",
      }),
    },
  },
};

const mockOwnerGrid: OwnerApartmentsGridResponse = {
  "prop-aurora": mockPropertyGrids["prop-aurora"],
  "prop-riverview": mockPropertyGrids["prop-riverview"],
  "prop-summit": mockPropertyGrids["prop-summit"],
};

const mockSummary: SummaryResponse = {
  totalCollectedThisMonth: 119800,
  collectedTrend: "+4.2% vs last month",
  unpaidTenantsCount: 4,
  totalTenantsCount: 14,
  unpaidAmount: 11250,
  totalExpensesThisMonth: 32500,
  expensesTrend: "Down 6.1% from April",
  monthlyBreakdown: {
    grossRevenue: 152400,
    totalExpenses: 32500,
    adminCommission: 15240,
    netProfit: 104660,
  },
  historicalData: [
    { month: "Nov", revenue: 138000, profit: 96500 },
    { month: "Dec", revenue: 142500, profit: 99800 },
    { month: "Jan", revenue: 147200, profit: 102300 },
    { month: "Feb", revenue: 149900, profit: 103900 },
    { month: "Mar", revenue: 150800, profit: 104100 },
    { month: "Apr", revenue: 152400, profit: 104660 },
  ],
};

const mockAdminOwners: OwnerSummary[] = [
  { id: MOCK_OWNER_ID, name: "Avery Holdings" },
  { id: "owner-portfolio-2", name: "Northwind Residences" },
];

const mockOwnerRequests: OwnerAssociationRequestSummary[] = [];

const buildAuthResponse = (role: "OWNER" | "ADMIN", name?: string): TokenResponse => {
  const token = buildMockToken(role, role === "ADMIN" ? MOCK_ADMIN_ID : MOCK_OWNER_ID);
  return { accessToken: token, token, access: token, name } as TokenResponse;
};

const buildRegisterResponse = (name?: string): UserResponse => ({
  id: `user-${Date.now()}`,
  name: name ?? "New User",
});

const readNameFromBody = (body: unknown): string | undefined => {
  if (!body || typeof body !== "object" || !("name" in body)) {
    return undefined;
  }

  const value = (body as Record<string, unknown>).name;
  return typeof value === "string" ? value : undefined;
};

const parseUrl = (url: string): URL | null => {
  try {
    return new URL(url, window.location.origin);
  } catch {
    return null;
  }
};

export const getMockResponse = <T>(url: string, method: string, body?: unknown): T | undefined => {
  if (!isMockEnabled()) {
    return undefined;
  }

  const parsed = parseUrl(url);
  if (!parsed) {
    return undefined;
  }

  const path = parsed.pathname;
  const methodUpper = method.toUpperCase();

  if (methodUpper === "POST" && path.endsWith("/auth/login")) {
    const name = readNameFromBody(body);
    const role = name && name.toLowerCase().includes("admin") ? "ADMIN" : "OWNER";
    return clone(buildAuthResponse(role)) as T;
  }

  if (methodUpper === "POST" && path.endsWith("/auth/refresh")) {
    return clone(buildAuthResponse("OWNER")) as T;
  }

  if (methodUpper === "POST" && (path.endsWith("/auth/register/admin") || path.endsWith("/auth/register/owner"))) {
    return clone(buildRegisterResponse(readNameFromBody(body))) as T;
  }

  if (methodUpper === "GET" && /\/owners\/[^/]+\/summary$/.test(path)) {
    return clone(mockSummary) as T;
  }

  if (methodUpper === "GET" && path.endsWith("/properties") && parsed.searchParams.has("ownerId")) {
    return clone(mockProperties) as T;
  }

  if (methodUpper === "GET" && path.endsWith("/apartments") && parsed.searchParams.has("ownerId")) {
    return clone(mockApartments) as T;
  }

  if (methodUpper === "GET" && path.endsWith("/properties/apartments")) {
    return clone(mockOwnerGrid) as T;
  }

  const propertyGridMatch = path.match(/\/properties\/([^/]+)\/apartments$/);
  if (methodUpper === "GET" && propertyGridMatch) {
    const propertyId = propertyGridMatch[1];
    return clone(mockPropertyGrids[propertyId] ?? {}) as T;
  }

  if (methodUpper === "GET" && path.endsWith("/admins/me/owners")) {
    return clone(mockAdminOwners) as T;
  }

  if (methodUpper === "GET" && path.endsWith("/admins/me/owner-requests")) {
    return clone(mockOwnerRequests) as T;
  }

  if (methodUpper === "GET" && path.endsWith("/owners/me/admin")) {
    return null as T;
  }

  if (methodUpper === "DELETE" && path.includes("/maintenance-fees/")) {
    return null as T;
  }

  if (methodUpper === "DELETE" && (path.includes("/properties/") || path.includes("/apartments/") || path.includes("/expenses/"))) {
    return null as T;
  }

  return undefined;
};
