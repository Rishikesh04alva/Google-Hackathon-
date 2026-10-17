import React from 'react';
import {
  LineChart,
  QrCode,
  Fingerprint,
  Bell,
  Terminal,
  FileText,
  ShieldCheck,
  PackagePlus,
} from 'lucide-react';
import { UserRole, ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenVaultModal: () => void;
  onOpenAuditFeed: () => void;
  onOpenPolicyModal: (tab: string) => void;
  connectedVault: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentRole,
  setCurrentRole,
  unreadCount,
  onOpenNotifications,
  onOpenVaultModal,
  onOpenAuditFeed,
  onOpenPolicyModal,
  connectedVault,
}) => {
  return (
    <>
      {/* Top Institutional Compliance Banner */}
      <div className="relative z-20 w-full bg-neutral-950 text-neutral-300 text-xs font-mono border-b border-neutral-800 px-4 py-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 min-w-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
          <span className="text-white font-medium shrink-0">CashFlow Protocol Inc.</span>
          <span className="text-neutral-500 shrink-0">•</span>
          <span className="text-neutral-400 shrink-0">Del. File #7491028</span>
          <span className="text-neutral-500 shrink-0">•</span>
          <span className="text-neutral-400 shrink-0">LEI: 549300VNA892011</span>
          <span className="hidden lg:inline text-neutral-500 shrink-0">•</span>
          <span className="hidden lg:inline text-neutral-400 shrink-0">San Francisco, CA 94104</span>
        </div>
        <div className="flex items-center space-x-2 text-xs shrink-0">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800 text-xs">
            Institutional Only
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-neutral-900 text-emerald-400 border border-neutral-800 text-xs">
            GDPR &amp; CCPA Compliant
          </span>
          <button
            onClick={() => onOpenPolicyModal('privacy')}
            className="text-neutral-300 hover:text-white underline focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-pointer text-xs"
          >
            Legal Disclosures
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-[#f9f9fa]/95 border-b border-neutral-200">
        {/* Left: Brand Logo & Tagline */}
        <div className="flex items-center space-x-3 sm:space-x-5 shrink-0">
          <button
            onClick={() => setActiveTab('matrix')}
            className="flex items-center space-x-2 text-neutral-950 font-semibold tracking-tight text-lg group focus:outline-none rounded cursor-pointer shrink-0"
          >
            <span className="w-7 h-7 rounded-md bg-black text-white flex items-center justify-center text-xs font-mono font-bold tracking-tighter shadow-xs">
              CF
            </span>
            <span className="font-semibold text-neutral-950 text-base sm:text-lg whitespace-nowrap">
              CashFlow<span className="text-[10px] text-neutral-400 font-mono align-top ml-0.5">™</span>
            </span>
          </button>

          <div className="hidden xl:flex items-center space-x-1.5 text-xs text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-full border border-neutral-200 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-[11px] font-medium text-neutral-700">Autonomous Escrow Engine</span>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs font-medium text-neutral-600">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'matrix'
                ? 'bg-neutral-950 text-white font-semibold shadow-2xs'
                : 'hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Document Triangulation</span>
          </button>

          <button
            onClick={() => setActiveTab('spend')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'spend'
                ? 'bg-neutral-950 text-white font-semibold shadow-2xs'
                : 'hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>Spend &amp; Expenditure</span>
          </button>

          <button
            onClick={() => setActiveTab('release')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'release'
                ? 'bg-neutral-950 text-white font-semibold shadow-2xs'
                : 'hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Shipment Release Code</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'register'
                ? 'bg-neutral-950 text-white font-semibold shadow-2xs'
                : 'hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            <PackagePlus className="w-3.5 h-3.5" />
            <span>Register Shipment &amp; Invoice</span>
          </button>

          <button
            onClick={() => setActiveTab('auth')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'auth'
                ? 'bg-neutral-950 text-white font-semibold shadow-2xs'
                : 'hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            <span>Auth &amp; RBAC</span>
          </button>
        </nav>

        {/* Right Controls: Role Pills, Notifications, Terminal, Connect Vault */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
          {/* Interactive Role Switcher Pill */}
          <div className="hidden lg:flex items-center bg-white p-0.5 rounded-full border border-neutral-300 shadow-2xs text-xs font-medium text-neutral-500">
            {(activeTab === 'release'
              ? (['Exporter', 'Importer'] as UserRole[])
              : (['Exporter', 'Importer', 'Financier', 'Auditor'] as UserRole[])
            ).map((role) => (
              <button
                key={role}
                onClick={() => setCurrentRole(role)}
                className={`px-2.5 py-1 rounded-full transition-all text-xs font-medium cursor-pointer whitespace-nowrap ${
                  currentRole === role
                    ? 'bg-neutral-950 text-white shadow-xs font-semibold'
                    : 'hover:text-neutral-900'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Notifications Trigger Button */}
          <button
            onClick={onOpenNotifications}
            className="relative w-8 h-8 rounded-full border border-neutral-300 bg-white hover:bg-neutral-100 flex items-center justify-center text-neutral-700 transition-colors shadow-2xs cursor-pointer shrink-0"
            title="Shipment Status Notifications"
            aria-label="Push Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white font-mono text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Terminal Audit Log Trigger */}
          <button
            onClick={onOpenAuditFeed}
            className="w-8 h-8 rounded-full border border-neutral-300 bg-white hover:bg-neutral-100 flex items-center justify-center text-neutral-600 transition-colors shadow-2xs cursor-pointer shrink-0"
            title="View Live Ledger Feed"
            aria-label="Toggle Merkle Audit Ledger Feed"
          >
            <Terminal className="w-4 h-4" />
          </button>

          {/* Primary Action Button: Connect Vault */}
          <button
            onClick={onOpenVaultModal}
            className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-medium px-3.5 py-1.5 rounded-full transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer shrink-0"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="truncate max-w-[110px]">{connectedVault || 'Connect Vault'}</span>
          </button>
        </div>
      </header>

      {/* Responsive Secondary Nav for Mobile (< md screens) */}
      <div className="md:hidden w-full bg-white border-b border-neutral-200 px-3 py-2 overflow-x-auto scrollbar-none flex items-center space-x-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors shrink-0 flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'matrix' ? 'bg-neutral-950 text-white font-semibold' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Document Triangulation</span>
        </button>
        <button
          onClick={() => setActiveTab('spend')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors shrink-0 flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'spend' ? 'bg-neutral-950 text-white font-semibold' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <LineChart className="w-3.5 h-3.5" />
          <span>Spend &amp; Expenditure</span>
        </button>
        <button
          onClick={() => setActiveTab('release')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors shrink-0 flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'release' ? 'bg-neutral-950 text-white font-semibold' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Shipment Release Code</span>
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors shrink-0 flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'register' ? 'bg-neutral-950 text-white font-semibold' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <PackagePlus className="w-3.5 h-3.5" />
          <span>Register Shipment &amp; Invoice</span>
        </button>
        <button
          onClick={() => setActiveTab('auth')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors shrink-0 flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'auth' ? 'bg-neutral-950 text-white font-semibold' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Fingerprint className="w-3.5 h-3.5" />
          <span>Auth &amp; RBAC</span>
        </button>
      </div>
    </>
  );
};
