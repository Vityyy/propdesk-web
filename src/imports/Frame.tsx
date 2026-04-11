import svgPaths from "./svg-zayt9vop9f";
import imgImageUserAvatar from "figma:asset/7fd7b2055bb2f556381513a55b6951492f6e47d0.png";
import { imgTable } from "./svg-9p2x7";

function Menu() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="menu">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="menu">
          <path d="M3 12H21M3 6H21M3 18H21" id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Logomark() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="logomark">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="logomark">
          <path d={svgPaths.p1d5a9040} id="Icon" stroke="var(--stroke-0, #928DD3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
        </g>
      </svg>
    </div>
  );
}

function Logo() {
  return (
    <div className="content-stretch flex gap-[4px] h-[32px] items-center relative shrink-0" data-name="logo">
      <Logomark />
      <p className="font-['Sen:Bold',sans-serif] font-bold leading-none relative shrink-0 text-[#928dd3] text-[28px] tracking-[-1.12px] whitespace-nowrap">RentEase</p>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-name="Container">
      <Menu />
      <Logo />
    </div>
  );
}

function Search() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="search">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="search">
          <path d={svgPaths.p20679400} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function AppGrid() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="app-grid">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="app-grid">
          <g id="Icon">
            <path d="M10 3H3V10H10V3Z" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M21 3H14V10H21V3Z" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M21 14H14V21H21V14Z" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M10 14H3V21H10V14Z" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function ImageUserAvatar() {
  return (
    <div className="absolute inset-0 pointer-events-none rounded-[999px]" data-name="Image (user avatar)">
      <img alt="" className="absolute inset-0 max-w-none object-cover rounded-[999px] size-full" src={imgImageUserAvatar} />
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0)] border-solid inset-0 rounded-[999px]" />
    </div>
  );
}

function Profile() {
  return (
    <div className="overflow-clip relative rounded-[999px] shrink-0 size-[40px]" data-name="profile">
      <ImageUserAvatar />
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex gap-[24px] items-center justify-end relative shrink-0 w-[446.333px]" data-name="Header">
      <Search />
      <AppGrid />
      <Profile />
    </div>
  );
}

function WebAppNavBar() {
  return (
    <div className="bg-black content-stretch flex items-center justify-between py-[12px] relative shrink-0 w-full z-[3]" data-name="Web App Nav Bar">
      <Container />
      <Header />
      <div className="absolute bottom-0 h-0 left-[-96px] right-[-96px]" data-name="divider">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1536 1">
            <path d="M0 0.5H1536" id="divider" stroke="var(--stroke-0, white)" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Placeholder() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="placeholder">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="placeholder">
          <path d={svgPaths.pace200} id="Icon" stroke="var(--stroke-0, #928DD3)" strokeDasharray="4 4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function MenuItem() {
  return (
    <div className="bg-[rgba(146,141,211,0.06)] relative rounded-[8px] shrink-0 w-full" data-name="menu item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16px] py-[8px] relative w-full">
          <Placeholder />
          <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#928dd3] text-[15px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            Menu item
          </p>
        </div>
      </div>
    </div>
  );
}

function Building() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="building">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="building">
          <path d={svgPaths.p3d3d1a18} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function MenuItem1() {
  return (
    <div className="bg-black relative rounded-[8px] shrink-0 w-full" data-name="menu item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16px] py-[8px] relative w-full">
          <Building />
          <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            Properties
          </p>
        </div>
      </div>
    </div>
  );
}

function Shipping() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="shipping">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="shipping">
          <path d={svgPaths.p23f9b930} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function MenuItem2() {
  return (
    <div className="bg-black relative rounded-[8px] shrink-0 w-full" data-name="menu item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16px] py-[8px] relative w-full">
          <Shipping />
          <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            Payments
          </p>
        </div>
      </div>
    </div>
  );
}

function Tools() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="tools">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="tools">
          <path d={svgPaths.p3b4f65c0} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function MenuItem3() {
  return (
    <div className="bg-black relative rounded-[8px] shrink-0 w-full" data-name="menu item?">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16px] py-[8px] relative w-full">
          <Tools />
          <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            Expenses
          </p>
        </div>
      </div>
    </div>
  );
}

