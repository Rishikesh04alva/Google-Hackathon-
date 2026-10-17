export type UserRole = 'Exporter' | 'Importer' | 'Financier' | 'Auditor';

export type ScenarioType = 'clean' | 'fraud' | 'date';

export type ActiveTab = 'matrix' | 'spend' | 'release' | 'register' | 'auth';

export interface InvoiceLineItem {
  id: string;
  description: string;
  hsCode: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface ExportShipmentRegistration {
  id: string;
  registrationDate: string;
  status: 'DRAFT' | 'SUBMITTED' | 'TRIANGULATED' | 'ESCROW_FUNDED';
  exporter: {
    name: string;
    lei: string;
    originCountry: string;
    portOfLoading: string;
    contactEmail: string;
  };
  importer: {
    name: string;
    destinationCountry: string;
    portOfDischarge: string;
    poNumber: string;
  };
  shipment: {
    commodity: string;
    hsTariffCode: string;
    totalWeight: string;
    containerId: string;
    containerType: string;
    carrier: string;
    vesselName: string;
    voyageNumber: string;
    billOfLadingNumber: string;
    etd: string;
    eta: string;
    incoterm: string;
  };
  invoice: {
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    currency: string;
    lineItems: InvoiceLineItem[];
    subtotal: number;
    totalAmount: number;
    advancePayoutRate: number;
    advancePayoutAmount: number;
    escrowFee: number;
    traditionalFee: number;
    savings: number;
    paymentTerms: string;
  };
  documents: {
    commercialInvoiceAttached: boolean;
    billOfLadingAttached: boolean;
    certificateOfOriginAttached: boolean;
    merkleRootHash: string;
  };
}

export interface DealData {
  id: string;
  displayId: string;
  status: string;
  statusType: 'success' | 'danger' | 'warning';
  faceValue: number;
  currency: string;
  sellerName: string;
  sellerLocation: string;
  buyerName: string;
  buyerLocation: string;
  shippingTerms: string;
  vessel: string;
  departureDate: string;
  poCutoffDate: string;
  containerId: string;
  riskScore: number;
  riskRating: 'EXTREMELY SAFE' | 'HIGH RISK / FRAUD' | 'MODERATE RISK';
  invoiceAmt: string;
  poAmt: string;
  blStatus: string;
  goodsDescription: string;
  shippingRoute: string;
  matchSummary: string;
  discrepancyText?: string;
  canFinance: boolean;
  financeButtonText: string;
}

export interface SpendRecord {
  id: string;
  dealId: string;
  date: string;
  counterparty: string;
  corridor: string;
  category: string;
  amount: number;
  currency: string;
  escrowFee: number;
  traditionalBankFee: number;
  savings: number;
  status: 'Settled' | 'In Escrow' | 'Financed' | 'Disputed' | 'Pending Release';
  releaseCode: string;
  releaseStatus: 'PENDING_PAYMENT' | 'READY_FOR_RELEASE' | 'RELEASED_AND_DELIVERED';
  deliveryDate: string;
  vesselTracking: string;
}

export interface ShipmentReleasePass {
  code: string;
  dealId: string;
  buyerName: string;
  exporterName: string;
  containerId: string;
  totalAmount: number;
  currency: string;
  status: 'PENDING_PAYMENT' | 'READY_FOR_RELEASE' | 'RELEASED_AND_DELIVERED';
  generatedAt: string;
  releasedAt?: string;
  carrier: string;
  destinationPort: string;
  securityHash: string;
  releasedBy?: string;
}

export interface PushNotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  dealId?: string;
  actionUrl?: string;
}

export interface AuthUserState {
  isAuthenticated: boolean;
  email: string;
  role: UserRole;
  provider: 'google' | 'email';
  mfaEnabled: boolean;
  token: string;
  customClaims: {
    role: string;
    orgId: string;
    canReleaseEscrow: boolean;
    canFinance: boolean;
  };
}
