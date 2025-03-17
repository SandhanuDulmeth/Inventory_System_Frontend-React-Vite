import React, { useEffect, useState } from 'react';
import { Client } from "@stomp/stompjs";

const HelpSupport = () => {
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState('');

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new WebSocket('/ws'), 
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (str) => {
        console.log("[STOMP] ", str);
        if (str.includes('Connection closed')) {
          setConnectionError('Connection closed. Check the server status or logs.');
        }
      },
    });

    client.onConnect = (frame) => {
      console.log("Connected: " + frame);
      setIsConnected(true);
      setConnectionError('');
      client.subscribe("/topic/messages", (message) => {
        console.log("Received: " + message.body);
        setMessages(prev => [...prev, JSON.parse(message.body)]);
      });
    };

    client.onStompError = (frame) => {
      console.error("STOMP ERROR: ", frame);
      setIsConnected(false);
      setConnectionError(`STOMP Error: ${frame.headers?.message || 'Unknown error'}`);
    };

    client.onDisconnect = () => {
      setIsConnected(false);
      setConnectionError('Disconnected from server');
    };

    client.onWebSocketError = (error) => {
      console.error('WebSocket Error:', error);
      setConnectionError(`WebSocket Error: ${error.message || 'Failed to connect'}`);
    };

    try {
      client.activate();
      setStompClient(client);
    } catch (error) {
      console.error('Activation Error:', error);
      setConnectionError(`Activation Error: ${error.message}`);
    }

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, []);

  const sendMessage = () => {
    if (isConnected && inputMessage.trim()) {
      // Publish to WebSocket
      stompClient.publish({
        destination: "/app/sendMessage",
        body: JSON.stringify({ text: inputMessage }),
      });

      // Save to backend
      fetch('http://localhost:8080/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputMessage }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Message saved:', data);
      })
      .catch(error => {
        console.error('Error saving message:', error);
      });

      setInputMessage('');
    } else if (!isConnected) {
      setConnectionError('Not connected to server. Please wait...');
    }
  };

  return (
    <div className="help-support-container">
      <h1>Help &amp; Support</h1>
      <div className="connection-status">
        Status: {isConnected ? 'Connected' : 'Disconnected'}
        {connectionError && (
          <div className="error-message" style={{ color: 'red', marginTop: '8px' }}>
            {connectionError}
          </div>
        )}
      </div>
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className="message">
            {typeof message === 'string' ? message : JSON.stringify(message)}
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={!isConnected}
        />
        <button onClick={sendMessage} disabled={!isConnected}>
          Send
        </button>
      </div>
    </div>
  );
};

export default HelpSupport;