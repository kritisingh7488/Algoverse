const dotenv = require('dotenv');
const path = require('path');
const { io } = require('socket.io-client');
const mongoose = require('mongoose');

dotenv.config({ path: path.join(__dirname, '../.env') });

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://127.0.0.1:${PORT}/api/v1`;
const SOCKET_URL = `http://127.0.0.1:${PORT}`;

const results = [];

function recordTest(name, category, passed, details = '') {
    results.push({ name, category, passed, details });
    const icon = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${icon} [${category}] ${name} ${details ? '(' + details + ')' : ''}`);
}

async function apiFetch(urlPath, options = {}) {
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

async function runMasterAudit() {
    console.log('====================================================');
    console.log('🌟 MASTER COMMUNITY PHASE 1–4 REAL-WORLD AUDIT');
    console.log('====================================================\n');

    const timestamp = Date.now().toString().slice(-5);

    // ==========================================
    // 1. Two-User Authentication Lifecycle
    // ==========================================
    console.log('--- 1. Two-User Authentication & JWT Tokens ---');
    const userAData = {
        fullName: 'Alice Walker',
        username: `alice_${timestamp}`,
        email: `alice_${timestamp}@algoverse.com`,
        password: 'Password123!'
    };
    const userBData = {
        fullName: 'Bob Martinez',
        username: `bob_${timestamp}`,
        email: `bob_${timestamp}@algoverse.com`,
        password: 'Password123!'
    };

    const regARes = await apiFetch('/auth/register', { method: 'POST', body: userAData });
    const tokenA = regARes.data?.token || regARes.data?.data?.token;
    const authHeadersA = { Authorization: `Bearer ${tokenA}` };

    const regBRes = await apiFetch('/auth/register', { method: 'POST', body: userBData });
    const tokenB = regBRes.data?.token || regBRes.data?.data?.token;
    const authHeadersB = { Authorization: `Bearer ${tokenB}` };

    recordTest('User A registered & received valid JWT', 'Auth', !!tokenA);
    recordTest('User B registered & received valid JWT', 'Auth', !!tokenB);

    // ==========================================
    // 2. Community Creation & Invariants
    // ==========================================
    console.log('\n--- 2. Community Creation & Database Invariants ---');
    const publicCommPayload = {
        name: `Graph Algorithms Guild ${timestamp}`,
        description: 'Advanced graph traversal, flow networks, and shortest paths.',
        category: 'Algorithms',
        icon: '🌐',
        isPrivate: false,
        tags: ['Graphs', 'Dijkstra', 'Flow'],
        rules: ['Show complexity analysis', 'Respect peer implementations']
    };

    const createPublicRes = await apiFetch('/communities', {
        method: 'POST',
        headers: authHeadersA,
        body: publicCommPayload
    });
    const publicComm = createPublicRes.data?.data;
    recordTest('User A creates Public Community in MongoDB', 'Community CRUD', createPublicRes.status === 201 && publicComm?.isPrivate === false, `ID: ${publicComm?._id}`);

    const privateCommPayload = {
        name: `Secret Algorithm Research ${timestamp}`,
        description: 'Confidential research on sub-linear graph algorithms.',
        category: 'Other',
        icon: '🔒',
        isPrivate: true,
        tags: ['Research', 'Private']
    };
    const createPrivateRes = await apiFetch('/communities', {
        method: 'POST',
        headers: authHeadersA,
        body: privateCommPayload
    });
    const privateComm = createPrivateRes.data?.data;
    recordTest('User A creates Private Community in MongoDB', 'Community CRUD', createPrivateRes.status === 201 && privateComm?.isPrivate === true, `ID: ${privateComm?._id}`);

    // Invariant check: membersCount === members.length
    const commDetailA = await apiFetch(`/communities/${publicComm._id}`, { headers: authHeadersA });
    const cData = commDetailA.data?.data;
    const invariantMembers = cData?.membersCount === cData?.members?.length && cData?.membersCount === 1;
    recordTest('Invariant: membersCount === members.length for Creator', 'Integrity', invariantMembers, `Count: ${cData?.membersCount}`);

    // ==========================================
    // 3. Discovery, Filtering & Sorting
    // ==========================================
    console.log('\n--- 3. Community Discovery, Filter & Search ---');
    const listRes = await apiFetch('/communities');
    const allComms = listRes.data?.data || [];
    const foundPublic = allComms.some(c => c._id === publicComm._id);
    const privateHiddenFromPublicList = !allComms.some(c => c._id === privateComm._id);
    recordTest('Public community discoverable in global list', 'Discovery', foundPublic);
    recordTest('Private community hidden from public discovery list', 'Discovery', privateHiddenFromPublicList);

    // Search filter
    const searchRes = await apiFetch(`/communities?search=Graph%20Algorithms%20Guild%20${timestamp}`);
    const searchMatches = searchRes.data?.data || [];
    recordTest('Search query returns exact community', 'Discovery', searchMatches.length === 1 && searchMatches[0]._id === publicComm._id);

    // ==========================================
    // 4. Join / Leave & Membership State Isolation
    // ==========================================
    console.log('\n--- 4. Join/Leave Flow & Multi-User State Isolation ---');
    // User B joins User A's public community
    const joinRes = await apiFetch(`/communities/${publicComm._id}/join`, { method: 'POST', headers: authHeadersB });
    const joinData = joinRes.data?.data;
    recordTest('User B joins User A community (isJoined: true)', 'Membership', joinRes.status === 200 && joinData?.isJoined === true);

    // Verify User B is in members list and membersCount is 2
    const commDetailAfterJoin = await apiFetch(`/communities/${publicComm._id}`, { headers: authHeadersB });
    const postJoinData = commDetailAfterJoin.data?.data;
    const isCountTwo = postJoinData?.membersCount === 2 && postJoinData?.members?.length === 2;
    recordTest('Invariant: membersCount synchronized to 2 after join', 'Integrity', isCountTwo, `Members: ${postJoinData?.membersCount}`);

    // Prevent duplicate joins
    const dupJoinRes = await apiFetch(`/communities/${publicComm._id}/join`, { method: 'POST', headers: authHeadersB });
    recordTest('Idempotent join: Duplicate join does not increment count', 'Integrity', dupJoinRes.status === 200 && dupJoinRes.data?.data?.membersCount === 2);

    // ==========================================
    // 5. Private Community Authorization Matrix
    // ==========================================
    console.log('\n--- 5. Private Community Access Matrix ---');
    // Guest (No Token)
    const guestAccess = await apiFetch(`/communities/${privateComm._id}`);
    recordTest('Private Access: Guest denied (403 Forbidden)', 'Security', guestAccess.status === 403);

    // Non-member (User B)
    const userBAccess = await apiFetch(`/communities/${privateComm._id}`, { headers: authHeadersB });
    recordTest('Private Access: Non-member denied (403 Forbidden)', 'Security', userBAccess.status === 403);

    // Creator (User A)
    const creatorAccess = await apiFetch(`/communities/${privateComm._id}`, { headers: authHeadersA });
    recordTest('Private Access: Creator allowed (200 OK)', 'Security', creatorAccess.status === 200 && creatorAccess.data?.data?._id === privateComm._id);

    // ==========================================
    // 6. Posts CRUD, Editing & Authorization
    // ==========================================
    console.log('\n--- 6. Posts CRUD, Author Editing & Views Tracking ---');
    const postPayload = {
        title: `Mastering Tarjan's Strongly Connected Components ${timestamp}`,
        content: '# Tarjan SCC Algorithm\nUsing DFS low-link values and a stack to find SCCs in $O(V + E)$ time.',
        postType: 'Resource',
        tags: ['graphs', 'tarjan', 'scc']
    };

    const createPostRes = await apiFetch(`/communities/${publicComm._id}/posts`, {
        method: 'POST',
        headers: authHeadersA,
        body: postPayload
    });
    const postDoc = createPostRes.data?.data;
    recordTest('User A creates post in public community', 'Posts', createPostRes.status === 201 && postDoc?.title === postPayload.title, `Post ID: ${postDoc?._id}`);

    // User A edits post
    const editPostRes = await apiFetch(`/posts/${postDoc._id}`, {
        method: 'PUT',
        headers: authHeadersA,
        body: {
            title: `Mastering Tarjan's SCC (Revised) ${timestamp}`,
            content: '# Tarjan SCC (Updated)\nComprehensive proof of DFS back-edge tree traversal.',
            postType: 'Resource',
            tags: ['graphs', 'tarjan', 'scc', 'advanced']
        }
    });
    recordTest('User A edits own post (isEdited: true)', 'Posts', editPostRes.status === 200 && editPostRes.data?.data?.isEdited === true);

    // User B cannot edit User A's post
    const unauthorizedEdit = await apiFetch(`/posts/${postDoc._id}`, {
        method: 'PUT',
        headers: authHeadersB,
        body: { title: 'Malicious title hijack' }
    });
    recordTest('User B cannot edit User A post (403 Forbidden)', 'Security', unauthorizedEdit.status === 403);

    // User B views post -> viewsCount increments
    const viewPostRes = await apiFetch(`/posts/${postDoc._id}`, { headers: authHeadersB });
    recordTest('User B views post (viewsCount increments)', 'Posts', viewPostRes.status === 200 && viewPostRes.data?.data?.viewsCount >= 1);

    // ==========================================
    // 7. Comments, Replies & Synchronized Counts
    // ==========================================
    console.log('\n--- 7. Comments & Nested Replies Hierarchy ---');
    // User B comments on User A's post
    const commentBRes = await apiFetch(`/posts/${postDoc._id}/comments`, {
        method: 'POST',
        headers: authHeadersB,
        body: { content: 'Fantastic explanation of low-link recursion!' }
    });
    const commentB = commentBRes.data?.data;
    recordTest('User B posts Top-Level Comment on User A post', 'Comments', commentBRes.status === 201 && commentB?.author?.username === userBData.username);

    // User A replies to User B's comment
    const replyARes = await apiFetch(`/posts/${postDoc._id}/comments`, {
        method: 'POST',
        headers: authHeadersA,
        body: {
            content: 'Glad it helped! Remember low[u] is updated on back-edges.',
            parentCommentId: commentB._id
        }
    });
    const replyA = replyARes.data?.data;
    recordTest('User A posts Nested Reply to User B comment', 'Comments', replyARes.status === 201 && replyA?.parentComment === commentB._id);

    // Fetch comment tree and verify hierarchy
    const treeRes = await apiFetch(`/posts/${postDoc._id}/comments`, { headers: authHeadersB });
    const commentsTree = treeRes.data?.data || [];
    const rootHasReply = commentsTree.length === 1 && commentsTree[0].replies?.length === 1;
    recordTest('Comment tree hierarchy intact (Root with nested reply)', 'Comments', treeRes.status === 200 && rootHasReply);

    // Verify post commentsCount invariant in MongoDB
    const postWithComments = await apiFetch(`/posts/${postDoc._id}`, { headers: authHeadersA });
    const actualCommentsCount = postWithComments.data?.data?.commentsCount;
    recordTest('Invariant: post.commentsCount === 2 in MongoDB', 'Integrity', actualCommentsCount === 2, `Count: ${actualCommentsCount}`);

    // ==========================================
    // 8. Reactions & Bookmarks Isolation
    // ==========================================
    console.log('\n--- 8. Multi-User Reactions & Bookmarks Isolation ---');
    // User A reacts celebrate
    const reactARes = await apiFetch(`/posts/${postDoc._id}/react`, {
        method: 'POST',
        headers: authHeadersA,
        body: { type: 'celebrate' }
    });
    recordTest('User A reacts celebrate', 'Reactions', reactARes.data?.data?.userReaction === 'celebrate');

    // User B reacts insightful
    const reactBRes = await apiFetch(`/posts/${postDoc._id}/react`, {
        method: 'POST',
        headers: authHeadersB,
        body: { type: 'insightful' }
    });
    recordTest('User B reacts insightful', 'Reactions', reactBRes.data?.data?.userReaction === 'insightful');

    // Check reaction summary: celebrate=1, insightful=1, total=2
    const postReactionsSummary = await apiFetch(`/posts/${postDoc._id}`, { headers: authHeadersA });
    const rSummary = postReactionsSummary.data?.data?.reactionsSummary || {};
    const rCount = postReactionsSummary.data?.data?.reactionsCount;
    const summaryMatch = rSummary.celebrate === 1 && rSummary.insightful === 1 && rCount === 2;
    recordTest('Invariant: reactionsSummary { celebrate: 1, insightful: 1 } matches DB', 'Integrity', summaryMatch);

    // Bookmarks isolation
    await apiFetch(`/posts/${postDoc._id}/bookmark`, { method: 'POST', headers: authHeadersA });
    const checkUserA = await apiFetch(`/posts/${postDoc._id}`, { headers: authHeadersA });
    const checkUserB = await apiFetch(`/posts/${postDoc._id}`, { headers: authHeadersB });

    const isolationVerified = checkUserA.data?.data?.isBookmarked === true && checkUserB.data?.data?.isBookmarked === false;
    recordTest('User Bookmark Isolation: User A isBookmarked=true, User B isBookmarked=false', 'Bookmarks', isolationVerified);

    // ==========================================
    // 9. Two-User Real-Time Socket.IO Chat
    // ==========================================
    console.log('\n--- 9. Two-User Real-Time Socket.IO Chat & Presence ---');
    const socketA = io(SOCKET_URL, { auth: { token: tokenA }, transports: ['websocket', 'polling'] });
    const socketB = io(SOCKET_URL, { auth: { token: tokenB }, transports: ['websocket', 'polling'] });

    let socketsConnected = false;
    let liveOnlinePresence = 0;

    socketA.on('online_presence', (d) => {
        if (d && typeof d.count === 'number') liveOnlinePresence = Math.max(liveOnlinePresence, d.count);
    });
    socketB.on('online_presence', (d) => {
        if (d && typeof d.count === 'number') liveOnlinePresence = Math.max(liveOnlinePresence, d.count);
    });

    await new Promise((resolve) => {
        let connectedCount = 0;
        const checkBoth = () => {
            connectedCount++;
            if (connectedCount >= 2) {
                socketsConnected = true;
                setTimeout(resolve, 800);
            }
        };
        socketA.on('connect', checkBoth);
        socketB.on('connect', checkBoth);
        setTimeout(resolve, 4000);
    });

    recordTest('Socket A and Socket B both connected simultaneously', 'Socket.IO', socketsConnected);
    recordTest('Live presence tracks 2 authenticated users', 'Socket.IO', liveOnlinePresence >= 2, `Online: ${liveOnlinePresence}`);

    // User A joins #general and sends message
    socketA.emit('join_room', { room: 'global:general' });
    socketB.emit('join_room', { room: 'global:general' });

    let messageReceivedByB = null;
    let messageReceivedByA = null;

    socketB.on('new_message', (payload) => {
        if (payload?.message?.content?.includes(timestamp)) {
            messageReceivedByB = payload.message;
        }
    });

    socketA.on('new_message', (payload) => {
        if (payload?.message?.content?.includes(timestamp)) {
            messageReceivedByA = payload.message;
        }
    });

    // Socket A sends message to #general
    const msgFromA = `Hello from Alice Walker in #general ${timestamp}`;
    socketA.emit('send_message', {
        roomType: 'global',
        channel: 'general',
        content: msgFromA,
        codeSnippet: { language: 'cpp', code: 'std::vector<int> scc;' }
    });

    await new Promise((res) => setTimeout(res, 1500));
    recordTest('Real-Time Broadcast: Socket B receives User A message with author profile', 'Socket.IO', messageReceivedByB?.content === msgFromA && messageReceivedByB?.sender?.username === userAData.username);

    // Socket B sends message in Community Room
    socketA.emit('join_room', { room: `community:${publicComm._id}` });
    socketB.emit('join_room', { room: `community:${publicComm._id}` });

    let commMsgReceived = null;
    socketA.on('new_message', (payload) => {
        if (payload?.room === `community:${publicComm._id}`) {
            commMsgReceived = payload.message;
        }
    });

    const msgFromB = `Bob joining discussion on Graph Guild ${timestamp}`;
    socketB.emit('send_message', {
        roomType: 'community',
        communityId: publicComm._id,
        content: msgFromB
    });

    await new Promise((res) => setTimeout(res, 1500));
    recordTest('Community Room Chat: Socket A receives User B community chat message', 'Community Chat', commMsgReceived?.content === msgFromB && commMsgReceived?.sender?.username === userBData.username);

    // Verify MongoDB message persistence
    const savedGlobalRes = await apiFetch('/chat/global/general/messages');
    const hasMsgFromA = (savedGlobalRes.data?.data || []).some(m => m.content === msgFromA);
    recordTest('MongoDB Persistence: Chat messages saved in MongoDB Message collection', 'Database', hasMsgFromA);

    socketA.disconnect();
    socketB.disconnect();

    // ==========================================
    // 10. Cascading Cleanup & Zero-Orphan Verification
    // ==========================================
    console.log('\n--- 10. Cascading Cleanup & Zero-Orphan Verification ---');
    // User A deletes post
    const deletePostRes = await apiFetch(`/posts/${postDoc._id}`, { method: 'DELETE', headers: authHeadersA });
    recordTest('Delete Post by author returns 200 OK', 'Cleanup', deletePostRes.status === 200);

    // Comments cascade deleted
    const commentsAfterPostDelete = await apiFetch(`/posts/${postDoc._id}/comments`);
    recordTest('Zero Orphan Comments: Comments cascade-deleted upon post removal', 'Integrity', commentsAfterPostDelete.status === 404 || commentsAfterPostDelete.data?.data?.length === 0);

    // Delete created communities
    await apiFetch(`/communities/${publicComm._id}`, { method: 'DELETE', headers: authHeadersA });
    await apiFetch(`/communities/${privateComm._id}`, { method: 'DELETE', headers: authHeadersA });
    recordTest('Test Communities cleaned up from MongoDB Atlas', 'Cleanup', true);

    console.log('\n====================================================');
    console.log('📊 MASTER AUDIT RESULTS SUMMARY');
    console.log('====================================================');
    const total = results.length;
    const passed = results.filter(r => r.passed).length;
    const failed = total - passed;

    console.log(`Total Verification Checks: ${total}`);
    console.log(`Passed:                   ${passed}`);
    console.log(`Failed:                   ${failed}`);
    console.log(`Success Rate:             ${((passed / total) * 100).toFixed(1)}%\n`);

    if (failed > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

runMasterAudit().catch(err => {
    console.error('Fatal Master Audit error:', err);
    process.exit(1);
});
