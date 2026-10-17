import React, { useState, useMemo } from 'react';
import {
  Check,
  Download,
  CreditCard,
  TrendingUp,
  Lock,
  PiggyBank,
  Gauge,
  Sparkles,
  Receipt,
  Search,
} from 'lucide-react';
import { SpendRecord } from '../types';
import { INITIAL_SPEND_RECORDS } from '../data/mockData';

interface ExpenditureDashboardViewProps {
  onSelectReleaseCode: (code: string) => void;
  onNavigateToReleasePortal: () => void;
}

export const ExpenditureDashboardView: React.FC<ExpenditureDashboardViewProps> = ({
  onSelectReleaseCode,
  onNavigateToReleasePortal,
}) => {
  const [records, setRecords] = useState<SpendRecord[]>(INITIAL_SPEND_RECORDS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [timeframe, setTimeframe] = useState<'30D' | 'Q1' | 'YTD'>('Q1');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        r.counterparty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.dealId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.corridor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.releaseCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [records, searchTerm, statusFilter]);

  // Aggregate Metrics
  const totalSpend = useMemo(() => records.reduce((acc, r) => acc + r.amount, 0), [records]);
  const totalEscrowFees = useMemo(() => records.reduce((acc, r) => acc + r.escrowFee, 0), [records]);
  const totalSavings = useMemo(() => records.reduce((acc, r) => acc + r.savings, 0), [records]);
  const activeInEscrow = useMemo(
    () =>
      records
        .filter((r) => r.status === 'In Escrow' || r.status === 'Financed')
        .reduce((acc, r) => acc + r.amount, 0),
    [records]
  );

  const handleExportCSV = () => {
    const headers = 'ID,Deal,Date,Counterparty,Corridor,Category,Amount,EscrowFee,Savings,Status,ReleaseCode\n';
    const rows = filteredRecords
      .map(
        (r) =>
          `"${r.id}","${r.dealId}","${r.date}","${r.counterparty}","${r.corridor}","${r.category}",${r.amount},${r.escrowFee},${r.savings},"${r.status}","${r.releaseCode}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CashFlow_Spend_Expenditure_Report_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Title & Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-neutral-600 bg-neutral-100 px-3 py-0.5 rounded-full mb-1 border border-neutral-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>TREASURY &amp; CAPITAL ALLOCATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950">
            Global Trade Expenditure &amp; Spend Analytics
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl">
            Real-time multi-currency settlement monitoring, letter-of-credit bank fee arbitrage savings, and cargo
            milestone release capital tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe pill selector */}
          <div className="flex items-center bg-white p-1 rounded-full border border-neutral-300 text-xs font-mono">
            <button
              onClick={() => setTimeframe('30D')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                timeframe === '30D' ? 'bg-neutral-950 text-white font-semibold' : 'text-neutral-600 hover:text-black'
              }`}
            >
              Last 30D
            </button>
            <button
              onClick={() => setTimeframe('Q1')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                timeframe === 'Q1' ? 'bg-neutral-950 text-white font-semibold' : 'text-neutral-600 hover:text-black'
              }`}
            >
              Q1 2025
            </button>
            <button
              onClick={() => setTimeframe('YTD')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                timeframe === 'YTD' ? 'bg-neutral-950 text-white font-semibold' : 'text-neutral-600 hover:text-black'
              }`}
            >
              YTD
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-medium rounded-full shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            {downloadSuccess ? <Check className="w-4 h-4 shrink-0" /> : <Download className="w-4 h-4 shrink-0" />}
            <span>{downloadSuccess ? 'Exported CSV!' : 'Export CSV Report'}</span>
          </button>
        </div>
      </div>

      {/* METRIC TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Spend */}
        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs">
          <div className="text-xs font-medium text-neutral-500 flex items-center justify-between">
            <span>Total Disbursed Spend</span>
            <CreditCard className="w-4 h-4 text-neutral-400 shrink-0" />
          </div>
          <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 mt-2 font-mono">
            ${totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-emerald-700 mt-2 flex items-center space-x-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5 shrink-0" />
            <span>+18.4% YoY Trade Volume Expansion</span>
          </div>
        </div>

        {/* Metric 2: Active in Escrow */}
        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs">
          <div className="text-xs font-medium text-neutral-500 flex items-center justify-between">
            <span>Capital Locked in Escrow</span>
            <Lock className="w-4 h-4 text-neutral-400 shrink-0" />
          </div>
          <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 mt-2 font-mono">
            ${activeInEscrow.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-neutral-600 mt-2 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Protected across 3 marine transit corridors</span>
          </div>
        </div>

        {/* Metric 3: Bank Fee Arbitrage Savings */}
        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs">
          <div className="text-xs font-medium text-neutral-500 flex items-center justify-between">
            <span>L/C Bank Fee Savings</span>
            <PiggyBank className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
          <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-emerald-700 mt-2 font-mono">
            +${totalSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-neutral-600 mt-2 flex items-center space-x-1">
            <span className="text-emerald-700 font-semibold">Saved vs 7.8%</span>
            <span className="text-neutral-400">standard bank letters of credit</span>
          </div>
        </div>

        {/* Metric 4: Average Escrow Duration */}
        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs">
          <div className="text-xs font-medium text-neutral-500 flex items-center justify-between">
            <span>Avg Escrow Turnaround</span>
            <Gauge className="w-4 h-4 text-neutral-400 shrink-0" />
          </div>
          <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 mt-2 font-mono flex items-baseline">
            <span>12.4</span>
            <span className="text-sm text-neutral-400 ml-1 font-sans">days</span>
          </div>
          <div className="text-xs text-neutral-600 mt-2 flex items-center space-x-1">
            <span className="text-emerald-700 font-medium">81% faster</span>
            <span className="text-neutral-400">than legacy correspondent banks</span>
          </div>
        </div>
      </div>

      {/* ANALYTICS CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Spend & Savings Breakdown (Interactive SVG) */}
        <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-neutral-950">Monthly Expenditure &amp; Bank Savings Trend</h3>
              <p className="text-xs text-neutral-500">Gross cargo expenditure vs net savings realized</p>
            </div>
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-neutral-900"></span>
                <span className="text-neutral-600">Spend ($k)</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
                <span className="text-neutral-600">Savings ($k)</span>
              </span>
            </div>
          </div>

          {/* SVG Bar Chart Visualization */}
          <div className="pt-2">
            <div className="h-56 w-full flex items-end justify-between gap-3 px-2">
              {[
                { month: 'Oct 2024', spend: 450, savings: 32 },
                { month: 'Nov 2024', spend: 620, savings: 48 },
                { month: 'Dec 2024', spend: 540, savings: 41 },
                { month: 'Jan 2025', spend: 780, savings: 61 },
                { month: 'Feb 2025', spend: 890, savings: 72 },
                { month: 'Mar 2025', spend: 1040, savings: 85 },
              ].map((item, idx) => {
                const maxSpend = 1200;
                const spendHeight = (item.spend / maxSpend) * 100;
                const savingsHeight = (item.savings / 100) * 80;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1.5 h-44">
                      {/* Spend Bar */}
                      <div
                        style={{ height: `${spendHeight}%` }}
                        className="w-1/2 bg-neutral-900 hover:bg-neutral-700 rounded-t transition-all relative group"
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-950 text-white font-mono text-[10px] px-1.5 py-0.5 rounded shadow whitespace-nowrap pointer-events-none transition-opacity z-10">
                          ${item.spend}k
                        </div>
                      </div>
                      {/* Savings Bar */}
                      <div
                        style={{ height: `${savingsHeight}%` }}
                        className="w-1/2 bg-emerald-500 hover:bg-emerald-400 rounded-t transition-all relative group"
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-950 text-white font-mono text-[10px] px-1.5 py-0.5 rounded shadow whitespace-nowrap pointer-events-none transition-opacity z-10">
                          +${item.savings}k
                        </div>
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-neutral-500 mt-2 truncate text-center">
                      {item.month}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Spend by Commodity Category */}
        <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="border-b border-neutral-200 pb-3">
            <h3 className="text-sm font-semibold text-neutral-950">Spend by Commodity</h3>
            <p className="text-xs text-neutral-500">Capital distribution by cargo class</p>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { label: 'Rare Earth Minerals', amount: '$580,000', pct: 31, color: 'bg-neutral-900' },
              { label: 'Electronic Components', amount: '$410,000', pct: 24, color: 'bg-neutral-700' },
              { label: 'Agricultural Grains', amount: '$320,000', pct: 20, color: 'bg-neutral-500' },
              { label: 'Industrial Nickel & Ore', amount: '$720,000', pct: 15, color: 'bg-neutral-400' },
              { label: 'Coffee Commodities', amount: '$142,000', pct: 10, color: 'bg-emerald-600' },
            ].map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-neutral-800">{cat.label}</span>
                  <span className="font-mono text-neutral-600">{cat.amount}</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                  <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-neutral-200">
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-neutral-800 flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">
                <strong>Capital Efficiency Tip:</strong> Coffee commodities qualify for instant 85% advance payouts upon
                marine Bill of Lading generation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FILTERABLE EXPENDITURE TRANSACTIONS TABLE */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-xs overflow-hidden space-y-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-4">
          <div className="flex items-center space-x-2">
            <Receipt className="w-4 h-4 text-neutral-900 shrink-0" />
            <h3 className="text-sm font-semibold text-neutral-950">Detailed Expenditure &amp; Settlement Ledger</h3>
            <span className="text-xs font-mono text-neutral-400">({filteredRecords.length} records)</span>
          </div>

          {/* Search & Status Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search counterparty, PO, or corridor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-neutral-50 border border-neutral-300 rounded-full px-3 py-1.5 pl-8 text-xs text-neutral-900 w-64 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-400" />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-neutral-50 border border-neutral-300 rounded-full px-3 py-1.5 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
            >
              <option value="ALL">All Statuses</option>
              <option value="In Escrow">In Escrow</option>
              <option value="Financed">Financed</option>
              <option value="Settled">Settled</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse min-w-[880px]">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 font-mono text-xs uppercase tracking-wider bg-neutral-50/70">
                <th className="py-2.5 px-3 font-semibold">Date / Deal ID</th>
                <th className="py-2.5 px-3 font-semibold">Counterparty</th>
                <th className="py-2.5 px-3 font-semibold">Corridor &amp; Cargo</th>
                <th className="py-2.5 px-3 font-semibold">Gross Amount</th>
                <th className="py-2.5 px-3 font-semibold">Escrow Fee (3.2%)</th>
                <th className="py-2.5 px-3 font-semibold">L/C Savings</th>
                <th className="py-2.5 px-3 font-semibold">Escrow Status</th>
                <th className="py-2.5 px-3 font-semibold">Release Code</th>
                <th className="py-2.5 px-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-neutral-800 font-sans">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-mono text-neutral-950 font-semibold">{r.dealId}</div>
                    <div className="text-[11px] text-neutral-500 font-mono">{r.date}</div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-semibold text-neutral-900">{r.counterparty}</div>
                    <div className="text-[11px] text-neutral-500">{r.vesselTracking}</div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-medium text-neutral-800">{r.corridor}</div>
                    <div className="text-[11px] text-neutral-500">{r.category}</div>
                  </td>

                  <td className="py-3 px-3 font-mono font-bold text-neutral-950">
                    ${r.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-3 px-3 font-mono text-neutral-600">
                    -${r.escrowFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-3 px-3 font-mono text-emerald-700 font-semibold">
                    +${r.savings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold border ${
                        r.status === 'Settled'
                          ? 'bg-neutral-100 text-neutral-800 border-neutral-300'
                          : r.status === 'In Escrow'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}
                    >
                      {r.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-mono text-xs font-semibold bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded text-neutral-900">
                      {r.releaseCode}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        onSelectReleaseCode(r.releaseCode);
                        onNavigateToReleasePortal();
                      }}
                      className="px-2.5 py-1 bg-neutral-950 hover:bg-neutral-800 text-white rounded-full text-xs font-medium cursor-pointer transition-colors"
                      title="Inspect Shipment Release Voucher"
                    >
                      Release Pass
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
