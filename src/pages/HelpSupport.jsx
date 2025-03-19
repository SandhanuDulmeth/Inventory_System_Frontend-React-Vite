import React, { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { useAuth } from '../context/AuthContext';

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
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user?.email || user.role !== 'CUSTOMER') {
      console.log('Invalid user data or not a customer, skipping connection setup');
      setIsConnecting(false);
      setIsConnected(false);
      setConnectionError('Please log in as a customer to access the support chat.');
      return;
    }
    console.log('Setting up chat for customer:', user.email);

    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:8080/chat/${encodeURIComponent(user.email)}`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        const data = await response.json();
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setConnectionError('Failed to load chat history');
      }
    };

    fetchMessages();

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
            // Handle deletion
            const deletedId = receivedData;
            setMessages(prev => prev.filter(msg => msg.id !== deletedId));
            return;
          }
          
          if (receivedData.id && receivedData.customerId) {
            const receivedMsg = receivedData;
            if (receivedMsg.customerId === user.email) {
              setMessages(prev => {
                const existingIndex = prev.findIndex(m => m.id === receivedMsg.id);
                if (existingIndex !== -1) {
                  return prev.map(m => m.id === receivedMsg.id ? receivedMsg : m);
                } else {
                  return [...prev, receivedMsg];
                }
              });
            }
          }
        });
      },
      onStompError: function (frame) {
        console.error('STOMP error:', frame);
        setIsConnected(false);
        setIsConnecting(false);
        setConnectionError(
          'Connection error: ' + (frame.headers?.message || 'Unknown error')
        );
      },
      onWebSocketError: function (event) {
        console.error('WebSocket error:', event);
        setIsConnected(false);
        setIsConnecting(false);
        setConnectionError('WebSocket error: Failed to connect to server');
      },
      onDisconnect: function () {
        console.log('STOMP Disconnected');
        setIsConnected(false);
        setIsConnecting(false);
        setConnectionError('Disconnected from server');
      }
    });

    client.activate();
    setStompClient(client);

    return () => client.deactivate();
  }, [user]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const startEditing = (messageId, content) => {
    setEditingMessageId(messageId);
    setEditingContent(content);
  };

  const sendMessage = () => {
    if (!isConnected || !inputMessage.trim() || !user?.email) return;

    const messageDTO = {
      customerId: user.email,
      content: inputMessage.trim(),
      user: 'CUSTOMER'
    };

    stompClient.publish({
      destination: '/app/chat',
      body: JSON.stringify(messageDTO)
    });

    setInputMessage('');
  };

  const handleEditMessage = async () => {
    if (!editingContent.trim()) return;

    try {
      const messageDTO = {
        id: editingMessageId,
        customerId: user.email,
        content: editingContent.trim(),
        user: 'CUSTOMER'
      };

      stompClient.publish({
        destination: '/app/chat/update',
        body: JSON.stringify(messageDTO)
      });

      setEditingMessageId(null);
      setEditingContent('');
    } catch (error) {
      console.error('Error updating message:', error);
      setConnectionError('Failed to update message');
    }
  };

  const handleDeleteMessage = (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    // Send delete command via WebSocket
    stompClient.publish({
      destination: '/app/message/delete',
      body: JSON.stringify(messageId)
    });

    // Optimistic UI update
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const checkConnection = () => {
    if (stompClient) {
      if (stompClient.connected) {
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionError('');
      } else {
        setIsConnected(false);
        setIsConnecting(true);
        setConnectionError('Reconnecting...');
        stompClient.activate();
      }
    }
  };

  useEffect(() => {
    console.log('Connection state updated:', {
      isConnected,
      isConnecting,
      connectionError
    });
  }, [isConnected, isConnecting, connectionError]);

  const renderMessage = (msg) => {
    const isCustomerMessage = msg.user?.toUpperCase() === 'CUSTOMER';
    const isAdminMessage = !isCustomerMessage;

    return (
      <div
        key={msg.id || Math.random()}
        className={`flex ${isCustomerMessage ? 'justify-start' : 'justify-end'}`}
      >
        <div
          className={`max-w-[80%] rounded-lg p-3 relative group ${isCustomerMessage
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
              : 'bg-blue-500 text-white'
            }`}
        >
          <div className="text-sm font-medium mb-1">
            {isCustomerMessage ? 'Customer' : 'Admin'}
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
                  onClick={() => handleEditMessage(msg.id)}
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
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(msg.id)}
                    className="p-1 rounded bg-red-600 hover:bg-red-700 text-white"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
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
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="border-b dark:border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-semibold">A</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold dark:text-white">Admin Support</h2>
              {user?.email && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customer ID: {user.email}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <div
                  className={`w-3 h-3 rounded-full ${isConnecting
                    ? 'bg-yellow-500 animate-pulse'
                    : isConnected
                      ? 'bg-green-500'
                      : 'bg-red-500'
                    }`}
                />
                <span
                  className={`text-sm font-medium ${isConnecting
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : isConnected
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                    }`}
                >
                  {isConnecting
                    ? 'Connecting to server...'
                    : isConnected
                      ? `Connected - ${user?.email || 'Unknown'}`
                      : 'Disconnected - Offline'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={checkConnection}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isConnecting
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                : isConnected
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                } dark:bg-opacity-20 dark:hover:bg-opacity-30`}
            >
              {isConnecting
                ? 'Connecting...'
                : isConnected
                  ? 'Connection Healthy'
                  : 'Reconnect Now'}
            </button>
          </div>
        </div>
        {connectionError && (
          <div className="bg-red-100 text-red-800 px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 dark:bg-red-900 dark:text-red-100">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{connectionError}</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <h3 className="text-lg font-medium">No messages yet</h3>
            <p className="text-sm">Start a conversation with the admin</p>
            {user?.email && (
              <p className="text-sm mt-2">Logged in as: {user.email}</p>
            )}
          </div>
        ) : (
          messages.map((msg) => renderMessage(msg))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t dark:border-gray-700 p-4">
        <div className="flex gap-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              isConnected
                ? `Press SHIFT+Enter for a new line. Enter sends the message.`
                : 'Waiting for connection...'
            }
            disabled={!isConnected}
            className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none min-h-[44px] max-h-32"
            onKeyDown={(e) => {
              // ENTER sends if SHIFT not pressed, SHIFT+ENTER adds a newline
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            rows={1}
            style={{ overflow: 'hidden', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}
            onInput={(e) => {
              // Auto-resize textarea based on content
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!isConnected}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${isConnected
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