function Clipboard() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="clipboard">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="clipboard">
          <path d={svgPaths.p4a80f00} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function MenuItem4() {
  return (
    <div className="bg-black relative rounded-[8px] shrink-0 w-full" data-name="menu item?">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16px] py-[8px] relative w-full">
          <Clipboard />
          <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            Reports
          </p>
        </div>
      </div>
    </div>
  );
}

function Settings() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="settings">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip0_1_264)" id="settings">
          <g id="Icon">
            <path d={svgPaths.p3cccb600} stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p3737f500} stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_1_264">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function MenuItem5() {
  return (
    <div className="bg-black relative rounded-[8px] shrink-0 w-full" data-name="menu item?">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16px] py-[8px] relative w-full">
          <Settings />
          <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            Settings
          </p>
        </div>
      </div>
    </div>
  );
}

function SidePanelMenu() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start overflow-clip py-[24px] relative shrink-0 w-full z-[1]" data-name="Side Panel Menu">
      <MenuItem />
      <MenuItem1 />
      <MenuItem2 />
      <MenuItem3 />
      <MenuItem4 />
      <MenuItem5 />
    </div>
  );
}

function Sidebar() {
  return (
    <div className="content-stretch flex flex-col isolate items-start overflow-clip relative shrink-0 w-[400px] z-[2]" data-name="Sidebar">
      <SidePanelMenu />
    </div>
  );
}

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

function TitleContainer() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Title Container">
      <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] relative shrink-0 text-[34px] text-white tracking-[-0.34px] whitespace-nowrap">Property Management Dashboard</p>
      <CaretDown />
    </div>
  );
}

function ProjectStatus() {
  return (
    <div className="bg-black content-stretch flex gap-[8px] items-center justify-center px-[8px] py-[4px] relative rounded-[8px] shrink-0" data-name="projectStatus">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="relative shrink-0 size-[6px]" data-name="Status Dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
          <circle cx="3" cy="3" fill="var(--fill-0, #0DC44A)" id="Status Dot" r="3" />
        </svg>
      </div>
      <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] overflow-hidden relative shrink-0 text-[15px] text-center text-ellipsis text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Operational
      </p>
    </div>
  );
}

function TitleAndStatusContainer() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Title and Status Container">
      <TitleContainer />
      <ProjectStatus />
    </div>
  );
}

function ButtonFilledStandard() {
  return (
    <div className="bg-[#928dd3] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="buttonFilledStandard">
      <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] text-black whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Share
      </p>
    </div>
  );
}

function DotsHorizontal() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[24px] top-1/2" data-name="dots-horizontal">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="dots-horizontal">
          <path clipRule="evenodd" d={svgPaths.p3d5ea200} fill="var(--fill-0, white)" fillRule="evenodd" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Div() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="div">
      <DotsHorizontal />
    </div>
  );
}

function IconButtonOutlinedStandard() {
  return (
    <div className="bg-black content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="iconButtonOutlinedStandard">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.16)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Div />
    </div>
  );
}

function ActionsContainer() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0" data-name="Actions Container">
      <ButtonFilledStandard />
      <IconButtonOutlinedStandard />
    </div>
  );
}

function HeaderFrame() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Header Frame">
      <TitleAndStatusContainer />
      <ActionsContainer />
    </div>
  );
}

function ImageUserAvatar1() {
  return (
    <div className="absolute inset-0 pointer-events-none rounded-[999px]" data-name="Image (user avatar)">
      <img alt="" className="absolute inset-0 max-w-none object-cover rounded-[999px] size-full" src={imgImageUserAvatar} />
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0)] border-solid inset-0 rounded-[999px]" />
    </div>
  );
}

function Profile1() {
  return (
    <div className="mr-[-6px] relative rounded-[999px] shrink-0 size-[32px] z-[4]" data-name="profile">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <ImageUserAvatar1 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-2px] pointer-events-none rounded-[1001px]" />
    </div>
  );
}

