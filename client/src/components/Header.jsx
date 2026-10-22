import React from 'react';
import {
  GitBranch,
  Layers,
  Circle,
  Square,
  RectangleHorizontal,
  Box,
  Play,
  RotateCw,
  Sparkles,
  LayoutDashboard
} from 'lucide-react';

export default function Header({
  dataStructure,
  onSelectDS,
  operation,
  onSelectOp,
  inputData,
  onChangeInput,
  onRunEngine,
  isLoading,
  viewMode,
  onChangeViewMode,
  nodeShape,
  onChangeNodeShape,
  onApplyPreset,
  onGoDashboard,
  // Graph controls
  graphDirected,
  onChangeGraphDirected,
  graphNodes,
  onChangeGraphNodes,
  graphEdges,
  onChangeGraphEdges,
  graphStartNode,
  onChangeGraphStartNode,
  // BST Delete control
  deleteTarget,
  onChangeDeleteTarget,
  // B-Tree Order control
  btreeOrder,
  onChangeBtreeOrder
}) {
  const dsOptions = [
    { id: 'binary_tree', label: 'Binary Tree (General)', icon: GitBranch },
    { id: 'bst', label: 'Binary Search Tree (BST)', icon: GitBranch },
    { id: 'avl', label: 'AVL Tree (Height-Balanced)', icon: Sparkles },
    { id: 'heapsort', label: 'Heap & Heap Sort', icon: Layers },
    { id: 'graph', label: 'Graph Algorithms', icon: Box },
    { id: 'btree', label: 'B-Tree (Multiway)', icon: Layers },
  ];

  const getOperationsForDS = () => {
    switch (dataStructure) {
      case 'binary_tree':
        return [
          { id: 'insert', label: 'Level-Order Build / Insert' },
          { id: 'inorder', label: 'Inorder (LDR)' },
          { id: 'preorder', label: 'Preorder (DLR)' },
          { id: 'postorder', label: 'Postorder (LRD)' },
          { id: 'bfs', label: 'BFS (Level Order)' },
          { id: 'count_nodes', label: 'Count Total Nodes' },
          { id: 'count_leaves', label: 'Count Leaf Nodes' },
          { id: 'height', label: 'Compute Tree Height' },
          { id: 'mirror', label: 'Mirror Tree (Swap L/R)' },
        ];
      case 'bst':
        return [
          { id: 'insert', label: 'Build / Insert' },
          { id: 'inorder', label: 'Inorder (LDR)' },
          { id: 'preorder', label: 'Preorder (DLR)' },
          { id: 'postorder', label: 'Postorder (LRD)' },
          { id: 'delete', label: 'Delete Node' },
        ];
      case 'avl':
        return [{ id: 'insert', label: 'Insert & Rebalance' }];
      case 'heapsort':
        return [
          { id: 'max', label: 'Heap Sort (Max-Heap)' },
          { id: 'min', label: 'Min-Heap Build' },
        ];
      case 'graph':
        return [
          { id: 'bfs', label: 'BFS Traversal' },
          { id: 'dfs', label: 'DFS Traversal' },
          { id: 'dijkstra', label: 'Dijkstra Shortest Path' },
          { id: 'kruskal', label: "Kruskal's MST" },
          { id: 'prim', label: "Prim's MST" },
        ];
      case 'btree':
        return [{ id: 'insert', label: 'Insert & Split' }];
      default:
        return [{ id: 'insert', label: 'Run' }];
    }
  };

  return (
    <header className="bg-white border-b border-border shadow-sm sticky top-0 z-20">
      {/* Top Branding and View Mode Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {onGoDashboard && (
            <button
              onClick={onGoDashboard}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-semibold transition-colors border border-border"
              title="Return to Main Dashboard"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600" />
              <span>Dashboard</span>
            </button>
          )}

          <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-sm">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              DSA Step-by-Step Visualizer
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Interactive Algorithms & Data Structures in C++
            </p>
          </div>
        </div>

        {/* Global View & Shape Selectors */}
        <div className="flex items-center space-x-4">
          {/* Node Shape Switcher */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-border text-xs">
            <span className="text-[11px] font-medium text-slate-500 px-1.5 select-none">Shape:</span>
            <button
              onClick={() => onChangeNodeShape('circle')}
              className={`p-1.5 rounded-md flex items-center space-x-1 transition-colors ${
                nodeShape === 'circle'
                  ? 'bg-white shadow-xs text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Circle Nodes"
            >
              <Circle className="w-3.5 h-3.5" />
              <span>Circle</span>
            </button>
            <button
              onClick={() => onChangeNodeShape('square')}
              className={`p-1.5 rounded-md flex items-center space-x-1 transition-colors ${
                nodeShape === 'square'
                  ? 'bg-white shadow-xs text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Square Nodes"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Square</span>
            </button>
            <button
              onClick={() => onChangeNodeShape('rectangle')}
              className={`p-1.5 rounded-md flex items-center space-x-1 transition-colors ${
                nodeShape === 'rectangle'
                  ? 'bg-white shadow-xs text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Rectangle Nodes"
            >
              <RectangleHorizontal className="w-3.5 h-3.5" />
              <span>Rectangle</span>
            </button>
          </div>

          {/* 2D vs 3D View Switcher */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-border text-xs font-semibold">
            <button
              onClick={() => onChangeViewMode('2d')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                viewMode === '2d'
                  ? 'bg-white shadow-xs text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2D View
            </button>
            <button
              onClick={() => onChangeViewMode('3d')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                viewMode === '3d'
                  ? 'bg-white shadow-xs text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3D View
            </button>
          </div>
        </div>
      </div>

      {/* Data Structure Category Navigation Tabs */}
      <div className="bg-slate-50 border-t border-border px-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex space-x-1">
          {dsOptions.map((ds) => {
            const Icon = ds.icon;
            const isSelected = dataStructure === ds.id;
            return (
              <button
                key={ds.id}
                onClick={() => onSelectDS(ds.id)}
                className={`flex items-center space-x-2 py-2.5 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'border-indigo-600 text-indigo-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{ds.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Payload & Operation Execution Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 bg-white border-b border-border/50">
        {dataStructure === 'graph' ? (
          /* Graph Dedicated Toolbar with fully separated Inputs */
          <div className="flex flex-col space-y-2.5 w-full">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Algorithm Operation Selector */}
                <select
                  value={operation}
                  onChange={(e) => onSelectOp(e.target.value)}
                  className="text-xs font-semibold bg-slate-50 border border-border rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {getOperationsForDS().map((op) => (
                    <option key={op.id} value={op.id}>
                      {op.label}
                    </option>
                  ))}
                </select>

                {/* Graph Type Toggle: Undirected vs Directed */}
                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-border text-xs">
                  <button
                    type="button"
                    onClick={() => onChangeGraphDirected(false)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                      !graphDirected
                        ? 'bg-white shadow-xs text-indigo-700'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Undirected
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeGraphDirected(true)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                      graphDirected
                        ? 'bg-white shadow-xs text-indigo-700'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Directed
                  </button>
                </div>

                {/* Start Vertex Selector (for BFS, DFS, Dijkstra, Prim) */}
                {operation !== 'kruskal' && (
                  <div className="flex items-center space-x-1.5 text-xs bg-slate-50 border border-border rounded-lg px-2 py-1">
                    <span className="text-slate-500 font-semibold">Start:</span>
                    <input
                      type="text"
                      value={graphStartNode}
                      onChange={(e) => onChangeGraphStartNode(e.target.value.toUpperCase())}
                      placeholder="A"
                      maxLength={5}
                      className="w-10 text-center text-xs font-mono font-bold bg-white border border-slate-200 rounded py-0.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                )}

                {/* Run C++ Engine Button */}
                <button
                  onClick={onRunEngine}
                  disabled={isLoading}
                  className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors"
                >
                  {isLoading ? (
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                  <span>{isLoading ? 'Executing C++...' : 'Run C++ Engine'}</span>
                </button>
              </div>

              {/* Quick Graph Presets */}
              <div className="flex items-center space-x-1.5 text-xs">
                <span className="text-[11px] font-medium text-slate-400">Presets:</span>
                <button
                  onClick={() => onApplyPreset('graph-sample-undirected')}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-mono"
                >
                  Sample Undirected (6 Nodes)
                </button>
                <button
                  onClick={() => onApplyPreset('graph-sample-directed')}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-mono"
                >
                  Sample Directed (4 Nodes)
                </button>
                <button
                  onClick={() => onApplyPreset('graph-triangle')}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-mono"
                >
                  Triangle (3 Nodes)
                </button>
              </div>
            </div>

            {/* Separated Nodes & Weights Fields */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 text-xs">
              <div className="md:col-span-4 flex items-center space-x-2 bg-slate-50 border border-border rounded-lg px-3 py-1.5">
                <span className="font-semibold text-slate-600 whitespace-nowrap text-xs">
                  Nodes / Vertices:
                </span>
                <input
                  type="text"
                  value={graphNodes}
                  onChange={(e) => onChangeGraphNodes(e.target.value)}
                  placeholder="e.g. A, B, C, D, E, F"
                  className="flex-1 bg-transparent font-mono text-slate-800 placeholder-slate-400 focus:outline-none text-xs"
                />
              </div>

              <div className="md:col-span-8 flex items-center space-x-2 bg-slate-50 border border-border rounded-lg px-3 py-1.5">
                <span className="font-semibold text-slate-600 whitespace-nowrap text-xs">
                  Edges & Weights:
                </span>
                <input
                  type="text"
                  value={graphEdges}
                  onChange={(e) => onChangeGraphEdges(e.target.value)}
                  placeholder={
                    graphDirected
                      ? "e.g. A->B:4, A->C:2, B->D:5, C->D:1"
                      : "e.g. A-B:4, A-C:2, B-C:1, B-D:5, C-D:8"
                  }
                  className="flex-1 bg-transparent font-mono text-slate-800 placeholder-slate-400 focus:outline-none text-xs"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Standard Toolbar for BST, AVL, Heap, B-Tree */
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2 flex-1 min-w-[280px]">
              {/* Operation Selector */}
              <select
                value={operation}
                onChange={(e) => onSelectOp(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-border rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {getOperationsForDS().map((op) => (
                  <option key={op.id} value={op.id}>
                    {op.label}
                  </option>
                ))}
              </select>

              {/* Input Data Field */}
              <input
                type="text"
                value={inputData}
                onChange={(e) => onChangeInput(e.target.value)}
                placeholder="Comma-separated values e.g. 25, 20, 30, 10, 22, 5"
                className="flex-1 text-xs font-mono bg-slate-50 border border-border rounded-lg px-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />

              {/* If B-Tree: User Configurable Order / Minimum Degree */}
              {dataStructure === 'btree' && (
                <div className="flex items-center space-x-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1 text-xs">
                  <span className="font-semibold text-amber-900">Order (m):</span>
                  <select
                    value={btreeOrder}
                    onChange={(e) => onChangeBtreeOrder(e.target.value)}
                    className="font-mono font-bold bg-white border border-amber-300 rounded px-1.5 py-0.5 text-amber-900 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs cursor-pointer"
                  >
                    <option value="3">Order 3 (t=2, max 3 keys)</option>
                    <option value="4">Order 4 (t=2, max 3 keys)</option>
                    <option value="5">Order 5 (t=3, max 5 keys)</option>
                    <option value="6">Order 6 (t=3, max 5 keys)</option>
                  </select>
                  <span className="text-[10px] text-amber-700 font-mono hidden sm:inline">
                    (t = {Math.max(2, Math.floor((parseInt(btreeOrder, 10) || 4) / 2))})
                  </span>
                </div>
              )}

              {/* If BST Delete: dedicated Delete Target Field */}
              {dataStructure === 'bst' && operation === 'delete' && (
                <div className="flex items-center space-x-1.5 bg-rose-50 border border-rose-200 rounded-lg px-2 py-1 text-xs">
                  <span className="font-semibold text-rose-800">Delete Key:</span>
                  <input
                    type="number"
                    value={deleteTarget}
                    onChange={(e) => onChangeDeleteTarget(e.target.value)}
                    placeholder="20"
                    className="w-14 text-center font-mono font-bold bg-white border border-rose-300 rounded px-1 py-0.5 text-rose-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              )}

              {/* Run C++ Engine Button */}
              <button
                onClick={onRunEngine}
                disabled={isLoading}
                className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors"
              >
                {isLoading ? (
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span>{isLoading ? 'Executing C++...' : 'Run C++ Engine'}</span>
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-[11px] font-medium text-slate-400">Presets:</span>
              {dataStructure === 'binary_tree' && (
                <>
                  <button
                    onClick={() => onApplyPreset('1,2,3,4,5,6,7')}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-mono"
                  >
                    Complete 7-Node
                  </button>
                  <button
                    onClick={() => onApplyPreset('10,20,30,40,50')}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-mono"
                  >
                    5-Node Tree
                  </button>
                  <button
                    onClick={() => onApplyPreset('1,2,3,4,5,6,7,8,9,10')}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-mono"
                  >
                    10-Node Tree
                  </button>
                </>
              )}
              {dataStructure === 'avl' && (
                <>
                  <button
                    onClick={() => onApplyPreset('30,20,10')}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-mono"
                  >
                    LL Rotation
                  </button>
                  <button
                    onClick={() => onApplyPreset('10,20,30')}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-mono"
                  >
                    RR Rotation
                  </button>
                  <button
                    onClick={() => onApplyPreset('30,10,20')}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-mono"
                  >
                    LR Rotation
                  </button>
                  <button
                    onClick={() => onApplyPreset('10,30,20')}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-mono"
                  >
                    RL Rotation
                  </button>
                </>
              )}
              {dataStructure === 'heapsort' && (
                <>
                  <button
                    onClick={() => onApplyPreset('12,11,13,5,6,7')}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-mono"
                  >
                    Textbook Array 1
                  </button>
                  <button
                    onClick={() => onApplyPreset('4,10,3,5,1')}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-mono"
                  >
                    Textbook Array 2
                  </button>
                </>
              )}
              {dataStructure === 'bst' && (
                <>
                  <button
                    onClick={() => onApplyPreset('25,20,30,10,22,5')}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-mono"
                  >
                    Textbook BST
                  </button>
                  <button
                    onClick={() => onApplyPreset('25,15,35,10,20,30,40')}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-mono"
                  >
                    Balanced BST
                  </button>
                </>
              )}
              {dataStructure === 'btree' && (
                <>
                  <button
                    onClick={() => onApplyPreset('10,20,5,6,12,30,7,17')}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-mono"
                  >
                    Order 4 Multiway
                  </button>
                  <button
                    onClick={() => onApplyPreset('1,2,3,4,5,6,7,8,9,10')}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-mono"
                  >
                    Multi-split Chain
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
