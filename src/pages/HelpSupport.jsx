import React, { useEffect, useState } from 'react';
import { Client } from "@stomp/stompjs";
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme === 'dark' ? '#1a1a1a' : '#ffffff'};
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
`;

const Header = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
`;

const ConnectionStatus = styled.div`
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  background-color: ${props => {
    if (props.isConnecting) return '#ffd700';
    if (props.isConnected) return '#4CAF50';
    return '#f44336';
  }};
  color: ${props => props.isConnecting ? '#000000' : '#ffffff'};
  text-align: center;
  font-weight: bold;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  border-radius: 10px;
  background-color: ${props => props.theme === 'dark' ? '#2d2d2d' : '#f5f5f5'};
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Message = styled.div`
  margin: 10px 0;
  padding: 10px 15px;
  border-radius: 15px;
  max-width: 80%;
  word-wrap: break-word;
  background-color: ${props => props.theme === 'dark' ? '#3d3d3d' : '#e3f2fd'};
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  padding: 20px;
  background-color: ${props => props.theme === 'dark' ? '#2d2d2d' : '#f5f5f5'};
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border: 2px solid ${props => props.theme === 'dark' ? '#4d4d4d' : '#e0e0e0'};
  border-radius: 25px;
  background-color: ${props => props.theme === 'dark' ? '#3d3d3d' : '#ffffff'};
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #2196F3;
  }

  &:disabled {
    background-color: ${props => props.theme === 'dark' ? '#2d2d2d' : '#f5f5f5'};
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  padding: 12px 25px;
  border: none;
  border-radius: 25px;
  background-color: #2196F3;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #1976D2;
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  margin-top: 8px;
  padding: 10px;
  border-radius: 5px;
  background-color: rgba(244, 67, 54, 0.1);
  text-align: center;
`;

const HelpSupport = () => {
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState('');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Fetch existing messages from the backend
    fetch('http://localhost:8080/api/messages')
      .then(response => response.json())
      .then(data => {
        setMessages(data);
      })
      .catch(error => {
        console.error('Error fetching messages:', error);
        setConnectionError('Failed to load previous messages');
      });

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
      setIsConnecting(false);
      setConnectionError('');
      client.subscribe("/topic/messages", (message) => {
        console.log("Received: " + message.body);
        setMessages(prev => [...prev, JSON.parse(message.body)]);
      });
    };

    client.onStompError = (frame) => {
      console.error("STOMP ERROR: ", frame);
      setIsConnected(false);
      setIsConnecting(false);
      setConnectionError(`STOMP Error: ${frame.headers?.message || 'Unknown error'}`);
    };

    client.onDisconnect = () => {
      setIsConnected(false);
      setIsConnecting(false);
      setConnectionError('Disconnected from server');
    };

    client.onWebSocketError = (error) => {
      console.error('WebSocket Error:', error);
      setIsConnecting(false);
      setConnectionError(`WebSocket Error: ${error.message || 'Failed to connect'}`);
    };

    try {
      client.activate();
      setStompClient(client);
    } catch (error) {
      console.error('Activation Error:', error);
      setIsConnecting(false);
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
      fetch('http://localhost:8080/api/messages/adddata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputMessage }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Message saved:', data);
        // Update the messages state with the new message
        setMessages(prevMessages => [...prevMessages, data]);
      })
      .catch(error => {
        console.error('Error saving message:', error);
        setConnectionError('Failed to save message');
      });

      setInputMessage('');
    } else if (!isConnected) {
      setConnectionError('Not connected to server. Please wait...');
    }
  };

  return (
    <Container theme={theme}>
      <Header theme={theme}>Help & Support</Header>
      <ConnectionStatus isConnected={isConnected} isConnecting={isConnecting}>
        Status: {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
      </ConnectionStatus>
      {connectionError && (
        <ErrorMessage>{connectionError}</ErrorMessage>
      )}
      <MessagesContainer theme={theme}>
        {messages.map((message, index) => (
          <Message key={index} theme={theme}>
            {typeof message === 'string' ? message : JSON.stringify(message)}
          </Message>
        ))}
      </MessagesContainer>
      <InputContainer theme={theme}>
        <Input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type your message..."
          disabled={!isConnected}
          theme={theme}
        />
        <SendButton onClick={sendMessage} disabled={!isConnected}>
          Send
        </SendButton>
      </InputContainer>
    </Container>
  );
};

export default HelpSupport;