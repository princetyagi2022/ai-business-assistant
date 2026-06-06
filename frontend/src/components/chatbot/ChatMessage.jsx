import { Box, Paper, Typography, Avatar } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

const ChatMessage = ({ message, isUser }) => (
  <Box
    sx={{
      display: 'flex',
      gap: 1.5,
      mb: 2,
      flexDirection: isUser ? 'row-reverse' : 'row',
    }}
  >
    <Avatar sx={{ bgcolor: isUser ? 'primary.main' : 'secondary.main', width: 32, height: 32 }}>
      {isUser ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
    </Avatar>
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        maxWidth: '75%',
        bgcolor: isUser ? 'primary.main' : 'background.paper',
        color: isUser ? 'primary.contrastText' : 'text.primary',
        border: isUser ? 'none' : 1,
        borderColor: 'divider',
      }}
    >
      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
        {message.content}
      </Typography>
      <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
        {message.timestamp}
      </Typography>
    </Paper>
  </Box>
);

export default ChatMessage;
