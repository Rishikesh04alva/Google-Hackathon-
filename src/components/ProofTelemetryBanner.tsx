import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface ProofTelemetryBannerProps {
  onOpenPrivacyModal: () => void;
  onOpenDataRightsModal: () => void;
}

export const ProofTelemetryBanner: React.FC<ProofTelemetryBannerProps> = ({
  onOpenPrivacyModal,
  onOpenDataRightsModal,
}) => {
  return (
    <aside aria-label="Proof of Verification Telemetry" className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-3 w-full">
      <div className="p-3 bg-neutral-100/90 border border-neutral-300 rounded-lg flex flex-col md:flex-row md:items-center justify-between text-xs font-mono text-neutral-700 gap-3">
        <div className="flex items-center flex-wrap gap-1.5 min-w-0">
          <div className="flex items-center space-x-1.5 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span className="font-semibold text-neutral-950">Verifiable Proof of Telemetry:</span>
          </div>
          <span className="text-neutral-600 text-xs">
            100% mathematically deterministic metrics verified against Base Sepolia contract state &amp; ZK-Rollup roots.
            Zero synthetic testimonials. Zero fabricated claims.
          </span>
        </div>
        <div className="flex items-center space-x-3 text-xs shrink-0 self-end md:self-auto">
          <button
            onClick={onOpenPrivacyModal}
            className="underline hover:text-black focus:outline-none cursor-pointer"
          >
            SDK &amp; Privacy Audit
          </button>
          <span className="text-neutral-300">|</span>
          <button
            onClick={onOpenDataRightsModal}
            className="underline hover:text-black focus:outline-none cursor-pointer"
          >
            GDPR Art. 17 Deletion Request
          </button>
        </div>
      </div>
    </aside>
  );
};
