import api from './axios';

/**
 * Community API Service
 * Handles direct live REST API calls to /api/v1/communities, /api/v1/posts, /api/v1/comments.
 * Surfaces real API responses and errors without silent mock fallbacks.
 */
export const communityService = {
  // ==========================================
  // COMMUNITIES API
  // ==========================================

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
      return {
        success: true,
        data: response.data.data || [],
        total: response.data.total || (response.data.data ? response.data.data.length : 0),
        source: 'api'
      };
    } catch (error) {
      console.error('Error fetching communities from API:', error.response?.data || error.message);
      return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || error.message,
        data: []
      };
    }
  },

  /**
   * Fetch user's joined and created communities
   */
  async getMyCommunities() {
    try {
      const response = await api.get('/communities/my');
      return {
        success: true,
        data: response.data.data || [],
        source: 'api'
      };
    } catch (error) {
      console.error('Error fetching my communities:', error.response?.data || error.message);
      return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || error.message,
        data: []
      };
    }
  },

  /**
   * Fetch top trending communities
   */
  async getTrendingCommunities() {
    try {
      const response = await api.get('/communities/trending');
      return {
        success: true,
        data: response.data.data || [],
        source: 'api'
      };
    } catch (error) {
      console.error('Error fetching trending communities:', error.response?.data || error.message);
      return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || error.message,
        data: []
      };
    }
  },

  /**
   * Fetch single community by slug or MongoDB ID
   */
  async getCommunityByIdOrSlug(idOrSlug) {
    try {
      const response = await api.get(`/communities/${idOrSlug}`);
      return {
        success: true,
        data: response.data.data,
        source: 'api'
      };
    } catch (error) {
      console.error(`Error fetching community ${idOrSlug}:`, error.response?.data || error.message);
      return {
        success: false,
        status: error.response?.status || 404,
        message: error.response?.data?.message || 'Community not found',
        data: null
      };
    }
  },

  /**
   * Create a new community
   */
  async createCommunity(communityData) {
    try {
      const response = await api.post('/communities', communityData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Community created successfully',
        source: 'api'
      };
    } catch (error) {
      console.error('Error creating community:', error.response?.data || error.message);
      return {
        success: false,
        status: error.response?.status || 400,
        message: error.response?.data?.message || 'Failed to create community'
      };
    }
  },

  /**
   * Join a community
   */
  async joinCommunity(communityIdOrSlug) {
    try {
      const response = await api.post(`/communities/${communityIdOrSlug}/join`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Joined successfully',
        source: 'api'
      };
    } catch (error) {
      console.error(`Error joining community ${communityIdOrSlug}:`, error.response?.data || error.message);
      return {
        success: false,
        status: error.response?.status || 400,
        message: error.response?.data?.message || 'Failed to join community'
      };
    }
  },

  /**
   * Leave a community
   */
  async leaveCommunity(communityIdOrSlug) {
    try {
      const response = await api.post(`/communities/${communityIdOrSlug}/leave`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Left successfully',
        source: 'api'
      };
    } catch (error) {
      console.error(`Error leaving community ${communityIdOrSlug}:`, error.response?.data || error.message);
      return {
        success: false,
        status: error.response?.status || 400,
        message: error.response?.data?.message || 'Failed to leave community'
      };
    }
  },

  // ==========================================
  // POSTS & DISCUSSIONS API
  // ==========================================

  /**
   * Fetch discussions / posts for a specific community with filters
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

      return {
        success: true,
        data: response.data.data || [],
        total: response.data.total || (response.data.data ? response.data.data.length : 0),
        page: response.data.page || page,
        pages: response.data.pages || 1,
        source: 'api'
      };
    } catch (error) {
      console.error('Error fetching posts:', error.response?.data || error.message);
      return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || error.message,
        data: []
      };
    }
  },

  /**
   * Fetch global feed of all public posts
   */
  async getGlobalFeed({ postType = 'All', tag = '', search = '', sort = 'newest', page = 1, limit = 20 } = {}) {
    return this.getPosts({ postType, tag, search, sort, page, limit });
  },

  /**
   * Fetch single post by ID (increments views automatically on server)
   */
  async getPostById(postId) {
    try {
      const response = await api.get(`/posts/${postId}`);
      return {
        success: true,
        data: response.data.data,
        source: 'api'
      };
    } catch (error) {
      console.error(`Error fetching post ${postId}:`, error.response?.data || error.message);
      return {
        success: false,
        status: error.response?.status || 404,
        message: error.response?.data?.message || 'Post not found',
        data: null
      };
    }
  },

  /**
   * Create a new post in a community
   */
  async createPost(communityIdOrSlug, postData) {
    try {
      const response = await api.post(`/communities/${communityIdOrSlug}/posts`, postData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Post published successfully',
        source: 'api'
      };
    } catch (error) {
      console.error('Error creating post:', error.response?.data || error.message);
      return {
        success: false,
        status: error.response?.status || 400,
        message: error.response?.data?.message || 'Failed to create post'
      };
    }
  },

  /**
   * Update an existing post
   */
  async updatePost(postId, postData) {
    try {
      const response = await api.put(`/posts/${postId}`, postData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Post updated successfully',
        source: 'api'
      };
    } catch (error) {
      console.error(`Error updating post ${postId}:`, error.response?.data || error.message);
      return {
        success: false,
        status: error.response?.status || 400,
        message: error.response?.data?.message || 'Failed to update post'
      };
    }
  },

  /**
   * Delete a post
   */
  async deletePost(postId) {
    try {
      const response = await api.delete(`/posts/${postId}`);
      return {
        success: true,
        message: response.data.message || 'Post deleted successfully',
        source: 'api'
      };
    } catch (error) {
      console.error(`Error deleting post ${postId}:`, error.response?.data || error.message);
      return {
        success: false,
        status: error.response?.status || 400,
        message: error.response?.data?.message || 'Failed to delete post'
      };
    }
  },

  /**
   * React to a post (like, love, insightful, helpful, celebrate)
   */
  async reactToPost(postId, reactionType = 'like') {
    try {
      const response = await api.post(`/posts/${postId}/react`, { type: reactionType });
      return {
        success: true,
        data: response.data.data,
        source: 'api'
      };
    } catch (error) {
      console.error(`Error reacting to post ${postId}:`, error.response?.data || error.message);
      return {
        success: false,
        status: error.response?.status || 400,
        message: error.response?.data?.message || 'Failed to update reaction'
      };
    }
  },

  /**
   * Bookmark / unbookmark a post
   */
  async bookmarkPost(postId) {
    try {
      const response = await api.post(`/posts/${postId}/bookmark`);
      return {
        success: true,
        isBookmarked: response.data.isBookmarked,
        message: response.data.message,
        source: 'api'
      };
    } catch (error) {
      console.error(`Error bookmarking post ${postId}:`, error.response?.data || error.message);
      return {
        success: false,
        status: error.response?.status || 400,
        message: error.response?.data?.message || 'Failed to update bookmark'
      };
    }
  },

  // ==========================================
  // COMMENTS & REPLIES API
  // ==========================================

  /**
   * Fetch threaded comment tree for a post
   */
  async getComments(postId) {
    try {
      const response = await api.get(`/posts/${postId}/comments`);
      return {
        success: true,
        data: response.data.data || [],
        source: 'api'
      };
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error.response?.data || error.message);
      return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Failed to load comments',
        data: []
      };
    }
  },

  /**
   * Add a top-level comment or nested reply to a post
   */
  async addComment(postId, { content, parentCommentId = null }) {
    try {
      const response = await api.post(`/posts/${postId}/comments`, {
        content,
        parentCommentId
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Comment posted successfully',
        source: 'api'
      };
    } catch (error) {
      console.error(`Error adding comment to post ${postId}:`, error.response?.data || error.message);
      return {
        success: false,
        status: error.response?.status || 400,
        message: error.response?.data?.message || 'Failed to post comment'
      };
    }
  },

  /**
   * Update an existing comment
   */
  async updateComment(commentId, content) {
    try {
      const response = await api.put(`/comments/${commentId}`, { content });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Comment updated successfully',
        source: 'api'
      };
    } catch (error) {
      console.error(`Error updating comment ${commentId}:`, error.response?.data || error.message);
      return {
        success: false,
        status: error.response?.status || 400,
        message: error.response?.data?.message || 'Failed to update comment'
      };
    }
  },

  /**
   * Delete a comment
   */
  async deleteComment(commentId) {
    try {
      const response = await api.delete(`/comments/${commentId}`);
      return {
        success: true,
        message: response.data.message || 'Comment deleted successfully',
        source: 'api'
      };
    } catch (error) {
      console.error(`Error deleting comment ${commentId}:`, error.response?.data || error.message);
      return {
        success: false,
        status: error.response?.status || 400,
        message: error.response?.data?.message || 'Failed to delete comment'
      };
    }
  },

  /**
   * Like / unlike a comment
   */
  async likeComment(commentId) {
    try {
      const response = await api.post(`/comments/${commentId}/like`);
      return {
        success: true,
        data: response.data.data,
        isLiked: response.data.isLiked,
        source: 'api'
      };
    } catch (error) {
      console.error(`Error liking comment ${commentId}:`, error.response?.data || error.message);
      return {
        success: false,
        status: error.response?.status || 400,
        message: error.response?.data?.message || 'Failed to like comment'
      };
    }
  },

  // ==========================================
  // REAL-TIME CHAT API
  // ==========================================

  /**
   * Fetch messages for a global channel
   */
  async getGlobalMessages(channel = 'general', limit = 50) {
    try {
      const response = await api.get(`/chat/global/${channel}/messages`, { params: { limit } });
      return {
        success: true,
        data: response.data.data || [],
        source: 'api'
      };
    } catch (error) {
      console.error(`Error fetching global messages for #${channel}:`, error.response?.data || error.message);
      return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Failed to load messages',
        data: []
      };
    }
  },

  /**
   * Fetch messages for a community room
   */
  async getCommunityMessages(communityId, limit = 50) {
    try {
      const response = await api.get(`/chat/community/${communityId}/messages`, { params: { limit } });
      return {
        success: true,
        data: response.data.data || [],
        source: 'api'
      };
    } catch (error) {
      console.error(`Error fetching community messages for ${communityId}:`, error.response?.data || error.message);
      return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Failed to load community chat',
        data: []
      };
    }
  }
};

export default communityService;
