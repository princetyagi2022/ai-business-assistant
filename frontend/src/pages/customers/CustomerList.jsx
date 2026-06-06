import { Chip } from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { mockCustomers } from '@/utils/mockDashboard';

const columns = [
  { id: 'name', label: 'Customer' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'orders', label: 'Orders' },
  { id: 'status', label: 'Status', render: (row) => (
    <Chip label={row.status} size="small" color={row.status === 'ACTIVE' ? 'success' : 'default'} />
  )},
];

const CustomerList = () => (
  <>
    <PageHeader title="Customers" subtitle="Customer directory and engagement" />
    <DataTable columns={columns} rows={mockCustomers} />
  </>
);

export default CustomerList;
