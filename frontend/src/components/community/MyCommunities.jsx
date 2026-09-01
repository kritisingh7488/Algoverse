import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, UserPlus, Users, Plus, Mail, Check, X, Loader2 } from 'lucide-react';
import CommunityCard from './CommunityCard';
import Button from '../common/Button';
import Card from '../common/Card';
import communityService from '../../api/communityService';

export const MyCommunities = ({
  communities = [],
  joinedIds = [],
  onToggleJoin,
  onExploreClick,
  onCreateClick,
  isAuthenticated = true
}) => {
  const [invitations, setInvitations] = useState([]);
  const [invitationsLoading, setInvitationsLoading] = useState(false);
  const [processingInviteId, setProcessingInviteId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;
    const fetchInvites = async () => {
      setInvitationsLoading(true);
      try {
        const res = await communityService.getMyInvitations();
        if (isMounted && res.success && Array.isArray(res.data)) {
          setInvitations(res.data);
        }
      } catch (err) {
        console.error('Error fetching invitations:', err);
      } finally {
        if (isMounted) setInvitationsLoading(false);
      }
    };
    fetchInvites();
    return () => { isMounted = false; };
  }, [isAuthenticated]);

  const handleAcceptInvite = async (invitationId) => {
    setProcessingInviteId(invitationId);
    try {
      const res = await communityService.acceptInvitation(invitationId);
      if (res.success) {
        setInvitations(prev => prev.filter(inv => inv._id !== invitationId));
        if (onToggleJoin && res.data?.slug) {
          onToggleJoin(res.data.slug);
        }
      }
    } catch (err) {
      console.error('Error accepting invitation:', err);
    } finally {
      setProcessingInviteId(null);
    }
  };

  const handleDeclineInvite = async (invitationId) => {
    setProcessingInviteId(invitationId);
    try {
      const res = await communityService.declineInvitation(invitationId);
      if (res.success) {
        setInvitations(prev => prev.filter(inv => inv._id !== invitationId));
      }
    } catch (err) {
      console.error('Error declining invitation:', err);
    } finally {
      setProcessingInviteId(null);
    }
  };

  const myJoinedList = communities.filter(c => 
    c.isJoined || 
    joinedIds.includes(c.id) || 
    joinedIds.includes(c._id) || 
    joinedIds.includes(c.slug)
  );

  // If not logged in
  if (!isAuthenticated) {
    return (
      <Card className="text-center py-12 px-6 bg-card border-[1.5px] border-borderTheme shadow-soft space-y-4">
        <div className="w-14 h-14 rounded-3xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary mx-auto text-2xl shadow-xs">
          👤
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="text-lg font-heading font-bold text-textPrimary">
            Track Your Study Guilds
          </h3>
          <p className="text-xs sm:text-sm text-textSecondary font-body leading-relaxed">
            Log in to join study groups, follow daily DSA challenges, and collaborate with peer developers.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          <Link to="/login">
            <Button variant="primary" size="md">
              Log In to AlgoVerse
            </Button>
          </Link>
          <Button variant="outline" size="md" onClick={onExploreClick}>
            Explore Public Communities
          </Button>
        </div>
      </Card>
    );
  }

  // If logged in but 0 joined communities
  if (myJoinedList.length === 0) {
    return (
      <Card className="text-center py-12 px-6 bg-card border-[1.5px] border-borderTheme shadow-soft space-y-4">
        <div className="w-14 h-14 rounded-3xl bg-secondary/15 border border-secondary/25 flex items-center justify-center text-secondary mx-auto text-2xl shadow-xs">
          🌱
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="text-lg font-heading font-bold text-textPrimary">
            You're not part of any communities yet.
          </h3>
          <p className="text-xs sm:text-sm text-textSecondary font-body leading-relaxed">
            Discover active algorithmic study groups or create your own custom guild to learn and solve problems together!
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          <Button variant="primary" size="md" onClick={onExploreClick} className="gap-1.5">
            <Compass className="w-4 h-4" />
            <span>Explore Communities</span>
          </Button>
          <Button variant="outline" size="md" onClick={onCreateClick} className="gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Create a Guild</span>
          </Button>
        </div>
      </Card>
    );
  }

  // Logged in with joined communities
  return (
    <div className="space-y-5">
      {/* Pending Invitations Section */}
      {invitations.length > 0 && (
        <Card className="p-4 bg-primary/5 border-[1.5px] border-primary/25 shadow-soft space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            <h4 className="text-xs sm:text-sm font-heading font-bold text-textPrimary">
              Guild Invitations ({invitations.length})
            </h4>
          </div>
          <div className="space-y-2">
            {invitations.map((inv) => (
              <div
                key={inv._id}
                className="p-3 rounded-xl bg-card border border-borderTheme flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-surface border border-borderTheme flex items-center justify-center text-lg shrink-0">
                    {inv.community?.icon || '💬'}
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-heading font-bold text-textPrimary">
                      {inv.community?.name}
                    </h5>
                    <p className="text-[11px] text-textSecondary">
                      Invited by <span className="text-textPrimary font-semibold">@{inv.inviter?.username || 'Founder'}</span>
                      {inv.message ? ` — "${inv.message}"` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={processingInviteId === inv._id}
                    onClick={() => handleAcceptInvite(inv._id)}
                    className="gap-1 bg-success hover:bg-success/90 text-white text-xs h-7 px-2.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={processingInviteId === inv._id}
                    onClick={() => handleDeclineInvite(inv._id)}
                    className="gap-1 border-borderTheme text-textSecondary hover:text-danger text-xs h-7 px-2.5"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="flex items-center justify-between gap-3 px-1">
        <div>
          <h3 className="text-base font-heading font-bold text-textPrimary">
            My Study Guilds ({myJoinedList.length})
          </h3>
          <p className="text-xs text-textSecondary font-body">
            Communities you have joined or created
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onCreateClick} className="gap-1">
          <Plus className="w-3.5 h-3.5" />
          <span>New Community</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myJoinedList.map((comm) => (
          <CommunityCard
            key={comm.id}
            community={comm}
            isJoined={true}
            onToggleJoin={onToggleJoin}
          />
        ))}
      </div>
    </div>
  );
};

export default MyCommunities;
