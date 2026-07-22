import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from '@mui/material';
import EmptyState from './EmptyState';

const DataTable = ({
  columns,
  rows = [],
  selectable = false,
  selected = [],
  onSelectAll,
  onSelectRow,
  onRowClick,
  emptyMessage = 'No data found',
  stickyHeader = true,
}) => {
  const allSelected = rows.length > 0 && selected.length === rows.length;
  const indeterminate = selected.length > 0 && selected.length < rows.length;

  if (!rows.length) {
    return <EmptyState title={emptyMessage} />;
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table stickyHeader={stickyHeader} size="small">
        <TableHead>
          <TableRow>
            {selectable && (
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={indeterminate}
                  checked={allSelected}
                  onChange={(e) => onSelectAll?.(e.target.checked)}
                />
              </TableCell>
            )}
            {columns.map((col) => (
              <TableCell key={col.id} align={col.align || 'left'} width={col.width}>
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              hover
              selected={selected.includes(row.id)}
              onClick={() => onRowClick?.(row)}
              sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {selectable && (
                <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selected.includes(row.id)}
                    onChange={() => onSelectRow?.(row.id)}
                  />
                </TableCell>
              )}
              {columns.map((col) => (
                <TableCell key={col.id} align={col.align || 'left'}>
                  {col.render ? col.render(row) : row[col.id]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
