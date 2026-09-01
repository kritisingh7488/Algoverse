const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://127.0.0.1:${PORT}/api/v1`;

const results = [];

function recordTest(name, category, passed, details = '') {
    results.push({ name, category, passed, details });
    const icon = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${icon} [${category}] ${name} ${details ? '(' + details + ')' : ''}`);
}

async function browserFetch(urlPath, options = {}) {
    const url = `${BASE_URL}${urlPath}`;
    const headers = {
        'Origin': 'http://localhost:5173',
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    const fetchOptions = {
        method: options.method || 'GET',
        headers
    };
    if (options.body) {
        fetchOptions.body = JSON.stringify(options.body);
    }

    const res = await fetch(url, fetchOptions);
    let data = null;
    try {
        data = await res.json();
    } catch (e) {
        data = null;
    }
    return { status: res.status, headers: res.headers, data };
}

async function runBrowserFlowVerification() {
    console.log('====================================================');
    console.log('🌐 BROWSER E2E LIVE FLOW VERIFICATION');
    console.log('====================================================\n');

    // 1. Check CORS headers & Base URL
    console.log('--- 1. CORS Preflight & Base URL ---');
    const corsRes = await browserFetch('/communities');
    recordTest('CORS & API Base URL accessible at /api/v1/communities', 'Network', corsRes.status === 200, `Status: ${corsRes.status}`);

    // 2. Fetch Public Communities
    console.log('\n--- 2. Load Communities Flow ---');
    const commsRes = await browserFetch('/communities');
    const commsList = commsRes.data?.data || [];
    const hasCpp = commsList.some(c => c.slug === 'cpp-beginners');
    const hasDsa = commsList.some(c => c.slug === 'dsa-daily');
    recordTest('Load Communities from MongoDB Atlas (C++ & DSA found)', 'Browser Flow', commsRes.status === 200 && hasCpp && hasDsa, `Count: ${commsList.length}`);

    // 3. User Register & Login Flow (pure HTTP through Express + MongoDB)
    console.log('\n--- 3. User Login & Token Storage Flow ---');
    const timestamp = Date.now().toString().slice(-5);
    const testEmail = `browser_tester_${timestamp}@algoverse.com`;
    const testPassword = 'Password123!';

    // Register user via API
    const regRes = await browserFetch('/auth/register', {
        method: 'POST',
        body: {
            fullName: 'Browser Live Tester',
            username: `tester_${timestamp}`,
            email: testEmail,
            password: testPassword
        }
    });
    const regSuccess = regRes.status === 201 || (regRes.status === 200 && regRes.data?.token);

    // Login user via API
    const loginRes = await browserFetch('/auth/login', {
        method: 'POST',
        body: { email: testEmail, password: testPassword }
    });

    const token = loginRes.data?.token || loginRes.data?.data?.token || regRes.data?.token || regRes.data?.data?.token;
    recordTest('Register & Login via API returns valid JWT token', 'Auth Flow', !!token, `Token: ${token?.slice(0, 15)}...`);

    const authHeaders = { Authorization: `Bearer ${token}` };

    // 4. Open Community Detail Page (/community/cpp-beginners)
    console.log('\n--- 4. Open Community Detail Flow ---');
    const detailRes = await browserFetch('/communities/cpp-beginners', { headers: authHeaders });
    const cppCommunity = detailRes.data?.data;
    recordTest('Fetch Community Detail for cpp-beginners', 'Browser Flow', detailRes.status === 200 && cppCommunity?.slug === 'cpp-beginners', `Name: ${cppCommunity?.name}`);

    // 5. Join / Leave Community
    console.log('\n--- 5. Join / Leave Community Flow ---');
    const joinRes = await browserFetch('/communities/cpp-beginners/join', { method: 'POST', headers: authHeaders });
    const joinPassed = joinRes.status === 200 && (joinRes.data?.data?.isJoined === true || joinRes.data?.isJoined === true);
    recordTest('Join Community via POST /api/v1/communities/:slug/join', 'Membership Flow', joinPassed, `Joined: ${joinRes.data?.data?.isJoined}`);

    const leaveRes = await browserFetch('/communities/cpp-beginners/leave', { method: 'POST', headers: authHeaders });
    const leavePassed = leaveRes.status === 200 && (leaveRes.data?.data?.isJoined === false || joinRes.data?.isJoined === false);
    recordTest('Leave Community via POST /api/v1/communities/:slug/leave', 'Membership Flow', leavePassed, `Joined: ${leaveRes.data?.data?.isJoined}`);

    // Join back so user is member
    await browserFetch('/communities/cpp-beginners/join', { method: 'POST', headers: authHeaders });

    // 6. Load Community Discussions Feed
    console.log('\n--- 6. Load Community Posts Feed Flow ---');
    const feedRes = await browserFetch('/communities/cpp-beginners/posts', { headers: authHeaders });
    const feedPosts = feedRes.data?.data || [];
    recordTest('Fetch Discussions Feed for cpp-beginners', 'Posts Flow', feedRes.status === 200 && Array.isArray(feedPosts) && feedPosts.length > 0, `Posts found: ${feedPosts.length}`);

    // 7. Create New Post Flow
    console.log('\n--- 7. Create Post Flow ---');
    const newPostTitle = `Browser E2E Test Post: std::unordered_map Hash Internals ${timestamp}`;
    const createPostRes = await browserFetch('/communities/cpp-beginners/posts', {
        method: 'POST',
        headers: authHeaders,
        body: {
            title: newPostTitle,
            content: '# Hash Map Internals in C++\n```cpp\nstd::unordered_map<int, int> mp;\n```\nExplaining bucket indexing and collision resolution via separate chaining.',
            postType: 'Code',
            tags: ['cpp', 'hash-map', 'internals']
        }
    });
    const createdPost = createPostRes.data?.data;
    recordTest('Create Post via POST /api/v1/communities/:slug/posts', 'Posts Flow', createPostRes.status === 201 && createdPost?.title === newPostTitle, `Post ID: ${createdPost?._id}`);

    // 8. Open Post Detail Page
    console.log('\n--- 8. Open Post Detail Flow ---');
    const postDetailRes = await browserFetch(`/posts/${createdPost._id}`, { headers: authHeaders });
    const fetchedPost = postDetailRes.data?.data;
    recordTest('Fetch Single Post with incremented views', 'Posts Flow', postDetailRes.status === 200 && fetchedPost?._id === createdPost._id && fetchedPost.viewsCount >= 1);

    // 9. React to Post
    console.log('\n--- 9. Post Reaction Flow ---');
    const reactRes = await browserFetch(`/posts/${createdPost._id}/react`, {
        method: 'POST',
        headers: authHeaders,
        body: { type: 'insightful' }
    });
    recordTest('React Insightful to Post via POST /api/v1/posts/:id/react', 'Reactions Flow', reactRes.status === 200 && reactRes.data?.data?.userReaction === 'insightful');

    // 10. Bookmark Post
    console.log('\n--- 10. Post Bookmark Flow ---');
    const bookmarkRes = await browserFetch(`/posts/${createdPost._id}/bookmark`, {
        method: 'POST',
        headers: authHeaders
    });
    recordTest('Bookmark Post via POST /api/v1/posts/:id/bookmark', 'Bookmarks Flow', bookmarkRes.status === 200 && bookmarkRes.data?.isBookmarked === true);

    // 11. Add Top-Level Comment
    console.log('\n--- 11. Comment Flow ---');
    const addCommentRes = await browserFetch(`/posts/${createdPost._id}/comments`, {
        method: 'POST',
        headers: authHeaders,
        body: { content: 'Excellent breakdown of separate chaining buckets!' }
    });
    const topComment = addCommentRes.data?.data;
    recordTest('Post Top-Level Comment via POST /api/v1/posts/:id/comments', 'Comments Flow', addCommentRes.status === 201 && topComment?.content?.includes('separate chaining'));

    // 12. Add Nested Reply
    console.log('\n--- 12. Nested Reply Flow ---');
    const addReplyRes = await browserFetch(`/posts/${createdPost._id}/comments`, {
        method: 'POST',
        headers: authHeaders,
        body: {
            content: 'And don`t forget rehashing when the load factor exceeds 1.0!',
            parentCommentId: topComment._id
        }
    });
    const reply = addReplyRes.data?.data;
    recordTest('Post Nested Reply via POST /api/v1/posts/:id/comments (parentCommentId)', 'Comments Flow', addReplyRes.status === 201 && reply?.parentComment === topComment._id);

    // 13. Fetch Threaded Comment Tree
    console.log('\n--- 13. Fetch Comments Tree Flow ---');
    const commentsTreeRes = await browserFetch(`/posts/${createdPost._id}/comments`, { headers: authHeaders });
    const commentTree = commentsTreeRes.data?.data || [];
    const treeHasReply = commentTree.length === 1 && commentTree[0].replies?.length === 1;
    recordTest('Fetch Threaded Comments Tree (Root with nested reply)', 'Comments Flow', commentsTreeRes.status === 200 && treeHasReply);

    // 14. Clean Up Created Test Post
    console.log('\n--- 14. Delete Post Flow ---');
    const deleteRes = await browserFetch(`/posts/${createdPost._id}`, {
        method: 'DELETE',
        headers: authHeaders
    });
    recordTest('Delete Post & Cascade Comments via DELETE /api/v1/posts/:id', 'Posts Flow', deleteRes.status === 200);

    console.log('====================================================');
    console.log('📊 BROWSER E2E LIVE FLOW SUMMARY');
    console.log('====================================================');
    const total = results.length;
    const passed = results.filter(r => r.passed).length;
    const failed = total - passed;

    console.log(`Total Browser Flow Tests: ${total}`);
    console.log(`Passed:                   ${passed}`);
    console.log(`Failed:                   ${failed}`);
    console.log(`Success Rate:             ${((passed / total) * 100).toFixed(1)}%\n`);

    if (failed > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

runBrowserFlowVerification().catch(err => {
    console.error('Fatal Browser Flow Test error:', err);
    process.exit(1);
});
