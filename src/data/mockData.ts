import { DealData, SpendRecord, ShipmentReleasePass, PushNotificationItem } from '../types';

export const SCENARIOS: Record<'clean' | 'fraud' | 'date', DealData> = {
  clean: {
    id: 'CF-2025-0842',
    displayId: 'Order #CF-2025-0842',
    status: 'ALL 3 DOCUMENTS MATCH',
    statusType: 'success',
    faceValue: 142000,
    currency: 'USD',
    sellerName: 'Vietnam AgriTech Commodities Ltd',
    sellerLocation: 'Ho Chi Minh City, Vietnam',
    buyerName: 'Global Harvest Corp (Hamburg, Germany)',
    buyerLocation: 'Speicherstadt District, Hamburg',
    shippingTerms: 'CIF Hamburg',
    vessel: 'MAERSK MC-KINNEY MOLLER / V.2501W',
    departureDate: 'March 28, 2025',
    poCutoffDate: 'Before April 5, 2025',
    containerId: 'MRSK-9821491',
    riskScore: 14,
    riskRating: 'EXTREMELY SAFE',
    invoiceAmt: '$142,000.00 USD',
    poAmt: '$142,000.00 USD',
    blStatus: 'Freight Prepaid by Seller',
    goodsDescription: '40 MT Robusta Coffee',
    shippingRoute: 'Saigon → Hamburg',
    matchSummary: "The invoice price ($142,000.00) matches the buyer's order exactly. Cargo container MRSK-9821491 has already been loaded onto the Maersk ship and departed on schedule. You are fully eligible for instant early payment.",
    canFinance: true,
    financeButtonText: 'Request Instant Payout ($116,156.00)'
  },
  fraud: {
    id: 'CF-2025-0918',
    displayId: 'Order #CF-2025-0918',
    status: 'AMOUNT ANOMALY FLAGGED',
    statusType: 'danger',
    faceValue: 189000,
    currency: 'USD',
    sellerName: 'Vietnam AgriTech Commodities Ltd',
    sellerLocation: 'Ho Chi Minh City, Vietnam',
    buyerName: 'Global Harvest Corp (Hamburg, Germany)',
    buyerLocation: 'Speicherstadt District, Hamburg',
    shippingTerms: 'CIF Hamburg',
    vessel: 'MAERSK MC-KINNEY MOLLER / V.2501W',
    departureDate: 'March 28, 2025',
    poCutoffDate: 'Before April 5, 2025',
    containerId: 'MRSK-9821491',
    riskScore: 88,
    riskRating: 'HIGH RISK / FRAUD',
    invoiceAmt: '$189,000.00 USD (Inflated)',
    poAmt: '$142,000.00 USD',
    blStatus: 'Freight Prepaid by Seller',
    goodsDescription: '40 MT Robusta Coffee',
    shippingRoute: 'Saigon → Hamburg',
    matchSummary: 'CRITICAL DISCREPANCY: Commercial Invoice aggregate amount exceeds buyer Purchase Order authorization by $47,000.00 USD (33.1% inflation). High phantom invoice probability. Autonomous underwriting halted.',
    discrepancyText: '+$47,000 MISMATCH: Invoice value $189k does not equal authorized PO cap $142k.',
    canFinance: false,
    financeButtonText: 'Financing Halted: Discrepancy Active'
  },
  date: {
    id: 'CF-2025-0610',
    displayId: 'Order #CF-2025-0610',
    status: 'DATE ANOMALY (LATE DEPARTURE)',
    statusType: 'warning',
    faceValue: 142000,
    currency: 'USD',
    sellerName: 'Vietnam AgriTech Commodities Ltd',
    sellerLocation: 'Ho Chi Minh City, Vietnam',
    buyerName: 'Global Harvest Corp (Hamburg, Germany)',
    buyerLocation: 'Speicherstadt District, Hamburg',
    shippingTerms: 'CIF Hamburg',
    vessel: 'MSC GÜLSÜN / V.401',
    departureDate: 'April 18, 2025 (Late)',
    poCutoffDate: 'Before April 5, 2025',
    containerId: 'MSCU-7419082',
    riskScore: 52,
    riskRating: 'MODERATE RISK',
    invoiceAmt: '$142,000.00 USD',
    poAmt: '$142,000.00 USD',
    blStatus: 'Freight Prepaid by Seller',
    goodsDescription: '40 MT Robusta Coffee',
    shippingRoute: 'Saigon → Hamburg',
    matchSummary: 'WARNING: On-board bill of lading date (2025-04-18) violates Purchase Order cutoff date (2025-04-05). Importer approval required for waiver prior to advance release.',
    discrepancyText: 'Exceeds PO Cutoff: Shipped 13 days past agreed contractual deadline.',
    canFinance: false,
    financeButtonText: 'Requires Importer L/C Amendment'
  }
};

