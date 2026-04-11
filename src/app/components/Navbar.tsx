import { Link } from "react-router";
import svgPaths from "../../imports/svg-zayt9vop9f";
import imgImageUserAvatar from "../../assets/7fd7b2055bb2f556381513a55b6951492f6e47d0.png";

function Menu() {
  return (
    <div
      className="relative shrink-0 size-[24px]"
      data-name="menu"
    >
      {/* <svg
        className="absolute block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="menu">
          <path
            d="M3 12H21M3 6H21M3 18H21"
            id="Icon"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </g>
      </svg> */}
    </div>
  );
}

function Logomark() {
  return (
    <div
      className="relative shrink-0 size-[28px]"
      data-name="logomark"
    >
      <svg
        className="absolute block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 28 28"
      >
        <g id="logomark">
          <path
            d={svgPaths.p1d5a9040}
            id="Icon"
            stroke="var(--stroke-0, #928DD3)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          />
        </g>
      </svg>
    </div>
  );
}

function Logo() {
  return (
    <Link
      to="/"
      className="content-stretch flex gap-[4px] h-[32px] items-center relative shrink-0"
      data-name="logo"
    >
      <Logomark />
      <p className="font-['Sen:Bold',sans-serif] font-bold leading-none relative shrink-0 text-[#928dd3] text-[28px] tracking-[-1.12px] whitespace-nowrap">
        Placeholder
      </p>
    </Link>
  );
}

function Container() {
  return (
    <div
      className="content-stretch flex gap-[24px] items-center relative shrink-0"
      data-name="Container"
    >
      <Menu />
      <Logo />
    </div>
  );
}

function Search() {
  return (
    <button
      className="relative shrink-0 size-[24px] hover:opacity-70 transition-opacity"
      data-name="search"
    >
      <svg
        className="absolute block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="search">
          <path
            d={svgPaths.p20679400}
            id="Icon"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </g>
      </svg>
    </button>
  );
}

function AppGrid() {
  return (
    <button
      className="relative shrink-0 size-[24px] hover:opacity-70 transition-opacity"
      data-name="app-grid"
    >
      <svg
        className="absolute block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="app-grid">
          <g id="Icon">
            <path
              d="M10 3H3V10H10V3Z"
              stroke="var(--stroke-0, white)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M21 3H14V10H21V3Z"
              stroke="var(--stroke-0, white)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M21 14H14V21H21V14Z"
              stroke="var(--stroke-0, white)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M10 14H3V21H10V14Z"
              stroke="var(--stroke-0, white)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </g>
        </g>
      </svg>
    </button>
  );
}

function ImageUserAvatar() {
  return (
    <div
      className="absolute inset-0 pointer-events-none rounded-[999px]"
      data-name="Image (user avatar)"
    >
      <img
        alt=""
        className="absolute inset-0 max-w-none object-cover rounded-[999px] size-full"
        src={imgImageUserAvatar}
      />
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(255,255,255,0)] border-solid inset-0 rounded-[999px]"
      />
    </div>
  );
}

function Profile() {
  return (
    <button
      className="overflow-clip relative rounded-[999px] shrink-0 size-[40px] hover:opacity-80 transition-opacity"
      data-name="profile"
    >
      <ImageUserAvatar />
    </button>
  );
}

function Header() {
  return (
    <div
      className="content-stretch flex gap-[24px] items-center justify-end relative shrink-0 w-[446.333px]"
      data-name="Header"
    >
      <Search />
      <AppGrid />
      <Profile />
    </div>
  );
}

export function Navbar() {
  return (
    <div
      className="bg-black content-stretch flex items-center justify-between py-[12px] px-[48px] relative shrink-0 w-full z-[3]"
      data-name="Web App Nav Bar"
    >
      <Container />
      <Header />
      <div
        className="absolute bottom-0 h-0 left-0 right-0"
        data-name="divider"
      >
        <div className="absolute inset-[-0.5px_0]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1536 1"
          >
            <path
              d="M0 0.5H1536"
              id="divider"
              stroke="var(--stroke-0, white)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}