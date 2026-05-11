import { useEffect, useMemo, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, FileText, MoreHorizontal, PieChart } from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useOwner } from '../context/OwnerContext';
import { summaryService, type SummaryResponse } from '../../services/summaryService';

function MetricCard({ label, value, change, accent = false }: { label: string; value: string; change: string; accent?: boolean }) {
  const isPositive = accent || change.startsWith('+');

  return (
    <div className="glass-card flex-[1_0_0] min-w-[200px] relative rounded-[16px] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300 group hover:border-white/[0.12]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#928dd3]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[16px]" />
      <div className="overflow-clip rounded-[inherit] size-full relative">
        <div className="content-stretch flex flex-col gap-[8px] items-start p-[24px] relative w-full">
          <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] text-[13px] text-tertiary" style={{ fontVariationSettings: "'wdth' 100" }}>
            {label}
          </p>
          <p className={`font-['Chivo:Black',sans-serif] font-black leading-[32px] text-[28px] tracking-[-0.24px] my-1 ${accent ? 'text-[#0DC44A]' : 'text-primary'}`}>
            {value}
          </p>
          <p className={`font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] text-[13px] px-2 py-1 rounded-md ${isPositive ? 'text-[#0DC44A] bg-[#0DC44A]/10' : 'text-[#ff6b6b] bg-[#ff6b6b]/10'}`} style={{ fontVariationSettings: "'wdth' 100" }}>
            {change}
          </p>
        </div>
      </div>
    </div>
  );
}