export const RAW_DOCUMENTS = {
  ci: `COMMERCIAL INVOICE #CI-89210
DATE: 2025-03-28
EXPORTER: Vietnam AgriTech Commodities Ltd, Ho Chi Minh City
IMPORTER: Global Harvest Corp, Speicherstadt 14, 20457 Hamburg, Germany
PORT OF LOADING: Saigon Port (VNSGN)
PORT OF DISCHARGE: Hamburg (DEHAM)
INCOTERMS: CIF Hamburg Incoterms 2020

LINE ITEMS:
1. Premium Grade-1 Robusta Green Coffee Beans
   Quantity: 40.00 Metric Tons (2x 20ft FCL Containers)
   Unit Price: $3,550.00 USD / MT
   TOTAL AMOUNT: $142,000.00 USD

PAYMENT TERMS: Irrevocable Autonomous Smart Contract Escrow (CashFlow Protocol)
BANK / VAULT RECIPIENT: 0x8f2a63B2dE9C1a87617cFcA164b4c7303fCc391
DIGITAL SIGNATURE HASH: e4b29c91038a8e19034ff98c11aa`,

  po: `PURCHASE ORDER #GH-90184
BUYER: Global Harvest Corp (Hamburg, DE)
SUPPLIER: Vietnam AgriTech Commodities Ltd
DATE ISSUED: 2025-03-12

ORDER SPECIFICATION:
- Robusta Coffee Grade 1, Cleaned & Polished in 60kg jute bags
- Total Volume: 40.00 MT (+/- 2% maritime standard)
- Agreed Price: $3,550.00 USD per Metric Ton CIF Hamburg
- Maximum Invoice Aggregate: $142,000.00 USD
- Required Shipment Window: March 20, 2025 – April 05, 2025
- Authorized Inspection: Bureau Veritas or SGS Pre-shipment Certificate

CONDITIONAL AUTHORIZATION:
Escrow pre-funded via USDC Programmable Treasury pool.
RELEASE CONDITION: Verified Marine Bill of Lading departure match.`,

  bl: `MAERSK LINE — OCEAN BILL OF LADING #MRSK9821491
NON-NEGOTIABLE COPY • SHIPPED ON BOARD
VESSEL: MAERSK MC-KINNEY MOLLER / V.2501W
PORT OF LOADING: SAIGON (VNSGN) | DATE: 2025-03-29
PORT OF DISCHARGE: HAMBURG (DEHAM)

SHIPPER: VIETNAM AGRITECH COMMODITIES LTD
CONSIGNEE: TO THE ORDER OF GLOBAL HARVEST CORP
NOTIFY PARTY: GLOBAL HARVEST LOGISTICS HAMBURG

CONTAINERS:
- MSKU-849102-1 (20' GP) - 20 MT COFFEE BEANS ROBUSTA
- MSKU-102941-8 (20' GP) - 20 MT COFFEE BEANS ROBUSTA
TOTAL GROSS WEIGHT: 40,240 KGS
FREIGHT PREPAID • CIF EUROPEAN PORT TERMS CONFIRMED
CARRIER SIGNATURE: CAPT. E. NIELSEN • MAERSK LINE DECK SEAL`
};