function ImageUserAvatar2() {
  return (
    <div className="absolute inset-0 pointer-events-none rounded-[999px]" data-name="Image (user avatar)">
      <img alt="" className="absolute inset-0 max-w-none object-cover rounded-[999px] size-full" src={imgImageUserAvatar} />
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0)] border-solid inset-0 rounded-[999px]" />
    </div>
  );
}

function Profile2() {
  return (
    <div className="mr-[-6px] relative rounded-[999px] shrink-0 size-[32px] z-[3]" data-name="profile">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <ImageUserAvatar2 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-2px] pointer-events-none rounded-[1001px]" />
    </div>
  );
}

function ImageUserAvatar3() {
  return (
    <div className="absolute inset-0 pointer-events-none rounded-[999px]" data-name="Image (user avatar)">
      <img alt="" className="absolute inset-0 max-w-none object-cover rounded-[999px] size-full" src={imgImageUserAvatar} />
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0)] border-solid inset-0 rounded-[999px]" />
    </div>
  );
}

function Profile3() {
  return (
    <div className="mr-[-6px] relative rounded-[999px] shrink-0 size-[32px] z-[2]" data-name="profile">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <ImageUserAvatar3 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-2px] pointer-events-none rounded-[1001px]" />
    </div>
  );
}

function ImageUserAvatar4() {
  return (
    <div className="absolute inset-0 pointer-events-none rounded-[999px]" data-name="Image (user avatar)">
      <img alt="" className="absolute inset-0 max-w-none object-cover rounded-[999px] size-full" src={imgImageUserAvatar} />
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0)] border-solid inset-0 rounded-[999px]" />
    </div>
  );
}

function Profile4() {
  return (
    <div className="mr-[-6px] relative rounded-[999px] shrink-0 size-[32px] z-[1]" data-name="profile">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <ImageUserAvatar4 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-2px] pointer-events-none rounded-[1001px]" />
    </div>
  );
}

function ProfilePictures() {
  return (
    <div className="content-stretch flex isolate items-start pr-[6px] relative shrink-0" data-name="Profile pictures">
      <Profile1 />
      <Profile2 />
      <Profile3 />
      <Profile4 />
    </div>
  );
}

function TextContainer() {
  return (
    <div className="content-stretch flex font-['Archivo:Medium',sans-serif] font-medium gap-[4px] items-center leading-[20px] relative shrink-0 text-[15px] text-[rgba(255,255,255,0.6)] whitespace-nowrap" data-name="Text container">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Alexandra, Benjamin, Charlotte
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        +12 others
      </p>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Container">
      <ProfilePictures />
      <TextContainer />
    </div>
  );
}

function TabItem() {
  return (
    <div className="content-stretch flex items-center justify-center px-[24px] py-[12px] relative shrink-0" data-name="tab item 1?">
      <div aria-hidden="true" className="absolute border-[#928dd3] border-b border-solid inset-0 pointer-events-none" />
      <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#928dd3] text-[15px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Overview
      </p>
    </div>
  );
}

function TabItem1() {
  return (
    <div className="content-stretch flex items-center justify-center px-[24px] py-[12px] relative shrink-0" data-name="tab item 2?">
      <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] text-[rgba(255,255,255,0.6)] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Payments
      </p>
    </div>
  );
}

function TabItem2() {
  return (
    <div className="content-stretch flex items-center justify-center px-[24px] py-[12px] relative shrink-0" data-name="tabItem3?">
      <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] text-[rgba(255,255,255,0.6)] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Expenses
      </p>
    </div>
  );
}

function TabItem3() {
  return (
    <div className="content-stretch flex items-center justify-center px-[24px] py-[12px] relative shrink-0" data-name="tabItem4?">
      <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] text-[rgba(255,255,255,0.6)] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Reports
      </p>
    </div>
  );
}

function DashboardTabs() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="dashboard tabs">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.16)] border-b border-solid inset-0 pointer-events-none" />
      <TabItem />
      <TabItem1 />
      <TabItem2 />
      <TabItem3 />
    </div>
  );
}

