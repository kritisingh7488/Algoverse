const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Community = require('../models/Community');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const MONGODB_URI = process.env.MONGODB_URI;

const INITIAL_COMMUNITIES = [
  {
    name: 'C++ Beginners',
    slug: 'cpp-beginners',
    description: 'Learn modern C++, STL containers, pointers, memory management, and write clean algorithm solutions from scratch.',
    category: 'C++',
    icon: '⚡',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    accentColor: '#3B82F6',
    isPrivate: false,
    isTrending: true,
    trendingRank: 1,
    isVerified: true,
    tags: ['C++', 'STL', 'Pointers', 'OOP', 'Clean Code'],
    about: 'C++ Beginners is a friendly haven for students and engineers starting their journey with C++. We focus on understanding low-level memory, standard template library internals, and building high-performance DSA solutions.',
    rules: [
      'Be welcoming to beginners asking fundamental syntax or memory questions.',
      'Format all code snippets properly with comments.',
      'Explain the intuition behind pointer and reference semantics.',
      'Cite time and space complexity when presenting solutions.'
    ]
  },
  {
    name: 'DSA Daily',
    slug: 'dsa-daily',
    description: 'Solve one curated data structures & algorithms problem every day. Daily hints, multiple approach reviews, and complexity breakdowns.',
    category: 'DSA',
    icon: '🔥',
    gradient: 'from-amber-500/20 to-orange-500/20',
    accentColor: '#F59E0B',
    isPrivate: false,
    isTrending: true,
    trendingRank: 2,
    isVerified: true,
    tags: ['DSA', 'LeetCode', 'Daily Challenge', 'Two Pointers', 'Sliding Window'],
    about: 'DSA Daily is a community committed to consistency. We pick one high-value problem each day spanning arrays, linked lists, trees, graphs, and dynamic programming.',
    rules: [
      'Share your own intuition before looking up optimal solutions.',
      'Discuss edge cases, constraints, and time/space trade-offs.',
      'Encourage peers who are struggling with problem patterns.'
    ]
  },
  {
    name: 'Competitive Programming Hub',
    slug: 'competitive-programming-hub',
    description: 'Level up for Codeforces, LeetCode Biweekly/Weekly contests, CodeChef, and AtCoder with advanced algorithmic techniques.',
    category: 'Competitive Programming',
    icon: '🏆',
    gradient: 'from-purple-500/20 to-pink-500/20',
    accentColor: '#8B5CF6',
    isPrivate: false,
    isTrending: true,
    trendingRank: 3,
    isVerified: true,
    tags: ['Codeforces', 'Segment Trees', 'Binary Lifting', 'Combinatorics', 'DP on Trees'],
    about: 'Competitive Programming Hub is dedicated to competitive contest strategy, fast I/O, heavy math, advanced tree/graph techniques, and rapid debugging.',
    rules: [
      'No sharing solutions during active rated contests.',
      'Provide thorough editorial breakdowns during post-contest analysis.'
    ]
  },
  {
    name: 'Python Algorithms',
    slug: 'python-algorithms',
    description: 'Master Pythonic data structures, collections, heapq, itertools, and elegant algorithmic problem solving.',
    category: 'Python',
    icon: '🐍',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    accentColor: '#10B981',
    isPrivate: false,
    isTrending: false,
    trendingRank: 4,
    isVerified: true,
    tags: ['Python', 'Collections', 'Heapq', 'Recursion', 'Clean Code'],
    about: 'Explore idiomatic Python 3 for technical interviews and algorithmic puzzles.',
    rules: [
      'Write clean, readable Python with type annotations where helpful.',
      'Avoid obfuscated one-liners in explanations.'
    ]
  },
  {
    name: 'Java DSA Mastery',
    slug: 'java-dsa-mastery',
    description: 'In-depth Java Collections Framework, Generics, OOP system design, and Big-O algorithm analysis for enterprise & FAANG interviews.',
    category: 'Java',
    icon: '☕',
    gradient: 'from-red-500/20 to-amber-500/20',
    accentColor: '#EF4444',
    isPrivate: false,
    isTrending: false,
    trendingRank: 5,
    isVerified: true,
    tags: ['Java', 'Collections', 'HashMap Internals', 'Concurrency', 'Interviews'],
    about: 'Java DSA Mastery teaches data structures using idiomatic Java, exploring JVM memory, HashMap buckets, PriorityQueue, and thread-safe collections.',
    rules: [
      'Explain JVM memory nuances and object references.',
      'Be respectful and helpful to all developers.'
    ]
  },
  {
    name: 'Dynamic Programming Wizards',
    slug: 'dp-wizards',
    description: 'Demystify subproblems, state transitions, memoization tables, space optimization, and digit/bitmask DP.',
    category: 'Algorithms',
    icon: '🧙‍♂️',
    gradient: 'from-violet-500/20 to-purple-500/20',
    accentColor: '#7C3AED',
    isPrivate: false,
    isTrending: true,
    trendingRank: 6,
    isVerified: true,
    tags: ['Dynamic Programming', 'Memoization', 'Tabulation', 'Knapsack', 'LCS'],
    about: 'Master the art of dynamic programming from bottom-up recursion trees to space-optimized DP tables.',
    rules: [
      'Always clearly define the DP state: dp[i][j] = what?',
      'Clearly explain base cases and transition equations.'
    ]
  }
];

