import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Code, 
  AlertCircle, 
  LogIn, 
  Loader2, 
  Lock, 
  Users, 
  MessageSquare 
} from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import useAuthStore from '../../store/authStore';
import { useChatSocket } from '../../hooks/useChatSocket';
import communityService from '../../api/communityService';

export const CommunityChatRoom = ({ community, isJoined, onJoinClick }) => {
  const { isAuthenticated, user } = useAuthStore();
  const [inputText, setInputText] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [codeSnippet, setCodeSnippet] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('');
  const messagesEndRef = useRef(null);

  const commIdentifier = community?._id || community?.id;
  const room = `community:${commIdentifier}`;

  const {
    messages,
    setMessages,
    onlineCount,
    isConnected,
    error: socketError,
    sendMessage,
    clearError
  } = useChatSocket(room);

  // Load history from MongoDB on mount
  useEffect(() => {
    let isMounted = true;
    const loadHistory = async () => {
      if (!commIdentifier) return;
      setLoadingHistory(true);
      try {
        const res = await communityService.getCommunityMessages(community.slug || commIdentifier);
        if (isMounted && res.success && Array.isArray(res.data)) {
          setMessages(res.data);
        }
      } catch (err) {
        console.error('Error loading community chat history:', err);
      } finally {
        if (isMounted) setLoadingHistory(false);
      }
    };

    loadHistory();
    return () => { isMounted = false; };
  }, [commIdentifier, community?.slug, setMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loadingHistory]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    if (!inputText.trim() && !codeSnippet.trim()) return;

    const payload = {
      content: inputText.trim() || 'Shared code:',
      roomType: 'community',
      communityId: commIdentifier,
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

  // If private community and user is not a member
  if (community?.isPrivate && !isJoined && user?.role !== 'admin' && community?.creator?._id !== user?._id) {
    return (
      <Card className="text-center py-14 px-6 bg-card border-[1.5px] border-borderTheme shadow-soft space-y-4">
        <div className="w-14 h-14 rounded-3xl bg-warning/15 border border-warning/25 flex items-center justify-center text-warning mx-auto text-2xl shadow-xs">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="text-base font-heading font-bold text-textPrimary">
            Private Community Chat Room
          </h3>
          <p className="text-xs text-textSecondary font-body leading-relaxed">
            Live chat messages are restricted to members of <strong>{community?.name}</strong>. Join the community to participate in discussions.
          </p>
        </div>
        {onJoinClick && (
          <div className="pt-2">
            <Button variant="primary" size="sm" onClick={onJoinClick}>
              Join Community to Chat
            </Button>
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card className="bg-card border-[1.5px] border-borderTheme shadow-medium overflow-hidden flex flex-col h-[580px] font-body">
      {/* Chat Room Header */}
      <div className="px-4 py-3 border-b border-borderTheme flex items-center justify-between gap-3 bg-surface/30 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary text-sm font-bold">
            {community?.icon || '💬'}
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-heading font-bold text-textPrimary">
              #{community?.slug || 'room'} live-chat
            </h3>
            <p className="text-[10px] text-textSecondary font-body">
              {community?.name} Discussion Room
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-warning'}`} />
          <span className="text-[11px] font-heading font-semibold text-textSecondary">
            {isConnected ? 'Live' : 'Connecting'}
          </span>
        </div>
      </div>

      {/* Socket Error Alert */}
      {socketError && (
        <div className="mx-4 mt-2 p-2 rounded-lg bg-danger/10 border border-danger/25 text-danger text-xs flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{socketError}</span>
          </div>
          <button onClick={clearError} className="text-xs font-bold underline">✕</button>
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto min-h-0">
        {loadingHistory ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2 text-textSecondary">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-xs font-heading">Loading room messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="py-16 text-center space-y-2 text-textSecondary">
            <div className="w-12 h-12 rounded-2xl bg-surface border border-borderTheme flex items-center justify-center text-xl mx-auto">
              💬
            </div>
            <h4 className="text-sm font-heading font-bold text-textPrimary">
              No live chat messages yet
            </h4>
            <p className="text-xs max-w-sm mx-auto">
              Start the discussion! Send a hello, ask an algorithm question, or share code.
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
                className={`flex items-start gap-2.5 text-xs ${isMe ? 'flex-row-reverse' : ''}`}
              >
                {msg.sender?.avatar ? (
                  <img
                    src={msg.sender.avatar}
                    alt={msg.sender?.fullName || 'User'}
                    className="w-7 h-7 rounded-full object-cover border border-borderTheme shrink-0 mt-0.5"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-[10px] shrink-0 border border-primary/20 mt-0.5">
                    {msg.sender?.fullName?.[0]?.toUpperCase() || msg.sender?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}

                <div className={`max-w-[80%] space-y-1 ${isMe ? 'text-right' : ''}`}>
                  <div className={`flex items-center gap-1.5 text-[10px] text-textSecondary ${isMe ? 'justify-end' : ''}`}>
                    <span className="font-heading font-bold text-textPrimary text-xs">
                      {msg.sender?.fullName || msg.sender?.username || 'Member'}
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

      {/* Input Box */}
      <div className="p-3.5 border-t border-borderTheme bg-surface/30 space-y-2 shrink-0">
        {showCodeInput && (
          <div className="p-3 rounded-xl bg-card border border-borderTheme space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold text-textPrimary flex items-center gap-1">
                <Code className="w-3.5 h-3.5 text-primary" />
                <span>Attach Code</span>
              </span>
              <button
                type="button"
                onClick={() => setShowCodeInput(false)}
                className="text-xs text-textSecondary hover:text-textPrimary"
              >
                ✕ Close
              </button>
            </div>
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
              title="Attach Code"
            >
              <Code className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message in ${community?.name}...`}
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
              Log in to chat with members in this community room.
            </span>
            <Button variant="primary" size="xs" onClick={() => window.location.href = '/login'}>
              Log In
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CommunityChatRoom;
