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

async function runAudit() {
    console.log('====================================================');
    console.log('🛡️ STARTING PHASE 3 SECURITY & EDGE-CASE AUDIT');
    console.log('====================================================\n');

    try {
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected to MongoDB Atlas.\n');
    } catch (err) {
        console.error('FATAL: Could not connect to MongoDB:', err.message);
        process.exit(1);
    }

    const timestamp = Date.now().toString().slice(-5);

    // Setup Test Accounts
    const userA = await User.create({
        fullName: 'Security User A',
        username: `sec_a_${timestamp}`,
        email: `sec_a_${timestamp}@algoverse.com`,
        password: 'Password123!',
        role: 'user'
    });

    const userB = await User.create({
        fullName: 'Security User B',
        username: `sec_b_${timestamp}`,
        email: `sec_b_${timestamp}@algoverse.com`,
        password: 'Password123!',
        role: 'user'
    });

    const memberC = await User.create({
        fullName: 'Security Member C',
        username: `sec_c_${timestamp}`,
        email: `sec_c_${timestamp}@algoverse.com`,
        password: 'Password123!',
        role: 'user'
    });

    const adminUser = await User.create({
        fullName: 'Security Admin',
        username: `sec_admin_${timestamp}`,
        email: `sec_admin_${timestamp}@algoverse.com`,
        password: 'Password123!',
        role: 'admin'
    });

    const tokenA = generateToken(userA._id);
    const tokenB = generateToken(userB._id);
    const tokenC = generateToken(memberC._id);
    const tokenAdmin = generateToken(adminUser._id);

    // Setup Public & Private Test Communities
    const publicComm = await Community.create({
        name: `Public Security Guild ${timestamp}`,
        slug: `public-sec-${timestamp}`,
        description: 'Public community for security audit testing.',
        category: 'DSA',
        creator: userA._id,
        members: [userA._id, userB._id],
        membersCount: 2,
        isPrivate: false
    });

    const privateComm = await Community.create({
        name: `Private Security Guild ${timestamp}`,
        slug: `private-sec-${timestamp}`,
        description: 'Private community for security and access matrix audit.',
        category: 'Competitive Programming',
        creator: userA._id,
        members: [userA._id, memberC._id],
        membersCount: 2,
        isPrivate: true
    });

    let publicPost = null;
    let privatePost = null;

    // --- 1. POSTS SECURITY & EDGE CASES ---
    console.log('\n--- 1. Posts Security & Authorization ---');
    try {
        // Guest cannot create post
        const guestPostRes = await apiRequest(`/api/v1/communities/${publicComm._id}/posts`, {
            method: 'POST',
            body: { title: 'Guest Post Attempt', content: 'Testing guest restriction' }
        });
        recordTest('Guest cannot create post (401 Unauthorized)', 'Posts Security', guestPostRes.status === 401);

        // User A creates post
        const userAPostRes = await apiRequest(`/api/v1/communities/${publicComm._id}/posts`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenA}` },
            body: {
                title: `Security Audit Discussion Post ${timestamp}`,
                content: '# Security Testing\nHere is a code snippet:\n```cpp\nint audit = 1;\n```',
                postType: 'Discussion',
                tags: ['security', 'audit']
            }
        });
        publicPost = userAPostRes.data?.data;
        recordTest('User A creates post in public community (201 Created)', 'Posts Security', userAPostRes.status === 201);

        // User B cannot edit User A's post
        const userBEditRes = await apiRequest(`/api/v1/posts/${publicPost._id}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${tokenB}` },
            body: { title: 'Hacked Title by User B' }
        });
        recordTest('User B cannot edit User A post (403 Forbidden)', 'Posts Security', userBEditRes.status === 403);

        // User B cannot delete User A's post
        const userBDeleteRes = await apiRequest(`/api/v1/posts/${publicPost._id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${tokenB}` }
        });
        recordTest('User B cannot delete User A post (403 Forbidden)', 'Posts Security', userBDeleteRes.status === 403);

        // Non-member User B cannot post in private community
        const unauthPrivPostRes = await apiRequest(`/api/v1/communities/${privateComm._id}/posts`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenB}` },
            body: { title: 'Infiltrate Private Guild', content: 'Attempting to post without membership' }
        });
        recordTest('Non-member cannot post in private community (403 Forbidden)', 'Posts Security', unauthPrivPostRes.status === 403);

        // Creator User A creates private post
        const privPostRes = await apiRequest(`/api/v1/communities/${privateComm._id}/posts`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenA}` },
            body: { title: `Private Guild Secret Breakdown ${timestamp}`, content: 'Private discussion for members only.' }
        });
        privatePost = privPostRes.data?.data;
        recordTest('Creator creates post in private community (201 Created)', 'Posts Security', privPostRes.status === 201);

        // Invalid post ID returns 404
        const invalidIdRes = await apiRequest('/api/v1/posts/invalid_not_an_id');
        recordTest('Malformed post ID returns 404', 'Edge Cases', invalidIdRes.status === 404);

        const nonExistentIdRes = await apiRequest('/api/v1/posts/650000000000000000000000');
        recordTest('Non-existent ObjectId returns 404', 'Edge Cases', nonExistentIdRes.status === 404);

    } catch (err) {
        recordTest('Posts Security Suite', 'Posts Security', false, err.message);
    }

    // --- 2. PRIVATE COMMUNITIES ACCESS MATRIX ---
    console.log('\n--- 2. Private Community Access Matrix (All Roles) ---');
    try {
        // Feed Access Matrix
        const guestFeed = await apiRequest(`/api/v1/communities/${privateComm._id}/posts`);
        recordTest('Private Feed: Guest is denied (403 Forbidden)', 'Private Access Matrix', guestFeed.status === 403);

        const nonMemberFeed = await apiRequest(`/api/v1/communities/${privateComm._id}/posts`, {
            headers: { Authorization: `Bearer ${tokenB}` }
        });
        recordTest('Private Feed: Non-member is denied (403 Forbidden)', 'Private Access Matrix', nonMemberFeed.status === 403);

        const memberFeed = await apiRequest(`/api/v1/communities/${privateComm._id}/posts`, {
            headers: { Authorization: `Bearer ${tokenC}` }
        });
        recordTest('Private Feed: Member is allowed (200 OK)', 'Private Access Matrix', memberFeed.status === 200);

        const creatorFeed = await apiRequest(`/api/v1/communities/${privateComm._id}/posts`, {
            headers: { Authorization: `Bearer ${tokenA}` }
        });
        recordTest('Private Feed: Creator is allowed (200 OK)', 'Private Access Matrix', creatorFeed.status === 200);

        const adminFeed = await apiRequest(`/api/v1/communities/${privateComm._id}/posts`, {
            headers: { Authorization: `Bearer ${tokenAdmin}` }
        });
        recordTest('Private Feed: Admin is allowed (200 OK)', 'Private Access Matrix', adminFeed.status === 200);

        // Single Post Access Matrix
        const guestPost = await apiRequest(`/api/v1/posts/${privatePost._id}`);
        recordTest('Private Post: Guest is denied (403 Forbidden)', 'Private Access Matrix', guestPost.status === 403);

        const nonMemberPost = await apiRequest(`/api/v1/posts/${privatePost._id}`, {
            headers: { Authorization: `Bearer ${tokenB}` }
        });
        recordTest('Private Post: Non-member is denied (403 Forbidden)', 'Private Access Matrix', nonMemberPost.status === 403);

        const memberPost = await apiRequest(`/api/v1/posts/${privatePost._id}`, {
            headers: { Authorization: `Bearer ${tokenC}` }
        });
        recordTest('Private Post: Member is allowed (200 OK)', 'Private Access Matrix', memberPost.status === 200);

        const creatorPost = await apiRequest(`/api/v1/posts/${privatePost._id}`, {
            headers: { Authorization: `Bearer ${tokenA}` }
        });
        recordTest('Private Post: Creator is allowed (200 OK)', 'Private Access Matrix', creatorPost.status === 200);

        const adminPost = await apiRequest(`/api/v1/posts/${privatePost._id}`, {
            headers: { Authorization: `Bearer ${tokenAdmin}` }
        });
        recordTest('Private Post: Admin is allowed (200 OK)', 'Private Access Matrix', adminPost.status === 200);

    } catch (err) {
        recordTest('Private Access Suite', 'Private Access Matrix', false, err.message);
    }

    // --- 3. COMMENTS SECURITY & DEEP HIERARCHY ---
    console.log('\n--- 3. Comments Security & Deep Hierarchy ---');
    let rootComment = null;
    let replyL1 = null;
    let replyL2 = null;
    try {
        // Guest cannot comment
        const guestCommentRes = await apiRequest(`/api/v1/posts/${publicPost._id}/comments`, {
            method: 'POST',
            body: { content: 'Guest comment attempt' }
        });
        recordTest('Guest cannot comment (401 Unauthorized)', 'Comments Security', guestCommentRes.status === 401);

        // User A creates Root Comment (Level 0)
        const rootRes = await apiRequest(`/api/v1/posts/${publicPost._id}/comments`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenA}` },
            body: { content: 'Level 0 Root Comment' }
        });
        rootComment = rootRes.data?.data;
        recordTest('Create Level 0 Root Comment (201 Created)', 'Comments Hierarchy', rootRes.status === 201);

        // User B cannot edit User A's comment
        const editCommentRes = await apiRequest(`/api/v1/comments/${rootComment._id}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${tokenB}` },
            body: { content: 'Hacked comment by User B' }
        });
        recordTest('User B cannot edit User A comment (403 Forbidden)', 'Comments Security', editCommentRes.status === 403);

        // User B cannot delete User A's comment
        const delCommentRes = await apiRequest(`/api/v1/comments/${rootComment._id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${tokenB}` }
        });
        recordTest('User B cannot delete User A comment (403 Forbidden)', 'Comments Security', delCommentRes.status === 403);

        // User B creates Nested Reply (Level 1)
        const reply1Res = await apiRequest(`/api/v1/posts/${publicPost._id}/comments`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenB}` },
            body: { content: 'Level 1 Reply to Root', parentCommentId: rootComment._id }
        });
        replyL1 = reply1Res.data?.data;
        recordTest('Create Level 1 Nested Reply (201 Created)', 'Comments Hierarchy', reply1Res.status === 201);

        // Member C creates Nested Reply (Level 2)
        const reply2Res = await apiRequest(`/api/v1/posts/${publicPost._id}/comments`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenC}` },
            body: { content: 'Level 2 Reply to Level 1', parentCommentId: replyL1._id }
        });
        replyL2 = reply2Res.data?.data;
        recordTest('Create Level 2 Nested Reply (201 Created)', 'Comments Hierarchy', reply2Res.status === 201);

        // Fetch deep nested comments tree
        const treeRes = await apiRequest(`/api/v1/posts/${publicPost._id}/comments`);
        const tree = treeRes.data?.data;
        const deepNestingValid = tree && tree.length === 1 && tree[0].replies?.length === 1 && tree[0].replies[0].replies?.length === 1;
        recordTest('Deep nesting hierarchy intact (Root -> L1 -> L2)', 'Comments Hierarchy', deepNestingValid);

        // Database Invariant: commentsCount === 3
        const postDoc = await Post.findById(publicPost._id);
        recordTest('Post commentsCount accurate (count === 3)', 'Comments Invariant', postDoc.commentsCount === 3, `DB count: ${postDoc.commentsCount}`);

    } catch (err) {
        recordTest('Comments Suite', 'Comments Security', false, err.message);
    }

    // --- 4. REACTIONS EDGE CASES & INTEGRITY ---
    console.log('\n--- 4. Reactions Edge Cases & Summary Recalculation ---');
    try {
        // Invalid reaction type is rejected
        const invalidReactRes = await apiRequest(`/api/v1/posts/${publicPost._id}/react`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenA}` },
            body: { type: 'unsupported_emoji_type' }
        });
        recordTest('Invalid reaction type is rejected (400 Bad Request)', 'Reactions Edge Cases', invalidReactRes.status === 400);

        // User A reacts 'celebrate'
        await apiRequest(`/api/v1/posts/${publicPost._id}/react`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenA}` },
            body: { type: 'celebrate' }
        });

        // User B reacts 'celebrate'
        const reactResB = await apiRequest(`/api/v1/posts/${publicPost._id}/react`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenB}` },
            body: { type: 'celebrate' }
        });
        const countPass = reactResB.data?.data?.reactionsCount === 2 && reactResB.data?.data?.reactionsSummary?.celebrate === 2;
        recordTest('Two users react celebrate (reactionsCount === 2, celebrate === 2)', 'Reactions Edge Cases', countPass);

        // User A switches to 'helpful'
        const switchRes = await apiRequest(`/api/v1/posts/${publicPost._id}/react`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenA}` },
            body: { type: 'helpful' }
        });
        const switchPass = switchRes.data?.data?.reactionsCount === 2 && switchRes.data?.data?.reactionsSummary?.celebrate === 1 && switchRes.data?.data?.reactionsSummary?.helpful === 1;
        recordTest('User A switches reaction to helpful (celebrate: 1, helpful: 1)', 'Reactions Edge Cases', switchPass);

        // Database Invariant check on Post reactions
        const postDb = await Post.findById(publicPost._id);
        const sumMatches = postDb.reactionsCount === postDb.reactions.length &&
                           (postDb.reactionsSummary.celebrate + postDb.reactionsSummary.helpful === 2);
        recordTest('Database Invariant: reactionsSummary matches actual reaction records', 'Reactions Invariant', sumMatches);

    } catch (err) {
        recordTest('Reactions Suite', 'Reactions Edge Cases', false, err.message);
    }

    // --- 5. BOOKMARKS IDEMPOTENCE & MULTI-USER ISOLATION ---
    console.log('\n--- 5. Bookmarks Idempotence & Isolation ---');
    try {
        // User A bookmarks post
        const b1 = await apiRequest(`/api/v1/posts/${publicPost._id}/bookmark`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenA}` }
        });
        recordTest('User A bookmarks post (isBookmarked === true)', 'Bookmarks', b1.data?.isBookmarked === true);

        // User B fetches post: User B should have isBookmarked === false
        const userBView = await apiRequest(`/api/v1/posts/${publicPost._id}`, {
            headers: { Authorization: `Bearer ${tokenB}` }
        });
        recordTest('User B view has isBookmarked === false (User isolation)', 'Bookmarks', userBView.data?.data?.isBookmarked === false);

        // User A fetches post: User A should have isBookmarked === true
        const userAView = await apiRequest(`/api/v1/posts/${publicPost._id}`, {
            headers: { Authorization: `Bearer ${tokenA}` }
        });
        recordTest('User A view has isBookmarked === true (Persistence & Auth check)', 'Bookmarks', userAView.data?.data?.isBookmarked === true);

    } catch (err) {
        recordTest('Bookmarks Suite', 'Bookmarks', false, err.message);
    }

    // --- 6. CASCADE DELETION & ZERO ORPHANS IN DB ---
    console.log('\n--- 6. Cascading Deletions & Orphan Invariants ---');
    try {
        // Admin deletes public post
        const adminDeleteRes = await apiRequest(`/api/v1/posts/${publicPost._id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${tokenAdmin}` }
        });
        recordTest('Admin deletes post with all its comments (200 OK)', 'Cascade & Integrity', adminDeleteRes.status === 200);

        // Verify post is gone
        const postCheck = await Post.findById(publicPost._id);
        recordTest('Deleted post permanently removed from MongoDB', 'Cascade & Integrity', postCheck === null);

        // Verify all 3 descendant comments are deleted (0 orphans)
        const orphans = await Comment.find({ post: publicPost._id });
        recordTest('Zero orphan comments left in MongoDB', 'Cascade & Integrity', orphans.length === 0, `Orphan count: ${orphans.length}`);

        // Cleanup
        await Post.findByIdAndDelete(privatePost._id);
        await Comment.deleteMany({ post: privatePost._id });
        await Community.findByIdAndDelete(publicComm._id);
        await Community.findByIdAndDelete(privateComm._id);
        await User.findByIdAndDelete(userA._id);
        await User.findByIdAndDelete(userB._id);
        await User.findByIdAndDelete(memberC._id);
        await User.findByIdAndDelete(adminUser._id);
        console.log('Security test artifacts and accounts cleaned up.\n');

    } catch (err) {
        recordTest('Cleanup & Cascade Suite', 'Cascade & Integrity', false, err.message);
    }

    console.log('====================================================');
    console.log('📊 SECURITY & EDGE-CASE AUDIT SUMMARY');
    console.log('====================================================');
    const total = results.length;
    const passed = results.filter(r => r.passed).length;
    const failed = total - passed;

    console.log(`Total Audit Tests: ${total}`);
    console.log(`Passed:            ${passed}`);
    console.log(`Failed:            ${failed}`);
    console.log(`Success Rate:      ${((passed / total) * 100).toFixed(1)}%\n`);

    await mongoose.disconnect();
    if (failed > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

runAudit().catch(err => {
    console.error('Fatal audit error:', err);
    process.exit(1);
});
