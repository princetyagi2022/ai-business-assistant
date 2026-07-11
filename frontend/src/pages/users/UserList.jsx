import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Chip, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import TablePagination from '@/components/common/Pagination';
import TableToolbar from '@/components/common/TableToolbar';
import { useTableControls } from '@/hooks/useTableControls';
import { formatDate } from '@/utils/formatters';
import userService from '@/services/userService';

const columns = [
  { id: 'name', label: 'Name', render: (row) => `${row.firstName} ${row.lastName}` },
  { id: 'email', label: 'Email' },
  { id: 'role', label: 'Role', render: (row) => <Chip label={row.role.replace('ROLE_', '')} size="small" /> },
  { id: 'status', label: 'Status', render: (row) => (
    <Chip label={row.status} size="small" color={row.status === 'ACTIVE' ? 'success' : 'default'} />
  )},
  { id: 'createdAt', label: 'Created', render: (row) => formatDate(row.createdAt) },
];

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await userService.getAll();
        setUsers(Array.isArray(data) ? data : data?.items || []);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load users.');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filterConfigs = useMemo(() => [
    { id: 'role', label: 'Role', format: (value) => value.replace('ROLE_', '') },
    { id: 'status', label: 'Status' },
  ], []);
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
    rows: users,
    searchKeys: ['name', 'email', 'role', 'status'],
    filterConfigs,
    getValue: (row, key) => {
      if (key === 'name') return `${row.firstName || ''} ${row.lastName || ''}`;
      return row[key];
    },
  });

  return (
    <>
      <PageHeader
        title="Users"
        subtitle="Manage system users and roles"
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/users/create')}>
            Add user
          </Button>
        }
      />
      <TableToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search users..."
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
          <DataTable
            columns={columns}
            rows={paginatedRows}
            onRowClick={(row) => navigate(`/users/${row.id}`)}
          />
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

export default UserList;