function DashboardTitle() {
  return (
    <div className="bg-black content-stretch flex flex-col gap-[24px] items-start overflow-clip py-[24px] relative shrink-0 w-full z-[3]" data-name="dashboard title">
      <HeaderFrame />
      <Container2 />
      <DashboardTabs />
    </div>
  );
}

function DotsHorizontal1() {
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

function Frame1() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Frame">
      <p className="flex-[1_0_0] font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[24px] min-h-px min-w-px overflow-hidden relative text-[17px] text-ellipsis text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Card title
      </p>
      <DotsHorizontal1 />
    </div>
  );
}

function NumberDetail() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="number detail">
      <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] overflow-hidden relative shrink-0 text-[34px] text-ellipsis text-white tracking-[-0.34px] w-full whitespace-nowrap">12.4k</p>
      <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[#928dd3] text-[13px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        +10.7% last mo
      </p>
    </div>
  );
}

function NumberCard() {
  return (
    <div className="bg-black flex-[1_0_0] min-h-px min-w-px relative rounded-[16px]" data-name="numberCard">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-start p-[24px] relative w-full">
          <Frame1 />
          <NumberDetail />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function DotsHorizontal2() {
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

function Frame2() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Frame">
      <p className="flex-[1_0_0] font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[24px] min-h-px min-w-px overflow-hidden relative text-[17px] text-ellipsis text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Outstanding Payments
      </p>
      <DotsHorizontal2 />
    </div>
  );
}

function NumberDetail1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="number detail">
      <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] overflow-hidden relative shrink-0 text-[34px] text-ellipsis text-white tracking-[-0.34px] w-full whitespace-nowrap">$15,000</p>
      <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[#928dd3] text-[13px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        -3%
      </p>
    </div>
  );
}

function NumberCard1() {
  return (
    <div className="bg-black flex-[1_0_0] min-h-px min-w-px relative rounded-[16px]" data-name="numberCard">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-start p-[24px] relative w-full">
          <Frame2 />
          <NumberDetail1 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function DotsHorizontal3() {
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

function Frame3() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Frame">
      <p className="flex-[1_0_0] font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[24px] min-h-px min-w-px overflow-hidden relative text-[17px] text-ellipsis text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Monthly Expenses
      </p>
      <DotsHorizontal3 />
    </div>
  );
}

function NumberDetail2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="number detail">
      <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] overflow-hidden relative shrink-0 text-[34px] text-ellipsis text-white tracking-[-0.34px] w-full whitespace-nowrap">$30,000</p>
      <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[#928dd3] text-[13px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        +2%
      </p>
    </div>
  );
}

function NumberCard2() {
  return (
    <div className="bg-black flex-[1_0_0] min-h-px min-w-px relative rounded-[16px]" data-name="numberCard">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-start p-[24px] relative w-full">
          <Frame3 />
          <NumberDetail2 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function DotsHorizontal4() {
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

function Frame4() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Frame">
      <p className="flex-[1_0_0] font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[24px] min-h-px min-w-px overflow-hidden relative text-[17px] text-ellipsis text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Admin Commission
      </p>
      <DotsHorizontal4 />
    </div>
  );
}

function NumberDetail3() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="number detail">
      <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] overflow-hidden relative shrink-0 text-[34px] text-ellipsis text-white tracking-[-0.34px] w-full whitespace-nowrap">$5,000</p>
      <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[#928dd3] text-[13px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        +1%
      </p>
    </div>
  );
}

function NumberCard3() {
  return (
    <div className="bg-black flex-[1_0_0] min-h-px min-w-px relative rounded-[16px]" data-name="numberCard">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-start p-[24px] relative w-full">
          <Frame4 />
          <NumberDetail3 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function CardContainer() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full" data-name="Card Container">
      <NumberCard />
      <NumberCard1 />
      <NumberCard2 />
      <NumberCard3 />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Chivo:Black',sans-serif] font-black leading-[24px] relative shrink-0 text-[20px] text-white w-full">Key Metrics</p>
      <CardContainer />
    </div>
  );
}

