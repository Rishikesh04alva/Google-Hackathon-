import React, { useState } from 'react';
import { Wallet, X, ShieldCheck, Trash2, Cookie } from 'lucide-react';

interface ModalsProps {
  isVaultModalOpen: boolean;
  onCloseVaultModal: () => void;
  onSelectVault: (vaultName: string) => void;
  isPolicyModalOpen: boolean;
  onClosePolicyModal: () => void;
  policyTab: string;
  onChangePolicyTab: (tab: string) => void;
  isDataRightsModalOpen: boolean;
  onCloseDataRightsModal: () => void;
  onSubmitDataDeletion: (lei: string, email: string) => void;
  isCookieBannerOpen: boolean;
  onCloseCookieBanner: () => void;
  onSaveCookiePreferences: (acceptAll: boolean) => void;
}

export const Modals: React.FC<ModalsProps> = ({
  isVaultModalOpen,
  onCloseVaultModal,
  onSelectVault,
  isPolicyModalOpen,
  onClosePolicyModal,
  policyTab,
  onChangePolicyTab,
  isDataRightsModalOpen,
  onCloseDataRightsModal,
  onSubmitDataDeletion,
  isCookieBannerOpen,
  onCloseCookieBanner,
  onSaveCookiePreferences,
}) => {
  const [deletionLei, setDeletionLei] = useState('');
  const [deletionEmail, setDeletionEmail] = useState('');

  const policyContent: Record<string, { title: string; html: React.ReactNode }> = {
    privacy: {
      title: '1. Institutional Privacy & Data Minimization Policy (GDPR / CCPA / CalOPPA)',
      html: (
        <div className="space-y-3">
          <p>
            <strong>Effective Date:</strong> January 1, 2025 • CashFlow Protocol Inc. (Delaware File #7491028).
          </p>
          <p>
            CashFlow Protocol enforces an uncompromising <em>Zero Unnecessary Data Retention Policy</em>. Trade
            documents uploaded to the document triangulation matrix (commercial invoices, purchase orders, bills of
            lading) are processed in ephemeral memory enclaves. We do not sell, rent, or monetize corporate trade
            telemetry.
          </p>
          <p>
            <strong>Data Subject Rights (GDPR Articles 15-22 &amp; CCPA):</strong> Enterprise counterparties maintain
            full authority to request data extraction, rectification, or irrevocable deletion (Right to be Forgotten) for
            any off-chain indexing logs.
          </p>
          <p>
            <strong>Minors &amp; Children:</strong> This platform is solely engineered for institutional enterprise B2B
            trade participants (18+ only). We strictly refrain from processing data from minors under COPPA and GDPR-K.
          </p>
        </div>
      ),
    },
    terms: {
      title: '2. Cross-Border Protocol Terms of Service',
      html: (
        <div className="space-y-3">
          <p>
            By interacting with CashFlow Protocol smart contracts on Base Sepolia (or associated mainnet deployments),
            institutional participants agree to deterministic execution governed by Incoterms® 2020 international
            commercial trade standards.
          </p>
          <p>
            <strong>Deterministic Execution:</strong> Funds deposited into the Programmable Escrow Vault are released
            autonomously when cryptographic multi-oracle attestation verifies document triangulation congruency. No
            synthetic manipulation or intermediary intervention can preempt verified contract conditions.
          </p>
        </div>
      ),
    },
    refund: {
      title: '3. Escrow Dispute, Refund & Resolution Policy',
      html: (
        <div className="space-y-3">
          <p>
            <strong>Zero Hidden Fees:</strong> CashFlow guarantees 100% transparent fee architecture. Financier discount
            yields are capped as mathematically stated (3.2%), and protocol gas charges are permanently $0 (sponsored by
            our Paymaster smart contract).
          </p>
          <p>
            <strong>Deterministic Refund Protocol:</strong> In scenarios where AI document triangulation discovers
            discrepancies exceeding allowed tolerances (such as shipping date expiration or quantity mismatch), the escrow
            remains locked. Consignees may execute an instant bilateral release or trigger an automated 100% refund of
            unfinanced collateral within 7 calendar business days without administrative penalty.
          </p>
        </div>
      ),
    },
    cookies: {
      title: '4. Comprehensive Cookie & Storage Audit',
      html: (
        <div className="space-y-3">
          <p>We do not utilize cross-site ad tracking or third-party marketing cookies. Below is the full audit of all persistent browser tokens:</p>
          <ul className="list-disc pl-5 space-y-1 font-mono text-[11px] text-neutral-600">
            <li>
              <strong>cf_vault_session:</strong> Essential. Retains active MultiSig vault handshake (Session duration).
            </li>
            <li>
              <strong>cf_user_role:</strong> Functional. Remembers your active participant view: Exporter, Importer,
              Financier, or Auditor (30 days).
            </li>
            <li>
              <strong>cf_telemetry_opt:</strong> Analytics. Stores granular consent preference for anonymous WebGL /
              Gemini latency metrics (180 days).
            </li>
          </ul>
        </div>
      ),
    },
    licenses: {
      title: '5. Typography & Digital Asset Licensing Disclosures',
      html: (
        <div className="space-y-3">
          <p>All typography and computational assets within this application adhere to open-source and proprietary enterprise licenses:</p>
          <ul className="list-disc pl-5 space-y-1 font-mono text-[11px] text-neutral-600">
            <li>
              <strong>Geist &amp; JetBrains Mono:</strong> Licensed under the SIL Open Font License (OFL) Version 1.1.
            </li>
            <li>
              <strong>Google Material Symbols:</strong> Apache License 2.0 open distribution.
            </li>
            <li>
              <strong>Three.js 3D Visualizer:</strong> MIT License; visual assets are procedurally generated and
              zero-royalty licensed for institutional production.
            </li>
          </ul>
        </div>
      ),
    },
  };

  return (
    <>
      {/* 1. VAULT SELECTION MODAL */}
      {isVaultModalOpen && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
              <h3 className="font-semibold text-neutral-950 text-sm flex items-center">
                <Wallet className="w-4 h-4 text-neutral-900 mr-2 shrink-0" />
                Select Institutional Vault
              </h3>
              <button
                onClick={onCloseVaultModal}
                className="text-neutral-400 hover:text-neutral-900 focus:outline-none cursor-pointer"
                aria-label="Close vault modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <button
                onClick={() => {
                  onSelectVault('Fireblocks MPC');
                  onCloseVaultModal();
                }}
                className="w-full p-3 rounded-lg bg-neutral-50 border border-neutral-200 hover:border-neutral-950 flex items-center justify-between text-left transition-all cursor-pointer"
              >
                <div>
                  <div className="text-neutral-950 font-medium font-sans text-xs">Fireblocks Institutional MPC</div>
                  <div className="text-neutral-500 text-xs">ID: FB-CORP-98104 • $1,250,000 Liquid</div>
                </div>
                <span className="text-emerald-700 text-xs font-semibold">CONNECTED</span>
              </button>

              <button
                onClick={() => {
                  onSelectVault('Coinbase Prime');
                  onCloseVaultModal();
                }}
                className="w-full p-3 rounded-lg bg-neutral-50 border border-neutral-200 hover:border-neutral-950 flex items-center justify-between text-left transition-all cursor-pointer"
              >
                <div>
                  <div className="text-neutral-950 font-medium font-sans text-xs">Coinbase Prime Custody</div>
                  <div className="text-neutral-500 text-xs">ID: CB-PRIME-0021 • $428,500 Liquid</div>
                </div>
                <span className="text-neutral-400 text-xs">STANDBY</span>
              </button>

              <button
                onClick={() => {
                  onSelectVault('Anchorage Digital');
                  onCloseVaultModal();
                }}
                className="w-full p-3 rounded-lg bg-neutral-50 border border-neutral-200 hover:border-neutral-950 flex items-center justify-between text-left transition-all cursor-pointer"
              >
                <div>
                  <div className="text-neutral-950 font-medium font-sans text-xs">Anchorage Digital Escrow</div>
                  <div className="text-neutral-500 text-xs">Chartered Bank Trust Vault</div>
                </div>
                <span className="text-neutral-400 text-xs">AVAILABLE</span>
              </button>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={onCloseVaultModal}
                className="px-4 py-2 bg-neutral-950 text-white text-xs font-medium rounded-full hover:bg-neutral-800 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. POLICY & TRUST CENTER MODAL */}
      {isPolicyModalOpen && (
        <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[85vh] animate-fadeIn">
            <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-neutral-950 shrink-0" />
                <h3 className="font-semibold text-neutral-950 text-sm font-sans">
                  CashFlow Protocol — Institutional Trust Center
                </h3>
              </div>
              <button
                onClick={onClosePolicyModal}
                className="text-neutral-400 hover:text-neutral-950 focus:outline-none cursor-pointer"
                aria-label="Close policy modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 border-b border-neutral-200 pt-3 overflow-x-auto text-xs font-mono">
              {(['privacy', 'terms', 'refund', 'cookies', 'licenses'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => onChangePolicyTab(t)}
                  className={`pb-2 border-b-2 capitalize transition-colors cursor-pointer ${
                    policyTab === t
                      ? 'border-neutral-950 font-semibold text-neutral-950'
                      : 'border-transparent text-neutral-500 hover:text-neutral-950'
                  }`}
                >
                  {t === 'privacy'
                    ? 'Privacy Policy'
                    : t === 'terms'
                    ? 'Terms of Service'
                    : t === 'refund'
                    ? 'Dispute & Refund'
                    : t === 'cookies'
                    ? 'Cookie Policy'
                    : 'Asset Licensing'}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="overflow-y-auto py-4 space-y-4 text-xs font-sans text-neutral-700 leading-relaxed pr-2 custom-scrollbar flex-1">
              {policyContent[policyTab]?.html}
            </div>

            <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400">Del. File #7491028 • SOC-2 Type II Certified</span>
              <button
                onClick={onClosePolicyModal}
                className="px-4 py-2 bg-neutral-950 text-white rounded-full hover:bg-neutral-800 cursor-pointer"
              >
                Acknowledge &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. GDPR ART 17 DATA RIGHTS MODAL */}
      {isDataRightsModalOpen && (
        <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
              <div className="flex items-center space-x-2">
                <Trash2 className="w-4 h-4 text-rose-600 shrink-0" />
                <h3 className="font-semibold text-neutral-950 text-sm">GDPR Article 17 Erasure Request</h3>
              </div>
              <button
                onClick={onCloseDataRightsModal}
                className="text-neutral-400 hover:text-neutral-950 focus:outline-none cursor-pointer"
                aria-label="Close data rights modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              In accordance with GDPR Art. 17 and CCPA, institutional users may request immediate cryptographic purge of
              off-chain indexed cache data and contact profiles.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-neutral-500 mb-1">Entity LEI or Verified Wallet Address:</label>
                <input
                  value={deletionLei}
                  onChange={(e) => setDeletionLei(e.target.value)}
                  placeholder="549300... or 0x..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-neutral-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Authorized Corporate Email:</label>
                <input
                  type="email"
                  value={deletionEmail}
                  onChange={(e) => setDeletionEmail(e.target.value)}
                  placeholder="compliance@company.com"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-neutral-950 focus:outline-none"
                />
              </div>

              <div className="p-2.5 bg-neutral-100 rounded text-xs text-neutral-600">
                Note: Blockchain settlement history on Base Sepolia is immutable by cryptographic design. Only off-chain
                cache and communication indices will be purged.
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={onCloseDataRightsModal}
                className="px-3 py-1.5 border border-neutral-300 rounded-full text-xs text-neutral-600 hover:bg-neutral-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSubmitDataDeletion(deletionLei, deletionEmail);
                  onCloseDataRightsModal();
                }}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-medium cursor-pointer"
              >
                Submit Deletion Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. COOKIE CONSENT BANNER & GRANULAR DRAWER */}
      {isCookieBannerOpen && (
        <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-xl bg-white border border-neutral-300 rounded-2xl shadow-2xl z-50 p-5 space-y-4 animate-fadeIn">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Cookie className="w-4 h-4 text-neutral-900 shrink-0" />
              <h3 className="text-xs font-semibold text-neutral-950 font-mono">
                Institutional Cookie &amp; Privacy Telemetry
              </h3>
            </div>
            <button
              onClick={onCloseCookieBanner}
              className="text-neutral-400 hover:text-neutral-900 cursor-pointer"
              aria-label="Close cookie banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed font-sans">
            CashFlow Protocol respects your data privacy. We employ essential cookies for session vault connectivity and
            minimal anonymous telemetry. You may customize your granular consent below.
          </p>

          <div className="space-y-2 border-t border-b border-neutral-200 py-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-neutral-950">Essential Protocol Cookies</div>
                <div className="text-[10px] text-neutral-400">Required for MPC Vault connectivity &amp; Base RPC</div>
              </div>
              <input
                type="checkbox"
                checked
                disabled
                className="rounded text-neutral-950 cursor-not-allowed opacity-75"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-neutral-950">Anonymous SDK Telemetry</div>
                <div className="text-[10px] text-neutral-400">Gemini latency benchmarks &amp; WebGL metrics</div>
              </div>
              <input type="checkbox" defaultChecked className="rounded text-neutral-950" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-neutral-950">Functional Role Memory</div>
                <div className="text-[10px] text-neutral-400">Remembers selected Incoterms &amp; Exporter / Importer roles</div>
              </div>
              <input type="checkbox" defaultChecked className="rounded text-neutral-950" />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <button
              onClick={() => onChangePolicyTab('cookies')}
              className="text-xs text-neutral-500 hover:text-neutral-950 underline font-mono cursor-pointer"
            >
              View Cookie Audit Details
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onSaveCookiePreferences(false)}
                className="px-3 py-1.5 border border-neutral-300 hover:bg-neutral-100 rounded-full text-xs font-mono text-neutral-700 cursor-pointer"
              >
                Reject Non-Essential
              </button>
              <button
                onClick={() => onSaveCookiePreferences(true)}
                className="px-3.5 py-1.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-full text-xs font-mono font-medium cursor-pointer"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
