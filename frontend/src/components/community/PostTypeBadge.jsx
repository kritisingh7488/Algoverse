import React from 'react';
import { MessageSquare, HelpCircle, LifeBuoy, Code2, BookOpen, Megaphone } from 'lucide-react';

export const POST_TYPES = [
  { id: 'Discussion', label: 'Discussion', icon: MessageSquare, bg: 'bg-secondary/15 text-secondary border-secondary/25' },
  { id: 'Question', label: 'Question', icon: HelpCircle, bg: 'bg-amber-500/15 text-amber-500 border-amber-500/25' },
  { id: 'Help', label: 'Help', icon: LifeBuoy, bg: 'bg-danger/15 text-danger border-danger/25' },
  { id: 'Code', label: 'Code Solution', icon: Code2, bg: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/25' },
  { id: 'Resource', label: 'Resource', icon: BookOpen, bg: 'bg-blue-500/15 text-blue-500 border-blue-500/25' },
  { id: 'Announcement', label: 'Announcement', icon: Megaphone, bg: 'bg-primary/15 text-primary border-primary/25' }
];

export const PostTypeBadge = ({ type = 'Discussion', size = 'sm' }) => {
  const match = POST_TYPES.find(t => t.id === type) || POST_TYPES[0];
  const Icon = match.icon;

  const sizeClasses = size === 'xs'
    ? 'px-2 py-0.5 text-[10px] gap-1'
    : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span className={`inline-flex items-center rounded-full font-heading font-semibold border ${match.bg} ${sizeClasses}`}>
      <Icon className={size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{match.label}</span>
    </span>
  );
};

export default PostTypeBadge;