function DashboardNumberCardStrip() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start justify-center overflow-clip py-[12px] relative shrink-0 w-full z-[2]" data-name="Dashboard Number Card Strip">
      <Container3 />
    </div>
  );
}

function DotsHorizontal5() {
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

function Header1() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Header">
      <p className="flex-[1_0_0] font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[24px] min-h-px min-w-px relative text-[17px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        Rent Collected
      </p>
      <DotsHorizontal5 />
    </div>
  );
}

function NumberDetail4() {
  return (
    <div className="content-stretch flex gap-[8px] items-baseline relative shrink-0 w-full" data-name="number detail">
      <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] relative shrink-0 text-[34px] text-white tracking-[-0.34px] whitespace-nowrap">$120,000</p>
      <p className="flex-[1_0_0] font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px relative text-[#928dd3] text-[13px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        +5%
      </p>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <Header1 />
      <NumberDetail4 />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] overflow-hidden relative shrink-0 text-[13px] text-[rgba(255,255,255,0.6)] text-ellipsis text-right w-[40px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        $30k
      </p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 339.5 1">
            <path d="M0 0.5H339.5" id="Vector" stroke="var(--stroke-0, white)" strokeOpacity="0.16" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] overflow-hidden relative shrink-0 text-[13px] text-[rgba(255,255,255,0.6)] text-ellipsis text-right w-[40px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        $25k
      </p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 339.5 1">
            <path d="M0 0.5H339.5" id="Vector" stroke="var(--stroke-0, white)" strokeOpacity="0.16" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] overflow-hidden relative shrink-0 text-[13px] text-[rgba(255,255,255,0.6)] text-ellipsis text-right w-[40px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        $20k
      </p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 339.5 1">
            <path d="M0 0.5H339.5" id="Vector" stroke="var(--stroke-0, white)" strokeOpacity="0.16" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] overflow-hidden relative shrink-0 text-[13px] text-[rgba(255,255,255,0.6)] text-ellipsis text-right w-[40px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        $15k
      </p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 339.5 1">
            <path d="M0 0.5H339.5" id="Vector" stroke="var(--stroke-0, white)" strokeOpacity="0.16" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] overflow-hidden relative shrink-0 text-[13px] text-[rgba(255,255,255,0.6)] text-ellipsis text-right w-[40px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        $10k
      </p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 339.5 1">
            <path d="M0 0.5H339.5" id="Vector" stroke="var(--stroke-0, white)" strokeOpacity="0.16" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Gridlines() {
  return (
    <div className="absolute content-stretch flex flex-col inset-[0_0.5px_0_0] items-start justify-between" data-name="gridlines">
      <Container6 />
      <Container7 />
      <Container8 />
      <Container9 />
      <Container10 />
    </div>
  );
}

function LineChartGraphic() {
  return (
    <div className="absolute inset-[0_1px_0_48px]" data-name="line chart graphic">
      <div className="absolute bottom-0 left-0 right-0 top-1/4" data-name="fill">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 339 162">
          <path d={svgPaths.p36e40100} fill="url(#paint0_linear_1_257)" id="fill" opacity="0.5" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_257" x1="169.5" x2="169.5" y1="0" y2="162">
              <stop stopColor="#928DD3" />
              <stop offset="1" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute bottom-[23.21%] left-0 right-0 top-1/4" data-name="line">
        <div className="absolute inset-[-0.68%_-0.15%_-0.51%_-0.15%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 340 113.196">
            <path d={svgPaths.p2e884b00} id="line" stroke="var(--stroke-0, #928DD3)" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Archivo:Medium',sans-serif] font-medium inset-[92.44%_93.22%_0.15%_0] leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Jan
      </p>
      <p className="absolute font-['Archivo:Medium',sans-serif] font-medium inset-[92.44%_49.23%_0.15%_43.99%] leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Feb
      </p>
      <p className="absolute font-['Archivo:Medium',sans-serif] font-medium inset-[92.44%_5.66%_0.15%_87.56%] leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)] text-right whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Mar
      </p>
    </div>
  );
}

function LineChart() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="line chart">
      <Gridlines />
      <LineChartGraphic />
    </div>
  );
}

