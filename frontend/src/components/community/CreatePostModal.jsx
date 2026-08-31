import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit3,
  Eye,
  Bold,
  Italic,
  Code,
  Quote,
  Table as TableIcon,
  Link2,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import Button from '../common/Button';
import MarkdownRenderer from '../common/MarkdownRenderer';
import { POST_TYPES } from './PostTypeBadge';
import communityService from '../../api/communityService';

export const CreatePostModal = ({ isOpen, onClose, communityId, onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('Discussion');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Helper for quick formatting injection
  const insertFormatting = (prefix, suffix = '') => {
    const textarea = document.getElementById('post-markdown-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || 'text';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || title.trim().length < 5) {
      setError('Title must be at least 5 characters long.');
      return;
    }
    if (title.trim().length > 150) {
      setError('Title cannot exceed 150 characters.');
      return;
    }
    if (!content.trim() || content.trim().length < 10) {
      setError('Post content must be at least 10 characters long.');
      return;
    }
    if (content.trim().length > 10000) {
      setError('Post content cannot exceed 10,000 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        postType,
        tags
      };

      const res = await communityService.createPost(communityId, payload);
      if (res.success && res.data) {
        if (onPostCreated) onPostCreated(res.data);
        onClose();
        // Reset form
        setTitle('');
        setContent('');
        setTags([]);
        setPostType('Discussion');
      } else {
        setError(res.message || 'Failed to publish post');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while publishing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card border-[1.5px] border-borderTheme rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-borderTheme bg-surface/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold text-sm">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-heading font-bold text-textPrimary">
                Create New Post
              </h2>
              <p className="text-xs text-textSecondary font-body">
                Share insights, questions, or algorithm breakdowns with your guild.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface text-textSecondary hover:text-textPrimary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 font-body">
          {error && (
            <div className="p-3 rounded-xl bg-danger/10 border border-danger/25 text-danger text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Post Type Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-heading font-bold text-textPrimary">
              Post Type
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {POST_TYPES.map(t => {
                const Icon = t.icon;
                const isSelected = postType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setPostType(t.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-primary/15 border-primary text-primary font-bold shadow-xs'
                        : 'bg-surface hover:bg-surface/80 border-borderTheme text-textSecondary hover:text-textPrimary'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 mb-1" />
                    <span className="text-[10px] leading-tight">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-heading font-bold text-textPrimary">
                Post Title <span className="text-danger">*</span>
              </label>
              <span className="text-[10px] text-textSecondary">{title.length}/150</span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., How to optimize Dijkstra for sparse graphs with Fibonacci heaps?"
              maxLength={150}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-borderTheme focus:border-primary focus:outline-hidden text-xs sm:text-sm font-body text-textPrimary placeholder:text-textSecondary/60 transition-colors"
            />
          </div>

          {/* Content Markdown Editor */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 bg-surface p-1 rounded-lg border border-borderTheme">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`px-3 py-1 rounded-md text-xs font-heading font-bold flex items-center gap-1.5 transition-all ${
                    activeTab === 'write'
                      ? 'bg-card text-primary shadow-xs border border-borderTheme'
                      : 'text-textSecondary hover:text-textPrimary'
                  }`}
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Write</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 rounded-md text-xs font-heading font-bold flex items-center gap-1.5 transition-all ${
                    activeTab === 'preview'
                      ? 'bg-card text-primary shadow-xs border border-borderTheme'
                      : 'text-textSecondary hover:text-textPrimary'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>Preview</span>
                </button>
              </div>

              {activeTab === 'write' && (
                <div className="flex items-center gap-1 text-textSecondary">
                  <button
                    type="button"
                    onClick={() => insertFormatting('**', '**')}
                    className="p-1 rounded hover:bg-surface text-textSecondary hover:text-textPrimary"
                    title="Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('*', '*')}
                    className="p-1 rounded hover:bg-surface text-textSecondary hover:text-textPrimary"
                    title="Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('```cpp\n', '\n```')}
                    className="p-1 rounded hover:bg-surface text-textSecondary hover:text-textPrimary"
                    title="Code Block"
                  >
                    <Code className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('> ')}
                    className="p-1 rounded hover:bg-surface text-textSecondary hover:text-textPrimary"
                    title="Quote"
                  >
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n| Syntax | Description |\n| --- | --- |\n| Header | Title |\n')}
                    className="p-1 rounded hover:bg-surface text-textSecondary hover:text-textPrimary"
                    title="Table"
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('[Link Title](', ')')}
                    className="p-1 rounded hover:bg-surface text-textSecondary hover:text-textPrimary"
                    title="Link"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {activeTab === 'write' ? (
              <textarea
                id="post-markdown-textarea"
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your explanation or question in Markdown. Supports ```code blocks```, **bold**, lists, and formulas..."
                className="w-full p-3.5 rounded-xl bg-surface border border-borderTheme focus:border-primary focus:outline-hidden text-xs sm:text-sm font-mono text-textPrimary placeholder:text-textSecondary/60 transition-colors leading-relaxed resize-y"
              />
            ) : (
              <div className="min-h-[190px] p-4 rounded-xl bg-surface border border-borderTheme overflow-y-auto">
                {content.trim() ? (
                  <MarkdownRenderer content={content} />
                ) : (
                  <p className="text-xs text-textSecondary italic">
                    Nothing to preview. Type something in the Write tab!
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Tags Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-heading font-bold text-textPrimary">
              Tags (Up to 5)
            </label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-surface border border-borderTheme">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-card text-xs font-heading font-semibold text-textPrimary border border-borderTheme"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-danger text-textSecondary transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {tags.length < 5 && (
                <div className="flex items-center gap-1 min-w-[140px] flex-1">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Add tag and press Enter"
                    className="w-full bg-transparent text-xs text-textPrimary focus:outline-hidden placeholder:text-textSecondary/60"
                  />
                  {tagInput && (
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="text-xs text-primary font-bold px-1.5"
                    >
                      Add
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-borderTheme">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              className="gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Post'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
