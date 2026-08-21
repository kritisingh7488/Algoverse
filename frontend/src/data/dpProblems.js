export const dpCategories = [
  {
    id: "1d-dp",
    name: "1D DP",
    description: "Problems where the state depends on a single dimension (1D array).",
    problems: [
      {
        id: "fibonacci",
        name: "Fibonacci Number",
        difficulty: "Easy",
        formula: "dp[i] = dp[i-1] + dp[i-2]",
        complexities: {
          recursive: { time: "O(2^N)", space: "O(N)" },
          memoization: { time: "O(N)", space: "O(N)" },
          tabulation: { time: "O(N)", space: "O(N)" },
          spaceOptimized: { time: "O(N)", space: "O(1)" }
        },
        code: {
          cpp: {
            recursive: `int solve(int n) {\n  if (n <= 1) return n;\n  return solve(n - 1) + solve(n - 2);\n}`,
            memoization: `int solve(int n, vector<int>& dp) {\n  if (n <= 1) return n;\n  if (dp[n] != -1) return dp[n];\n  return dp[n] = solve(n - 1, dp) + solve(n - 2, dp);\n}`,
            tabulation: `int solve(int n) {\n  vector<int> dp(n + 1);\n  dp[0] = 0; dp[1] = 1;\n  for (int i = 2; i <= n; i++) {\n    dp[i] = dp[i-1] + dp[i-2];\n  }\n  return dp[n];\n}`,
            spaceOptimized: `int solve(int n) {\n  int prev2 = 0, prev = 1;\n  for (int i = 2; i <= n; i++) {\n    int curr = prev + prev2;\n    prev2 = prev;\n    prev = curr;\n  }\n  return prev;\n}`
          },
          python: {
            recursive: `def solve(n):\n    if n <= 1: return n\n    return solve(n - 1) + solve(n - 2)`,
            memoization: `def solve(n, dp):\n    if n <= 1: return n\n    if dp[n] != -1: return dp[n]\n    dp[n] = solve(n - 1, dp) + solve(n - 2, dp)\n    return dp[n]`,
            tabulation: `def solve(n):\n    dp = [0] * (n + 1)\n    dp[1] = 1\n    for i in range(2, n + 1):\n        dp[i] = dp[i-1] + dp[i-2]\n    return dp[n]`,
            spaceOptimized: `def solve(n):\n    prev2, prev = 0, 1\n    for i in range(2, n + 1):\n        curr = prev + prev2\n        prev2 = prev\n        prev = curr\n    return prev`
          }
        }
      },
      {
        id: "climbing-stairs",
        name: "Climbing Stairs",
        difficulty: "Easy",
        formula: "dp[i] = dp[i-1] + dp[i-2]",
        complexities: {
          recursive: { time: "O(2^N)", space: "O(N)" },
          memoization: { time: "O(N)", space: "O(N)" },
          tabulation: { time: "O(N)", space: "O(N)" },
          spaceOptimized: { time: "O(N)", space: "O(1)" }
        },
        code: {
          cpp: {
            recursive: `int climb(int n) {\n  if (n <= 1) return n;\n  return climb(n - 1) + climb(n - 2);\n}`,
            memoization: `int climb(int n, vector<int>& dp) {\n  if (n <= 1) return n;\n  if (dp[n] != -1) return dp[n];\n  return dp[n] = climb(n - 1, dp) + climb(n - 2, dp);\n}`,
            tabulation: `int climb(int n) {\n  vector<int> dp(n + 1);\n  dp[0] = 0; dp[1] = 1;\n  for (int i = 2; i <= n; i++) {\n    dp[i] = dp[i-1] + dp[i-2];\n  }\n  return dp[n];\n}`,
            spaceOptimized: `int climb(int n) {\n  int prev2 = 0, prev = 1;\n  for (int i = 2; i <= n; i++) {\n    int curr = prev + prev2;\n    prev2 = prev;\n    prev = curr;\n  }\n  return prev;\n}`
          },
          python: {
            recursive: `def climb(n):\n    if n <= 1: return n\n    return climb(n - 1) + climb(n - 2)`,
            memoization: `def climb(n, dp):\n    if n <= 1: return n\n    if dp[n] != -1: return dp[n]\n    dp[n] = climb(n - 1, dp) + climb(n - 2, dp)\n    return dp[n]`,
            tabulation: `def climb(n):\n    dp = [0] * (n + 1)\n    dp[1] = 1\n    for i in range(2, n + 1):\n        dp[i] = dp[i-1] + dp[i-2]\n    return dp[n]`,
            spaceOptimized: `def climb(n):\n    prev2, prev = 0, 1\n    for i in range(2, n + 1):\n        curr = prev + prev2\n        prev2 = prev\n        prev = curr\n    return prev`
          }
        }
      },
      { id: "house-robber-i", name: "House Robber I", difficulty: "Medium", formula: "dp[i] = max(dp[i-1], val[i] + dp[i-2])" },
      { id: "house-robber-ii", name: "House Robber II", difficulty: "Medium", formula: "dp[i] = max(rob(0, n-2), rob(1, n-1))" },
      { id: "decode-ways", name: "Decode Ways", difficulty: "Medium", formula: "dp[i] = dp[i-1] + (valid ? dp[i-2] : 0)" },
      { id: "coin-change", name: "Coin Change", difficulty: "Medium", formula: "dp[i] = min(dp[i], 1 + dp[i - coin])" },
      { id: "minimum-coins", name: "Minimum Coins", difficulty: "Medium", formula: "dp[i] = min(dp[i - coin]) + 1" },
      { id: "perfect-squares", name: "Perfect Squares", difficulty: "Medium", formula: "dp[i] = min(dp[i - j*j]) + 1" },
      { id: "integer-break", name: "Integer Break", difficulty: "Medium", formula: "dp[i] = max(j*(i-j), j*dp[i-j])" },
      { id: "frog-jump", name: "Frog Jump", difficulty: "Hard", formula: "dp[i] = dp[j] && (k-1 <= dist <= k+1)" }
    ]
  },
  {
    id: "2d-dp",
    name: "2D DP",
    description: "Grid/Matrix problems with dimensions (i, j).",
    problems: [
      {
        id: "unique-paths",
        name: "Unique Paths",
        difficulty: "Medium",
        formula: "dp[i][j] = dp[i-1][j] + dp[i][j-1]",
        complexities: {
          recursive: { time: "O(2^(M+N))", space: "O(M+N)" },
          memoization: { time: "O(M*N)", space: "O(M*N)" },
          tabulation: { time: "O(M*N)", space: "O(M*N)" },
          spaceOptimized: { time: "O(M*N)", space: "O(N)" }
        },
        code: {
          cpp: {
            recursive: `int solve(int i, int j) {\n  if (i == 0 || j == 0) return 1;\n  return solve(i - 1, j) + solve(i, j - 1);\n}`,
            memoization: `int solve(int i, int j, vector<vector<int>>& dp) {\n  if (i == 0 || j == 0) return 1;\n  if (dp[i][j] != -1) return dp[i][j];\n  return dp[i][j] = solve(i-1, j, dp) + solve(i, j-1, dp);\n}`,
            tabulation: `int solve(int m, int n) {\n  vector<vector<int>> dp(m, vector<int>(n, 1));\n  for (int i = 1; i < m; i++) {\n    for (int j = 1; j < n; j++) {\n      dp[i][j] = dp[i-1][j] + dp[i][j-1];\n    }\n  }\n  return dp[m-1][n-1];\n}`
          }
        }
      },
      { id: "unique-paths-ii", name: "Unique Paths II", difficulty: "Medium", formula: "dp[i][j] = grid[i][j] ? 0 : dp[i-1][j] + dp[i][j-1]" },
      { id: "minimum-path-sum", name: "Minimum Path Sum", difficulty: "Medium", formula: "dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])" },
      { id: "triangle", name: "Triangle", difficulty: "Medium", formula: "dp[i][j] = triangle[i][j] + min(dp[i+1][j], dp[i+1][j+1])" },
      { id: "dungeon-game", name: "Dungeon Game", difficulty: "Hard", formula: "dp[i][j] = max(1, min(dp[i+1][j], dp[i][j+1]) - grid[i][j])" },
      { id: "cherry-pickup", name: "Cherry Pickup", difficulty: "Hard", formula: "dp[r1][c1][c2] = cherries + max(four_directions)" },
      { id: "grid-traveller", name: "Grid Traveller", difficulty: "Easy", formula: "dp[i][j] = dp[i-1][j] + dp[i][j-1]" }
    ]
  },
  {
    id: "string-dp",
    name: "String DP",
    description: "Problems involving sequence comparisons and string transitions.",
    problems: [
      {
        id: "lcs",
        name: "Longest Common Subsequence",
        difficulty: "Medium",
        formula: "s1[i]==s2[j] ? 1+dp[i-1][j-1] : max(dp[i-1][j], dp[i][j-1])",
        complexities: {
          recursive: { time: "O(2^(M+N))", space: "O(M+N)" },
          memoization: { time: "O(M*N)", space: "O(M*N)" },
          tabulation: { time: "O(M*N)", space: "O(M*N)" },
          spaceOptimized: { time: "O(M*N)", space: "O(N)" }
        }
      },
      { id: "longest-common-substring", name: "Longest Common Substring", difficulty: "Medium", formula: "s1[i]==s2[j] ? 1+dp[i-1][j-1] : 0" },
      { id: "edit-distance", name: "Edit Distance", difficulty: "Hard", formula: "min(insert, delete, replace) + 1" },
      { id: "wildcard-matching", name: "Wildcard Matching", difficulty: "Hard", formula: "Match wildcards (*, ?)" },
      { id: "regex-matching", name: "Regex Matching", difficulty: "Hard", formula: "Regex parser transitions" },
      { id: "palindrome-partitioning", name: "Palindrome Partitioning", difficulty: "Hard", formula: "dp[i] = min(dp[j] + 1) for all palindromic cuts" },
      { id: "distinct-subsequences", name: "Distinct Subsequences", difficulty: "Hard", formula: "s1[i]==s2[j] ? dp[i-1][j-1] + dp[i-1][j] : dp[i-1][j]" },
      { id: "shortest-common-supersequence", name: "Shortest Common Supersequence", difficulty: "Hard", formula: "M + N - LCS(s1, s2)" },
      { id: "interleaving-string", name: "Interleaving String", difficulty: "Medium", formula: "dp[i][j] = (s3[i+j-1] == s1[i-1] && dp[i-1][j]) || ..." }
    ]
  },
  {
    id: "knapsack-dp",
    name: "Knapsack DP",
    description: "Classic subset selection and capacity constraints.",
    problems: [
      {
        id: "01-knapsack",
        name: "0/1 Knapsack",
        difficulty: "Medium",
        formula: "dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w-wt[i-1]])",
        complexities: {
          recursive: { time: "O(2^N)", space: "O(N)" },
          memoization: { time: "O(N*W)", space: "O(N*W)" },
          tabulation: { time: "O(N*W)", space: "O(N*W)" },
          spaceOptimized: { time: "O(N*W)", space: "O(W)" }
        }
      },
      { id: "unbounded-knapsack", name: "Unbounded Knapsack", difficulty: "Medium", formula: "dp[w] = max(dp[w], val[i] + dp[w - wt[i]])" },
      { id: "subset-sum", name: "Subset Sum", difficulty: "Medium", formula: "dp[i][w] = dp[i-1][w] || dp[i-1][w-val[i]]" },
      { id: "equal-partition", name: "Equal Partition", difficulty: "Medium", formula: "SubsetSum(sum/2)" },
      { id: "target-sum", name: "Target Sum", difficulty: "Medium", formula: "SubsetSum((total+target)/2)" },
      { id: "rod-cutting", name: "Rod Cutting", difficulty: "Medium", formula: "dp[i] = max(price[j] + dp[i-j-1])" }
    ]
  },
  {
    id: "lis-family",
    name: "LIS Family",
    description: "Increasing and decreasing subsequence patterns.",
    problems: [
      {
        id: "lis",
        name: "LIS (Longest Increasing Subsequence)",
        difficulty: "Medium",
        formula: "dp[i] = 1 + max(dp[j]) for j < i && arr[j] < arr[i]",
        complexities: {
          recursive: { time: "O(2^N)", space: "O(N)" },
          memoization: { time: "O(N^2)", space: "O(N^2)" },
          tabulation: { time: "O(N^2)", space: "O(N)" },
          spaceOptimized: { time: "O(N log N)", space: "O(N)" }
        }
      },
      { id: "lds", name: "LDS (Longest Decreasing Subsequence)", difficulty: "Medium", formula: "dp[i] = 1 + max(dp[j]) for arr[j] > arr[i]" },
      { id: "bitonic", name: "Bitonic Sequence", difficulty: "Hard", formula: "max(LIS[i] + LDS[i] - 1)" },
      { id: "maximum-sum-lis", name: "Maximum Sum LIS", difficulty: "Medium", formula: "dp[i] = arr[i] + max(dp[j])" },
      { id: "russian-doll-envelopes", name: "Russian Doll Envelopes", difficulty: "Hard", formula: "Sort width, apply LIS on height" }
    ]
  },
  {
    id: "interval-dp",
    name: "Interval DP",
    description: "DP where states represent sub-intervals [i, j].",
    problems: [
      {
        id: "matrix-chain-multiplication",
        name: "Matrix Chain Multiplication",
        difficulty: "Hard",
        formula: "dp[i][j] = min(dp[i][k] + dp[k+1][j] + cost)",
        complexities: {
          recursive: { time: "O(2^N)", space: "O(N)" },
          memoization: { time: "O(N^3)", space: "O(N^2)" },
          tabulation: { time: "O(N^3)", space: "O(N^2)" }
        }
      },
      { id: "burst-balloons", name: "Burst Balloons", difficulty: "Hard", formula: "dp[i][j] = max(val[i-1]*val[k]*val[j+1] + dp[i][k-1] + dp[k+1][j])" },
      { id: "optimal-bst", name: "Optimal BST", difficulty: "Hard", formula: "dp[i][j] = min(dp[i][k-1] + dp[k+1][j]) + sum_freq" },
      { id: "palindrome-removal", name: "Palindrome Removal", difficulty: "Hard", formula: "dp[i][j] = dp[i+1][j-1] or 1 + min(dp[i][k] + dp[k+1][j])" }
    ]
  },
  {
    id: "tree-dp",
    name: "Tree DP",
    description: "Dynamic programming structured on top of hierarchical tree nodes.",
    problems: [
      {
        id: "diameter",
        name: "Tree Diameter",
        difficulty: "Medium",
        formula: "height[u] = 1 + max(height[v]); diam = max(diam, h1 + h2)",
        complexities: {
          recursive: { time: "O(N)", space: "O(N)" },
          tabulation: { time: "O(N)", space: "O(N)" }
        }
      },
      { id: "maximum-path-sum", name: "Maximum Path Sum", difficulty: "Hard", formula: "val + max(0, left) + max(0, right)" },
      { id: "house-robber-iii", name: "House Robber III", difficulty: "Medium", formula: "dp[u] = [rob_u, dont_rob_u]" },
      { id: "tree-matching", name: "Tree Matching", difficulty: "Medium", formula: "dp[u][0/1] = max matches with/without edge to child" },
      { id: "independent-set", name: "Independent Set", difficulty: "Medium", formula: "dp[u][0/1] = size of max independent set" }
    ]
  },
  {
    id: "graph-dp",
    name: "Graph DP",
    description: "Solving problems on directed acyclic graphs (DAGs).",
    problems: [
      { id: "dag-shortest-path", name: "DAG Shortest Path", difficulty: "Medium", formula: "dp[u] = min(dp[u], weight + dp[v])" }
    ]
  },
  {
    id: "bitmask-dp",
    name: "Bitmask DP",
    description: "Exponential complexity problems tracking subsets using bits.",
    problems: [
      {
        id: "tsp",
        name: "Travelling Salesperson Problem",
        difficulty: "Hard",
        formula: "dp[mask][u] = min(dist[u][v] + dp[mask | (1 << v)][v])",
        complexities: {
          recursive: { time: "O(N!)", space: "O(N)" },
          memoization: { time: "O(2^N * N^2)", space: "O(2^N * N)" },
          tabulation: { time: "O(2^N * N^2)", space: "O(2^N * N)" }
        }
      },
      { id: "hamiltonian-path", name: "Hamiltonian Path", difficulty: "Hard", formula: "dp[mask][u] = OR(dp[mask ^ (1 << u)][v] && adj[v][u])" },
      { id: "assignment-problem", name: "Assignment Problem", difficulty: "Hard", formula: "dp[mask] = min(cost[i][j] + dp[mask | (1 << j)])" }
    ]
  },
  {
    id: "digit-dp",
    name: "Digit DP",
    description: "Counting properties of numbers digitally.",
    problems: [
      { id: "count-numbers", name: "Count Numbers", difficulty: "Hard", formula: "dp[idx][tight][cnt]" },
      { id: "sum-of-digits", name: "Sum of Digits", difficulty: "Hard", formula: "dp[idx][tight][sum]" },
      { id: "range-digit-dp", name: "Range Digit DP", difficulty: "Hard", formula: "Count(R) - Count(L - 1)" }
    ]
  }
];

