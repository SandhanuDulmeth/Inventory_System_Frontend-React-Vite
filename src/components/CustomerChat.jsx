import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

const CustomerChat = () => {
  const {
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
  } = useChat();
  const { user } = useAuth();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white font-semibold">A</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Admin Support</h2>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === user.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.senderId === user.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 shadow-sm'
                }`}
              >
                <p className="break-words">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-lg mb-2">No messages yet</p>
              <p className="text-sm text-gray-400">Start a conversation with the admin</p>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-white shadow-sm">
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
    </div>
  );
};

export default CustomerChat; 