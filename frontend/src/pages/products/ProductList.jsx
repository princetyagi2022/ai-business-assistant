import { Chip } from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { mockProducts } from '@/utils/mockDashboard';
import { formatCurrency } from '@/utils/formatters';

const columns = [
  { id: 'name', label: 'Product' },
  { id: 'sku', label: 'SKU' },
  { id: 'category', label: 'Category' },
  { id: 'price', label: 'Price', render: (row) => formatCurrency(row.price) },
  { id: 'stock', label: 'Stock', render: (row) => (
    <Chip label={row.stock} size="small" color={row.stock < 50 ? 'warning' : 'default'} />
  )},
];

const ProductList = () => (
  <>
    <PageHeader title="Products" subtitle="Product catalog and pricing" />
    <DataTable columns={columns} rows={mockProducts} />
  </>
);

export default ProductList;
