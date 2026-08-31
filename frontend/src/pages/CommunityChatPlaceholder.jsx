import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, 
  ArrowLeft, 
  Sparkles, 
  MessageSquare, 
  Hash, 
  Send, 
  ShieldCheck, 
  Users, 
  Info,
  Clock
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { GLOBAL_CHAT_PREVIEW_MESSAGES } from '../data/communityData';

export const CommunityChatPlaceholder = () => {
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [mockInput, setMockInput] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const channels = [
    { id: 'general', name: 'general', desc: 'General programming and AlgoVerse chat' },
    { id: 'dsa-help', name: 'dsa-help', desc: 'Questions on algorithm labs & trees' },
    { id: 'cp-discussions', name: 'cp-discussions', desc: 'Contest talk & time complexity tips' },
    { id: 'show-your-work', name: 'show-your-work', desc: 'Share your solved problems & benchmarks' },
  ];

  const handleSendAttempt = (e) => {
    e.preventDefault();
    if (!mockInput.trim()) return;
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 3000);
  };

  return (
    <AppLayout>
      <div className="space-y-4 py-2 max-w-6xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-heading font-semibold text-textSecondary">
            <Link to="/community" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Community Hub</span>
            </Link>
            <span>/</span>
            <span className="text-textPrimary">🌎 Global Chat</span>
          </div>

          <Badge variant="primary" size="md" className="gap-1 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Preview</span>
          </Badge>
        </div>

        {/* Global Chat Window Container */}
        <Card className="bg-card border-[1.5px] border-borderTheme shadow-medium overflow-hidden grid grid-cols-1 md:grid-cols-4 min-h-[560px]">
          
          {/* Left Channel Sidebar */}
          <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-borderTheme bg-surface/50 p-4 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 pb-2 border-b border-borderTheme">
                <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary text-sm shadow-xs">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-heading font-bold text-textPrimary">
                    Global Channels
                  </h3>
                  <p className="text-[10px] text-textSecondary font-body">AlgoVerse Network</p>
                </div>
              </div>

              {/* Channel List */}
              <div className="space-y-1">
                {channels.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChannel(ch.id)}
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

            {/* Bottom Status Info */}
            <div className="p-3 rounded-xl bg-card border border-borderTheme text-[11px] font-body text-textSecondary space-y-1">
              <div className="flex items-center gap-1.5 text-success font-heading font-semibold">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span>142 Learners Online</span>
              </div>
              <p className="text-[10px] text-textSecondary/80 leading-tight">
                Global chat channels are moderated for constructive algorithm discussion.
              </p>
            </div>
          </div>

          {/* Right Chat Main Area */}
          <div className="md:col-span-3 flex flex-col justify-between bg-card">
            
            {/* Room Header */}
            <div className="p-4 border-b border-borderTheme flex items-center justify-between gap-3 bg-surface/30">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-heading font-bold text-textPrimary">
                  {selectedChannel}
                </h3>
                <span className="text-xs text-textSecondary font-body hidden sm:inline">
                  — {channels.find(c => c.id === selectedChannel)?.desc}
                </span>
              </div>

              <Badge variant="default" size="sm" className="text-[10px]">
                Read-Only Preview
              </Badge>
            </div>

            {/* Roadmap Banner Notice */}
            <div className="mx-4 my-3 p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-2.5 text-xs text-textPrimary font-body">
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-heading font-bold text-primary">
                  Global Real-Time Chat is Coming in the Next Phase!
                </p>
                <p className="text-textSecondary text-[11px] leading-relaxed">
                  Real-time WebSockets, markdown syntax highlighting, code snippet testing, and live channels will be enabled in the upcoming community release.
                </p>
              </div>
            </div>

            {/* Sample Messages Feed */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[360px]">
              {GLOBAL_CHAT_PREVIEW_MESSAGES.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3 text-xs font-body group">
                  <img
                    src={msg.avatar}
                    alt={msg.user}
                    className="w-8 h-8 rounded-full object-cover border border-borderTheme shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-heading font-bold text-textPrimary text-xs">
                        {msg.user}
                      </span>
                      <span className="px-1.5 py-0.2 rounded-md bg-surface border border-borderTheme text-[10px] font-heading font-semibold text-textSecondary">
                        {msg.badge}
                      </span>
                      <span className="text-[10px] text-textSecondary/70">
                        {msg.time}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface/70 border border-borderTheme/70 text-textSecondary text-xs leading-relaxed inline-block max-w-xl">
                      {msg.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mock Chat Input Footer */}
            <div className="p-4 border-t border-borderTheme bg-surface/30">
              <form onSubmit={handleSendAttempt} className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={mockInput}
                  onChange={(e) => setMockInput(e.target.value)}
                  placeholder={`Message #${selectedChannel} (WebSockets coming in next phase)...`}
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-card border-[1.5px] border-borderTheme rounded-input text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-primary shadow-xs font-body"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="gap-1 px-4"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </Button>

                {showTooltip && (
                  <div className="absolute -top-10 left-4 px-3 py-1 rounded-lg bg-card text-primary border border-primary text-xs font-heading font-bold shadow-medium animate-bounce">
                    🚀 Live WebSocket chat will be activated in the next phase!
                  </div>
                )}
              </form>
            </div>

          </div>

        </Card>

      </div>
    </AppLayout>
  );
};

export default CommunityChatPlaceholder;
