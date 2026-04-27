import type { PaymentStatus } from '../types/index';

interface StatusBadgeProps {
  status: PaymentStatus;
  onStatusChange?: (status: PaymentStatus) => void;
}

export type { PaymentStatus };

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusColors = {
    paid: 'text-[#0DC44A]',
    pending: 'text-[#928dd3]',
    overdue: 'text-[#FF6B6B]',
    partial: 'text-[#FFA500]'
  };

  const statusText = {
    paid: 'Paid',
    pending: 'Pending',
    overdue: 'Overdue',
    partial: 'Partial'
  };

  return (
    <div className="bg-black content-stretch flex gap-[8px] items-center justify-center px-[8px] py-[4px] relative rounded-[8px] shrink-0 w-fit">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="relative shrink-0 size-[6px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
          <circle cx="3" cy="3" fill={status === 'paid' ? '#0DC44A' : status === 'pending' ? '#928dd3' : status === 'overdue' ? '#FF6B6B' : '#FFA500'} r="3" />
        </svg>
      </div>
      <p className={`font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] whitespace-nowrap ${statusColors[status]}`} style={{ fontVariationSettings: "'wdth' 100" }}>
        {statusText[status]}
      </p>
    </div>
  );
}
