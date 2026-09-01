import { useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const useChatSocket = (room) => {
  const { token, user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [onlineCount, setOnlineCount] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      auth: {
        token: token || localStorage.getItem('algoverse_token') || ''
      },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      if (room && !room.includes('undefined') && !room.includes('null')) {
        socket.emit('join_room', { room });
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('online_presence', (data) => {
      if (data && typeof data.count === 'number') {
        setOnlineCount(data.count);
      }
    });

    socket.on('new_message', (payload) => {
      if (payload && payload.message) {
        setMessages((prev) => {
          if (prev.some((m) => (m._id || m.id) === (payload.message._id || payload.message.id))) return prev;
          return [...prev, payload.message];
        });
      }
    });

    socket.on('chat_error', (err) => {
      console.warn('Socket chat_error received:', err);
      setError(err?.message || 'Chat connection error');
    });

    return () => {
      if (room && !room.includes('undefined') && !room.includes('null')) {
        socket.emit('leave_room', { room });
      }
      socket.disconnect();
    };
  }, [room, token]);

  const sendMessage = useCallback(({ content, roomType = 'global', channel = 'general', communityId = null, codeSnippet }) => {
    if (!socketRef.current || !socketRef.current.connected) {
      setError('Chat is currently disconnected. Reconnecting...');
      return false;
    }
    if (!content || !content.trim()) return false;

    socketRef.current.emit('send_message', {
      content,
      roomType,
      channel,
      communityId,
      codeSnippet
    });
    return true;
  }, []);

  return {
    messages,
    setMessages,
    onlineCount,
    isConnected,
    error,
    sendMessage,
    clearError: () => setError(null)
  };
};

export default useChatSocket;
