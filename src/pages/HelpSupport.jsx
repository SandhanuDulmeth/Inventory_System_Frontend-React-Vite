import React, { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const HelpSupport = () => {
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState('');
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const messagesEndRef = useRef(null);
  const [customerId, setCustomerId] = useState(null);
  const customerIdRef = useRef();
  customerIdRef.current = customerId;

  useEffect(() => {
    if (!user?.email || user.role !== 'CUSTOMER') {
      console.log('Invalid user data, skipping connection setup');
      setIsConnecting(false);
      setIsConnected(false);
      setConnectionError('Please log in as a customer to access support chat.');
      return;
    }

    const fetchCustomerAndMessages = async () => {
      try {
        const idResponse = await fetch(
          `http://localhost:8080/CustomerIdByEmail?email=${encodeURIComponent(user.email)}`
        );
        if (!idResponse.ok) throw new Error('Failed to fetch customer ID');
        const customerId = await idResponse.json();
        setCustomerId(customerId);

        const messagesResponse = await fetch(
          `http://localhost:8080/chat/${customerId}`
        );
        if (!messagesResponse.ok) throw new Error('Failed to fetch messages');
        const messagesData = await messagesResponse.json();
        setMessages(messagesData || []);
      } catch (error) {
        console.error('Error:', error);
        setConnectionError('Failed to load chat data');
      }
    };

    fetchCustomerAndMessages();

    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      debug: (str) => console.log('STOMP:', str),
      reconnectDelay: 5000,
      onConnect: () => {
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionError('');

        client.subscribe('/topic/messages', (message) => {
          const receivedData = JSON.parse(message.body);
          
          if (typeof receivedData === 'number') {
            setMessages(prev => prev.filter(msg => msg.id !== receivedData));
            return;
          }
          if (receivedData.id && receivedData.customerId) {
            setMessages(prev => {
              
              const existingIndex = prev.findIndex(m => 
                (m.id === receivedData.id) || 
                (m.isOptimistic && m.content === receivedData.content)
              );
              
              if (existingIndex !== -1) {
                return prev.map(m => 
                  (m.id === receivedData.id || m.isOptimistic) ? receivedData : m
                );
              }
              return [...prev, receivedData];
            });
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
        setIsConnected(false);
        setIsConnecting(false);
        setConnectionError('Connection error: ' + (frame.headers?.message || 'Unknown error'));
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error:', event);
        setIsConnected(false);
        setIsConnecting(false);
        setConnectionError('WebSocket connection failed');
      },
      onDisconnect: () => {
        setIsConnected(false);
        setIsConnecting(false);
        setConnectionError('Disconnected from server');
      }
    });

    client.activate();
    setStompClient(client);

    return () => client.deactivate();
  }, [user, customerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!isConnected || !inputMessage.trim() || !customerId) return;

    const tempId = Date.now(); 
    const optimisticMessage = {
      id: tempId,
      customerId: customerId,
      content: inputMessage.trim(),
      senderType: 'CUSTOMER',
      timestamp: new Date().getTime(),
      isOptimistic: true
    };

        
        setMessages(prev => [...prev, optimisticMessage]);
        setInputMessage('');

    const messageDTO = {
      customerId: customerId,
      content: inputMessage.trim(),
      senderType: 'CUSTOMER'
    };

    stompClient.publish({
      destination: '/app/chat',
      body: JSON.stringify(messageDTO)
    });

    setInputMessage('');
  };

  const startEditing = (messageId, content) => {
    setEditingMessageId(messageId);
    setEditingContent(content);
  };

  const handleEditMessage = () => {
    if (!editingContent.trim()) return;

    const originalMessage = messages.find(msg => msg.id === editingMessageId);
    if (!originalMessage) return;

   const messageDTO = {
      id: editingMessageId,
      customerId: originalMessage.customerId,
      content: editingContent.trim(),
      senderType: 'CUSTOMER',
      timestamp: originalMessage.timestamp
    };

    stompClient.publish({
      destination: '/app/chat/update',
      body: JSON.stringify(messageDTO)
    });

    setEditingMessageId(null);
    setEditingContent('');
  };

  const handleDeleteMessage = (messageId) => {
    if (!window.confirm('Delete this message permanently?')) return;
    stompClient.publish({
      destination: '/app/message/delete',
      body: JSON.stringify(messageId)
    });
  };

  const checkConnection = () => {
    if (stompClient && !stompClient.connected) {
      stompClient.activate();
    }
  };

  const renderMessage = (msg) => {
    const isCustomerMessage = msg.senderType === 'CUSTOMER';

    return (
      <div key={msg.id} className={`flex ${isCustomerMessage ? 'justify-start' : 'justify-end'}`}>
        <div className={`max-w-[80%] rounded-lg p-3 relative group ${
          isCustomerMessage
            ? isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'
            : 'bg-blue-500 text-white'
        }`}>
          <div className="text-sm font-medium mb-1">
            {isCustomerMessage ? 'You' : 'Admin'}
          </div>

          {editingMessageId === msg.id ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                className="px-2 py-1 rounded border text-black w-full"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleEditMessage}
                  className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingMessageId(null)}
                  className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
              <div className="text-xs opacity-75 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>

              {isCustomerMessage && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button
                    onClick={() => startEditing(msg.id, msg.content)}
                    className="p-1 rounded bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(msg.id)}
                    className="p-1 rounded bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-col h-screen ${isDark ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-900'}`}>
      <div className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-semibold">A</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Admin Support</h2>
              {user?.email && (
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {customerId ? `Customer ID: ${customerId}` : `Email: ${user.email}`}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-3 h-3 rounded-full ${
                  isConnecting ? 'bg-yellow-500 animate-pulse' :
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className={`text-sm font-medium ${
                  isConnecting ? (isDark ? 'text-yellow-400' : 'text-yellow-600') :
                  isConnected ? (isDark ? 'text-green-400' : 'text-green-600') :
                  (isDark ? 'text-red-400' : 'text-red-600')
                }`}>
                  {isConnecting ? 'Connecting...' :
                   isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={checkConnection}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              isConnecting ? (isDark ? 'bg-yellow-200 text-yellow-800' : 'bg-yellow-100 text-yellow-800') :
              isConnected ? (isDark ? 'bg-green-200 text-green-800' : 'bg-green-100 text-green-800') :
              (isDark ? 'bg-red-200 text-red-800' : 'bg-red-100 text-red-800')
            }`}
          >
            {isConnecting ? 'Connecting' : isConnected ? 'Connected' : 'Reconnect'}
          </button>
        </div>
        {connectionError && (
          <div className={`px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 ${
            isDark ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-800'
          }`}>
            <span>{connectionError}</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className={`flex flex-col items-center justify-center h-full ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <h3 className="text-lg font-medium">No messages yet</h3>
            <p className="text-sm">Start a conversation with the admin</p>
          </div>
        ) : (
          messages.map(renderMessage)
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
        <div className="flex gap-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isConnected ? "Type your message..." : "Connecting..."}
            disabled={!isConnected}
            className={`flex-1 px-4 py-2 rounded-lg border resize-none min-h-[44px] max-h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
              isDark ? 'bg-gray-800 text-white border-gray-600' : 'bg-white border-gray-300 text-black'
            }`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            rows={1}
          />
          <button
            onClick={sendMessage}
            disabled={!isConnected || !inputMessage.trim()}
            className={`px-6 py-2 rounded-full font-medium ${
              isConnected && inputMessage.trim()
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;