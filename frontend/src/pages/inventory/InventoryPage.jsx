import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Chip,
  IconButton,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Snackbar,
  Alert,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import PageHeader from '@/components/common/PageHeader';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import SearchBar from '@/components/common/SearchBar';
import inventoryService from '@/services/inventoryService';
import { formatCurrency } from '@/utils/formatters';

const InventoryPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ quantityInStock: '', reorderLevel: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryService.getAll();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(
      (r) =>
        String(r.product || '').toLowerCase().includes(term) ||
        String(r.sku || '').toLowerCase().includes(term),
    );
  }, [rows, search]);

  const startEdit = (row) => {
    setEditingId(row.id);
    setDraft({
      quantityInStock: row.quantityInStock ?? '',
      reorderLevel: row.reorderLevel ?? '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({ quantityInStock: '', reorderLevel: '' });
  };

  const saveEdit = async (row) => {
    setSaving(true);
    try {
      await inventoryService.update(row.id, {
        quantityInStock: Number(draft.quantityInStock),
        reorderLevel: Number(draft.reorderLevel),
      });
      setToast({ severity: 'success', message: `Stock updated for ${row.product}` });
      cancelEdit();
      load();
    } catch (err) {
      setToast({ severity: 'error', message: err.response?.data?.message || 'Failed to update stock' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading inventory…" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <Box>
      <PageHeader title="Inventory" subtitle="Live warehouse stock levels — edit quantities and reorder points" />

      <Box sx={{ mb: 2, maxWidth: 360 }}>
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search product or SKU…" />
      </Box>

      {filtered.length === 0 ? (
        <EmptyState title="No inventory" description="No warehouse stock records found." />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell align="right">Quantity in stock</TableCell>
                <TableCell align="right">Reorder level</TableCell>
                <TableCell align="right">Inventory value</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((row) => {
                const isEditing = editingId === row.id;
                return (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.product}</TableCell>
                    <TableCell>{row.sku}</TableCell>
                    <TableCell align="right">
                      {isEditing ? (
                        <TextField
                          size="small"
                          type="number"
                          value={draft.quantityInStock}
                          onChange={(e) => setDraft((d) => ({ ...d, quantityInStock: e.target.value }))}
                          sx={{ width: 100 }}
                        />
                      ) : (
                        row.quantityInStock
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {isEditing ? (
                        <TextField
                          size="small"
                          type="number"
                          value={draft.reorderLevel}
                          onChange={(e) => setDraft((d) => ({ ...d, reorderLevel: e.target.value }))}
                          sx={{ width: 100 }}
                        />
                      ) : (
                        row.reorderLevel
                      )}
                    </TableCell>
                    <TableCell align="right">{formatCurrency(row.inventoryValue)}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={row.status === 'LOW_STOCK' ? 'Low stock' : 'In stock'}
                        color={row.status === 'LOW_STOCK' ? 'warning' : 'success'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {isEditing ? (
                        <Stack direction="row" justifyContent="center">
                          <Tooltip title="Save">
                            <span>
                              <IconButton color="primary" disabled={saving} onClick={() => saveEdit(row)}>
                                <SaveIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Cancel">
                            <IconButton onClick={cancelEdit}>
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      ) : (
                        <Tooltip title="Edit stock">
                          <IconButton onClick={() => startEdit(row)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {toast && (
          <Alert severity={toast.severity} onClose={() => setToast(null)} variant="filled">
            {toast.message}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
};

export default InventoryPage;
