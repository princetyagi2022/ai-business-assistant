import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Modal = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth={fullWidth}>
    {title && (
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="span">
          {title}
        </Typography>
        <IconButton aria-label="close" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
    )}
    <DialogContent dividers>{children}</DialogContent>
    {actions && <DialogActions>{actions}</DialogActions>}
  </Dialog>
);

export default Modal;
