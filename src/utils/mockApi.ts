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

  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.get("mock") === "1") {
    return true;
  }

  if (window.location.hostname.includes("onrender.com")) {
    return true;
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
  "tenant-harper": { id: "tenant-harper", name: "Harper Cole", email: "harper.cole@example.com", phone: "+1 617-555-0162" },
  "tenant-adrian": { id: "tenant-adrian", name: "Adrian Wells", email: "adrian.wells@example.com", phone: "+1 512-555-0178" },
  "tenant-zoe": { id: "tenant-zoe", name: "Zoe Larson", email: "zoe.larson@example.com", phone: "+1 303-555-0132" },
  "tenant-julian": { id: "tenant-julian", name: "Julian Park", email: "julian.park@example.com", phone: "+1 617-555-0199" },
  "tenant-bella": { id: "tenant-bella", name: "Bella Ortiz", email: "bella.ortiz@example.com", phone: "+1 512-555-0182" },
  "tenant-ryan": { id: "tenant-ryan", name: "Ryan Pierce", email: "ryan.pierce@example.com", phone: "+1 303-555-0151" },
  "tenant-claire": { id: "tenant-claire", name: "Claire Evans", email: "claire.evans@example.com", phone: "+1 617-555-0139" },
  "tenant-grace": { id: "tenant-grace", name: "Grace Kim", email: "grace.kim@example.com", phone: "+1 512-555-0144" },
  "tenant-nathan": { id: "tenant-nathan", name: "Nathan Price", email: "nathan.price@example.com", phone: "+1 303-555-0186" },
  "tenant-hugo": { id: "tenant-hugo", name: "Hugo Diaz", email: "hugo.diaz@example.com", phone: "+1 617-555-0175" },
  "tenant-ella": { id: "tenant-ella", name: "Ella Moore", email: "ella.moore@example.com", phone: "+1 512-555-0158" },
  "tenant-ivy": { id: "tenant-ivy", name: "Ivy Grant", email: "ivy.grant@example.com", phone: "+1 303-555-0127" },
  "tenant-owen": { id: "tenant-owen", name: "Owen Silva", email: "owen.silva@example.com", phone: "+1 617-555-0183" },
  "tenant-mason": { id: "tenant-mason", name: "Mason Reed", email: "mason.reed@example.com", phone: "+1 512-555-0167" },
  "tenant-ivy2": { id: "tenant-ivy2", name: "Ivy Sanchez", email: "ivy.sanchez@example.com", phone: "+1 303-555-0164" },
  "tenant-dylan": { id: "tenant-dylan", name: "Dylan Hughes", email: "dylan.hughes@example.com", phone: "+1 617-555-0123" },
  "tenant-lila": { id: "tenant-lila", name: "Lila Perez", email: "lila.perez@example.com", phone: "+1 512-555-0192" },
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
  { id: "apt-aurora-103", number: 103, propertyId: "prop-aurora" },
  { id: "apt-aurora-104", number: 104, propertyId: "prop-aurora" },
  { id: "apt-aurora-105", number: 105, propertyId: "prop-aurora" },
  { id: "apt-aurora-201", number: 201, propertyId: "prop-aurora" },
  { id: "apt-aurora-202", number: 202, propertyId: "prop-aurora" },
  { id: "apt-aurora-203", number: 203, propertyId: "prop-aurora" },
  { id: "apt-aurora-204", number: 204, propertyId: "prop-aurora" },
  { id: "apt-aurora-205", number: 205, propertyId: "prop-aurora" },
  { id: "apt-aurora-301", number: 301, propertyId: "prop-aurora" },
  { id: "apt-aurora-302", number: 302, propertyId: "prop-aurora" },
  { id: "apt-aurora-303", number: 303, propertyId: "prop-aurora" },
  { id: "apt-aurora-304", number: 304, propertyId: "prop-aurora" },
  { id: "apt-aurora-305", number: 305, propertyId: "prop-aurora" },
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
        rent: 4200,
        squareMeters: 82,
        paymentStatus: "PAID",
        tenant: tenants["tenant-olivia"],
        expenses: [createExpense("exp-aurora-101-1", 120, "Lobby lighting")],
        maintenanceFees: [
          createFee("fee-aurora-101-1", "CLEANING", "Weekly common area cleaning", 110),
          createFee("fee-aurora-101-2", "GENERAL", "Elevator maintenance", 95),
        ],
        dueDate: "2026-06-05",
      }),
      102: createApartment({
        id: "apt-aurora-102",
        number: 102,
        rent: 4100,
        squareMeters: 78,
        paymentStatus: "PENDING",
        tenant: tenants["tenant-ethan"],
        expenses: [createExpense("exp-aurora-102-1", 160, "Elevator service")],
        maintenanceFees: [createFee("fee-aurora-102-1", "SECURITY", "Front desk coverage", 160)],
        dueDate: "2026-05-10",
      }),
      103: createApartment({
        id: "apt-aurora-103",
        number: 103,
        rent: 3950,
        squareMeters: 76,
        paymentStatus: "PAID",
        tenant: tenants["tenant-sophia"],
        expenses: [createExpense("exp-aurora-103-1", 90, "Mailroom repairs")],
        maintenanceFees: [
          createFee("fee-aurora-103-1", "GENERAL", "Building insurance", 140),
          createFee("fee-aurora-103-2", "AMENITIES", "Rooftop lounge", 115),
        ],
        dueDate: "2026-06-06",
      }),
      104: createApartment({
        id: "apt-aurora-104",
        number: 104,
        rent: 3900,
        squareMeters: 74,
        paymentStatus: "PENDING",
        tenant: tenants["tenant-harper"],
        expenses: [createExpense("exp-aurora-104-1", 140, "Window seals")],
        maintenanceFees: [createFee("fee-aurora-104-1", "SECURITY", "Night patrol", 130)],
        dueDate: "2026-05-12",
      }),
      105: createApartment({
        id: "apt-aurora-105",
        number: 105,
        rent: 4050,
        squareMeters: 79,
        paymentStatus: "PAID",
        tenant: tenants["tenant-adrian"],
        expenses: [createExpense("exp-aurora-105-1", 95, "Stairwell lighting")],
        maintenanceFees: [createFee("fee-aurora-105-1", "AMENITIES", "Fitness center", 120)],
        dueDate: "2026-06-04",
      }),
    },
    2: {
      201: createApartment({
        id: "apt-aurora-201",
        number: 201,
        rent: 4400,
        squareMeters: 88,
        paymentStatus: "PAID",
        tenant: tenants["tenant-liam"],
        expenses: [createExpense("exp-aurora-201-1", 480, "HVAC tune-up")],
        maintenanceFees: [
          createFee("fee-aurora-201-1", "GENERAL", "Building insurance", 170),
          createFee("fee-aurora-201-2", "SECURITY", "Front desk coverage", 155),
        ],
        dueDate: "2026-05-26",
      }),
      202: createApartment({
        id: "apt-aurora-202",
        number: 202,
        rent: 4250,
        squareMeters: 84,
        paymentStatus: "PAID",
        tenant: tenants["tenant-zoe"],
        expenses: [],
        maintenanceFees: [createFee("fee-aurora-202-1", "CLEANING", "Deep clean", 95)],
        dueDate: "2026-05-24",
      }),
      203: createApartment({
        id: "apt-aurora-203",
        number: 203,
        rent: 4100,
        squareMeters: 80,
        paymentStatus: "PAID",
        tenant: tenants["tenant-julian"],
        expenses: [createExpense("exp-aurora-203-1", 410, "Boiler check")],
        maintenanceFees: [createFee("fee-aurora-203-1", "AMENITIES", "Rooftop deck", 115)],
        dueDate: "2026-05-28",
      }),
      204: createApartment({
        id: "apt-aurora-204",
        number: 204,
        rent: 3800,
        squareMeters: 72,
        paymentStatus: "PENDING",
        tenant: null,
        expenses: [createExpense("exp-aurora-204-1", 210, "Paint touch-ups")],
        maintenanceFees: [createFee("fee-aurora-204-1", "CLEANING", "Lobby cleaning", 85)],
        dueDate: "2026-05-09",
      }),
      205: createApartment({
        id: "apt-aurora-205",
        number: 205,
        rent: 4000,
        squareMeters: 78,
        paymentStatus: "PAID",
        tenant: tenants["tenant-bella"],
        expenses: [],
        maintenanceFees: [createFee("fee-aurora-205-1", "GENERAL", "Landscaping", 105)],
        dueDate: "2026-05-29",
      }),
    },
    3: {
      301: createApartment({
        id: "apt-aurora-301",
        number: 301,
        rent: 4550,
        squareMeters: 92,
        paymentStatus: "PAID",
        tenant: tenants["tenant-ryan"],
        expenses: [createExpense("exp-aurora-301-1", 520, "Roof inspection")],
        maintenanceFees: [
          createFee("fee-aurora-301-1", "AMENITIES", "Gym upkeep", 135),
          createFee("fee-aurora-301-2", "GENERAL", "Facade wash", 105),
        ],
        dueDate: "2026-05-30",
      }),
      302: createApartment({
        id: "apt-aurora-302",
        number: 302,
        rent: 4300,
        squareMeters: 86,
        paymentStatus: "PENDING",
        tenant: tenants["tenant-claire"],
        expenses: [createExpense("exp-aurora-302-1", 340, "Fire alarm check")],
        maintenanceFees: [createFee("fee-aurora-302-1", "GENERAL", "Landscaping", 110)],
        dueDate: "2026-05-09",
      }),
      303: createApartment({
        id: "apt-aurora-303",
        number: 303,
        rent: 4150,
        squareMeters: 83,
        paymentStatus: "PAID",
        tenant: tenants["tenant-grace"],
        expenses: [],
        maintenanceFees: [createFee("fee-aurora-303-1", "CLEANING", "Lobby cleaning", 90)],
        dueDate: "2026-05-27",
      }),
      304: createApartment({
        id: "apt-aurora-304",
        number: 304,
        rent: 3850,
        squareMeters: 75,
        paymentStatus: "PENDING",
        tenant: null,
        expenses: [createExpense("exp-aurora-304-1", 250, "Mailbox repairs")],
        maintenanceFees: [createFee("fee-aurora-304-1", "AMENITIES", "Lounge access", 95)],
        dueDate: "2026-05-11",
      }),
      305: createApartment({
        id: "apt-aurora-305",
        number: 305,
        rent: 4050,
        squareMeters: 80,
        paymentStatus: "PAID",
        tenant: tenants["tenant-nathan"],
        expenses: [],
        maintenanceFees: [createFee("fee-aurora-305-1", "SECURITY", "Access control", 120)],
        dueDate: "2026-05-26",
      }),
    },
  },
  "prop-riverview": {
    1: {
      101: createApartment({
        id: "apt-river-101",
        number: 101,
        rent: 3200,
        squareMeters: 70,
        paymentStatus: "PAID",
        tenant: tenants["tenant-hugo"],
        expenses: [createExpense("exp-river-101-1", 260, "Pool maintenance")],
        maintenanceFees: [createFee("fee-river-101-1", "AMENITIES", "Pool service", 140)],
        dueDate: "2026-05-04",
      }),
      102: createApartment({
        id: "apt-river-102",
        number: 102,
        rent: 3100,
        squareMeters: 68,
        paymentStatus: "PAID",
        tenant: tenants["tenant-ella"],
        expenses: [createExpense("exp-river-102-1", 240, "Hallway paint")],
        maintenanceFees: [createFee("fee-river-102-1", "CLEANING", "Trash pickup", 90)],
        dueDate: "2026-05-02",
      }),
    },
    2: {
      201: createApartment({
        id: "apt-river-201",
        number: 201,
        rent: 3050,
        squareMeters: 69,
        paymentStatus: "PENDING",
        tenant: tenants["tenant-ivy"],
        expenses: [createExpense("exp-river-201-1", 230, "Security patrol")],
        maintenanceFees: [createFee("fee-river-201-1", "SECURITY", "Evening guard", 150)],
        dueDate: "2026-05-11",
      }),
      202: createApartment({
        id: "apt-river-202",
        number: 202,
        rent: 3150,
        squareMeters: 70,
        paymentStatus: "PAID",
        tenant: tenants["tenant-owen"],
        expenses: [createExpense("exp-river-202-1", 210, "Pest control")],
        maintenanceFees: [createFee("fee-river-202-1", "GENERAL", "Exterior upkeep", 95)],
        dueDate: "2026-05-08",
      }),
    },
    3: {
      301: createApartment({
        id: "apt-river-301",
        number: 301,
        rent: 3300,
        squareMeters: 73,
        paymentStatus: "PAID",
        tenant: tenants["tenant-mason"],
        expenses: [createExpense("exp-river-301-1", 260, "Roof sealing")],
        maintenanceFees: [createFee("fee-river-301-1", "GENERAL", "Elevator service", 110)],
        dueDate: "2026-05-07",
      }),
      302: createApartment({
        id: "apt-river-302",
        number: 302,
        rent: 3250,
        squareMeters: 71,
        paymentStatus: "PAID",
        tenant: tenants["tenant-ivy2"],
        expenses: [createExpense("exp-river-302-1", 220, "Window cleaning")],
        maintenanceFees: [createFee("fee-river-302-1", "CLEANING", "Exterior wash", 85)],
        dueDate: "2026-05-05",
      }),
    },
  },
  "prop-summit": {
    1: {
      101: createApartment({
        id: "apt-summit-101",
        number: 101,
        rent: 3500,
        squareMeters: 74,
        paymentStatus: "PAID",
        tenant: tenants["tenant-dylan"],
        expenses: [createExpense("exp-summit-101-1", 280, "Garden upkeep")],
        maintenanceFees: [createFee("fee-summit-101-1", "AMENITIES", "Rooftop lounge", 125)],
        dueDate: "2026-05-03",
      }),
      102: createApartment({
        id: "apt-summit-102",
        number: 102,
        rent: 3400,
        squareMeters: 72,
        paymentStatus: "PENDING",
        tenant: tenants["tenant-lila"],
        expenses: [createExpense("exp-summit-102-1", 250, "Fence repair")],
        maintenanceFees: [createFee("fee-summit-102-1", "SECURITY", "Camera monitoring", 140)],
        dueDate: "2026-05-12",
      }),
    },
    2: {
      201: createApartment({
        id: "apt-summit-201",
        number: 201,
        rent: 3600,
        squareMeters: 76,
        paymentStatus: "PAID",
        tenant: tenants["tenant-maya"],
        expenses: [createExpense("exp-summit-201-1", 300, "Elevator inspection")],
        maintenanceFees: [createFee("fee-summit-201-1", "GENERAL", "Insurance premium", 155)],
        dueDate: "2026-05-04",
      }),
      202: createApartment({
        id: "apt-summit-202",
        number: 202,
        rent: 3550,
        squareMeters: 75,
        paymentStatus: "PAID",
        tenant: tenants["tenant-ava"],
        expenses: [createExpense("exp-summit-202-1", 240, "Snow removal")],
        maintenanceFees: [createFee("fee-summit-202-1", "CLEANING", "Lobby cleaning", 95)],
        dueDate: "2026-05-06",
      }),
    },
    3: {
      301: createApartment({
        id: "apt-summit-301",
        number: 301,
        rent: 3700,
        squareMeters: 78,
        paymentStatus: "PAID",
        tenant: tenants["tenant-nora"],
        expenses: [createExpense("exp-summit-301-1", 280, "HVAC filters")],
        maintenanceFees: [createFee("fee-summit-301-1", "AMENITIES", "Gym service", 120)],
        dueDate: "2026-05-02",
      }),
      302: createApartment({
        id: "apt-summit-302",
        number: 302,
        rent: 3450,
        squareMeters: 74,
        paymentStatus: "PAID",
        tenant: null,
        expenses: [createExpense("exp-summit-302-1", 200, "Paint touch-ups")],
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

const sumArray = (values: number[]): number => values.reduce((sum, value) => sum + value, 0);

const buildHistoricalData = (grossRevenue: number, netProfit: number) => {
  const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];
  const multipliers = [0.9, 0.92, 0.95, 0.97, 0.99, 1];
  return months.map((month, index) => ({
    month,
    revenue: Math.round(grossRevenue * multipliers[index]),
    profit: Math.round(netProfit * multipliers[index]),
  }));
};

const buildSummaryFromGrid = (grid: OwnerApartmentsGridResponse): SummaryResponse => {
  let totalTenantsCount = 0;
  let unpaidTenantsCount = 0;
  let unpaidAmount = 0;
  const paidRents: number[] = [];
  const expenses: number[] = [];

  Object.values(grid).forEach((floors) => {
    Object.values(floors).forEach((apartmentsByNumber) => {
      Object.values(apartmentsByNumber).forEach((apartment) => {
        if (apartment.tenant) {
          totalTenantsCount += 1;
          if (apartment.paymentStatus === "PAID") {
            paidRents.push(apartment.rent || 0);
          } else {
            unpaidTenantsCount += 1;
            unpaidAmount += apartment.rent || 0;
          }
        }

        (apartment.expenses ?? []).forEach((expense) => {
          expenses.push(expense.amount || 0);
        });
      });
    });
  });

  const grossRevenue = Math.round(sumArray(paidRents));
  const totalExpenses = Math.round(sumArray(expenses));
  const adminCommission = 0;
  const netProfit = grossRevenue - totalExpenses - adminCommission;
  const historicalData = buildHistoricalData(grossRevenue, netProfit);
  const lastMonthRevenue = historicalData.length > 1 ? historicalData[historicalData.length - 2].revenue : grossRevenue;
  const lastMonthExpenses = Math.round(totalExpenses * 1.04);
  const collectedPct = lastMonthRevenue > 0 ? ((grossRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;
  const expensesPct = lastMonthExpenses > 0 ? ((totalExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0;

  return {
    totalCollectedThisMonth: netProfit,
    collectedTrend: `${collectedPct >= 0 ? "+" : ""}${collectedPct.toFixed(1)}% vs last month`,
    unpaidTenantsCount,
    totalTenantsCount,
    unpaidAmount: Math.round(unpaidAmount),
    totalExpensesThisMonth: totalExpenses,
    expensesTrend: `${expensesPct >= 0 ? "Up" : "Down"} ${Math.abs(expensesPct).toFixed(1)}% from last month`,
    monthlyBreakdown: {
      grossRevenue,
      totalExpenses,
      adminCommission,
      netProfit,
    },
    historicalData,
  };
};

const mockSummary: SummaryResponse = buildSummaryFromGrid(mockOwnerGrid);

const mockAdminOwners: OwnerSummary[] = [
  { id: MOCK_OWNER_ID, name: "Arthur Miller" },
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

export const getMockOwnerGrid = (): OwnerApartmentsGridResponse => clone(mockOwnerGrid);

