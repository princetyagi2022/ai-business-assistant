import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Chip, CircularProgress } from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import TablePagination from '@/components/common/Pagination';
import TableToolbar from '@/components/common/TableToolbar';
import { useTableControls } from '@/hooks/useTableControls';
import { formatCurrency } from '@/utils/formatters';
import productService from '@/services/productService';

const columns = [
  { id: 'name', label: 'Product' },
  { id: 'sku', label: 'SKU' },
  { id: 'category', label: 'Category' },
  { id: 'price', label: 'Price', render: (row) => formatCurrency(row.price) },
  { id: 'stock', label: 'Stock', render: (row) => (
    <Chip label={row.stock} size="small" color={row.stock < 50 ? 'warning' : 'default'} />
  )},
];

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productService.getAll();
        setProducts(Array.isArray(data) ? data : data?.items || []);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filterConfigs = useMemo(() => [{ id: 'category', label: 'Category' }], []);
  const {
    search,
    setSearch,
    filters,
    setFilter,
    resetFilters,
    filterOptions,
    filteredRows,
    paginatedRows,
    pagination,
  } = useTableControls({
    rows: products,
    searchKeys: ['name', 'sku', 'category', 'price', 'stock'],
    filterConfigs,
  });

  return (
    <>
      <PageHeader title="Products" subtitle="Product catalog and pricing" />
      <TableToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search products..."
        filters={filters}
        filterOptions={filterOptions}
        onFilterChange={setFilter}
        onReset={resetFilters}
      />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 260 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <DataTable columns={columns} rows={paginatedRows} />
          <TablePagination
            page={pagination.page}
            size={pagination.size}
            totalPages={pagination.totalPages}
            totalItems={filteredRows.length}
            onPageChange={pagination.setPage}
            onSizeChange={pagination.setSize}
          />
        </>
      )}
    </>
  );
};

export default ProductList;