export const INITIAL_SPEND_RECORDS: SpendRecord[] = [
  {
    id: 'SP-1091',
    dealId: 'CF-2025-0842',
    date: '2025-03-29',
    counterparty: 'Global Harvest Corp (Germany)',
    corridor: 'Vietnam (VNSGN) → Germany (DEHAM)',
    category: 'Coffee Commodities',
    amount: 142000,
    currency: 'USD',
    escrowFee: 4544,
    traditionalBankFee: 11360,
    savings: 6816,
    status: 'In Escrow',
    releaseCode: 'CF-REL-9821-X4',
    releaseStatus: 'READY_FOR_RELEASE',
    deliveryDate: '2025-04-22',
    vesselTracking: 'MAERSK MC-KINNEY MOLLER (Suez Transit)'
  },
  {
    id: 'SP-1090',
    dealId: 'CF-2025-0811',
    date: '2025-03-24',
    counterparty: 'Rotterdam Grain & Oilseed BV',
    corridor: 'Brazil (BRSSZ) → Netherlands (NLRTM)',
    category: 'Agricultural Grains',
    amount: 320000,
    currency: 'USD',
    escrowFee: 8960,
    traditionalBankFee: 25600,
    savings: 16640,
    status: 'Financed',
    releaseCode: 'CF-REL-7740-B2',
    releaseStatus: 'PENDING_PAYMENT',
    deliveryDate: '2025-04-18',
    vesselTracking: 'MSC ISABELLA (Mid-Atlantic)'
  },
  {
    id: 'SP-1089',
    dealId: 'CF-2025-0766',
    date: '2025-03-18',
    counterparty: 'Nordic Minerals ASA (Oslo)',
    corridor: 'Australia (AUPOR) → Norway (NOKRS)',
    category: 'Rare Earth Minerals',
    amount: 580000,
    currency: 'USD',
    escrowFee: 16240,
    traditionalBankFee: 46400,
    savings: 30160,
    status: 'Settled',
    releaseCode: 'CF-REL-5519-N9',
    releaseStatus: 'RELEASED_AND_DELIVERED',
    deliveryDate: '2025-03-27',
    vesselTracking: 'Delivered at Terminal Gate 3'
  },
  {
    id: 'SP-1088',
    dealId: 'CF-2025-0720',
    date: '2025-03-14',
    counterparty: 'Apex Microelectronics GmbH',
    corridor: 'Taiwan (TWTPE) → Germany (DEHAM)',
    category: 'Electronic Components',
    amount: 410000,
    currency: 'USD',
    escrowFee: 11480,
    traditionalBankFee: 32800,
    savings: 21320,
    status: 'Settled',
    releaseCode: 'CF-REL-4402-T1',
    releaseStatus: 'RELEASED_AND_DELIVERED',
    deliveryDate: '2025-03-22',
    vesselTracking: 'Air Freight Cargo Signed'
  },
  {
    id: 'SP-1087',
    dealId: 'CF-2025-0690',
    date: '2025-03-09',
    counterparty: 'Kobe Heavy Industrial Corp',
    corridor: 'Indonesia (IDJKT) → Japan (JPUKB)',
    category: 'Industrial Nickel & Ore',
    amount: 720000,
    currency: 'USD',
    escrowFee: 20160,
    traditionalBankFee: 57600,
    savings: 37440,
    status: 'Settled',
    releaseCode: 'CF-REL-3199-K8',
    releaseStatus: 'RELEASED_AND_DELIVERED',
    deliveryDate: '2025-03-19',
    vesselTracking: 'Offloaded & Inspection Passed'
  },
  {
    id: 'SP-1086',
    dealId: 'CF-2025-0655',
    date: '2025-03-02',
    counterparty: 'Valencia Agro Importaciones S.L.',
    corridor: 'Chile (CLSAI) → Spain (ESVLC)',
    category: 'Fresh Fruit & Cold Chain',
    amount: 215000,
    currency: 'USD',
    escrowFee: 6450,
    traditionalBankFee: 17200,
    savings: 10750,
    status: 'Settled',
    releaseCode: 'CF-REL-2088-V3',
    releaseStatus: 'RELEASED_AND_DELIVERED',
    deliveryDate: '2025-03-15',
    vesselTracking: 'Reefer Telemetry 3.2°C OK'
  },
  {
    id: 'SP-1085',
    dealId: 'CF-2025-0610',
    date: '2025-02-28',
    counterparty: 'Antwerp Cocoa Processors NV',
    corridor: 'Ivory Coast (CIABJ) → Belgium (BEANR)',
    category: 'Cocoa Beans',
    amount: 195000,
    currency: 'USD',
    escrowFee: 5460,
    traditionalBankFee: 15600,
    savings: 10140,
    status: 'In Escrow',
    releaseCode: 'CF-REL-1944-A7',
    releaseStatus: 'PENDING_PAYMENT',
    deliveryDate: '2025-04-12',
    vesselTracking: 'CMA CGM MOZART (Gibraltar Approach)'
  }
];

