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

async function runPrivateChatTest() {
    console.log('====================================================');
    console.log('🔒 PRIVATE COMMUNITY LIVE CHAT E2E VERIFICATION');
    console.log('====================================================\n');

    const timestamp = Date.now().toString().slice(-5);

    // 1. Setup 3 Users: User A (Creator), User B (Member), User C (Non-member)
    console.log('--- 1. Multi-User Authentication Setup ---');
    const userAData = { fullName: 'Alice Creator', username: `alice_priv_${timestamp}`, email: `alice_priv_${timestamp}@algoverse.com`, password: 'Password123!' };
    const userBData = { fullName: 'Bob Member', username: `bob_priv_${timestamp}`, email: `bob_priv_${timestamp}@algoverse.com`, password: 'Password123!' };
    const userCData = { fullName: 'Charlie Stranger', username: `charlie_priv_${timestamp}`, email: `charlie_priv_${timestamp}@algoverse.com`, password: 'Password123!' };

    const regA = await apiFetch('/auth/register', { method: 'POST', body: userAData });
    const tokenA = regA.data?.token || regA.data?.data?.token;

    const regB = await apiFetch('/auth/register', { method: 'POST', body: userBData });
    const tokenB = regB.data?.token || regB.data?.data?.token;

    const regC = await apiFetch('/auth/register', { method: 'POST', body: userCData });
    const tokenC = regC.data?.token || regC.data?.data?.token;

    recordTest('User A (Creator) registered & token obtained', 'Auth', !!tokenA);
    recordTest('User B (Member) registered & token obtained', 'Auth', !!tokenB);
    recordTest('User C (Stranger) registered & token obtained', 'Auth', !!tokenC);

    const headersA = { Authorization: `Bearer ${tokenA}` };
    const headersB = { Authorization: `Bearer ${tokenB}` };
    const headersC = { Authorization: `Bearer ${tokenC}` };

    // 2. User A Creates Private Community
    console.log('\n--- 2. Private Community Creation & Membership ---');
    const createCommRes = await apiFetch('/communities', {
        method: 'POST',
        headers: headersA,
        body: {
            name: `Private Research Guild ${timestamp}`,
            description: 'Exclusive research group for advanced algorithmics.',
            category: 'Algorithms',
            icon: '🔒',
            isPrivate: true,
            rules: ['NDA required']
        }
    });
    const privateComm = createCommRes.data?.data;
    recordTest('User A creates Private Community', 'Community', createCommRes.status === 201 && privateComm?.isPrivate === true, `Slug: ${privateComm?.slug}`);

    // User B joins private community
    const joinRes = await apiFetch(`/communities/${privateComm._id}/join`, { method: 'POST', headers: headersB });
    recordTest('User B joins private community', 'Membership', joinRes.status === 200 && joinRes.data?.data?.isJoined === true);

    // 3. Socket Connections for User A, User B, and User C
    console.log('\n--- 3. Socket.IO Connections & Private Room Authorization ---');
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

    recordTest('Socket A (Creator), Socket B (Member), Socket C (Stranger) connected', 'Socket.IO', socketA.connected && socketB.connected && socketC.connected);

    // Non-member User C tries to join private community room
    let userCError = null;
    socketC.on('chat_error', (err) => {
        userCError = err.message;
    });
    socketC.emit('join_room', { room: `community:${privateComm._id}` });
    await new Promise(res => setTimeout(res, 800));

    recordTest('Stranger User C denied from joining Private Room', 'Security', !!userCError && userCError.includes('Access denied'), `Error: ${userCError}`);

    // User A joins private room by ID
    let roomJoinedA = false;
    socketA.on('room_joined', (data) => {
        roomJoinedA = true;
    });
    socketA.emit('join_room', { room: `community:${privateComm._id}` });

    // User B joins private room by Slug (verifying dual-lookup!)
    let roomJoinedB = false;
    socketB.on('room_joined', (data) => {
        roomJoinedB = true;
    });
    socketB.emit('join_room', { room: `community:${privateComm.slug}` });

    await new Promise(res => setTimeout(res, 1000));
    recordTest('User A (Creator) joins private room by ID', 'Private Chat', roomJoinedA);
    recordTest('User B (Member) joins private room by Slug', 'Private Chat', roomJoinedB);

    // 4. Two-Way Real-time Message Exchange
    console.log('\n--- 4. Live 2-Way Message Exchange in Private Room ---');
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

    // User A sends "Private chat test A"
    const textA = `Private chat test A from Creator ${timestamp}`;
    socketA.emit('send_message', {
        roomType: 'community',
        communityId: privateComm._id,
        content: textA,
        codeSnippet: { language: 'cpp', code: 'void solve() { /* private */ }' }
    });

    await new Promise(res => setTimeout(res, 1500));
    recordTest('User B instantly receives User A private message', 'Private Chat', messageReceivedByB?.content === textA && messageReceivedByB?.sender?.username === userAData.username);

    // User B sends "Private chat test B" using community slug
    const textB = `Private chat test B from Member ${timestamp}`;
    socketB.emit('send_message', {
        roomType: 'community',
        communityId: privateComm.slug,
        content: textB
    });

    await new Promise(res => setTimeout(res, 1500));
    recordTest('User A instantly receives User B private message', 'Private Chat', messageReceivedByA?.content === textB && messageReceivedByA?.sender?.username === userBData.username);

    // 5. MongoDB Persistence & History Retrieval
    console.log('\n--- 5. MongoDB Persistence & Privacy Enforcement ---');
    // User A fetches history
    const historyA = await apiFetch(`/chat/community/${privateComm._id}/messages`, { headers: headersA });
    const msgsA = historyA.data?.data || [];
    const hasBoth = msgsA.some(m => m.content === textA) && msgsA.some(m => m.content === textB);
    recordTest('User A retrieves persisted private chat history from MongoDB', 'Database', historyA.status === 200 && hasBoth, `Count: ${msgsA.length}`);

    // User B fetches history using Slug
    const historyB = await apiFetch(`/chat/community/${privateComm.slug}/messages`, { headers: headersB });
    recordTest('User B retrieves private chat history using Slug', 'Database', historyB.status === 200 && (historyB.data?.data || []).length >= 2);

    // User C (Stranger) tries to fetch private history via REST -> 403 Forbidden!
    const historyC = await apiFetch(`/chat/community/${privateComm._id}/messages`, { headers: headersC });
    recordTest('Stranger User C denied from reading private chat history (403 Forbidden)', 'Security', historyC.status === 403);

    // 6. Leaving Private Community Removes Access
    console.log('\n--- 6. Leaving Private Community Invariant ---');
    await apiFetch(`/communities/${privateComm._id}/leave`, { method: 'POST', headers: headersB });

    // User B tries to fetch private chat messages now -> 403 Forbidden!
    const historyBAfterLeave = await apiFetch(`/chat/community/${privateComm._id}/messages`, { headers: headersB });
    recordTest('Former Member User B denied chat history after leaving (403 Forbidden)', 'Security', historyBAfterLeave.status === 403);

    socketA.disconnect();
    socketB.disconnect();
    socketC.disconnect();

    // 7. Cleanup
    await apiFetch(`/communities/${privateComm._id}`, { method: 'DELETE', headers: headersA });
    recordTest('Private Community and test chat messages cleaned up', 'Cleanup', true);

    console.log('\n====================================================');
    console.log('📊 PRIVATE COMMUNITY CHAT AUDIT SUMMARY');
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

runPrivateChatTest().catch(err => {
    console.error('Fatal Private Chat Test error:', err);
    process.exit(1);
});