function Card() {
  return (
    <div className="bg-black flex-[1_0_0] h-full min-h-px min-w-px relative rounded-[16px]" data-name="card">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[32px] items-start pb-[48px] pt-[24px] px-[24px] relative size-full">
          <Container5 />
          <LineChart />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function DotsHorizontal6() {
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

function Container11() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[24px] min-h-px min-w-px relative text-[17px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        Expense Breakdown
      </p>
      <DotsHorizontal6 />
    </div>
  );
}

function CaretDown1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="caret-down">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="caret-down">
          <path d={svgPaths.p9005000} fill="var(--fill-0, white)" fillOpacity="0.6" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="label">
      <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[13px] text-[rgba(255,255,255,0.6)] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Expense Type
      </p>
      <CaretDown1 />
    </div>
  );
}

function Title() {
  return (
    <div className="content-stretch flex items-center py-[4px] relative shrink-0 w-full" data-name="title">
      <Label />
    </div>
  );
}

function TextCell() {
  return (
    <div className="content-stretch flex items-center py-[16px] relative shrink-0 w-full" data-name="text cell">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.16)] border-solid border-t inset-0 pointer-events-none" />
      <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] overflow-hidden relative shrink-0 text-[15px] text-ellipsis text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Utilities
      </p>
    </div>
  );
}

function TextCell1() {
  return (
    <div className="content-stretch flex items-center py-[16px] relative shrink-0 w-full" data-name="text cell">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.16)] border-solid border-t inset-0 pointer-events-none" />
      <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] overflow-hidden relative shrink-0 text-[15px] text-ellipsis text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Maintenance
      </p>
    </div>
  );
}

function TextCell2() {
  return (
    <div className="content-stretch flex items-center py-[16px] relative shrink-0 w-full" data-name="text cell">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.16)] border-solid border-t inset-0 pointer-events-none" />
      <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] overflow-hidden relative shrink-0 text-[15px] text-ellipsis text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Insurance
      </p>
    </div>
  );
}

function TextCell3() {
  return (
    <div className="content-stretch flex items-center py-[16px] relative shrink-0 w-full" data-name="text cell">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.16)] border-solid border-t inset-0 pointer-events-none" />
      <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] overflow-hidden relative shrink-0 text-[15px] text-ellipsis text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Taxes
      </p>
    </div>
  );
}

function TextCell4() {
  return (
    <div className="content-stretch flex items-center py-[16px] relative shrink-0 w-full" data-name="text cell">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.16)] border-solid border-t inset-0 pointer-events-none" />
      <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] overflow-hidden relative shrink-0 text-[15px] text-ellipsis text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Other
      </p>
    </div>
  );
}

function Column() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="column1">
      <Title />
      <TextCell />
      <TextCell1 />
      <TextCell2 />
      <TextCell3 />
      <TextCell4 />
    </div>
  );
}

function CaretDown2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="caret-down">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="caret-down">
          <path d={svgPaths.p9005000} fill="var(--fill-0, white)" fillOpacity="0.6" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="label">
      <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[13px] text-[rgba(255,255,255,0.6)] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Amount
      </p>
      <CaretDown2 />
    </div>
  );
}

function Title1() {
  return (
    <div className="content-stretch flex items-center py-[4px] relative shrink-0 w-full" data-name="title">
      <Label1 />
    </div>
  );
}

function TextCell5() {
  return (
    <div className="content-stretch flex items-center py-[16px] relative shrink-0 w-full" data-name="text cell">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.16)] border-solid border-t inset-0 pointer-events-none" />
      <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] overflow-hidden relative shrink-0 text-[15px] text-ellipsis text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        $5,000
      </p>
    </div>
  );
}

function TextCell6() {
  return (
    <div className="content-stretch flex items-center py-[16px] relative shrink-0 w-full" data-name="text cell">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.16)] border-solid border-t inset-0 pointer-events-none" />
      <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] overflow-hidden relative shrink-0 text-[15px] text-ellipsis text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        $3,000
      </p>
    </div>
  );
}

