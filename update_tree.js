const fs = require('fs');

const treeMap = {
  bst: [
    'class Node {',
    'public:',
    '    int val;',
    '    Node* left;',
    '    Node* right;',
    '    Node(int v) : val(v), left(nullptr), right(nullptr) {}',
    '};',
    '',
    'Node* insert(Node* root, int val) {',
    '    if (!root) return new Node(val);',
    '    if (val < root->val)',
    '        root->left = insert(root->left, val);',
    '    else if (val > root->val)',
    '        root->right = insert(root->right, val);',
    '    return root;',
    '}',
    '',
    'bool search(Node* root, int val) {',
    '    if (!root) return false;',
    '    if (root->val == val) return true;',
    '    if (val < root->val) return search(root->left, val);',
    '    return search(root->right, val);',
    '}'
  ],
  avl: [
    'class AVLNode {',
    'public:',
    '    int val, height;',
    '    AVLNode *left, *right;',
    '    AVLNode(int v) : val(v), height(1), left(nullptr), right(nullptr) {}',
    '};',
    '',
    'int getHeight(AVLNode* n) { return n ? n->height : 0; }',
    'int getBalance(AVLNode* n) { return n ? getHeight(n->left) - getHeight(n->right) : 0; }',
    '',
    'AVLNode* insert(AVLNode* node, int val) {',
    '    if (!node) return new AVLNode(val);',
    '    if (val < node->val) node->left = insert(node->left, val);',
    '    else if (val > node->val) node->right = insert(node->right, val);',
    '    else return node;',
    '',
    '    node->height = 1 + max(getHeight(node->left), getHeight(node->right));',
    '    int balance = getBalance(node);',
    '',
    '    if (balance > 1 && val < node->left->val) return rightRotate(node);',
    '    if (balance < -1 && val > node->right->val) return leftRotate(node);',
    '    if (balance > 1 && val > node->left->val) {',
    '        node->left = leftRotate(node->left);',
    '        return rightRotate(node);',
    '    }',
    '    if (balance < -1 && val < node->right->val) {',
    '        node->right = rightRotate(node->right);',
    '        return leftRotate(node);',
    '    }',
    '    return node;',
    '}'
  ]
};

let treeContent = fs.readFileSync('frontend/src/pages/labs/TreeLab.jsx', 'utf8');
for (const [key, code] of Object.entries(treeMap)) {
  const regex = new RegExp(`(${key}:\\s*\\{[^}]*?pseudocode:\\s*\\[)[^\\]]*(\\])`, 's');
  const replacement = `$1\n${code.map(c => `      \`${c.replace(/`/g, '\\`')}\``).join(',\n')}\n    $2`;
  treeContent = treeContent.replace(regex, replacement);
}
fs.writeFileSync('frontend/src/pages/labs/TreeLab.jsx', treeContent);
console.log("TreeLab updated.");
