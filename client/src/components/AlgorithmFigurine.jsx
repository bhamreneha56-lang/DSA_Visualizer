import React from 'react';
import { ArrowRight, GitBranch, Sparkles, Layers, Box, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function AlgorithmFigurine({ algorithmInfo, currentTrace }) {
  if (!algorithmInfo) return null;

  const { title, subtitle, complexities, invariant, figurineType, figurineDesc } = algorithmInfo;

  return (
    <div className="flex flex-col space-y-4 p-4 overflow-y-auto max-h-[460px]">
      {/* Top Title & Complexity Summary */}
      <div className="bg-slate-50 border border-border rounded-xl p-3.5 space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>{title}</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>
          </div>
        </div>

        {/* Complexity Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[10px]">
          <div className="bg-white border border-slate-200 rounded-lg p-2 text-center">
            <div className="text-slate-400 font-medium">Best Time</div>
            <div className="font-bold text-emerald-600">{complexities.timeBest}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-2 text-center">
            <div className="text-slate-400 font-medium">Avg Time</div>
            <div className="font-bold text-indigo-600">{complexities.timeAvg}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-2 text-center">
            <div className="text-slate-400 font-medium">Worst Time</div>
            <div className="font-bold text-amber-600">{complexities.timeWorst}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-2 text-center">
            <div className="text-slate-400 font-medium">Aux Space</div>
            <div className="font-bold text-purple-600">{complexities.space}</div>
          </div>
        </div>
      </div>

      {/* SVG Figurine Visualizer Card */}
      <div className="bg-white border border-border rounded-xl p-3 shadow-xs flex flex-col space-y-2">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
            <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
            <span>Algorithmic Concept Figurine</span>
          </span>
          <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full font-mono">
            {figurineType}
          </span>
        </div>

        {/* Dynamic SVG Schematic Based on Figurine Type */}
        <div className="flex justify-center items-center py-2 bg-slate-50/70 border border-dashed border-slate-200 rounded-lg">
          {figurineType === 'bst-insert' && (
            <svg viewBox="0 0 340 160" className="w-full max-w-[340px] h-36">
              {/* Root */}
              <circle cx="170" cy="30" r="18" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
              <text x="170" y="34" textAnchor="middle" fontSize="11" fontWeight="700" fill="#3730a3">Root</text>
              
              {/* Branch Left */}
              <line x1="156" y1="42" x2="100" y2="85" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
              <text x="110" y="55" fontSize="10" fill="#4f46e5" fontWeight="600">val &lt; root</text>
              <circle cx="90" cy="95" r="16" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="90" y="99" textAnchor="middle" fontSize="10" fill="#475569">Left</text>

              {/* Branch Right */}
              <line x1="184" y1="42" x2="240" y2="85" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
              <text x="220" y="55" fontSize="10" fill="#4f46e5" fontWeight="600">val &gt; root</text>
              <circle cx="250" cy="95" r="16" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="250" y="99" textAnchor="middle" fontSize="10" fill="#475569">Right</text>

              {/* New Node allocation target */}
              <line x1="90" y1="112" x2="90" y2="135" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow)" />
              <rect x="55" y="132" width="70" height="22" rx="4" fill="#d1fae5" stroke="#10b981" strokeWidth="1.5" />
              <text x="90" y="147" textAnchor="middle" fontSize="10" fontWeight="700" fill="#065f46">+ New Node</text>
            </svg>
          )}

          {figurineType === 'bst-delete' && (
            <svg viewBox="0 0 340 160" className="w-full max-w-[340px] h-36">
              {/* 3 Cases representation */}
              <g transform="translate(10, 20)">
                <rect x="0" y="0" width="95" height="115" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                <text x="47" y="16" textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b">Case 1: Leaf</text>
                <circle cx="47" cy="45" r="14" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5" />
                <text x="47" y="49" textAnchor="middle" fontSize="10" fontWeight="700" fill="#991b1b">X</text>
                <text x="47" y="85" textAnchor="middle" fontSize="9" fill="#64748b">No children</text>
                <text x="47" y="100" textAnchor="middle" fontSize="9" fontWeight="600" fill="#dc2626">Direct Free</text>
              </g>

              <g transform="translate(120, 20)">
                <rect x="0" y="0" width="95" height="115" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                <text x="47" y="16" textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b">Case 2: 1 Child</text>
                <circle cx="47" cy="40" r="12" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5" />
                <text x="47" y="44" textAnchor="middle" fontSize="9" fontWeight="700" fill="#991b1b">X</text>
                <line x1="47" y1="52" x2="47" y2="70" stroke="#94a3b8" strokeWidth="1.5" />
                <circle cx="47" cy="82" r="12" fill="#d1fae5" stroke="#10b981" strokeWidth="1.5" />
                <text x="47" y="86" textAnchor="middle" fontSize="9" fontWeight="700" fill="#065f46">C</text>
                <text x="47" y="105" textAnchor="middle" fontSize="9" fontWeight="600" fill="#059669">Bypass Parent</text>
              </g>

              <g transform="translate(230, 20)">
                <rect x="0" y="0" width="100" height="115" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                <text x="50" y="16" textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b">Case 3: 2 Child</text>
                <circle cx="50" cy="40" r="12" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="50" y="44" textAnchor="middle" fontSize="9" fontWeight="700" fill="#92400e">X</text>
                <path d="M 50 54 Q 65 65 65 75" fill="none" stroke="#6366f1" strokeWidth="1.5" />
                <circle cx="65" cy="85" r="11" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="1.5" />
                <text x="65" y="89" textAnchor="middle" fontSize="8" fontWeight="700" fill="#6b21a8">Min</text>
                <text x="50" y="105" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#4338ca">Inorder Succ</text>
              </g>
            </svg>
          )}

          {figurineType.startsWith('traversal-') && (
            <svg viewBox="0 0 340 150" className="w-full max-w-[340px] h-36">
              {/* Root */}
              <circle cx="170" cy="30" r="18" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
              <text x="170" y="34" textAnchor="middle" fontSize="11" fontWeight="700" fill="#3730a3">Data</text>

              {/* Left Subtree */}
              <line x1="155" y1="42" x2="105" y2="80" stroke="#94a3b8" strokeWidth="2" />
              <rect x="65" y="80" width="70" height="34" rx="6" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="100" y="101" textAnchor="middle" fontSize="10" fontWeight="600" fill="#475569">Left Subtree</text>

              {/* Right Subtree */}
              <line x1="185" y1="42" x2="235" y2="80" stroke="#94a3b8" strokeWidth="2" />
              <rect x="205" y="80" width="70" height="34" rx="6" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="240" y="101" textAnchor="middle" fontSize="10" fontWeight="600" fill="#475569">Right Subtree</text>

              {/* Order Indicator banner */}
              <g transform="translate(50, 125)">
                <rect x="0" y="0" width="240" height="22" rx="4" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                <text x="120" y="15" textAnchor="middle" fontSize="11" fontWeight="700" fill="#4f46e5">
                  {figurineType === 'traversal-ldr' ? 'Inorder: (1) Left ➔ (2) Data ➔ (3) Right' :
                   figurineType === 'traversal-dlr' ? 'Preorder: (1) Data ➔ (2) Left ➔ (3) Right' :
                   'Postorder: (1) Left ➔ (2) Right ➔ (3) Data'}
                </text>
              </g>
            </svg>
          )}

          {figurineType === 'avl-rotations' && (
            <svg viewBox="0 0 340 150" className="w-full max-w-[340px] h-36">
              {/* LL Unbalance and Rotated balance */}
              <g transform="translate(20, 15)">
                <text x="50" y="12" textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b">LL Imbalance</text>
                <circle cx="50" cy="35" r="11" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5" />
                <text x="50" y="39" textAnchor="middle" fontSize="8" fontWeight="700" fill="#991b1b">+2</text>
                <line x1="42" y1="44" x2="28" y2="62" stroke="#ef4444" strokeWidth="1.5" />
                <circle cx="25" cy="72" r="11" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="25" y="76" textAnchor="middle" fontSize="8" fontWeight="700" fill="#92400e">+1</text>
                <line x1="20" y1="81" x2="10" y2="99" stroke="#ef4444" strokeWidth="1.5" />
                <circle cx="10" cy="107" r="9" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
              </g>

              {/* Rotation Arrow */}
              <g transform="translate(140, 55)">
                <path d="M 0 10 Q 30 -5 50 10" fill="none" stroke="#6366f1" strokeWidth="2.5" markerEnd="url(#arrow)" />
                <text x="25" y="30" textAnchor="middle" fontSize="9" fontWeight="700" fill="#4f46e5">Right Rotate</text>
              </g>

              {/* Balanced result */}
              <g transform="translate(240, 20)">
                <text x="45" y="10" textAnchor="middle" fontSize="10" fontWeight="700" fill="#059669">Balanced Result</text>
                <circle cx="45" cy="35" r="12" fill="#d1fae5" stroke="#10b981" strokeWidth="1.5" />
                <text x="45" y="39" textAnchor="middle" fontSize="8" fontWeight="700" fill="#065f46">BF: 0</text>
                <line x1="36" y1="44" x2="20" y2="65" stroke="#10b981" strokeWidth="1.5" />
                <circle cx="18" cy="74" r="10" fill="#ecfdf5" stroke="#10b981" strokeWidth="1" />
                <line x1="54" y1="44" x2="70" y2="65" stroke="#10b981" strokeWidth="1.5" />
                <circle cx="72" cy="74" r="10" fill="#ecfdf5" stroke="#10b981" strokeWidth="1" />
              </g>
            </svg>
          )}

          {figurineType.includes('heap') && (
            <svg viewBox="0 0 340 150" className="w-full max-w-[340px] h-36">
              {/* Array Mapping to Binary Tree */}
              <g transform="translate(20, 10)">
                <text x="150" y="12" textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569">
                  Array Index to Complete Tree Formula
                </text>
                {/* Array boxes */}
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <g key={idx} transform={`translate(${idx * 48 + 10}, 25)`}>
                    <rect width="44" height="24" rx="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
                    <text x="22" y="16" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e293b">i={idx}</text>
                  </g>
                ))}
              </g>

              {/* Tree pointers */}
              <g transform="translate(40, 70)">
                <rect x="0" y="0" width="260" height="38" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
                <text x="130" y="16" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#334155">
                  Left Child: 2i + 1  |  Right Child: 2i + 2
                </text>
                <text x="130" y="30" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#6366f1">
                  Parent Node: ⌊(i - 1) / 2⌋
                </text>
              </g>
            </svg>
          )}

          {figurineType === 'dijkstra-fig' && (
            <svg viewBox="0 0 340 150" className="w-full max-w-[340px] h-36">
              {/* Vertex u */}
              <circle cx="60" cy="70" r="18" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
              <text x="60" y="74" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1e40af">u</text>
              <text x="60" y="105" textAnchor="middle" fontSize="9" fontWeight="600" fill="#2563eb">dist[u]</text>

              {/* Edge to v */}
              <line x1="78" y1="70" x2="220" y2="70" stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#arrow)" />
              <rect x="135" y="55" width="36" height="18" rx="4" fill="#ffffff" stroke="#f59e0b" strokeWidth="1" />
              <text x="153" y="68" textAnchor="middle" fontSize="10" fontWeight="700" fill="#b45309">w(u,v)</text>

              {/* Vertex v */}
              <circle cx="240" cy="70" r="18" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
              <text x="240" y="74" textAnchor="middle" fontSize="11" fontWeight="700" fill="#92400e">v</text>
              <text x="240" y="105" textAnchor="middle" fontSize="9" fontWeight="600" fill="#b45309">dist[v]</text>

              {/* Formula banner */}
              <g transform="translate(30, 120)">
                <rect x="0" y="0" width="280" height="22" rx="4" fill="#f0fdf4" stroke="#86efac" strokeWidth="1" />
                <text x="140" y="15" textAnchor="middle" fontSize="10" fontWeight="700" fill="#166534">
                  Relaxation: if (dist[u] + w &lt; dist[v]) dist[v] = dist[u] + w
                </text>
              </g>
            </svg>
          )}

          {figurineType === 'btree-fig' && (
            <svg viewBox="0 0 340 150" className="w-full max-w-[340px] h-36">
              {/* Full node splitting */}
              <g transform="translate(20, 20)">
                <text x="50" y="10" textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569">Full Node (3 Keys)</text>
                <rect x="0" y="18" width="105" height="30" rx="4" fill="#ffffff" stroke="#ef4444" strokeWidth="1.5" />
                <line x1="35" y1="18" x2="35" y2="48" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="70" y1="18" x2="70" y2="48" stroke="#cbd5e1" strokeWidth="1" />
                <text x="17" y="37" textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">10</text>
                <text x="52" y="37" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ef4444">20*</text>
                <text x="87" y="37" textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">30</text>
                <text x="52" y="62" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#dc2626">*Median key moves up</text>
              </g>

              {/* Split Arrow */}
              <g transform="translate(140, 30)">
                <path d="M 0 10 L 30 10" stroke="#6366f1" strokeWidth="2" markerEnd="url(#arrow)" />
                <text x="15" y="25" textAnchor="middle" fontSize="9" fontWeight="700" fill="#4f46e5">Split</text>
              </g>

              {/* Result parent & children */}
              <g transform="translate(195, 10)">
                <text x="60" y="10" textAnchor="middle" fontSize="10" fontWeight="700" fill="#059669">Promoted Parent</text>
                <rect x="40" y="18" width="40" height="24" rx="4" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="1.5" />
                <text x="60" y="34" textAnchor="middle" fontSize="11" fontWeight="700" fill="#5b21b6">20</text>

                <line x1="45" y1="42" x2="25" y2="70" stroke="#94a3b8" strokeWidth="1" />
                <rect x="5" y="70" width="35" height="24" rx="4" fill="#ffffff" stroke="#10b981" strokeWidth="1" />
                <text x="22" y="86" textAnchor="middle" fontSize="10" fontWeight="700" fill="#047857">10</text>

                <line x1="75" y1="42" x2="95" y2="70" stroke="#94a3b8" strokeWidth="1" />
                <rect x="80" y="70" width="35" height="24" rx="4" fill="#ffffff" stroke="#10b981" strokeWidth="1" />
                <text x="97" y="86" textAnchor="middle" fontSize="10" fontWeight="700" fill="#047857">30</text>
              </g>
            </svg>
          )}

          {!['bst-insert', 'bst-delete', 'avl-rotations', 'dijkstra-fig', 'btree-fig'].includes(figurineType) && !figurineType.includes('heap') && !figurineType.startsWith('traversal-') && (
            <svg viewBox="0 0 340 130" className="w-full max-w-[340px] h-32">
              <circle cx="70" cy="50" r="18" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
              <text x="70" y="54" textAnchor="middle" fontSize="11" fontWeight="700" fill="#4338ca">Start</text>

              <line x1="88" y1="50" x2="160" y2="50" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />

              <circle cx="180" cy="50" r="18" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
              <text x="180" y="54" textAnchor="middle" fontSize="11" fontWeight="700" fill="#b45309">Visit</text>

              <line x1="198" y1="50" x2="260" y2="50" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />

              <circle cx="280" cy="50" r="18" fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
              <text x="280" y="54" textAnchor="middle" fontSize="11" fontWeight="700" fill="#047857">Next</text>

              <text x="170" y="105" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">
                Graph Traversal & MST Frontier Growth
              </text>
            </svg>
          )}
        </div>

        {/* Narrative explanation */}
        <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          {figurineDesc}
        </p>

        {/* Mathematical Invariant */}
        <div className="flex items-start space-x-2 bg-indigo-50/70 border border-indigo-100 rounded-lg p-2.5 text-[11px] text-indigo-900">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Textbook Invariant: </span>
            <span className="font-mono">{invariant}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
