# DSA Interactive Visualizer: Complete Academic Project Documentation

---

## 1. Executive Summary & Project Abstract

The **DSA Interactive Visualizer** is a high-performance, full-stack educational platform engineered to bridge the gap between theoretical Data Structures & Algorithms (DSA) concepts and visual, algorithmic comprehension. 

Traditional visualizers often implement lightweight, loosely simulated algorithms in JavaScript that diverge from standard university textbooks. In contrast, this project utilizes a **hybrid 3-tier architecture**:
1. **Core Computational Layer**: Native, textbook-accurate C++ execution engine implementing strict academic invariants and pointer manipulation.
2. **Middleware Orchestration Layer**: Node.js/Express API gateway leveraging OS child-process IPC to execute native binaries on-demand and stream serialized step-by-step traces.
3. **Interactive Graphics Layer**: A responsive React front-end delivering both 2D SVG vector graph visualizations and 3D isometric trigonometric Canvas projections, paired with synchronized pseudocode, flowcharts, and telemetry scrubbing.

---

## 2. High-Level 3-Tier System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TIER 1: PRESENTATION LAYER (React)                    │
│  - Dashboard: Course module hub with complexity badges                      │
│  - Visualizer2D: Interactive SVG Tree / Graph renderer with zoom/pan        │
│  - Visualizer3D: 3D Isometric View using pure trigonometric projection      │
│  - Controls: Step-by-step timeline scrubber, variable speed playback        │
│  - CodeViewer & Deduction: Dual C++ source code highlighter and logic panel │
│  - Academic Knowledge Base: Flowcharts, LaTeX proofs, and pseudocode        │
└──────────────────────────────────────▲──────────────────────────────────────┘
                                       │
                      HTTP / JSON (REST API: /api/run, /api/code)
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                    TIER 2: BACKEND BRIDGE (Node.js / Express)               │
│  - Endpoint /api/run: Spawns native dsa_engine.exe binary via IPC           │
│  - Streams stdout JSON execution frames directly back to client             │
│  - Endpoint /api/code/:ds: Delivers unadulterated textbook .hpp source      │
└──────────────────────────────────────▲──────────────────────────────────────┘
                                       │
                       CLI Arguments (--ds, --op, --data)
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│               TIER 3: NATIVE ALGORITHM ENGINE (C++11 / GCC)                 │
│  - Header-Only Implementations (.hpp) based on Varsha Patil textbook:       │
│    * Binary Tree (Ch. 7), BST, AVL, Heap & Heap Sort, Graph, B-Tree         │
│  - tracer.hpp: State capture, node activity tracking, step serialization     │
│  - main.cpp: Argument parsing and stdout JSON trace generator               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack & Technical Justifications

| Component | Technology | Technical Justification |
| :--- | :--- | :--- |
| **Algorithm Engine** | C++11 (GCC / MinGW) | Data structures require strict memory pointers (`Node* left, right`), recursion stack modeling, and cache efficiency aligned with university curricula. |
| **API Gateway** | Node.js & Express.js | Asynchronous event loop with non-blocking I/O (`child_process.spawn`) provides fast subprocess creation and JSON streaming without blocking. |
| **UI Framework** | React 18 & Vite | Declarative component model ensures sub-millisecond timeline scrubbing and rapid state reconciliation during algorithm playback. |
| **Styling & Icons** | Tailwind CSS & Lucide Icons | Utility-first responsive design matching modern desktop IDE standards. |
| **2D Graphics** | Scalable Vector Graphics (SVG) | Resolution-independent, crisp vector rendering with pan and zoom capabilities. |
| **3D Graphics** | HTML5 Canvas + Pure Trigonometry | Lightweight 3D isometric projection rendered at 60 FPS without heavy external WebGL dependencies (e.g., Three.js). |

---

## 4. Understanding `.hpp` vs `.h` vs `.cpp`

### What is `.hpp`?
**`.hpp` stands for C++ Header File** (`.h` + `pp` from C**pp**). 

In modern C++ engineering:
- **`.h` (C Header)**: Traditionally used in C. Contains function prototypes, structs, and `#define` macros without object-oriented features.
- **`.hpp` (C++ Header)**: Indicates that the header contains C++-specific constructs such as **classes**, **templates**, **namespaces**, and Standard Template Library (STL) containers (`std::vector`, `std::queue`, `std::stack`).
- **`.cpp` (C++ Implementation File)**: The main compilation unit that compiles into machine code (`dsa_engine.exe`).

