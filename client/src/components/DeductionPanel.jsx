import React from 'react';
import { Lightbulb, Calculator, ArrowRight, Activity, GitBranch } from 'lucide-react';

export default function DeductionPanel({ currentTrace, dataStructure }) {
  if (!currentTrace) {
    return (
      <div className="bg-white border border-border rounded-xl p-4 text-center text-slate-400 text-sm">
        No active execution trace. Run an operation to inspect step deductions.
      </div>
    );
  }

  const { step, action, explanation, activeNodes = [], comparedKeys = [], codeLine } = currentTrace;

  // Format action badge color
  const getActionBadge = (act) => {
    if (act.includes('ROTATE')) {
      return { bg: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Tree Rotation' };
    }
    if (act.includes('SWAP')) {
      return { bg: 'bg-amber-100 text-amber-800 border-amber-200', label: 'Element Swap' };
    }
    if (act.includes('COMPARE')) {
      return { bg: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Key Comparison' };
    }
    if (act.includes('INSERT') || act.includes('CREATE')) {
      return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: 'Node Formation' };
    }
    if (act.includes('RELAX')) {
      return { bg: 'bg-cyan-100 text-cyan-800 border-cyan-200', label: 'Edge Relaxation' };
    }
    return { bg: 'bg-slate-100 text-slate-700 border-slate-200', label: act };
  };

  const badge = getActionBadge(action);

  // Math formula helper based on data structure
  const renderFormula = () => {
    if (dataStructure === 'avl') {
      return (
        <div className="text-[11px] font-mono bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-700 space-y-1">
          <div className="font-semibold text-indigo-700">AVL Balance Factor Rule:</div>
          <div>BF(node) = height(left) - height(right)</div>
          <div className="text-slate-500 text-[10px]">
            Balanced if BF ∈ {'{-1, 0, +1}'}. If |BF| &gt; 1, rotation required.
          </div>
        </div>
      );
    }
    if (dataStructure === 'heap' || dataStructure === 'heapsort') {
      return (
        <div className="text-[11px] font-mono bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-700 space-y-1">
          <div className="font-semibold text-indigo-700">Binary Heap Array Mapping:</div>
          <div>Parent(i) = ⌊(i - 1) / 2⌋</div>
          <div>Left(i) = 2i + 1, Right(i) = 2i + 2</div>
        </div>
      );
    }
    if (dataStructure === 'graph') {
      return (
        <div className="text-[11px] font-mono bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-700 space-y-1">
          <div className="font-semibold text-indigo-700">Graph Algorithm Properties:</div>
          <div>Dijkstra: dist[v] = min(dist[v], dist[u] + weight(u, v))</div>
          <div>Kruskal: Greedily add min-weight edge without creating a cycle.</div>
        </div>
      );
    }
    if (dataStructure === 'btree') {
      return (
        <div className="text-[11px] font-mono bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-700 space-y-1">
          <div className="font-semibold text-indigo-700">B-Tree Invariants (Order M = 4, t = 2):</div>
          <div>Keys per internal node: t - 1 ≤ keys ≤ 2t - 1 (1 to 3 keys)</div>
          <div>Children per internal node: t ≤ children ≤ 2t (2 to 4 children)</div>
          <div>Median key (index t - 1) pushed to parent upon node split.</div>
        </div>
      );
    }
    return (
      <div className="text-[11px] font-mono bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-700 space-y-1">
        <div className="font-semibold text-indigo-700">Binary Search Property:</div>
        <div>key(left) &lt; key(root) &lt; key(right)</div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-border rounded-xl p-4 shadow-sm flex flex-col space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Step Deduction & Mathematical Reasoning
          </span>
        </div>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badge.bg}`}>
          {badge.label}
        </span>
      </div>

      {/* Narrative Explanation */}
      <div className="bg-amber-50/60 border border-amber-200/80 rounded-lg p-3 text-slate-800 text-xs leading-relaxed">
        <div className="font-semibold text-amber-900 mb-1 flex items-center space-x-1">
          <Activity className="w-3.5 h-3.5 text-amber-600" />
          <span>Step {step} Deduction:</span>
        </div>
        <p className="font-normal text-slate-700">{explanation}</p>
      </div>

      {/* Comparison & Active Nodes */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="border border-border rounded-lg p-2 bg-slate-50/50">
          <span className="text-[11px] text-slate-500 font-medium block">Active Target Node(s):</span>
          <span className="font-mono font-semibold text-indigo-700 text-sm">
            {activeNodes.length > 0 ? activeNodes.join(', ') : 'None'}
          </span>
        </div>
        <div className="border border-border rounded-lg p-2 bg-slate-50/50">
          <span className="text-[11px] text-slate-500 font-medium block">Keys Compared:</span>
          <span className="font-mono font-semibold text-amber-700 text-sm">
            {comparedKeys.length > 0 ? comparedKeys.join(' vs ') : 'None'}
          </span>
        </div>
      </div>

      {/* Mathematical Reference Formula */}
      <div className="pt-1">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 mb-1.5">
          <Calculator className="w-3.5 h-3.5 text-indigo-600" />
          <span>Underlying Algorithmic Invariant:</span>
        </div>
        {renderFormula()}
      </div>
    </div>
  );
}
