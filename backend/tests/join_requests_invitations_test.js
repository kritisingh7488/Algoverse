require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const Community = require('../models/Community');
const User = require('../models/User');
const CommunityRequest = require('../models/CommunityRequest');

const { generateToken } = require('../utils/jwt');

const API_BASE = 'http://localhost:5000/api/v1';

let passedTests = 0;
let totalTests = 0;

function recordTest(name, category, passed, details = '') {
    totalTests++;
    if (passed) {
        passedTests++;
        console.log(`✅ PASS [${category}] ${name} ${details ? '(' + details + ')' : ''}`);
    } else {
        console.error(`❌ FAIL [${category}] ${name} ${details ? '-> ' + details : ''}`);
    }
}

async function apiFetch(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
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

async function runJoinRequestsAndInvitationsSuite() {
    console.log('====================================================');
    console.log('🛡️ PHASE 5A: JOIN REQUESTS & INVITATIONS AUDIT');
    console.log('====================================================\n');

    await mongoose.connect(process.env.MONGODB_URI);

    const timestamp = Date.now().toString().slice(-6);

    // 1. Create 3 test users in MongoDB
    console.log('--- 1. Multi-User Authentication Setup ---');
    const userAData = {
        fullName: 'Creator A',
        username: `founder_${timestamp}`,
        email: `founder_${timestamp}@algoverse.com`,
        password: 'Password123!',
        role: 'user'
    };
    const userBData = {
        fullName: 'Applicant B',
        username: `applicant_${timestamp}`,
        email: `applicant_${timestamp}@algoverse.com`,
        password: 'Password123!',
        role: 'user'
    };
    const userCData = {
        fullName: 'Invitee C',
        username: `invitee_${timestamp}`,
        email: `invitee_${timestamp}@algoverse.com`,
        password: 'Password123!',
        role: 'user'
    };

    const [userA, userB, userC] = await Promise.all([
        User.create(userAData),
        User.create(userBData),
        User.create(userCData)
    ]);

    const tokenA = generateToken(userA._id);
    const tokenB = generateToken(userB._id);
    const tokenC = generateToken(userC._id);

    const authHeadersA = { Authorization: `Bearer ${tokenA}` };
    const authHeadersB = { Authorization: `Bearer ${tokenB}` };
    const authHeadersC = { Authorization: `Bearer ${tokenC}` };

    recordTest('User A (Creator) registered & JWT obtained', 'Auth', !!tokenA);
    recordTest('User B (Applicant) registered & JWT obtained', 'Auth', !!tokenB);
    recordTest('User C (Invitee/Stranger) registered & JWT obtained', 'Auth', !!tokenC);

    // 2. User A creates a Private Community
    console.log('\n--- 2. Private Community Creation ---');
    const commPayload = {
        name: `Private Research Lab ${timestamp}`,
        description: 'Exclusive guild for advanced algorithmic research and competitive programming.',
        category: 'Algorithms',
        isPrivate: true
    };
    const createRes = await apiFetch('/communities', {
        method: 'POST',
        headers: authHeadersA,
        body: commPayload
    });
    const community = createRes.data?.data;
    recordTest('User A creates Private Community in MongoDB', 'Community', createRes.status === 201 && community?.isPrivate === true, `Slug: ${community?.slug}`);

    // 3. User B sends join request
    console.log('\n--- 3. Join Request Submission & Status Tracking ---');
    const joinReqRes = await apiFetch(`/communities/${community.slug}/join-request`, {
        method: 'POST',
        headers: authHeadersB,
        body: { message: 'I have 5 years of C++ DSA experience and want to contribute.' }
    });
    const joinReqDoc = joinReqRes.data?.data;
    recordTest('User B submits join request with message', 'Join Request', joinReqRes.status === 201 && joinReqDoc?.status === 'pending', `Request ID: ${joinReqDoc?._id}`);

    // Check status endpoint
    const statusBRes = await apiFetch(`/communities/${community.slug}/join-request/status`, { headers: authHeadersB });
    recordTest('User B status returns pending', 'Join Request', statusBRes.status === 200 && statusBRes.data?.status === 'pending');

    // Duplicate join request is rejected
    const dupReqRes = await apiFetch(`/communities/${community.slug}/join-request`, {
        method: 'POST',
        headers: authHeadersB,
        body: { message: 'Trying again' }
    });
    recordTest('Duplicate join request is rejected (400 Bad Request)', 'Validation', dupReqRes.status === 400);

    // 4. Authorization Matrix for Join Requests
    console.log('\n--- 4. Join Requests Authorization Matrix ---');
    // Stranger User C cannot view join requests
    const listCRes = await apiFetch(`/communities/${community.slug}/join-requests`, { headers: authHeadersC });
    recordTest('Stranger User C denied from viewing join requests (403 Forbidden)', 'Security', listCRes.status === 403);

    // Creator User A can view join requests
    const listARes = await apiFetch(`/communities/${community.slug}/join-requests`, { headers: authHeadersA });
    const requestsList = listARes.data?.data || [];
    const foundReqB = requestsList.find(r => r._id === joinReqDoc._id);
    recordTest('Creator User A retrieves pending join requests list', 'Join Request', listARes.status === 200 && !!foundReqB && foundReqB.user?.username === userBData.username);

    // Stranger User C cannot approve User B's request
    const approveCRes = await apiFetch(`/communities/${community.slug}/join-requests/${joinReqDoc._id}/approve`, {
        method: 'POST',
        headers: authHeadersC
    });
    recordTest('Stranger User C denied from approving request (403 Forbidden)', 'Security', approveCRes.status === 403);

    // 5. Creator User A approves User B's request
    console.log('\n--- 5. Approval & Membership Synchronization ---');
    const approveARes = await apiFetch(`/communities/${community.slug}/join-requests/${joinReqDoc._id}/approve`, {
        method: 'POST',
        headers: authHeadersA
    });
    recordTest('Creator User A approves User B join request (200 OK)', 'Join Request', approveARes.status === 200);

    // Verify User B is now in community members in MongoDB
    const commAfterApprove = await apiFetch(`/communities/${community.slug}`, { headers: authHeadersB });
    const isMemberB = commAfterApprove.data?.data?.isJoined === true;
    const membersCountAfter = commAfterApprove.data?.data?.membersCount;
    recordTest('Database Invariant: User B added to community members & isJoined=true', 'Integrity', isMemberB && membersCountAfter === 2, `Members Count: ${membersCountAfter}`);

    // 6. Direct Invitations Flow
    console.log('\n--- 6. Direct Community Invitations Flow ---');
    // Creator User A invites User C by username
    const inviteRes = await apiFetch(`/communities/${community.slug}/invitations`, {
        method: 'POST',
        headers: authHeadersA,
        body: {
            username: userCData.username,
            message: 'We would love to have your graph algorithms expertise!'
        }
    });
    const inviteDoc = inviteRes.data?.data;
    recordTest('Creator User A sends invitation to User C by username (201 Created)', 'Invitations', inviteRes.status === 201 && inviteDoc?.status === 'pending');

    // User C checks my invitations
    const myInvitesRes = await apiFetch('/communities/my/invitations', { headers: authHeadersC });
    const userCInvites = myInvitesRes.data?.data || [];
    const foundInvite = userCInvites.find(i => i._id === inviteDoc._id);
    recordTest('User C retrieves pending invitation in my invitations list', 'Invitations', myInvitesRes.status === 200 && !!foundInvite && foundInvite.community?.name === commPayload.name);

    // User C accepts invitation
    const acceptRes = await apiFetch(`/communities/invitations/${inviteDoc._id}/accept`, {
        method: 'POST',
        headers: authHeadersC
    });
    recordTest('User C accepts invitation via POST /invitations/:id/accept (200 OK)', 'Invitations', acceptRes.status === 200);

    // Verify User C is now member and count is 3
    const commAfterAccept = await apiFetch(`/communities/${community.slug}`, { headers: authHeadersC });
    const isMemberC = commAfterAccept.data?.data?.isJoined === true;
    const finalMembersCount = commAfterAccept.data?.data?.membersCount;
    recordTest('Database Invariant: User C added to members roster (membersCount === 3)', 'Integrity', isMemberC && finalMembersCount === 3, `Members Count: ${finalMembersCount}`);

    // 7. Request Rejection Flow
    console.log('\n--- 7. Join Request Rejection Flow ---');
    const comm2Res = await apiFetch('/communities', {
        method: 'POST',
        headers: authHeadersA,
        body: {
            name: `Private Reject Test Lab ${timestamp}`,
            description: 'Private community testing rejection flow invariants.',
            category: 'DSA',
            isPrivate: true
        }
    });
    const comm2 = comm2Res.data?.data;
    const req2Res = await apiFetch(`/communities/${comm2.slug}/join-request`, {
        method: 'POST',
        headers: authHeadersB,
        body: { message: 'Can I join?' }
    });
    const req2Id = req2Res.data?.data?._id;

    const rejectRes = await apiFetch(`/communities/${comm2.slug}/join-requests/${req2Id}/reject`, {
        method: 'POST',
        headers: authHeadersA
    });
    recordTest('Creator User A rejects User B join request', 'Join Request', rejectRes.status === 200 && rejectRes.data?.data?.status === 'rejected');

    // Verify User B is NOT in comm2 members
    const comm2Check = await apiFetch(`/communities/${comm2.slug}`, { headers: authHeadersB });
    recordTest('Database Invariant: Rejected applicant is NOT a member (403 Forbidden)', 'Security', comm2Check.status === 403);

    // 8. Request Cancellation Flow
    console.log('\n--- 8. Join Request Cancellation Flow ---');
    const comm3Res = await apiFetch('/communities', {
        method: 'POST',
        headers: authHeadersA,
        body: {
            name: `Private Cancel Test Lab ${timestamp}`,
            description: 'Private community testing cancellation flow.',
            category: 'C++',
            isPrivate: true
        }
    });
    const comm3 = comm3Res.data?.data;
    await apiFetch(`/communities/${comm3.slug}/join-request`, {
        method: 'POST',
        headers: authHeadersB
    });

    const cancelRes = await apiFetch(`/communities/${comm3.slug}/join-request`, {
        method: 'DELETE',
        headers: authHeadersB
    });
    recordTest('Applicant User B cancels own join request (200 OK)', 'Join Request', cancelRes.status === 200);

    // 9. Decline Invitation Flow
    console.log('\n--- 9. Decline Invitation Flow ---');
    const invite2Res = await apiFetch(`/communities/${comm3.slug}/invitations`, {
        method: 'POST',
        headers: authHeadersA,
        body: { username: userBData.username }
    });
    const invite2Id = invite2Res.data?.data?._id;

    const declineRes = await apiFetch(`/communities/invitations/${invite2Id}/decline`, {
        method: 'POST',
        headers: authHeadersB
    });
    recordTest('User B declines community invitation (200 OK)', 'Invitations', declineRes.status === 200);

    // 10. Database Cleanup
    console.log('\n--- 10. Cleanup & Teardown ---');
    if (community?._id) {
        await Community.deleteMany({ _id: { $in: [community._id, comm2?._id, comm3?._id] } });
        await CommunityRequest.deleteMany({ community: { $in: [community._id, comm2?._id, comm3?._id] } });
    }
    await User.deleteMany({ _id: { $in: [userA._id, userB._id, userC._id] } });
    recordTest('Test communities, requests, and accounts cleaned up from MongoDB', 'Cleanup', true);

    console.log('\n====================================================');
    console.log('📊 PHASE 5A AUDIT SUMMARY');
    console.log('====================================================');
    console.log(`Total Checks: ${totalTests}`);
    console.log(`Passed:       ${passedTests}`);
    console.log(`Failed:       ${totalTests - passedTests}`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);

    if (passedTests === totalTests) {
        process.exit(0);
    } else {
        process.exit(1);
    }
}

runJoinRequestsAndInvitationsSuite().catch((err) => {
    console.error('Fatal error running Phase 5A test suite:', err);
    process.exit(1);
});
