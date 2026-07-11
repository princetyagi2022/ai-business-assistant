import DashboardIcon from '@mui/icons-material/Dashboard';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
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

export const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
  { label: 'AI Agents', path: '/ai-agents', icon: SmartToyIcon },
  { label: 'Chatbot', path: '/chatbot', icon: ChatIcon },
  { divider: true },
  { label: 'Lead Search', path: '/leads/search', icon: SearchIcon },
  { label: 'Saved Leads', path: '/leads/saved', icon: BookmarkIcon },
  { label: 'Campaigns', path: '/campaigns', icon: CampaignIcon },
  { label: 'Analytics', path: '/analytics', icon: AnalyticsIcon },
  { label: 'Settings', path: '/settings', icon: SettingsIcon },
  { divider: true },
  { label: 'Users', path: '/users', icon: PeopleIcon },
  { label: 'Employees', path: '/employees', icon: BadgeIcon },
  { label: 'Customers', path: '/customers', icon: GroupsIcon },
  { label: 'Products', path: '/products', icon: InventoryIcon },
  { label: 'Inventory', path: '/inventory', icon: WarehouseIcon },
  { label: 'Sales', path: '/sales', icon: PointOfSaleIcon },
  { label: 'Orders', path: '/orders', icon: ShoppingCartIcon },
  { label: 'Finance', path: '/finance', icon: AccountBalanceIcon },
  { label: 'Marketing', path: '/marketing', icon: CampaignIcon },
  { label: 'Reports', path: '/reports', icon: AssessmentIcon },
  { label: 'Documents', path: '/documents', icon: DescriptionIcon },
  { divider: true },
  { label: 'Notifications', path: '/notifications', icon: NotificationsIcon },
];

export const publicRoutes = [
  { path: '/auth/login', label: 'Login' },
  { path: '/auth/register', label: 'Register' },
  { path: '/auth/forgot-password', label: 'Forgot Password' },
  { path: '/auth/reset-password', label: 'Reset Password' },
  { path: '/auth/verify-email', label: 'Verify Email' },
];