function TextCell7() {
  return (
    <div className="content-stretch flex items-center py-[16px] relative shrink-0 w-full" data-name="text cell">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.16)] border-solid border-t inset-0 pointer-events-none" />
      <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] overflow-hidden relative shrink-0 text-[15px] text-ellipsis text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        $1,500
      </p>
    </div>
  );
}

function TextCell8() {
  return (
    <div className="content-stretch flex items-center py-[16px] relative shrink-0 w-full" data-name="text cell">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.16)] border-solid border-t inset-0 pointer-events-none" />
      <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] overflow-hidden relative shrink-0 text-[15px] text-ellipsis text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        $2,000
      </p>
    </div>
  );
}

function TextCell9() {
  return (
    <div className="content-stretch flex items-center py-[16px] relative shrink-0 w-full" data-name="text cell">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.16)] border-solid border-t inset-0 pointer-events-none" />
      <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] overflow-hidden relative shrink-0 text-[15px] text-ellipsis text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        $1,000
      </p>
    </div>
  );
}

function Column1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[72px]" data-name="column2?">
      <Title1 />
      <TextCell5 />
      <TextCell6 />
      <TextCell7 />
      <TextCell8 />
      <TextCell9 />
    </div>
  );
}

function CaretDown3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="caret-down">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="caret-down">
          <path d={svgPaths.p9005000} fill="var(--fill-0, white)" fillOpacity="0.6" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="label">
      <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[13px] text-[rgba(255,255,255,0.6)] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Status
      </p>
      <CaretDown3 />
    </div>
  );
}

function Title2() {
  return (
    <div className="content-stretch flex items-center py-[4px] relative shrink-0 w-full" data-name="title">
      <Label2 />
    </div>
  );
}

function Chip1() {
  return (
    <div className="bg-black content-stretch flex gap-[8px] items-center justify-center px-[8px] py-[4px] relative rounded-[8px] shrink-0" data-name="Chip">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="relative shrink-0 size-[6px]" data-name="Status Dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
          <circle cx="3" cy="3" fill="var(--fill-0, #0DC44A)" id="Status Dot" r="3" />
        </svg>
      </div>
      <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] overflow-hidden relative shrink-0 text-[15px] text-center text-ellipsis text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Paid
      </p>
    </div>
  );
}

function Chip() {
  return (
    <div className="content-stretch flex h-[52px] items-center py-[12px] relative shrink-0 w-full" data-name="Chip">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.16)] border-solid border-t inset-0 pointer-events-none" />
      <Chip1 />
    </div>
  );
}

function Chip3() {
  return (
    <div className="bg-black content-stretch flex gap-[8px] items-center justify-center px-[8px] py-[4px] relative rounded-[8px] shrink-0" data-name="Chip">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="relative shrink-0 size-[6px]" data-name="Status Dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
          <circle cx="3" cy="3" fill="var(--fill-0, #E18C26)" id="Status Dot" r="3" />
        </svg>
      </div>
      <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] overflow-hidden relative shrink-0 text-[15px] text-center text-ellipsis text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Pending
      </p>
    </div>
  );
}

function Chip2() {
  return (
    <div className="content-stretch flex h-[52px] items-center py-[12px] relative shrink-0 w-full" data-name="Chip">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.16)] border-solid border-t inset-0 pointer-events-none" />
      <Chip3 />
    </div>
  );
}

function Chip5() {
  return (
    <div className="bg-black content-stretch flex gap-[8px] items-center justify-center px-[8px] py-[4px] relative rounded-[8px] shrink-0" data-name="Chip">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="relative shrink-0 size-[6px]" data-name="Status Dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
          <circle cx="3" cy="3" fill="var(--fill-0, #E14526)" id="Status Dot" r="3" />
        </svg>
      </div>
      <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] overflow-hidden relative shrink-0 text-[15px] text-center text-ellipsis text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Overdue
      </p>
    </div>
  );
}

function Chip4() {
  return (
    <div className="content-stretch flex h-[52px] items-center py-[12px] relative shrink-0 w-full" data-name="Chip">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.16)] border-solid border-t inset-0 pointer-events-none" />
      <Chip5 />
    </div>
  );
}

