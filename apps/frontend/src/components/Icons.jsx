import { 
  WrenchScrewdriverIcon, 
  MapPinIcon, 
  MapIcon,
  XMarkIcon, 
  PaperAirplaneIcon, 
  MagnifyingGlassIcon,
  CogIcon,
  ClockIcon,
  CalendarDaysIcon,
  UsersIcon,
  TagIcon,
  PencilSquareIcon,
  PlusIcon,
  CheckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  PhotoIcon,
  ChartBarIcon,
  EyeIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

export const IconWrench = ({ size = 28 }) => <WrenchScrewdriverIcon width={size} height={size} />;
export const IconGauge = () => <CogIcon width="28" height="28" />;
export const IconDisc = () => <MapIcon width="28" height="28" />;
export const IconMapPin = () => <MapPinIcon width="20" height="20" />;
export const IconClock = () => <ClockIcon width="20" height="20" />;
export const IconX = () => <XMarkIcon width="18" height="18" />;
export const IconRadar = () => <MapPinIcon width="32" height="32" />;
export const IconSend = () => <PaperAirplaneIcon width="14" height="14" />;
export const IconZoomIn = () => <MagnifyingGlassIcon width="20" height="20" />;

// Admin Icons (consistent SVG outline, zero emojis)
export const IconCalendar = ({ size = 18 }) => <CalendarDaysIcon width={size} height={size} />;
export const IconUsers = ({ size = 18 }) => <UsersIcon width={size} height={size} />;
export const IconTag = ({ size = 18 }) => <TagIcon width={size} height={size} />;
export const IconEdit = ({ size = 14 }) => <PencilSquareIcon width={size} height={size} />;
export const IconPlus = ({ size = 14 }) => <PlusIcon width={size} height={size} />;
export const IconCheck = ({ size = 14 }) => <CheckIcon width={size} height={size} />;
export const IconShield = ({ size = 14 }) => <ShieldCheckIcon width={size} height={size} />;
export const IconRefresh = ({ size = 14 }) => <ArrowPathIcon width={size} height={size} />;
export const IconBell = ({ size = 20 }) => <BellIcon width={size} height={size} />;
export const IconCurrencyDollar = ({ size = 18 }) => <CurrencyDollarIcon width={size} height={size} />;
export const IconGallery = ({ size = 18 }) => <PhotoIcon width={size} height={size} />;
export const IconLogout = ({ size = 20 }) => <ArrowRightOnRectangleIcon width={size} height={size} />;
export const IconChart = ({ size = 18 }) => <ChartBarIcon width={size} height={size} />;
export const IconEye = ({ size = 18 }) => <EyeIcon width={size} height={size} />;