### Why Header-Only (`.hpp`) in this Project?
1. **Self-Contained Encapsulation**: Each data structure (e.g., `binary_tree.hpp`, `bst.hpp`) encapsulates its node structure, class definition, and algorithmic methods in a single file.
2. **Zero-Configuration Inclusion**: Any driver program (`main.cpp`) can include the data structure with `#include "binary_tree.hpp"` without complex link-time configurations.
3. **Transparent Code Viewing**: The Express backend serves the exact `.hpp` file directly to the web UI so students can inspect authentic C++ source code.

---

## 5. Directory & File Walkthrough

### 5.1 Native Core Engine (`cpp_engine/`)
- **`include/tracer.hpp`**: The telemetry engine. Provides `addStep(action, codeLine, explanation, activeNodes, comparedKeys, stateJson)` and serializes algorithmic execution into an array of JSON objects.
- **`include/binary_tree.hpp`**: Complete implementation of Varsha Patil (Chapter 7):
  - `TreeNode` structure (`int data, id`, `TreeNode* left, right`).
  - Level-Order Queue Insertion (Breadth-First placement).
  - Inorder Traversal (L-D-R) — produces infix arithmetic expression.
  - Preorder Traversal (D-L-R) — produces prefix Polish notation.
  - Postorder Traversal (L-R-D) — produces postfix Reverse Polish notation.
  - BFS Traversal (`queue Q` level-order processing).
  - `CountNode()`: $1 + \text{Count}(L) + \text{Count}(R)$.
  - `CountLeaf()`: Evaluates nodes where $L = \text{NULL} \land R = \text{NULL}$.
  - `TreeHeight()`: $1 + \max(\text{Height}(L), \text{Height}(R))$.
  - `Mirror()`: Inverts the tree by swapping $L \leftrightarrow R$ child subtrees.
- **`include/bst.hpp`**: Binary Search Tree with $O(\log N)$ search, recursive insertion, and 3-case deletion (leaf, single child, two children via inorder predecessor/successor).
- **`include/avl.hpp`**: Adelson-Velsky & Landis self-balancing tree enforcing Balance Factor $\text{BF} \in \{-1, 0, +1\}$ via LL, RR, LR, and RL rotations.
- **`include/heap.hpp`**: Binary Heap mapped into flat array indices ($2i+1, 2i+2$) with $O(N)$ bottom-up heapification and $O(N \log N)$ in-place Heap Sort.
- **`include/graph.hpp`**: Adjacency-list graph supporting BFS, DFS, Dijkstra's Shortest Path, Kruskal's MST (Disjoint Set Union), and Prim's MST.
- **`include/btree.hpp`**: Order-$m$ multiway search tree with node capacity splits and median promotion.
- **`src/main.cpp`**: CLI driver parsing `--ds`, `--op`, and `--data` flags.

### 5.2 Backend API (`server/`)
- **`server.js`**:
  - `POST /api/run`: Accepts data structure name, operation, and input payload; spawns `dsa_engine.exe`; captures stdout; returns formatted trace array.
  - `GET /api/code/:ds`: Returns the raw `.hpp` source code for display in the Code Viewer.

### 5.3 Frontend Application (`client/`)
- **`src/components/Dashboard.jsx`**: Course dashboard with structured cards, time/space complexities, operation pills, and launch triggers.
- **`src/components/Header.jsx`**: Top navigation, mode switchers (2D/3D), node shape selectors (Circle, Square, Rectangle), custom data inputs, presets, and execution trigger.
- **`src/components/Visualizer2D.jsx`**: Calculates dynamic recursive node coordinates $(x, y)$, renders SVG connection edges, highlights active elements, and hosts synchronized bottom sequence bars (traversals and mathematical metric tallies).
- **`src/components/Visualizer3D.jsx`**: Pure trigonometric isometric 3D canvas renderer with real-time user rotation ($\theta$) and tilt ($\phi$) controls.
- **`src/components/Controls.jsx`**: Interactive VCR playback bar with timeline scrubbing, Play/Pause, Step Next/Prev, Reset, and speed adjustment ($0.5\times$ to $3\times$).
- **`src/components/CodeViewer.jsx`**: Synchronized display of clean textbook C++ code and academic pseudocode with active execution line highlighting.
- **`src/components/DeductionPanel.jsx`**: Real-time educational feedback explaining the mathematical invariant and operation rationale for the current step.
- **`src/utils/treeLayout.js`**: Non-overlapping coordinate calculation algorithms for binary trees, heaps, graphs, and multi-key B-Trees.
- **`src/utils/algorithmKnowledge.js`**: Academic knowledge repository containing pseudocode, clean C++ code, invariants, time/space bounds, and flowchart data.

