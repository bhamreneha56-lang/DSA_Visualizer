import React, { useRef, useEffect, useState } from 'react';
import { RotateCw, Compass, Eye } from 'lucide-react';
import { calculateTreeLayout, calculateHeapLayout, calculateGraphLayout, calculateBTreeLayout } from '../utils/treeLayout';

export default function Visualizer3D({ currentTrace, nodeShape = 'circle', dataStructure, operation, traces = [], currentStepIndex = 0 }) {
  const canvasRef = useRef(null);
  const [rotationAngle, setRotationAngle] = useState(35); // Degrees around Y-axis
  const [tiltAngle, setTiltAngle] = useState(30); // Elevation tilt in degrees
  const [zoom, setZoom] = useState(1.1);

  const state = currentTrace?.state || {};
  const activeNodes = currentTrace?.activeNodes || [];
  const comparedKeys = currentTrace?.comparedKeys || [];
  const action = currentTrace?.action || '';

  // Calculate layout
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

  // 3D Isometric projection math
  const project3D = (x, y, z, cx, cy) => {
    const radY = (rotationAngle * Math.PI) / 180;
    const radX = (tiltAngle * Math.PI) / 180;

    // Center coordinates relative to canvas center
    const relX = x - width / 2;
    const relY = y - height / 2;
    const relZ = z || 0;

    // Rotate around Y-axis
    const rotX = relX * Math.cos(radY) - relZ * Math.sin(radY);
    const rotZ = relX * Math.sin(radY) + relZ * Math.cos(radY);

    // Tilt around X-axis (isometric projection)
    const projX = cx + rotX * zoom;
    const projY = cy + (relY * Math.cos(radX) - rotZ * Math.sin(radX)) * zoom;

    return { x: projX, y: projY, depth: rotZ };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cw = canvas.width;
    const ch = canvas.height;
    const cx = cw / 2;
    const cy = ch / 2 + 30;

    // Clear canvas
    ctx.clearRect(0, 0, cw, ch);

    // Draw isometric grid ground plate
    ctx.save();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    const gridSize = 7;
    const step = 60;
    for (let i = -gridSize; i <= gridSize; i++) {
      const p1 = project3D(width / 2 + i * step, height / 2 - gridSize * step, -50, cx, cy);
      const p2 = project3D(width / 2 + i * step, height / 2 + gridSize * step, -50, cx, cy);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      const p3 = project3D(width / 2 - gridSize * step, height / 2 + i * step, -50, cx, cy);
      const p4 = project3D(width / 2 + gridSize * step, height / 2 + i * step, -50, cx, cy);
      ctx.beginPath();
      ctx.moveTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.stroke();
    }
    ctx.restore();

    // Project links and nodes
    const projectedNodes = layout.nodes.map((node) => {
      const proj = project3D(node.x, node.y, node.z, cx, cy);
      const ground = project3D(node.x, node.y, -50, cx, cy);
      return { ...node, projX: proj.x, projY: proj.y, groundX: ground.x, groundY: ground.y, depth: proj.depth };
    });

    // Sort by depth (painter's algorithm)
    projectedNodes.sort((a, b) => a.depth - b.depth);

    // Draw 3D links between nodes
    layout.links.forEach((link) => {
      const s = projectedNodes.find((n) => n.val === link.source.val || n.id === link.source.id);
      const t = projectedNodes.find((n) => n.val === link.target.val || n.id === link.target.id);
      if (!s || !t) return;

      // Link drop shadow on ground
      ctx.save();
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.4)';
      ctx.lineWidth = 2 * zoom;
      ctx.beginPath();
      ctx.moveTo(s.groundX, s.groundY);
      ctx.lineTo(t.groundX, t.groundY);
      ctx.stroke();
      ctx.restore();

      // Elevated 3D connection beam
      ctx.save();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5 * zoom;
      ctx.beginPath();
      ctx.moveTo(s.projX, s.projY);
      ctx.lineTo(t.projX, t.projY);
      ctx.stroke();
      ctx.restore();
    });

    // Draw nodes in 3D
    projectedNodes.forEach((node) => {
      const isActive = activeNodes.includes(node.val);
      const isCompared = comparedKeys.includes(node.val);
      const isRotation = action.includes('ROTATE');

      let topColor = '#ffffff';
      let sideColor = '#cbd5e1';
      let strokeColor = '#4f46e5';

      if (isRotation && isActive) {
        topColor = '#8b5cf6';
        sideColor = '#7c3aed';
        strokeColor = '#6d28d9';
      } else if (isActive) {
        topColor = '#f59e0b';
        sideColor = '#d97706';
        strokeColor = '#b45309';
      } else if (isCompared) {
        topColor = '#3b82f6';
        sideColor = '#2563eb';
        strokeColor = '#1d4ed8';
      }

      const h = 20 * zoom; // Height of 3D extrusion

      // Draw vertical stem / pedestal to ground
      ctx.save();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(node.projX, node.projY);
      ctx.lineTo(node.groundX, node.groundY);
      ctx.stroke();
      ctx.restore();

      // Draw ground shadow ellipse
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.08)';
      ctx.beginPath();
      ctx.ellipse(node.groundX, node.groundY, 22 * zoom, 12 * zoom, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw 3D shape based on nodeShape
      ctx.save();
      if (nodeShape === 'circle') {
        const r = 22 * zoom;

        // Cylinder side body
        ctx.fillStyle = sideColor;
        ctx.beginPath();
        ctx.ellipse(node.projX, node.projY, r, r * 0.55, 0, 0, Math.PI);
        ctx.ellipse(node.projX, node.projY - h, r, r * 0.55, 0, Math.PI, 0, true);
        ctx.closePath();
        ctx.fill();

        // Cylinder top cap
        ctx.fillStyle = topColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = isActive ? 3 : 2;
        ctx.beginPath();
        ctx.ellipse(node.projX, node.projY - h, r, r * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Label
        ctx.fillStyle = isActive || isCompared ? '#ffffff' : '#0f172a';
        ctx.font = `600 ${Math.round(13 * zoom)}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.val, node.projX, node.projY - h);
      } else {
        // 3D Cube / Rectangular block
        const bw = (nodeShape === 'rectangle' ? 32 : 22) * zoom;
        const bh = 18 * zoom;

        // Draw top face
        ctx.fillStyle = topColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = isActive ? 3 : 2;
        ctx.beginPath();
        ctx.moveTo(node.projX - bw, node.projY - h);
        ctx.lineTo(node.projX, node.projY - h - bh * 0.6);
        ctx.lineTo(node.projX + bw, node.projY - h);
        ctx.lineTo(node.projX, node.projY - h + bh * 0.6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw left face
        ctx.fillStyle = sideColor;
        ctx.beginPath();
        ctx.moveTo(node.projX - bw, node.projY - h);
        ctx.lineTo(node.projX, node.projY - h + bh * 0.6);
        ctx.lineTo(node.projX, node.projY + bh * 0.6);
        ctx.lineTo(node.projX - bw, node.projY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw right face
        ctx.fillStyle = sideColor;
        ctx.beginPath();
        ctx.moveTo(node.projX, node.projY - h + bh * 0.6);
        ctx.lineTo(node.projX + bw, node.projY - h);
        ctx.lineTo(node.projX + bw, node.projY);
        ctx.lineTo(node.projX, node.projY + bh * 0.6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Label
        ctx.fillStyle = isActive || isCompared ? '#ffffff' : '#0f172a';
        ctx.font = `600 ${Math.round(12 * zoom)}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.val, node.projX, node.projY - h);
      }
      ctx.restore();
    });
  }, [layout, rotationAngle, tiltAngle, zoom, activeNodes, comparedKeys, action, nodeShape]);

  return (
    <div className="relative w-full h-[520px] bg-gradient-to-b from-slate-50 to-slate-100/60 border border-border rounded-xl overflow-hidden shadow-inner flex flex-col justify-between">
      {/* 3D Camera Controls Bar */}
      <div className="absolute top-3 left-3 z-10 flex items-center space-x-3 bg-white/95 backdrop-blur-sm border border-border rounded-lg px-3 py-1.5 shadow-sm text-xs text-slate-700">
        <div className="flex items-center space-x-1.5 font-medium">
          <Compass className="w-3.5 h-3.5 text-indigo-600" />
          <span>Orbit Angle:</span>
          <input
            type="range"
            min="0"
            max="360"
            value={rotationAngle}
            onChange={(e) => setRotationAngle(Number(e.target.value))}
            className="w-20 accent-indigo-600 cursor-pointer"
          />
          <span className="w-8 text-right font-mono text-indigo-700">{rotationAngle}°</span>
        </div>

        <div className="h-4 w-[1px] bg-border" />

        <div className="flex items-center space-x-1.5 font-medium">
          <Eye className="w-3.5 h-3.5 text-indigo-600" />
          <span>Tilt:</span>
          <input
            type="range"
            min="10"
            max="70"
            value={tiltAngle}
            onChange={(e) => setTiltAngle(Number(e.target.value))}
            className="w-16 accent-indigo-600 cursor-pointer"
          />
          <span className="w-7 text-right font-mono text-indigo-700">{tiltAngle}°</span>
        </div>

        <div className="h-4 w-[1px] bg-border" />

        <button
          onClick={() => {
            setRotationAngle((prev) => (prev + 30) % 360);
          }}
          className="flex items-center space-x-1 px-2 py-0.5 hover:bg-slate-100 rounded text-slate-600 font-semibold"
          title="Rotate 30 degrees"
        >
          <RotateCw className="w-3 h-3" />
          <span>+30°</span>
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={960}
        height={520}
        className="w-full h-full block cursor-grab active:cursor-grabbing"
      />

      {/* Traversal Sequence Bar for 3D View */}
      {dataStructure === 'bst' &&
        (operation === 'inorder' || operation === 'preorder' || operation === 'postorder' || action.startsWith('VISIT_')) &&
        traces.length > 0 && (
          <div className="bg-white border-t border-border px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                {operation === 'inorder' || action === 'VISIT_INORDER'
                  ? 'Inorder Sequence (L-D-R):'
                  : operation === 'preorder' || action === 'VISIT_PREORDER'
                  ? 'Preorder Sequence (D-L-R):'
                  : 'Postorder Sequence (L-R-D):'}
              </span>
              <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
                {traces.map((t, idx) => {
                  const val = t.activeNodes?.[0];
                  const isCurrentActive = idx === currentStepIndex;
                  const isVisited = idx <= currentStepIndex;

                  return (
                    <div
                      key={idx}
                      className={`flex flex-col items-center justify-center w-9 h-10 border rounded-md transition-all ${
                        isCurrentActive
                          ? 'bg-amber-100 border-amber-500 font-bold scale-105 shadow-sm text-amber-900 ring-2 ring-amber-300'
                          : isVisited
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-semibold'
                          : 'bg-slate-50 border-dashed border-slate-300 text-slate-400 opacity-60'
                      }`}
                    >
                      <span className="text-xs">{isVisited ? val : '?'}</span>
                      <span className="text-[8px] text-slate-400">[{idx}]</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Visited: <strong className="text-indigo-600">{Math.min(currentStepIndex + 1, traces.length)}</strong> / {traces.length}
            </div>
          </div>
        )}
    </div>
  );
}
