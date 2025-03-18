import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    // Early return if no user or not a CUSTOMER
    if (!user?.email || user.role !== 'CUSTOMER') {
      console.log('Invalid user data or not a customer, skipping connection setup');
      setIsConnecting(false);
      setIsConnected(false);
      setConnectionError('Please log in as a customer to access the support chat.');
      return;
    }

    console.log('Setting up chat for customer:', user.email);

    // Fetch existing messages
    fetch(`http://localhost:8080/api/customer/messages/${encodeURIComponent(user.email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.status);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched messages:', data);
        setMessages(data || []);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
        setConnectionError('Failed to connect to server. Please try again later.');
      });

    // Set up STOMP over WebSocket
    const wsUrl = 'ws://localhost:8080/ws';
    console.log('Setting up WebSocket connection to:', wsUrl);

    const client = new Client({
      brokerURL: wsUrl,
      debug: function (str) {
        console.log('STOMP:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: function (frame) {
        console.log('STOMP Connected:', frame);
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionError('');

        // Subscribe to a topic for this customer's email
        this.subscribe(`/topic/messages/${user.email}`, (message) => {
          console.log('Received message:', message);
          try {
            const receivedMsg = JSON.parse(message.body);
            setMessages((prev) => [...prev, receivedMsg]);
          } catch (err) {
            console.error('Error parsing message:', err);
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

    try {
      console.log('Activating STOMP client...');
      client.activate();
      setStompClient(client);
    } catch (error) {
      console.error('Error activating client:', error);
      setIsConnecting(false);
      setConnectionError('Failed to connect: ' + error.toString());
    }

    // Cleanup on unmount
    return () => {
      if (client.active) {
        console.log('Cleaning up WebSocket connection...');
        client.deactivate();
      }
    };
  }, [user]);

  const sendMessage = () => {
    if (!isConnected) {
      setConnectionError('Not connected to server. Please wait...');
      return;
    }

    if (!inputMessage.trim() || !user?.email) {
      return;
    }

    const messageData = {
      customerId: user.email,
      content: inputMessage.trim(),
      timestamp: new Date().getTime(),
      userType: 'CUSTOMER' // Added userType field
    };

    // Send via WebSocket (if connected)
    if (stompClient?.active) {
      stompClient.publish({
        destination: '/app/chat',
        body: JSON.stringify(messageData)
      });
    }

    // Also save via REST API
    fetch('http://localhost:8080/api/customer/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(messageData)
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to save message');
        return response.json();
      })
      .then((savedMessage) => {
        console.log('Message saved:', savedMessage);
        setMessages((prev) => [...prev, savedMessage]);
        setInputMessage('');
      })
      .catch((error) => {
        console.error('Error saving message:', error);
        setConnectionError('Failed to send message. Please try again.');
      });
  };

  const checkConnection = () => {
    if (isConnected) {
      alert('We are still connected to the server!');
    } else {
      alert('We are not connected to the server right now.');
    }
  };

  const handleEditMessage = (messageId, content) => {
    setEditingMessageId(messageId);
    setEditingContent(content);
  };

  const saveEditedMessage = async (messageId) => {
    if (!editingContent.trim()) return;

    try {
      const response = await fetch(`http://localhost:8080/api/customer/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          customerId: user.email,
          content: editingContent.trim(),
          timestamp: new Date().getTime()
        })
      });

      if (!response.ok) throw new Error('Failed to update message');

      const updatedMessage = await response.json();
      setMessages(messages.map((msg) => (msg.id === messageId ? updatedMessage : msg)));
      setEditingMessageId(null);
      setEditingContent('');
    } catch (error) {
      console.error('Error updating message:', error);
      setConnectionError('Failed to update message. Please try again.');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`http://localhost:8080/api/customer/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to delete message');

      setMessages(messages.filter((msg) => msg.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      setConnectionError('Failed to delete message. Please try again.');
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
          className={`max-w-[80%] rounded-lg p-3 relative group ${
            isCustomerMessage
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
                  onClick={() => saveEditedMessage(msg.id)}
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
                    onClick={() => handleEditMessage(msg.id, msg.content)}
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
