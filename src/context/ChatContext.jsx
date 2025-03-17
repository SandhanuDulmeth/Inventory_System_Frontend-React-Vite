import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();

  // Fetch customers list for admin
  const fetchCustomers = async () => {
    if (user?.role === 'ADMIN') {
      try {
        const response = await fetch('http://localhost:8080/api/admin/customers', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch customers');
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    }
  };

  // Fetch chat history
  const fetchChatHistory = async (customerId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/chat/${customerId}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch chat history');
      const data = await response.json();
      setMessages(data);
      setSelectedCustomer(customerId);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  // Send message
  const sendMessage = async (message) => {
    try {
      const response = await fetch('http://localhost:8080/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          content: message,
          senderId: user.id,
          receiverId: user.role === 'ADMIN' ? selectedCustomer : 1, // Admin ID is 1
        }),
      });
      if (!response.ok) throw new Error('Failed to send message');
      const newMessage = await response.json();
      setMessages(prev => [...prev, newMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Delete message (admin only)
  const deleteMessage = async (messageId) => {
    if (user?.role !== 'ADMIN') return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/admin/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (!response.ok && response.status !== 204) throw new Error('Failed to delete message');
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  // Load initial data
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchCustomers();
    } else if (user?.role === 'CUSTOMER') {
      fetchChatHistory(user.id);
    }
  }, [user]);

  return (
    <ChatContext.Provider value={{
      messages,
      customers,
      selectedCustomer,
      newMessage,
      setNewMessage,
      sendMessage,
      deleteMessage,
      fetchChatHistory,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 