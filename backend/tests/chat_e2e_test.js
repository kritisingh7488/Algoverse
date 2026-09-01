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

async function runChatVerification() {
    console.log('====================================================');
    console.log('💬 REAL-TIME CHAT & SOCKET.IO VERIFICATION');
    console.log('====================================================\n');

    // 1. Create Test User & Login
    console.log('--- 1. Authentication & JWT Setup ---');
    const timestamp = Date.now().toString().slice(-5);
    const testEmail = `chat_user_${timestamp}@algoverse.com`;
    const testPassword = 'Password123!';

    const regRes = await apiFetch('/auth/register', {
        method: 'POST',
        body: {
            fullName: 'Chat Tester',
            username: `chatter_${timestamp}`,
            email: testEmail,
            password: testPassword
        }
    });

    const token = regRes.data?.token || regRes.data?.data?.token;
    recordTest('Register test chat user & obtain JWT', 'Auth', !!token, `Token length: ${token?.length}`);

    const authHeaders = { Authorization: `Bearer ${token}` };

    // 2. REST API: Get Global Channel Messages
    console.log('\n--- 2. REST Chat Endpoints ---');
    const getGlobalRes = await apiFetch('/chat/global/general/messages');
    recordTest('GET /api/v1/chat/global/general/messages returns 200 OK', 'REST API', getGlobalRes.status === 200 && Array.isArray(getGlobalRes.data?.data));

    // 3. REST API: Send Message via POST
    const restMsgContent = `REST Post Test Message at ${timestamp}`;
    const sendRestRes = await apiFetch('/chat/global/general/messages', {
        method: 'POST',
        headers: authHeaders,
        body: {
            content: restMsgContent,
            codeSnippet: { language: 'cpp', code: 'int x = 42;' }
        }
    });
    const restMsg = sendRestRes.data?.data;
    recordTest('POST /api/v1/chat/global/general/messages creates message', 'REST API', sendRestRes.status === 201 && restMsg?.content === restMsgContent, `ID: ${restMsg?._id}`);

    // 4. Socket.IO Connection & Presence
    console.log('\n--- 3. Socket.IO Real-Time Engine & Presence ---');
    let socketConnected = false;
    let presenceCount = 0;

    const socket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling']
    });

    await new Promise((resolve) => {
        socket.on('connect', () => {
            socketConnected = true;
        });

        socket.on('online_presence', (data) => {
            presenceCount = data?.count || 0;
            resolve();
        });

        setTimeout(resolve, 3000);
    });

    recordTest('Socket.IO connects with JWT auth', 'Socket.IO', socketConnected);
    recordTest('Presence broadcast emits accurate online count', 'Socket.IO', presenceCount >= 1, `Count: ${presenceCount}`);

    // 5. Join Room & Send Real-Time Message
    console.log('\n--- 4. Real-Time Room Messaging & Event Broadcast ---');
    let receivedNewMessage = null;

    socket.emit('join_room', { room: 'global:general' });

    socket.on('new_message', (payload) => {
        if (payload?.message?.content?.includes(timestamp)) {
            receivedNewMessage = payload.message;
        }
    });

    const socketMsgContent = `Live Socket Message: Dijkstra shortest path verification ${timestamp}`;
    socket.emit('send_message', {
        roomType: 'global',
        channel: 'general',
        content: socketMsgContent,
        codeSnippet: { language: 'javascript', code: 'const d = new Map();' }
    });

    // Wait for message arrival
    await new Promise((resolve) => setTimeout(resolve, 2000));

    recordTest('Socket broadcasts new_message event to room', 'Socket.IO', !!receivedNewMessage && receivedNewMessage.content === socketMsgContent, `Sender: ${receivedNewMessage?.sender?.username}`);

    // 6. Verify MongoDB Atlas Persistence of Socket Message
    console.log('\n--- 5. MongoDB Atlas Persistence Check ---');
    const verifyFetchRes = await apiFetch('/chat/global/general/messages');
    const savedList = verifyFetchRes.data?.data || [];
    const foundInDb = savedList.some(m => m.content === socketMsgContent);
    recordTest('Socket message persisted in MongoDB Atlas', 'Database', foundInDb);

    // 7. Community Chat Room Access Check
    console.log('\n--- 6. Community Chat Room Access ---');
    const commRes = await apiFetch('/communities');
    const firstComm = commRes.data?.data?.[0];

    if (firstComm) {
        const commMsgRes = await apiFetch(`/chat/community/${firstComm.slug || firstComm._id}/messages`, { headers: authHeaders });
        recordTest('Fetch Community Chat Room messages via API', 'Community Chat', commMsgRes.status === 200 && Array.isArray(commMsgRes.data?.data));
    }

    socket.disconnect();

    console.log('\n====================================================');
    console.log('📊 REAL-TIME CHAT TEST SUMMARY');
    console.log('====================================================');
    const total = results.length;
    const passed = results.filter(r => r.passed).length;
    const failed = total - passed;

    console.log(`Total Chat Tests: ${total}`);
    console.log(`Passed:           ${passed}`);
    console.log(`Failed:           ${failed}`);
    console.log(`Success Rate:     ${((passed / total) * 100).toFixed(1)}%\n`);

    if (failed > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

runChatVerification().catch(err => {
    console.error('Fatal Chat Test error:', err);
    process.exit(1);
});
