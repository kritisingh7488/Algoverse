const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Community = require('../models/Community');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { generateToken } = require('../utils/jwt');

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

const results = [];

function recordTest(name, category, passed, details = '') {
    results.push({ name, category, passed, details });
    const icon = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${icon} [${category}] ${name} ${details ? '(' + details + ')' : ''}`);
}

async function apiRequest(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `http://localhost:${PORT}${endpoint}`;
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    
    const fetchOptions = {
        method: options.method || 'GET',
        headers
    };
    if (options.body) {
        fetchOptions.body = JSON.stringify(options.body);
    }

    const res = await fetch(url, fetchOptions);
    let data;
    try {
        data = await res.json();
    } catch (e) {
        data = null;
    }
    return { status: res.status, data };
}

async function runTests() {
    console.log('====================================================');
    console.log('🚀 STARTING PHASE 3 POSTS & COMMENTS VERIFICATION');
    console.log('====================================================\n');

    try {
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected to MongoDB Atlas.\n');
    } catch (err) {
        console.error('FATAL: Could not connect to MongoDB:', err.message);
        process.exit(1);
    }

    const timestamp = Date.now().toString().slice(-5);
    const userA = await User.create({
        fullName: 'Phase3 Author A',
        username: `p3_author_${timestamp}`,
        email: `p3_author_${timestamp}@algoverse.com`,
        password: 'Password123!',
        role: 'user'
    });

    const userB = await User.create({
        fullName: 'Phase3 User B',
        username: `p3_userb_${timestamp}`,
        email: `p3_userb_${timestamp}@algoverse.com`,
        password: 'Password123!',
        role: 'user'
    });

    const tokenA = generateToken(userA._id);
    const tokenB = generateToken(userB._id);

    const testCommunity = await Community.create({
        name: `Phase 3 Test Guild ${timestamp}`,
        slug: `phase3-guild-${timestamp}`,
        description: 'Test community for posts, discussions and comments.',
        category: 'DSA',
        creator: userA._id,
        members: [userA._id, userB._id],
        membersCount: 2
    });

    let testPost = null;
    let testComment = null;
    let testReply = null;

    // --- 1. POST CREATION & VALIDATION ---
    console.log('\n--- 1. Post Creation & Validation ---');
    try {
        // Validation failure: Title too short
        const shortTitleRes = await apiRequest(`/api/v1/communities/${testCommunity._id}/posts`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenA}` },
            body: { title: 'Hi', content: 'Valid markdown content goes here for testing.' }
        });
        recordTest('Reject post with short title (<5 chars)', 'Validation', shortTitleRes.status === 400);

        // Validation failure: Content too short
        const shortContentRes = await apiRequest(`/api/v1/communities/${testCommunity._id}/posts`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenA}` },
            body: { title: 'Valid Post Title', content: 'Short' }
        });
        recordTest('Reject post with short content (<10 chars)', 'Validation', shortContentRes.status === 400);

        // Valid Post Creation with Markdown & Tags
        const createRes = await apiRequest(`/api/v1/communities/${testCommunity._id}/posts`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenA}` },
            body: {
                title: `How to solve Dijkstra with Fibonacci Heaps in C++? ${timestamp}`,
                content: '# Intuition\nHere is a breakdown:\n```cpp\nint dijkstra() { return 0; }\n```\n* Step 1: Initialize dist\n* Step 2: Extract min',
                postType: 'Question',
                tags: ['graphs', 'shortest-path', 'c++']
            }
        });
        const createPass = createRes.status === 201 && createRes.data?.success && createRes.data?.data?.title;
        testPost = createRes.data?.data;
        recordTest('Create Markdown Post in MongoDB', 'Posts', createPass, `Post ID: ${testPost?._id}`);

    } catch (err) {
        recordTest('Post Creation Suite', 'Posts', false, err.message);
    }

    // --- 2. POST RETRIEVAL & VIEWS ---
    console.log('\n--- 2. Post Retrieval & Views Tracking ---');
    try {
        // Fetch community posts
        const feedRes = await apiRequest(`/api/v1/communities/${testCommunity._id}/posts`);
        const feedPass = feedRes.status === 200 && Array.isArray(feedRes.data?.data) && feedRes.data?.data.length >= 1;
        recordTest('Fetch Community Posts Feed', 'Posts', feedPass, `Count: ${feedRes.data?.count}`);

        // Filter by postType
        const typeFilterRes = await apiRequest(`/api/v1/communities/${testCommunity._id}/posts?postType=Question`);
        recordTest('Filter posts by postType=Question', 'Posts', typeFilterRes.status === 200 && typeFilterRes.data?.data[0]?.postType === 'Question');

        // Fetch Single Post & Increment Views
        const initialViews = testPost?.viewsCount || 0;
        const singlePostRes = await apiRequest(`/api/v1/posts/${testPost._id}`);
        const singlePass = singlePostRes.status === 200 && singlePostRes.data?.data?.viewsCount > initialViews;
        recordTest('Fetch Single Post & Increment viewsCount', 'Posts', singlePass, `Views: ${singlePostRes.data?.data?.viewsCount}`);

    } catch (err) {
        recordTest('Post Retrieval Suite', 'Posts', false, err.message);
    }

    // --- 3. MULTI-TYPE REACTIONS & BOOKMARKS ---
    console.log('\n--- 3. Reactions & Bookmarks ---');
    try {
        // User B reacts 'love'
        const reactRes1 = await apiRequest(`/api/v1/posts/${testPost._id}/react`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenB}` },
            body: { type: 'love' }
        });
        const react1Pass = reactRes1.status === 200 && reactRes1.data?.data?.userReaction === 'love' && reactRes1.data?.data?.reactionsSummary?.love === 1;
        recordTest('Add Love Reaction to Post', 'Reactions', react1Pass, `Summary: ${JSON.stringify(reactRes1.data?.data?.reactionsSummary)}`);

        // User B switches reaction to 'insightful'
        const reactRes2 = await apiRequest(`/api/v1/posts/${testPost._id}/react`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenB}` },
            body: { type: 'insightful' }
        });
        const react2Pass = reactRes2.status === 200 && reactRes2.data?.data?.userReaction === 'insightful' && reactRes2.data?.data?.reactionsSummary?.love === 0 && reactRes2.data?.data?.reactionsSummary?.insightful === 1;
        recordTest('Switch Reaction to Insightful (Accurate summary update)', 'Reactions', react2Pass);

        // User B toggles off reaction
        const reactRes3 = await apiRequest(`/api/v1/posts/${testPost._id}/react`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenB}` },
            body: { type: 'insightful' }
        });
        const react3Pass = reactRes3.status === 200 && reactRes3.data?.data?.userReaction === null && reactRes3.data?.data?.reactionsCount === 0;
        recordTest('Toggle Off Reaction (Remove reaction)', 'Reactions', react3Pass);

        // User B Bookmarks Post
        const bookmarkRes1 = await apiRequest(`/api/v1/posts/${testPost._id}/bookmark`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenB}` }
        });
        recordTest('Bookmark Post (isBookmarked = true)', 'Bookmarks', bookmarkRes1.status === 200 && bookmarkRes1.data?.isBookmarked === true);

        // User B Unbookmarks Post
        const bookmarkRes2 = await apiRequest(`/api/v1/posts/${testPost._id}/bookmark`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenB}` }
        });
        recordTest('Unbookmark Post (isBookmarked = false)', 'Bookmarks', bookmarkRes2.status === 200 && bookmarkRes2.data?.isBookmarked === false);

    } catch (err) {
        recordTest('Reactions/Bookmarks Suite', 'Reactions', false, err.message);
    }

    // --- 4. THREADED COMMENTS & REPLIES ---
    console.log('\n--- 4. Threaded Comments & Replies ---');
    try {
        // User B posts a Top-Level Comment
        const commRes1 = await apiRequest(`/api/v1/posts/${testPost._id}/comments`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenB}` },
            body: { content: 'Fibonacci heaps reduce decrease-key to O(1) amortized time!' }
        });
        testComment = commRes1.data?.data;
        const comm1Pass = commRes1.status === 201 && testComment?.content;
        recordTest('Create Top-Level Comment on Post', 'Comments', comm1Pass, `Comment ID: ${testComment?._id}`);

        // Author A posts a Nested Reply to Comment 1
        const replyRes1 = await apiRequest(`/api/v1/posts/${testPost._id}/comments`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenA}` },
            body: {
                content: 'Exactly! But the constant factor in practice makes binary heaps competitive.',
                parentCommentId: testComment._id
            }
        });
        testReply = replyRes1.data?.data;
        const reply1Pass = replyRes1.status === 201 && testReply?.parentComment === testComment._id;
        recordTest('Create Nested Reply to Parent Comment', 'Comments', reply1Pass, `Reply ID: ${testReply?._id}`);

        // Fetch Threaded Comments Tree
        const commentsTreeRes = await apiRequest(`/api/v1/posts/${testPost._id}/comments`);
        const treeData = commentsTreeRes.data?.data;
        const treePass = commentsTreeRes.status === 200 && Array.isArray(treeData) && treeData.length === 1 && treeData[0].replies?.length === 1;
        recordTest('Fetch Threaded Comments (Parent with nested replies hierarchy)', 'Comments', treePass, `Root comments: ${treeData?.length}, Replies: ${treeData?.[0]?.replies?.length}`);

        // Like Comment
        const likeRes = await apiRequest(`/api/v1/comments/${testComment._id}/like`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenA}` }
        });
        recordTest('Like Comment (likesCount incremented)', 'Comments', likeRes.status === 200 && likeRes.data?.isLiked === true);

        // Verify post commentsCount is updated in DB
        const checkPost = await Post.findById(testPost._id);
        recordTest('Post commentsCount accurately synchronized (count === 2)', 'Comments', checkPost?.commentsCount === 2, `DB commentsCount: ${checkPost?.commentsCount}`);

    } catch (err) {
        recordTest('Comments Suite', 'Comments', false, err.message);
    }

    // --- 5. CLEANUP & CASCADE DELETIONS ---
    console.log('\n--- 5. Cleanup & Cascading Deletions ---');
    try {
        // Delete Post and verify cascade deletion of comments
        const delPostRes = await apiRequest(`/api/v1/posts/${testPost._id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${tokenA}` }
        });
        recordTest('Delete Post by Author (200 OK)', 'Cascade', delPostRes.status === 200);

        const remainingComments = await Comment.find({ post: testPost._id });
        recordTest('Cascade delete: All comments removed upon post deletion', 'Cascade', remainingComments.length === 0, `Remaining comments: ${remainingComments.length}`);

        // Cleanup test guild and users
        await Community.findByIdAndDelete(testCommunity._id);
        await User.findByIdAndDelete(userA._id);
        await User.findByIdAndDelete(userB._id);
        console.log('Test artifacts and mock accounts cleaned up.\n');

    } catch (err) {
        recordTest('Cleanup Suite', 'Cascade', false, err.message);
    }

    console.log('====================================================');
    console.log('📊 PHASE 3 TEST SUMMARY');
    console.log('====================================================');
    const total = results.length;
    const passed = results.filter(r => r.passed).length;
    const failed = total - passed;

    console.log(`Total Phase 3 Tests: ${total}`);
    console.log(`Passed:              ${passed}`);
    console.log(`Failed:              ${failed}`);
    console.log(`Success Rate:        ${((passed / total) * 100).toFixed(1)}%\n`);

    await mongoose.disconnect();
    if (failed > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

runTests().catch(err => {
    console.error('Fatal test error:', err);
    process.exit(1);
});
