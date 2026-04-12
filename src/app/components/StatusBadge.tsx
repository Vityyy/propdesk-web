import { useState } from 'react';

export type PaymentStatus = 'paid' | 'pending' | 'overdue';

interface StatusBadgeProps {
  status: PaymentStatus;
  onStatusChange?: (status: PaymentStatus) => void;
}

export function StatusBadge({ status, onStatusChange }: StatusBadgeProps) {
  const [showMenu, setShowMenu] = useState(false);

  const statusColors = {
    paid: 'text-[#0DC44A]',
    pending: 'text-[#928dd3]',
    overdue: 'text-[#FF6B6B]'
  };

  const statusText = {
    paid: 'Paid',
    pending: 'Pending',
    overdue: 'Overdue'
  };

  const statusOptions: PaymentStatus[] = ['paid', 'pending', 'overdue'];

  const handleStatusSelect = (newStatus: PaymentStatus) => {
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => onStatusChange && setShowMenu(!showMenu)}
        disabled={!onStatusChange}
        className={`bg-black content-stretch flex gap-[8px] items-center justify-center px-[8px] py-[4px] relative rounded-[8px] shrink-0 w-fit ${onStatusChange ? 'cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-colors' : 'cursor-default'}`}
      >
        <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
        <div className="relative shrink-0 size-[6px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
            <circle cx="3" cy="3" fill={status === 'paid' ? '#0DC44A' : status === 'pending' ? '#928dd3' : '#FF6B6B'} r="3" />
          </svg>
        </div>
        <p className={`font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] whitespace-nowrap ${statusColors[status]}`} style={{ fontVariationSettings: "'wdth' 100" }}>
          {statusText[status]}
        </p>
      </button>

      {showMenu && onStatusChange && (
        <>
          <div 
            className="fixed inset-0 z-[10]" 
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute top-[calc(100%+8px)] left-0 bg-black border border-[rgba(255,255,255,0.16)] rounded-[8px] min-w-[150px] z-[11] overflow-hidden">
            {statusOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleStatusSelect(option)}
                className={`w-full text-left px-[16px] py-[12px] hover:bg-[rgba(255,255,255,0.05)] transition-colors ${status === option ? 'bg-[rgba(255,255,255,0.1)]' : ''}`}
              >
                <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                  {statusText[option]}
                </p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
