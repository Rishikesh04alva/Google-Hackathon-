import React from 'react';

interface FooterProps {
  onOpenPolicyModal: (tab: string) => void;
  onOpenDataRightsModal: () => void;
  onOpenCookieBanner: () => void;
  onNavigateTab: (tab: any) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPolicyModal,
  onOpenDataRightsModal,
  onOpenCookieBanner,
  onNavigateTab,
}) => {
  return (
    <footer className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 pt-16 pb-12 mt-16 border-t border-neutral-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-neutral-200 text-xs">
        {/* Col 1: Brand & Official Registration */}
        <div className="col-span-1 sm:col-span-2">
          <div className="flex items-center space-x-2 text-neutral-950 font-semibold text-base mb-2">
            <span className="w-5 h-5 rounded-md bg-black text-white flex items-center justify-center text-xs font-mono font-bold">
              CF
            </span>
            <span>CashFlow™ Protocol Inc.</span>
          </div>
          <p className="text-neutral-500 max-w-sm leading-relaxed mb-3">
            The institutional platform for autonomous cross-border receivables, cryptographically verified trade
            escrows, and AI document underwriting.
          </p>
          <div className="text-[11px] font-mono text-neutral-600 space-y-1 mb-4">
            <div>
              Delaware Entity File: <span className="text-neutral-950">#7491028</span>
            </div>
            <div>
              Global Legal Entity ID (LEI): <span className="text-neutral-950">549300VNA892011</span>
            </div>
            <div>Registered Office: 100 Montgomery St, Ste 1400, San Francisco, CA 94104</div>
            <div>
              Contact:{' '}
              <a className="underline hover:text-black" href="mailto:legal@cashflowprotocol.io">
                legal@cashflowprotocol.io
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-neutral-400">
            <span className="hover:text-neutral-950 transition-colors cursor-pointer">Twitter</span>
            <span className="hover:text-neutral-950 transition-colors cursor-pointer">GitHub</span>
            <span className="hover:text-neutral-950 transition-colors cursor-pointer">LinkedIn</span>
          </div>
        </div>

        {/* Col 2: Product */}
        <div className="space-y-2.5">
          <div className="font-mono text-neutral-950 font-medium">Product</div>
          <div>
            <button
              onClick={() => onNavigateTab('matrix')}
              className="text-neutral-500 hover:text-neutral-950 transition-colors cursor-pointer"
            >
              Document Triangulation
            </button>
          </div>
          <div>
            <button
              onClick={() => onNavigateTab('spend')}
              className="text-neutral-500 hover:text-neutral-950 transition-colors cursor-pointer"
            >
              Spend &amp; Expenditure
            </button>
          </div>
          <div>
            <button
              onClick={() => onNavigateTab('release')}
              className="text-neutral-500 hover:text-neutral-950 transition-colors cursor-pointer"
            >
              Shipment Release Code
            </button>
          </div>
          <div>
            <button
              onClick={() => onNavigateTab('auth')}
              className="text-neutral-500 hover:text-neutral-950 transition-colors cursor-pointer"
            >
              Institutional Auth &amp; RBAC
            </button>
          </div>
        </div>

        {/* Col 3: Developers */}
        <div className="space-y-2.5">
          <div className="font-mono text-neutral-950 font-medium">Developers</div>
          <div>
            <span className="text-neutral-500 hover:text-neutral-950 transition-colors cursor-pointer">
              Documentation
            </span>
          </div>
          <div>
            <span className="text-neutral-500 hover:text-neutral-950 transition-colors cursor-pointer">
              API Reference
            </span>
          </div>
          <div>
            <span className="text-neutral-500 hover:text-neutral-950 transition-colors cursor-pointer">
              SDK Transparency
            </span>
          </div>
          <div>
            <button
              onClick={() => onOpenPolicyModal('licenses')}
              className="text-neutral-500 hover:text-neutral-950 transition-colors cursor-pointer"
            >
              Smart Contracts
            </button>
          </div>
        </div>

        {/* Col 4: Trust & Compliance */}
        <div className="space-y-2.5">
          <div className="font-mono text-neutral-950 font-medium">Trust, Privacy &amp; Legal</div>
          <div>
            <button
              onClick={() => onOpenPolicyModal('privacy')}
              className="text-neutral-500 hover:text-neutral-950 transition-colors text-left cursor-pointer"
            >
              Privacy Policy (GDPR/CCPA)
            </button>
          </div>
          <div>
            <button
              onClick={() => onOpenPolicyModal('terms')}
              className="text-neutral-500 hover:text-neutral-950 transition-colors text-left cursor-pointer"
            >
              Terms of Service
            </button>
          </div>
          <div>
            <button
              onClick={() => onOpenPolicyModal('refund')}
              className="text-neutral-500 hover:text-neutral-950 transition-colors text-left cursor-pointer"
            >
              Escrow Dispute &amp; Refund
            </button>
          </div>
          <div>
            <button
              onClick={() => onOpenPolicyModal('cookies')}
              className="text-neutral-500 hover:text-neutral-950 transition-colors text-left cursor-pointer"
            >
              Cookie Audit &amp; Policy
            </button>
          </div>
          <div>
            <button
              onClick={() => onOpenPolicyModal('licenses')}
              className="text-neutral-500 hover:text-neutral-950 transition-colors text-left cursor-pointer"
            >
              Font &amp; Asset Licensing
            </button>
          </div>
          <div>
            <button
              onClick={onOpenDataRightsModal}
              className="text-neutral-500 hover:text-neutral-950 transition-colors text-left cursor-pointer"
            >
              GDPR Erasure Request
            </button>
          </div>
        </div>
      </div>

      {/* Compliance Notice */}
      <div className="py-4 border-b border-neutral-200 text-[11px] font-mono text-neutral-500 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-neutral-800 font-medium">Notification Compliance:</span> All transactional settlement
          alerts comply with CAN-SPAM, CASL, and GDPR guidelines with a guaranteed 1-click immediate unsubscribe link.
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Zero minor data collection (18+ Institutional COPPA-exempt)</span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
        <div>© 2025 CashFlow Protocol Inc. All rights reserved. Del. File #7491028.</div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onOpenCookieBanner}
            className="text-xs text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
          >
            Cookie Settings
          </button>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-[11px] text-neutral-700">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
