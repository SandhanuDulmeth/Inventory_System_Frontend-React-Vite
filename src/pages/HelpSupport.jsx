import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  useEffect(() => {
    // Fetch existing messages from the correct GET endpoint
    fetch('http://localhost:8080/api/messages')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      return response.json();
    })
    .then(data => {
      if (Array.isArray(data)) {
        setMessages(data.map(msg => msg.content));
      }
    })
    .catch(error => console.error('Error:', error));
    
    // Connect to the correct WebSocket endpoint
    const client = new Client({
      brokerURL: 'ws://localhost:8080/chat', // Not used with SockJS, but kept for reference
      webSocketFactory: () => new SockJS('http://localhost:8080/chat'), // 👈 Correct SockJS URL
      debug: (str) => console.debug('STOMP:', str), // 👈 Add debug logs
      onConnect: () => {
        setConnectionStatus('connected');
        client.subscribe('/topic/messages', (messageOutput) => {
          setMessages((prevMessages) => [...prevMessages, messageOutput.body]);
        });
      },
      onDisconnect: () => {
        setConnectionStatus('disconnected');
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
        setConnectionStatus('error');
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    try {
      client.activate();
      setStompClient(client);
    } catch (error) {
      console.error('Error activating STOMP client:', error);
      setConnectionStatus('error');
    }

    // Cleanup on unmount
    return () => {
      if (stompClient) {
        try {
          stompClient.deactivate();
        } catch (error) {
          console.error('Error deactivating STOMP client:', error);
        }
      }
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() && stompClient && connectionStatus === 'connected') {
      try {
        stompClient.publish({
          destination: '/app/sendMessage',
          body: message
        });
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="text-sm mb-2">
          Status: <span className={`font-bold ${
            connectionStatus === 'connected' ? 'text-green-600' : 
            connectionStatus === 'error' ? 'text-red-600' : 'text-yellow-600'
          }`}>{connectionStatus}</span>
        </div>
        <div className="border rounded p-4 h-64 overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <p key={index} className="mb-2">{msg}</p>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
            placeholder="Type your message..."
            disabled={connectionStatus !== 'connected'}
          />
          <button
            onClick={sendMessage}
            disabled={connectionStatus !== 'connected'}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
