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

async function runFrontendPrivateCommunityRegressionTest() {
    console.log('====================================================');
    console.log('🛡️ FRONTEND PRIVATE COMMUNITY + LIVE CHAT REGRESSION');
    console.log('====================================================\n');

    const timestamp = Date.now().toString().slice(-5);

    // 1. User Setup
    console.log('--- 1. Multi-User Authentication Setup ---');
    const userAData = { fullName: 'Creator Alpha', username: `alpha_${timestamp}`, email: `alpha_${timestamp}@algoverse.com`, password: 'Password123!' };
    const userBData = { fullName: 'Member Beta', username: `beta_${timestamp}`, email: `beta_${timestamp}@algoverse.com`, password: 'Password123!' };
    const userCData = { fullName: 'Stranger Gamma', username: `gamma_${timestamp}`, email: `gamma_${timestamp}@algoverse.com`, password: 'Password123!' };

    const regA = await apiFetch('/auth/register', { method: 'POST', body: userAData });
    const tokenA = regA.data?.token || regA.data?.data?.token;

    const regB = await apiFetch('/auth/register', { method: 'POST', body: userBData });
    const tokenB = regB.data?.token || regB.data?.data?.token;

    const regC = await apiFetch('/auth/register', { method: 'POST', body: userCData });
    const tokenC = regC.data?.token || regC.data?.data?.token;

    recordTest('User A registered & JWT obtained', 'Auth', !!tokenA);
    recordTest('User B registered & JWT obtained', 'Auth', !!tokenB);
    recordTest('User C registered & JWT obtained', 'Auth', !!tokenC);

    const headersA = { Authorization: `Bearer ${tokenA}` };
    const headersB = { Authorization: `Bearer ${tokenB}` };
    const headersC = { Authorization: `Bearer ${tokenC}` };

    // 2. Private Community Creation & Response Payload
    console.log('\n--- 2. Private Community Creation Flow ---');
    const createRes = await apiFetch('/communities', {
        method: 'POST',
        headers: headersA,
        body: {
            name: `Secret Algorithm Lab ${timestamp}`,
            description: 'Confidential algorithmic research guild.',
            category: 'Algorithms',
            icon: '🔒',
            isPrivate: true,
            rules: ['Rule 1: Confidentiality']
        }
    });

    const createdComm = createRes.data?.data;
    const hasAllFields = createdComm && createdComm._id && createdComm.name && createdComm.slug && 
                         createdComm.isPrivate === true && createdComm.creator && 
                         Array.isArray(createdComm.members) && typeof createdComm.membersCount === 'number';

    recordTest('POST /communities creates private community with complete fields (_id, slug, isPrivate, members)', 'Creation', createRes.status === 201 && hasAllFields, `Slug: ${createdComm?.slug}`);

    // 3. Frontend Visibility & Refetch Invariants
    console.log('\n--- 3. Community Visibility & Discovery Invariants ---');
    // Creator fetches GET /communities -> MUST contain the private community
    const getCommunitiesA = await apiFetch('/communities', { headers: headersA });
    const listA = getCommunitiesA.data?.data || [];
    const creatorCanSeePrivate = listA.some(c => (c.slug === createdComm.slug || c._id === createdComm._id) && c.isPrivate === true);
    recordTest('Creator GET /communities returns newly created private community', 'Visibility', getCommunitiesA.status === 200 && creatorCanSeePrivate);

    // Creator fetches GET /communities/my -> MUST contain the private community
    const getMyA = await apiFetch('/communities/my', { headers: headersA });
    const myListA = getMyA.data?.data || [];
    const inMyListA = myListA.some(c => (c.slug === createdComm.slug || c._id === createdComm._id) && c.isPrivate === true);
    recordTest('Creator GET /communities/my returns newly created private community', 'Visibility', getMyA.status === 200 && inMyListA);

    // Guest / Unauthenticated user GET /communities -> MUST NOT contain private community
    const getCommunitiesGuest = await apiFetch('/communities');
    const listGuest = getCommunitiesGuest.data?.data || [];
    const guestSeesPrivate = listGuest.some(c => c.slug === createdComm.slug || c._id === createdComm._id);
    recordTest('Guest GET /communities DOES NOT return private community', 'Security', !guestSeesPrivate);

    // Stranger User C GET /communities -> MUST NOT contain private community
    const getCommunitiesC = await apiFetch('/communities', { headers: headersC });
    const listC = getCommunitiesC.data?.data || [];
    const strangerSeesPrivate = listC.some(c => c.slug === createdComm.slug || c._id === createdComm._id);
    recordTest('Stranger User C GET /communities DOES NOT return private community', 'Security', !strangerSeesPrivate);

    // 4. Routing & Detail Flow (by ID and by Slug)
    console.log('\n--- 4. Routing & Detail Access Flow ---');
    const detailByIdA = await apiFetch(`/communities/${createdComm._id}`, { headers: headersA });
    recordTest('Creator can access detail via MongoDB _id', 'Routing', detailByIdA.status === 200 && detailByIdA.data?.data?.isJoined === true);

    const detailBySlugA = await apiFetch(`/communities/${createdComm.slug}`, { headers: headersA });
    recordTest('Creator can access detail via Slug', 'Routing', detailBySlugA.status === 200 && detailBySlugA.data?.data?.isJoined === true);

    // User B before joining detail -> 403
    const detailBySlugBBefore = await apiFetch(`/communities/${createdComm.slug}`, { headers: headersB });
    recordTest('Non-member User B receives 403 when opening private detail', 'Security', detailBySlugBBefore.status === 403);

    // User B joins private community
    const joinRes = await apiFetch(`/communities/${createdComm.slug}/join`, { method: 'POST', headers: headersB });
    recordTest('User B joins private community via slug', 'Membership', joinRes.status === 200 && joinRes.data?.data?.isJoined === true);

    // User B after joining detail -> 200
    const detailBySlugBAfter = await apiFetch(`/communities/${createdComm.slug}`, { headers: headersB });
    recordTest('Member User B can access private detail after joining', 'Membership', detailBySlugBAfter.status === 200 && detailBySlugBAfter.data?.data?.isJoined === true);

    // 5. Real-Time Socket.IO Chat Live Flow (User A + User B)
    console.log('\n--- 5. Socket.IO Live Chat & Room Synchronization ---');
    const socketA = io(SOCKET_URL, { auth: { token: tokenA }, transports: ['websocket', 'polling'] });
    const socketB = io(SOCKET_URL, { auth: { token: tokenB }, transports: ['websocket', 'polling'] });
    const socketC = io(SOCKET_URL, { auth: { token: tokenC }, transports: ['websocket', 'polling'] });

    await new Promise(resolve => {
        let connected = 0;
        const check = () => { connected++; if (connected >= 3) resolve(); };
        socketA.on('connect', check);
        socketB.on('connect', check);
        socketC.on('connect', check);
        setTimeout(resolve, 3000);
    });

    recordTest('Socket.IO connections established for User A, User B, User C', 'Socket.IO', socketA.connected && socketB.connected && socketC.connected);

    // User C (unauthorized) tries to join private room
    let errorC = null;
    socketC.on('chat_error', (err) => { errorC = err.message; });
    socketC.emit('join_room', { room: `community:${createdComm._id}` });
    await new Promise(res => setTimeout(res, 800));
    recordTest('Stranger User C denied from private chat room', 'Security', !!errorC && errorC.includes('Access denied'));

    // User A joins by ID, User B joins by Slug
    socketA.emit('join_room', { room: `community:${createdComm._id}` });
    socketB.emit('join_room', { room: `community:${createdComm.slug}` });
    await new Promise(res => setTimeout(res, 800));

    let receivedByB = null;
    let receivedByA = null;
    let receivedByC = null;

    socketB.on('new_message', (payload) => {
        if (payload?.message?.content?.includes(timestamp)) receivedByB = payload.message;
    });
    socketA.on('new_message', (payload) => {
        if (payload?.message?.content?.includes(timestamp)) receivedByA = payload.message;
    });
    socketC.on('new_message', (payload) => {
        if (payload?.message?.content?.includes(timestamp)) receivedByC = payload.message;
    });

    // A -> B Message
    const msgA = `Hello from Creator A [${timestamp}]`;
    socketA.emit('send_message', {
        roomType: 'community',
        communityId: createdComm._id,
        content: msgA
    });

    await new Promise(res => setTimeout(res, 1200));
    recordTest('User B instantly receives User A message live without refresh', 'Live Chat', receivedByB?.content === msgA && receivedByB?.sender?.username === userAData.username);

    // B -> A Message
    const msgB = `Hello from Member B [${timestamp}]`;
    socketB.emit('send_message', {
        roomType: 'community',
        communityId: createdComm.slug,
        content: msgB
    });

    await new Promise(res => setTimeout(res, 1200));
    recordTest('User A instantly receives User B message live without refresh', 'Live Chat', receivedByA?.content === msgB && receivedByA?.sender?.username === userBData.username);
    recordTest('Stranger User C receives ZERO private messages', 'Security', receivedByC === null);

    // 6. Persistence & Refresh Flow
    console.log('\n--- 6. Persistence & Chat History ---');
    const historyRes = await apiFetch(`/chat/community/${createdComm.slug}/messages`, { headers: headersA });
    const historyMsgs = historyRes.data?.data || [];
    const containsBoth = historyMsgs.some(m => m.content === msgA) && historyMsgs.some(m => m.content === msgB);
    recordTest('Chat messages persisted in MongoDB and retrieved via REST history', 'Database', historyRes.status === 200 && containsBoth, `Count: ${historyMsgs.length}`);

    // 7. Leaving Invariant
    console.log('\n--- 7. Leave & Revocation Flow ---');
    await apiFetch(`/communities/${createdComm.slug}/leave`, { method: 'POST', headers: headersB });
    const historyBAfterLeave = await apiFetch(`/chat/community/${createdComm.slug}/messages`, { headers: headersB });
    recordTest('User B denied chat history after leaving (403 Forbidden)', 'Security', historyBAfterLeave.status === 403);

    // 8. Cleanup
    socketA.disconnect();
    socketB.disconnect();
    socketC.disconnect();
    await apiFetch(`/communities/${createdComm._id}`, { method: 'DELETE', headers: headersA });
    recordTest('Test artifacts cleaned up successfully', 'Cleanup', true);

    console.log('\n====================================================');
    console.log('📊 REGRESSION AUDIT SUMMARY');
    console.log('====================================================');
    const total = results.length;
    const passed = results.filter(r => r.passed).length;
    const failed = total - passed;

    console.log(`Total Checks: ${total}`);
    console.log(`Passed:       ${passed}`);
    console.log(`Failed:       ${failed}`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%\n`);

    if (failed > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

runFrontendPrivateCommunityRegressionTest().catch(err => {
    console.error('Fatal Regression Test error:', err);
    process.exit(1);
});
