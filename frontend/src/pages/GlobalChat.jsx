import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Globe, 
  ArrowLeft, 
  Hash, 
  Send, 
  Code, 
  Users, 
  AlertCircle,
  LogIn,
  Loader2,
  CheckCircle,
  Clock
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import MarkdownRenderer from '../components/common/MarkdownRenderer';
import useAuthStore from '../store/authStore';
import { GLOBAL_CHANNELS } from '../data/communityData';
import { useChatSocket } from '../hooks/useChatSocket';
import communityService from '../api/communityService';

export const GlobalChat = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [inputText, setInputText] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [codeLanguage, setCodeLanguage] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const messagesEndRef = useRef(null);

  const room = `global:${selectedChannel}`;
  const {
    messages,
    setMessages,
    onlineCount,
    isConnected,
    error: socketError,
    sendMessage,
    clearError
  } = useChatSocket(room);

  // Fetch initial history from MongoDB when channel changes
  useEffect(() => {
    let isMounted = true;
    const loadHistory = async () => {
      setLoadingHistory(true);
      try {
        const res = await communityService.getGlobalMessages(selectedChannel);
        if (isMounted && res.success && Array.isArray(res.data)) {
          setMessages(res.data);
        }
      } catch (err) {
        console.error('Error loading chat history:', err);
      } finally {
        if (isMounted) setLoadingHistory(false);
      }
    };

    loadHistory();
    return () => { isMounted = false; };
  }, [selectedChannel, setMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loadingHistory]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!inputText.trim() && !codeSnippet.trim()) return;

    const payload = {
      content: inputText.trim() || 'Shared a code snippet:',
      roomType: 'global',
      channel: selectedChannel,
      codeSnippet: codeSnippet.trim() ? { language: codeLanguage || 'cpp', code: codeSnippet.trim() } : undefined
    };

    const sent = sendMessage(payload);
    if (sent) {
      setInputText('');
      setCodeSnippet('');
      setCodeLanguage('');
      setShowCodeInput(false);
    }
  };

  const currentChannelInfo = GLOBAL_CHANNELS.find(c => c.id === selectedChannel) || GLOBAL_CHANNELS[0];

  return (
    <AppLayout>
      <div className="space-y-4 py-2 max-w-6xl mx-auto font-body pb-6">
        
        {/* Navigation & Presence Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-heading font-semibold text-textSecondary">
            <Link to="/community" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Community Hub</span>
            </Link>
            <span>/</span>
            <span className="text-textPrimary">🌎 Global Live Chat</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-borderTheme text-xs font-heading font-semibold text-textSecondary">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-warning'}`} />
              <span>{onlineCount} Online</span>
            </div>
          </div>
        </div>

        {/* Global Chat Container */}
        <Card className="bg-card border-[1.5px] border-borderTheme shadow-medium overflow-hidden grid grid-cols-1 md:grid-cols-4 min-h-[600px] max-h-[82vh]">
          
          {/* Channel Sidebar */}
          <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-borderTheme bg-surface/50 p-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 pb-2 border-b border-borderTheme">
                <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary text-sm shadow-xs">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-heading font-bold text-textPrimary">
                    Global Channels
                  </h3>
                  <p className="text-[10px] text-textSecondary">Live Network</p>
                </div>
              </div>

              {/* Channel List */}
              <div className="space-y-1">
                {GLOBAL_CHANNELS.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setSelectedChannel(ch.id);
                      clearError();
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-heading font-semibold transition-all text-left ${
                      selectedChannel === ch.id
                        ? 'bg-card text-primary shadow-xs border border-borderTheme font-bold'
                        : 'text-textSecondary hover:text-textPrimary hover:bg-surface'
                    }`}
                  >
                    <Hash className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{ch.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Socket Status Footer */}
            <div className="p-3 rounded-xl bg-card border border-borderTheme text-[11px] text-textSecondary space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-heading font-semibold text-textPrimary">Socket Status</span>
                <span className={`text-[10px] font-bold ${isConnected ? 'text-success' : 'text-warning'}`}>
                  {isConnected ? '● Connected' : 'Connecting...'}
                </span>
              </div>
              <p className="text-[10px] text-textSecondary/80 leading-tight">
                Real-time messages persist to MongoDB.
              </p>
            </div>
          </div>

          {/* Right Chat Main Feed */}
          <div className="md:col-span-3 flex flex-col justify-between bg-card min-h-[500px]">
            
            {/* Room Header */}
            <div className="px-4 py-3 border-b border-borderTheme flex items-center justify-between gap-3 bg-surface/30">
              <div className="flex items-center gap-2 min-w-0">
                <Hash className="w-4 h-4 text-primary shrink-0" />
                <h3 className="text-sm font-heading font-bold text-textPrimary truncate">
                  {currentChannelInfo.name}
                </h3>
                <span className="text-xs text-textSecondary font-body hidden sm:inline truncate">
                  — {currentChannelInfo.desc}
                </span>
              </div>

              <span className="text-[10px] text-textSecondary font-mono shrink-0">
                #{selectedChannel}
              </span>
            </div>

            {/* Socket Error Alert */}
            {socketError && (
              <div className="mx-4 mt-3 p-2.5 rounded-lg bg-danger/10 border border-danger/25 text-danger text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{socketError}</span>
                </div>
                <button onClick={clearError} className="text-xs font-bold underline">Dismiss</button>
              </div>
            )}

            {/* Messages Feed */}
            <div className="flex-1 p-4 space-y-3.5 overflow-y-auto max-h-[52vh]">
              {loadingHistory ? (
                <div className="py-16 flex flex-col items-center justify-center gap-2 text-textSecondary">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="text-xs font-heading">Loading channel messages...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="py-16 text-center space-y-2 text-textSecondary">
                  <div className="w-12 h-12 rounded-2xl bg-surface border border-borderTheme flex items-center justify-center text-xl mx-auto">
                    💬
                  </div>
                  <h4 className="text-sm font-heading font-bold text-textPrimary">
                    No messages in #{selectedChannel} yet
                  </h4>
                  <p className="text-xs max-w-sm mx-auto">
                    Be the first to say hello, share an algorithm problem, or ask for help!
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = user && msg.sender?._id === user._id;
                  const timeFormatted = msg.createdAt 
                    ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                    : 'Just now';

                  return (
                    <div
                      key={msg._id || Math.random()}
                      className={`flex items-start gap-2.5 text-xs group ${isMe ? 'flex-row-reverse' : ''}`}
                    >
                      {/* Avatar */}
                      {msg.sender?.avatar ? (
                        <img
                          src={msg.sender.avatar}
                          alt={msg.sender?.fullName || 'User'}
                          className="w-7 h-7 rounded-full object-cover border border-borderTheme shrink-0 mt-0.5"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-[11px] shrink-0 border border-primary/20 mt-0.5">
                          {msg.sender?.fullName?.[0]?.toUpperCase() || msg.sender?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}

                      {/* Message Content Bubble */}
                      <div className={`max-w-[80%] space-y-1 ${isMe ? 'text-right' : ''}`}>
                        <div className={`flex items-center gap-1.5 text-[10px] text-textSecondary ${isMe ? 'justify-end' : ''}`}>
                          <span className="font-heading font-bold text-textPrimary text-xs">
                            {msg.sender?.fullName || msg.sender?.username || 'Learner'}
                          </span>
                          {msg.sender?.role === 'admin' && (
                            <span className="px-1 py-0.2 rounded bg-primary/15 text-primary text-[9px] font-bold">
                              Admin
                            </span>
                          )}
                          <span>{timeFormatted}</span>
                        </div>

                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed text-left inline-block ${
                            isMe
                              ? 'bg-primary text-white rounded-tr-xs'
                              : 'bg-surface border border-borderTheme text-textPrimary rounded-tl-xs'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.content}</p>

                          {/* Embedded Code Snippet */}
                          {msg.codeSnippet && msg.codeSnippet.code && (
                            <div className="mt-2 pt-2 border-t border-white/20">
                              <span className="text-[10px] opacity-80 uppercase font-mono">
                                {msg.codeSnippet.language || 'code'}
                              </span>
                              <pre className="p-2 rounded bg-black/40 text-[11px] font-mono overflow-x-auto mt-1">
                                <code>{msg.codeSnippet.code}</code>
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Section */}
            <div className="p-3.5 border-t border-borderTheme bg-surface/30 space-y-2">
              {showCodeInput && (
                <div className="p-3 rounded-xl bg-card border border-borderTheme space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-heading font-bold text-textPrimary flex items-center gap-1">
                      <Code className="w-3.5 h-3.5 text-primary" />
                      <span>Attach Code Snippet</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCodeInput(false)}
                      className="text-xs text-textSecondary hover:text-textPrimary"
                    >
                      ✕ Close
                    </button>
                  </div>
                  <input
                    type="text"
                    value={codeLanguage}
                    onChange={(e) => setCodeLanguage(e.target.value)}
                    placeholder="Language (e.g. cpp, python, javascript)"
                    className="w-full px-3 py-1.5 rounded-lg bg-surface border border-borderTheme text-xs text-textPrimary focus:outline-hidden focus:border-primary"
                  />
                  <textarea
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    placeholder="Paste your code snippet here..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-borderTheme text-xs font-mono text-textPrimary focus:outline-hidden focus:border-primary"
                  />
                </div>
              )}

              {isAuthenticated ? (
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCodeInput(prev => !prev)}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      showCodeInput
                        ? 'bg-primary/20 border-primary text-primary'
                        : 'bg-card border-borderTheme text-textSecondary hover:text-textPrimary hover:bg-surface'
                    }`}
                    title="Attach Code Snippet"
                  >
                    <Code className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Message #${selectedChannel}...`}
                    className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-card border-[1.5px] border-borderTheme rounded-xl text-textPrimary placeholder:text-textSecondary/50 focus:outline-hidden focus:border-primary shadow-xs"
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="gap-1 px-4 shrink-0"
                    disabled={!inputText.trim() && !codeSnippet.trim()}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Send</span>
                  </Button>
                </form>
              ) : (
                <div className="p-3 rounded-xl bg-surface border border-borderTheme flex items-center justify-between gap-3 text-xs">
                  <span className="text-textSecondary">
                    You are in read-only mode. Log in to join the conversation.
                  </span>
                  <Link to="/login">
                    <Button variant="primary" size="xs" className="gap-1">
                      <LogIn className="w-3 h-3" />
                      <span>Log In</span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>

          </div>

        </Card>

      </div>
    </AppLayout>
  );
};

export default GlobalChat;