---

## 6. Mathematical Formulations & Isometric 3D Math

### 6.1 Tree Coordinate Layout Algorithm
To prevent visual node overlaps, tree layout coordinates are calculated recursively:
$$X_{\text{child}} = X_{\text{parent}} \pm \frac{W}{2^{\text{depth} + 1}}$$
$$Y_{\text{child}} = Y_{\text{parent}} + \Delta Y$$
where $W$ is the total layout width and $\Delta Y$ is the vertical level separation.

### 6.2 3D Isometric Projection Equations
The 3D visualizer avoids external 3D libraries by projecting world coordinates $(X, Y, Z)$ into 2D viewport coordinates $(X', Y')$:
1. **Rotation around Y-axis by angle $\theta$**:
   $$X_{\text{rot}} = X \cos(\theta) - Z \sin(\theta)$$
   $$Z_{\text{rot}} = X \sin(\theta) + Z \cos(\theta)$$
2. **Tilt / Elevation around X-axis by angle $\phi$**:
   $$X' = C_x + X_{\text{rot}} \cdot S$$
   $$Y' = C_y + \big(Y \cos(\phi) - Z_{\text{rot}} \sin(\phi)\big) \cdot S$$
where $(C_x, C_y)$ is the canvas center and $S$ is the zoom scale factor.

---

## 7. How to Explain the Execution Flow to Your Teacher (Viva Walkthrough)

When demonstrating the project, walk through these exact five steps:

1. **User Action**: The user selects **Binary Tree**, inputs values `1, 2, 3, 4, 5, 6, 7`, and clicks **Inorder Traversal**.
2. **API Call**: React makes a `POST /api/run` request with payload `{ ds: "binary_tree", op: "inorder", data: "1,2,3,4,5,6,7" }`.
3. **C++ Engine Subprocess**: Express invokes `dsa_engine.exe --ds binary_tree --op inorder --data 1,2,3,4,5,6,7`.
4. **Step-by-Step Serialization**: As the recursive C++ function executes, each step records the active node, the code line number, the explanation, and the tree state into a JSON array via `tracer.hpp`.
5. **Interactive Rendering**: The React frontend receives the trace array. The user can hit **Play**, scrub the timeline slider, observe the node turn amber/green, inspect the corresponding line of C++ code, and watch the sequence array bar fill up in real time.

---

## 8. Summary of Supported Data Structures & Operations

| Module | Category | Primary Operations | Time Complexity | Space Complexity |
| :--- | :--- | :--- | :--- | :--- |
| **Binary Tree** | Hierarchical Trees | Level-Order Build, Inorder, Preorder, Postorder, BFS, Count Nodes, Count Leaves, Tree Height, Mirror Tree | $O(N)$ | $O(H) \text{ stack} / O(W) \text{ queue}$ |
| **Binary Search Tree** | Search Trees | Build/Insert, Inorder, Preorder, Postorder, 3-Case Deletion | $O(\log N) \text{ avg}, O(N) \text{ worst}$ | $O(H) \text{ stack}$ |
| **AVL Tree** | Self-Balancing Trees | Insert with LL, RR, LR, RL Rotations | $O(\log N) \text{ strict}$ | $O(\log N)$ |
| **Heap & Heap Sort** | Priority Queues | Min-Heap Build, Max-Heap Build, In-Place Heap Sort | $O(N) \text{ build}, O(N \log N) \text{ sort}$ | $O(1) \text{ in-place}$ |
| **Graph Algorithms** | Networks | Dijkstra Shortest Path, BFS, DFS, Kruskal's MST, Prim's MST | $O((V+E)\log V)$ | $O(V+E)$ |
| **B-Tree** | Multiway Trees | Order-$m$ Insert, Node Splitting, Median Promotion | $O(\log_t N)$ | $O(\log_t N)$ |
