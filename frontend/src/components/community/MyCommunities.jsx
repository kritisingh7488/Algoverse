import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, UserPlus, Users, Plus } from 'lucide-react';
import CommunityCard from './CommunityCard';
import Button from '../common/Button';
import Card from '../common/Card';

export const MyCommunities = ({
  communities = [],
  joinedIds = [],
  onToggleJoin,
  onExploreClick,
  onCreateClick,
  isAuthenticated = true
}) => {
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
    <div className="space-y-4">
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