export const getCodeSnippets = (problemId, language, approach) => {
  const problem = dpCategories
    .flatMap(c => c.problems)
    .find(p => p.id === problemId);
  
  if (problem?.code?.[language]?.[approach]) {
    return problem.code[language][approach];
  }

  // Fallback dynamic generator for common DP templates
  const title = problem?.name || "Problem";
  const formula = problem?.formula || "dp[i] = transition";

  if (language === 'cpp') {
    if (approach === 'recursive') {
      return `// Recursive approach for ${title}\n// Transition: ${formula}\nint solve(int i) {\n  // Base case\n  if (i <= 0) return 0;\n\n  // Choices & transition\n  int result = solve(i - 1);\n  return result;\n}`;
    } else if (approach === 'memoization') {
      return `// Memoized approach for ${title}\nint solve(int i, vector<int>& dp) {\n  if (i <= 0) return 0;\n  if (dp[i] != -1) return dp[i];\n\n  return dp[i] = solve(i - 1, dp);\n}`;
    } else if (approach === 'tabulation') {
      return `// Tabulated approach for ${title}\nint solve(int n) {\n  vector<int> dp(n + 1, 0);\n  // Initialize base cases\n  dp[0] = 0;\n\n  for (int i = 1; i <= n; i++) {\n    dp[i] = dp[i - 1]; // update rule\n  }\n  return dp[n];\n}`;
    } else {
      return `// Space Optimized approach for ${title}\nint solve(int n) {\n  int prev = 0;\n  for (int i = 1; i <= n; i++) {\n    int curr = prev; // update step\n    prev = curr;\n  }\n  return prev;\n}`;
    }
  }

  if (language === 'javascript') {
    if (approach === 'recursive') {
      return `// Recursive\nfunction solve(i) {\n  if (i <= 0) return 0;\n  return solve(i - 1);\n}`;
    } else if (approach === 'memoization') {
      return `// Memoization\nfunction solve(i, dp) {\n  if (i <= 0) return 0;\n  if (dp[i] !== -1) return dp[i];\n  dp[i] = solve(i - 1, dp);\n  return dp[i];\n}`;
    } else {
      return `// Tabulation\nfunction solve(n) {\n  const dp = new Array(n + 1).fill(0);\n  for (let i = 1; i <= n; i++) {\n    dp[i] = dp[i - 1];\n  }\n  return dp[n];\n}`;
    }
  }

  if (language === 'python') {
    return `# Dynamic Template for ${title} (${approach})\n# Formula: ${formula}\ndef solve(n):\n    # TODO: Implement ${approach} logic\n    pass`;
  }

  if (language === 'java') {
    return `// Java Template for ${title} (${approach})\npublic int solve(int n) {\n    // TODO\n    return 0;\n}`;
  }

  return `// Code template not available`;
};
