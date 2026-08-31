export const COMMUNITY_CATEGORIES = [
  'All',
  'DSA',
  'Competitive Programming',
  'C++',
  'Java',
  'Python',
  'Web Development',
  'Algorithms',
  'Interview Preparation',
  'Beginners',
  'Other'
];

export const INITIAL_COMMUNITIES = [
  {
    id: 'cpp-beginners',
    name: 'C++ Beginners',
    slug: 'cpp-beginners',
    description: 'Learn modern C++, STL containers, pointers, memory management, and write clean algorithm solutions from scratch.',
    category: 'C++',
    icon: '⚡',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    accentColor: '#3B82F6',
    membersCount: 1420,
    isPrivate: false,
    isTrending: true,
    trendingRank: 2,
    isVerified: true,
    tags: ['C++20', 'STL', 'Pointers', 'OOP', 'Clean Code'],
    about: 'C++ Beginners is a friendly haven for students and engineers starting their journey with C++. We focus on understanding low-level memory, standard template library internals, and building high-performance DSA solutions.',
    rules: [
      'Be welcoming to beginners asking fundamental syntax or memory questions.',
      'Format all code snippets properly with comments.',
      'Explain the "why" behind pointer and reference semantics.',
      'No homework dumping without showing your initial attempt.'
    ],
    createdDate: 'January 2025',
    membersPreview: [
      { id: 'm1', name: 'Kriti Singh', role: 'Founder & Moderator', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', xp: 4850 },
      { id: 'm2', name: 'Alex Rivera', role: 'Core Mentor', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80', xp: 3920 },
      { id: 'm3', name: 'Devon Vance', role: 'Active Contributor', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', xp: 2750 },
      { id: 'm4', name: 'Sarah Lin', role: 'Member', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', xp: 1840 }
    ]
  },
  {
    id: 'dsa-daily',
    name: 'DSA Daily',
    slug: 'dsa-daily',
    description: 'Solve one curated data structures & algorithms problem every day. Daily hints, multiple approach reviews, and complexity breakdowns.',
    category: 'DSA',
    icon: '💡',
    gradient: 'from-amber-500/20 to-orange-500/20',
    accentColor: '#F59E0B',
    membersCount: 3890,
    isPrivate: false,
    isTrending: true,
    trendingRank: 1,
    isVerified: true,
    tags: ['Daily Streak', 'Arrays', 'Trees', 'DP', 'Graphs'],
    about: 'Consistency beats intensity. DSA Daily provides a supportive environment where developers solve daily algorithm challenges together, discuss intuition, and celebrate study streaks.',
    rules: [
      'Share your time and space complexity with every posted solution.',
      'Always add spoiler tags when posting direct solutions before the daily discussion ends.',
      'Constructive feedback only when reviewing peer pull requests or logic.',
      'Keep discussions centered around algorithmic problem-solving.'
    ],
    createdDate: 'November 2024',
    membersPreview: [
      { id: 'm5', name: 'Rohan Sharma', role: 'Community Lead', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', xp: 6200 },
      { id: 'm6', name: 'Maya Patel', role: 'Streak Master', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80', xp: 5120 },
      { id: 'm7', name: 'Elena Rostova', role: 'Mentor', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80', xp: 4300 }
    ]
  },
  {
    id: 'competitive-programming',
    name: 'Competitive Programming',
    slug: 'competitive-programming',
    description: 'Discuss Codeforces, AtCoder, and CodeChef contest problems, speed optimizations, segment trees, and number theory.',
    category: 'Competitive Programming',
    icon: '🏆',
    gradient: 'from-purple-500/20 to-pink-500/20',
    accentColor: '#8B5CF6',
    membersCount: 2310,
    isPrivate: false,
    isTrending: true,
    trendingRank: 3,
    isVerified: true,
    tags: ['Codeforces', 'AtCoder', 'Segment Trees', 'Number Theory', 'Bitmasks'],
    about: 'Dedicated to competitive programmers looking to push their contest rating higher. We dissect tricky contest problems, analyze editorial nuances, and share high-speed implementation patterns.',
    rules: [
      'Do NOT discuss ongoing contest problems until the official contest is finished.',
      'Be respectful of differing rating tiers—everyone started at Pupil/Newbie.',
      'Prefer optimal asymptotic complexity over micro-optimizations unless sub-millisecond I/O is required.'
    ],
    createdDate: 'December 2024',
    membersPreview: [
      { id: 'm8', name: 'Kenji Sato', role: 'Grandmaster', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80', xp: 7890 },
      { id: 'm9', name: 'Priya Nair', role: 'Contest Curator', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80', xp: 5800 }
    ]
  },
  {
    id: 'leetcode-discussions',
    name: 'LeetCode Discussions',
    slug: 'leetcode-discussions',
    description: 'Deep dive into LeetCode patterns: Two Pointers, Sliding Window, Monotonic Stacks, Union Find, and Dynamic Programming.',
    category: 'Interview Preparation',
    icon: '💻',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    accentColor: '#10B981',
    membersCount: 3150,
    isPrivate: false,
    isTrending: false,
    isVerified: true,
    tags: ['Blind 75', 'NeetCode 150', 'Sliding Window', 'Dynamic Programming'],
    about: 'Master problem archetypes rather than memorizing individual questions. We categorize problems by pattern, discuss edge cases, and share interview-ready templates.',
    rules: [
      'Emphasize problem patterns rather than memorizing solution code.',
      'Include problem numbers and clear titles in discussion posts.',
      'Treat interview prep as a marathon, not a sprint.'
    ],
    createdDate: 'October 2024',
    membersPreview: [
      { id: 'm10', name: 'Liam O’Connor', role: 'Pattern Architect', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80', xp: 4600 },
      { id: 'm11', name: 'Chloe Dubois', role: 'Moderator', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', xp: 3400 }
    ]
  },
  {
    id: 'interview-prep',
    name: 'FAANG & Tech Interview Prep',
    slug: 'interview-prep',
    description: 'Mock interview pairings, behavioral storytelling tips, resume feedback, and algorithmic whiteboard challenge walkthroughs.',
    category: 'Interview Preparation',
    icon: '🎯',
    gradient: 'from-rose-500/20 to-red-500/20',
    accentColor: '#F43F5E',
    membersCount: 2680,
    isPrivate: false,
    isTrending: true,
    trendingRank: 4,
    isVerified: true,
    tags: ['Mock Interviews', 'Behavioral', 'System Design', 'Whiteboard', 'Big O'],
    about: 'A collaborative guild for software engineers preparing for upcoming technical and managerial interviews. Practice live mock coding sessions and receive constructive feedback on your thought process.',
    rules: [
      'Honor your mock interview bookings—give 24 hours notice for cancellations.',
      'Keep feedback constructive, empathetic, and actionable.',
      'Do not share NDA-protected company-specific internal documents.'
    ],
    createdDate: 'January 2025',
    membersPreview: [
      { id: 'm12', name: 'David Kim', role: 'Staff Engineer & Mentor', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', xp: 6700 },
      { id: 'm13', name: 'Aisha Bello', role: 'Interview Coach', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&auto=format&fit=crop&q=80', xp: 5400 }
    ]
  },
  {
    id: 'python-learners',
    name: 'Python Learners & DSA',
    slug: 'python-learners',
    description: 'Clean, idiomatic Python for algorithm visualizations, bisect, collections, heapq, and algorithmic problem-solving.',
    category: 'Python',
    icon: '🐍',
    gradient: 'from-yellow-500/20 to-emerald-500/20',
    accentColor: '#EAB308',
    membersCount: 2190,
    isPrivate: false,
    isTrending: false,
    isVerified: true,
    tags: ['Python 3', 'List Comprehension', 'heapq', 'bisect', 'Itertools'],
    about: 'Explore the beauty and readability of Python while mastering asymptotic efficiency. Learn when to use built-in standard libraries like heapq and deque for concise algorithm implementations.',
    rules: [
      'Write PEP 8 compliant code wherever possible.',
      'Explain time complexities when using high-level Python built-ins like in, sort, or slice.',
      'Encourage beginners transitioning from other languages.'
    ],
    createdDate: 'December 2024',
    membersPreview: [
      { id: 'm14', name: 'Gabriel Santos', role: 'Pythonista Lead', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', xp: 3800 },
      { id: 'm15', name: 'Zoe Becker', role: 'Member', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', xp: 2900 }
    ]
  },
  {
    id: 'web-dev-hub',
    name: 'Web Dev & Frontend Hub',
    slug: 'web-dev-hub',
    description: 'DOM performance, React rendering optimizations, Canvas animations, Web Workers, and state management.',
    category: 'Web Development',
    icon: '🌐',
    gradient: 'from-indigo-500/20 to-blue-500/20',
    accentColor: '#6366F1',
    membersCount: 1840,
    isPrivate: false,
    isTrending: false,
    isVerified: false,
    tags: ['React', 'TypeScript', 'Tailwind', 'Performance', 'Animation'],
    about: 'Bridge the gap between computer science fundamentals and modern web applications. We study browser rendering pipelines, virtual DOM diffing, and how to build buttery-smooth interactive visualizers.',
    rules: [
      'Focus on performance, accessibility, and modern clean architecture.',
      'Show live demos or Sandboxes when asking for UI debugging assistance.'
    ],
    createdDate: 'February 2025',
    membersPreview: [
      { id: 'm16', name: 'Marcus Chen', role: 'Frontend Engineer', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80', xp: 3100 }
    ]
  },
  {
    id: 'algorithm-theory',
    name: 'Algorithm Theory & Math',
    slug: 'algorithm-theory',
    description: 'Rigorous proofs, graph theory invariants, master theorem recurrence relations, randomized algorithms, and complexity classes.',
    category: 'Algorithms',
    icon: '🧠',
    gradient: 'from-fuchsia-500/20 to-purple-500/20',
    accentColor: '#D946EF',
    membersCount: 1250,
    isPrivate: false,
    isTrending: true,
    trendingRank: 5,
    isVerified: true,
    tags: ['Proofs', 'Big-O', 'Graph Theory', 'Math', 'P vs NP'],
    about: 'For curious minds who want to understand the rigorous mathematical foundation behind algorithms. We discuss amortized analysis, loop invariants, and NP-completeness proofs.',
    rules: [
      'Strive for mathematical rigor and cite standard proofs or papers where relevant.',
      'Keep discussions polite even when debating theorem formalisms.'
    ],
    createdDate: 'November 2024',
    membersPreview: [
      { id: 'm17', name: 'Dr. Arthur Pendelton', role: 'Theory Advisor', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80', xp: 7100 }
    ]
  },
  {
    id: 'java-masters',
    name: 'Java Masters & Spring DSA',
    slug: 'java-masters',
    description: 'Enterprise Java collections, concurrency, multithreading synchronization, and JVM memory efficiency for high-scale systems.',
    category: 'Java',
    icon: '☕',
    gradient: 'from-orange-500/20 to-amber-500/20',
    accentColor: '#EA580C',
    membersCount: 1620,
    isPrivate: false,
    isTrending: false,
    isVerified: false,
    tags: ['Java 21', 'Collections', 'Concurrency', 'JVM', 'Spring'],
    about: 'Master Java collection internals (HashMap buckets, ConcurrentSkipList, PriorityQueue) and multithreading synchronization primitives for scalable algorithmic execution.',
    rules: [
      'Focus on Java 17+ modern idioms and collection performance.',
      'Explain thread safety trade-offs when presenting concurrent algorithms.'
    ],
    createdDate: 'January 2025',
    membersPreview: [
      { id: 'm18', name: 'Vikram Joshi', role: 'Java Architect', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', xp: 4200 }
    ]
  },
  {
    id: 'beginners-circle',
    name: 'Coding Beginners Circle',
    slug: 'beginners-circle',
    description: 'A zero-judgment safe space for absolute beginners to ask questions about loops, conditionals, arrays, and basic debugging.',
    category: 'Beginners',
    icon: '🌱',
    gradient: 'from-green-500/20 to-emerald-500/20',
    accentColor: '#22C55E',
    membersCount: 2980,
    isPrivate: false,
    isTrending: false,
    isVerified: true,
    tags: ['Zero to One', 'First Steps', 'Debugging', 'Syntax Help', 'Patience'],
    about: 'Everyone starts at line 1. Ask any question without fear of feeling silly. Our patient mentors and community members help you take your first solid steps into programming.',
    rules: [
      'Zero judgment: there are NO stupid questions here.',
      'Always encourage and uplift peers who are learning their first concepts.',
      'Explain error messages in clear, approachable language.'
    ],
    createdDate: 'October 2024',
    membersPreview: [
      { id: 'm19', name: 'Hannah Scott', role: 'Beginner Guide', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', xp: 3200 }
    ]
  }
];

export const GLOBAL_CHAT_PREVIEW_MESSAGES = [
  {
    id: 'chat-1',
    user: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
    role: 'Mentor',
    time: '2m ago',
    message: 'Hey everyone! Quick tip: when implementing Two Pointers for sorted arrays, remember to check while (left < right) to avoid index collision!',
    badge: 'C++ Lead'
  },
  {
    id: 'chat-2',
    user: 'Priya Nair',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80',
    role: 'Member',
    time: '5m ago',
    message: 'Just solved today’s Daily DP problem on AlgoVerse! The space optimization from O(N) to O(1) feels so satisfying 🚀',
    badge: 'Streak 14d'
  },
  {
    id: 'chat-3',
    user: 'Kriti Singh',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    role: 'Admin',
    time: '8m ago',
    message: 'Welcome all new learners joining the AlgoVerse Community hub! Feel free to explore public study groups or start your own.',
    badge: 'Staff'
  }
];

export const EMOJI_PRESETS = [
  '⚡', '💡', '🏆', '💻', '🎯', '🐍', '☕', '🌐', '🧠', '🌱', '🚀', '🎨', '🛠️', '🔬', '📚', '🧩'
];

const STORAGE_JOINED_KEY = 'algoverse_joined_communities';
const STORAGE_CREATED_KEY = 'algoverse_created_communities';

// Helper to get joined community IDs
export const getJoinedCommunityIds = () => {
  try {
    const saved = localStorage.getItem(STORAGE_JOINED_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading joined communities from storage', e);
  }
  // Default joined seeds
  return ['cpp-beginners', 'dsa-daily'];
};

// Helper to toggle join status
export const toggleJoinCommunity = (communityId) => {
  try {
    const current = getJoinedCommunityIds();
    let updated;
    if (current.includes(communityId)) {
      updated = current.filter(id => id !== communityId);
    } else {
      updated = [...current, communityId];
    }
    localStorage.setItem(STORAGE_JOINED_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error updating joined communities', e);
    return [];
  }
};

// Helper to get created communities
export const getCreatedCommunities = () => {
  try {
    const saved = localStorage.getItem(STORAGE_CREATED_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading created communities from storage', e);
  }
  return [];
};

// Helper to save a newly created community in session
export const saveCreatedCommunity = (newCommunity) => {
  try {
    const existing = getCreatedCommunities();
    const updated = [newCommunity, ...existing];
    localStorage.setItem(STORAGE_CREATED_KEY, JSON.stringify(updated));
    
    // Automatically join created community
    const joined = getJoinedCommunityIds();
    if (!joined.includes(newCommunity.id)) {
      localStorage.setItem(STORAGE_JOINED_KEY, JSON.stringify([...joined, newCommunity.id]));
    }
    return updated;
  } catch (e) {
    console.error('Error saving created community', e);
    return [];
  }
};

// Helper to get all combined communities (seed + created)
export const getAllCommunities = () => {
  const created = getCreatedCommunities();
  const seedIds = new Set(INITIAL_COMMUNITIES.map(c => c.id));
  const uniqueCreated = created.filter(c => !seedIds.has(c.id));
  return [...uniqueCreated, ...INITIAL_COMMUNITIES];
};