function ReportActionCard({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="glass-card flex-[1_0_0] min-w-[300px] relative rounded-[16px] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300 group hover:border-white/[0.12]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#928dd3]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[16px]" />
      <div className="overflow-clip rounded-[inherit] size-full relative">
        <div className="content-stretch flex flex-col gap-[16px] items-start p-[24px] relative w-full">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#928dd3]/10 rounded-lg group-hover:bg-[#928dd3]/20 transition-colors">
                <FileText size={20} className="text-[#928dd3]" />
              </div>
              <p className="flex-[1_0_0] font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[24px] min-h-px min-w-px overflow-hidden relative text-[17px] text-ellipsis text-primary whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                {title}
              </p>
            </div>
            <button className="text-tertiary hover:text-secondary transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] min-h-[60px] text-[14px] text-tertiary" style={{ fontVariationSettings: "'wdth' 100" }}>
            {description}
          </p>
          <div className="w-full pt-[8px] mt-auto">
            <button
              type="button"
              onClick={onAction}
              className="bg-white/[0.02] border border-white/[0.08] hover:border-[#928dd3]/40 content-stretch flex gap-2 items-center justify-center px-[16px] py-[10px] relative rounded-[8px] w-full hover:bg-[#928dd3]/10 transition-all duration-300 group/btn"
            >
              <Download size={16} className="text-tertiary group-hover/btn:text-[#928dd3] transition-colors" />
              <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[14px] text-secondary group-hover/btn:text-primary whitespace-nowrap transition-colors" style={{ fontVariationSettings: "'wdth' 100" }}>
                {actionLabel}
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(date);
};

const csvEscape = (value: string | number) => {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

const downloadFile = (filename: string, content: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const buildReportFilename = (ownerName: string, extension: string) => {
  const ownerSlug = ownerName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'owner';
  const dateSlug = new Date().toISOString().slice(0, 10);
  return `financial-report-${ownerSlug}-${dateSlug}.${extension}`;
};

const buildCsv = (summary: SummaryResponse, ownerName: string) => {
  const rows: (string | number)[][] = [
    ['Report', 'Monthly financial summary'],
    ['Owner', ownerName],
    ['Generated at', new Date().toISOString()],
    [],
    ['Metric', 'Value'],
    ['Gross revenue', summary.monthlyBreakdown.grossRevenue],
    ['Expenses and maintenance fees', summary.monthlyBreakdown.totalExpenses],
    ['Admin commission', summary.monthlyBreakdown.adminCommission],
    ['Net profit', summary.monthlyBreakdown.netProfit],
    ['Unpaid apartments', summary.unpaidTenantsCount],
    ['Total apartments with tenant', summary.totalTenantsCount],
    ['Unpaid amount', summary.unpaidAmount],
    [],
    ['Month', 'Revenue', 'Net profit'],
    ...summary.historicalData.map(item => [item.month, item.revenue, item.profit]),
  ];

  return rows.map(row => row.map(csvEscape).join(',')).join('\n');
};

const downloadPdf = (summary: SummaryResponse, ownerName: string) => {
  const generatedAt = formatDate(new Date());
  const unpaidPercentage = summary.totalTenantsCount > 0
    ? Math.round((summary.unpaidTenantsCount / summary.totalTenantsCount) * 100)
    : 0;

  const doc = new jsPDF();
  const metricRows = [
    ['Gross revenue', formatCurrency(summary.monthlyBreakdown.grossRevenue)],
    ['Expenses and maintenance fees', formatCurrency(summary.monthlyBreakdown.totalExpenses)],
    ['Admin commission', formatCurrency(summary.monthlyBreakdown.adminCommission)],
    ['Net profit', formatCurrency(summary.monthlyBreakdown.netProfit)],
    ['Unpaid apartments', `${summary.unpaidTenantsCount} of ${summary.totalTenantsCount} (${unpaidPercentage}%)`],
    ['Unpaid amount', formatCurrency(summary.unpaidAmount)],
  ];

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Monthly financial report', 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Owner: ${ownerName}`, 14, 28);
  doc.text(`Generated: ${generatedAt}`, 14, 35);

  autoTable(doc, {
    startY: 46,
    head: [['Metric', 'Value']],
    body: metricRows,
    theme: 'grid',
    headStyles: { fillColor: [146, 141, 211], textColor: [0, 0, 0] },
    styles: { fontSize: 10 },
  });

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 12,
    head: [['Month', 'Revenue', 'Net profit']],
    body: summary.historicalData.map(item => [
      item.month,
      formatCurrency(item.revenue),
      formatCurrency(item.profit),
    ]),
    theme: 'striped',
    headStyles: { fillColor: [17, 24, 39] },
    styles: { fontSize: 10 },
  });

  doc.save(buildReportFilename(ownerName, 'pdf'));
};

export function Reports() {
  const { currentOwner } = useOwner();
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!currentOwner) return;
      try {
        setLoading(true);
        setError(null);
        const data = await summaryService.getSummary(currentOwner.id);
        setSummary(data);
      } catch (err) {
        console.error('Failed to fetch report summary', err);
        setError('Could not load report data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [currentOwner]);

  const unpaidPercentage = useMemo(() => {
    if (!summary || summary.totalTenantsCount === 0) return 0;
    return Math.round((summary.unpaidTenantsCount / summary.totalTenantsCount) * 100);
  }, [summary]);

  const handleDownloadCsv = () => {
    if (!summary || !currentOwner) return;
    downloadFile(
      buildReportFilename(currentOwner.name, 'csv'),
      buildCsv(summary, currentOwner.name),
      'text/csv;charset=utf-8',
    );
  };

  const handleDownloadPdf = () => {
    if (!summary || !currentOwner) return;
    downloadPdf(summary, currentOwner.name);
  };

  if (loading) {
    return (
      <div className="bg-deep min-h-full w-full flex items-center justify-center">
        <LoadingSpinner label="Loading reports..." size="lg" />
      </div>
    );
  }

  if (!summary || !currentOwner) {
    return (
      <div className="bg-deep min-h-full w-full flex items-center justify-center px-[48px]">
        <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] text-[15px] text-[#FF6B6B]" style={{ fontVariationSettings: "'wdth' 100" }}>
          {error ?? 'Could not load report data.'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#928dd3]/3 to-transparent pointer-events-none" />
      <div className="flex items-center justify-between py-8 px-12 relative">
        <div>
          <h1 className="font-black text-4xl text-primary tracking-tight flex items-center gap-3" style={{ fontFamily: "'Chivo', sans-serif" }}>
            <PieChart className="text-[#928dd3]" size={36} />
            Reports
          </h1>
          <p className="text-primary/40 text-sm mt-2 font-['Archivo:Medium',sans-serif]">
            Financial reports generated from dashboard data for {currentOwner.name}
          </p>
        </div>
        <button
          type="button"
          onClick={handleDownloadPdf}
          className="bg-gradient-to-r from-[#928dd3] to-[#a89be6] content-stretch flex gap-2 items-center justify-center px-[16px] py-[8px] relative rounded-[10px] shrink-0 hover:opacity-100 shadow-[0_0_20px_rgba(146,141,211,0.3)] hover:shadow-[0_0_30px_rgba(146,141,211,0.5)] ring-1 ring-white/20 hover:ring-white/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
        >
          <Download size={18} className="text-black" />
          <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] text-black whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            Download PDF
          </p>
        </button>
      </div>

      {error && (
        <p className="px-[48px] pb-[24px] font-['Archivo:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[15px] text-[#FF6B6B]" style={{ fontVariationSettings: "'wdth' 100" }}>
          {error}
        </p>
      )}

      <div className="content-stretch flex gap-[16px] items-start px-[48px] pb-[24px] relative w-full flex-wrap">
        <MetricCard label="Gross Revenue" value={formatCurrency(summary.monthlyBreakdown.grossRevenue)} change={summary.collectedTrend} />
        <MetricCard label="Expenses & Fees" value={formatCurrency(summary.monthlyBreakdown.totalExpenses)} change={summary.expensesTrend} />
        <MetricCard label="Net Profit" value={formatCurrency(summary.monthlyBreakdown.netProfit)} change="Owner monthly result" accent />
        <MetricCard label="Unpaid Apartments" value={`${unpaidPercentage}%`} change={`${summary.unpaidTenantsCount} of ${summary.totalTenantsCount} apartments`} />
      </div>

      <div className="px-[48px] pb-[24px]">
        <div className="glass-card rounded-[16px] p-[24px] w-full relative hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300">
          <div className="content-stretch flex items-center justify-between mb-[24px]">
            <div>
              <p className="font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[24px] text-[17px] text-secondary" style={{ fontVariationSettings: "'wdth' 100" }}>
                Revenue Performance
              </p>
              <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-tertiary mt-1" style={{ fontVariationSettings: "'wdth' 100" }}>
                Revenue and net profit over the last six months
              </p>
            </div>
            <button className="text-tertiary hover:text-secondary transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="relative w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={summary.historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="dark:stroke-white/[0.06] light:stroke-black/[0.08]" />
                <XAxis dataKey="month" className="dark:stroke-white/[0.4] light:stroke-black/[0.3]" tick={{ fill: 'currentColor', fontSize: 12 }} />
                <YAxis className="dark:stroke-white/[0.4] light:stroke-black/[0.3]" tick={{ fill: 'currentColor', fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-deep)', border: '1px solid var(--glass-border)', borderRadius: '12px', backdropFilter: 'blur(10px)', color: 'var(--text-primary)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                  formatter={(value: any) => [formatCurrency(value as number), '']}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" name="Revenue" dataKey="revenue" stroke="#928dd3" strokeWidth={3} dot={{ r: 4, fill: '#928dd3' }} activeDot={{ r: 6 }} />
                <Line type="monotone" name="Net Profit" dataKey="profit" stroke="#0DC44A" strokeWidth={3} dot={{ r: 4, fill: '#0DC44A' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="px-[48px] pb-[48px]">
        <p className="font-['Chivo:Black',sans-serif] font-black leading-[32px] mb-[16px] text-[24px] text-secondary tracking-[-0.24px]">
          Generate Reports
        </p>
        <div className="content-stretch flex flex-wrap gap-[24px] items-start w-full">
          <ReportActionCard
            title="Monthly Financial PDF"
            description="PDF report with current month metrics, unpaid apartment summary, and historical revenue performance."
            actionLabel="Download PDF"
            onAction={handleDownloadPdf}
          />
          <ReportActionCard
            title="Financial Data CSV"
            description="Spreadsheet-ready export with current dashboard metrics and the six-month revenue and net profit series."
            actionLabel="Download CSV"
            onAction={handleDownloadCsv}
          />
        </div>
      </div>
    </div>
  );
}
