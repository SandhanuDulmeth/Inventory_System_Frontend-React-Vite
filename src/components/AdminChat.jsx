import React, { useEffect, useState,useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { useAuth } from '../context/AuthContext';

const AdminChat = () => {
  const [customers, setCustomers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState('');
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  // 1) Fetch initial list of customers who have messages
  useEffect(() => {
    fetch('http://localhost:8080/customers')
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error('Error loading customers:', err));
  }, []);

  // 2) Enhanced STOMP client setup with connection status
  useEffect(() => {
    if (!user || !(user.role === 'ADMIN')) return;

    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      debug: (str) => console.log('Admin STOMP:', str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('Admin STOMP connected');
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionError('');
        setStompClient(client);

        client.subscribe('/topic/messages', (message) => {
          const receivedData = JSON.parse(message.body);
          
          // Handle deletion by ID (number)
          if (typeof receivedData === 'number') {
            const deletedMessageId = receivedData;
            setMessages(prev => prev.filter(msg => msg.id !== deletedMessageId));
            return;
          }
          
          // Handle message updates/additions
          const newMsg = receivedData;
          if (newMsg.customerId === selectedCustomer) {
            setMessages(prev => {
              const existingIndex = prev.findIndex(m => m.id === newMsg.id);
              if (existingIndex !== -1) {
                // Update existing message
                const updatedMessages = [...prev];
                updatedMessages[existingIndex] = newMsg;
                return updatedMessages;
              } else {
                // Add new message
                return [...prev, newMsg];
              }
            });
          }
        });
      },
   
      onStompError: (frame) => {
        console.error('Admin STOMP error', frame);
        setIsConnected(false);
        setIsConnecting(false);
        setConnectionError('Connection error: ' + (frame.headers?.message || 'Unknown error'));
      },
      onWebSocketError: (evt) => {
        console.error('Admin WebSocket error', evt);
        setIsConnected(false);
        setIsConnecting(false);
        setConnectionError('WebSocket error: Failed to connect to server');
      },
      onDisconnect: () => {
        setIsConnected(false);
        setIsConnecting(false);
        setConnectionError('Disconnected from server');
      }
    });

    client.activate();

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [user, selectedCustomer]);

  // 3) Enhanced chat history fetch with subscription management
  const fetchChatHistory = (customerId) => {
    setSelectedCustomer(customerId);
    
    fetch(`http://localhost:8080/chat/${customerId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data || []))
      .catch((err) => console.error('Error fetching chat history:', err));
  };
  // 4) Enhanced message sending with status checks
  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedCustomer || !stompClient?.connected) return;

    const messageData = {
      customerId: selectedCustomer,
      content: newMessage.trim(),
      user: 'ADMIN'
    };

    stompClient.publish({
      destination: '/app/chat',
      body: JSON.stringify(messageData)
    });

    setNewMessage('');
  };
  // 5) Correct delete message implementation via STOMP
  const deleteMessage = (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    // Send delete command via STOMP
    if (stompClient?.connected) {
      stompClient.publish({
        destination: '/app/message/delete',
        body: JSON.stringify(messageId)
      });
      // Optimistic UI update
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } else {
      console.error('Cannot delete message: STOMP client not connected');
    }
  };
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  // Modified message rendering
  const renderMessage = (message) => {
    const isAdminMessage = message.user?.toUpperCase() === 'ADMIN';
    const isCustomerMessage = !isAdminMessage;
    
    return (
      <div
        key={message.id}
        className={`flex ${isCustomerMessage ? 'justify-start' : 'justify-end'}`}
      >
        <div
          className={`max-w-[70%] rounded-lg p-3 relative ${
            isCustomerMessage
              ? 'bg-white text-gray-800 shadow-sm'
              : 'bg-blue-500 text-white'
          }`}
        >
          <div className="text-sm font-medium mb-1">
            {isCustomerMessage ? 'Customer' : 'Admin'}
          </div>
          <p className="break-words">{message.content}</p>
          <button
            onClick={() => deleteMessage(message.id)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs"
          >
            Delete
          </button>
          <p className="text-xs mt-1 opacity-70">
            {new Date(message.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    );
  };
 
  // Modified chat area JSX
  return (
    <div className="flex h-full bg-gray-50">
      {/* Customer List Sidebar */}
      {/* <div className="w-80 bg-white border-r shadow-sm"> */}
      <div className="w-80 bg-white border-r shadow-sm flex flex-col">
      <div className="p-4 border-b bg-white flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-gray-800">Customers</h2>
          {/* Added Connection Status */}
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnecting
                  ? 'bg-yellow-500 animate-pulse'
                  : isConnected
                  ? 'bg-green-500'
                  : 'bg-red-500'
              }`}
            />
            <span
              className={`text-sm font-medium ${
                isConnecting
                  ? 'text-yellow-600'
                  : isConnected
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {isConnecting
                ? 'Connecting...'
                : isConnected
                ? 'Connected'
                : 'Disconnected'}
            </span>
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-4rem)]">
          {customers.map((custEmail) => (
            <div
              key={custEmail}
              className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedCustomer === custEmail
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : ''
              }`}
              onClick={() => fetchChatHistory(custEmail)}
            >
              <p className="font-medium text-gray-800">Customer {custEmail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedCustomer ? (
          <>
            <div className="p-4 border-b bg-white">
              <h2 className="text-lg font-semibold text-gray-800">
                Chat with Customer {selectedCustomer}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => renderMessage(message))}
              <div ref={messagesEndRef} />
           </div>
           
            <form onSubmit={sendMessage} className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
            <div className="text-center">
              <p className="text-lg mb-2">Select a customer to start chatting</p>
              <p className="text-sm text-gray-400">Choose from the list on the left</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
