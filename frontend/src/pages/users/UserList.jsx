import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Chip, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '@/components/common/PageHeader';
import SearchBar from '@/components/common/SearchBar';
import DataTable from '@/components/common/DataTable';
import TablePagination from '@/components/common/Pagination';
import { useDebounce } from '@/hooks/useDebounce';
import { usePagination } from '@/hooks/usePagination';
import { mockUsers } from '@/utils/mockDashboard';
import { formatDate } from '@/utils/formatters';

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
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    if (!q) return mockUsers;
    return mockUsers.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q),
    );
  }, [debouncedSearch]);

  const { page, size, totalPages, setPage, setSize } = usePagination({
    totalItems: filtered.length,
  });

  const paginatedRows = filtered.slice(page * size, page * size + size);

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
      <Box sx={{ mb: 2, maxWidth: 400 }}>
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users…" />
      </Box>
      <DataTable
        columns={columns}
        rows={paginatedRows}
        onRowClick={(row) => navigate(`/users/${row.id}`)}
      />
      <TablePagination
        page={page}
        size={size}
        totalPages={totalPages}
        totalItems={filtered.length}
        onPageChange={setPage}
        onSizeChange={setSize}
      />
    </>
  );
};

export default UserList;
