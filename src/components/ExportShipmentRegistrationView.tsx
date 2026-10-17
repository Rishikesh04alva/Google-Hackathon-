import React, { useState } from 'react';
import {
  PackagePlus,
  Ship,
  FileText,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ArrowRight,
  ExternalLink,
  Layers,
  FileCheck,
  Building,
  Anchor,
  Clock,
  Coins,
  Sparkles,
  QrCode,
  RefreshCw,
} from 'lucide-react';
import { UserRole, InvoiceLineItem, ExportShipmentRegistration } from '../types';

interface ExportShipmentRegistrationViewProps {
  currentRole: UserRole;
  onNavigateToTab: (tab: 'matrix' | 'spend' | 'release' | 'auth') => void;
  onTriggerNotification?: (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'alert',
    actionUrl?: string
  ) => void;
}

const PRESET_COFFEE = {
  exporterName: 'Vietnam AgriTech Commodities Ltd',
  exporterLei: '549300VNA892011',
  originCountry: 'Vietnam',
  portOfLoading: 'Saigon Port / Cat Lai Terminal (VNSGN)',
  contactEmail: 'treasury@agritech-global.com',
  importerName: 'Global Harvest Corp (Hamburg, Germany)',
  destinationCountry: 'Germany',
  portOfDischarge: 'Port of Hamburg Altenwerder (DEHAM)',
  poNumber: 'PO-DE-99412',
  commodity: 'Premium Grade-1 Robusta Green Coffee Beans',
  hsTariffCode: '0901.11.00',
  totalWeight: '40.00 Metric Tons (2x 20ft FCL)',
  containerId: 'MRSK-9821491',
  containerType: '2x 20ft Standard Dry Van',
  carrier: 'Maersk Line A/S',
  vesselName: 'MAERSK MC-KINNEY MOLLER',
  voyageNumber: '2501W',
  billOfLadingNumber: 'MAEU-849102839',
  etd: '2026-03-28',
  eta: '2026-04-18',
  incoterm: 'CIF Hamburg Incoterms 2020',
  invoiceNumber: 'INV-2026-EXP-8891',
  invoiceDate: '2026-03-28',
  dueDate: '2026-04-25',
  currency: 'USD',
  advanceRate: 85,
  paymentTerms: '85% Advance upon Ocean B/L Attestation, 15% upon Port Gate Discharge',
  lineItems: [
    {
      id: 'li-1',
      description: 'Grade-1 Robusta Coffee Beans (Screen 18, Wet Polished)',
      hsCode: '0901.11.00',
      quantity: 40,
      unit: 'Metric Tons',
      unitPrice: 3550,
      total: 142000,
    },
  ],
};

const PRESET_CASHEWS = {
  exporterName: 'Abidjan Agro-Industrial Exporters S.A.',
  exporterLei: '549300CIABJ781920',
  originCountry: 'Ivory Coast',
  portOfLoading: 'Port of Abidjan Terminal (CIABJ)',
  contactEmail: 'logistics@abidjan-agro.ci',
  importerName: 'Rotterdam Commodity Processors B.V.',
  destinationCountry: 'Netherlands',
  portOfDischarge: 'Port of Rotterdam Maasvlakte (NLRTM)',
  poNumber: 'PO-NL-84720',
  commodity: 'Raw Cashew Nuts in Shell (Outturn 48+ lbs/bag)',
  hsTariffCode: '0801.31.00',
  totalWeight: '60.00 Metric Tons in 3x 40ft Containers',
  containerId: 'CMAU-7729104',
  containerType: '3x 40ft High Cube Dry Containers',
  carrier: 'CMA CGM Group',
  vesselName: 'CMA CGM ANTOINE DE SAINT EXUPERY',
  voyageNumber: '028E',
  billOfLadingNumber: 'CMAC-99182301',
  etd: '2026-04-05',
  eta: '2026-04-26',
  incoterm: 'FOB Abidjan Incoterms 2020',
  invoiceNumber: 'INV-2026-EXP-9104',
  invoiceDate: '2026-04-02',
  dueDate: '2026-05-02',
  currency: 'USD',
  advanceRate: 85,
  paymentTerms: '85% Drawdown against Cryptographic B/L, 15% Final Delivery',
  lineItems: [
    {
      id: 'li-2a',
      description: 'Raw Cashew Nuts in Shell - Grade W320 Equivalent',
      hsCode: '0801.31.00',
      quantity: 60,
      unit: 'Metric Tons',
      unitPrice: 2850,
      total: 171000,
    },
  ],
};

