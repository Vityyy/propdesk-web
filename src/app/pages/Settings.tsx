import { useEffect, useState } from 'react';
import { ApiError } from '../../utils/httpUtils';
import authService from '../../services/authService';
import userService, { type AdminSummary } from '../../services/userService';
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

interface SettingItemProps {
  label: string;
  description: string;
  value: string | boolean;
  type: 'text' | 'toggle' | 'select';
  options?: string[];
  onChange?: (value: string | boolean) => void;
}

function SettingItem({ label, description, value, type, options, onChange }: SettingItemProps) {
  return (
    <div className="content-stretch flex items-center justify-between py-[16px] px-[24px] relative shrink-0 w-full border-b border-[rgba(255,255,255,0.16)]">
      <div className="flex-[1_0_0]">
        <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white mb-[4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          {label}
        </p>
        <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
          {description}
        </p>
      </div>
      <div className="ml-[24px]">
        {type === 'toggle' && (
          <button
            onClick={() => onChange?.(!value)}
            className={`relative w-[44px] h-[24px] rounded-[12px] transition-colors ${
              value ? 'bg-[#928dd3]' : 'bg-[rgba(255,255,255,0.16)]'
            }`}
          >
            <div
              className={`absolute top-[2px] w-[20px] h-[20px] bg-white rounded-[10px] transition-transform ${
                value ? 'translate-x-[22px]' : 'translate-x-[2px]'
              }`}
            />
          </button>
        )}
        {type === 'text' && (
          <input
            type="text"
            value={value as string}
            onChange={(e) => onChange?.(e.target.value)}
            className="bg-black border border-[rgba(255,255,255,0.16)] rounded-[8px] px-[12px] py-[6px] text-white font-['Archivo:Medium',sans-serif] min-w-[200px]"
          />
        )}
        {type === 'select' && options && (
          <div className="relative inline-block">
            <select
              value={value as string}
              onChange={(e) => onChange?.(e.target.value)}
              className="bg-black border border-[rgba(255,255,255,0.16)] rounded-[8px] px-[12px] py-[6px] pr-[36px] text-white font-['Archivo:Medium',sans-serif] appearance-none cursor-pointer min-w-[150px]"
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none">
              <CaretDown />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-black rounded-[16px] w-full relative mb-[24px]">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="py-[16px] px-[24px] border-b border-[rgba(255,255,255,0.16)]">
          <p className="font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[24px] text-[17px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
            {title}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Settings() {
  const isOwner = authService.getCurrentUserRole() === 'OWNER';
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [autoPayment, setAutoPayment] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [companyName, setCompanyName] = useState('RentEase Management');
  const [email, setEmail] = useState('admin@rentease.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('EST');
  const [language, setLanguage] = useState('English');
  const [admins, setAdmins] = useState<AdminSummary[]>([]);
  const [selectedAdminId, setSelectedAdminId] = useState('');
  const [adminCut, setAdminCut] = useState('10');
  const [associationMessage, setAssociationMessage] = useState<string | null>(null);
  const [associationError, setAssociationError] = useState<string | null>(null);
  const [isAssociatingAdmin, setIsAssociatingAdmin] = useState(false);

  useEffect(() => {
    if (!isOwner) {
      return;
    }

    let ignore = false;

    // Loads the admin options used by the owner association flow.
    const loadAdmins = async () => {
      try {
        const availableAdmins = await userService.listAdmins();
        if (ignore) {
          return;
        }

        setAdmins(availableAdmins);
        setSelectedAdminId((currentAdminId) => currentAdminId || availableAdmins[0]?.id || '');
      } catch (error) {
        if (!ignore) {
          setAssociationError(error instanceof ApiError ? error.message : 'No se pudieron cargar los administradores');
        }
      }
    };

    loadAdmins();

    return () => {
      ignore = true;
    };
  }, [isOwner]);

  // Associates the current owner with the selected admin using the backend API.
  const handleAssociateAdmin = async () => {
    if (!selectedAdminId || isAssociatingAdmin) {
      return;
    }

    try {
      setAssociationError(null);
      setAssociationMessage(null);
      setIsAssociatingAdmin(true);

      const response = await userService.associateAdmin({
        adminId: selectedAdminId,
        adminCut: adminCut.trim() ? Number(adminCut) : undefined,
      });

      setAssociationMessage(`Ahora ${response.adminName} administra tus propiedades con tu permiso.`);
    } catch (error) {
      setAssociationError(error instanceof ApiError ? error.message : 'No se pudo asociar el administrador');
    } finally {
      setIsAssociatingAdmin(false);
    }
  };

  return (
    <div className="bg-black min-h-full w-full">
      <div className="content-stretch flex flex-col gap-[24px] items-start py-[24px] px-[48px] relative shrink-0 w-full">
        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
          <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] relative shrink-0 text-[34px] text-white tracking-[-0.34px] whitespace-nowrap">
            Settings
          </p>
          <button className="bg-[#928dd3] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 hover:bg-[#7f7ab8] transition-colors">
            <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] text-black whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              Save Changes
            </p>
          </button>
        </div>
        <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[15px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Manage your account and application preferences
        </p>
      </div>

      <div className="px-[48px] pb-[48px]">
        <SettingsSection title="Account Information">
          <SettingItem
            label="Company Name"
            description="Your company or organization name"
            value={companyName}
            type="text"
            onChange={(v) => setCompanyName(v as string)}
          />
          <SettingItem
            label="Email Address"
            description="Primary email for account notifications"
            value={email}
            type="text"
            onChange={(v) => setEmail(v as string)}
          />
          <SettingItem
            label="Phone Number"
            description="Contact number for important alerts"
            value={phone}
            type="text"
            onChange={(v) => setPhone(v as string)}
          />
        </SettingsSection>

        <SettingsSection title="Notifications">
          <SettingItem
            label="Email Notifications"
            description="Receive updates and alerts via email"
            value={emailNotifications}
            type="toggle"
            onChange={(v) => setEmailNotifications(v as boolean)}
          />
          <SettingItem
            label="Push Notifications"
            description="Get instant notifications on your device"
            value={pushNotifications}
            type="toggle"
            onChange={(v) => setPushNotifications(v as boolean)}
          />
        </SettingsSection>

        <SettingsSection title="Payment Settings">
          <SettingItem
            label="Automatic Payment Processing"
            description="Automatically process recurring payments"
            value={autoPayment}
            type="toggle"
            onChange={(v) => setAutoPayment(v as boolean)}
          />
          <SettingItem
            label="Currency"
            description="Default currency for all transactions"
            value={currency}
            type="select"
            options={['USD', 'EUR', 'GBP', 'CAD', 'AUD']}
            onChange={(v) => setCurrency(v as string)}
          />
        </SettingsSection>

        <SettingsSection title="Security">
          <SettingItem
            label="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
            value={twoFactor}
            type="toggle"
            onChange={(v) => setTwoFactor(v as boolean)}
          />
        </SettingsSection>

        {isOwner && (
          <SettingsSection title="Administrator Association">
            <div className="px-[24px] py-[20px] space-y-4">
              <div>
                <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white mb-[4px]">
                  Select Administrator
                </p>
                <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)] mb-[12px]">
                  Choose the admin you want to authorize to manage your properties.
                </p>
                <select
                  value={selectedAdminId}
                  onChange={(event) => setSelectedAdminId(event.target.value)}
                  className="bg-black border border-[rgba(255,255,255,0.16)] rounded-[8px] px-[12px] py-[10px] text-white w-full"
                >
                  <option value="" disabled>
                    Select an admin
                  </option>
                  {admins.map((admin) => (
                    <option key={admin.id} value={admin.id}>
                      {admin.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white mb-[4px]">
                  Admin Cut
                </p>
                <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)] mb-[12px]">
                  Define the percentage this admin will charge for managing your portfolio.
                </p>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={adminCut}
                  onChange={(event) => setAdminCut(event.target.value)}
                  className="bg-black border border-[rgba(255,255,255,0.16)] rounded-[8px] px-[12px] py-[10px] text-white w-full"
                />
              </div>

              {associationMessage && (
                <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-[#0DC44A]">
                  {associationMessage}
                </p>
              )}

              {associationError && (
                <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-[#FF6B6B]">
                  {associationError}
                </p>
              )}

              <button
                onClick={handleAssociateAdmin}
                disabled={!selectedAdminId || isAssociatingAdmin}
                className="bg-[#928dd3] content-stretch flex items-center justify-center px-[16px] py-[10px] relative rounded-[8px] shrink-0 hover:bg-[#7f7ab8] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-black whitespace-nowrap">
                  {isAssociatingAdmin ? 'Associating...' : 'Associate Administrator'}
                </p>
              </button>
            </div>
          </SettingsSection>
        )}

        <SettingsSection title="Regional Settings">
          <SettingItem
            label="Timezone"
            description="Set your local timezone"
            value={timezone}
            type="select"
            options={['EST', 'PST', 'CST', 'MST', 'GMT', 'CET']}
            onChange={(v) => setTimezone(v as string)}
          />
          <SettingItem
            label="Language"
            description="Choose your preferred language"
            value={language}
            type="select"
            options={['English', 'Spanish', 'French', 'German', 'Japanese']}
            onChange={(v) => setLanguage(v as string)}
          />
        </SettingsSection>

        <div className="bg-black rounded-[16px] p-[24px] w-full relative border border-[#FF6B6B]">
          <p className="font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[24px] text-[17px] text-white mb-[8px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            Danger Zone
          </p>
          <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] text-[15px] text-[rgba(255,255,255,0.6)] mb-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            Irreversible actions that affect your account
          </p>
          <button className="bg-[#FF6B6B] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[8px] hover:bg-[#ff5252] transition-colors">
            <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] text-black whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              Delete Account
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
