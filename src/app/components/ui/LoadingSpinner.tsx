type LoadingSpinnerProps = {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeClasses: Record<NonNullable<LoadingSpinnerProps['size']>, string> = {
  sm: 'w-8 h-8 border-2',
  md: 'w-12 h-12 border-4',
  lg: 'w-16 h-16 border-4',
};

export function LoadingSpinner({
  label = 'Loading...',
  size = 'md',
  className = '',
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`.trim()}>
      <div className={`${sizeClasses[size]} border-[rgba(255,255,255,0.1)] border-t-[#928dd3] rounded-full animate-spin shadow-[0_0_10px_rgba(146,141,211,0.3)]`} />
      {label && <p className="text-white/40 text-sm font-['Archivo:Medium',sans-serif]">{label}</p>}
    </div>
  );
}