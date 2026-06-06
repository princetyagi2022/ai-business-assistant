import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import ChatMessage from './ChatMessage';

const ChatWindow = ({ messages }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box sx={{ flex: 1, overflow: 'auto', p: 2, minHeight: 400 }}>
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} isUser={msg.role === 'user'} />
      ))}
      <div ref={bottomRef} />
    </Box>
  );
};

export default ChatWindow;
