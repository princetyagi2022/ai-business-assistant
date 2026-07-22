import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert, Box, Button, Chip, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, IconButton, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import TablePagination from '@/components/common/Pagination';
import TableToolbar from '@/components/common/TableToolbar';
import { useTableControls } from '@/hooks/useTableControls';
import { formatDate } from '@/utils/formatters';
import userService from '@/services/userService';
import api from '@/services/api';

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAll();
      setUsers(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await userService.remove(deleteTarget.id);
      setDeleteTarget(null);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = async () => {
    try {
      const { data } = await api.get('/dashboard/export-users');
      const csv = data?.data?.csv || '';
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users_export.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('Failed to export users.');
    }
  };

  const columns = useMemo(() => [
    { id: 'name', label: 'Name', render: (row) => `${row.firstName} ${row.lastName}` },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone', render: (row) => row.phone || '—' },
    { id: 'role', label: 'Role', render: (row) => <Chip label={row.role?.replace('ROLE_', '') || '—'} size="small" /> },
    { id: 'status', label: 'Status', render: (row) => (
      <Chip label={row.status} size="small" color={row.status === 'ACTIVE' ? 'success' : 'default'} />
    )},
    { id: 'createdAt', label: 'Created', render: (row) => formatDate(row.createdAt) },
    {
      id: 'actions', label: 'Actions', width: 120,
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5 }} onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => navigate(`/users/${row.id}/edit`)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => setDeleteTarget(row)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ], [navigate]);

  const filterConfigs = useMemo(() => [
    { id: 'role', label: 'Role', format: (value) => value?.replace('ROLE_', '') },
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
    searchKeys: ['name', 'email', 'role', 'status', 'phone'],
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
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={handleExport}>
              Export CSV
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/users/create')}>
              Add user
            </Button>
          </Box>
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

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{deleteTarget?.firstName} {deleteTarget?.lastName}</strong>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserList;