export const ExportShipmentRegistrationView: React.FC<ExportShipmentRegistrationViewProps> = ({
  currentRole,
  onNavigateToTab,
  onTriggerNotification,
}) => {
  // Form State
  const [exporterName, setExporterName] = useState(PRESET_COFFEE.exporterName);
  const [exporterLei, setExporterLei] = useState(PRESET_COFFEE.exporterLei);
  const [originCountry, setOriginCountry] = useState(PRESET_COFFEE.originCountry);
  const [portOfLoading, setPortOfLoading] = useState(PRESET_COFFEE.portOfLoading);
  const [contactEmail, setContactEmail] = useState(PRESET_COFFEE.contactEmail);

  const [importerName, setImporterName] = useState(PRESET_COFFEE.importerName);
  const [destinationCountry, setDestinationCountry] = useState(PRESET_COFFEE.destinationCountry);
  const [portOfDischarge, setPortOfDischarge] = useState(PRESET_COFFEE.portOfDischarge);
  const [poNumber, setPoNumber] = useState(PRESET_COFFEE.poNumber);

  const [commodity, setCommodity] = useState(PRESET_COFFEE.commodity);
  const [hsTariffCode, setHsTariffCode] = useState(PRESET_COFFEE.hsTariffCode);
  const [totalWeight, setTotalWeight] = useState(PRESET_COFFEE.totalWeight);
  const [containerId, setContainerId] = useState(PRESET_COFFEE.containerId);
  const [containerType, setContainerType] = useState(PRESET_COFFEE.containerType);
  const [carrier, setCarrier] = useState(PRESET_COFFEE.carrier);
  const [vesselName, setVesselName] = useState(PRESET_COFFEE.vesselName);
  const [voyageNumber, setVoyageNumber] = useState(PRESET_COFFEE.voyageNumber);
  const [billOfLadingNumber, setBillOfLadingNumber] = useState(PRESET_COFFEE.billOfLadingNumber);
  const [etd, setEtd] = useState(PRESET_COFFEE.etd);
  const [eta, setEta] = useState(PRESET_COFFEE.eta);
  const [incoterm, setIncoterm] = useState(PRESET_COFFEE.incoterm);

  const [invoiceNumber, setInvoiceNumber] = useState(PRESET_COFFEE.invoiceNumber);
  const [invoiceDate, setInvoiceDate] = useState(PRESET_COFFEE.invoiceDate);
  const [dueDate, setDueDate] = useState(PRESET_COFFEE.dueDate);
  const [currency, setCurrency] = useState(PRESET_COFFEE.currency);
  const [advanceRate, setAdvanceRate] = useState(PRESET_COFFEE.advanceRate);
  const [paymentTerms, setPaymentTerms] = useState(PRESET_COFFEE.paymentTerms);

  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>(PRESET_COFFEE.lineItems);

  // Document attachments
  const [ciAttached, setCiAttached] = useState(true);
  const [blAttached, setBlAttached] = useState(true);
  const [coAttached, setCoAttached] = useState(true);

  // Submission & History State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedDealId, setSubmittedDealId] = useState('');
  const [submittedMerkleHash, setSubmittedMerkleHash] = useState('');

  // Initial Registered Ledger
  const [registeredShipments, setRegisteredShipments] = useState<ExportShipmentRegistration[]>([
    {
      id: 'CF-EXP-2025-0842',
      registrationDate: '2026-03-28',
      status: 'ESCROW_FUNDED',
      exporter: {
        name: 'Vietnam AgriTech Commodities Ltd',
        lei: '549300VNA892011',
        originCountry: 'Vietnam',
        portOfLoading: 'Saigon Port (VNSGN)',
        contactEmail: 'treasury@agritech-global.com',
      },
      importer: {
        name: 'Global Harvest Corp',
        destinationCountry: 'Germany',
        portOfDischarge: 'Hamburg (DEHAM)',
        poNumber: 'PO-DE-99412',
      },
      shipment: {
        commodity: '40 MT Robusta Coffee',
        hsTariffCode: '0901.11.00',
        totalWeight: '40.00 MT',
        containerId: 'MRSK-9821491',
        containerType: '2x 20ft Standard FCL',
        carrier: 'Maersk Line',
        vesselName: 'MAERSK MC-KINNEY MOLLER',
        voyageNumber: '2501W',
        billOfLadingNumber: 'MAEU-849102839',
        etd: '2026-03-28',
        eta: '2026-04-18',
        incoterm: 'CIF Hamburg',
      },
      invoice: {
        invoiceNumber: 'INV-2025-0842',
        invoiceDate: '2026-03-28',
        dueDate: '2026-04-25',
        currency: 'USD',
        lineItems: [
          {
            id: 'li-hist-1',
            description: 'Grade-1 Robusta Green Coffee',
            hsCode: '0901.11.00',
            quantity: 40,
            unit: 'MT',
            unitPrice: 3550,
            total: 142000,
          },
        ],
        subtotal: 142000,
        totalAmount: 142000,
        advancePayoutRate: 85,
        advancePayoutAmount: 120700,
        escrowFee: 355,
        traditionalFee: 3550,
        savings: 3195,
        paymentTerms: '85% Advance / 15% Delivery',
      },
      documents: {
        commercialInvoiceAttached: true,
        billOfLadingAttached: true,
        certificateOfOriginAttached: true,
        merkleRootHash: '0x8f2a991bce47101da89b21f98cde41a87e2b1440',
      },
    },
  ]);

  // Dynamic calculations
  const totalInvoiceValue = lineItems.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const calculatedAdvanceAmount = (totalInvoiceValue * advanceRate) / 100;
  const calculatedEscrowFee = totalInvoiceValue * 0.0025; // 0.25% autonomous escrow fee
  const calculatedTraditionalFee = totalInvoiceValue * 0.025; // 2.5% traditional bank L/C fee
  const calculatedSavings = calculatedTraditionalFee - calculatedEscrowFee;

  // Handlers for Line Items
  const handleAddLineItem = () => {
    const newItem: InvoiceLineItem = {
      id: `li-${Date.now()}`,
      description: 'Standard Export Cargo Spec',
      hsCode: hsTariffCode || '0901.00.00',
      quantity: 10,
      unit: 'Metric Tons',
      unitPrice: 2000,
      total: 20000,
    };
    setLineItems([...lineItems, newItem]);
  };

  const handleUpdateLineItem = (id: string, field: keyof InvoiceLineItem, val: any) => {
    setLineItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: val };
        if (field === 'quantity' || field === 'unitPrice') {
          const qty = field === 'quantity' ? Number(val) || 0 : item.quantity;
          const price = field === 'unitPrice' ? Number(val) || 0 : item.unitPrice;
          updated.total = qty * price;
        }
        return updated;
      })
    );
  };

  const handleDeleteLineItem = (id: string) => {
    if (lineItems.length <= 1) return;
    setLineItems(lineItems.filter((i) => i.id !== id));
  };

  // Load Presets
  const handleLoadPreset = (preset: 'coffee' | 'cashews') => {
    const data = preset === 'coffee' ? PRESET_COFFEE : PRESET_CASHEWS;
    setExporterName(data.exporterName);
    setExporterLei(data.exporterLei);
    setOriginCountry(data.originCountry);
    setPortOfLoading(data.portOfLoading);
    setContactEmail(data.contactEmail);
    setImporterName(data.importerName);
    setDestinationCountry(data.destinationCountry);
    setPortOfDischarge(data.portOfDischarge);
    setPoNumber(data.poNumber);
    setCommodity(data.commodity);
    setHsTariffCode(data.hsTariffCode);
    setTotalWeight(data.totalWeight);
    setContainerId(data.containerId);
    setContainerType(data.containerType);
    setCarrier(data.carrier);
    setVesselName(data.vesselName);
    setVoyageNumber(data.voyageNumber);
    setBillOfLadingNumber(data.billOfLadingNumber);
    setEtd(data.etd);
    setEta(data.eta);
    setIncoterm(data.incoterm);
    setInvoiceNumber(data.invoiceNumber);
    setInvoiceDate(data.invoiceDate);
    setDueDate(data.dueDate);
    setCurrency(data.currency);
    setAdvanceRate(data.advanceRate);
    setPaymentTerms(data.paymentTerms);
    setLineItems(data.lineItems);
  };

  const handleResetForm = () => {
    setInvoiceNumber(`INV-2026-EXP-${Math.floor(1000 + Math.random() * 9000)}`);
    setContainerId(`MRSK-${Math.floor(1000000 + Math.random() * 9000000)}`);
    setBillOfLadingNumber(`BL-${Math.floor(10000000 + Math.random() * 90000000)}`);
    setLineItems([
      {
        id: `li-${Date.now()}`,
        description: 'Commercial Export Cargo',
        hsCode: '0901.11.00',
        quantity: 10,
        unit: 'MT',
        unitPrice: 2500,
        total: 25000,
      },
    ]);
  };

  // Form Submission
  const handleSubmitShipment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newDealId = `CF-EXP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newMerkleHash = `0x${Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`;

    setTimeout(() => {
      const newRegistration: ExportShipmentRegistration = {
        id: newDealId,
        registrationDate: new Date().toISOString().split('T')[0],
        status: 'SUBMITTED',
        exporter: {
          name: exporterName,
          lei: exporterLei,
          originCountry,
          portOfLoading,
          contactEmail,
        },
        importer: {
          name: importerName,
          destinationCountry,
          portOfDischarge,
          poNumber,
        },
        shipment: {
          commodity,
          hsTariffCode,
          totalWeight,
          containerId,
          containerType,
          carrier,
          vesselName,
          voyageNumber,
          billOfLadingNumber,
          etd,
          eta,
          incoterm,
        },
        invoice: {
          invoiceNumber,
          invoiceDate,
          dueDate,
          currency,
          lineItems,
          subtotal: totalInvoiceValue,
          totalAmount: totalInvoiceValue,
          advancePayoutRate: advanceRate,
          advancePayoutAmount: calculatedAdvanceAmount,
          escrowFee: calculatedEscrowFee,
          traditionalFee: calculatedTraditionalFee,
          savings: calculatedSavings,
          paymentTerms,
        },
        documents: {
          commercialInvoiceAttached: ciAttached,
          billOfLadingAttached: blAttached,
          certificateOfOriginAttached: coAttached,
          merkleRootHash: newMerkleHash,
        },
      };

      setRegisteredShipments([newRegistration, ...registeredShipments]);
      setSubmittedDealId(newDealId);
      setSubmittedMerkleHash(newMerkleHash);
      setIsSubmitting(false);
      setShowSuccessModal(true);

      // Trigger app-wide push notification
      if (onTriggerNotification) {
        onTriggerNotification(
          `🚢 Export Shipment Registered: ${newDealId}`,
          `Invoice ${invoiceNumber} ($${totalInvoiceValue.toLocaleString()}.00) for container ${containerId} triangulated to smart escrow.`,
          'success',
          'matrix'
        );
      }
    }, 750);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Breadcrumb & Action Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-neutral-500">
            <span>CASHFLOW PROTOCOL</span>
            <span>•</span>
            <span className="text-neutral-900 font-semibold">EXPORT SHIPMENT ONBOARDING</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 mt-1">
            Register Export Shipment &amp; Invoice
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl mt-0.5">
            Register commercial cargo, bill of lading specifications, and cross-border invoices. Mint verifiable trade receivables for automated 85% liquidity advances.
          </p>
        </div>

        {/* Preset quick actions */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-neutral-400 mr-1 hidden sm:inline">PRESETS:</span>
          <button
            type="button"
            onClick={() => handleLoadPreset('coffee')}
            className="px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-medium text-neutral-800 transition-colors shadow-2xs cursor-pointer flex items-center space-x-1.5"
          >
            <span>☕ Robusta Coffee (VN → DE)</span>
          </button>
          <button
            type="button"
            onClick={() => handleLoadPreset('cashews')}
            className="px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-medium text-neutral-800 transition-colors shadow-2xs cursor-pointer flex items-center space-x-1.5"
          >
            <span>🥜 Cashew Nuts (CI → NL)</span>
          </button>
          <button
            type="button"
            onClick={handleResetForm}
            className="px-2.5 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-xs font-mono text-neutral-600 transition-colors cursor-pointer"
            title="Generate fresh IDs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Registration Grid: 8 Cols Form / 4 Cols Valuation & Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT 8 COLS: FORM ================= */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSubmitShipment} className="space-y-6">
            {/* 1. Parties: Exporter & Consignee */}
            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-neutral-900" />
                  <h2 className="text-sm font-semibold text-neutral-950 uppercase tracking-wider font-mono">
                    1. Exporter &amp; Importer Legal Entities
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase bg-neutral-100 px-2 py-0.5 rounded">
                  KYC Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                {/* Exporter Details */}
                <div className="space-y-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-emerald-800">
                    EXPORTER / CONSIGNOR (SELLER)
                  </span>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                      Legal Corporate Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={exporterName}
                      onChange={(e) => setExporterName(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                        LEI Identifier
                      </label>
                      <input
                        type="text"
                        value={exporterLei}
                        onChange={(e) => setExporterLei(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded px-2.5 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                        Origin Country
                      </label>
                      <input
                        type="text"
                        value={originCountry}
                        onChange={(e) => setOriginCountry(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded px-2.5 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                      Port of Loading (POL) *
                    </label>
                    <input
                      type="text"
                      required
                      value={portOfLoading}
                      onChange={(e) => setPortOfLoading(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                </div>

                {/* Importer Details */}
                <div className="space-y-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-blue-800">
                    IMPORTER / CONSIGNEE (BUYER)
                  </span>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                      Buyer Legal Entity *
                    </label>
                    <input
                      type="text"
                      required
                      value={importerName}
                      onChange={(e) => setImporterName(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                        Buyer Purchase Order #
                      </label>
                      <input
                        type="text"
                        value={poNumber}
                        onChange={(e) => setPoNumber(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded px-2.5 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                        Destination Country
                      </label>
                      <input
                        type="text"
                        value={destinationCountry}
                        onChange={(e) => setDestinationCountry(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded px-2.5 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                      Port of Discharge (POD) *
                    </label>
                    <input
                      type="text"
                      required
                      value={portOfDischarge}
                      onChange={(e) => setPortOfDischarge(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Ocean Cargo & Logistics */}
            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div className="flex items-center space-x-2">
                  <Ship className="w-4 h-4 text-neutral-900" />
                  <h2 className="text-sm font-semibold text-neutral-950 uppercase tracking-wider font-mono">
                    2. Cargo, Vessel &amp; Bill of Lading (B/L)
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Maritime Escrow Ready
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    Commodity Description *
                  </label>
                  <input
                    type="text"
                    required
                    value={commodity}
                    onChange={(e) => setCommodity(e.target.value)}
                    placeholder="e.g. Premium Grade-1 Robusta Coffee"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    HS Tariff Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={hsTariffCode}
                    onChange={(e) => setHsTariffCode(e.target.value)}
                    placeholder="0901.11.00"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    Ocean Carrier *
                  </label>
                  <input
                    type="text"
                    required
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    placeholder="Maersk Line"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    Vessel Name &amp; Voyage *
                  </label>
                  <input
                    type="text"
                    required
                    value={vesselName}
                    onChange={(e) => setVesselName(e.target.value)}
                    placeholder="MAERSK MC-KINNEY MOLLER / 2501W"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    Container Number (ISO) *
                  </label>
                  <input
                    type="text"
                    required
                    value={containerId}
                    onChange={(e) => setContainerId(e.target.value)}
                    placeholder="MRSK-9821491"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-2 text-xs font-mono font-semibold text-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    Bill of Lading (B/L) # *
                  </label>
                  <input
                    type="text"
                    required
                    value={billOfLadingNumber}
                    onChange={(e) => setBillOfLadingNumber(e.target.value)}
                    placeholder="MAEU-849102839"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    Incoterms 2020 *
                  </label>
                  <select
                    value={incoterm}
                    onChange={(e) => setIncoterm(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  >
                    <option value="CIF Hamburg Incoterms 2020">CIF (Cost, Insurance &amp; Freight)</option>
                    <option value="FOB Ho Chi Minh Incoterms 2020">FOB (Free On Board)</option>
                    <option value="CFR Hamburg Incoterms 2020">CFR (Cost &amp; Freight)</option>
                    <option value="DAP Destination Incoterms 2020">DAP (Delivered at Place)</option>
                    <option value="EXW Origin Warehouse Incoterms 2020">EXW (Ex Works)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    Total Cargo Weight / Packaging
                  </label>
                  <input
                    type="text"
                    value={totalWeight}
                    onChange={(e) => setTotalWeight(e.target.value)}
                    placeholder="40.00 MT in 2x 20ft FCL"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    Vessel ETD (Sail Date) *
                  </label>
                  <input
                    type="date"
                    required
                    value={etd}
                    onChange={(e) => setEtd(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    Estimated Port ETA (Delivery) *
                  </label>
                  <input
                    type="date"
                    required
                    value={eta}
                    onChange={(e) => setEta(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    Advance Rate (%)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="50"
                      max="95"
                      value={advanceRate}
                      onChange={(e) => setAdvanceRate(Number(e.target.value) || 85)}
                      className="w-20 bg-neutral-50 border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 font-mono focus:outline-none"
                    />
                    <span className="text-[11px] text-neutral-500 font-sans">
                      % upon Ocean B/L Sail
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Commercial Invoice Details & Line Items */}
            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-neutral-900" />
                  <h2 className="text-sm font-semibold text-neutral-950 uppercase tracking-wider font-mono">
                    3. Commercial Invoice &amp; Line Items
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-neutral-950 bg-neutral-100 px-2.5 py-1 rounded border border-neutral-200">
                    TOTAL: ${totalInvoiceValue.toLocaleString()}.00 {currency}
                  </span>
                </div>
              </div>

              {/* Invoice Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-sans">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    Invoice Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    Invoice Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    Payment Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    Currency *
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="SGD">SGD (S$)</option>
                  </select>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-neutral-700">
                    Invoice Itemized Breakdown
                  </span>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-medium flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="overflow-x-auto border border-neutral-200 rounded-lg">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-neutral-100 text-neutral-700 font-mono text-[10px] uppercase border-b border-neutral-200">
                      <tr>
                        <th className="p-2.5">Item Description</th>
                        <th className="p-2.5 w-28">HS Code</th>
                        <th className="p-2.5 w-24">Qty</th>
                        <th className="p-2.5 w-24">Unit</th>
                        <th className="p-2.5 w-28">Price ({currency})</th>
                        <th className="p-2.5 w-32 text-right">Total ({currency})</th>
                        <th className="p-2.5 w-12 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {lineItems.map((item) => (
                        <tr key={item.id} className="hover:bg-neutral-50/50">
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) =>
                                handleUpdateLineItem(item.id, 'description', e.target.value)
                              }
                              className="w-full bg-white border border-neutral-300 rounded px-2 py-1 text-xs text-neutral-900"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.hsCode}
                              onChange={(e) =>
                                handleUpdateLineItem(item.id, 'hsCode', e.target.value)
                              }
                              className="w-full bg-white border border-neutral-300 rounded px-2 py-1 text-xs font-mono text-neutral-900"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleUpdateLineItem(item.id, 'quantity', e.target.value)
                              }
                              className="w-full bg-white border border-neutral-300 rounded px-2 py-1 text-xs font-mono text-neutral-900"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.unit}
                              onChange={(e) =>
                                handleUpdateLineItem(item.id, 'unit', e.target.value)
                              }
                              className="w-full bg-white border border-neutral-300 rounded px-2 py-1 text-xs text-neutral-900"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              value={item.unitPrice}
                              onChange={(e) =>
                                handleUpdateLineItem(item.id, 'unitPrice', e.target.value)
                              }
                              className="w-full bg-white border border-neutral-300 rounded px-2 py-1 text-xs font-mono text-neutral-900"
                            />
                          </td>
                          <td className="p-2 text-right font-mono font-semibold text-neutral-950">
                            ${(item.total || 0).toLocaleString()}.00
                          </td>
                          <td className="p-2 text-center">
                            {lineItems.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleDeleteLineItem(item.id)}
                                className="text-neutral-400 hover:text-rose-600 p-1 rounded hover:bg-neutral-100 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-neutral-50/80 font-mono text-xs border-t border-neutral-200">
                      <tr>
                        <td colSpan={5} className="p-2.5 text-right font-semibold text-neutral-700">
                          TOTAL INVOICE FACE VALUE:
                        </td>
                        <td className="p-2.5 text-right font-bold text-neutral-950 text-sm">
                          ${totalInvoiceValue.toLocaleString()}.00
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* 4. Digital Document Attestation */}
            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div className="flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-neutral-900" />
                  <h2 className="text-sm font-semibold text-neutral-950 uppercase tracking-wider font-mono">
                    4. Triangulation Document Hashes &amp; Attestation
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  SHA-256 Merkle Attached
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
                <label className="flex items-start space-x-3 p-3 rounded-lg border border-neutral-200 bg-neutral-50/70 cursor-pointer hover:bg-neutral-100/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={ciAttached}
                    onChange={(e) => setCiAttached(e.target.checked)}
                    className="mt-0.5 rounded text-neutral-950 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <div className="font-semibold text-neutral-950">Commercial Invoice (PDF/XML)</div>
                    <div className="text-[10px] text-neutral-500 font-mono">Hash: 0x4a91b...e102</div>
                  </div>
                </label>

                <label className="flex items-start space-x-3 p-3 rounded-lg border border-neutral-200 bg-neutral-50/70 cursor-pointer hover:bg-neutral-100/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={blAttached}
                    onChange={(e) => setBlAttached(e.target.checked)}
                    className="mt-0.5 rounded text-neutral-950 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <div className="font-semibold text-neutral-950">Ocean Bill of Lading (B/L)</div>
                    <div className="text-[10px] text-neutral-500 font-mono">Carrier EDI Hash: 0x88f2...b411</div>
                  </div>
                </label>

                <label className="flex items-start space-x-3 p-3 rounded-lg border border-neutral-200 bg-neutral-50/70 cursor-pointer hover:bg-neutral-100/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={coAttached}
                    onChange={(e) => setCoAttached(e.target.checked)}
                    className="mt-0.5 rounded text-neutral-950 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <div className="font-semibold text-neutral-950">Phytosanitary Certificate</div>
                    <div className="text-[10px] text-neutral-500 font-mono">Origin Chamber Hash: 0x319c...fa99</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Submission CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-medium text-sm flex items-center justify-center space-x-2 shadow-xs cursor-pointer transition-all"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                    <span>Triangulating Documents &amp; Minting Escrow Receivable...</span>
                  </>
                ) : (
                  <>
                    <PackagePlus className="w-4 h-4 text-emerald-400" />
                    <span>
                      Register Export Shipment &amp; Mint Smart Escrow Receivable ($
                      {totalInvoiceValue.toLocaleString()}.00) →
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ================= RIGHT 4 COLS: VALUATION CARD & LEDGER ================= */}
        <div className="lg:col-span-4 space-y-6">
          {/* Real-time Escrow Valuation Card */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center space-x-2">
                <Coins className="w-4 h-4 text-neutral-900" />
                <h3 className="font-semibold text-neutral-950 text-sm">Escrow Liquidity Valuation</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Instant Liquidity
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
                <div className="flex justify-between text-neutral-600">
                  <span>Gross Invoice Total:</span>
                  <span className="font-semibold text-neutral-950">
                    ${totalInvoiceValue.toLocaleString()}.00 {currency}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Immediate Advance ({advanceRate}%):</span>
                  <span className="font-bold text-emerald-600">
                    ${calculatedAdvanceAmount.toLocaleString()}.00
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Final Milestone Settlement ({100 - advanceRate}%):</span>
                  <span className="text-neutral-700">
                    ${(totalInvoiceValue - calculatedAdvanceAmount).toLocaleString()}.00
                  </span>
                </div>
              </div>

              {/* Fee Comparison */}
              <div className="p-3 bg-neutral-950 text-white rounded-lg space-y-2 border border-neutral-800">
                <div className="flex items-center justify-between text-[11px] text-neutral-400 font-sans border-b border-neutral-800 pb-1.5">
                  <span>TRADITIONAL L/C vs CASHFLOW ESCROW</span>
                  <span className="text-emerald-400 font-bold">90% SAVINGS</span>
                </div>
                <div className="flex justify-between text-neutral-400 text-[11px]">
                  <span>Traditional Bank L/C (2.5%):</span>
                  <span className="line-through text-rose-400 font-mono">
                    ${calculatedTraditionalFee.toLocaleString()}.00
                  </span>
                </div>
                <div className="flex justify-between text-neutral-300 text-[11px]">
                  <span>CashFlow Smart Escrow (0.25%):</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    ${calculatedEscrowFee.toLocaleString()}.00
                  </span>
                </div>
                <div className="pt-1.5 border-t border-neutral-800 flex justify-between text-xs font-semibold">
                  <span className="text-white">Net Exporter Savings:</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    +${calculatedSavings.toLocaleString()}.00
                  </span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-emerald-900 text-[11px] font-sans space-y-1">
                <div className="font-semibold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Autonomous Liquidity Assurance</span>
                </div>
                <p className="text-[10px] leading-relaxed text-emerald-800">
                  Upon electronic verification of carrier B/L sail date ({etd}), ${calculatedAdvanceAmount.toLocaleString()}.00 will be instantly unlocked to the exporter&apos;s corporate treasury vault.
                </p>
              </div>
            </div>
          </div>

          {/* Registered Shipments Ledger Card */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-neutral-900" />
                <h3 className="font-semibold text-neutral-950 text-sm">Registered Export Ledger</h3>
              </div>
              <span className="text-xs font-mono text-neutral-500">
                {registeredShipments.length} Active
              </span>
            </div>

            <div className="space-y-3 font-sans text-xs">
              {registeredShipments.map((reg) => (
                <div
                  key={reg.id}
                  className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-neutral-950 text-xs">
                      {reg.id}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        reg.status === 'ESCROW_FUNDED'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-blue-100 text-blue-900 border border-blue-300'
                      }`}
                    >
                      {reg.status}
                    </span>
                  </div>

                  <div className="space-y-0.5 text-[11px] text-neutral-600">
                    <div className="font-medium text-neutral-900 truncate">
                      {reg.shipment.commodity}
                    </div>
                    <div className="flex justify-between font-mono text-[10px] text-neutral-500">
                      <span>Inv: {reg.invoice.invoiceNumber}</span>
                      <span className="font-bold text-neutral-900">
                        ${reg.invoice.totalAmount.toLocaleString()}.00 {reg.invoice.currency}
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono truncate">
                      Container: {reg.shipment.containerId} • {reg.shipment.carrier}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-[11px]">
                    <button
                      type="button"
                      onClick={() => onNavigateToTab('matrix')}
                      className="text-neutral-700 hover:text-neutral-950 font-medium underline flex items-center space-x-1 cursor-pointer"
                    >
                      <span>View Triangulation</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigateToTab('release')}
                      className="text-neutral-700 hover:text-neutral-950 font-medium underline flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Release Code</span>
                      <QrCode className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= SUCCESS CONFIRMATION MODAL ================= */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-neutral-200 shadow-2xl p-6 space-y-5 animate-scaleUp">
            <div className="flex items-center space-x-3 border-b border-neutral-200 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-neutral-950">
                  Export Shipment &amp; Invoice Registered!
                </h3>
                <p className="text-xs text-neutral-500">
                  Deal reference {submittedDealId} successfully minted on cryptographic ledger.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 font-mono text-xs bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <div className="flex justify-between border-b border-neutral-200 pb-1.5">
                <span className="text-neutral-500">DEAL IDENTIFIER:</span>
                <span className="font-bold text-neutral-950">{submittedDealId}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200 pb-1.5">
                <span className="text-neutral-500">INVOICE NUMBER:</span>
                <span className="text-neutral-900">{invoiceNumber}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200 pb-1.5">
                <span className="text-neutral-500">TOTAL INVOICE VALUE:</span>
                <span className="font-bold text-neutral-950">
                  ${totalInvoiceValue.toLocaleString()}.00 {currency}
                </span>
              </div>
              <div className="flex justify-between border-b border-neutral-200 pb-1.5">
                <span className="text-neutral-500">85% ADVANCE LIQUIDITY:</span>
                <span className="font-bold text-emerald-600">
                  ${calculatedAdvanceAmount.toLocaleString()}.00 {currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">CONTAINER ID:</span>
                <span className="text-neutral-900">{containerId}</span>
              </div>
              <div className="pt-1.5 border-t border-neutral-200">
                <span className="text-[10px] text-neutral-400 block mb-0.5">
                  CRYPTOGRAPHIC MERKLE ROOT HASH:
                </span>
                <span className="text-[10px] text-emerald-800 break-all select-all font-mono">
                  {submittedMerkleHash}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  onNavigateToTab('matrix');
                }}
                className="w-full py-2.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-medium cursor-pointer transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
              >
                <span>View in Triangulation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  onNavigateToTab('release');
                }}
                className="w-full py-2.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-800 text-xs font-medium cursor-pointer transition-colors flex items-center justify-center space-x-1.5"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Shipment Release Code</span>
              </button>
            </div>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  handleResetForm();
                }}
                className="text-xs text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
              >
                Register another export shipment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