const SAMPLE_POSTS = [
  {
    communitySlug: 'cpp-beginners',
    title: 'Why std::vector::emplace_back is preferred over push_back in Modern C++',
    postType: 'Discussion',
    tags: ['c++', 'stl', 'memory', 'optimization'],
    content: `# Deep Dive: emplace_back vs push_back

When inserting elements into a \`std::vector\`, understanding how objects are constructed in-place makes a huge difference in performance.

## The Core Difference

\`push_back\` expects an already constructed object (or constructs a temporary object) and then moves or copies it into the vector's memory buffer.

\`emplace_back\` forwards its arguments directly to the constructor of the element type using **perfect forwarding** (\`std::forward\`), constructing the object directly in the uninitialized memory allocated by the vector.

\`\`\`cpp
struct Node {
    int val;
    std::string label;
    Node(int v, std::string l) : val(v), label(std::move(l)) {
        std::cout << "Constructed\\n";
    }
};

int main() {
    std::vector<Node> vec;
    vec.reserve(10);
    
    // push_back creates a temp then moves:
    vec.push_back(Node(1, "Alpha"));
    
    // emplace_back constructs directly in-place:
    vec.emplace_back(2, "Beta");
}
\`\`\`

### Complexity & Recommendation
* **Time Complexity**: \\(O(1)\\) amortized for both.
* **Space Overhead**: \\(O(1)\\) temporary overhead avoided with \`emplace_back\`.
* **Rule of thumb**: Use \`emplace_back\` whenever passing constructor arguments directly!`
  },
  {
    communitySlug: 'dsa-daily',
    title: 'Mastering the Two-Pointer Pattern: Opposite Ends vs Fast & Slow Pointers',
    postType: 'Code',
    tags: ['two-pointers', 'arrays', 'sliding-window', 'dsa'],
    content: `# The Two-Pointer Algorithm Blueprint

The two-pointer technique is one of the highest-frequency algorithmic patterns in technical interviews.

## 1. Opposite Ends (Converging Pointers)
Used on sorted arrays for search, palindrome verification, and Container With Most Water.

\`\`\`cpp
bool hasTwoSum(const std::vector<int>& sortedArr, int target) {
    int left = 0, right = sortedArr.size() - 1;
    while (left < right) {
        int sum = sortedArr[left] + sortedArr[right];
        if (sum == target) return true;
        if (sum < target) left++;
        else right--;
    }
    return false;
}
\`\`\`

## 2. Fast & Slow (Floyd's Cycle Detection)
Used in linked lists and array duplication cycles.

\`\`\`cpp
ListNode* detectCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return slow;
    }
    return nullptr;
}
\`\`\`

Let's discuss: Which problem gave you the biggest "aha!" moment with two pointers?`
  },
  {
    communitySlug: 'dp-wizards',
    title: '0/1 Knapsack Intuition: Recursive Tree to 1D Array Space Optimization',
    postType: 'Discussion',
    tags: ['dp', 'knapsack', 'optimization', 'space-complexity'],
    content: `# The Complete 0/1 Knapsack Derivation

Understanding how the 2D DP table simplifies to a 1D array traversed backwards is a fundamental rite of passage in Dynamic Programming.

## State Definition
Let \`dp[i][w]\` be the maximum value possible using a subset of the first \`i\` items with a weight capacity of \`w\`.

## Recurrence Relation
\\[
dp[i][w] = \\max(dp[i-1][w], \\text{val}[i-1] + dp[i-1][w - \\text{wt}[i-1]])
\\]

## 1D Space Optimization
Since \`dp[i][w]\` only depends on the previous row \`dp[i-1]\`, we can use a single 1D array of size \\(W + 1\\) by iterating **backwards**:

\`\`\`cpp
int knapsack(int W, const vector<int>& wt, const vector<int>& val) {
    int n = wt.size();
    vector<int> dp(W + 1, 0);
    
    for (int i = 0; i < n; i++) {
        for (int w = W; w >= wt[i]; w--) {
            dp[w] = max(dp[w], val[i] + dp[w - wt[i]]);
        }
    }
    return dp[W];
}
\`\`\`

Notice why the inner loop must go backwards: going forward would overwrite values needed from the previous item iteration, converting 0/1 Knapsack into Unbounded Knapsack!`
  }
];

