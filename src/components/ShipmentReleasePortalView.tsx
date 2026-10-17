import React, { useState } from 'react';
import {
  BadgeCheck,
  ShieldCheck,
  QrCode,
  Check,
  Copy,
  RotateCw,
  Plus,
  Send,
  ArrowRight,
  Info,
  List,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Ship,
  Truck,
} from 'lucide-react';
import { ShipmentReleasePass, UserRole } from '../types';
import { INITIAL_RELEASE_PASSES } from '../data/mockData';

interface ShipmentReleasePortalViewProps {
  selectedCode?: string;
  currentRole: UserRole;
  onRoleSelect: (role: UserRole) => void;
  onAddAuditLog: (action: string, actor: string) => void;
  onTriggerPushNotification: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'alert') => void;
}

export const ShipmentReleasePortalView: React.FC<ShipmentReleasePortalViewProps> = ({
  selectedCode,
  currentRole,
  onRoleSelect,
  onAddAuditLog,
  onTriggerPushNotification,
}) => {
  const [passes, setPasses] = useState<ShipmentReleasePass[]>(INITIAL_RELEASE_PASSES);
  // View mode is strictly 'Exporter' (Handover Pass Code) or 'Importer' (Buyer Verification)
  const activeViewRole: 'Exporter' | 'Importer' = currentRole === 'Importer' ? 'Importer' : 'Exporter';

  const [activeCodeToInspect, setActiveCodeToInspect] = useState<string>(selectedCode || 'CF-REL-9821-X4');
  const [verificationInput, setVerificationInput] = useState<string>(selectedCode || 'CF-REL-9821-X4');
  const [verificationState, setVerificationState] = useState<'idle' | 'success' | 'error' | 'pending'>('idle');
  const [verifiedPass, setVerifiedPass] = useState<ShipmentReleasePass | null>(null);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentPass: ShipmentReleasePass =
    passes.find((p) => p.code === activeCodeToInspect) || passes[0];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateNewCode = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      const num = Math.floor(1 + Math.random() * 9);
      const newCode = `CF-REL-${randomSuffix}-${letter}${num}`;

      const newPass: ShipmentReleasePass = {
        code: newCode,
        dealId: `TX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        exporterName: 'Vietnam AgriTech Export Corp',
        buyerName: 'Global Harvest Import Corp (Europe)',
        containerId: `MSKU-${Math.floor(1000000 + Math.random() * 9000000)}`,
        totalAmount: 185000,
        currency: 'USD',
        status: 'READY_FOR_RELEASE',
        destinationPort: 'Hamburg (CTA-4B)',
        carrier: 'Hapag-Lloyd Express Cargo',
        generatedAt: 'Just now (Verified)',
        securityHash: '0x' + Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      };

      setPasses([newPass, ...passes]);
      setActiveCodeToInspect(newCode);
      setIsGenerating(false);
      onAddAuditLog(`NEW_RELEASE_PASS_ISSUED: ${newCode} for ${newPass.dealId}`, 'EXPORTER_CONSOLE');
      onTriggerPushNotification(
        '🔑 New Shipment Passcode Issued',
        `Passcode ${newCode} generated for container ${newPass.containerId}. Ready for buyer handover.`,
        'success'
      );
    }, 700);
  };

  const handleVerifyCode = (codeToVerify?: string) => {
    const target = (codeToVerify || verificationInput).trim().toUpperCase();
    if (!target) return;

    const matched = passes.find((p) => p.code.toUpperCase() === target);

    if (!matched) {
      setVerificationState('error');
      setVerifiedPass(null);
      onAddAuditLog(`VERIFY_PASSCODE_FAILED: ${target} not found in smart registry`, 'BUYER_GATE_ORACLE');
      onTriggerPushNotification(
        '⚠️ Cargo Verification Alert',
        `Invalid passcode "${target}" entered at Hamburg discharge gate terminal.`,
        'alert'
      );
      return;
    }

    if (matched.status === 'PENDING_PAYMENT') {
      setVerificationState('pending');
      setVerifiedPass(matched);
      onAddAuditLog(`VERIFY_PASSCODE_PENDING: ${target} escrow deposit incomplete`, 'BUYER_GATE_ORACLE');
      return;
    }

    // Success: Discharge cargo & release exporter reserve
    setVerificationState('success');
    setVerifiedPass(matched);

    // Update status in pass table if needed
    setPasses((prev) =>
      prev.map((p) =>
        p.code === matched.code ? { ...p, status: 'RELEASED_AND_DELIVERED' as const } : p
      )
    );

    onAddAuditLog(`CARGO_RELEASE_AUTHORIZED: Passcode ${target} verified. Exporter reserve released!`, 'BUYER_GATE_ORACLE');
    onTriggerPushNotification(
      '🚢 Cargo Discharged & Verified!',
      `Container ${matched.containerId} cleared for terminal exit. Exporter reserve balance disbursed.`,
      'success'
    );
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Portal Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-neutral-600 bg-neutral-100 px-3 py-0.5 rounded-full mb-1 border border-neutral-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>AUTONOMOUS SHIPMENT SETTLEMENT &amp; RELEASE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950">
            {activeViewRole === 'Exporter' ? 'Exporter Handover Pass Code Portal' : 'Importer Buyer Verification Gate'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl leading-relaxed">
            {activeViewRole === 'Exporter'
              ? 'Issue and manage cryptographically signed cargo handover passcodes once buyer escrow is 100% funded. Provide this passcode to the buyer to authorize port discharge.'
              : 'Enter your 14-character shipment release passcode after full escrow settlement to clear cargo at the destination terminal and release the exporter reserve.'}
          </p>
        </div>

        {/* Dedicated Two-Role Toggle: Exporter vs Importer only */}
        <div className="flex flex-wrap items-center bg-white p-1 rounded-full border border-neutral-300 shadow-xs text-xs font-medium shrink-0">
          <button
            onClick={() => onRoleSelect('Exporter')}
            className={`px-4 py-2 rounded-full transition-all flex items-center space-x-2 cursor-pointer ${
              activeViewRole === 'Exporter'
                ? 'bg-neutral-950 text-white shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            <BadgeCheck className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Exporter: Handover Pass Code</span>
          </button>

          <button
            onClick={() => onRoleSelect('Importer')}
            className={`px-4 py-2 rounded-full transition-all flex items-center space-x-2 cursor-pointer ${
              activeViewRole === 'Importer'
                ? 'bg-neutral-950 text-white shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Importer: Buyer Verification</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. EXPORTER PAGE VIEW: HANDOVER PASS CODE ISSUANCE & DIGITAL VOUCHER      */}
      {/* ========================================================================= */}
      {activeViewRole === 'Exporter' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Cols: Official Cargo Handover Pass Card */}
            <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div className="flex items-center space-x-2">
                  <QrCode className="w-4 h-4 text-neutral-950 shrink-0" />
                  <h3 className="font-semibold text-neutral-950 text-sm">Official Cargo Handover Pass</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-semibold border ${
                      currentPass.status === 'RELEASED_AND_DELIVERED'
                        ? 'bg-neutral-100 text-neutral-800 border-neutral-300'
                        : currentPass.status === 'READY_FOR_RELEASE'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {currentPass.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* High Contrast Digital Pass Voucher */}
              <div className="bg-neutral-950 text-white rounded-xl p-5 font-mono space-y-4 relative overflow-hidden shadow-md">
                <div className="absolute -right-4 -bottom-4 text-neutral-800/20 text-9xl pointer-events-none select-none">
                  CF
                </div>

                <div className="flex justify-between items-start border-b border-neutral-800 pb-3 text-xs">
                  <div>
                    <div className="text-[10px] text-neutral-400">ORDER ESCROW REFERENCE</div>
                    <div className="font-bold text-white tracking-wider">{currentPass.dealId}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-neutral-400">CARRIER VESSEL</div>
                    <div className="text-emerald-400 text-xs truncate max-w-[200px]">{currentPass.carrier}</div>
                  </div>
                </div>

                {/* Big Readable Code Display */}
                <div className="py-3.5 text-center bg-neutral-900 rounded-lg border border-neutral-800 space-y-1">
                  <div className="text-[10px] text-neutral-400 tracking-wider font-sans uppercase font-medium">
                    HANDOVER PASSCODE (PROVIDE TO BUYER AFTER FULL ESCROW)
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-widest text-emerald-400 selection:bg-emerald-400 selection:text-black">
                    {currentPass.code}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-sans">
                    Buyer enters this code upon vessel docking to claim physical cargo
                  </div>
                </div>

                {/* Barcode Lines & Copy Action */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-1 py-1">
                    {[4, 2, 6, 3, 5, 2, 7, 3, 5, 2, 4, 6, 2, 5, 3, 7, 2, 4, 3, 6, 4, 5, 2, 6].map((h, i) => (
                      <div key={i} className="bg-white/80 w-1" style={{ height: `${h * 4}px` }}></div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleCopyCode(currentPass.code)}
                    className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-sans rounded-md flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                    <span>{copied ? 'Copied Code!' : 'Copy Passcode'}</span>
                  </button>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-3 text-[11px] pt-2 border-t border-neutral-800 text-neutral-300">
                  <div>
                    <span className="text-neutral-500 block text-[10px]">CARGO CONTAINER ID</span>
                    <span className="font-semibold text-white">{currentPass.containerId}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">TOTAL ESCROW VALUE</span>
                    <span className="font-semibold text-emerald-400">
                      ${currentPass.totalAmount.toLocaleString()} {currentPass.currency}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">BUYER / CONSIGNEE</span>
                    <span className="truncate block">{currentPass.buyerName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">DESTINATION TERMINAL</span>
                    <span className="truncate block">{currentPass.destinationPort}</span>
                  </div>
                </div>

                <div className="text-[10px] text-neutral-500 truncate pt-1 border-t border-neutral-900">
                  ZK Verification Root: {currentPass.securityHash}
                </div>
              </div>

              {/* Exporter Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  disabled={isGenerating}
                  onClick={handleGenerateNewCode}
                  className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-medium rounded-full shadow-xs flex items-center space-x-1.5 cursor-pointer transition-all"
                >
                  {isGenerating ? <RotateCw className="w-3.5 h-3.5 animate-spin shrink-0" /> : <Plus className="w-3.5 h-3.5 shrink-0" />}
                  <span>{isGenerating ? 'Generating...' : 'Issue New Release Code'}</span>
                </button>

                <button
                  onClick={() => {
                    onTriggerPushNotification(
                      '📲 Release Code Dispatched to Buyer',
                      `Passcode ${currentPass.code} securely sent to ${currentPass.buyerName} for container ${currentPass.containerId}.`,
                      'info'
                    );
                  }}
                  className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs font-medium rounded-full flex items-center space-x-1.5 cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5 shrink-0" />
                  <span>Send Passcode Alert to Buyer</span>
                </button>

                <button
                  onClick={() => onRoleSelect('Importer')}
                  className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-medium rounded-full flex items-center space-x-1.5 cursor-pointer transition-colors"
                >
                  <span>Switch to Buyer Verification View</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>
            </div>

            {/* Right 5 Cols: Handover Rules & Info */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-3">
                <div className="flex items-center space-x-2 border-b border-neutral-200 pb-3">
                  <Info className="w-4 h-4 text-neutral-950 shrink-0" />
                  <h3 className="font-semibold text-neutral-950 text-sm">Exporter Handover Instructions</h3>
                </div>

                <div className="space-y-2.5 text-xs text-neutral-600 leading-relaxed">
                  <div className="flex items-start space-x-2">
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                      1
                    </span>
                    <p>
                      <strong>Generate Code:</strong> When buyer payment is 100% held in safe escrow, the handover code
                      is automatically sealed.
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                      2
                    </span>
                    <p>
                      <strong>Provide to Buyer:</strong> Share the passcode via encrypted email, PDF pass, or in-app push
                      alert.
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                      3
                    </span>
                    <p>
                      <strong>Unlock Reserve:</strong> As soon as the buyer enters this code at the terminal, the
                      remaining <strong>$21,300.00 USD reserve</strong> is instantly transferred to your account!
                    </p>
                  </div>
                </div>
              </div>

              {/* Reserve Balance Callout */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-emerald-950">Pending Exporter Reserve</span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    HELD IN ESCROW
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-900">$21,300.00 USD</div>
                <p className="text-[11px] text-emerald-800 leading-snug">
                  Automatically disbursed to Vietnam AgriTech upon buyer passcode verification at Hamburg CTA Terminal.
                </p>
              </div>
            </div>
          </div>

          {/* Directory of Exporter's Issued Passcodes */}
          <div className="bg-white border border-neutral-200 rounded-xl shadow-xs overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center space-x-2">
                <List className="w-4 h-4 text-neutral-900 shrink-0" />
                <h3 className="text-sm font-semibold text-neutral-950">Issued Shipment Handover Passes</h3>
              </div>
              <span className="text-xs font-mono text-neutral-500">{passes.length} consignments</span>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse min-w-[760px]">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500 font-mono text-xs uppercase tracking-wider bg-neutral-50/70">
                    <th className="py-2.5 px-3 font-semibold">Passcode</th>
                    <th className="py-2.5 px-3 font-semibold">Order / Deal</th>
                    <th className="py-2.5 px-3 font-semibold">Buyer (Consignee)</th>
                    <th className="py-2.5 px-3 font-semibold">Container ID</th>
                    <th className="py-2.5 px-3 font-semibold">Total Escrow</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                    <th className="py-2.5 px-3 font-semibold">Issued Date</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-neutral-800 font-sans">
                  {passes.map((p) => (
                    <tr key={p.code} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-neutral-950">{p.code}</td>
                      <td className="py-3 px-3 font-mono text-neutral-600">{p.dealId}</td>
                      <td className="py-3 px-3 font-medium text-neutral-900">{p.buyerName}</td>
                      <td className="py-3 px-3 font-mono text-neutral-700">{p.containerId}</td>
                      <td className="py-3 px-3 font-mono font-bold text-neutral-950">
                        ${p.totalAmount.toLocaleString()} {p.currency}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold border ${
                            p.status === 'RELEASED_AND_DELIVERED'
                              ? 'bg-neutral-100 text-neutral-800 border-neutral-300'
                              : p.status === 'READY_FOR_RELEASE'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {p.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-neutral-500 font-mono text-[11px]">{p.generatedAt}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setActiveCodeToInspect(p.code);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-2.5 py-1 bg-neutral-950 hover:bg-neutral-800 text-white rounded-full text-xs font-medium cursor-pointer transition-colors"
                        >
                          View Pass
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. IMPORTER PAGE VIEW: BUYER VERIFICATION & CARGO DISCHARGE GATE          */}
      {/* ========================================================================= */}
      {activeViewRole === 'Importer' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Cols: Verification Form */}
            <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-neutral-950 shrink-0" />
                  <h3 className="font-semibold text-neutral-950 text-sm">Buyer Cargo Verification Gate</h3>
                </div>
                <span className="text-[10px] font-mono text-neutral-500">GATE TERMINAL: CTA-4B</span>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                As the buyer / importer, enter the 14-character handover passcode provided by the exporter after your
                escrow deposit has completed to authorize cargo collection and release the bill of lading.
              </p>

              {/* Passcode Input */}
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-neutral-500 mb-1 text-[11px] font-sans font-medium uppercase tracking-wider">
                    ENTER SHIPMENT RELEASE PASSCODE
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      type="text"
                      value={verificationInput}
                      onChange={(e) => {
                        setVerificationInput(e.target.value);
                        setVerificationState('idle');
                      }}
                      placeholder="e.g. CF-REL-9821-X4"
                      className="flex-1 bg-neutral-50 border border-neutral-300 rounded px-3 py-2.5 text-xs text-neutral-900 font-bold uppercase tracking-wider focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    />
                    <button
                      onClick={() => handleVerifyCode()}
                      className="px-6 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded text-xs font-sans font-medium shadow-xs transition-colors cursor-pointer"
                    >
                      Verify &amp; Claim Cargo
                    </button>
                  </div>
                </div>

                {/* Quick Autofill Buttons for Testing */}
                <div className="flex flex-wrap items-center gap-2 pt-1 font-sans text-xs">
                  <span className="text-neutral-400 text-[11px]">Quick Test:</span>
                  <button
                    onClick={() => {
                      setVerificationInput('CF-REL-9821-X4');
                      handleVerifyCode('CF-REL-9821-X4');
                    }}
                    className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded text-xs cursor-pointer"
                  >
                    Order #0842 (Ready to Release)
                  </button>
                  <button
                    onClick={() => {
                      setVerificationInput('CF-REL-7740-B2');
                      handleVerifyCode('CF-REL-7740-B2');
                    }}
                    className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded text-xs cursor-pointer"
                  >
                    Order #0811 (Pending Escrow)
                  </button>
                </div>
              </div>

              {/* Verification Feedback Result */}
              {verificationState === 'success' && verifiedPass && (
                <div className="p-5 bg-emerald-50 border-2 border-emerald-500 rounded-xl space-y-3 animate-fadeIn">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600 mt-0.5 shrink-0" />
                    <div className="space-y-1">
                      <div className="font-bold text-emerald-950 text-sm">
                        GREEN CLEARANCE GRANTED — CARGO DISCHARGED &amp; RECEIVED
                      </div>
                      <p className="text-xs text-emerald-800 leading-relaxed">
                        Escrow of $142,000.00 verified. Container <strong>{verifiedPass.containerId}</strong> is officially
                        cleared for terminal gate exit. Exporter reserve balance ($21,300.00 USD) has been released
                        autonomously.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-emerald-200 text-xs font-mono space-y-1.5 text-neutral-800">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Verified Consignee:</span>
                      <span className="font-semibold text-neutral-900">{verifiedPass.buyerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Container Clearance:</span>
                      <span className="font-semibold text-neutral-900">{verifiedPass.containerId} (Gate 4B)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Release Timestamp:</span>
                      <span>{new Date().toISOString().substring(0, 19).replace('T', ' ')} UTC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Customs Seal:</span>
                      <span className="text-emerald-700 font-bold">DE-HAM-CUSTOMS-APPROVED-994</span>
                    </div>
                  </div>
                </div>
              )}

              {verificationState === 'pending' && (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-2 animate-fadeIn">
                  <div className="flex items-start space-x-2.5 text-amber-900">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-xs">Payment Escrow Incomplete</div>
                      <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                        Buyer deposit is still undergoing clearing. Physical cargo handover remains locked until the full
                        balance is settled in escrow.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {verificationState === 'error' && (
                <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl space-y-2 animate-fadeIn">
                  <div className="flex items-start space-x-2.5 text-rose-900">
                    <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-xs">Invalid Release Passcode</div>
                      <p className="text-[11px] text-rose-800 mt-0.5 leading-relaxed">
                        Passcode &ldquo;{verificationInput}&rdquo; was not recognized on the smart contract registry. Please check
                        the code provided by your seller.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right 5 Cols: Importer Verification Summary & Customs Gate Info */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-3">
                <div className="flex items-center space-x-2 border-b border-neutral-200 pb-3">
                  <Ship className="w-4 h-4 text-neutral-950 shrink-0" />
                  <h3 className="font-semibold text-neutral-950 text-sm">Destination Terminal Details</h3>
                </div>

                <div className="space-y-2 text-xs font-mono text-neutral-700">
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-sans">Port:</span>
                    <span className="font-bold text-neutral-950 font-sans">Hamburg Port (DEHAM)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-sans">Terminal:</span>
                    <span className="font-sans">Container Terminal Altenwerder (CTA)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-sans">Discharge Gate:</span>
                    <span className="text-emerald-700 font-bold font-sans">Gate 4B (Fast-Track)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-sans">Carrier Line:</span>
                    <span className="font-sans">Maersk Line Ocean Fleet</span>
                  </div>
                </div>
              </div>

              {/* Escrow Protection Guarantee */}
              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center space-x-2 font-semibold text-neutral-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Buyer Escrow Security Guarantee</span>
                </div>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  Your funds are protected in smart contract escrow until you verify cargo at the terminal gate. If goods
                  fail inspection, dispute arbitration holds the reserve before final release.
                </p>
              </div>
            </div>
          </div>

          {/* Importer's Consignment Deliveries History */}
          <div className="bg-white border border-neutral-200 rounded-xl shadow-xs overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-neutral-900 shrink-0" />
                <h3 className="text-sm font-semibold text-neutral-950">Importer Consignment Verification History</h3>
              </div>
              <span className="text-xs font-mono text-neutral-500">Global Harvest Corp</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500 font-mono text-[11px] uppercase tracking-wider bg-neutral-50/70">
                    <th className="py-2.5 px-3 font-semibold">Deal ID</th>
                    <th className="py-2.5 px-3 font-semibold">Passcode Entered</th>
                    <th className="py-2.5 px-3 font-semibold">Supplier (Exporter)</th>
                    <th className="py-2.5 px-3 font-semibold">Container ID</th>
                    <th className="py-2.5 px-3 font-semibold">Escrow Value</th>
                    <th className="py-2.5 px-3 font-semibold">Verification Status</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-neutral-800 font-sans">
                  {passes.map((p) => (
                    <tr key={p.code} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-semibold text-neutral-950">{p.dealId}</td>
                      <td className="py-3 px-3 font-mono font-bold text-neutral-900">{p.code}</td>
                      <td className="py-3 px-3 font-medium text-neutral-900">{p.exporterName}</td>
                      <td className="py-3 px-3 font-mono text-neutral-700">{p.containerId}</td>
                      <td className="py-3 px-3 font-mono font-bold text-neutral-950">
                        ${p.totalAmount.toLocaleString()} {p.currency}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold border ${
                            p.status === 'RELEASED_AND_DELIVERED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-neutral-100 text-neutral-700 border-neutral-300'
                          }`}
                        >
                          {p.status === 'RELEASED_AND_DELIVERED' ? 'DISCHARGED & CLEARED' : 'AWAITING GATE CODE'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setVerificationInput(p.code);
                            handleVerifyCode(p.code);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-2.5 py-1 bg-neutral-950 hover:bg-neutral-800 text-white rounded-full text-xs font-medium cursor-pointer transition-colors"
                        >
                          Verify Code
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
