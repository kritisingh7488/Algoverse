import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Lock, Sparkles, CheckCircle2, AlertCircle, Eye } from 'lucide-react';
import { COMMUNITY_CATEGORIES, EMOJI_PRESETS, saveCreatedCommunity } from '../../data/communityData';
import useAuthStore from '../../store/authStore';
import communityService from '../../api/communityService';
import Button from '../common/Button';
import Badge from '../common/Badge';

export const CreateCommunityModal = ({ isOpen, onClose, onCommunityCreated }) => {
  const categoriesList = COMMUNITY_CATEGORIES.filter(c => c !== 'All');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('DSA');
  const [icon, setIcon] = useState('⚡');
  const [isPrivate, setIsPrivate] = useState(false);
  const [rulesText, setRulesText] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setCategory('DSA');
      setIcon('⚡');
      setIsPrivate(false);
      setRulesText('');
      setErrors({});
      setIsSubmitting(false);
      setShowSuccessToast(false);
    }
  }, [isOpen]);

  const validateForm = () => {
    const errs = {};
    const trimmedName = name.trim();
    const trimmedDesc = description.trim();

    if (!trimmedName) {
      errs.name = 'Community name is required.';
    } else if (trimmedName.length < 3) {
      errs.name = 'Community name must be at least 3 characters.';
    } else if (trimmedName.length > 40) {
      errs.name = 'Community name cannot exceed 40 characters.';
    }

    if (!trimmedDesc) {
      errs.description = 'Description is required.';
    } else if (trimmedDesc.length < 10) {
      errs.description = 'Description must be at least 10 characters.';
    } else if (trimmedDesc.length > 250) {
      errs.description = 'Description cannot exceed 250 characters.';
    }

    if (!category) {
      errs.category = 'Please select a category.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const parsedRules = rulesText
      .split('\n')
      .map(r => r.trim())
      .filter(r => r.length > 0);

    const payload = {
      name: name.trim(),
      description: description.trim(),
      category: category,
      icon: icon || '⚡',
      gradient: 'from-primary/20 to-secondary/20',
      accentColor: '#FF8A80',
      isPrivate: isPrivate,
      tags: [category, 'New Guild', 'Community'],
      about: description.trim(),
      rules: parsedRules.length > 0 ? parsedRules : [
        'Be respectful and helpful to all members.',
        'Format code snippets properly.',
        'Share knowledge and learn together.'
      ]
    };

    try {
      const res = await communityService.createCommunity(payload);
      const created = res.data;

      setShowSuccessToast(true);

      setTimeout(() => {
        if (onCommunityCreated) {
          onCommunityCreated(created);
        }
        onClose();
      }, 600);
    } catch (err) {
      console.error('Error creating community:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-2xl bg-card rounded-dialog border-[1.5px] border-borderTheme shadow-large overflow-hidden z-10 my-auto font-body"
          >
            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-4 border-b border-borderTheme flex items-center justify-between bg-cardAccent/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary text-base shadow-xs">
                  ✨
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-bold text-textPrimary">
                    Create New Community
                  </h3>
                  <p className="text-xs text-textSecondary font-body">
                    Start a study group or algorithmic discussion guild
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-textSecondary hover:text-textPrimary hover:bg-surface border border-transparent hover:border-borderTheme transition-all"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* Name & Icon Row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* Icon Selector */}
                <div className="sm:col-span-1 space-y-1.5">
                  <label className="block text-xs font-heading font-bold text-textPrimary">
                    Guild Icon
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-11 h-11 rounded-xl bg-surface border-[1.5px] border-borderTheme flex items-center justify-center text-2xl shadow-xs">
                      {icon}
                    </div>
                  </div>
                  {/* Preset Emoji Chips */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {EMOJI_PRESETS.slice(0, 8).map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setIcon(emoji)}
                        className={`w-6 h-6 rounded-md text-xs flex items-center justify-center transition-all ${
                          icon === emoji
                            ? 'bg-primary/20 border border-primary text-primary scale-110'
                            : 'hover:bg-surface border border-transparent'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Community Name */}
                <div className="sm:col-span-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-heading font-bold text-textPrimary">
                      Community Name <span className="text-primary">*</span>
                    </label>
                    <span className="text-[10px] text-textSecondary">{name.length}/40</span>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Graph Masters, DP Daily Practice..."
                    className={`w-full px-3.5 py-2 text-sm bg-surface border-[1.5px] rounded-input text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:bg-card shadow-xs transition-all ${
                      errors.name ? 'border-danger focus:border-danger' : 'border-borderTheme focus:border-primary'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-danger flex items-center gap-1 font-heading font-semibold">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-heading font-bold text-textPrimary">
                    Description <span className="text-primary">*</span>
                  </label>
                  <span className="text-[10px] text-textSecondary">{description.length}/250</span>
                </div>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this community about? What topics will members solve and discuss?"
                  className={`w-full px-3.5 py-2 text-sm bg-surface border-[1.5px] rounded-input text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:bg-card shadow-xs transition-all resize-none ${
                    errors.description ? 'border-danger focus:border-danger' : 'border-borderTheme focus:border-primary'
                  }`}
                />
                {errors.description && (
                  <p className="text-[11px] text-danger flex items-center gap-1 font-heading font-semibold">
                    <AlertCircle className="w-3 h-3" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Category & Privacy Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category Selection */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-heading font-bold text-textPrimary">
                    Primary Category <span className="text-primary">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-surface border-[1.5px] border-borderTheme rounded-input text-textPrimary focus:outline-none focus:border-primary focus:bg-card shadow-xs transition-all"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Privacy Toggle */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-heading font-bold text-textPrimary">
                    Privacy Setting
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPrivate(false)}
                      className={`p-2 rounded-xl border text-xs font-heading font-bold flex items-center justify-center gap-1.5 transition-all ${
                        !isPrivate
                          ? 'bg-primary/15 border-primary text-primary shadow-xs'
                          : 'bg-surface border-borderTheme text-textSecondary hover:text-textPrimary'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Public</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPrivate(true)}
                      className={`p-2 rounded-xl border text-xs font-heading font-bold flex items-center justify-center gap-1.5 transition-all ${
                        isPrivate
                          ? 'bg-primary/15 border-primary text-primary shadow-xs'
                          : 'bg-surface border-borderTheme text-textSecondary hover:text-textPrimary'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Private</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Community Rules (Optional) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-heading font-bold text-textPrimary">
                  Community Rules <span className="text-textSecondary text-[10px] font-normal">(Optional, 1 rule per line)</span>
                </label>
                <textarea
                  rows={2}
                  value={rulesText}
                  onChange={(e) => setRulesText(e.target.value)}
                  placeholder="1. Be polite and helpful&#10;2. Format all code snippets&#10;3. Explain your approach"
                  className="w-full px-3.5 py-2 text-xs bg-surface border-[1.5px] border-borderTheme rounded-input text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-primary focus:bg-card shadow-xs transition-all resize-none"
                />
              </div>

              {/* Live Preview Snippet Card */}
              {name.trim() && (
                <div className="p-3 rounded-xl bg-cardAccent/50 border border-borderTheme space-y-1.5">
                  <div className="flex items-center gap-1 text-[11px] font-heading font-bold text-textSecondary">
                    <Eye className="w-3 h-3 text-primary" />
                    <span>Live Card Preview:</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{icon}</span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-heading font-bold text-textPrimary truncate">{name}</h4>
                      <p className="text-[10px] text-textSecondary truncate">{description || 'No description yet'}</p>
                    </div>
                    <Badge variant="primary" size="sm" className="ml-auto shrink-0 text-[9px]">
                      {category}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Form Buttons */}
              <div className="pt-3 border-t border-borderTheme flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  className="min-w-[140px]"
                >
                  {showSuccessToast ? (
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      Created!
                    </span>
                  ) : (
                    'Create Community'
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateCommunityModal;
