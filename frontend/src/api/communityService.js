import api from './axios';
import {
  getAllCommunities,
  getJoinedCommunityIds,
  getCreatedCommunities,
  saveCreatedCommunity,
  toggleJoinCommunity,
  INITIAL_COMMUNITIES
} from '../data/communityData';

// Local storage keys for offline post & comment state
const LOCAL_POSTS_KEY = 'algoverse_community_posts_v1';
const LOCAL_COMMENTS_KEY = 'algoverse_community_comments_v1';

const getLocalPosts = () => {
  try {
    const raw = localStorage.getItem(LOCAL_POSTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalPosts = (posts) => {
  try {
    localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(posts));
  } catch (e) {}
};

const getLocalComments = () => {
  try {
    const raw = localStorage.getItem(LOCAL_COMMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalComments = (comments) => {
  try {
    localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(comments));
  } catch (e) {}
};

/**
 * Community API Service
 * Handles live REST API calls to /api/v1/communities, /api/v1/posts, /api/v1/comments
 * with automatic local fallback for offline development.
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
        saveCreatedCommunity(response.data.data);
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Community created successfully',
          source: 'api'
        };
      }
    } catch (error) {
      console.warn('Create Community API failed, saving locally in session:', error.message);
    }

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

    const updatedJoined = toggleJoinCommunity(idOrSlug);
    return {
      success: true,
      isJoined: updatedJoined.includes(idOrSlug),
      source: 'fallback'
    };
  },

  // ==========================================
  // POSTS APIS (PHASE 3)
  // ==========================================

  /**
   * Fetch posts for a community
   */
  async getPosts({ communityId, postType = 'All', tag = '', search = '', sort = 'newest', page = 1, limit = 20 } = {}) {
    try {
      const params = {};
      if (postType && postType !== 'All') params.postType = postType;
      if (tag && tag.trim()) params.tag = tag.trim();
      if (search && search.trim()) params.search = search.trim();
      if (sort) params.sort = sort;
      if (page) params.page = page;
      if (limit) params.limit = limit;

      const endpoint = communityId ? `/communities/${communityId}/posts` : '/posts/feed';
      const response = await api.get(endpoint, { params });

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data || [],
          total: response.data.total || 0,
          page: response.data.page || 1,
          pages: response.data.pages || 1,
          source: 'api'
        };
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        return {
          success: false,
          status: 403,
          message: error.response.data?.message || 'Private community discussions are restricted to members'
        };
      }
      console.warn('Posts API unavailable, using local post cache:', error.message);
    }

    // Local fallback
    const local = getLocalPosts();
    let filtered = communityId ? local.filter(p => p.communityId === communityId || p.community?.slug === communityId) : local;
    if (postType && postType !== 'All') filtered = filtered.filter(p => p.postType === postType);
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q));
    }

    return {
      success: true,
      data: filtered,
      total: filtered.length,
      source: 'fallback'
    };
  },

  /**
   * Get single post by ID
   */
  async getPostById(postId) {
    try {
      const response = await api.get(`/posts/${postId}`);
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
      console.warn('Get Post API unavailable, searching local posts:', error.message);
    }

    const local = getLocalPosts();
    const found = local.find(p => p._id === postId || p.id === postId);
    if (!found) {
      return { success: false, status: 404, message: 'Post not found' };
    }
    return { success: true, data: found, source: 'fallback' };
  },

  /**
   * Create a new post in a community
   */
  async createPost(communityId, postData) {
    try {
      const response = await api.post(`/communities/${communityId}/posts`, postData);
      if (response.data && response.data.success && response.data.data) {
        const posts = getLocalPosts();
        posts.unshift(response.data.data);
        saveLocalPosts(posts);
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Post published successfully',
          source: 'api'
        };
      }
    } catch (error) {
      if (error.response) {
        return {
          success: false,
          status: error.response.status,
          message: error.response.data?.message || 'Failed to create post'
        };
      }
      console.warn('Create post API offline, saving locally:', error.message);
    }

    // Local fallback
    const fallbackPost = {
      _id: `post-${Date.now()}`,
      title: postData.title,
      content: postData.content,
      postType: postData.postType || 'Discussion',
      tags: postData.tags || [],
      communityId,
      author: {
        fullName: 'You',
        username: 'coder',
        avatar: '',
        role: 'Learner',
        xp: 150
      },
      reactionsCount: 0,
      reactionsSummary: { like: 0, love: 0, insightful: 0, helpful: 0, celebrate: 0 },
      commentsCount: 0,
      viewsCount: 1,
      createdAt: new Date().toISOString()
    };

    const posts = getLocalPosts();
    posts.unshift(fallbackPost);
    saveLocalPosts(posts);

    return {
      success: true,
      data: fallbackPost,
      message: 'Post created (session mode)',
      source: 'fallback'
    };
  },

  /**
   * React to a post
   */
  async reactToPost(postId, reactionType = 'like') {
    try {
      const response = await api.post(`/posts/${postId}/react`, { type: reactionType });
      if (response.data && response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data,
          source: 'api'
        };
      }
    } catch (error) {
      console.warn('React API offline, returning simulated response:', error.message);
    }

    return {
      success: true,
      source: 'fallback'
    };
  },

  /**
   * Bookmark a post
   */
  async bookmarkPost(postId) {
    try {
      const response = await api.post(`/posts/${postId}/bookmark`);
      if (response.data && response.data.success) {
        return {
          success: true,
          isBookmarked: response.data.isBookmarked,
          data: response.data.data,
          source: 'api'
        };
      }
    } catch (error) {
      console.warn('Bookmark API offline:', error.message);
    }

    return {
      success: true,
      isBookmarked: true,
      source: 'fallback'
    };
  },

  /**
   * Delete a post
   */
  async deletePost(postId) {
    try {
      const response = await api.delete(`/posts/${postId}`);
      if (response.data && response.data.success) {
        const posts = getLocalPosts().filter(p => (p._id || p.id) !== postId);
        saveLocalPosts(posts);
        return {
          success: true,
          message: response.data.message || 'Post deleted'
        };
      }
    } catch (error) {
      console.warn('Delete post API error:', error.message);
    }

    const posts = getLocalPosts().filter(p => (p._id || p.id) !== postId);
    saveLocalPosts(posts);
    return { success: true, source: 'fallback' };
  },

  // ==========================================
  // COMMENTS APIS (PHASE 3)
  // ==========================================

  /**
   * Fetch threaded comments for a post
   */
  async getComments(postId) {
    try {
      const response = await api.get(`/posts/${postId}/comments`);
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data || [],
          count: response.data.count || 0,
          source: 'api'
        };
      }
    } catch (error) {
      console.warn('Comments API offline, using local cache:', error.message);
    }

    const local = getLocalComments().filter(c => c.postId === postId);
    return {
      success: true,
      data: local,
      count: local.length,
      source: 'fallback'
    };
  },

  /**
   * Add a comment or reply
   */
  async createComment(postId, { content, parentCommentId = null } = {}) {
    try {
      const response = await api.post(`/posts/${postId}/comments`, { content, parentCommentId });
      if (response.data && response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data,
          source: 'api'
        };
      }
    } catch (error) {
      if (error.response) {
        return {
          success: false,
          status: error.response.status,
          message: error.response.data?.message || 'Failed to post comment'
        };
      }
      console.warn('Create comment API offline:', error.message);
    }

    const fallbackComment = {
      _id: `comment-${Date.now()}`,
      postId,
      content,
      parentComment: parentCommentId,
      author: {
        fullName: 'You',
        username: 'coder',
        avatar: '',
        role: 'Learner',
        xp: 150
      },
      likesCount: 0,
      isLiked: false,
      replies: [],
      createdAt: new Date().toISOString()
    };

    const comments = getLocalComments();
    comments.push(fallbackComment);
    saveLocalComments(comments);

    return {
      success: true,
      data: fallbackComment,
      source: 'fallback'
    };
  },

  /**
   * Toggle like on comment
   */
  async likeComment(commentId) {
    try {
      const response = await api.post(`/comments/${commentId}/like`);
      if (response.data && response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data,
          source: 'api'
        };
      }
    } catch (error) {
      console.warn('Comment like API offline:', error.message);
    }

    return {
      success: true,
      source: 'fallback'
    };
  },

  /**
   * Delete comment
   */
  async deleteComment(commentId) {
    try {
      const response = await api.delete(`/comments/${commentId}`);
      if (response.data && response.data.success) {
        return { success: true };
      }
    } catch (error) {
      console.warn('Delete comment API error:', error.message);
    }

    return { success: true, source: 'fallback' };
  }
};

export default communityService;
