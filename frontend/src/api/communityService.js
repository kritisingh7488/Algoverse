import api from './axios';
import {
  getAllCommunities,
  getJoinedCommunityIds,
  getCreatedCommunities,
  saveCreatedCommunity,
  toggleJoinCommunity,
  INITIAL_COMMUNITIES
} from '../data/communityData';

/**
 * Community API Service
 * Handles live REST API calls to /api/v1/communities with automatic local fallback
 * for offline / unseeded development environments.
 */
export const communityService = {
  /**
   * Fetch public communities with optional search, category, and sort filters
   */
  async getCommunities({ search = '', category = 'All', sort = 'trending', page = 1, limit = 50 } = {}) {
    try {
      const params = {};
      if (search && search.trim()) params.search = search.trim();
      if (category && category !== 'All') params.category = category;
      if (sort) params.sort = sort;
      if (page) params.page = page;
      if (limit) params.limit = limit;

      const response = await api.get('/communities', { params });
      if (response.data && response.data.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
        return {
          success: true,
          data: response.data.data,
          total: response.data.total || response.data.data.length,
          source: 'api'
        };
      }
      // If DB returned 0 items (e.g. empty DB), fall through to seed fallback
    } catch (error) {
      console.warn('Community API unavailable, using local data fallback:', error.message);
    }

    // Local fallback
    const all = getAllCommunities();
    const joinedIds = getJoinedCommunityIds();

    const filtered = all.filter(c => {
      if (category !== 'All' && c.category !== category) return false;
      if (search && search.trim()) {
        const q = search.toLowerCase().trim();
        const matchName = c.name.toLowerCase().includes(q);
        const matchDesc = c.description.toLowerCase().includes(q);
        const matchCat = c.category.toLowerCase().includes(q);
        const matchTags = c.tags && c.tags.some(t => t.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchCat && !matchTags) return false;
      }
      return true;
    }).map(c => ({
      ...c,
      isJoined: joinedIds.includes(c.id)
    }));

    return {
      success: true,
      data: filtered,
      total: filtered.length,
      source: 'fallback'
    };
  },

  /**
   * Fetch user's joined and created communities
   */
  async getMyCommunities() {
    try {
      const response = await api.get('/communities/my');
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return {
          success: true,
          data: response.data.data,
          source: 'api'
        };
      }
    } catch (error) {
      console.warn('My Communities API unavailable, using local data fallback:', error.message);
    }

    // Local fallback
    const all = getAllCommunities();
    const joinedIds = getJoinedCommunityIds();
    const myCommunities = all
      .filter(c => joinedIds.includes(c.id))
      .map(c => ({ ...c, isJoined: true }));

    return {
      success: true,
      data: myCommunities,
      source: 'fallback'
    };
  },

  /**
   * Fetch top trending communities
   */
  async getTrendingCommunities() {
    try {
      const response = await api.get('/communities/trending');
      if (response.data && response.data.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
        return {
          success: true,
          data: response.data.data,
          source: 'api'
        };
      }
    } catch (error) {
      console.warn('Trending Communities API unavailable, using local data fallback:', error.message);
    }

    // Local fallback
    const all = getAllCommunities();
    const joinedIds = getJoinedCommunityIds();
    const trending = all
      .filter(c => c.isTrending || c.trendingRank)
      .sort((a, b) => (a.trendingRank || 99) - (b.trendingRank || 99))
      .slice(0, 5)
      .map(c => ({ ...c, isJoined: joinedIds.includes(c.id) }));

    return {
      success: true,
      data: trending,
      source: 'fallback'
    };
  },

  /**
   * Fetch single community details by ID or Slug
   */
  async getCommunityByIdOrSlug(idOrSlug) {
    try {
      const response = await api.get(`/communities/${idOrSlug}`);
      if (response.data && response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data,
          source: 'api'
        };
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        return {
          success: false,
          status: 403,
          message: error.response.data?.message || 'Access restricted to private community members'
        };
      }
      console.warn('Community details API unavailable, using local data fallback:', error.message);
    }

    // Local fallback
    const all = getAllCommunities();
    const joinedIds = getJoinedCommunityIds();
    const found = all.find(c => c.id === idOrSlug || c.slug === idOrSlug);

    if (!found) {
      return {
        success: false,
        status: 404,
        message: 'Community not found'
      };
    }

    return {
      success: true,
      data: {
        ...found,
        isJoined: joinedIds.includes(found.id)
      },
      source: 'fallback'
    };
  },

  /**
   * Create a new community
   */
  async createCommunity(communityData) {
    try {
      const response = await api.post('/communities', communityData);
      if (response.data && response.data.success && response.data.data) {
        // Also save to local session so both API and offline fallback stay in sync
        saveCreatedCommunity(response.data.data);
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Community created successfully',
          source: 'api'
        };
      }
    } catch (error) {
      console.warn('Create Community API failed or offline, saving locally in session:', error.message);
    }

    // Local fallback
    const slug = (communityData.name || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCommunity = {
      id: `custom-${slug}-${Date.now().toString().slice(-4)}`,
      name: communityData.name.trim(),
      slug: slug || `guild-${Date.now()}`,
      description: communityData.description.trim(),
      category: communityData.category || 'DSA',
      icon: communityData.icon || '⚡',
      gradient: communityData.gradient || 'from-primary/20 to-secondary/20',
      accentColor: communityData.accentColor || '#FF8A80',
      membersCount: 1,
      isPrivate: !!communityData.isPrivate,
      isTrending: false,
      isVerified: false,
      tags: Array.isArray(communityData.tags) ? communityData.tags : [communityData.category || 'DSA'],
      about: communityData.about || communityData.description,
      rules: Array.isArray(communityData.rules) && communityData.rules.length > 0 ? communityData.rules : [
        'Be welcoming and respectful to all learners.',
        'Format all code snippets properly with comments.',
        'Explain intuition and time/space complexity when sharing solutions.'
      ],
      createdDate: 'Just now',
      isJoined: true
    };

    saveCreatedCommunity(newCommunity);

    return {
      success: true,
      data: newCommunity,
      message: 'Community created (session mode)',
      source: 'fallback'
    };
  },

  /**
   * Join a community
   */
  async joinCommunity(idOrSlug) {
    try {
      const response = await api.post(`/communities/${idOrSlug}/join`);
      if (response.data && response.data.success) {
        toggleJoinCommunity(idOrSlug);
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Joined community successfully',
          source: 'api'
        };
      }
    } catch (error) {
      console.warn('Join Community API offline or failed, updating local state:', error.message);
    }

    // Local fallback
    const updatedJoined = toggleJoinCommunity(idOrSlug);
    return {
      success: true,
      isJoined: updatedJoined.includes(idOrSlug),
      source: 'fallback'
    };
  },

  /**
   * Leave a community
   */
  async leaveCommunity(idOrSlug) {
    try {
      const response = await api.post(`/communities/${idOrSlug}/leave`);
      if (response.data && response.data.success) {
        toggleJoinCommunity(idOrSlug);
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Left community successfully',
          source: 'api'
        };
      }
    } catch (error) {
      console.warn('Leave Community API offline or failed, updating local state:', error.message);
    }

    // Local fallback
    const updatedJoined = toggleJoinCommunity(idOrSlug);
    return {
      success: true,
      isJoined: updatedJoined.includes(idOrSlug),
      source: 'fallback'
    };
  }
};

export default communityService;
