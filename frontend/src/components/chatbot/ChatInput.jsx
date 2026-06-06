import { useState } from 'react';
import { Box, TextField, IconButton, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatInput = ({ onSend, disabled }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} elevation={2} sx={{ p: 1, display: 'flex', gap: 1 }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Ask the AI assistant…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        multiline
        maxRows={4}
      />
      <IconButton type="submit" color="primary" disabled={disabled || !text.trim()}>
        <SendIcon />
      </IconButton>
    </Paper>
  );
};

export default ChatInput;
