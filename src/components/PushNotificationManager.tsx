import React, { useState, useEffect } from 'react';
import { BellRing, X, Monitor, BellOff, ArrowRight } from 'lucide-react';
import { PushNotificationItem, ActiveTab } from '../types';

interface PushNotificationManagerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: PushNotificationItem[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onTriggerPreset: (preset: 'vessel' | 'escrow' | 'customs' | 'discrepancy' | 'release') => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const PushNotificationManager: React.FC<PushNotificationManagerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onTriggerPreset,
  onNavigateTab,
}) => {
  const [browserPermission, setBrowserPermission] = useState<string>('default');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [notifyVessel, setNotifyVessel] = useState<boolean>(true);
  const [notifyEscrow, setNotifyEscrow] = useState<boolean>(true);
  const [notifyDiscrepancy, setNotifyDiscrepancy] = useState<boolean>(true);
  const [pushStatusMessage, setPushStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if ('Notification' in window) {
      setBrowserPermission(Notification.permission);
    }
  }, []);

  const requestBrowserPermission = async () => {
    if (!('Notification' in window)) {
      setPushStatusMessage('Desktop notifications are not supported in this browser frame. In-app push alerts are active.');
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      setBrowserPermission(perm);
      if (perm === 'granted') {
        setPushStatusMessage('Desktop push notifications enabled successfully!');
        new Notification('CashFlow™ Push Notifications Enabled', {
          body: 'You will now receive instant desktop alerts for all pending shipment milestones and escrow releases.',
          icon: '/favicon.ico',
        });
      } else {
        setPushStatusMessage('Desktop notifications were denied. In-app alerts remain active.');
      }
    } catch {
      setPushStatusMessage('Desktop permission request intercepted. In-app alerts remain active.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-neutral-900/40 backdrop-blur-xs">
      <div className="bg-white border border-neutral-300 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn">
        {/* Header */}
        <div className="bg-neutral-50 px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BellRing className="w-5 h-5 text-neutral-950 shrink-0" />
            <div>
              <h3 className="font-semibold text-neutral-950 text-sm">Shipment Status Push Alerts</h3>
              <p className="text-xs text-neutral-500 font-mono">Live maritime &amp; escrow telemetry</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-900 p-1 rounded focus:outline-none cursor-pointer"
              aria-label="Close push alerts"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Browser Permission Banner */}
        <div className="p-3.5 bg-neutral-100 border-b border-neutral-200 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Monitor className="w-4 h-4 text-neutral-700 shrink-0" />
              <span className="font-medium text-neutral-800">
                Browser Push: <span className="font-mono">{browserPermission}</span>
              </span>
            </div>
            {browserPermission !== 'granted' && (
              <button
                onClick={requestBrowserPermission}
                className="px-2.5 py-1 bg-neutral-950 text-white rounded-full text-xs font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Enable Desktop Push
              </button>
            )}
          </div>
          {pushStatusMessage && (
            <div className="text-xs text-neutral-600 font-mono pt-1 border-t border-neutral-200">
              {pushStatusMessage}
            </div>
          )}
        </div>

        {/* Test Alert Simulator Presets */}
        <div className="p-4 bg-neutral-50 border-b border-neutral-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
              SIMULATE SHIPMENT STATUS TRIGGER
            </span>
            <span className="text-xs text-neutral-400">Click to test instant push</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => onTriggerPreset('vessel')}
              className="px-2.5 py-1 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 rounded text-xs transition-colors cursor-pointer"
            >
              🚢 Vessel Departed
            </button>
            <button
              onClick={() => onTriggerPreset('escrow')}
              className="px-2.5 py-1 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 rounded text-xs transition-colors cursor-pointer"
            >
              🔒 Escrow Funded
            </button>
            <button
              onClick={() => onTriggerPreset('release')}
              className="px-2.5 py-1 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 rounded text-xs transition-colors cursor-pointer"
            >
              🔑 Code Generated
            </button>
            <button
              onClick={() => onTriggerPreset('customs')}
              className="px-2.5 py-1 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 rounded text-xs transition-colors cursor-pointer"
            >
              🛃 Customs Arrival
            </button>
            <button
              onClick={() => onTriggerPreset('discrepancy')}
              className="px-2.5 py-1 bg-white hover:bg-neutral-100 text-rose-700 border border-rose-200 rounded text-xs transition-colors cursor-pointer"
            >
              ⚠️ Discrepancy Alert
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 text-xs">
              <BellOff className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
              <div>No shipment notifications at this time.</div>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-xl border transition-all ${
                  n.read ? 'bg-neutral-50/60 border-neutral-200 opacity-80' : 'bg-white border-neutral-300 shadow-xs'
                }`}
              >
                <div className="flex justify-between items-start text-xs">
                  <div className="font-semibold text-neutral-900">{n.title}</div>
                  <span className="text-xs text-neutral-400 font-mono">{n.timestamp}</span>
                </div>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{n.message}</p>

                {n.actionUrl && (
                  <div className="mt-2 pt-2 border-t border-neutral-100 flex justify-between items-center text-xs">
                    <span className="font-mono text-neutral-400">Target: {n.actionUrl.toUpperCase()}</span>
                    <button
                      onClick={() => {
                        onNavigateTab(n.actionUrl as ActiveTab);
                        onClose();
                      }}
                      className="text-neutral-900 hover:text-emerald-700 font-semibold underline flex items-center space-x-1 cursor-pointer"
                    >
                      <span>View details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs">
          <div className="flex space-x-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-neutral-600 hover:text-neutral-950 underline font-mono text-[11px] cursor-pointer"
            >
              Mark all as read
            </button>
            <span className="text-neutral-300">|</span>
            <button
              onClick={onClearAll}
              className="text-neutral-500 hover:text-rose-600 underline font-mono text-[11px] cursor-pointer"
            >
              Clear all
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-950 text-white rounded-full text-xs font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
