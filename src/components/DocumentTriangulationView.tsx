import React, { useState } from 'react';
import {
  HelpCircle,
  DollarSign,
  CheckSquare,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Shield,
  Check,
  Receipt,
  Timer,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Clock,
  ShoppingCart,
  Ship,
  Sparkles,
  Landmark,
  Zap,
  History,
  X,
  Play,
  RotateCw,
  Info,
  Route,
} from 'lucide-react';
import { DealData, ScenarioType } from '../types';
import { SCENARIOS, RAW_DOCUMENTS } from '../data/mockData';

interface DocumentTriangulationViewProps {
  onPayoutSuccess?: (amount: number, dealId: string) => void;
  onAddAuditLog: (action: string, actor: string) => void;
  onTriggerPushNotification: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'alert') => void;
}

export const DocumentTriangulationView: React.FC<DocumentTriangulationViewProps> = ({
  onPayoutSuccess,
  onAddAuditLog,
  onTriggerPushNotification,
}) => {
  const [currentScenario, setCurrentScenario] = useState<ScenarioType>('clean');
  const [docTab, setDocTab] = useState<'table' | 'ci' | 'po' | 'bl' | 'ai'>('table');
  const [advancePercent, setAdvancePercent] = useState<number>(85);
  const [payoutStep, setPayoutStep] = useState<'idle' | 'broadcasting' | 'zkproof' | 'completed'>('idle');
  const [aiEngineStage, setAiEngineStage] = useState<'idle' | 'ocr' | 'invariants' | 'completed'>('idle');

  const deal: DealData = SCENARIOS[currentScenario];

  // Mathematical Calculations
  const principal = (deal.faceValue * advancePercent) / 100;
  const discountFee = deal.faceValue * 0.032;
  const immediatePayout = Math.max(0, principal - discountFee);
  const reserve = deal.faceValue - principal;

  const handleScenarioChange = (scenario: ScenarioType) => {
    setCurrentScenario(scenario);
    setPayoutStep('idle');
    setDocTab('table');
    onAddAuditLog(`SCENARIO_SWITCHED_TO_${scenario.toUpperCase()}`, 'CONSOLE_OPERATOR');
  };

  const handleExecuteFinancing = () => {
    if (!deal.canFinance || payoutStep !== 'idle') return;

    setPayoutStep('broadcasting');
    onAddAuditLog(`BROADCASTING_TX: Requesting payout for ${deal.id}`, 'EXPORTER_TREASURY');

    setTimeout(() => {
      setPayoutStep('zkproof');
      onAddAuditLog('ZK_PROOF_VERIFY: Cross-document Merkle root validated', 'ORACLE_NODE');
    }, 1000);

    setTimeout(() => {
      setPayoutStep('completed');
      onAddAuditLog(
        `PAYOUT_RELEASED: $${immediatePayout.toLocaleString('en-US', {
          minimumFractionDigits: 2,
        })} USDC transferred to ${deal.sellerName}`,
        'FINANCIER_POOL'
      );
      if (onPayoutSuccess) {
        onPayoutSuccess(immediatePayout, deal.id);
      }
      onTriggerPushNotification(
        '⚡ Instant Payout Received!',
        `$${immediatePayout.toLocaleString('en-US', {
          minimumFractionDigits: 2,
        })} USD has been deposited to your account for order ${deal.id}.`,
        'success'
      );
    }, 2200);
  };

  const handleRunAITriangulation = () => {
    setAiEngineStage('ocr');
    onAddAuditLog(`AI_TRIANGULATION_RUN: Parsing documents for ${deal.id}`, 'GEMINI_NEURO_SYMBOLIC');

    setTimeout(() => {
      setAiEngineStage('invariants');
      onAddAuditLog('DETERMINISTIC_RULES_CHECK: Verifying 5 Mathematical Invariants', 'SYMBOLIC_CORE');
    }, 1100);

    setTimeout(() => {
      setAiEngineStage('completed');
      onAddAuditLog(
        deal.statusType === 'success'
          ? 'ZERO_ERROR_PROOF_GENERATED: Merkle attestation 0x8f2a...391 verified'
          : `DISCREPANCY_HALT: Deterministic engine halted underwriting on ${deal.status}`,
        'MERKLE_ATTESTOR'
      );
      onTriggerPushNotification(
        deal.statusType === 'success' ? '🤖 AI Triangulation Passed (0% Errors)' : '⚠️ AI Flagged Discrepancy',
        deal.statusType === 'success'
          ? 'All 5 mathematical and Incoterm invariants verified with zero errors.'
          : deal.matchSummary,
        deal.statusType === 'success' ? 'success' : 'warning'
      );
    }, 2300);
  };

  return (
    <div className="w-full space-y-6">
      {/* HERO SECTION */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-4 pb-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-neutral-200 pb-8">
          {/* Left Column: Editorial & Scenarios */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
            <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-neutral-600 bg-neutral-100 px-3 py-1 rounded-full w-fit border border-neutral-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Protected Payment • Instant Automated Check • Zero Paperwork</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-neutral-950 leading-[1.15]">
              Get Paid Early for Your Global Trade.
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl leading-relaxed">
              We verify your shipping documents in seconds, protect your funds safely in escrow, and get your business
              paid upfront without bank delays or hidden charges.
            </p>

            {/* Beginner Guide Callout Banner */}
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start space-x-3 text-xs text-neutral-800">
              <HelpCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold text-neutral-900 text-sm">How does this work? (3 Simple Steps)</div>
                <p className="text-neutral-600 mt-1 leading-normal">
                  <strong>1.</strong> Buyer places an order.
                  <strong className="ml-2">2.</strong> Buyer&apos;s payment is held in a protected digital vault (Escrow).
                  <strong className="ml-2">3.</strong> Once your ship departs, you get immediate cash into your account without waiting 60+ days.
                </p>
              </div>
            </div>

            {/* Interactive Scenario Buttons */}
            <div className="pt-1">
              <div className="text-xs font-medium text-neutral-500 mb-2 flex items-center space-x-1.5">
                <span>Try testing an example order:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleScenarioChange('clean')}
                  className={`px-3.5 py-2 rounded-full text-xs font-medium transition-all flex items-center space-x-2 shadow-xs cursor-pointer ${
                    currentScenario === 'clean'
                      ? 'bg-neutral-950 text-white'
                      : 'bg-white text-neutral-700 hover:text-neutral-950 border border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Order #0842 (Ready to Pay • 100% Match)</span>
                </button>

                <button
                  onClick={() => handleScenarioChange('fraud')}
                  className={`px-3.5 py-2 rounded-full text-xs font-medium transition-all flex items-center space-x-2 shadow-xs cursor-pointer ${
                    currentScenario === 'fraud'
                      ? 'bg-neutral-950 text-white'
                      : 'bg-white text-neutral-700 hover:text-neutral-950 border border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>Order #0918 (Price Discrepancy Alert)</span>
                </button>

                <button
                  onClick={() => handleScenarioChange('date')}
                  className={`px-3.5 py-2 rounded-full text-xs font-medium transition-all flex items-center space-x-2 shadow-xs cursor-pointer ${
                    currentScenario === 'date'
                      ? 'bg-neutral-950 text-white'
                      : 'bg-white text-neutral-700 hover:text-neutral-950 border border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Order #0610 (Late Ship Departure)</span>
                </button>
              </div>
            </div>

            {/* Primary Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                disabled={!deal.canFinance || payoutStep !== 'idle'}
                onClick={handleExecuteFinancing}
                className={`text-sm font-medium px-6 py-3 rounded-full transition-all shadow-xs flex items-center space-x-2 cursor-pointer ${
                  deal.canFinance
                    ? 'bg-neutral-950 hover:bg-neutral-800 text-white'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
              >
                <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {payoutStep === 'completed'
                    ? '⚡ Payout Completed'
                    : `Request Instant Payout ($${immediatePayout.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                      })})`}
                </span>
              </button>

              <a
                href="#matrix"
                className="bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 text-sm font-medium px-5 py-3 rounded-full transition-all shadow-xs flex items-center space-x-2"
              >
                <CheckSquare className="w-4 h-4 text-neutral-500 shrink-0" />
                <span>View Document Match Details</span>
              </a>
            </div>

            <div className="text-xs text-neutral-500 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Money is directly transferred into your verified business bank account. Zero waiting.</span>
            </div>
          </div>

          {/* Right Column: 3D Escrow Vault Telemetry Card */}
          <div className="lg:col-span-5">
            <div className="border border-neutral-300 bg-white rounded-xl shadow-xs p-4 sm:p-5 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-semibold text-neutral-800">
                    Live Payment Vault Status — Safe &amp; Secured
                  </span>
                </div>
                <span className="text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Interactive 3D Safe
                </span>
              </div>

              {/* 3D Safe Visualizer Simulation */}
              <div className="w-full h-52 relative rounded-lg overflow-hidden flex flex-col items-center justify-center bg-gradient-to-b from-neutral-50 to-neutral-100 border border-neutral-200 p-4">
                <div className="relative">
                  {/* Outer Glowing Ring */}
                  <div className="w-24 h-24 rounded-full border-4 border-emerald-400/30 flex items-center justify-center animate-spin" style={{ animationDuration: '18s' }}>
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-500/50"></div>
                  </div>
                  {/* Center Safe Vault */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center shadow-md">
                      <Lock className="w-7 h-7 text-emerald-700" />
                    </div>
                  </div>
                </div>

                <div className="text-sm font-bold text-neutral-900 mt-3 font-mono">
                  ${deal.faceValue.toLocaleString('en-US', { minimumFractionDigits: 2 })} Protected in Safe Escrow
                </div>
                <div className="text-xs text-neutral-500 text-center max-w-xs mt-1">
                  This animated vault represents your buyer&apos;s locked deposit, safely safeguarded until cargo delivery.
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-600">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium text-neutral-800">
                    {deal.canFinance ? 'Funds Verified & 100% Ready for Exporter Payout' : 'Underwriting Alert Flagged'}
                  </span>
                </div>
                <span className="text-neutral-400 font-mono text-[11px]">Active &amp; Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* METRIC GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-8 border-b border-neutral-200">
          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs hover:border-neutral-400 transition-colors">
            <div className="text-xs font-medium text-neutral-500 flex items-center justify-between">
              <span>Safe Escrow Balance</span>
              <Shield className="w-4 h-4 text-neutral-400 shrink-0" />
            </div>
            <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 mt-2 font-mono">
              $3,842,500.00
            </div>
            <div className="text-xs text-neutral-600 mt-2 flex items-center space-x-1">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Money held safely in deposit for upcoming deliveries</span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs hover:border-neutral-400 transition-colors">
            <div className="text-xs font-medium text-neutral-500 flex items-center justify-between">
              <span>Invoices Waiting</span>
              <Receipt className="w-4 h-4 text-neutral-400 shrink-0" />
            </div>
            <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 mt-2 font-mono">
              $1,920,000.00
            </div>
            <div className="text-xs text-neutral-600 mt-2 flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900"></span>
              <span>Active orders being processed across 19 businesses</span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs hover:border-neutral-400 transition-colors">
            <div className="text-xs font-medium text-neutral-500 flex items-center justify-between">
              <span>Automated Check Speed</span>
              <Timer className="w-4 h-4 text-neutral-400 shrink-0" />
            </div>
            <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 mt-2 font-mono flex items-baseline">
              <span>1.82</span>
              <span className="text-sm text-neutral-400 ml-1 font-sans">seconds</span>
            </div>
            <div className="text-xs text-neutral-600 mt-2 flex items-center space-x-1">
              <span className="text-emerald-700 font-medium">Fast automated document check</span>
              <span className="text-neutral-400">• No manual delays</span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs hover:border-neutral-400 transition-colors">
            <div className="text-xs font-medium text-neutral-500 flex items-center justify-between">
              <span>Document Accuracy Rate</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>
            <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 mt-2 font-mono">
              100.00%
            </div>
            <div className="text-xs text-neutral-600 mt-2 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Verified match with zero errors or discrepancies</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4-STEP PIPELINE STEPPER */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 py-2 w-full">
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-neutral-200 pb-3">
            <div className="flex items-center space-x-2">
              <Route className="w-4 h-4 text-neutral-900 shrink-0" />
              <h3 className="text-sm font-semibold text-neutral-950">Order Progress (4 Simple Steps)</h3>
            </div>
            <span className="text-xs text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              {payoutStep === 'completed' ? 'Step 4 of 4: Early Payout Disbursed' : 'Step 3 of 4: Funds Safe in Escrow'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Step 1 */}
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-900">
                  <span className="w-5 h-5 rounded-full bg-neutral-950 text-white flex items-center justify-center text-xs">
                    ✓
                  </span>
                  <span>Step 1: Upload Documents</span>
                </div>
                <p className="text-xs text-neutral-600 mt-2">
                  Invoice and cargo shipping papers successfully received.
                </p>
              </div>
              <span className="text-[11px] text-emerald-700 font-medium mt-3 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" /> Completed (Today 10:14 UTC)
              </span>
            </div>

            {/* Step 2 */}
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-900">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      deal.statusType === 'danger'
                        ? 'bg-rose-600 text-white'
                        : deal.statusType === 'warning'
                        ? 'bg-amber-500 text-white'
                        : 'bg-neutral-950 text-white'
                    }`}
                  >
                    {deal.statusType === 'success' ? '✓' : '!'}
                  </span>
                  <span>Step 2: Instant Document Check</span>
                </div>
                <p className="text-xs text-neutral-600 mt-2">
                  Computer checked price, quantities, and dates against PO.
                </p>
              </div>
              <span
                className={`text-[11px] font-medium mt-3 flex items-center ${
                  deal.statusType === 'danger'
                    ? 'text-rose-700'
                    : deal.statusType === 'warning'
                    ? 'text-amber-700'
                    : 'text-emerald-700'
                }`}
              >
                {deal.statusType === 'success' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 mr-1 text-rose-600 shrink-0" />
                )}{' '}
                {deal.status}
              </span>
            </div>

            {/* Step 3 */}
            <div
              className={`p-3 rounded-lg border-2 flex flex-col justify-between shadow-xs ${
                deal.canFinance
                  ? 'bg-emerald-50/50 border-emerald-500'
                  : 'bg-neutral-50 border-neutral-300'
              }`}
            >
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-neutral-950">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs animate-pulse">
                    3
                  </span>
                  <span>Step 3: Funds Protected in Safe Escrow</span>
                </div>
                <p className="text-xs text-neutral-700 mt-2">
                  Buyer&apos;s ${deal.faceValue.toLocaleString()} is safely locked. Seller is guaranteed payment.
                </p>
              </div>
              <span className="text-[11px] text-emerald-800 font-semibold mt-3 flex items-center">
                <Lock className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" /> Protected &amp; Guaranteed Now
              </span>
            </div>

            {/* Step 4 */}
            <div
              className={`p-3 rounded-lg border flex flex-col justify-between ${
                payoutStep === 'completed'
                  ? 'bg-emerald-50/60 border-emerald-500'
                  : 'bg-neutral-50/70 border-neutral-200 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center space-x-2 text-xs font-medium text-neutral-600">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      payoutStep === 'completed'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    4
                  </span>
                  <span>Step 4: Receive Early Cash</span>
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  Withdraw early cash today or wait for port arrival.
                </p>
              </div>
              <span
                className={`text-[11px] font-medium mt-3 flex items-center ${
                  payoutStep === 'completed' ? 'text-emerald-700 font-semibold' : 'text-neutral-500'
                }`}
              >
                {payoutStep === 'completed' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />
                ) : (
                  <Clock className="w-3.5 h-3.5 mr-1 text-neutral-500 shrink-0" />
                )}{' '}
                {payoutStep === 'completed' ? 'Disbursed to Bank Account' : 'Ready for Your Click'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CORE OPERATIONAL WORKSPACE (TWO COLUMNS) */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 w-full" id="matrix">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================= LEFT COLUMN: DOCUMENT TRIANGULATION MATRIX (7 COLS) ================= */}
          <div className="col-span-1 lg:col-span-7 space-y-6">
            {/* Deal Header Metadata Card */}
            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded bg-neutral-100 border border-neutral-200 font-mono text-xs font-semibold text-neutral-950">
                    {deal.displayId}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center space-x-1.5 ${
                      deal.statusType === 'success'
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                        : deal.statusType === 'danger'
                        ? 'bg-rose-50 border border-rose-200 text-rose-700'
                        : 'bg-amber-50 border border-amber-200 text-amber-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        deal.statusType === 'success'
                          ? 'bg-emerald-500'
                          : deal.statusType === 'danger'
                          ? 'bg-rose-500'
                          : 'bg-amber-500'
                      }`}
                    ></span>
                    <span>{deal.status}</span>
                  </span>

                  <span className="text-xs text-neutral-500 flex items-center space-x-1">
                    <span>Shipping Terms: {deal.shippingTerms}</span>
                    <span
                      className="cursor-pointer"
                      title="CIF Hamburg means the seller arranges sea transport, insurance, and delivery directly to Hamburg port."
                    >
                      <Info className="w-3.5 h-3.5 text-neutral-400 inline shrink-0" />
                    </span>
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-xs text-neutral-500">Total Invoice Amount</div>
                  <div className="text-xl font-bold font-mono text-neutral-950">
                    ${deal.faceValue.toLocaleString('en-US', { minimumFractionDigits: 2 })} {deal.currency}
                  </div>
                </div>
              </div>

              {/* Bilateral Counterparty Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="text-neutral-500 text-xs font-medium mb-1">Seller (Exporter - Who gets paid)</div>
                  <div className="text-neutral-950 font-semibold text-sm">{deal.sellerName}</div>
                  <div className="text-neutral-500 mt-1 text-xs">{deal.sellerLocation}</div>
                  <div className="mt-2.5 text-emerald-800 flex items-center text-xs font-medium bg-emerald-50 px-2 py-1 rounded border border-emerald-200 w-fit">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" /> Identity Verified &amp; Legally Approved
                  </div>
                </div>

                <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="text-neutral-500 text-xs font-medium mb-1">Buyer (Importer - Who pays)</div>
                  <div className="text-neutral-950 font-semibold text-sm">{deal.buyerName}</div>
                  <div className="text-neutral-500 mt-1 text-xs">{deal.buyerLocation}</div>
                  <div className="mt-2.5 text-emerald-800 flex items-center text-xs font-medium bg-emerald-50 px-2 py-1 rounded border border-emerald-200 w-fit">
                    <Lock className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" /> Money Safely Deposited in Escrow (${(deal.faceValue / 1000).toFixed(0)}k)
                  </div>
                </div>
              </div>
            </div>

            {/* Document Inspection & Comparison */}
            <div className="bg-white border border-neutral-200 rounded-xl shadow-xs overflow-hidden">
              {/* Tabs Bar */}
              <div className="border-b border-neutral-200 bg-neutral-50/60 px-4 flex items-center justify-between overflow-x-auto scrollbar-none">
                <div className="flex space-x-1 shrink-0">
                  <button
                    onClick={() => setDocTab('table')}
                    className={`px-3 py-3 text-xs font-medium border-b-2 flex items-center space-x-1.5 focus:outline-none cursor-pointer whitespace-nowrap shrink-0 ${
                      docTab === 'table'
                        ? 'border-neutral-950 text-neutral-950 font-semibold'
                        : 'border-transparent text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    <CheckSquare className="w-3.5 h-3.5 shrink-0" />
                    <span>Document Comparison</span>
                  </button>

                  <button
                    onClick={() => setDocTab('ci')}
                    className={`px-3 py-3 text-xs font-medium border-b-2 flex items-center space-x-1.5 focus:outline-none cursor-pointer whitespace-nowrap shrink-0 ${
                      docTab === 'ci'
                        ? 'border-neutral-950 text-neutral-950 font-semibold'
                        : 'border-transparent text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    <Receipt className="w-3.5 h-3.5 shrink-0" />
                    <span>1. Commercial Invoice</span>
                  </button>

                  <button
                    onClick={() => setDocTab('po')}
                    className={`px-3 py-3 text-xs font-medium border-b-2 flex items-center space-x-1.5 focus:outline-none cursor-pointer whitespace-nowrap shrink-0 ${
                      docTab === 'po'
                        ? 'border-neutral-950 text-neutral-950 font-semibold'
                        : 'border-transparent text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                    <span>2. Purchase Order</span>
                  </button>

                  <button
                    onClick={() => setDocTab('bl')}
                    className={`px-3 py-3 text-xs font-medium border-b-2 flex items-center space-x-1.5 focus:outline-none cursor-pointer whitespace-nowrap shrink-0 ${
                      docTab === 'bl'
                        ? 'border-neutral-950 text-neutral-950 font-semibold'
                        : 'border-transparent text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    <Ship className="w-3.5 h-3.5 shrink-0" />
                    <span>3. Bill of Lading (BL)</span>
                  </button>

                  <button
                    onClick={() => setDocTab('ai')}
                    className={`px-3 py-3 text-xs font-medium border-b-2 flex items-center space-x-1.5 focus:outline-none cursor-pointer whitespace-nowrap shrink-0 ${
                      docTab === 'ai'
                        ? 'border-neutral-950 text-neutral-950 font-semibold'
                        : 'border-transparent text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>4. Zero-Error AI Engine</span>
                  </button>
                </div>

                <div className="hidden lg:flex items-center text-xs text-neutral-600 font-medium shrink-0 ml-3">
                  <span
                    className={`w-2 h-2 rounded-full mr-1.5 ${
                      deal.statusType === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  ></span>
                  Check Accuracy: {deal.statusType === 'success' ? '100%' : 'Discrepancy'}
                </div>
              </div>

              {/* Tab Content: Matrix View */}
              {docTab === 'table' ? (
                <div className="p-5 space-y-4">
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left text-xs border-collapse min-w-[620px]">
                      <thead>
                        <tr className="border-b border-neutral-200 text-neutral-500 text-xs uppercase tracking-wider">
                          <th className="py-2.5 px-3 font-semibold">Details Checked</th>
                          <th className="py-2.5 px-3 font-semibold">Commercial Invoice (CI)</th>
                          <th className="py-2.5 px-3 font-semibold">Purchase Order (PO)</th>
                          <th className="py-2.5 px-3 font-semibold">Shipping Receipt (BL)</th>
                          <th className="py-2.5 px-3 text-right font-semibold">Result</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 text-neutral-800">
                        {/* Row 1: Amount */}
                        <tr className="hover:bg-neutral-50 transition-colors">
                          <td className="py-3 px-3 text-neutral-600 font-medium">Agreed Price</td>
                          <td className="py-3 px-3 font-semibold text-neutral-900">{deal.invoiceAmt}</td>
                          <td className="py-3 px-3 font-semibold text-neutral-900">{deal.poAmt}</td>
                          <td className="py-3 px-3 text-neutral-500">{deal.blStatus}</td>
                          <td className="py-3 px-3 text-right">
                            {currentScenario === 'fraud' ? (
                              <span className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold inline-flex items-center shrink-0 whitespace-nowrap">
                                <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600 shrink-0" /> +$47,000 Mismatch
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold inline-flex items-center shrink-0 whitespace-nowrap">
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" /> Price Matches Perfectly
                              </span>
                            )}
                          </td>
                        </tr>

                        {/* Row 2: Cargo Description */}
                        <tr className="hover:bg-neutral-50 transition-colors">
                          <td className="py-3 px-3 text-neutral-600 font-medium">Goods Shipped</td>
                          <td className="py-3 px-3">{deal.goodsDescription}</td>
                          <td className="py-3 px-3">{deal.goodsDescription}</td>
                          <td className="py-3 px-3">40 MT Coffee Beans Robusta</td>
                          <td className="py-3 px-3 text-right">
                            <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold inline-flex items-center shrink-0 whitespace-nowrap">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" /> Same Goods Confirmed
                            </span>
                          </td>
                        </tr>

                        {/* Row 3: Shipping Route */}
                        <tr className="hover:bg-neutral-50 transition-colors">
                          <td className="py-3 px-3 text-neutral-600 font-medium">Shipping Route</td>
                          <td className="py-3 px-3">{deal.shippingRoute}</td>
                          <td className="py-3 px-3">{deal.shippingRoute}</td>
                          <td className="py-3 px-3">{deal.shippingRoute}</td>
                          <td className="py-3 px-3 text-right">
                            <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold inline-flex items-center shrink-0 whitespace-nowrap">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" /> Route Verified on Boat
                            </span>
                          </td>
                        </tr>

                        {/* Row 4: Shipping Date */}
                        <tr className="hover:bg-neutral-50 transition-colors">
                          <td className="py-3 px-3 text-neutral-600 font-medium">Shipment Dates</td>
                          <td className="py-3 px-3">{deal.departureDate}</td>
                          <td className="py-3 px-3">{deal.poCutoffDate}</td>
                          <td className="py-3 px-3">Loaded on {deal.vessel}</td>
                          <td className="py-3 px-3 text-right">
                            {currentScenario === 'date' ? (
                              <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold inline-flex items-center shrink-0 whitespace-nowrap">
                                <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600 shrink-0" /> Exceeds PO Window
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold inline-flex items-center shrink-0 whitespace-nowrap">
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" /> Shipped on Schedule
                              </span>
                            )}
                          </td>
                        </tr>

                        {/* Row 5: Delivery Responsibilities */}
                        <tr className="hover:bg-neutral-50 transition-colors">
                          <td className="py-3 px-3 text-neutral-600 font-medium">Delivery Responsibilities</td>
                          <td className="py-3 px-3">{deal.shippingTerms} (Insured)</td>
                          <td className="py-3 px-3">CIF European Port</td>
                          <td className="py-3 px-3">Freight Prepaid</td>
                          <td className="py-3 px-3 text-right">
                            <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold inline-flex items-center shrink-0 whitespace-nowrap">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" /> Approved Terms
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Visual Summary Callout Box */}
                  <div
                    className={`mt-3 p-4 rounded-lg flex items-start space-x-3 border ${
                      deal.statusType === 'success'
                        ? 'bg-emerald-50 border-emerald-200'
                        : deal.statusType === 'danger'
                        ? 'bg-rose-50 border-rose-200'
                        : 'bg-amber-50 border-amber-200'
                    }`}
                  >
                    {deal.statusType === 'success' ? (
                      <ShieldCheck className="w-6 h-6 text-emerald-600 mt-0.5 shrink-0" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-rose-600 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <div
                        className={`text-sm font-semibold flex items-center space-x-2 ${
                          deal.statusType === 'success'
                            ? 'text-emerald-950'
                            : deal.statusType === 'danger'
                            ? 'text-rose-950'
                            : 'text-amber-950'
                        }`}
                      >
                        <span>
                          {deal.statusType === 'success'
                            ? 'All 3 Documents Match — 100% Safe to Proceed'
                            : deal.statusType === 'danger'
                            ? 'Critical Amount Discrepancy Flagged'
                            : 'Shipment Date Cutoff Discrepancy'}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-700 mt-1 leading-relaxed">{deal.matchSummary}</p>
                    </div>
                  </div>
                </div>
              ) : docTab === 'ai' ? (
                /* Tab Content: Zero-Error AI Triangulation Engine */
                <div className="p-5 space-y-5 animate-fadeIn">
                  {/* Architecture Explanation Banner */}
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-950 font-semibold text-sm">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>How We Eliminate All Errors in AI Document Triangulation</span>
                    </div>
                    <p className="text-xs text-neutral-700 leading-relaxed">
                      To achieve a <strong>0.00% error rate</strong>, tier-1 institutions use a{' '}
                      <strong>Hybrid Neuro-Symbolic Architecture</strong>. An LLM alone can hallucinate calculations,
                      so we restrict AI exclusively to <em>typed schema extraction</em>, while letting a{' '}
                      <em>deterministic code engine</em> execute all mathematical, chronological, and contractual rules.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                      <div className="p-2 bg-white rounded border border-emerald-200">
                        <span className="font-bold text-neutral-900 block">1. Multimodal AI Extraction</span>
                        <span className="text-neutral-500">Gemini normalizes PDF/OCR into strict JSON</span>
                      </div>
                      <div className="p-2 bg-white rounded border border-emerald-200">
                        <span className="font-bold text-neutral-900 block">2. Deterministic Code Rules</span>
                        <span className="text-neutral-500">Math, caps, &amp; dates checked with 0% tolerance</span>
                      </div>
                      <div className="p-2 bg-white rounded border border-emerald-200">
                        <span className="font-bold text-neutral-900 block">3. Cryptographic Attestation</span>
                        <span className="text-neutral-500">ZK Merkle proof generated for smart contract</span>
                      </div>
                    </div>
                  </div>

                  {/* Simulator Trigger */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                    <div>
                      <div className="text-xs font-semibold text-neutral-950">
                        Test Active Order: <span className="font-mono">{deal.id}</span>
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        Run full 3-phase AI triangulation pipeline on this transaction
                      </div>
                    </div>
                    <button
                      disabled={aiEngineStage === 'ocr' || aiEngineStage === 'invariants'}
                      onClick={handleRunAITriangulation}
                      className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-full text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      {aiEngineStage === 'ocr' || aiEngineStage === 'invariants' ? (
                        <RotateCw className="w-3.5 h-3.5 text-emerald-400 animate-spin shrink-0" />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                      <span>
                        {aiEngineStage === 'ocr'
                          ? '1. Gemini Extracting Fields...'
                          : aiEngineStage === 'invariants'
                          ? '2. Verifying 5 Invariants...'
                          : 'Execute Live AI Verification Run'}
                      </span>
                    </button>
                  </div>

                  {/* The 5 Deterministic Invariants Check Breakdown */}
                  <div className="space-y-2.5">
                    <div className="text-xs font-semibold text-neutral-950 flex items-center justify-between">
                      <span>5 Deterministic Invariant Rules (Zero-Error Verification):</span>
                      <span className="text-[10px] font-mono text-neutral-400">100% Deterministic Math</span>
                    </div>

                    {/* Rule 1: Line Item Unit Math */}
                    <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs flex items-center justify-between">
                      <div>
                        <div className="font-medium text-neutral-900">
                          Invariant 1: Line Item Quantity × Unit Rate = Invoice Total
                        </div>
                        <div className="font-mono text-[11px] text-neutral-500">
                          CI: 40.00 MT × $3,550.00/MT = {deal.invoiceAmt}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        0.00% ERROR (PASSED)
                      </span>
                    </div>

                    {/* Rule 2: PO Cap Authorization */}
                    <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs flex items-center justify-between">
                      <div>
                        <div className="font-medium text-neutral-900">
                          Invariant 2: Invoice Aggregate ≤ Buyer Purchase Order Authorization Cap
                        </div>
                        <div className="font-mono text-[11px] text-neutral-500">
                          CI: {deal.invoiceAmt} vs PO Authorized Cap: {deal.poAmt}
                        </div>
                      </div>
                      {currentScenario === 'fraud' ? (
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          FAILED: +$47,000 MISMATCH
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          CONGRUENT (PASSED)
                        </span>
                      )}
                    </div>

                    {/* Rule 3: Maritime Loading Cutoff */}
                    <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs flex items-center justify-between">
                      <div>
                        <div className="font-medium text-neutral-900">
                          Invariant 3: Marine On-Board Bill of Lading Date ≤ PO Cutoff Window
                        </div>
                        <div className="font-mono text-[11px] text-neutral-500">
                          BL Date: {deal.departureDate} vs PO Cutoff: {deal.poCutoffDate}
                        </div>
                      </div>
                      {currentScenario === 'date' ? (
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          FAILED: 13 DAYS LATE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ON SCHEDULE (PASSED)
                        </span>
                      )}
                    </div>

                    {/* Rule 4: Container Identifiers */}
                    <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs flex items-center justify-between">
                      <div>
                        <div className="font-medium text-neutral-900">
                          Invariant 4: Ocean Carrier Container Identifier Exact Match
                        </div>
                        <div className="font-mono text-[11px] text-neutral-500">
                          Container {deal.containerId} verified across packing list, customs gate &amp; BL
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        100% HASH MATCH (PASSED)
                      </span>
                    </div>

                    {/* Rule 5: Incoterms Allocation */}
                    <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs flex items-center justify-between">
                      <div>
                        <div className="font-medium text-neutral-900">
                          Invariant 5: Incoterms® 2020 Freight &amp; Insurance Risk Transfer
                        </div>
                        <div className="font-mono text-[11px] text-neutral-500">
                          Terms: {deal.shippingTerms} (Prepaid sea freight + marine insurance certificate confirmed)
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        COMPLIANT (PASSED)
                      </span>
                    </div>
                  </div>

                  {/* Cryptographic Attestation Output */}
                  <div className="p-3.5 bg-neutral-950 text-white rounded-lg font-mono text-xs space-y-1.5 border border-neutral-800">
                    <div className="flex justify-between items-center text-neutral-400 text-[10px] border-b border-neutral-800 pb-1">
                      <span>DETERMINISTIC ZK-ATTESTATION PROOF</span>
                      <span className="text-emerald-400">BASE SEPOLIA #1,904,821</span>
                    </div>
                    <div className="truncate text-emerald-400 font-semibold text-[11px]">
                      Merkle Root: 0x8f2a63b2de9c1a87617cfca164b4c7303fcc391e4b29c91038a8e19034ff98c
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      Result: {deal.canFinance ? '0 Errors Detected • Payout Authorized' : 'Discrepancy Detected • Underwriting Halted'}
                    </div>
                  </div>
                </div>
              ) : (
                /* Tab Content: Single Document Raw Previews */
                <div className="p-5">
                  <div className="bg-neutral-950 text-neutral-300 rounded-lg p-4 font-mono text-xs space-y-2">
                    <div className="flex justify-between items-center text-neutral-400 border-b border-neutral-800 pb-2 mb-3">
                      <span className="font-semibold text-white">
                        {docTab === 'ci'
                          ? 'PARSED MULTIMODAL INVOICE (OCR + JSON-LD)'
                          : docTab === 'po'
                          ? 'BUYER PURCHASE ORDER (ERP INTEGRATION)'
                          : 'OCEAN BILL OF LADING (CARRIER TELEMETRY)'}
                      </span>
                      <span className="text-emerald-400 text-xs">Digital Seal Verified</span>
                    </div>
                    <pre className="whitespace-pre-wrap font-mono text-neutral-200 text-xs leading-relaxed">
                      {RAW_DOCUMENTS[docTab as 'ci' | 'po' | 'bl']}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Plain Language Safety & Risk Assessment Card */}
            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-neutral-900 shrink-0" />
                  <h3 className="text-sm font-semibold text-neutral-950">Automatic Safety &amp; Risk Check</h3>
                </div>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${
                    deal.riskScore < 30
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      : deal.riskScore > 70
                      ? 'text-rose-700 bg-rose-50 border-rose-200'
                      : 'text-amber-700 bg-amber-50 border-amber-200'
                  }`}
                >
                  {deal.riskScore < 30 ? '100% APPROVED' : 'HOLD / REVIEW'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                {/* Radial Risk Indicator */}
                <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-neutral-50 rounded-lg border border-neutral-200 text-center">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        className="text-neutral-200"
                        cx="50"
                        cy="50"
                        fill="transparent"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="7"
                      />
                      <circle
                        className={`transition-all duration-700 ease-out ${
                          deal.riskScore < 30
                            ? 'text-emerald-500'
                            : deal.riskScore > 70
                            ? 'text-rose-500'
                            : 'text-amber-500'
                        }`}
                        cx="50"
                        cy="50"
                        fill="transparent"
                        r="40"
                        stroke="currentColor"
                        strokeDasharray="251"
                        strokeDashoffset={251 - (251 * deal.riskScore) / 100}
                        strokeLinecap="round"
                        strokeWidth="7"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold font-mono text-neutral-950">{deal.riskScore}</span>
                      <span className="text-[10px] text-neutral-500 uppercase font-semibold">Risk Score</span>
                    </div>
                  </div>
                  <div
                    className={`mt-2 text-xs font-bold ${
                      deal.riskScore < 30
                        ? 'text-emerald-700'
                        : deal.riskScore > 70
                        ? 'text-rose-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {deal.riskRating}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {deal.riskScore < 30 ? 'Early Payout Approved' : 'Underwriting Verification Blocked'}
                  </div>
                </div>

                {/* Plain English Checklist */}
                <div className="md:col-span-8 space-y-2.5 text-xs">
                  <div className="p-3 rounded bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 text-neutral-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Buyer &amp; Seller Business Legality Check</span>
                    </div>
                    <span className="text-emerald-700 font-semibold">PASSED</span>
                  </div>

                  <div className="p-3 rounded bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 text-neutral-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Cargo Vessel Live Satellite Location</span>
                    </div>
                    <span className="text-emerald-700 font-semibold">ON-ROUTE TO GERMANY</span>
                  </div>

                  <div className="p-3 rounded bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 text-neutral-800">
                      {deal.statusType === 'danger' ? (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      <span>Pricing &amp; Quantity Math Check</span>
                    </div>
                    <span
                      className={`font-semibold ${
                        deal.statusType === 'danger' ? 'text-rose-600' : 'text-emerald-700'
                      }`}
                    >
                      {deal.statusType === 'danger' ? 'MISMATCH FLAGGED' : '0% ERRORS'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: FINANCING, ESCROW VAULT & LEDGER (5 COLS) ================= */}
          <div className="col-span-1 lg:col-span-5 space-y-6" id="financing">
            {/* Protected Escrow Vault Card */}
            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Landmark className="w-4 h-4 text-neutral-900 shrink-0" />
                  <h3 className="text-sm font-semibold text-neutral-950">Buyer&apos;s Protected Deposit</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  FUNDS SECURED
                </span>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2.5 text-xs text-neutral-700">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Total Deposit in Escrow:</span>
                  <span className="text-neutral-950 font-bold text-sm font-mono">
                    ${deal.faceValue.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Release Condition:</span>
                  <span className="text-neutral-900 font-medium">Cargo departs port on ship</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-neutral-200">
                  <span className="text-neutral-500">Deposit Protection:</span>
                  <span className="text-emerald-700 font-semibold flex items-center">
                    <Shield className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" /> 100% Guaranteed by CashFlow
                  </span>
                </div>
              </div>
            </div>

            {/* Instant Early Payout Calculator */}
            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-neutral-950">Withdraw Your Money Today</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Get paid immediately instead of waiting months for sea delivery.</p>
              </div>

              {/* 100% Transparent Fee Guarantee */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs text-neutral-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-emerald-800 font-semibold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Transparent Fee Guarantee — $0 Hidden Fees</span>
                </div>
                <p className="text-xs text-neutral-600 leading-normal">
                  Transparent Fee: 3.2% (${discountFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}). No monthly subscriptions, no paperwork fees, and zero bank processing delays.
                </p>
              </div>

              {/* Advance Rate Slider */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-600 font-medium">How much do you want today?</span>
                  <span className="text-neutral-950 font-bold text-sm font-mono">{advancePercent}.0%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="1"
                  value={advancePercent}
                  onChange={(e) => setAdvancePercent(parseInt(e.target.value))}
                  aria-label="Select how much money to withdraw today"
                  className="w-full accent-neutral-950 bg-neutral-200 h-2 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex justify-between text-xs text-neutral-500 pt-0.5">
                  <span>50% (Lower fee)</span>
                  <span>85% (Recommended)</span>
                  <span>95% (Maximum)</span>
                </div>
              </div>

              {/* Transparent Calculations Breakdown */}
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2.5 text-xs text-neutral-700">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Immediate Early Amount:</span>
                  <span className="text-neutral-950 font-semibold font-mono">
                    ${principal.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">One-time Early Fee (3.2%):</span>
                  <span className="text-amber-700 font-semibold font-mono">
                    -${discountFee.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Bank Transfer &amp; Processing:</span>
                  <span className="text-emerald-700 font-semibold">$0.00 (Free)</span>
                </div>

                <div className="border-t border-neutral-300 pt-2.5 flex justify-between items-center">
                  <div>
                    <div className="text-neutral-950 font-bold text-sm">Cash Deposited In Your Bank Today:</div>
                    <div className="text-[11px] text-neutral-500">Available within minutes</div>
                  </div>
                  <div className="text-emerald-700 text-lg font-bold font-mono">
                    ${immediatePayout.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-neutral-600 pt-1 border-t border-neutral-200">
                  <span>Paid to you when cargo arrives at port:</span>
                  <span className="font-medium font-mono text-neutral-900">
                    ${reserve.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD (Remaining Balance)
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                disabled={!deal.canFinance || payoutStep !== 'idle'}
                onClick={handleExecuteFinancing}
                className={`w-full py-3.5 rounded-full font-medium transition-all flex items-center justify-center space-x-2 text-sm shadow-xs cursor-pointer ${
                  payoutStep === 'completed'
                    ? 'bg-emerald-600 text-white'
                    : deal.canFinance
                    ? 'bg-neutral-950 hover:bg-neutral-800 text-white'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
              >
                {payoutStep === 'completed' ? (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <span>
                  {payoutStep === 'broadcasting'
                    ? 'Broadcasting to Base Sepolia Network...'
                    : payoutStep === 'zkproof'
                    ? 'Validating Zero-Knowledge Proof...'
                    : payoutStep === 'completed'
                    ? `⚡ Payout Completed: $${immediatePayout.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                      })} Transferred`
                    : deal.canFinance
                    ? `Request Instant Payout ($${immediatePayout.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                      })})`
                    : deal.financeButtonText}
                </span>
              </button>

              <div className="text-center text-xs text-neutral-500">
                No loan obligations. 100% non-recourse: you keep your cash even if shipping is delayed.
              </div>
            </div>

            {/* HUMAN-READABLE EVENT FEED */}
            <div className="bg-[#09090B] border border-neutral-800 rounded-xl p-4 shadow-xl text-neutral-300" id="ledger">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
                <div className="flex items-center space-x-2">
                  <History className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold text-white">Live Activity Record</span>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>UPDATED LIVE</span>
                </div>
              </div>

              <div className="h-48 overflow-y-auto space-y-2 text-xs custom-scrollbar dark-scrollbar pr-1">
                <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
                  <div className="flex justify-between items-center text-neutral-400 text-[11px]">
                    <span>10:14:02 UTC • Automatic Check</span>
                    <span className="text-emerald-400 font-medium">Order Created</span>
                  </div>
                  <div className="text-white font-medium mt-0.5">Buyer opened purchase order and requested escrow</div>
                </div>

                <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
                  <div className="flex justify-between items-center text-neutral-400 text-[11px]">
                    <span>10:14:08 UTC • Document Check</span>
                    <span className="text-emerald-400 font-medium">Documents Read</span>
                  </div>
                  <div className="text-white font-medium mt-0.5">Invoice, Purchase Order &amp; Shipping Ticket matched</div>
                </div>

                <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
                  <div className="flex justify-between items-center text-neutral-400 text-[11px]">
                    <span>10:14:10 UTC • Safety Engine</span>
                    <span className="text-emerald-400 font-medium">Zero Errors Found</span>
                  </div>
                  <div className="text-emerald-400 font-medium mt-0.5">Documents verified with 0% discrepancy</div>
                </div>

                <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
                  <div className="flex justify-between items-center text-neutral-400 text-[11px]">
                    <span>10:15:22 UTC • Payment Vault</span>
                    <span className="text-emerald-400 font-medium">Deposit Safe</span>
                  </div>
                  <div className="text-white font-medium mt-0.5">
                    ${deal.faceValue.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD securely deposited in safe escrow
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
