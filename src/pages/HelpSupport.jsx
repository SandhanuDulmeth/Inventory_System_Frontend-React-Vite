import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  useEffect(() => {
    // Fetch message history
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/messages');
        const data = await response.json();
        setMessages(data.map(msg => msg.content));
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    const newSocket = io('http://localhost:9092', {
      transports: ['websocket'],
      reconnectionAttempts: 3,
      path: '/socket.io',
      forceNew: true,
      query: {
          EIO: "3",
          transport: "websocket"
      },
      extraHeaders: {
          "Cross-Origin-Opener-Policy": "same-origin-allow-popups"
      }
  });
    // Add error listener in React component
    newSocket.on('connect_error', (error) => {
      console.error('Connection Error:', error);
    });
    // Add detailed error listeners
    newSocket.on('connect_error', (error) => {
      console.error('Connection Error:', error.message);
      console.debug('Error details:', error);
  });

  newSocket.on('connect_timeout', (timeout) => {
      console.error('Connection Timeout:', timeout);
  });

  newSocket.on('reconnect_failed', () => {
      console.error('Permanent Connection Failure');
  });
    newSocket.on('error', (error) => {
      console.error('Socket Error:', error);
    });
    newSocket.on('connect', () => {
      setConnectionStatus('connected');
      console.log('Socket.IO connected');
    });

    newSocket.on('disconnect', () => {
      setConnectionStatus('disconnected');
      console.log('Socket.IO disconnected');
    });

    newSocket.on('message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() && socket) {
      socket.emit('message', message.trim());
      setMessage('');
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="text-sm mb-2">
          Status: <span className={`font-bold ${connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'
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
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;