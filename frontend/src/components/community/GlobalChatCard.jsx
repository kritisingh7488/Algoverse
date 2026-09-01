import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, ArrowRight, MessageSquare, Sparkles, Loader2 } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { useChatSocket } from '../../hooks/useChatSocket';
import communityService from '../../api/communityService';

export const GlobalChatCard = ({ onEnterChat }) => {
  const navigate = useNavigate();
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const { onlineCount, isConnected } = useChatSocket('global:general');

  useEffect(() => {
    let isMounted = true;
    const fetchRecent = async () => {
      setLoading(true);
      try {
        const res = await communityService.getGlobalMessages('general', 3);
        if (isMounted && res.success && Array.isArray(res.data)) {
          setRecentMessages(res.data.slice(-3));
        }
      } catch (e) {
        console.error('Error fetching global chat preview:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRecent();
    return () => { isMounted = false; };
  }, []);

  const handleEnter = () => {
    if (onEnterChat) {
      onEnterChat();
    } else {
      navigate('/community/chat');
    }
  };

  return (
    <Card className="relative overflow-hidden bg-card border-[1.5px] border-borderTheme p-5 shadow-soft hover:border-primary/50 transition-all duration-300 font-body">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-borderTheme">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary shadow-xs">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-heading font-bold text-textPrimary">
                🌎 Global Chat
              </h2>
              <Badge variant="primary" size="sm">Live</Badge>
            </div>
            <p className="text-xs text-textSecondary">
              Real-time discussion with developers across AlgoVerse.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleEnter}
          className="self-start sm:self-auto gap-1.5 shadow-soft"
        >
          <span>Open Chat Room</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Real Messages Feed Preview */}
      <div className="py-3 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-heading font-semibold text-textSecondary px-1">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3 text-secondary" />
            Live #general Feed
          </span>
          <span className="text-textSecondary/60">Live Socket.IO</span>
        </div>

        {loading ? (
          <div className="py-6 flex items-center justify-center gap-2 text-textSecondary text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span>Loading live feed...</span>
          </div>
        ) : recentMessages.length === 0 ? (
          <div className="p-4 rounded-xl bg-surface/50 border border-borderTheme text-center space-y-1">
            <p className="text-xs font-heading font-semibold text-textPrimary">
              No recent messages in #general
            </p>
            <p className="text-[11px] text-textSecondary">
              Click &quot;Open Chat Room&quot; to be the first to send a message!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentMessages.map((msg) => {
              const timeStr = msg.createdAt 
                ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Just now';

              return (
                <div
                  key={msg._id}
                  className="p-2.5 rounded-xl bg-surface/70 hover:bg-surface border border-borderTheme/70 transition-colors flex items-start gap-2.5 text-xs font-body"
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

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-heading font-bold text-textPrimary text-xs truncate">
                        {msg.sender?.fullName || msg.sender?.username || 'Learner'}
                      </span>
                      {msg.sender?.role === 'admin' && (
                        <span className="px-1.5 py-0.2 rounded-md bg-card border border-borderTheme text-[9px] font-heading font-semibold text-primary">
                          Admin
                        </span>
                      )}
                      <span className="text-[10px] text-textSecondary/70 ml-auto shrink-0">
                        {timeStr}
                      </span>
                    </div>
                    <p className="text-textSecondary text-xs leading-relaxed break-words line-clamp-2">
                      {msg.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Real Presence Info */}
      <div className="pt-2 flex items-center justify-between text-[11px] font-body text-textSecondary border-t border-borderTheme/60">
        <div className="flex items-center gap-1.5 text-success">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-warning'}`} />
          <span className="font-heading font-semibold">
            {onlineCount} {onlineCount === 1 ? 'User' : 'Users'} Online
          </span>
        </div>
        <span className="text-textSecondary/70 text-[10px]">
          Persistent MongoDB Chat
        </span>
      </div>
    </Card>
  );
};

export default GlobalChatCard;