async function seedDatabase() {
  console.log('Connecting to MongoDB Atlas for seeding...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB Atlas!');

  // Find or create a default system/founder user
  let systemUser = await User.findOne({ email: 'founder@algoverse.com' });
  if (!systemUser) {
    systemUser = await User.create({
      fullName: 'Kriti Singh',
      username: 'kritisingh',
      email: 'founder@algoverse.com',
      password: 'Password123!',
      role: 'admin',
      xp: 5400,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    });
    console.log('Created founder user:', systemUser.username);
  }

  // Seed Communities
  for (const commData of INITIAL_COMMUNITIES) {
    let existing = await Community.findOne({ slug: commData.slug });
    if (!existing) {
      existing = await Community.create({
        ...commData,
        creator: systemUser._id,
        members: [systemUser._id],
        membersCount: Math.floor(Math.random() * 200) + 50
      });
      console.log(`✅ Seeded Community: ${existing.name} (${existing.slug})`);
    } else {
      console.log(`ℹ️ Community already exists: ${existing.name}`);
    }
  }

  // Seed Sample Posts
  for (const postData of SAMPLE_POSTS) {
    const comm = await Community.findOne({ slug: postData.communitySlug });
    if (comm) {
      const existingPost = await Post.findOne({ title: postData.title });
      if (!existingPost) {
        const createdPost = await Post.create({
          title: postData.title,
          content: postData.content,
          author: systemUser._id,
          community: comm._id,
          postType: postData.postType,
          tags: postData.tags,
          reactions: [{ user: systemUser._id, type: 'love' }],
          reactionsCount: 1,
          reactionsSummary: { like: 0, love: 1, insightful: 0, helpful: 0, celebrate: 0 },
          commentsCount: 1,
          viewsCount: 42
        });

        // Add a sample comment
        await Comment.create({
          author: systemUser._id,
          post: createdPost._id,
          community: comm._id,
          content: 'Great explanation! This pattern comes up in almost every graph and DP interview question.',
          likes: [systemUser._id],
          likesCount: 1
        });

        console.log(`✅ Seeded Post in ${comm.name}: "${createdPost.title.slice(0, 40)}..."`);
      }
    }
  }

  const finalCommCount = await Community.countDocuments();
  const finalPostCount = await Post.countDocuments();
  console.log(`\n🎉 SEEDING COMPLETE!`);
  console.log(`Total Communities in MongoDB Atlas: ${finalCommCount}`);
  console.log(`Total Posts in MongoDB Atlas:        ${finalPostCount}`);

  await mongoose.disconnect();
  process.exit(0);
}

seedDatabase().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
