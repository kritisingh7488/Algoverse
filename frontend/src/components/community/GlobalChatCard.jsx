import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, ArrowRight, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { GLOBAL_CHAT_PREVIEW_MESSAGES } from '../../data/communityData';

export const GlobalChatCard = ({ onEnterChat }) => {
  const navigate = useNavigate();

  const handleEnter = () => {
    if (onEnterChat) {
      onEnterChat();
    } else {
      navigate('/community/chat');
    }
  };

  return (
    <Card className="relative overflow-hidden bg-card border-[1.5px] border-borderTheme p-5 shadow-soft hover:border-primary/50 transition-all duration-300">
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
              <Badge variant="primary" size="sm">Live Hub</Badge>
            </div>
            <p className="text-xs text-textSecondary font-body">
              Talk with learners and developers across AlgoVerse.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleEnter}
          className="self-start sm:self-auto gap-1.5 shadow-soft"
        >
          <span>Enter Global Chat</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Realistic Chat Messages Preview */}
      <div className="py-3 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-heading font-semibold text-textSecondary px-1">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3 text-secondary" />
            Recent Global Snippets
          </span>
          <span className="text-textSecondary/60">Read-Only Preview</span>
        </div>

        <div className="space-y-2">
          {GLOBAL_CHAT_PREVIEW_MESSAGES.map((msg) => (
            <div
              key={msg.id}
              className="p-2.5 rounded-xl bg-surface/70 hover:bg-surface border border-borderTheme/70 transition-colors flex items-start gap-2.5 text-xs font-body"
            >
              <img
                src={msg.avatar}
                alt={msg.user}
                className="w-7 h-7 rounded-full object-cover border border-borderTheme shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-heading font-bold text-textPrimary text-xs truncate">
                    {msg.user}
                  </span>
                  <span className="px-1.5 py-0.2 rounded-md bg-card border border-borderTheme text-[10px] font-heading font-semibold text-textSecondary">
                    {msg.badge}
                  </span>
                  <span className="text-[10px] text-textSecondary/70 ml-auto shrink-0">
                    {msg.time}
                  </span>
                </div>
                <p className="text-textSecondary text-xs leading-relaxed break-words">
                  {msg.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info Notice */}
      <div className="pt-2 flex items-center justify-between text-[11px] font-body text-textSecondary border-t border-borderTheme/60">
        <div className="flex items-center gap-1.5 text-success">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="font-heading font-semibold">142 Developers Online</span>
        </div>
        <span className="text-textSecondary/70 text-[10px]">
          Full real-time rooms arriving in Next Release
        </span>
      </div>
    </Card>
  );
};

export default GlobalChatCard;
