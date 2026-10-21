import React, { useEffect, useRef } from 'react';
import { Code, BookOpen, Copy, Check } from 'lucide-react';

export default function CodeViewer({ code, filename, activeLine, dataStructure }) {
  const lineRefs = useRef({});
  const containerRef = useRef(null);
  const [copied, setCopied] = React.useState(false);

  // Auto-scroll active line into view smoothly
  useEffect(() => {
    if (activeLine && lineRefs.current[activeLine]) {
      lineRefs.current[activeLine].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeLine]);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = (code || '').split('\n');

  return (
    <div className="bg-white border border-border rounded-xl shadow-sm flex flex-col h-[520px] overflow-hidden">
      {/* Header bar */}
      <div className="bg-slate-50 border-b border-border px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-semibold text-slate-800 tracking-wide">
            C++ Textbook Implementation
          </span>
          <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[11px] font-mono font-medium px-2 py-0.5 rounded-full">
            {filename || `${dataStructure}.hpp`}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 px-2 py-1 text-xs text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
          title="Copy Code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Code Editor Body */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto font-mono text-xs leading-relaxed bg-[#ffffff] select-text py-2"
      >
        {lines.map((lineContent, index) => {
          const lineNumber = index + 1;
          const isCurrent = lineNumber === activeLine;

          return (
            <div
              key={lineNumber}
              ref={(el) => (lineRefs.current[lineNumber] = el)}
              className={`flex items-start px-2 py-0.5 transition-colors duration-150 ${
                isCurrent
                  ? 'bg-amber-100/80 border-l-4 border-amber-500 font-semibold text-amber-950 shadow-sm'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span
                className={`w-10 text-right pr-4 select-none font-mono text-[11px] ${
                  isCurrent ? 'text-amber-800 font-bold' : 'text-slate-400'
                }`}
              >
                {lineNumber}
              </span>
              <pre className="flex-1 overflow-x-auto whitespace-pre font-mono text-[12px]">
                {lineContent}
              </pre>
            </div>
          );
        })}
      </div>

      {/* Footer bar with current line pointer */}
      <div className="bg-slate-50 border-t border-border px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <div>
          Active Line: <strong className="text-amber-700">{activeLine || '—'}</strong>
        </div>
        <div>Varsha Patil: Data Structures Using C++</div>
      </div>
    </div>
  );
}
