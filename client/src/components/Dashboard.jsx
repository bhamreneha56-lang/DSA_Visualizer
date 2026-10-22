import React from 'react';
import {
  GitBranch,
  Sparkles,
  Layers,
  Box,
  ArrowRight,
  Code2,
  Cpu,
  Workflow,
  ShieldCheck,
  Zap,
  Play
} from 'lucide-react';

export default function Dashboard({ onSelectModule }) {
  const modules = [
    {
      id: 'binary_tree',
      title: 'Binary Tree (General & Complete)',
      category: 'Hierarchical Trees',
      icon: GitBranch,
      color: 'indigo',
      accentBg: 'bg-indigo-50',
      accentText: 'text-indigo-600',
      accentBorder: 'border-indigo-100',
      description:
        'Fundamental non-linear hierarchical data structure where each node has at most two children (Lchild, Rchild). Supports level-order insertion, recursive traversals, BFS queue traversal, counting nodes/leaves, tree height, and mirroring.',
      timeComplexity: 'O(N) traversal',
      spaceComplexity: 'O(H) / O(W)',
      operations: [
        { id: 'insert', label: 'Level-Order Build' },
        { id: 'inorder', label: 'Inorder (LDR)' },
        { id: 'preorder', label: 'Preorder (DLR)' },
        { id: 'postorder', label: 'Postorder (LRD)' },
        { id: 'bfs', label: 'BFS (Level Order)' },
        { id: 'count_nodes', label: 'Count Nodes' },
        { id: 'count_leaves', label: 'Count Leaf Nodes' },
        { id: 'height', label: 'Tree Height' },
        { id: 'mirror', label: 'Mirror Tree' }
      ],
      defaultOp: 'insert'
    },
    {
      id: 'bst',
      title: 'Binary Search Tree (BST)',
      category: 'Hierarchical Trees',
      icon: GitBranch,
      color: 'indigo',
      accentBg: 'bg-indigo-50',
      accentText: 'text-indigo-600',
      accentBorder: 'border-indigo-100',
      description:
        'Standard binary search tree maintaining the key invariant: Left Subtree < Root < Right Subtree. Supports full recursive insertion, traversals, and 3-case deletion.',
      timeComplexity: 'O(log N) avg',
      spaceComplexity: 'O(H) stack',
      operations: [
        { id: 'insert', label: 'Build / Insert' },
        { id: 'inorder', label: 'Inorder (LDR)' },
        { id: 'preorder', label: 'Preorder (DLR)' },
        { id: 'postorder', label: 'Postorder (LRD)' },
        { id: 'delete', label: 'Delete Node' },
      ],
      defaultOp: 'insert'
    },
    {
      id: 'avl',
      title: 'AVL Tree (Height-Balanced)',
      category: 'Self-Balancing Trees',
      icon: Sparkles,
      color: 'purple',
      accentBg: 'bg-purple-50',
      accentText: 'text-purple-600',
      accentBorder: 'border-purple-100',
      description:
        'Adelson-Velsky and Landis strictly balanced tree guaranteeing O(log N) worst-case time by enforcing Balance Factor BF ∈ {-1, 0, +1} using Single and Double Rotations.',
      timeComplexity: 'O(log N) strict',
      spaceComplexity: 'O(log N)',
      operations: [
        { id: 'insert', label: 'Insert & Rebalance (LL, RR, LR, RL)' }
      ],
      defaultOp: 'insert'
    },
    {
      id: 'heapsort',
      title: 'Heap & Heap Sort',
      category: 'Priority Queues & In-Place Sorting',
      icon: Layers,
      color: 'amber',
      accentBg: 'bg-amber-50',
      accentText: 'text-amber-600',
      accentBorder: 'border-amber-100',
      description:
        'Complete binary tree mapped directly to an array. Features O(N) bottom-up heapification followed by in-place successive root extractions.',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(1) in-place',
      operations: [
        { id: 'max', label: 'Heap Sort (Max-Heap)' },
        { id: 'min', label: 'Min-Heap Construction' }
      ],
      defaultOp: 'max'
    },
    {
      id: 'graph',
      title: 'Graph Algorithms',
      category: 'Networks & Shortest Paths',
      icon: Box,
      color: 'blue',
      accentBg: 'bg-blue-50',
      accentText: 'text-blue-600',
      accentBorder: 'border-blue-100',
      description:
        'Network traversal, shortest paths, and minimum spanning trees. Supports both directed and undirected graphs with custom weights and vertices.',
      timeComplexity: 'O((V + E) log V)',
      spaceComplexity: 'O(V + E)',
      operations: [
        { id: 'dijkstra', label: 'Dijkstra Shortest Path' },
        { id: 'bfs', label: 'BFS Traversal' },
        { id: 'dfs', label: 'DFS Traversal' },
        { id: 'kruskal', label: "Kruskal's MST" },
        { id: 'prim', label: "Prim's MST" }
      ],
      defaultOp: 'dijkstra'
    },
    {
      id: 'btree',
      title: 'B-Tree (Multiway Search Tree)',
      category: 'Multiway Disk-Storage Structures',
      icon: Layers,
      color: 'emerald',
      accentBg: 'bg-emerald-50',
      accentText: 'text-emerald-600',
      accentBorder: 'border-emerald-100',
      description:
        'Order 4 (minimum degree t = 2) self-balancing multiway search tree. Handles multi-key node containers, key routing, and median promotion upon node capacity split.',
      timeComplexity: 'O(log_t N)',
      spaceComplexity: 'O(log_t N)',
      operations: [
        { id: 'insert', label: 'Insert & Median Split' }
      ],
      defaultOp: 'insert'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-border shadow-xs sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-xs">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight">
                DSA Interactive Visualizer
              </span>
              <span className="block text-xs text-slate-500 font-medium">
                Step-by-Step Algorithms & Data Structures Platform
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
            <div className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>C++ Engine Online</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-slate-50 border-b border-border/60 py-10 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3.5 py-1.5 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Interactive Learning Dashboard</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Data Structures & Algorithms Visualizer
          </h1>

          <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Select an algorithm module to launch the interactive workspace. Inspect step-by-step 2D & 3D visualizations, textbook C++ source code, control flowcharts, pseudocode, and mathematical deductions.
          </p>

          {/* Quick Feature Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-medium text-slate-600">
            <span className="bg-white border border-slate-200 px-3 py-1 rounded-lg shadow-2xs flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              <span>Native C++ Core</span>
            </span>
            <span className="bg-white border border-slate-200 px-3 py-1 rounded-lg shadow-2xs flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>2D & 3D Isometric View</span>
            </span>
            <span className="bg-white border border-slate-200 px-3 py-1 rounded-lg shadow-2xs flex items-center space-x-1.5">
              <Workflow className="w-3.5 h-3.5 text-blue-600" />
              <span>Algorithmic Flowcharts</span>
            </span>
            <span className="bg-white border border-slate-200 px-3 py-1 rounded-lg shadow-2xs flex items-center space-x-1.5">
              <Code2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Textbook C++ Code</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Module Cards Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Available Modules</h2>
            <p className="text-xs text-slate-500">Choose a data structure or specific operation to launch</p>
          </div>
          <span className="text-xs font-mono font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md">
            6 Modules Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className="bg-white border border-border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group hover:border-indigo-300"
              >
                {/* Top card info */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className={`${m.accentBg} ${m.accentText} p-3 rounded-xl border ${m.accentBorder}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {m.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {m.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {m.description}
                    </p>
                  </div>

                  {/* Complexities */}
                  <div className="flex items-center space-x-2 pt-1 font-mono text-[10px]">
                    <span className="bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded">
                      Time: <strong className="text-indigo-600">{m.timeComplexity}</strong>
                    </span>
                    <span className="bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded">
                      Space: <strong className="text-purple-600">{m.spaceComplexity}</strong>
                    </span>
                  </div>

                  {/* Operations List */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Operations:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {m.operations.map((op) => (
                        <button
                          key={op.id}
                          onClick={() => onSelectModule(m.id, op.id)}
                          className="text-[11px] font-medium bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 hover:border-indigo-200 px-2.5 py-1 rounded-md transition-all flex items-center space-x-1"
                        >
                          <Play className="w-2.5 h-2.5 fill-current opacity-70" />
                          <span>{op.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Launch Button */}
                <div className="pt-5 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => onSelectModule(m.id, m.defaultOp)}
                    className="w-full bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2 group-hover:bg-indigo-600"
                  >
                    <span>Launch Visualizer</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-4 text-center text-xs text-slate-500">
        DSA Step-by-Step Visualizer • High-Performance Algorithm Simulation Environment
      </footer>
    </div>
  );
}
