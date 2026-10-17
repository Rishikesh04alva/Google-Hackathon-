/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Bell, X } from 'lucide-react';
import { UserRole, ActiveTab, PushNotificationItem } from './types';
import { INITIAL_NOTIFICATIONS } from './data/mockData';
import { Header } from './components/Header';
import { ProofTelemetryBanner } from './components/ProofTelemetryBanner';
import { DocumentTriangulationView } from './components/DocumentTriangulationView';
import { InstitutionalAuthView } from './components/InstitutionalAuthView';
import { ExpenditureDashboardView } from './components/ExpenditureDashboardView';
import { ShipmentReleasePortalView } from './components/ShipmentReleasePortalView';
import { ExportShipmentRegistrationView } from './components/ExportShipmentRegistrationView';
import { PushNotificationManager } from './components/PushNotificationManager';
import { TradeAssistantDrawer } from './components/TradeAssistantDrawer';
import { Modals } from './components/Modals';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('matrix');
  const [currentRole, setCurrentRole] = useState<UserRole>('Exporter');
  const [connectedVault, setConnectedVault] = useState<string>('Connect Vault');
  const [notifications, setNotifications] = useState<PushNotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<{ title: string; message: string; type: string } | null>(null);
  const [selectedReleaseCode, setSelectedReleaseCode] = useState<string>('CF-REL-9821-X4');

  // Modals
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [policyTab, setPolicyTab] = useState('privacy');
  const [isDataRightsModalOpen, setIsDataRightsModalOpen] = useState(false);
  const [isCookieBannerOpen, setIsCookieBannerOpen] = useState(true);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSetActiveTab = (tab: ActiveTab) => {
    if (tab === 'release' && currentRole !== 'Exporter' && currentRole !== 'Importer') {
      setCurrentRole('Exporter');
    }
    setActiveTab(tab);
  };

  const triggerPushNotification = (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'alert' = 'info',
    actionUrl?: string
  ) => {
    const newNotif: PushNotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      type,
      read: false,
      actionUrl,
    };

    setNotifications((prev) => [newNotif, ...prev]);

    // Show floating toast
    setActiveToast({ title, message, type });
    setTimeout(() => {
      setActiveToast(null);
    }, 4500);

    // If browser notification permitted, send native notification
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico',
        });
      } catch {
        // Native notification error handling
      }
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleTriggerPreset = (preset: 'vessel' | 'escrow' | 'customs' | 'discrepancy' | 'release') => {
    if (preset === 'vessel') {
      triggerPushNotification(
        '🚢 Vessel Maritime Departure (VNSGN → DEHAM)',
        'Container MRSK-9821491 has sailed on Maersk Mc-Kinney Moller. Expected arrival at Hamburg in 21 days.',
        'info',
        'matrix'
      );
    } else if (preset === 'escrow') {
      triggerPushNotification(
        '🔒 Escrow Deposit 100% Funded ($142,000.00)',
        'Buyer Global Harvest Corp locked $142,000.00 USDC. Instant 85% advance payout is now unlocked!',
        'success',
        'matrix'
      );
    } else if (preset === 'release') {
      triggerPushNotification(
        '🔑 Shipment Release Code Generated (CF-REL-9821-X4)',
        'Release passcode issued for container discharge. Forward to buyer or customs terminal to release cargo.',
        'success',
        'release'
      );
    } else if (preset === 'customs') {
      triggerPushNotification(
        '🛃 Port Customs Clearance Ready (DEHAM)',
        'Container MRSK-9821491 docked at Hamburg Altenwerder. Enter release code to pass gate inspection.',
        'info',
        'release'
      );
    } else if (preset === 'discrepancy') {
      triggerPushNotification(
        '⚠️ Critical Discrepancy Flagged on Order #0918',
        'Commercial Invoice total ($189k) exceeds buyer PO cap ($142k). Escrow advance halted.',
        'warning',
        'matrix'
      );
    }
  };

  const handleAddAuditLog = (action: string, actor: string) => {
    // Audit log addition logic
    console.log(`[AUDIT] ${new Date().toISOString()} | ${actor} -> ${action}`);
  };

  const handleOpenPolicyModal = (tab: string) => {
    setPolicyTab(tab);
    setIsPolicyModalOpen(true);
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col justify-between relative bg-[#f9f9fa] text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Skip to Main Content accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-neutral-950 focus:text-white focus:text-xs focus:font-mono focus:rounded-md focus:ring-2 focus:ring-emerald-500 shadow-xl"
      >
        Skip to Main Content
      </a>

      {/* Subtle Dot Grid Background */}
      <div aria-hidden="true" className="fixed inset-0 optimus-grid pointer-events-none z-0 opacity-70"></div>

      {/* Floating Push Notification Toast */}
      {activeToast && (
        <div className="fixed top-14 right-4 z-50 max-w-sm bg-neutral-950 text-white p-4 rounded-xl shadow-2xl border border-neutral-700 animate-fadeIn flex items-start space-x-3">
          {activeToast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : activeToast.type === 'warning' ? (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <Bell className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 space-y-0.5 text-xs">
            <div className="font-semibold text-white">{activeToast.title}</div>
            <p className="text-neutral-300 leading-relaxed text-xs">{activeToast.message}</p>
          </div>
          <button
            onClick={() => setActiveToast(null)}
            className="text-neutral-400 hover:text-white p-1 cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header with Navigation and Compliance Bar */}
      <div className="relative z-10">
        <Header
          activeTab={activeTab}
          setActiveTab={handleSetActiveTab}
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          unreadCount={unreadCount}
          onOpenNotifications={() => setIsNotifOpen(true)}
          onOpenVaultModal={() => setIsVaultModalOpen(true)}
          onOpenAuditFeed={() => {
            const el = document.getElementById('ledger');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenPolicyModal={handleOpenPolicyModal}
          connectedVault={connectedVault}
        />

        {/* Verifiable Proof Telemetry Banner */}
        <ProofTelemetryBanner
          onOpenPrivacyModal={() => handleOpenPolicyModal('privacy')}
          onOpenDataRightsModal={() => setIsDataRightsModalOpen(true)}
        />

        {/* Dynamic Screen View Router */}
        <div className="relative z-10" id="main-content">
          {activeTab === 'matrix' && (
            <DocumentTriangulationView
              onPayoutSuccess={(amount, dealId) => {
                handleAddAuditLog(`PAYOUT_SUCCESS: $${amount} for ${dealId}`, 'TREASURY_GATEWAY');
              }}
              onAddAuditLog={handleAddAuditLog}
              onTriggerPushNotification={triggerPushNotification}
            />
          )}

          {activeTab === 'auth' && (
            <InstitutionalAuthView
              currentRole={currentRole}
              onRoleSelect={(role) => {
                setCurrentRole(role);
                triggerPushNotification(
                  'Institutional Role Updated',
                  `You are now authenticated with Google OAuth & enterprise claims as "${role}".`,
                  'success'
                );
              }}
              onReturnToDashboard={() => handleSetActiveTab('matrix')}
            />
          )}

          {activeTab === 'spend' && (
            <ExpenditureDashboardView
              onSelectReleaseCode={(code) => setSelectedReleaseCode(code)}
              onNavigateToReleasePortal={() => handleSetActiveTab('release')}
            />
          )}

          {activeTab === 'release' && (
            <ShipmentReleasePortalView
              selectedCode={selectedReleaseCode}
              currentRole={currentRole}
              onRoleSelect={setCurrentRole}
              onAddAuditLog={handleAddAuditLog}
              onTriggerPushNotification={triggerPushNotification}
            />
          )}

          {activeTab === 'register' && (
            <ExportShipmentRegistrationView
              currentRole={currentRole}
              onNavigateToTab={(tab) => handleSetActiveTab(tab)}
              onTriggerNotification={triggerPushNotification}
            />
          )}
        </div>

        {/* Footer */}
        <Footer
          onOpenPolicyModal={handleOpenPolicyModal}
          onOpenDataRightsModal={() => setIsDataRightsModalOpen(true)}
          onOpenCookieBanner={() => setIsCookieBannerOpen(true)}
          onNavigateTab={(tab) => handleSetActiveTab(tab)}
        />
      </div>

      {/* Floating AI Trade Assistant Drawer */}
      <TradeAssistantDrawer onNavigateTab={(tab) => handleSetActiveTab(tab as ActiveTab)} />

      {/* Push Notification Manager Drawer */}
      <PushNotificationManager
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearAll={handleClearAll}
        onTriggerPreset={handleTriggerPreset}
        onNavigateTab={(tab) => {
          handleSetActiveTab(tab);
          setIsNotifOpen(false);
        }}
      />

      {/* Institutional Modals (Vault, Policy, GDPR, Cookies) */}
      <Modals
        isVaultModalOpen={isVaultModalOpen}
        onCloseVaultModal={() => setIsVaultModalOpen(false)}
        onSelectVault={(name) => {
          setConnectedVault(name);
          triggerPushNotification('Vault Connected', `Institutional cold storage vault "${name}" connected.`, 'info');
        }}
        isPolicyModalOpen={isPolicyModalOpen}
        onClosePolicyModal={() => setIsPolicyModalOpen(false)}
        policyTab={policyTab}
        onChangePolicyTab={(tab) => setPolicyTab(tab)}
        isDataRightsModalOpen={isDataRightsModalOpen}
        onCloseDataRightsModal={() => setIsDataRightsModalOpen(false)}
        onSubmitDataDeletion={(lei, email) => {
          triggerPushNotification(
            'GDPR Art. 17 Erasure Filed',
            `Cryptographic confirmation receipt dispatched to ${email}. Off-chain cache will be purged within 24 hours.`,
            'info'
          );
        }}
        isCookieBannerOpen={isCookieBannerOpen}
        onCloseCookieBanner={() => setIsCookieBannerOpen(false)}
        onSaveCookiePreferences={(acceptAll) => {
          setIsCookieBannerOpen(false);
          triggerPushNotification(
            'Cookie Preferences Saved',
            acceptAll ? 'All institutional telemetry accepted.' : 'Essential protocol cookies retained.',
            'info'
          );
        }}
      />
    </div>
  );
}
