const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Community = require('../models/Community');
const { generateToken } = require('../utils/jwt');

// Test Configuration & Helpers
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}/api/v1/communities`;

const results = [];

function recordTest(name, category, passed, details = '') {
    results.push({ name, category, passed, details });
    const icon = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${icon} [${category}] ${name} ${details ? '(' + details + ')' : ''}`);
}

// HTTP Request Helper
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
    console.log('🚀 STARTING REAL BACKEND COMMUNITY VERIFICATION');
    console.log('====================================================\n');

    // 1. Connect to MongoDB
    try {
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected to MongoDB Atlas successfully.\n');
    } catch (err) {
        console.error('FATAL: Could not connect to MongoDB:', err.message);
        console.log('MONGODB E2E TEST NOT RUN');
        process.exit(1);
    }

    // 2. Setup Test Users
    const timestamp = Date.now().toString().slice(-5);
    const userAData = {
        fullName: 'Test User A',
        username: `usera_${timestamp}`,
        email: `usera_${timestamp}@algoverse.com`,
        password: 'Password123!',
        role: 'user'
    };
    const userBData = {
        fullName: 'Test User B',
        username: `userb_${timestamp}`,
        email: `userb_${timestamp}@algoverse.com`,
        password: 'Password123!',
        role: 'user'
    };
    const adminData = {
        fullName: 'Test Admin',
        username: `admin_${timestamp}`,
        email: `admin_${timestamp}@algoverse.com`,
        password: 'Password123!',
        role: 'admin'
    };

    const [userA, userB, adminUser] = await Promise.all([
        User.create(userAData),
        User.create(userBData),
        User.create(adminData)
    ]);

    const tokenA = generateToken(userA._id);
    const tokenB = generateToken(userB._id);
    const tokenAdmin = generateToken(adminUser._id);
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1NiIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoxNjAwMDAwMDAwfQ.invalid_signature';

    let testCommunity = null;
    let privateCommunity = null;

    // --- TEST SUITE 1: CRUD & Persistence ---
    console.log('\n--- 1. MongoDB CRUD & Persistence ---');
    try {
        // Create
        const createRes = await apiRequest('/api/v1/communities', {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenA}` },
            body: {
                name: `Verification Guild ${timestamp}`,
                description: 'A comprehensive guild for real backend verification test.',
                category: 'Algorithms',
                icon: '🚀',
                rules: ['Be helpful', 'Solve DSA daily']
            }
        });
        const createPass = createRes.status === 201 && createRes.data?.success && createRes.data?.data?.slug;
        recordTest('Create Community in MongoDB', 'CRUD', createPass, `Status: ${createRes.status}`);
        testCommunity = createRes.data?.data;

        // Fetch by Slug
        const fetchRes = await apiRequest(`/api/v1/communities/${testCommunity.slug}`);
        const fetchPass = fetchRes.status === 200 && fetchRes.data?.data?.name === `Verification Guild ${timestamp}`;
        recordTest('Fetch Community by Slug', 'CRUD', fetchPass, `Status: ${fetchRes.status}`);

        // Fetch by ID
        const fetchByIdRes = await apiRequest(`/api/v1/communities/${testCommunity._id || testCommunity.id}`);
        const fetchByIdPass = fetchByIdRes.status === 200 && fetchByIdRes.data?.data?.slug === testCommunity.slug;
        recordTest('Fetch Community by MongoDB ID', 'CRUD', fetchByIdPass, `Status: ${fetchByIdRes.status}`);

        // Update
        const updateRes = await apiRequest(`/api/v1/communities/${testCommunity._id || testCommunity.id}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${tokenA}` },
            body: {
                name: `Verification Guild Updated ${timestamp}`,
                description: 'Updated description for persistence verification.'
            }
        });
        const updatePass = updateRes.status === 200 && updateRes.data?.data?.name === `Verification Guild Updated ${timestamp}`;
        recordTest('Update Community in MongoDB', 'CRUD', updatePass, `Status: ${updateRes.status}`);

        // Fetch Updated
        const fetchUpdatedRes = await apiRequest(`/api/v1/communities/${testCommunity._id || testCommunity.id}`);
        const fetchUpdatedPass = fetchUpdatedRes.status === 200 && fetchUpdatedRes.data?.data?.description === 'Updated description for persistence verification.';
        recordTest('Fetch Updated Community', 'CRUD', fetchUpdatedPass);

    } catch (err) {
        recordTest('CRUD Execution', 'CRUD', false, err.message);
    }

    // --- TEST SUITE 2: Join / Leave & Concurrency Integrity ---
    console.log('\n--- 2. Join / Leave & Invariant Tests ---');
    try {
        const commId = testCommunity._id || testCommunity.id;

        // User B Joins
        const joinRes1 = await apiRequest(`/api/v1/communities/${commId}/join`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenB}` }
        });
        const join1Pass = joinRes1.status === 200 && joinRes1.data?.data?.isJoined === true && joinRes1.data?.data?.membersCount === 2;
        recordTest('User B First Join (membersCount increases)', 'Join/Leave', join1Pass, `membersCount: ${joinRes1.data?.data?.membersCount}`);

        // User B Joins Again (Duplicate join)
        const joinRes2 = await apiRequest(`/api/v1/communities/${commId}/join`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenB}` }
        });
        const join2Pass = joinRes2.status === 200 && joinRes2.data?.data?.membersCount === 2;
        recordTest('User B Duplicate Join (No count increase or duplicates)', 'Join/Leave', join2Pass, `membersCount: ${joinRes2.data?.data?.membersCount}`);

        // User B Leaves
        const leaveRes1 = await apiRequest(`/api/v1/communities/${commId}/leave`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenB}` }
        });
        const leave1Pass = leaveRes1.status === 200 && leaveRes1.data?.data?.isJoined === false && leaveRes1.data?.data?.membersCount === 1;
        recordTest('User B Leave (membersCount decreases)', 'Join/Leave', leave1Pass, `membersCount: ${leaveRes1.data?.data?.membersCount}`);

        // User B Leaves Again (Duplicate leave)
        const leaveRes2 = await apiRequest(`/api/v1/communities/${commId}/leave`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenB}` }
        });
        const leave2Pass = leaveRes2.status === 200 && leaveRes2.data?.data?.membersCount === 1;
        recordTest('User B Duplicate Leave (No negative count)', 'Join/Leave', leave2Pass, `membersCount: ${leaveRes2.data?.data?.membersCount}`);

        // Creator attempts to leave
        const creatorLeaveRes = await apiRequest(`/api/v1/communities/${commId}/leave`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenA}` }
        });
        const creatorLeavePass = creatorLeaveRes.status === 400;
        recordTest('Creator Leave Rejected (400 Bad Request)', 'Join/Leave', creatorLeavePass, `Status: ${creatorLeaveRes.status}`);

        // Direct DB Invariant Check
        const dbDoc = await Community.findById(commId);
        const invariantPass = dbDoc && dbDoc.membersCount === dbDoc.members.length;
        recordTest('Invariant Check: membersCount === members.length in MongoDB', 'Join/Leave', invariantPass, `DB count: ${dbDoc?.membersCount}, members: ${dbDoc?.members.length}`);

    } catch (err) {
        recordTest('Join/Leave Suite', 'Join/Leave', false, err.message);
    }

    // --- TEST SUITE 3: Authentication Verification ---
    console.log('\n--- 3. Authentication Verification ---');
    try {
        // No auth header on protected POST
        const noAuthRes = await apiRequest('/api/v1/communities', {
            method: 'POST',
            body: { name: 'Unauthorized Guild', description: 'Testing auth' }
        });
        recordTest('Protected endpoint without token returns 401', 'Auth', noAuthRes.status === 401);

        // Invalid JWT token
        const invalidTokenRes = await apiRequest('/api/v1/communities', {
            method: 'POST',
            headers: { Authorization: 'Bearer invalid_garbage_token' },
            body: { name: 'Invalid Token Guild', description: 'Testing auth' }
        });
        recordTest('Protected endpoint with invalid token returns 401', 'Auth', invalidTokenRes.status === 401);

        // Expired/Forged JWT token
        const expiredRes = await apiRequest('/api/v1/communities', {
            method: 'POST',
            headers: { Authorization: `Bearer ${expiredToken}` },
            body: { name: 'Expired Token Guild', description: 'Testing auth' }
        });
        recordTest('Protected endpoint with expired token returns 401', 'Auth', expiredRes.status === 401);

        // Valid JWT token
        const validRes = await apiRequest('/api/v1/communities/my', {
            headers: { Authorization: `Bearer ${tokenA}` }
        });
        recordTest('Protected endpoint with valid token returns 200', 'Auth', validRes.status === 200 && Array.isArray(validRes.data?.data));

    } catch (err) {
        recordTest('Auth Suite', 'Auth', false, err.message);
    }

    // --- TEST SUITE 4: Authorization Verification ---
    console.log('\n--- 4. Authorization Verification ---');
    try {
        const commId = testCommunity._id || testCommunity.id;

        // User B attempts to update User A's community
        const unauthUpdateRes = await apiRequest(`/api/v1/communities/${commId}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${tokenB}` },
            body: { name: 'Hacked by User B' }
        });
        recordTest('Non-owner User B update rejected (403 Forbidden)', 'Authorization', unauthUpdateRes.status === 403);

        // User B attempts to delete User A's community
        const unauthDeleteRes = await apiRequest(`/api/v1/communities/${commId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${tokenB}` }
        });
        recordTest('Non-owner User B delete rejected (403 Forbidden)', 'Authorization', unauthDeleteRes.status === 403);

        // Admin updates User A's community
        const adminUpdateRes = await apiRequest(`/api/v1/communities/${commId}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${tokenAdmin}` },
            body: { description: 'Admin moderated description' }
        });
        recordTest('Platform Admin update allowed (200 OK)', 'Authorization', adminUpdateRes.status === 200);

    } catch (err) {
        recordTest('Authorization Suite', 'Authorization', false, err.message);
    }

    // --- TEST SUITE 5: Private Community Access Rules ---
    console.log('\n--- 5. Private Community Access Rules ---');
    try {
        // Creator A creates a Private Community
        const privRes = await apiRequest('/api/v1/communities', {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenA}` },
            body: {
                name: `Secret Guild ${timestamp}`,
                description: 'A private study group with restricted access.',
                category: 'Competitive Programming',
                isPrivate: true
            }
        });
        privateCommunity = privRes.data?.data;
        const privId = privateCommunity._id || privateCommunity.id;

        // Guest viewer (no auth) -> 403
        const guestViewRes = await apiRequest(`/api/v1/communities/${privId}`);
        recordTest('Guest viewer denied private details (403 Forbidden)', 'Private Access', guestViewRes.status === 403);

        // Non-member User B -> 403
        const userBViewRes = await apiRequest(`/api/v1/communities/${privId}`, {
            headers: { Authorization: `Bearer ${tokenB}` }
        });
        recordTest('Non-member User B denied private details (403 Forbidden)', 'Private Access', userBViewRes.status === 403);

        // Creator User A -> 200
        const creatorViewRes = await apiRequest(`/api/v1/communities/${privId}`, {
            headers: { Authorization: `Bearer ${tokenA}` }
        });
        recordTest('Creator User A allowed private details (200 OK)', 'Private Access', creatorViewRes.status === 200);

        // Admin User -> 200
        const adminViewRes = await apiRequest(`/api/v1/communities/${privId}`, {
            headers: { Authorization: `Bearer ${tokenAdmin}` }
        });
        recordTest('Platform Admin allowed private details (200 OK)', 'Private Access', adminViewRes.status === 200);

    } catch (err) {
        recordTest('Private Access Suite', 'Private Access', false, err.message);
    }

    // --- TEST SUITE 6: Optional Auth & isJoined Detection ---
    console.log('\n--- 6. Optional Auth / isJoined Detection ---');
    try {
        const commId = testCommunity._id || testCommunity.id;

        // Guest view
        const guestCommRes = await apiRequest(`/api/v1/communities/${commId}`);
        recordTest('Guest view: isJoined is false', 'Optional Auth', guestCommRes.data?.data?.isJoined === false);

        // Member/Creator view
        const memberCommRes = await apiRequest(`/api/v1/communities/${commId}`, {
            headers: { Authorization: `Bearer ${tokenA}` }
        });
        recordTest('Authenticated Member view: isJoined is true', 'Optional Auth', memberCommRes.data?.data?.isJoined === true);

        // Authenticated Non-member view
        const nonMemberCommRes = await apiRequest(`/api/v1/communities/${commId}`, {
            headers: { Authorization: `Bearer ${tokenB}` }
        });
        recordTest('Authenticated Non-Member view: isJoined is false', 'Optional Auth', nonMemberCommRes.data?.data?.isJoined === false);

    } catch (err) {
        recordTest('Optional Auth Suite', 'Optional Auth', false, err.message);
    }

    // --- TEST SUITE 7: Search, Filtering & Pagination ---
    console.log('\n--- 7. Search, Filtering & Pagination ---');
    try {
        // Search by name
        const searchRes = await apiRequest(`/api/v1/communities?search=Verification`);
        recordTest('Search query returns matching records', 'Search/Filter', searchRes.status === 200 && searchRes.data?.count >= 1);

        // Category filter
        const categoryRes = await apiRequest(`/api/v1/communities?category=Algorithms`);
        recordTest('Category filter returns category records', 'Search/Filter', categoryRes.status === 200 && searchRes.data?.data.every(c => c.category === 'Algorithms'));

        // Sorting: Newest
        const sortRes = await apiRequest(`/api/v1/communities?sort=new`);
        recordTest('Sort by newest succeeds', 'Search/Filter', sortRes.status === 200 && Array.isArray(sortRes.data?.data));

        // Pagination: Page 1 with limit 2
        const page1Res = await apiRequest(`/api/v1/communities?limit=2&page=1`);
        recordTest('Pagination limit=2 returns at most 2 items', 'Pagination', page1Res.status === 200 && page1Res.data?.data?.length <= 2);

        // Page beyond results
        const pageBeyondRes = await apiRequest(`/api/v1/communities?page=999`);
        recordTest('Page beyond available returns empty array', 'Pagination', pageBeyondRes.status === 200 && pageBeyondRes.data?.data?.length === 0);

    } catch (err) {
        recordTest('Search/Filter Suite', 'Search/Filter', false, err.message);
    }

    // --- TEST SUITE 8: Slug Generation & Lookup ---
    console.log('\n--- 8. Slug Generation & Duplicate Handling ---');
    try {
        // Create with spaces & special characters
        const slugRes1 = await apiRequest('/api/v1/communities', {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenA}` },
            body: {
                name: `C++ & Python DSA Master!! ${timestamp}`,
                description: 'Testing slug generation with special symbols.',
                category: 'C++'
            }
        });
        const slug1 = slugRes1.data?.data?.slug;
        const validSlugPass = slug1 && !slug1.includes(' ') && !slug1.includes('&') && !slug1.includes('!');
        recordTest('Special characters sanitized in slug', 'Slugs', validSlugPass, `Slug: ${slug1}`);

        // Create with duplicate name
        const slugRes2 = await apiRequest('/api/v1/communities', {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenA}` },
            body: {
                name: `C++ & Python DSA Master!! ${timestamp}`,
                description: 'Testing duplicate slug deduplication.',
                category: 'C++'
            }
        });
        const slug2 = slugRes2.data?.data?.slug;
        const uniqueSlugPass = slug2 && slug2 !== slug1 && slug2.startsWith(slug1);
        recordTest('Duplicate community name generates unique slug suffix', 'Slugs', uniqueSlugPass, `Slug 2: ${slug2}`);

        // Cleanup created test guilds
        if (slugRes1.data?.data?._id) await Community.findByIdAndDelete(slugRes1.data.data._id);
        if (slugRes2.data?.data?._id) await Community.findByIdAndDelete(slugRes2.data.data._id);

    } catch (err) {
        recordTest('Slug Suite', 'Slugs', false, err.message);
    }

    // --- TEST SUITE 9: Cleanup & Final Delete ---
    console.log('\n--- 9. Cleanup & Deletion Verification ---');
    try {
        if (testCommunity) {
            const delRes = await apiRequest(`/api/v1/communities/${testCommunity._id || testCommunity.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${tokenA}` }
            });
            recordTest('Owner can delete community (200 OK)', 'CRUD', delRes.status === 200);

            const verifyDeleted = await Community.findById(testCommunity._id || testCommunity.id);
            recordTest('Community permanently removed from MongoDB', 'CRUD', verifyDeleted === null);
        }

        if (privateCommunity) {
            await Community.findByIdAndDelete(privateCommunity._id || privateCommunity.id);
        }

        // Remove test users
        await Promise.all([
            User.findByIdAndDelete(userA._id),
            User.findByIdAndDelete(userB._id),
            User.findByIdAndDelete(adminUser._id)
        ]);
        console.log('Test artifacts and mock users cleaned up.\n');

    } catch (err) {
        console.error('Error during cleanup:', err);
    }

    // Summary Table
    console.log('====================================================');
    console.log('📊 TEST EXECUTION SUMMARY');
    console.log('====================================================');
    const total = results.length;
    const passed = results.filter(r => r.passed).length;
    const failed = total - passed;

    console.log(`Total Tests Run: ${total}`);
    console.log(`Passed:         ${passed}`);
    console.log(`Failed:         ${failed}`);
    console.log(`Success Rate:   ${((passed / total) * 100).toFixed(1)}%\n`);

    await mongoose.disconnect();
    if (failed > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

runTests().catch(err => {
    console.error('Fatal test runner error:', err);
    process.exit(1);
});
