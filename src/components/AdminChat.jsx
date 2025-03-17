import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

const AdminChat = () => {
  const {
    messages,
    customers,
    selectedCustomer,
    newMessage,
    setNewMessage,
    sendMessage,
    deleteMessage,
    fetchChatHistory,
  } = useChat();
  const { user } = useAuth();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedCustomer) {
      sendMessage(newMessage);
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Customer List Sidebar */}
      <div className="w-80 bg-white border-r shadow-sm">
        <div className="p-4 border-b bg-white">
          <h2 className="text-lg font-semibold text-gray-800">Customers</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-4rem)]">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedCustomer === customer.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
              onClick={() => fetchChatHistory(customer.id)}
            >
              <p className="font-medium text-gray-800">Customer {customer.id}</p>
              <p className="text-sm text-gray-500">{customer.username}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedCustomer ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white">
              <h2 className="text-lg font-semibold text-gray-800">Chat with Customer {selectedCustomer}</h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
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
                    <div className="flex items-center justify-between">
                      <p className="break-words">{message.content}</p>
                      {message.senderId !== user.id && (
                        <button
                          onClick={() => deleteMessage(message.id)}
                          className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
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