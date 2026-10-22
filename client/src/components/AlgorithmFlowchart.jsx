import React from 'react';
import { Workflow, HelpCircle } from 'lucide-react';

export default function AlgorithmFlowchart({ algorithmInfo }) {
  if (!algorithmInfo || !algorithmInfo.flowchart) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        No flowchart available for this operation.
      </div>
    );
  }

  const nodes = algorithmInfo.flowchart;
  const nodeWidth = 260;
  const nodeHeight = 36;
  const verticalGap = 24;

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 bg-slate-50/50">
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-border">
        <div className="flex items-center space-x-2">
          <Workflow className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Control Flowchart
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
          {algorithmInfo.title}
        </span>
      </div>

      {/* Flowchart Vertical Tree */}
      <div className="flex flex-col items-center space-y-3 py-2">
        {nodes.map((node, idx) => {
          const isTerminal = node.type === 'terminal';
          const isDecision = node.type === 'decision';

          let shapeClasses = 'bg-white border-slate-300 text-slate-800 shadow-xs';
          let badgeLabel = 'Process';

          if (isTerminal) {
            shapeClasses = 'bg-indigo-600 text-white font-bold rounded-full shadow-sm border-indigo-700';
            badgeLabel = 'Terminal';
          } else if (isDecision) {
            shapeClasses = 'bg-amber-50 border-amber-400 text-amber-950 font-semibold shadow-xs';
            badgeLabel = 'Decision';
          }

          return (
            <React.Fragment key={node.id || idx}>
              {/* Connector Arrow */}
              {idx > 0 && (
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-4 bg-slate-300"></div>
                  <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-400"></div>
                </div>
              )}

              {/* Node Box */}
              <div
                className={`relative px-4 py-2 text-center text-xs border transition-all hover:scale-[1.01] ${
                  isTerminal
                    ? 'rounded-full w-56'
                    : isDecision
                    ? 'rounded-lg w-72 border-2'
                    : 'rounded-lg w-72 border'
                } ${shapeClasses}`}
              >
                {/* Node type badge */}
                <span
                  className={`absolute -top-2 left-3 px-1.5 py-0.2 text-[9px] font-mono uppercase tracking-wider rounded ${
                    isTerminal
                      ? 'bg-indigo-800 text-indigo-100'
                      : isDecision
                      ? 'bg-amber-200 text-amber-800'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {badgeLabel}
                </span>

                <div className="font-mono text-[11px] leading-tight mt-0.5">
                  {node.text}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
