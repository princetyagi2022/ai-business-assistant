import DashboardIcon from '@mui/icons-material/Dashboard';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import GroupsIcon from '@mui/icons-material/Groups';
import BadgeIcon from '@mui/icons-material/Badge';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CampaignIcon from '@mui/icons-material/Campaign';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DescriptionIcon from '@mui/icons-material/Description';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PaymentIcon from '@mui/icons-material/Payment';
import StoreIcon from '@mui/icons-material/Store';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { ROLES, STAFF_ROLES, STAFF_MANAGER_ROLES } from '@/utils/constants';

// Each item may declare `roles`. When omitted, the item is visible to every
// staff role. Storefront items are restricted to ROLE_USER.
export const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: DashboardIcon, roles: STAFF_ROLES },
  { label: 'AI Agents', path: '/ai-agents', icon: SmartToyIcon, roles: STAFF_ROLES },
  { label: 'Chatbot', path: '/chatbot', icon: ChatIcon, roles: STAFF_ROLES },
  { divider: true, roles: STAFF_ROLES },
  { label: 'Lead Search', path: '/leads/search', icon: SearchIcon, roles: STAFF_ROLES },
  { label: 'Saved Leads', path: '/leads/saved', icon: BookmarkIcon, roles: STAFF_ROLES },
  { label: 'Campaigns', path: '/campaigns', icon: CampaignIcon, roles: STAFF_ROLES },
  { label: 'Analytics', path: '/analytics', icon: AnalyticsIcon, roles: STAFF_ROLES },
  { label: 'Settings', path: '/settings', icon: SettingsIcon, roles: STAFF_ROLES },
  { divider: true, roles: STAFF_ROLES },
  { label: 'Users', path: '/users', icon: PeopleIcon, roles: STAFF_MANAGER_ROLES },
  { label: 'Employees', path: '/employees', icon: BadgeIcon, roles: STAFF_MANAGER_ROLES },
  { label: 'Customers', path: '/customers', icon: GroupsIcon, roles: STAFF_ROLES },
  { label: 'Products', path: '/products', icon: InventoryIcon, roles: STAFF_ROLES },
  { label: 'Inventory', path: '/inventory', icon: WarehouseIcon, roles: STAFF_ROLES },
  { label: 'Sales', path: '/sales', icon: PointOfSaleIcon, roles: STAFF_ROLES },
  { label: 'Orders', path: '/orders', icon: ShoppingCartIcon, roles: STAFF_ROLES },
  { label: 'Finance', path: '/finance', icon: AccountBalanceIcon, roles: STAFF_MANAGER_ROLES },
  { label: 'Marketing', path: '/marketing', icon: CampaignIcon, roles: STAFF_ROLES },
  { label: 'Reports', path: '/reports', icon: AssessmentIcon, roles: STAFF_ROLES },
  { label: 'Documents', path: '/documents', icon: DescriptionIcon, roles: STAFF_ROLES },
  { label: 'Payments', path: '/payments', icon: PaymentIcon, roles: STAFF_MANAGER_ROLES },
  { divider: true, roles: STAFF_ROLES },
  { label: 'Notifications', path: '/notifications', icon: NotificationsIcon, roles: STAFF_ROLES },
  // Storefront (normal registered users)
  { label: 'Shop', path: '/shop', icon: StoreIcon, roles: [ROLES.USER] },
  { label: 'My Orders', path: '/my-orders', icon: ReceiptLongIcon, roles: [ROLES.USER] },
];

export const publicRoutes = [
  { path: '/auth/login', label: 'Login' },
  { path: '/auth/register', label: 'Register' },
  { path: '/auth/forgot-password', label: 'Forgot Password' },
  { path: '/auth/reset-password', label: 'Reset Password' },
  { path: '/auth/verify-email', label: 'Verify Email' },
];
