/**
 * Comprehensive Textbook Knowledge Base for DSA Algorithms
 * Standard C++ Implementations & Visual Formulations
 * Includes:
 * 1. Clean C++ Textbook Code (without tracer boilerplate)
 * 2. Academic Pseudocode
 * 3. Structured Flowchart Nodes & Edges
 * 4. Conceptual Algorithm Overview, Complexities, and Figurine Details
 */

export const algorithmKnowledge = {
  // ==================== BINARY SEARCH TREE (BST) ====================
  bst: {
    insert: {
      title: "Binary Search Tree - Insertion",
      subtitle: "Recursive insertion maintaining BST ordering invariant",
      complexities: {
        timeBest: "O(log N)",
        timeAvg: "O(log N)",
        timeWorst: "O(N) (skewed)",
        space: "O(H) recursion stack"
      },
      invariant: "For every node X: all keys in Left(X) < X.data < all keys in Right(X)",
      figurineType: "bst-insert",
      figurineDesc: "Figurine: New key compares with root; if key < root it branches left, else right, until reaching an empty leaf link where a new node is allocated.",
      pseudocode: `Algorithm BST_Insert(root, key):
Input: Root node of BST, integer key to insert
Output: Updated root of BST

1. if root == NULL then:
2.     root = Allocate_New_Node(key)
3.     return root
4. if key < root.data then:
5.     root.left = BST_Insert(root.left, key)
6. else if key > root.data then:
7.     root.right = BST_Insert(root.right, key)
8. else:
9.     // Duplicate key ignored
10. return root`,
      cleanCode: `// Data Structures & Algorithms in C++
// Binary Search Tree - Node Insertion
struct BSTNode {
    int data;
    BSTNode* left;
    BSTNode* right;
    BSTNode(int val) : data(val), left(nullptr), right(nullptr) {}
};

BSTNode* insert(BSTNode* root, int val) {
    if (root == nullptr) {
        return new BSTNode(val);
    }
    
    if (val < root->data) {
        root->left = insert(root->left, val);
    } else if (val > root->data) {
        root->right = insert(root->right, val);
    }
    // Duplicate values are not inserted in a standard BST
    return root;
}`,
      flowchart: [
        { id: 'start', type: 'terminal', text: 'Start BST Insert(root, val)' },
        { id: 'c1', type: 'decision', text: 'Is root == NULL?' },
        { id: 'p1', type: 'process', text: 'Create New Node(val) & return' },
        { id: 'c2', type: 'decision', text: 'Is val < root->data?' },
        { id: 'p2', type: 'process', text: 'root->left = insert(root->left, val)' },
        { id: 'c3', type: 'decision', text: 'Is val > root->data?' },
        { id: 'p3', type: 'process', text: 'root->right = insert(root->right, val)' },
        { id: 'p4', type: 'process', text: 'Duplicate found (ignore)' },
        { id: 'end', type: 'terminal', text: 'Return root' }
      ]
    },

    inorder: {
      title: "Binary Search Tree - Inorder Traversal (L-D-R)",
      subtitle: "Depth-first traversal yielding elements in sorted ascending sequence",
      complexities: {
        timeBest: "O(N)",
        timeAvg: "O(N)",
        timeWorst: "O(N)",
        space: "O(H) recursion stack"
      },
      invariant: "Inorder traversal of a BST strictly produces non-decreasing sorted order.",
      figurineType: "traversal-ldr",
      figurineDesc: "Figurine: Left Subtree is recursively exhausted first, followed by visiting Current Node Data, then recursively exhausting Right Subtree.",
      pseudocode: `Algorithm Inorder_Traversal(node):
Input: Node of Binary Tree
Output: Sequence of visited node values

1. if node != NULL then:
2.     Inorder_Traversal(node.left)
3.     Visit(node.data)        // Process / Display
4.     Inorder_Traversal(node.right)`,
      cleanCode: `// Data Structures & Algorithms in C++
// BST Inorder Traversal (LDR: Left, Data, Right)
void inorder(BSTNode* root) {
    if (root == nullptr) return;
    
    inorder(root->left);        // L: Traverse left subtree
    cout << root->data << " ";  // D: Process current node
    inorder(root->right);       // R: Traverse right subtree
}`,
      flowchart: [
        { id: 'start', type: 'terminal', text: 'Start Inorder(node)' },
        { id: 'c1', type: 'decision', text: 'Is node == NULL?' },
        { id: 'ret', type: 'terminal', text: 'Return' },
        { id: 'p1', type: 'process', text: 'Inorder(node->left)' },
        { id: 'p2', type: 'process', text: 'Visit / Print node->data' },
        { id: 'p3', type: 'process', text: 'Inorder(node->right)' },
        { id: 'end', type: 'terminal', text: 'End' }
      ]
    },

    preorder: {
      title: "Binary Search Tree - Preorder Traversal (D-L-R)",
      subtitle: "Depth-first traversal visiting parent before its descendants",
      complexities: {
        timeBest: "O(N)",
        timeAvg: "O(N)",
        timeWorst: "O(N)",
        space: "O(H) recursion stack"
      },
      invariant: "Root/Parent is always processed prior to any node in its subtrees.",
      figurineType: "traversal-dlr",
      figurineDesc: "Figurine: Current Node Data is visited first, then Left Subtree, then Right Subtree.",
      pseudocode: `Algorithm Preorder_Traversal(node):
Input: Node of Binary Tree
Output: Sequence of visited node values

1. if node != NULL then:
2.     Visit(node.data)        // Process / Display root
3.     Preorder_Traversal(node.left)
4.     Preorder_Traversal(node.right)`,
      cleanCode: `// Data Structures & Algorithms in C++
// BST Preorder Traversal (DLR: Data, Left, Right)
void preorder(BSTNode* root) {
    if (root == nullptr) return;
    
    cout << root->data << " ";   // D: Process current node first
    preorder(root->left);        // L: Traverse left subtree
    preorder(root->right);       // R: Traverse right subtree
}`,
      flowchart: [
        { id: 'start', type: 'terminal', text: 'Start Preorder(node)' },
        { id: 'c1', type: 'decision', text: 'Is node == NULL?' },
        { id: 'ret', type: 'terminal', text: 'Return' },
        { id: 'p1', type: 'process', text: 'Visit / Print node->data' },
        { id: 'p2', type: 'process', text: 'Preorder(node->left)' },
        { id: 'p3', type: 'process', text: 'Preorder(node->right)' },
        { id: 'end', type: 'terminal', text: 'End' }
      ]
    },

    postorder: {
      title: "Binary Search Tree - Postorder Traversal (L-R-D)",
      subtitle: "Bottom-up traversal visiting descendants before the parent node",
      complexities: {
        timeBest: "O(N)",
        timeAvg: "O(N)",
        timeWorst: "O(N)",
        space: "O(H) recursion stack"
      },
      invariant: "Both children subtrees are completely visited before parent node is processed.",
      figurineType: "traversal-lrd",
      figurineDesc: "Figurine: Recursively traverse Left Subtree, then Right Subtree, and finally process Root Data.",
      pseudocode: `Algorithm Postorder_Traversal(node):
Input: Node of Binary Tree
Output: Sequence of visited node values

1. if node != NULL then:
2.     Postorder_Traversal(node.left)
3.     Postorder_Traversal(node.right)
4.     Visit(node.data)        // Process / Display`,
      cleanCode: `// Data Structures & Algorithms in C++
// BST Postorder Traversal (LRD: Left, Right, Data)
void postorder(BSTNode* root) {
    if (root == nullptr) return;
    
    postorder(root->left);       // L: Traverse left subtree
    postorder(root->right);      // R: Traverse right subtree
    cout << root->data << " ";   // D: Process current node
}`,
      flowchart: [
        { id: 'start', type: 'terminal', text: 'Start Postorder(node)' },
        { id: 'c1', type: 'decision', text: 'Is node == NULL?' },
        { id: 'ret', type: 'terminal', text: 'Return' },
        { id: 'p1', type: 'process', text: 'Postorder(node->left)' },
        { id: 'p2', type: 'process', text: 'Postorder(node->right)' },
        { id: 'p3', type: 'process', text: 'Visit / Print node->data' },
        { id: 'end', type: 'terminal', text: 'End' }
      ]
    },

    delete: {
      title: "Binary Search Tree - Node Deletion",
      subtitle: "Handling Leaf, Single-Child, and Two-Child (Inorder Successor) cases",
      complexities: {
        timeBest: "O(log N)",
        timeAvg: "O(log N)",
        timeWorst: "O(N)",
        space: "O(H) recursion stack"
      },
      invariant: "3 Cases: (1) Leaf -> delete directly; (2) 1 Child -> bypass to child; (3) 2 Children -> swap with Inorder Successor (min of right subtree).",
      figurineType: "bst-delete",
      figurineDesc: "Figurine: If target has 2 children, find smallest key in right subtree (inorder successor), copy value, and recursively delete the successor.",
      pseudocode: `Algorithm BST_Delete(root, key):
Input: BST root node, key to delete
Output: Updated root node

1. if root == NULL then return NULL
2. if key < root.data then:
3.     root.left = BST_Delete(root.left, key)
4. else if key > root.data then:
5.     root.right = BST_Delete(root.right, key)
6. else:
7.     // Case 1 & 2: 0 or 1 child
8.     if root.left == NULL:
9.         temp = root.right; delete root; return temp
10.    else if root.right == NULL:
11.        temp = root.left; delete root; return temp
12.    // Case 3: 2 children
13.    succ = Find_Min(root.right)
14.    root.data = succ.data
15.    root.right = BST_Delete(root.right, succ.data)
16. return root`,
      cleanCode: `// Data Structures & Algorithms in C++
// BST Node Deletion with Inorder Successor
BSTNode* findMin(BSTNode* node) {
    while (node && node->left != nullptr) {
        node = node->left;
    }
    return node;
}

BSTNode* remove(BSTNode* root, int key) {
    if (root == nullptr) return nullptr;

    if (key < root->data) {
        root->left = remove(root->left, key);
    } else if (key > root->data) {
        root->right = remove(root->right, key);
    } else {
        // Case 1 & 2: Leaf or one child
        if (root->left == nullptr) {
            BSTNode* temp = root->right;
            delete root;
            return temp;
        } else if (root->right == nullptr) {
            BSTNode* temp = root->left;
            delete root;
            return temp;
        }
        // Case 3: Two children
        BSTNode* successor = findMin(root->right);
        root->data = successor->data;
        root->right = remove(root->right, successor->data);
    }
    return root;
}`,
      flowchart: [
        { id: 'start', type: 'terminal', text: 'Start Delete(root, key)' },
        { id: 'c1', type: 'decision', text: 'root == NULL?' },
        { id: 'ret_null', type: 'terminal', text: 'Return NULL' },
        { id: 'c2', type: 'decision', text: 'key < root->data?' },
        { id: 'p_left', type: 'process', text: 'root->left = Delete(root->left, key)' },
        { id: 'c3', type: 'decision', text: 'key > root->data?' },
        { id: 'p_right', type: 'process', text: 'root->right = Delete(root->right, key)' },
        { id: 'c_leaf', type: 'decision', text: 'Has 0 or 1 child?' },
        { id: 'p_splice', type: 'process', text: 'Promote non-null child & delete root' },
        { id: 'p_succ', type: 'process', text: 'Find Min(root->right), swap data, delete successor' },
        { id: 'end', type: 'terminal', text: 'Return root' }
      ]
    }
  },

  // ==================== AVL TREE (HEIGHT BALANCED) ====================
  avl: {
    insert: {
      title: "AVL Tree - Height-Balanced Insertion & Rebalancing",
      subtitle: "Adelson-Velsky and Landis self-balancing tree with LL, RR, LR, RL rotations",
      complexities: {
        timeBest: "O(log N)",
        timeAvg: "O(log N)",
        timeWorst: "O(log N) (strictly guaranteed)",
        space: "O(log N) recursion stack"
      },
      invariant: "Balance Factor BF(u) = height(left) - height(right) ∈ {-1, 0, +1} for all nodes.",
      figurineType: "avl-rotations",
      figurineDesc: "Figurine: When BF becomes +2 or -2, 4 rotation types restore balance: Left-Left (Single Right), Right-Right (Single Left), Left-Right (Double), Right-Left (Double).",
      pseudocode: `Algorithm AVL_Insert(node, key):
Input: Current AVL node, key to insert
Output: Rebalanced subtree root

1. Standard BST recursive insert for key
2. Update node.height = 1 + max(height(left), height(right))
3. Calculate balance = height(left) - height(right)
4. // 4 Rotation Cases:
5. if balance > 1 and key < node.left.data:
6.     return Right_Rotate(node)          // LL Rotation
7. if balance < -1 and key > node.right.data:
8.     return Left_Rotate(node)           // RR Rotation
9. if balance > 1 and key > node.left.data:
10.    node.left = Left_Rotate(node.left)  // LR Rotation
11.    return Right_Rotate(node)
12. if balance < -1 and key < node.right.data:
13.    node.right = Right_Rotate(node.right)// RL Rotation
14.    return Left_Rotate(node)
15. return node`,
      cleanCode: `// Data Structures & Algorithms in C++
// AVL Tree - Insertion & Self-Rebalancing
struct AVLNode {
    int data, height;
    AVLNode *left, *right;
    AVLNode(int val) : data(val), height(1), left(nullptr), right(nullptr) {}
};

int getHeight(AVLNode* n) { return n ? n->height : 0; }
int getBF(AVLNode* n) { return n ? getHeight(n->left) - getHeight(n->right) : 0; }

AVLNode* rightRotate(AVLNode* y) {
    AVLNode* x = y->left;
    AVLNode* T2 = x->right;
    x->right = y;
    y->left = T2;
    y->height = 1 + max(getHeight(y->left), getHeight(y->right));
    x->height = 1 + max(getHeight(x->left), getHeight(x->right));
    return x;
}

AVLNode* leftRotate(AVLNode* x) {
    AVLNode* y = x->right;
    AVLNode* T2 = y->left;
    y->left = x;
    x->right = T2;
    x->height = 1 + max(getHeight(x->left), getHeight(x->right));
    y->height = 1 + max(getHeight(y->left), getHeight(y->right));
    return y;
}

AVLNode* insert(AVLNode* node, int key) {
    if (!node) return new AVLNode(key);
    if (key < node->data) node->left = insert(node->left, key);
    else if (key > node->data) node->right = insert(node->right, key);
    else return node;

    node->height = 1 + max(getHeight(node->left), getHeight(node->right));
    int balance = getBF(node);

    // LL Case
    if (balance > 1 && key < node->left->data) return rightRotate(node);
    // RR Case
    if (balance < -1 && key > node->right->data) return leftRotate(node);
    // LR Case
    if (balance > 1 && key > node->left->data) {
        node->left = leftRotate(node->left);
        return rightRotate(node);
    }
    // RL Case
    if (balance < -1 && key < node->right->data) {
        node->right = rightRotate(node->right);
        return leftRotate(node);
    }
    return node;
}`,
      flowchart: [
        { id: 'start', type: 'terminal', text: 'Start AVL Insert(node, key)' },
        { id: 'bst_ins', type: 'process', text: 'Standard BST Insertion recursion' },
        { id: 'upd_h', type: 'process', text: 'Update height = 1 + max(h(L), h(R))' },
        { id: 'calc_bf', type: 'process', text: 'Calculate BF = h(L) - h(R)' },
        { id: 'c_ll', type: 'decision', text: 'BF > 1 && key < left->data?' },
        { id: 'rot_r', type: 'process', text: 'Right Rotate(node) [LL]' },
        { id: 'c_rr', type: 'decision', text: 'BF < -1 && key > right->data?' },
        { id: 'rot_l', type: 'process', text: 'Left Rotate(node) [RR]' },
        { id: 'c_lr', type: 'decision', text: 'BF > 1 && key > left->data?' },
        { id: 'rot_lr', type: 'process', text: 'Left Rotate(left) then Right Rotate(node) [LR]' },
        { id: 'c_rl', type: 'decision', text: 'BF < -1 && key < right->data?' },
        { id: 'rot_rl', type: 'process', text: 'Right Rotate(right) then Left Rotate(node) [RL]' },
        { id: 'end', type: 'terminal', text: 'Return node' }
      ]
    }
  },

  // ==================== HEAP & HEAP SORT ====================
  heapsort: {
    max: {
      title: "Heap Sort (Max-Heap)",
      subtitle: "Bottom-up build heap in O(N) followed by N repeated root extractions",
      complexities: {
        timeBest: "O(N log N)",
        timeAvg: "O(N log N)",
        timeWorst: "O(N log N)",
        space: "O(1) auxiliary (in-place)"
      },
      invariant: "Max-Heap Property: For every index i: Arr[Parent(i)] ≥ Arr[i]. In array: Left = 2i+1, Right = 2i+2.",
      figurineType: "heap-sort-fig",
      figurineDesc: "Figurine: Array mapped directly into binary complete tree. Bottom-up reheapDown builds max-heap; max root element swaps with current end, shrinking heap size.",
      pseudocode: `Algorithm HeapSort(arr, n):
Input: Array arr of n elements
Output: Array sorted in ascending order

1. // Phase 1: Build Max-Heap bottom-up
2. for i = ⌊n / 2⌋ - 1 down to 0:
3.     ReheapDown(arr, n, i)
4.
5. // Phase 2: Successive root extraction
6. for i = n - 1 down to 1:
7.     Swap(arr[0], arr[i])   // Move max to sorted partition
8.     ReheapDown(arr, i, 0)  // Re-heapify reduced heap root`,
      cleanCode: `// Data Structures & Algorithms in C++
// Max-Heap Sort Implementation (In-place)
void reheapDown(vector<int>& arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest])
        largest = left;
    if (right < n && arr[right] > arr[largest])
        largest = right;

    if (largest != i) {
        swap(arr[i], arr[largest]);
        reheapDown(arr, n, largest);
    }
}

void heapSort(vector<int>& arr) {
    int n = arr.size();
    // Step 1: Build heap from last non-leaf node
    for (int i = n / 2 - 1; i >= 0; i--) {
        reheapDown(arr, n, i);
    }
    // Step 2: Extract maximum to end of array
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        reheapDown(arr, i, 0);
    }
}`,
      flowchart: [
        { id: 'start', type: 'terminal', text: 'Start HeapSort(arr, n)' },
        { id: 'b_loop', type: 'decision', text: 'For i = n/2 - 1 down to 0?' },
        { id: 'b_reheap', type: 'process', text: 'ReheapDown(arr, n, i)' },
        { id: 's_loop', type: 'decision', text: 'For i = n - 1 down to 1?' },
        { id: 's_swap', type: 'process', text: 'Swap arr[0] with arr[i]' },
        { id: 's_reheap', type: 'process', text: 'ReheapDown(arr, i, 0)' },
        { id: 'end', type: 'terminal', text: 'Array is sorted ascending' }
      ]
    },

    min: {
      title: "Min-Heap Construction",
      subtitle: "Building priority queue structure where parent <= children",
      complexities: {
        timeBest: "O(N)",
        timeAvg: "O(N)",
        timeWorst: "O(N)",
        space: "O(1) in-place"
      },
      invariant: "Arr[Parent(i)] ≤ Arr[i] for every non-root index i.",
      figurineType: "min-heap-fig",
      figurineDesc: "Figurine: Complete binary tree representation where smallest element is continuously maintained at root index 0.",
      pseudocode: `Algorithm Build_MinHeap(arr, n):
1. for i = ⌊n / 2⌋ - 1 down to 0:
2.     Min_ReheapDown(arr, n, i)

Algorithm Min_ReheapDown(arr, n, i):
1. smallest = i
2. if 2i + 1 < n and arr[2i + 1] < arr[smallest]: smallest = 2i + 1
3. if 2i + 2 < n and arr[2i + 2] < arr[smallest]: smallest = 2i + 2
4. if smallest != i:
5.     Swap(arr[i], arr[smallest])
6.     Min_ReheapDown(arr, n, smallest)`,
      cleanCode: `// Data Structures & Algorithms in C++
// Min-Heap Construction
void minReheapDown(vector<int>& arr, int n, int i) {
    int smallest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] < arr[smallest]) smallest = left;
    if (right < n && arr[right] < arr[smallest]) smallest = right;

    if (smallest != i) {
        swap(arr[i], arr[smallest]);
        minReheapDown(arr, n, smallest);
    }
}

void buildMinHeap(vector<int>& arr) {
    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; i--) {
        minReheapDown(arr, n, i);
    }
}`,
      flowchart: [
        { id: 'start', type: 'terminal', text: 'Start Build Min-Heap' },
        { id: 'loop', type: 'decision', text: 'i = n/2 - 1 down to 0?' },
        { id: 'rh', type: 'process', text: 'minReheapDown(arr, n, i)' },
        { id: 'end', type: 'terminal', text: 'Min-Heap Satisfied' }
      ]
    }
  },

  // ==================== GRAPH ALGORITHMS ====================
  graph: {
    dijkstra: {
      title: "Dijkstra's Shortest Path Algorithm",
      subtitle: "Single-source shortest path on non-negative weighted graphs",
      complexities: {
        timeBest: "O((V + E) log V)",
        timeAvg: "O((V + E) log V)",
        timeWorst: "O(V^2) matrix / O(E log V) list",
        space: "O(V) distances and visited sets"
      },
      invariant: "Edge Relaxation: if dist[u] + w(u,v) < dist[v] then dist[v] = dist[u] + w(u,v).",
      figurineType: "dijkstra-fig",
      figurineDesc: "Figurine: Greedy selection of unvisited vertex u with minimum known tentative distance, relaxing all outgoing edges (u, v).",
      pseudocode: `Algorithm Dijkstra(Graph, Source):
Input: Graph G = (V, E, W), Source vertex s
Output: Shortest distance array dist[] from s to all vertices

1. For each v in V: dist[v] = INFINITY, visited[v] = FALSE
2. dist[s] = 0
3. Loop V - 1 times:
4.     u = Vertex in V with min dist[u] not yet visited
5.     visited[u] = TRUE
6.     For each neighbor v of u:
7.         if visited[v] == FALSE and dist[u] + W(u, v) < dist[v]:
8.             dist[v] = dist[u] + W(u, v)
9. return dist`,
      cleanCode: `// Data Structures & Algorithms in C++
// Dijkstra's Algorithm for Shortest Path
void dijkstra(const vector<vector<int>>& adj, int V, int src) {
    vector<int> dist(V, 1e9);
    vector<bool> sptSet(V, false);
    dist[src] = 0;

    for (int count = 0; count < V - 1; count++) {
        // Pick minimum distance unvisited vertex
        int u = -1, minVal = 1e9;
        for (int v = 0; v < V; v++) {
            if (!sptSet[v] && dist[v] < minVal) {
                minVal = dist[v];
                u = v;
            }
        }
        if (u == -1) break;
        sptSet[u] = true;

        // Relax neighbors of u
        for (int v = 0; v < V; v++) {
            if (!sptSet[v] && adj[u][v] > 0 && dist[u] != 1e9) {
                if (dist[u] + adj[u][v] < dist[v]) {
                    dist[v] = dist[u] + adj[u][v];
                }
            }
        }
    }
}`,
      flowchart: [
        { id: 'start', type: 'terminal', text: 'Start Dijkstra(G, src)' },
        { id: 'init', type: 'process', text: 'dist[src] = 0, others = INF' },
        { id: 'pick', type: 'process', text: 'Pick unvisited u with min dist[u]' },
        { id: 'mark', type: 'process', text: 'visited[u] = TRUE' },
        { id: 'relax', type: 'decision', text: 'dist[u] + w(u,v) < dist[v]?' },
        { id: 'upd', type: 'process', text: 'dist[v] = dist[u] + w(u,v)' },
        { id: 'chk_all', type: 'decision', text: 'All vertices processed?' },
        { id: 'end', type: 'terminal', text: 'Return shortest distances dist[]' }
      ]
    },

    bfs: {
      title: "Breadth-First Search (BFS)",
      subtitle: "Queue-based level-order graph traversal discovering all reachable vertices",
      complexities: {
        timeBest: "O(V + E)",
        timeAvg: "O(V + E)",
        timeWorst: "O(V + E)",
        space: "O(V) queue and visited set"
      },
      invariant: "Vertices are discovered in strict non-decreasing order of distance (hop count) from source.",
      figurineType: "bfs-fig",
      figurineDesc: "Figurine: Starting at root vertex, visits all adjacent neighbors in layer 1, then all their unvisited neighbors in layer 2 using FIFO queue.",
      pseudocode: `Algorithm BFS(Graph, startNode):
1. Create empty Queue Q, visited[] = {FALSE}
2. visited[startNode] = TRUE
3. Q.enqueue(startNode)
4. while Q is not empty:
5.     u = Q.dequeue()
6.     Visit(u)
7.     for each neighbor v of u:
8.         if visited[v] == FALSE:
9.             visited[v] = TRUE
10.            Q.enqueue(v)`,
      cleanCode: `// Data Structures & Algorithms in C++
// Breadth-First Search Traversal
void bfs(const vector<vector<int>>& adj, int V, int start) {
    vector<bool> visited(V, false);
    queue<int> q;

    visited[start] = true;
    q.push(start);

    while (!q.empty()) {
        int u = q.front();
        q.pop();
        cout << u << " ";

        for (int v = 0; v < V; v++) {
            if (adj[u][v] > 0 && !visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
}`,
      flowchart: [
        { id: 'start', type: 'terminal', text: 'Start BFS(startNode)' },
        { id: 'init', type: 'process', text: 'Queue.push(startNode), mark visited' },
        { id: 'q_empty', type: 'decision', text: 'Is Queue empty?' },
        { id: 'deq', type: 'process', text: 'u = Queue.pop(), Visit(u)' },
        { id: 'nbrs', type: 'process', text: 'For each unvisited neighbor v: push(v), mark visited' },
        { id: 'end', type: 'terminal', text: 'BFS Complete' }
      ]
    },

    dfs: {
      title: "Depth-First Search (DFS)",
      subtitle: "Recursive backtracking graph traversal exploring as deep as possible",
      complexities: {
        timeBest: "O(V + E)",
        timeAvg: "O(V + E)",
        timeWorst: "O(V + E)",
        space: "O(V) recursion call stack"
      },
      invariant: "Follows edges until dead-end or already-visited vertex is reached, then backtracks.",
      figurineType: "dfs-fig",
      figurineDesc: "Figurine: Deep branch exploration visiting adjacent neighbor immediately before backtracking to explore alternate branches.",
      pseudocode: `Algorithm DFS_Visit(u, visited, Graph):
1. visited[u] = TRUE
2. Visit(u)
3. for each neighbor v of u:
4.     if visited[v] == FALSE:
5.         DFS_Visit(v, visited, Graph)

Algorithm DFS(Graph, startNode):
1. visited[] = {FALSE}
2. DFS_Visit(startNode, visited, Graph)`,
      cleanCode: `// Data Structures & Algorithms in C++
// Depth-First Search Traversal
void dfsHelper(const vector<vector<int>>& adj, int V, int u, vector<bool>& visited) {
    visited[u] = true;
    cout << u << " ";

    for (int v = 0; v < V; v++) {
        if (adj[u][v] > 0 && !visited[v]) {
            dfsHelper(adj, V, v, visited);
        }
    }
}

void dfs(const vector<vector<int>>& adj, int V, int start) {
    vector<bool> visited(V, false);
    dfsHelper(adj, V, start, visited);
}`,
      flowchart: [
        { id: 'start', type: 'terminal', text: 'Start DFS(u)' },
        { id: 'mark', type: 'process', text: 'Mark visited[u] = TRUE, Visit(u)' },
        { id: 'nbr_loop', type: 'decision', text: 'Has unvisited neighbor v?' },
        { id: 'rec', type: 'process', text: 'Recursive call DFS(v)' },
        { id: 'end', type: 'terminal', text: 'Backtrack / Return' }
      ]
    },

    kruskal: {
      title: "Kruskal's Minimum Spanning Tree (MST)",
      subtitle: "Greedy edge-selection algorithm utilizing Disjoint Set Union (DSU)",
      complexities: {
        timeBest: "O(E log E)",
        timeAvg: "O(E log E)",
        timeWorst: "O(E log E)",
        space: "O(V + E) DSU parent and rank arrays"
      },
      invariant: "Edges sorted ascending by weight. Smallest edge added if and only if it does not form a cycle.",
      figurineType: "kruskal-fig",
      figurineDesc: "Figurine: Disjoint components are gradually united by picking cheapest edge connecting two distinct sets until V-1 edges connect all vertices.",
      pseudocode: `Algorithm Kruskal_MST(Graph):
Input: Connected weighted undirected graph G = (V, E, W)
Output: Minimum Spanning Tree edge set

1. Sort all edges in E in non-decreasing order of weight
2. Initialize Disjoint Sets: Parent[v] = v for all v in V
3. MST = {}
4. For each edge (u, v) with weight w in sorted E:
5.     rootU = Find(u)
6.     rootV = Find(v)
7.     if rootU != rootV:
8.         MST = MST ∪ {(u, v)}
9.         Union(rootU, rootV)
10.        if |MST| == |V| - 1: break
11. return MST`,
      cleanCode: `// Data Structures & Algorithms in C++
// Kruskal's MST Algorithm using Disjoint Set Forest
struct Edge {
    int u, v, weight;
    bool operator<(const Edge& other) const { return weight < other.weight; }
};

int findParent(int i, vector<int>& parent) {
    if (parent[i] == i) return i;
    return parent[i] = findParent(parent[i], parent);
}

void unionSets(int u, int v, vector<int>& parent, vector<int>& rank) {
    int rootU = findParent(u, parent);
    int rootV = findParent(v, parent);
    if (rootU != rootV) {
        if (rank[rootU] < rank[rootV]) parent[rootU] = rootV;
        else if (rank[rootU] > rank[rootV]) parent[rootV] = rootU;
        else { parent[rootV] = rootU; rank[rootU]++; }
    }
}

vector<Edge> kruskalMST(int V, vector<Edge>& edges) {
    sort(edges.begin(), edges.end());
    vector<int> parent(V), rank(V, 0);
    for (int i = 0; i < V; i++) parent[i] = i;

    vector<Edge> mst;
    for (const auto& edge : edges) {
        int rootU = findParent(edge.u, parent);
        int rootV = findParent(edge.v, parent);
        if (rootU != rootV) {
            mst.push_back(edge);
            unionSets(rootU, rootV, parent, rank);
            if (mst.size() == V - 1) break;
        }
    }
    return mst;
}`,
      flowchart: [
        { id: 'start', type: 'terminal', text: 'Start Kruskal MST' },
        { id: 'sort', type: 'process', text: 'Sort all edges ascending by weight' },
        { id: 'init', type: 'process', text: 'Init DSU: parent[i] = i' },
        { id: 'loop', type: 'decision', text: 'Next edge (u, v)?' },
        { id: 'cycle', type: 'decision', text: 'Find(u) == Find(v)? (Cycle check)' },
        { id: 'discard', type: 'process', text: 'Discard edge (creates cycle)' },
        { id: 'add', type: 'process', text: 'Add to MST & Union(u, v)' },
        { id: 'mst_done', type: 'decision', text: '|MST| == V - 1?' },
        { id: 'end', type: 'terminal', text: 'Return MST' }
      ]
    },

    prim: {
      title: "Prim's Minimum Spanning Tree (MST)",
      subtitle: "Cut-vertex greedy tree expansion adding cheapest connecting edge",
      complexities: {
        timeBest: "O(E log V)",
        timeAvg: "O(E log V)",
        timeWorst: "O(V^2) matrix / O(E log V) heap",
        space: "O(V) key and parent arrays"
      },
      invariant: "Grows a single tree from a starting vertex, always adding minimum weight cut edge.",
      figurineType: "prim-fig",
      figurineDesc: "Figurine: Tree partition grows step by step by finding the lowest-weight edge bridging the visited tree and the remaining unvisited vertices.",
      pseudocode: `Algorithm Prim_MST(Graph, startNode):
1. key[v] = INFINITY, inMST[v] = FALSE for all v in V
2. key[startNode] = 0, parent[startNode] = -1
3. Loop V - 1 times:
4.     u = Vertex with minimum key[u] not yet in inMST
5.     inMST[u] = TRUE
6.     for each neighbor v of u:
7.         if inMST[v] == FALSE and W(u, v) < key[v]:
8.             key[v] = W(u, v)
9.             parent[v] = u
10. return parent[] edges`,
      cleanCode: `// Data Structures & Algorithms in C++
// Prim's MST Algorithm
void primMST(const vector<vector<int>>& adj, int V, int start = 0) {
    vector<int> key(V, 1e9);
    vector<bool> inMST(V, false);
    vector<int> parent(V, -1);

    key[start] = 0;

    for (int count = 0; count < V - 1; count++) {
        int u = -1, minKey = 1e9;
        for (int v = 0; v < V; v++) {
            if (!inMST[v] && key[v] < minKey) {
                minKey = key[v];
                u = v;
            }
        }
        if (u == -1) break;
        inMST[u] = true;

        for (int v = 0; v < V; v++) {
            if (adj[u][v] > 0 && !inMST[v] && adj[u][v] < key[v]) {
                key[v] = adj[u][v];
                parent[v] = u;
            }
        }
    }
}`,
      flowchart: [
        { id: 'start', type: 'terminal', text: 'Start Prim(G, start)' },
        { id: 'init', type: 'process', text: 'key[start] = 0, all others = INF' },
        { id: 'pick', type: 'process', text: 'Pick min key vertex u not in MST' },
        { id: 'add_mst', type: 'process', text: 'inMST[u] = TRUE, link to parent[u]' },
        { id: 'update', type: 'process', text: 'Update key[v] for adjacent unvisited v' },
        { id: 'chk_v', type: 'decision', text: 'All V - 1 vertices added?' },
        { id: 'end', type: 'terminal', text: 'MST complete' }
      ]
    }
  },

  // ==================== B-TREE (MULTIWAY) ====================
  btree: {
    insert: {
      title: "B-Tree (Multiway Search Tree) - Insertion",
      subtitle: "Order M (minimum degree t=2) balanced multiway search tree with node split",
      complexities: {
        timeBest: "O(log_t N)",
        timeAvg: "O(log_t N)",
        timeWorst: "O(log_t N)",
        space: "O(log_t N) stack"
      },
      invariant: "Keys per internal node: t - 1 ≤ keys ≤ 2t - 1. When full (2t - 1 keys), median key moves up to parent on split.",
      figurineType: "btree-fig",
      figurineDesc: "Figurine: Multi-key node container where keys act as separation boundaries directing child traversal. Capacity overflow triggers median promotion.",
      pseudocode: `Algorithm BTree_Insert(root, key, t):
1. if root is full (keys.length == 2t - 1):
2.     newRoot = Allocate_Node(isLeaf = FALSE)
3.     newRoot.children[0] = root
4.     Split_Child(newRoot, 0, root, t)
5.     Insert_Non_Full(newRoot, key, t)
6.     return newRoot
7. else:
8.     Insert_Non_Full(root, key, t)
9.     return root

Algorithm Split_Child(parent, i, fullChild, t):
1. z = Allocate_Node(isLeaf = fullChild.isLeaf)
2. Median key = fullChild.keys[t - 1]
3. Copy keys[t .. 2t - 2] to z
4. Promote median key into parent at index i`,
      cleanCode: `// Data Structures & Algorithms in C++
// B-Tree (Order 4, Minimum Degree t = 2) Insertion & Node Split
struct BTreeNode {
    vector<int> keys;
    vector<BTreeNode*> children;
    bool isLeaf;
    BTreeNode(bool leaf) : isLeaf(leaf) {}
};

class BTree {
    BTreeNode* root;
    int t; // Minimum degree (t=2 -> Order 4)
public:
    BTree(int degree = 2) : root(nullptr), t(degree) {}

    void splitChild(BTreeNode* parent, int i, BTreeNode* child) {
        BTreeNode* z = new BTreeNode(child->isLeaf);
        int median = child->keys[t - 1];

        // Move right half keys to z
        for (int j = t; j < 2 * t - 1; j++) z->keys.push_back(child->keys[j]);
        if (!child->isLeaf) {
            for (int j = t; j < 2 * t; j++) z->children.push_back(child->children[j]);
            child->children.resize(t);
        }
        child->keys.resize(t - 1);

        parent->children.insert(parent->children.begin() + i + 1, z);
        parent->keys.insert(parent->keys.begin() + i, median);
    }

    void insertNonFull(BTreeNode* node, int key) {
        int i = node->keys.size() - 1;
        if (node->isLeaf) {
            node->keys.push_back(0);
            while (i >= 0 && node->keys[i] > key) {
                node->keys[i + 1] = node->keys[i];
                i--;
            }
            node->keys[i + 1] = key;
        } else {
            while (i >= 0 && node->keys[i] > key) i--;
            i++;
            if (node->children[i]->keys.size() == 2 * t - 1) {
                splitChild(node, i, node->children[i]);
                if (node->keys[i] < key) i++;
            }
            insertNonFull(node->children[i], key);
        }
    }

    void insert(int key) {
        if (!root) {
            root = new BTreeNode(true);
            root->keys.push_back(key);
            return;
        }
        if (root->keys.size() == 2 * t - 1) {
            BTreeNode* s = new BTreeNode(false);
            s->children.push_back(root);
            splitChild(s, 0, root);
            int i = (s->keys[0] < key) ? 1 : 0;
            insertNonFull(s->children[i], key);
            root = s;
        } else {
            insertNonFull(root, key);
        }
    }
};`,
      flowchart: [
        { id: 'start', type: 'terminal', text: 'Start BTree Insert(key)' },
        { id: 'chk_root', type: 'decision', text: 'Is root == NULL?' },
        { id: 'make_root', type: 'process', text: 'Create leaf root with key' },
        { id: 'root_full', type: 'decision', text: 'Root has 2t - 1 keys?' },
        { id: 'split_r', type: 'process', text: 'Allocate new root, split old root' },
        { id: 'ins_nf', type: 'process', text: 'insertNonFull(root, key)' },
        { id: 'end', type: 'terminal', text: 'B-Tree Insert Complete' }
      ]
    }
  }
};
