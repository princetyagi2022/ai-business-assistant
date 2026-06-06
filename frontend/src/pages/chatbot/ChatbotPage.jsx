import { useState, useCallback } from 'react';
import { Box, Card, Typography, Alert } from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import ChatWindow from '@/components/chatbot/ChatWindow';
import ChatInput from '@/components/chatbot/ChatInput';
import chatbotService from '@/services/chatbotService';
import dayjs from 'dayjs';

const welcomeMessage = {
  id: 'welcome',
  role: 'assistant',
  content: 'Hello! I am your AI business assistant. Ask me about sales, inventory, customers, or reports.',
  timestamp: dayjs().format('h:mm A'),
};

const ChatbotPage = () => {
  const [messages, setMessages] = useState([welcomeMessage]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const sessionId = 'session-default';

  const handleSend = useCallback(async (text) => {
    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: dayjs().format('h:mm A'),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError('');

    try {
      const response = await chatbotService.sendMessage(text, sessionId);
      const reply = response?.reply ?? response?.message ?? 'I received your message, but no response text was returned.';
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: reply,
          timestamp: dayjs().format('h:mm A'),
        },
      ]);
    } catch {
      setError('Unable to reach the chatbot service. Please make sure the ML API is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <PageHeader title="AI Chatbot" subtitle="Conversational assistant for business queries" />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Card sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 220px)', maxHeight: 700 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" color="text.secondary">
            Business Assistant · Online
          </Typography>
        </Box>
        <ChatWindow messages={messages} />
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <ChatInput onSend={handleSend} disabled={loading} />
        </Box>
      </Card>
    </>
  );
};

export default ChatbotPage;