function Chip7() {
  return (
    <div className="bg-black content-stretch flex gap-[8px] items-center justify-center px-[8px] py-[4px] relative rounded-[8px] shrink-0" data-name="Chip">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="relative shrink-0 size-[6px]" data-name="Status Dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
          <circle cx="3" cy="3" fill="var(--fill-0, #0DC44A)" id="Status Dot" r="3" />
        </svg>
      </div>
      <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] overflow-hidden relative shrink-0 text-[15px] text-center text-ellipsis text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Paid
      </p>
    </div>
  );
}

function Chip6() {
  return (
    <div className="content-stretch flex h-[52px] items-center py-[12px] relative shrink-0 w-full" data-name="Chip">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.16)] border-solid border-t inset-0 pointer-events-none" />
      <Chip7 />
    </div>
  );
}

function Chip9() {
  return (
    <div className="bg-black content-stretch flex gap-[8px] items-center justify-center px-[8px] py-[4px] relative rounded-[8px] shrink-0" data-name="Chip">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="relative shrink-0 size-[6px]" data-name="Status Dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
          <circle cx="3" cy="3" fill="var(--fill-0, #E18C26)" id="Status Dot" r="3" />
        </svg>
      </div>
      <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] overflow-hidden relative shrink-0 text-[15px] text-center text-ellipsis text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Pending
      </p>
    </div>
  );
}

function Chip8() {
  return (
    <div className="content-stretch flex h-[52px] items-center py-[12px] relative shrink-0 w-full" data-name="Chip">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.16)] border-solid border-t inset-0 pointer-events-none" />
      <Chip9 />
    </div>
  );
}

function ChipColumn() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[90px]" data-name="chipColumn?">
      <Title2 />
      <Chip />
      <Chip2 />
      <Chip4 />
      <Chip6 />
      <Chip8 />
    </div>
  );
}

function Table1() {
  return (
    <div className="content-stretch flex gap-[16px] items-start mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-24px_24px] mask-size-[436px_328px] py-[24px] relative shrink-0 w-[609px]" data-name="table" style={{ maskImage: `url('${imgTable}')` }}>
      <Column />
      <Column1 />
      <ChipColumn />
    </div>
  );
}

function Table() {
  return (
    <div className="bg-black flex-[1_0_0] h-[400px] min-h-px min-w-px relative rounded-[16px]" data-name="table">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pt-[24px] px-[24px] relative size-full">
          <Container11 />
          <Table1 />
          <div className="absolute bg-[rgba(255,255,255,0.16)] h-[200px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-424px_-32px] mask-size-[436px_328px] right-[6px] rounded-[999px] top-[104px] w-[6px]" data-name="scrollbar" style={{ maskImage: `url('${imgTable}')` }} />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function ContentContainer() {
  return (
    <div className="content-stretch flex gap-[24px] h-[400px] items-center relative shrink-0 w-full" data-name="Content Container">
      <Card />
      <Table />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Chivo:Black',sans-serif] font-black leading-[24px] relative shrink-0 text-[20px] text-white w-full">Financial Overview</p>
      <ContentContainer />
    </div>
  );
}

function DashboardChart() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start justify-center overflow-clip py-[12px] relative shrink-0 w-full z-[1]" data-name="Dashboard Chart">
      <Container4 />
    </div>
  );
}

function MainContent() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative z-[1]" data-name="Main Content">
      <DashboardTitle />
      <DashboardNumberCardStrip />
      <DashboardChart />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-[48px] isolate items-start overflow-clip relative shrink-0 w-full z-[2]" data-name="Container">
      <Sidebar />
      <MainContent />
    </div>
  );
}

function BasicFooter() {
  return <div className="bg-black h-[48px] shrink-0 w-full z-[1]" data-name="Basic Footer" />;
}

export default function Frame() {
  return (
    <div className="bg-black content-stretch flex flex-col isolate items-start px-[48px] relative size-full" data-name="Frame">
      <WebAppNavBar />
      <Container1 />
      <BasicFooter />
    </div>
  );
}