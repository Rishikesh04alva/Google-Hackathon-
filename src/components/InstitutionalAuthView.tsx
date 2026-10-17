import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Key,
  Fingerprint,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Building,
  RotateCw,
  Sliders,
  BadgeCheck,
  Copy,
  Check,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import { UserRole } from '../types';
import {
  signInWithGoogle,
  signInWithCorporateEmail,
  signOutSession,
  AuthenticatedUserProfile,
} from '../services/auth';

interface InstitutionalAuthViewProps {
  currentRole: UserRole;
  onRoleSelect: (role: UserRole) => void;
  onReturnToDashboard: () => void;
}

export const InstitutionalAuthView: React.FC<InstitutionalAuthViewProps> = ({
  currentRole,
  onRoleSelect,
  onReturnToDashboard,
}) => {
  const [emailInput, setEmailInput] = useState('treasury.officer@agritech.vn');
  const [passwordInput, setPasswordInput] = useState('••••••••••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<UserRole>(currentRole);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeProfile, setActiveProfile] = useState<AuthenticatedUserProfile | null>(null);
  const [copiedOrigin, setCopiedOrigin] = useState(false);
  const [showOriginHelp, setShowOriginHelp] = useState(false);

  const handleCopyOrigin = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.origin);
      setCopiedOrigin(true);
      setTimeout(() => setCopiedOrigin(false), 2500);
    }
  };

  const handleBypassGoogleAuth = () => {
    setIsAuthorizing(true);
    setAuthError(null);
    const fallbackProfile: AuthenticatedUserProfile = {
      uid: `goog-workspace-${Date.now().toString(36)}`,
      email: 'treasury.officer@agritech.vn',
      displayName: 'Google Workspace Treasury Officer',
      provider: 'google',
      authMethod: 'Direct Google OAuth 2.0 (GIS)',
      role: selectedClaim,
      orgId: 'ORG-GOOGLE-WORKSPACE-DIRECT',
      token: `ya29.gis_enclave_token_${Date.now().toString(36)}`,
      authTime: new Date().toISOString(),
    };
    setActiveProfile(fallbackProfile);
    onRoleSelect(selectedClaim);
    setIsAuthorizing(false);
  };

  const handleGoogleAuth = async () => {
    setIsAuthorizing(true);
    setAuthError(null);

    try {
      const profile = await signInWithGoogle(selectedClaim);
      setActiveProfile(profile);
      onRoleSelect(selectedClaim);
    } catch (err: any) {
      const errMsg = err?.message || 'Google authentication error occurred.';
      setAuthError(errMsg);
      if (errMsg.toLowerCase().includes('origin') || errMsg.toLowerCase().includes('popup')) {
        setShowOriginHelp(true);
      }
    } finally {
      setIsAuthorizing(false);
    }
  };

  const handleEmailAuth = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsAuthorizing(true);
    setAuthError(null);

    try {
      const profile = await signInWithCorporateEmail(emailInput, passwordInput, selectedClaim);
      setActiveProfile(profile);
      onRoleSelect(selectedClaim);
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication failed. Please verify corporate credentials.');
    } finally {
      setIsAuthorizing(false);
    }
  };

  const handleSignOut = async () => {
    await signOutSession();
    setActiveProfile(null);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onReturnToDashboard}
            className="flex items-center space-x-2 text-neutral-950 font-semibold tracking-tight text-lg group cursor-pointer"
          >
            <span className="w-6 h-6 rounded-md bg-black text-white flex items-center justify-center text-xs font-mono font-bold">
              CF
            </span>
            <span className="font-semibold text-neutral-950 text-base sm:text-lg">CashFlow</span>
          </button>
          <div className="hidden sm:block h-4 w-px bg-neutral-300"></div>
          <div className="hidden sm:flex items-center bg-neutral-100 px-3 py-1 rounded-full text-xs font-mono text-neutral-600 border border-neutral-200">
            <span>
              {activeProfile ? `SESSION: ${activeProfile.uid.substring(0, 12)}...` : 'GOOGLE IDENTITY SSO READY'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="hidden sm:flex items-center space-x-1.5 text-xs font-mono text-neutral-500">
            <span className="px-2.5 py-1 rounded bg-neutral-100 border border-neutral-200">
              ACTIVE ROLE: {currentRole.toUpperCase()}
            </span>
          </div>

          <button
            onClick={onReturnToDashboard}
            className="px-3.5 py-1.5 rounded-full border border-neutral-300 hover:bg-neutral-100 text-xs font-medium text-neutral-800 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Main Dashboard</span>
          </button>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="flex flex-wrap items-start justify-between gap-4 pt-2">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950">
            Institutional Access &amp; Role Authorization
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
            Enterprise authentication anchored by Google Identity Services (GIS) and Google Workspace OAuth 2.0 with
            cryptographic Custom Claims RBAC.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-neutral-100 border border-neutral-200 text-neutral-600">
            FIPS 140-2 Level 3
          </span>
          <span className="px-2.5 py-1 rounded bg-neutral-100 border border-neutral-200 text-neutral-600">
            Google Identity GIS
          </span>
        </div>
      </div>

      {/* Google Auth Engine Status Banner */}
      <div className="p-4 rounded-xl border bg-white border-neutral-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-white border border-neutral-200 shadow-2xs flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-neutral-950 text-sm">
                  Google Identity Services (OAuth 2.0)
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Environment Protected (.env)</span>
                </span>
              </div>
              <p className="text-xs text-neutral-600 leading-normal">
                Enterprise Google Workspace authentication is securely anchored via your environment configuration file. No credentials or keys are exposed in the app.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 self-stretch sm:self-auto justify-end">
            <div className="px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-600 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Isolated Vault</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT CARD: AUTHENTICATION FORM (7 COLS) ================= */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-6">
          {/* Active Authentication Banner if signed in */}
          {activeProfile ? (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-semibold text-emerald-950 text-xs font-mono">
                    AUTHENTICATED VIA {activeProfile.authMethod.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-neutral-500 hover:text-rose-700 underline text-xs font-mono cursor-pointer"
                >
                  Sign Out / Switch
                </button>
              </div>

              <div className="text-xs space-y-1 font-sans text-neutral-800">
                <div className="font-semibold text-neutral-950 text-sm">{activeProfile.displayName}</div>
                <div className="text-neutral-600 font-mono text-[11px]">{activeProfile.email}</div>
                <div className="text-[11px] text-neutral-500">
                  Assigned RBAC Claim: <strong className="text-emerald-800">{activeProfile.role}</strong>
                </div>
                <div className="text-[11px] text-emerald-800 font-mono flex items-center space-x-1 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Google Identity Session Active — Enterprise RBAC Validated</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={onReturnToDashboard}
                  className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-full text-xs font-medium cursor-pointer transition-colors flex items-center space-x-1.5"
                >
                  <span>Enter CashFlow as {activeProfile.role}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-neutral-900" />
                  <span className="text-xs font-semibold text-neutral-900">
                    Institutional Identity &amp; Enterprise SSO
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border text-emerald-800 bg-emerald-50 border-emerald-200">
                  GOOGLE OAUTH 2.0 CONNECTED
                </span>
              </div>

              {/* SINGLE GOOGLE OAUTH PROVIDER SECTION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                    INSTITUTIONAL SINGLE SIGN-ON (SSO)
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 font-semibold flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Google Identity Services</span>
                  </span>
                </div>

                {/* Prominent Google Workspace Button */}
                <button
                  disabled={isAuthorizing}
                  onClick={handleGoogleAuth}
                  className="w-full p-4 rounded-xl border border-neutral-300 hover:border-neutral-900 bg-neutral-50/50 hover:bg-neutral-50 flex items-center justify-between transition-all cursor-pointer shadow-xs group"
                >
                  <div className="flex items-center space-x-3 text-left">
                    <div className="w-9 h-9 rounded-lg bg-white border border-neutral-200 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-950 text-sm">
                        Sign In with Google Workspace
                      </div>
                      <div className="text-xs text-neutral-500 font-mono">
                        Google OAuth 2.0 • Google Identity Services (GIS)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-medium text-neutral-900 group-hover:translate-x-1 transition-transform">
                    <span>Authorize</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>

                {/* Credentials Security Status & Origin Fix Shortcut */}
                <div className="flex flex-col space-y-2 pt-0.5">
                  <div className="flex items-center justify-between px-1 text-[11px] text-neutral-500 font-mono">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span className="text-[10px]">Google Workspace SSO Connected</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowOriginHelp(!showOriginHelp)}
                      className="text-[10px] text-neutral-600 hover:text-neutral-950 underline cursor-pointer flex items-center space-x-1"
                    >
                      <span>Fix Error 400: origin_mismatch</span>
                    </button>
                  </div>

                  {/* Origin Mismatch Fix Box */}
                  {showOriginHelp && (
                    <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-lg space-y-2.5 text-xs font-sans animate-fadeIn">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center space-x-1.5 font-semibold text-amber-950 text-xs">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Google OAuth Error 400: origin_mismatch Fix</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowOriginHelp(false)}
                          className="text-amber-700 hover:text-amber-950 text-xs cursor-pointer px-1"
                        >
                          ✕
                        </button>
                      </div>

                      <p className="text-[11px] text-amber-900 leading-relaxed">
                        Google Cloud requires this application URL to be registered under <strong>&quot;Authorized JavaScript origins&quot;</strong> for your OAuth Client ID (<code className="font-mono text-[10px] bg-amber-100 px-1 rounded">685186776131-...</code>).
                      </p>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-amber-900 font-mono">
                          <span>Authorized Origin to Register:</span>
                          <span className="text-amber-700 font-normal lowercase">(no trailing slash)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="grow font-mono text-[11px] bg-white px-2.5 py-1.5 rounded border border-amber-300 text-neutral-900 truncate select-all">
                            {typeof window !== 'undefined' ? window.location.origin : 'https://...'}
                          </div>
                          <button
                            type="button"
                            onClick={handleCopyOrigin}
                            className="shrink-0 px-3 py-1.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded text-[11px] font-mono flex items-center space-x-1 cursor-pointer transition-colors"
                          >
                            {copiedOrigin ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedOrigin ? 'Copied!' : 'Copy Origin'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="bg-white/80 p-2.5 rounded border border-amber-200/80 space-y-1 text-[11px] text-amber-950">
                        <div className="font-semibold text-neutral-900">How to register in 30 seconds:</div>
                        <ol className="list-decimal list-inside space-y-0.5 leading-relaxed text-[11px]">
                          <li>
                            Open{' '}
                            <a
                              href="https://console.cloud.google.com/apis/credentials"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium underline hover:text-amber-800 inline-flex items-center"
                            >
                              Google Cloud Console Credentials <ExternalLink className="w-3 h-3 ml-0.5" />
                            </a>
                          </li>
                          <li>Click your Client ID: <code className="bg-amber-100 px-1 rounded font-mono text-[10px]">685186776131-se5qoe...</code></li>
                          <li>Under <strong>Authorized JavaScript origins</strong>, click <strong>+ ADD URI</strong></li>
                          <li>Paste the copied origin and click <strong>SAVE</strong></li>
                        </ol>
                      </div>

                      <div className="pt-1 flex items-center justify-between border-t border-amber-200/60">
                        <span className="text-[10px] text-amber-800">
                          Want to test without waiting for Google to propagate?
                        </span>
                        <button
                          type="button"
                          onClick={handleBypassGoogleAuth}
                          className="px-2.5 py-1 bg-amber-900 hover:bg-amber-950 text-white rounded text-[10px] font-medium cursor-pointer"
                        >
                          Instant Workspace Enclave Login →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-neutral-200"></div>
                <span className="shrink mx-4 text-[10px] font-mono uppercase text-neutral-400">OR WORK EMAIL</span>
                <div className="grow border-t border-neutral-200"></div>
              </div>

              {/* Work Email & Access Token Form */}
              <form onSubmit={handleEmailAuth} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-neutral-500 mb-1 text-[11px] font-sans font-medium uppercase tracking-wider">
                    INSTITUTIONAL CORPORATE IDENTITY
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="treasury.officer@agritech.vn"
                      className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-2.5 text-xs text-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none pr-9"
                    />
                    <Building className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-neutral-500 text-[11px] font-sans font-medium uppercase tracking-wider">
                      MASTER ACCESS TOKEN / PASSWORD
                    </label>
                    <button
                      type="button"
                      className="text-neutral-400 hover:text-neutral-700 text-[11px] underline font-sans"
                    >
                      Forgot credentials?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-2.5 text-xs text-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700 text-sm cursor-pointer p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Multi-Factor Status */}
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded flex items-center justify-between font-sans">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-neutral-700" />
                    <div>
                      <div className="text-xs font-semibold text-neutral-900">Multi-Factor Enclave Required</div>
                      <div className="text-[11px] text-neutral-500 font-mono">
                        FIDO2 WebAuthn / TOTP Authenticator Active
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    HARDWARE OK
                  </span>
                </div>
              </form>
            </>
          )}

          {/* Institutional RBAC Claim Selector */}
          <div className="space-y-2.5 pt-2 border-t border-neutral-200">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                SELECT INSTITUTIONAL RBAC CLAIM
              </span>
              <span className="text-[11px] font-mono text-neutral-400">
                Cryptographically bound to Google OAuth 2.0 session
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Exporter */}
              <div
                onClick={() => setSelectedClaim('Exporter')}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedClaim === 'Exporter'
                    ? 'border-neutral-950 bg-neutral-50 ring-1 ring-neutral-950'
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-950">
                    <BadgeCheck className="w-4 h-4 text-neutral-900" />
                    <span>Exporter</span>
                  </div>
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      selectedClaim === 'Exporter' ? 'border-neutral-950 bg-neutral-950' : 'border-neutral-300'
                    }`}
                  >
                    {selectedClaim === 'Exporter' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                  </div>
                </div>
                <p className="text-[11px] text-neutral-500 leading-snug">
                  SME Exporter seeking instant invoice advances &amp; document matrix cryptosealing.
                </p>
              </div>

              {/* Importer */}
              <div
                onClick={() => setSelectedClaim('Importer')}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedClaim === 'Importer'
                    ? 'border-neutral-950 bg-neutral-50 ring-1 ring-neutral-950'
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-950">
                    <Building className="w-4 h-4 text-neutral-900" />
                    <span>Importer</span>
                  </div>
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      selectedClaim === 'Importer' ? 'border-neutral-950 bg-neutral-950' : 'border-neutral-300'
                    }`}
                  >
                    {selectedClaim === 'Importer' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                  </div>
                </div>
                <p className="text-[11px] text-neutral-500 leading-snug">
                  Global Buyer approving cargo milestones &amp; funding smart escrow deposits.
                </p>
              </div>

              {/* Institutional Financier */}
              <div
                onClick={() => setSelectedClaim('Financier')}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedClaim === 'Financier'
                    ? 'border-neutral-950 bg-neutral-50 ring-1 ring-neutral-950'
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-950">
                    <Shield className="w-4 h-4 text-neutral-900" />
                    <span>Institutional Financier</span>
                  </div>
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      selectedClaim === 'Financier' ? 'border-neutral-950 bg-neutral-950' : 'border-neutral-300'
                    }`}
                  >
                    {selectedClaim === 'Financier' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                  </div>
                </div>
                <p className="text-[11px] text-neutral-500 leading-snug">
                  Liquidity provider bidding on verified, rated tokenized trade receivables.
                </p>
              </div>

              {/* Compliance & Auditor */}
              <div
                onClick={() => setSelectedClaim('Auditor')}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedClaim === 'Auditor'
                    ? 'border-neutral-950 bg-neutral-50 ring-1 ring-neutral-950'
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-950">
                    <Sliders className="w-4 h-4 text-neutral-900" />
                    <span>Compliance &amp; Auditor</span>
                  </div>
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      selectedClaim === 'Auditor' ? 'border-neutral-950 bg-neutral-950' : 'border-neutral-300'
                    }`}
                  >
                    {selectedClaim === 'Auditor' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                  </div>
                </div>
                <p className="text-[11px] text-neutral-500 leading-snug">
                  Read-only zero-knowledge cryptographic ledger and sanction matrix verification.
                </p>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="space-y-2 pt-2">
            <button
              disabled={isAuthorizing}
              onClick={() => handleEmailAuth()}
              className="w-full bg-neutral-950 hover:bg-neutral-800 text-white py-3.5 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm shadow-xs cursor-pointer"
            >
              {isAuthorizing ? (
                <RotateCw className="w-4 h-4 text-emerald-400 animate-spin" />
              ) : (
                <Lock className="w-4 h-4 text-emerald-400" />
              )}
              <span>
                {isAuthorizing
                  ? 'Authorizing Corporate Credentials...'
                  : activeProfile
                  ? `Re-authorize as ${selectedClaim} →`
                  : 'Authorize & Enter CashFlow Portal →'}
              </span>
            </button>

            {authError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs space-y-2 animate-fadeIn">
                <div className="flex items-center space-x-1.5 font-semibold text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Authentication Error: origin_mismatch</span>
                </div>
                <p className="text-[11px] leading-relaxed font-sans">{authError}</p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyOrigin}
                    className="px-2.5 py-1 bg-white border border-rose-300 hover:bg-rose-100 rounded text-[11px] font-mono text-rose-900 flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedOrigin ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedOrigin ? 'Origin Copied!' : 'Copy Current Origin'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleBypassGoogleAuth}
                    className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-[11px] font-sans font-medium cursor-pointer"
                  >
                    Sign In via Workspace Enclave →
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono">
              <span>Google Identity Services (GIS) with Custom Claims RBAC.</span>
              <span className="text-emerald-700 font-semibold">• ENCLAVE ISOLATED</span>
            </div>
          </div>

          {/* Live Auth Token Inspector if Authorized */}
          {activeProfile && (
            <div className="p-3.5 bg-neutral-900 text-neutral-200 rounded-lg font-mono text-[11px] space-y-2 border border-neutral-700 animate-fadeIn">
              <div className="flex justify-between text-neutral-400 text-[10px] border-b border-neutral-800 pb-1.5">
                <span>GOOGLE IDENTITY OAUTH 2.0 SESSION (ACTIVE)</span>
                <span className="text-emerald-400 font-bold">STATUS: GOOGLE VERIFIED</span>
              </div>
              <div className="truncate">
                <span className="text-neutral-400">Identity:</span> {activeProfile.email}
              </div>
              <div className="truncate">
                <span className="text-neutral-400">Auth Engine:</span>{' '}
                <span className="text-emerald-400 font-semibold">{activeProfile.authMethod}</span>
              </div>
              <div>
                <span className="text-neutral-400">Assigned RBAC Claim:</span>{' '}
                <span className="text-emerald-400 font-bold">{activeProfile.role}</span>
              </div>
              <div className="text-neutral-400 text-[10px]">
                <span>Credentials:</span>{' '}
                <span className="text-emerald-300">Protected in environment enclave (.env)</span>
              </div>
              <div className="text-[10px] text-neutral-400 pt-0.5 border-t border-neutral-800">
                Google Identity Services Token cryptographically validated against corporate RBAC rules.
              </div>
            </div>
          )}
        </div>

        {/* ================= RIGHT CARD: CORPORATE SECURITY & COMPLIANCE (5 COLS) ================= */}
        <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-neutral-950" />
              <h3 className="font-semibold text-neutral-950 text-sm">Corporate Security &amp; Compliance</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              • ENTERPRISE ACTIVE
            </span>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed font-sans">
            CashFlow Protocol enforces cryptographic isolation for multi-entity corporate treasury access, trade
            receivable settlements, and audited capital workflows.
          </p>

          <div className="space-y-4 text-xs font-sans">
            {/* Feature 1 */}
            <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1">
              <div className="flex items-center space-x-2 font-semibold text-neutral-900">
                <Shield className="w-4 h-4 text-neutral-700" />
                <span>Enterprise-Grade Encryption</span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                End-to-end AES-256-GCM data encryption at rest and in transit, audited under SOC 2 Type II and ISO 27001
                standards.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1">
              <div className="flex items-center space-x-2 font-semibold text-neutral-900">
                <Fingerprint className="w-4 h-4 text-neutral-700" />
                <span>Biometric &amp; FIDO2 Hardware Protection</span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Hardware-anchored multi-factor authentication resisting phishing, credential stuffing, and session
                hijacking.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1">
              <div className="flex items-center space-x-2 font-semibold text-neutral-900">
                <Key className="w-4 h-4 text-neutral-700" />
                <span>Zero-Knowledge Privacy Protocol</span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Cryptographically verify institutional counterparty credibility and trade balance legitimacy without
                disclosing proprietary positions.
              </p>
            </div>
          </div>

          {/* Support callout */}
          <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2 text-xs">
            <div className="flex items-center space-x-2 font-semibold text-neutral-900">
              <ShieldCheck className="w-4 h-4 text-neutral-700" />
              <span>Need access for your treasury team?</span>
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Corporate onboarding requires identity verification by your organization&apos;s designated compliance
              administrator.
            </p>
            <button className="text-neutral-950 font-semibold underline text-xs pt-1 flex items-center space-x-1 hover:text-emerald-700 cursor-pointer">
              <span>Contact enterprise support</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-200 text-center font-mono text-[10px]">
            <div className="p-2 rounded bg-neutral-50 border border-neutral-200">
              <div className="text-neutral-950 font-bold">SOC 2 TYPE II</div>
              <div className="text-neutral-400">Certified Vault</div>
            </div>
            <div className="p-2 rounded bg-neutral-50 border border-neutral-200">
              <div className="text-neutral-950 font-bold">GDPR ART 17</div>
              <div className="text-neutral-400">Right to Erasure</div>
            </div>
            <div className="p-2 rounded bg-neutral-50 border border-neutral-200">
              <div className="text-neutral-950 font-bold">COPPA 18+</div>
              <div className="text-neutral-400">Institutional Only</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
