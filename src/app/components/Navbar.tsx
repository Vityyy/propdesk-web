import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import imgImageUserAvatar from "../../assets/7fd7b2055bb2f556381513a55b6951492f6e47d0.png";
import logoImg from "../../assets/logo.png";
import authService from "../../services/authService";
import userService from "../../services/userService";
import { AdminRequestsMailbox } from "./AdminRequestsMailbox";
import { HireAdminDialog } from "./dialogs/HireAdminDialog";

function Logo() {
  return (
    <Link
      to="/"
      className="content-stretch flex gap-[12px] items-center relative shrink-0"
      data-name="logo"
    >
      <img src={logoImg} alt="Bloq Properties Logo" className="h-[48px] object-contain" />
      <p className="font-['Sen:Bold',sans-serif] font-bold leading-none relative shrink-0 text-[#928dd3] text-[28px] tracking-[-1.12px] whitespace-nowrap">
        Bloq Properties
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
      <Logo />
    </div>
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
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/settings")}
      className="overflow-clip relative rounded-[999px] shrink-0 size-[40px] hover:opacity-80 transition-opacity"
      data-name="profile"
      type="button"
    >
      <ImageUserAvatar />
    </button>
  );
}

function HireAdminButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasAssociatedAdmin, setHasAssociatedAdmin] = useState(false);

  useEffect(() => {
    let ignore = false;

    const loadAssociatedAdmin = async () => {
      try {
        const associatedAdmin = await userService.getAssociatedAdmin();
        if (!ignore) {
          setHasAssociatedAdmin(Boolean(associatedAdmin));
        }
      } catch {
        if (!ignore) {
          setHasAssociatedAdmin(false);
        }
      }
    };

    loadAssociatedAdmin();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <button
        onClick={() => {
          if (!hasAssociatedAdmin) {
            setIsDialogOpen(true);
          }
        }}
        className={`px-[16px] py-[8px] rounded-[8px] font-['Archivo:SemiBold',sans-serif] font-semibold text-[14px] transition-all duration-300 ${
          hasAssociatedAdmin
            ? "bg-white/[0.03] border border-white/10 text-white/30 cursor-not-allowed"
            : "bg-gradient-to-r from-[#928dd3] to-[#a89be6] text-black shadow-[0_0_15px_rgba(146,141,211,0.4)] hover:shadow-[0_0_25px_rgba(146,141,211,0.7)] ring-1 ring-white/20 hover:ring-white/50 hover:-translate-y-0.5 active:scale-95"
        }`}
        title={hasAssociatedAdmin ? "You already have an associated administrator" : "Hire Admin"}
      >
        Hire Admin
      </button>
      <HireAdminDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={() => {
          setIsDialogOpen(false);
        }}
      />
    </>
  );
}

function Header() {
  const role = authService.getCurrentUserRole();
  const isOwner = role === 'OWNER';
  const isAdmin = role === 'ADMIN';

  return (
    <div
      className="content-stretch flex gap-[24px] items-center justify-end relative shrink-0"
      data-name="Header"
    >
      {isOwner && <HireAdminButton />}
      {isAdmin && <AdminRequestsMailbox />}
      <Profile />
    </div>
  );
}

export function Navbar() {
  return (
    <div
      className="bg-[#030308]/80 backdrop-blur-xl border-b border-white/[0.04] content-stretch flex items-center justify-between py-[12px] px-[24px] relative shrink-0 w-full z-[3]"
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