export const INITIAL_RELEASE_PASSES: ShipmentReleasePass[] = [
  {
    code: 'CF-REL-9821-X4',
    dealId: 'CF-2025-0842',
    buyerName: 'Global Harvest Corp (Hamburg, Germany)',
    exporterName: 'Vietnam AgriTech Commodities Ltd',
    containerId: 'MRSK-9821491',
    totalAmount: 142000,
    currency: 'USD',
    status: 'READY_FOR_RELEASE',
    generatedAt: '2025-03-29 10:14 UTC',
    carrier: 'Maersk Line',
    destinationPort: 'Hamburg Port, Terminal Altenwerder (CTA)',
    securityHash: '0x8f2a99bc32d01fe9a4176c'
  },
  {
    code: 'CF-REL-7740-B2',
    dealId: 'CF-2025-0811',
    buyerName: 'Rotterdam Grain & Oilseed BV',
    exporterName: 'AgroSul Exportadora S/A',
    containerId: 'MSCU-9021884',
    totalAmount: 320000,
    currency: 'USD',
    status: 'PENDING_PAYMENT',
    generatedAt: '2025-03-24 14:30 UTC',
    carrier: 'Mediterranean Shipping Company (MSC)',
    destinationPort: 'Port of Rotterdam, Maasvlakte II',
    securityHash: '0x14df9901cc3a28be4019fd'
  },
  {
    code: 'CF-REL-5519-N9',
    dealId: 'CF-2025-0766',
    buyerName: 'Nordic Minerals ASA (Oslo)',
    exporterName: 'Pilbara Resources Pty Ltd',
    containerId: 'OOLU-3301927',
    totalAmount: 580000,
    currency: 'USD',
    status: 'RELEASED_AND_DELIVERED',
    generatedAt: '2025-03-18 09:00 UTC',
    releasedAt: '2025-03-27 16:45 UTC',
    carrier: 'OOCL Marine Express',
    destinationPort: 'Oslo Havn Terminal 1',
    securityHash: '0x77bc110a39f6002ed9913a',
    releasedBy: 'Officer T. Lindqvist (Oslo Customs Gate 3)'
  }
];

export const INITIAL_NOTIFICATIONS: PushNotificationItem[] = [
  {
    id: 'notif-1',
    title: '🚢 Vessel Departed on Schedule',
    message: 'Maersk Mc-Kinney Moller has officially departed Saigon Port (VNSGN) carrying container MRSK-9821491 for Order #CF-2025-0842.',
    timestamp: '12m ago',
    type: 'info',
    read: false,
    dealId: 'CF-2025-0842',
    actionUrl: 'matrix'
  },
  {
    id: 'notif-2',
    title: '🔒 Buyer Escrow Deposit Secured ($142,000.00)',
    message: 'Global Harvest Corp deposited $142,000.00 USDC into the autonomous smart contract vault. Your funds are guaranteed.',
    timestamp: '45m ago',
    type: 'success',
    read: false,
    dealId: 'CF-2025-0842',
    actionUrl: 'matrix'
  },
  {
    id: 'notif-3',
    title: '🔑 Shipment Release Code Generated',
    message: 'Code CF-REL-9821-X4 is ready. The buyer can enter this code upon arrival to authorize terminal cargo discharge.',
    timestamp: '2h ago',
    type: 'success',
    read: false,
    dealId: 'CF-2025-0842',
    actionUrl: 'release'
  },
  {
    id: 'notif-4',
    title: '⚠️ Bill of Lading Discrepancy Flagged',
    message: 'Order #CF-2025-0610 vessel departure was delayed 13 days past agreed PO cutoff. Waiver required.',
    timestamp: '1d ago',
    type: 'warning',
    read: true,
    dealId: 'CF-2025-0610',
    actionUrl: 'matrix'
  }
];
