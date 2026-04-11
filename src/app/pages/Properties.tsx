import { useState } from 'react';
import { useOwner } from '../context/OwnerContext';
import svgPaths from "../../imports/svg-zayt9vop9f";
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

function DotsHorizontal() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="dots-horizontal">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="dots-horizontal">
          <path clipRule="evenodd" d={svgPaths.p3d5ea200} fill="var(--fill-0, white)" fillRule="evenodd" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Plus() {
  return (
    <svg className="size-[20px]" fill="none" viewBox="0 0 24 24">
      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

interface PropertyCardProps {
  name: string;
  address: string;
  units: number;
  occupancy: string;
  revenue: string;
  imageUrl: string;
}

function PropertyCard({ name, address, units, occupancy, revenue, imageUrl }: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div 
      className="bg-black relative rounded-[16px] overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-[200px] overflow-hidden">
        <ImageWithFallback 
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>
      
      <div className="p-[24px]">
        <div className="flex items-start justify-between mb-[12px]">
          <div className="flex-1">
            <p className="font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[24px] text-[17px] text-white mb-[4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
              {name}
            </p>
            <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
              {address}
            </p>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="hover:opacity-70 transition-opacity p-[4px]"
            >
              <DotsHorizontal />
            </button>
            
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-[10]" 
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute top-[calc(100%+8px)] right-0 bg-black border border-[rgba(255,255,255,0.16)] rounded-[8px] min-w-[200px] z-[11] overflow-hidden">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      // Handle add expense
                    }}
                    className="w-full text-left px-[16px] py-[12px] hover:bg-[rgba(255,255,255,0.05)] transition-colors flex items-center gap-[12px]"
                  >
                    <Plus />
                    <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Add Expense
                    </p>
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      // Handle edit
                    }}
                    className="w-full text-left px-[16px] py-[12px] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                  >
                    <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Edit Property
                    </p>
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      // Handle view details
                    }}
                    className="w-full text-left px-[16px] py-[12px] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                  >
                    <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                      View Details
                    </p>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mb-[16px]">
          <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)] mb-[4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            Monthly Revenue
          </p>
          <p className="font-['Chivo:Black',sans-serif] font-black leading-[32px] text-[24px] text-[#928dd3] tracking-[-0.24px]">
            {revenue}
          </p>
        </div>

        {/* Additional info shown on hover */}
        <div className={`transition-all duration-300 overflow-hidden ${isHovered ? 'max-h-[100px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pt-[16px] border-t border-[rgba(255,255,255,0.16)]">
            <div className="flex gap-[24px]">
              <div>
                <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)] mb-[4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Units
                </p>
                <p className="font-['Chivo:Black',sans-serif] font-black leading-[24px] text-[20px] text-white tracking-[-0.2px]">
                  {units}
                </p>
              </div>
              <div>
                <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)] mb-[4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Occupancy
                </p>
                <p className="font-['Chivo:Black',sans-serif] font-black leading-[24px] text-[20px] text-white tracking-[-0.2px]">
                  {occupancy}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

export function Properties() {
  const { currentOwner } = useOwner();
  
  const properties = [
    {
      name: "Sunset Apartments",
      address: "123 Main St, City",
      units: 24,
      occupancy: "92%",
      revenue: "$28,000",
      imageUrl: "https://images.unsplash.com/photo-1559329146-807aff9ff1fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDF8fHx8MTc3MzkzMjE3MXww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      name: "Harbor View Complex",
      address: "456 Ocean Ave, City",
      units: 36,
      occupancy: "88%",
      revenue: "$42,000",
      imageUrl: "https://images.unsplash.com/photo-1771998785227-268f33b50c65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZXNpZGVudGlhbCUyMGNvbXBsZXh8ZW58MXx8fHwxNzczOTU1OTQzfDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      name: "Downtown Lofts",
      address: "789 Central Blvd, City",
      units: 18,
      occupancy: "95%",
      revenue: "$35,000",
      imageUrl: "https://images.unsplash.com/photo-1504660069764-2b37e279874a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb3dudG93biUyMGxvZnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NzM5NTU5NDR8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      name: "Parkside Residences",
      address: "321 Park Dr, City",
      units: 30,
      occupancy: "90%",
      revenue: "$38,000",
      imageUrl: "https://images.unsplash.com/photo-1687051471969-d2ded7eec8a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMHRvd2VyJTIwc2t5bGluZXxlbnwxfHx8fDE3NzM5NTU5NDR8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      name: "Riverside Towers",
      address: "654 River Rd, City",
      units: 48,
      occupancy: "85%",
      revenue: "$52,000",
      imageUrl: "https://images.unsplash.com/photo-1740484408109-bf402fa3a1ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBjb21wbGV4JTIwd2F0ZXJmcm9udHxlbnwxfHx8fDE3NzM5NTU5NDR8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      name: "Metro Plaza",
      address: "987 Metro St, City",
      units: 42,
      occupancy: "93%",
      revenue: "$48,000",
      imageUrl: "https://images.unsplash.com/photo-1736007917095-88dd6bc641e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGFwYXJ0bWVudCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc3Mzk0Njg0Nnww&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

  return (
    <div className="bg-black min-h-full w-full">
      <div className="content-stretch flex flex-col gap-[24px] items-start py-[24px] px-[48px] relative shrink-0 w-full">
        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
          <div>
            <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] relative shrink-0 text-[34px] text-white tracking-[-0.34px] whitespace-nowrap">
              Properties
            </p>
            <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] text-[15px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
              Managing {currentOwner.properties} properties for {currentOwner.name}
            </p>
          </div>
          <button className="bg-[#928dd3] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 hover:bg-[#7f7ab8] transition-colors">
            <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] text-black whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              Add Property
            </p>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-[24px] px-[48px] pb-[48px]">
        {properties.map((property, index) => (
          <PropertyCard key={index} {...property} />
        ))}
      </div>
    </div>
  );
}
