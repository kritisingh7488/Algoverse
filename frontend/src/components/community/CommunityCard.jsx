import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Globe, Lock, Check, Plus, ShieldCheck, ArrowUpRight, Clock, Send } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import communityService from '../../api/communityService';
import useAuthStore from '../../store/authStore';

export const CommunityCard = ({
  community,
  isJoined = false,
  onToggleJoin
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [isRequested, setIsRequested] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const commTarget = community?.slug || community?._id || community?.id;

  const handleCardClick = (e) => {
    // If clicking on the Join button, do not navigate
    if (e.target.closest('.join-action-button')) return;
    if (commTarget) {
      navigate(`/community/${commTarget}`);
    }
  };

  const handleJoinClick = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // If private community and not joined, submit Join Request
    if (community?.isPrivate && !isJoined) {
      if (isRequested) {
        // Cancel request
        setIsRequesting(true);
        try {
          await communityService.cancelJoinRequest(commTarget);
          setIsRequested(false);
        } catch (err) {
          console.error('Error cancelling join request:', err);
        } finally {
          setIsRequesting(false);
        }
        return;
      }

      setIsRequesting(true);
      try {
        const res = await communityService.sendJoinRequest(commTarget);
        if (res.success) {
          setIsRequested(true);
        }
      } catch (err) {
        console.error('Error requesting to join:', err);
      } finally {
        setIsRequesting(false);
      }
      return;
    }

    if (onToggleJoin && commTarget) {
      onToggleJoin(commTarget);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between p-4 sm:p-5 bg-card border-[1.5px] border-borderTheme hover:border-primary/60 shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Top Header Row */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          {/* Avatar / Icon & Category */}
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${community.gradient || 'from-primary/20 to-secondary/20'} border border-borderTheme flex items-center justify-center text-2xl shadow-xs shrink-0 group-hover:scale-105 transition-transform`}>
              {community.icon || '💬'}
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-base font-heading font-bold text-textPrimary group-hover:text-primary transition-colors line-clamp-1">
                  {community.name}
                </h3>
                {community.isVerified && (
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0" title="Verified Community" />
                )}
              </div>

              <div className="flex items-center gap-2 mt-0.5 text-xs text-textSecondary font-body">
                <Badge variant="default" size="sm" className="text-[10px] font-heading font-bold">
                  {community.category}
                </Badge>
                <span className="flex items-center gap-1 text-[11px] text-textSecondary">
                  {community.isPrivate ? (
                    <>
                      <Lock className="w-3 h-3 text-warning" />
                      <span>Private</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-3 h-3 text-success" />
                      <span>Public</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Corner Arrow Icon */}
          <div className="p-1.5 rounded-lg bg-surface opacity-0 group-hover:opacity-100 text-textSecondary group-hover:text-primary transition-all">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-textSecondary font-body line-clamp-2 leading-relaxed">
          {community.description}
        </p>

        {/* Tags */}
        {community.tags && community.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {community.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-surface/90 text-[10px] font-heading font-semibold text-textSecondary border border-borderTheme/60"
              >
                #{tag}
              </span>
            ))}
            {community.tags.length > 3 && (
              <span className="text-[10px] font-heading text-textSecondary/70 self-center">
                +{community.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Details: Members Count & Join Action Button */}
      <div className="pt-3.5 mt-3.5 border-t border-borderTheme/70 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-textSecondary font-heading font-semibold">
          <Users className="w-3.5 h-3.5 text-secondary" />
          <span>{(community.membersCount || 0).toLocaleString()} members</span>
        </div>

        <button
          onClick={handleJoinClick}
          disabled={isRequesting}
          aria-label={
            isJoined 
              ? `Leave ${community.name}` 
              : community.isPrivate 
                ? (isRequested ? 'Cancel Request' : `Request to Join ${community.name}`)
                : `Join ${community.name}`
          }
          className={`join-action-button px-3.5 py-1.5 rounded-button text-xs font-heading font-bold flex items-center gap-1.5 transition-all shadow-xs ${
            isJoined
              ? 'bg-surface text-textPrimary hover:bg-danger/10 hover:text-danger hover:border-danger/30 border border-borderTheme'
              : community.isPrivate
                ? (isRequested
                    ? 'bg-warning/15 text-warning border border-warning/30 hover:bg-danger/10 hover:text-danger'
                    : 'bg-warning/90 hover:bg-warning text-black shadow-soft')
                : 'bg-primary hover:bg-primary-hover text-white shadow-soft shadow-primary/20'
          }`}
        >
          {isJoined ? (
            <>
              <Check className="w-3.5 h-3.5 text-success" />
              <span>Joined</span>
            </>
          ) : community.isPrivate ? (
            isRequested ? (
              <>
                <Clock className="w-3.5 h-3.5 text-warning" />
                <span>Requested</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Request to Join</span>
              </>
            )
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Join</span>
            </>
          )}
        </button>
      </div>
    </Card>
  );
};

export default CommunityCard;
