export const dpCategories = [
  {
    id: "1d-dp",
    name: "1D DP",
    description: "Dynamic programming problems with a single state dimension (1D array).",
    problems: [
      { id: "fibonacci", name: "Fibonacci", difficulty: "Easy" },
      { id: "climbing-stairs", name: "Climbing Stairs", difficulty: "Easy" },
      { id: "house-robber-i", name: "House Robber I", difficulty: "Medium" },
      { id: "house-robber-ii", name: "House Robber II", difficulty: "Medium" },
      { id: "decode-ways", name: "Decode Ways", difficulty: "Medium" },
      { id: "coin-change", name: "Coin Change", difficulty: "Medium" },
      { id: "minimum-coins", name: "Minimum Coins", difficulty: "Medium" },
      { id: "perfect-squares", name: "Perfect Squares", difficulty: "Medium" },
      { id: "integer-break", name: "Integer Break", difficulty: "Medium" },
      { id: "frog-jump", name: "Frog Jump", difficulty: "Hard" },
    ]
  },
  {
    id: "2d-dp",
    name: "2D DP",
    description: "Dynamic programming problems with two state dimensions (2D matrix).",
    problems: [
      { id: "unique-paths", name: "Unique Paths", difficulty: "Medium" },
      { id: "unique-paths-ii", name: "Unique Paths II", difficulty: "Medium" },
      { id: "minimum-path-sum", name: "Minimum Path Sum", difficulty: "Medium" },
      { id: "triangle", name: "Triangle", difficulty: "Medium" },
      { id: "dungeon-game", name: "Dungeon Game", difficulty: "Hard" },
      { id: "cherry-pickup", name: "Cherry Pickup", difficulty: "Hard" },
      { id: "grid-traveller", name: "Grid Traveller", difficulty: "Easy" },
    ]
  },
  {
    id: "string-dp",
    name: "String DP",
    description: "DP problems involving strings, sequences, and matching.",
    problems: [
      { id: "lcs", name: "LCS (Longest Common Subsequence)", difficulty: "Medium" },
      { id: "longest-common-substring", name: "Longest Common Substring", difficulty: "Medium" },
      { id: "edit-distance", name: "Edit Distance", difficulty: "Hard" },
      { id: "wildcard-matching", name: "Wildcard Matching", difficulty: "Hard" },
      { id: "regex-matching", name: "Regex Matching", difficulty: "Hard" },
      { id: "palindrome-partitioning", name: "Palindrome Partitioning", difficulty: "Hard" },
      { id: "distinct-subsequences", name: "Distinct Subsequences", difficulty: "Hard" },
      { id: "shortest-common-supersequence", name: "Shortest Common Supersequence", difficulty: "Hard" },
      { id: "interleaving-string", name: "Interleaving String", difficulty: "Medium" },
    ]
  },
  {
    id: "knapsack-dp",
    name: "Knapsack DP",
    description: "Classic knapsack and subset sum problems.",
    problems: [
      { id: "01-knapsack", name: "0/1 Knapsack", difficulty: "Medium" },
      { id: "unbounded-knapsack", name: "Unbounded Knapsack", difficulty: "Medium" },
      { id: "subset-sum", name: "Subset Sum", difficulty: "Medium" },
      { id: "equal-partition", name: "Equal Partition", difficulty: "Medium" },
      { id: "target-sum", name: "Target Sum", difficulty: "Medium" },
      { id: "rod-cutting", name: "Rod Cutting", difficulty: "Medium" },
    ]
  },
  {
    id: "lis-family",
    name: "LIS Family",
    description: "Longest Increasing Subsequence and its variations.",
    problems: [
      { id: "lis", name: "LIS (Longest Increasing Subsequence)", difficulty: "Medium" },
      { id: "lds", name: "LDS", difficulty: "Medium" },
      { id: "bitonic", name: "Bitonic Sequence", difficulty: "Hard" },
      { id: "maximum-sum-lis", name: "Maximum Sum LIS", difficulty: "Medium" },
      { id: "russian-doll-envelopes", name: "Russian Doll Envelopes", difficulty: "Hard" },
    ]
  },
  {
    id: "interval-dp",
    name: "Interval DP",
    description: "DP problems solved by considering intervals [i, j].",
    problems: [
      { id: "matrix-chain-multiplication", name: "Matrix Chain Multiplication", difficulty: "Hard" },
      { id: "burst-balloons", name: "Burst Balloons", difficulty: "Hard" },
      { id: "optimal-bst", name: "Optimal BST", difficulty: "Hard" },
      { id: "palindrome-removal", name: "Palindrome Removal", difficulty: "Hard" },
    ]
  },
  {
    id: "tree-dp",
    name: "Tree DP",
    description: "Dynamic programming on trees (often using DFS).",
    problems: [
      { id: "diameter", name: "Diameter", difficulty: "Medium" },
      { id: "maximum-path-sum", name: "Maximum Path Sum", difficulty: "Hard" },
      { id: "house-robber-iii", name: "House Robber III", difficulty: "Medium" },
      { id: "tree-matching", name: "Tree Matching", difficulty: "Medium" },
      { id: "independent-set", name: "Independent Set", difficulty: "Medium" },
    ]
  },
  {
    id: "graph-dp",
    name: "Graph DP",
    description: "Dynamic programming on Directed Acyclic Graphs (DAGs).",
    problems: [
      { id: "dag-shortest-path", name: "DAG Shortest Path", difficulty: "Medium" },
    ]
  },
  {
    id: "bitmask-dp",
    name: "Bitmask DP",
    description: "DP problems using bitmasks to represent state.",
    problems: [
      { id: "tsp", name: "TSP (Travelling Salesperson Problem)", difficulty: "Hard" },
      { id: "hamiltonian-path", name: "Hamiltonian Path", difficulty: "Hard" },
    ]
  }
];
