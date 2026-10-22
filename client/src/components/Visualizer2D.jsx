import React, { useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { calculateTreeLayout, calculateHeapLayout, calculateGraphLayout, calculateBTreeLayout } from '../utils/treeLayout';

export default function Visualizer2D({ currentTrace, nodeShape = 'circle', dataStructure, operation, traces = [], currentStepIndex = 0 }) {
  const svgRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const state = currentTrace?.state || {};
  const activeNodes = currentTrace?.activeNodes || [];
  const comparedKeys = currentTrace?.comparedKeys || [];
  const action = currentTrace?.action || '';

  // Calculate layout based on data structure type
  let layout = { nodes: [], links: [] };
  const width = 860;
  const height = 480;

  if (state.type === 'tree' || state.type === 'avl') {
    layout = calculateTreeLayout(state.root, width, height);
  } else if (state.type === 'heap') {
    layout = calculateHeapLayout(state.array, state.heapSize, width, height);
  } else if (state.type === 'graph') {
    layout = calculateGraphLayout(state, width, height);
  } else if (state.type === 'btree') {
    layout = calculateBTreeLayout(state.root, width, height);
  }

  const isTraversal =
    (dataStructure === 'bst' || dataStructure === 'binary_tree') &&
    (operation === 'inorder' || operation === 'preorder' || operation === 'postorder' || operation === 'bfs' || operation === 'levelorder' || action.startsWith('VISIT_') || action === 'BFS_VISIT');

  // Traversal sequence: only steps that visit a node
  const traversalSteps = traces.filter(
    (t) => t.action?.startsWith('VISIT_') || t.action === 'BFS_VISIT'
  );
  const fullTraversalSequence = traversalSteps.map((t) => t.activeNodes?.[0]).filter((v) => v !== undefined);

  // Current visited index within traversal sequence
  const currentTraversalVisitIndex = traces
    .slice(0, currentStepIndex + 1)
    .filter((t) => t.action?.startsWith('VISIT_') || t.action === 'BFS_VISIT').length - 1;

  const traversalTitle =
    operation === 'inorder' || action === 'VISIT_INORDER'
      ? 'Inorder Traversal Sequence (L-D-R):'
      : operation === 'preorder' || action === 'VISIT_PREORDER'
      ? 'Preorder Traversal Sequence (D-L-R):'
      : operation === 'postorder' || action === 'VISIT_POSTORDER'
      ? 'Postorder Traversal Sequence (L-R-D):'
      : operation === 'bfs' || operation === 'levelorder' || action === 'BFS_VISIT'
      ? 'Breadth-First (BFS) / Level-Order Sequence:'
      : 'Traversal Sequence:';

  // Tree Metrics & Count Operations
  const isMetricsOp =
    dataStructure === 'binary_tree' &&
    (operation === 'count_nodes' || operation === 'count_leaves' || operation === 'height');

  const latestTally = currentTrace?.comparedKeys?.[0];
  const finalMetricStep = traces[traces.length - 1];
  const finalResult = finalMetricStep?.comparedKeys?.[0];
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleZoom = (delta) => {
    setZoom((prev) => Math.min(2.5, Math.max(0.5, prev + delta)));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Helper to determine node status color
  const getNodeColor = (nodeVal) => {
    const isActive = activeNodes.includes(nodeVal);
    const isCompared = comparedKeys.includes(nodeVal);
    const isRotation = action.includes('ROTATE');

    if (isRotation && isActive) {
      return {
        bg: '#8b5cf6', // Violet for rotation pivot
        border: '#7c3aed',
        text: '#ffffff',
        badgeBg: '#f3e8ff',
        badgeText: '#6b21a8'
      };
    }
    if (isActive) {
      return {
        bg: '#f59e0b', // Amber for active
        border: '#d97706',
        text: '#ffffff',
        badgeBg: '#fef3c7',
        badgeText: '#92400e'
      };
    }
    if (isCompared) {
      return {
        bg: '#3b82f6', // Sky blue for comparison
        border: '#2563eb',
        text: '#ffffff',
        badgeBg: '#dbeafe',
        badgeText: '#1e40af'
      };
    }
    return {
      bg: '#ffffff',
      border: '#4f46e5', // Brand Indigo
      text: '#0f172a',
      badgeBg: '#eef2ff',
      badgeText: '#4338ca'
    };
  };

  // Render SVG node by selected shape
  const renderNodeShape = (node) => {
    // Dedicated Multiway B-Tree Node Renderer
    if (state.type === 'btree' || (node.keys && node.keys.length > 0)) {
      const keys = node.keys || [];
      const numKeys = keys.length || 1;
      const totalW = node.width || Math.max(64, numKeys * 40 + 16);
      const totalH = node.height || 36;
      const cellW = (totalW - 8) / Math.max(1, numKeys);

      const hasActiveKey = keys.some((k) => activeNodes.includes(k));
      const hasCompKey = keys.some((k) => comparedKeys.includes(k));

      return (
        <g
          key={node.id}
          transform={`translate(${node.x - totalW / 2}, ${node.y - totalH / 2})`}
          className="cursor-pointer transition-transform duration-300"
        >
          {/* Subtle outer glow on active */}
          {hasActiveKey && (
            <rect
              x="-4"
              y="-4"
              width={totalW + 8}
              height={totalH + 8}
              rx="10"
              fill="#f59e0b"
              opacity="0.25"
              className="animate-pulse"
            />
          )}

          {/* Outer container */}
          <rect
            width={totalW}
            height={totalH}
            rx="8"
            fill="#ffffff"
            stroke={hasActiveKey ? '#f59e0b' : hasCompKey ? '#3b82f6' : '#6366f1'}
            strokeWidth={hasActiveKey ? '3' : '2'}
            className="shadow-sm transition-colors duration-300"
          />

          {/* Segmented cells for each key */}
          {keys.map((k, idx) => {
            const isKActive = activeNodes.includes(k);
            const isKCompared = comparedKeys.includes(k);
            const cellX = 4 + idx * cellW;

            let cellFill = 'transparent';
            let textFill = '#0f172a';
            if (isKActive) {
              cellFill = '#fef3c7';
              textFill = '#92400e';
            } else if (isKCompared) {
              cellFill = '#dbeafe';
              textFill = '#1e40af';
            }

            return (
              <g key={idx}>
                {/* Cell Background */}
                <rect
                  x={cellX}
                  y="4"
                  width={cellW}
                  height={totalH - 8}
                  rx="4"
                  fill={cellFill}
                  className="transition-colors duration-300"
                />
                {/* Cell divider */}
                {idx > 0 && (
                  <line
                    x1={cellX}
                    y1="4"
                    x2={cellX}
                    y2={totalH - 4}
                    stroke="#e2e8f0"
                    strokeWidth="1.5"
                  />
                )}
                {/* Key Value */}
                <text
                  x={cellX + cellW / 2}
                  y={totalH / 2 + 5}
                  textAnchor="middle"
                  fill={textFill}
                  fontSize="13"
                  fontWeight="700"
                  fontFamily="Inter, sans-serif"
                >
                  {k}
                </text>
              </g>
            );
          })}

          {/* Leaf / Root label badge */}
          {node.isLeaf ? (
            <text
              x={totalW / 2}
              y={totalH + 13}
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill="#94a3b8"
            >
              Leaf
            </text>
          ) : (
            <text
              x={totalW / 2}
              y={totalH + 13}
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill="#6366f1"
            >
              Internal
            </text>
          )}
        </g>
      );
    }

    const color = getNodeColor(node.val);
    const isActive = activeNodes.includes(node.val);
    const isNew = action.includes('INSERT') && isActive;

    const groupClasses = `cursor-pointer transition-transform duration-300 ${
      isNew ? 'animate-pop-in' : ''
    } ${isActive ? 'animate-glow-active' : ''}`;

    if (nodeShape === 'circle') {
      return (
        <g key={node.id} transform={`translate(${node.x}, ${node.y})`} className={groupClasses}>
          {/* Subtle outer glow on active */}
          {isActive && (
            <circle r="30" fill={color.border} opacity="0.25" className="animate-ping" />
          )}
          <circle
            r="24"
            fill={color.bg}
            stroke={color.border}
            strokeWidth={isActive ? '3.5' : '2.5'}
            className="shadow-md transition-colors duration-300"
          />
          <text
            textAnchor="middle"
            dy="5"
            fill={color.text}
            fontSize="14"
            fontWeight="600"
            fontFamily="Inter, sans-serif"
          >
            {node.val}
          </text>
          {/* Balance factor badge if AVL */}
          {node.bf !== undefined && (
            <g transform="translate(16, -16)">
              <circle r="10" fill={color.badgeBg} stroke={color.border} strokeWidth="1" />
              <text textAnchor="middle" dy="3.5" fontSize="10" fontWeight="700" fill={color.badgeText}>
                {node.bf > 0 ? `+${node.bf}` : node.bf}
              </text>
            </g>
          )}
        </g>
      );
    }

    if (nodeShape === 'square') {
      return (
        <g key={node.id} transform={`translate(${node.x - 22}, ${node.y - 22})`} className={groupClasses}>
          {isActive && (
            <rect width="52" height="52" x="-4" y="-4" rx="10" fill={color.border} opacity="0.25" />
          )}
          <rect
            width="44"
            height="44"
            rx="8"
            fill={color.bg}
            stroke={color.border}
            strokeWidth={isActive ? '3.5' : '2.5'}
            className="shadow-md transition-colors duration-300"
          />
          <text
            x="22"
            y="26"
            textAnchor="middle"
            fill={color.text}
            fontSize="14"
            fontWeight="600"
            fontFamily="Inter, sans-serif"
          >
            {node.val}
          </text>
          {node.bf !== undefined && (
            <g transform="translate(36, -6)">
              <circle r="9" fill={color.badgeBg} stroke={color.border} strokeWidth="1" />
              <text textAnchor="middle" dy="3.5" fontSize="10" fontWeight="700" fill={color.badgeText}>
                {node.bf > 0 ? `+${node.bf}` : node.bf}
              </text>
            </g>
          )}
        </g>
      );
    }

    // Rectangle shape: Shows Key + Subtitle (BF or Height)
    return (
      <g key={node.id} transform={`translate(${node.x - 34}, ${node.y - 22})`} className={groupClasses}>
        {isActive && (
          <rect width="76" height="52" x="-4" y="-4" rx="10" fill={color.border} opacity="0.25" />
        )}
        <rect
          width="68"
          height="44"
          rx="8"
          fill={color.bg}
          stroke={color.border}
          strokeWidth={isActive ? '3.5' : '2.5'}
          className="shadow-md transition-colors duration-300"
        />
        <text
          x="34"
          y="20"
          textAnchor="middle"
          fill={color.text}
          fontSize="13"
          fontWeight="700"
          fontFamily="Inter, sans-serif"
        >
          {node.val}
        </text>
        <text
          x="34"
          y="35"
          textAnchor="middle"
          fill={isActive ? '#ffffff' : '#64748b'}
          fontSize="10"
          fontWeight="500"
          fontFamily="Inter, sans-serif"
        >
          {node.bf !== undefined ? `BF: ${node.bf > 0 ? '+' : ''}${node.bf}` : `H: ${node.height || 1}`}
        </text>
      </g>
    );
  };

  return (
    <div className="relative w-full h-[520px] bg-slate-50 border border-border rounded-xl overflow-hidden select-none shadow-inner flex flex-col justify-between">
      {/* Zoom / Pan Controls Overlay */}
      <div className="absolute top-3 right-3 z-10 flex items-center space-x-1 bg-white/90 backdrop-blur-sm border border-border rounded-lg p-1 shadow-sm">
        <button
          onClick={() => handleZoom(0.15)}
          className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-indigo-600 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(-0.15)}
          className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-indigo-600 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-indigo-600 transition-colors"
          title="Reset View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main SVG Workspace */}
      <svg
        ref={svgRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          <linearGradient id="linkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="highlightLinkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Directed Graph Arrow Markers */}
          <marker
            id="graph-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#94a3b8" />
          </marker>
          <marker
            id="graph-arrow-active"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#f59e0b" />
          </marker>
        </defs>

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} className="transition-transform duration-75">
          {/* Render Edge Links */}
          {layout.links.map((link) => {
            const isHighlight =
              state.type === 'graph' &&
              (state.highlightedEdges || []).some(
                (he) =>
                  (he.u === link.u && he.v === link.v) ||
                  (!state.isDirected && he.u === link.v && he.v === link.u)
              );

            let x1 = link.source.x;
            let y1 = link.source.y;
            let x2 = link.target.x;
            let y2 = link.target.y;

            if (state.type === 'btree') {
              y1 = link.source.y + (link.source.height || 36) / 2;
              y2 = link.target.y - (link.target.height || 36) / 2;
            } else if (state.type === 'graph' && state.isDirected) {
              const dx = x2 - x1;
              const dy = y2 - y1;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist > 30) {
                const nodeRadius = 26;
                x2 = link.target.x - (dx / dist) * nodeRadius;
                y2 = link.target.y - (dy / dist) * nodeRadius;
              }
            }

            return (
              <g key={link.id}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isHighlight ? '#f59e0b' : '#cbd5e1'}
                  strokeWidth={isHighlight ? '3.5' : '2'}
                  strokeLinecap="round"
                  markerEnd={
                    state.type === 'graph' && state.isDirected
                      ? isHighlight
                        ? 'url(#graph-arrow-active)'
                        : 'url(#graph-arrow)'
                      : undefined
                  }
                  className="transition-colors duration-300"
                />
                {/* Weight label for graphs */}
                {link.weight !== undefined && (
                  <g transform={`translate(${(link.source.x + link.target.x) / 2}, ${(link.source.y + link.target.y) / 2})`}>
                    <rect x="-13" y="-10" width="26" height="20" rx="4" fill="#ffffff" stroke={isHighlight ? '#f59e0b' : '#e2e8f0'} strokeWidth="1" />
                    <text textAnchor="middle" dy="4" fontSize="11" fontWeight="700" fill={isHighlight ? '#d97706' : '#475569'}>
                      {link.weight}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Render Nodes */}
          {layout.nodes.map((node) => renderNodeShape(node))}
        </g>
      </svg>

      {/* Traversal Sequence Array Synchronization Bar (Preorder, Inorder, Postorder, BFS) */}
      {isTraversal && fullTraversalSequence.length > 0 && (
        <div className="bg-white border-t border-border px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              {traversalTitle}
            </span>
            <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
              {fullTraversalSequence.map((val, idx) => {
                const isCurrentActive = idx === currentTraversalVisitIndex;
                const isVisited = idx <= currentTraversalVisitIndex;

                return (
                  <div
                    key={idx}
                    className={`flex flex-col items-center justify-center w-10 h-11 border rounded-md transition-all ${
                      isCurrentActive
                        ? 'bg-amber-100 border-amber-500 font-bold scale-105 shadow-sm text-amber-900 ring-2 ring-amber-300'
                        : isVisited
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-semibold'
                        : 'bg-slate-50 border-dashed border-slate-300 text-slate-400 opacity-60'
                    }`}
                  >
                    <span className="text-sm">{isVisited ? val : '?'}</span>
                    <span className="text-[9px] text-slate-400">[{idx}]</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Visited:{' '}
            <strong className="text-indigo-600">
              {Math.max(0, Math.min(currentTraversalVisitIndex + 1, fullTraversalSequence.length))}
            </strong>{' '}
            / {fullTraversalSequence.length}
          </div>
        </div>
      )}

      {/* Tree Metrics Bar (Count Nodes, Count Leaves, Tree Height) */}
      {isMetricsOp && (
        <div className="bg-white border-t border-border px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              {operation === 'count_nodes'
                ? 'Node Counting Metric:'
                : operation === 'count_leaves'
                ? 'Leaf Node Metric:'
                : 'Tree Height Metric:'}
            </span>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono font-bold">
                Formula:{' '}
                {operation === 'count_nodes'
                  ? '1 + Count(L) + Count(R)'
                  : operation === 'count_leaves'
                  ? 'Leaf = (L==NULL && R==NULL) ? 1 : (Leaf(L) + Leaf(R))'
                  : '1 + max(Height(L), Height(R))'}
              </span>
              {latestTally !== undefined && (
                <span className="px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-bold">
                  Current Step Value: {latestTally}
                </span>
              )}
            </div>
          </div>
          <div className="text-xs text-slate-600 font-mono">
            Final Computed Result:{' '}
            <strong className="text-emerald-600 text-sm font-bold">
              {finalResult !== undefined ? finalResult : 'Computing...'}
            </strong>
          </div>
        </div>
      )}
      {state.type === 'heap' && state.array && (
        <div className="bg-white border-t border-border px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Heap Array Mapping:
            </span>
            <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
              {state.array.map((val, idx) => {
                const isActive = activeNodes.includes(val);
                const isSorted = state.sortedBoundary !== undefined && state.sortedBoundary !== -1 && idx >= state.sortedBoundary;
                return (
                  <div
                    key={idx}
                    className={`flex flex-col items-center justify-center w-10 h-11 border rounded-md transition-all ${
                      isActive
                        ? 'bg-amber-100 border-amber-500 font-bold scale-105 shadow-sm text-amber-900'
                        : isSorted
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                        : 'bg-slate-50 border-border text-slate-800'
                    }`}
                  >
                    <span className="text-sm font-semibold">{val}</span>
                    <span className="text-[9px] text-slate-400">[{idx}]</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Heap Size: <strong className="text-indigo-600">{state.heapSize ?? state.array.length}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
