import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { toastError, toastSuccess } from '../utils/Toast';

const SOCKET_URL = `wss://ayna-backend-1.onrender.com`;
const STRAPI_API_URL = 'https://hopeful-miracle-e4784cb5a7.strapiapp.com/api/messages';
const STRAPI_API_TOKEN = process.env.REACT_APP_STRAPI_API_TOKEN;

const WebSocketClient = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [messagesPerPage] = useState(7);
  const navigate = useNavigate();

  const logout = () => {
    Cookies.remove('token');
    navigate('/login');
    toastSuccess('Logout successful.');
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(STRAPI_API_URL, {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
      });
      const fetchedMessages = response.data.data.map((msg) => msg.attributes.text);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages from Strapi:', error);
      toastError('Error fetching messages from Strapi.');
    }
  };

  const saveMessageToStrapi = async (newMessage) => {
    try {
      await axios.post(
        STRAPI_API_URL,
        {
          data: {
            text: newMessage,
            sender: 'User',
            timestamp: new Date(),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          },
        }
      );
    } catch (error) {
      console.error('Error saving message to Strapi:', error);
    }
  };

  useEffect(() => {
    fetchMessages();

    const socket = new WebSocket(SOCKET_URL);

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    socket.onmessage = (event) => {
      console.log('Received:', event.data);
      setMessages((prevMessages) => [...prevMessages, event.data]);
      saveMessageToStrapi(event.data);
    };

    socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws && message.trim() !== '') {
      ws.send(message);
      setMessage('');
    }
  };


  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);


  const nextPage = () => {
    if (currentPage < Math.ceil(messages.length / messagesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="mt-5 max-w-lg mx-auto p-5 border border-gray-300 rounded-lg bg-white">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-5">WebSocket Chat</h2>

      <div className="flex items-center gap-4 mb-5">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button 
          onClick={sendMessage}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
        >
          Send
        </button>
      </div>

      <div className="mb-5">
        <h3 className="text-lg font-medium text-gray-800">Messages:</h3>
        <ul className="list-none mt-3 space-y-2">
          {currentMessages.map((msg, index) => (
            <li key={index} className="px-4 py-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-700">
              {msg}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between">
        <button 
          onClick={prevPage}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300"
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <button 
          onClick={() => setMessages([])}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
        >
          Clear Messages
        </button>

        <button 
          onClick={nextPage}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300"
          disabled={currentPage === Math.ceil(messages.length / messagesPerPage)}
        >
          Next
        </button>
      </div>

      <button 
        onClick={logout}
        className="mt-5 w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Logout
      </button>
    </div>
  );
};

export default WebSocketClient;
