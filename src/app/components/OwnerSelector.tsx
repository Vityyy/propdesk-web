import { useState } from 'react';
import { useOwner } from '../context/OwnerContext';
import authService from '../../services/authService';
import svgPaths from "../../imports/svg-zayt9vop9f";

function CaretDown() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="caret-down">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="caret-down">
          <path d={svgPaths.p9005000} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

export function OwnerSelector() {
  const { currentOwner, setCurrentOwner, owners } = useOwner();
  const [isOpen, setIsOpen] = useState(false);
  const isAdmin = authService.getCurrentUserRole() === 'ADMIN';

  // Owner: static badge showing their name, no dropdown
  if (!isAdmin) {
    return (
      <div className="bg-black border border-[rgba(255,255,255,0.16)] rounded-[8px] px-[16px] py-[8px]">
        <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Propietario
        </p>
        <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
          {currentOwner.name}
        </p>
      </div>
    );
  }

  // Admin: no owners available
  if (owners.length === 0) {
    return (
      <div className="bg-black border border-red-600/30 rounded-lg p-3">
        <p className="text-red-400 text-sm">No tienes propietarios vinculados</p>
      </div>
    );
  }

  // Admin: dropdown selector for switching between owners
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black content-stretch flex gap-[12px] items-center justify-between px-[16px] py-[8px] relative rounded-[8px] min-w-[200px] hover:bg-[rgba(255,255,255,0.05)] transition-colors border border-[rgba(255,255,255,0.16)]"
      >
        <div className="flex flex-col items-start">
          <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
            Propietario
          </p>
          <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            {currentOwner.name}
          </p>
        </div>
        <CaretDown />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[10]" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-[calc(100%+8px)] left-0 bg-black border border-[rgba(255,255,255,0.16)] rounded-[8px] min-w-[280px] z-[11] overflow-hidden">
            {owners.map((owner) => (
              <button
                key={owner.id}
                onClick={() => {
                  setCurrentOwner(owner);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-[16px] py-[12px] hover:bg-[rgba(255,255,255,0.05)] transition-colors ${
                  currentOwner.id === owner.id ? 'bg-[rgba(146,141,211,0.06)]' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                    {owner.name}
                  </p>
                  {currentOwner.id === owner.id && (
                    <div className="relative shrink-0 size-[6px]">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
                        <circle cx="3" cy="3" fill="#928dd3" r="3" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
