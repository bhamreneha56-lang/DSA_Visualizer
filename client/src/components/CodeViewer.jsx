import React, { useState, useEffect, useRef } from 'react';
import {
  Code2,
  FileText,
  Workflow,
  Sparkles,
  Copy,
  Check,
  BookOpen,
  Eye,
  Layers
} from 'lucide-react';
import { algorithmKnowledge } from '../utils/algorithmKnowledge';
import AlgorithmFigurine from './AlgorithmFigurine';
import AlgorithmFlowchart from './AlgorithmFlowchart';

// Lightweight C++ syntax highlighter helper
function highlightCpp(line) {
  // If line is a comment
  const trimmed = line.trim();
  if (trimmed.startsWith('//')) {
    return <span className="text-slate-400 italic">{line}</span>;
  }

  // Tokens regex for keywords, types, numbers, strings
  const regex = /(\b(?:struct|class|int|void|bool|return|if|else|while|for|nullptr|new|delete|const|public|private|swap|max|min)\b)|(\b(?:vector|queue|string|BSTNode|AVLNode|BTreeNode|Edge|Tracer)\b)|(\/\/.*$)|(".*?"|'.*?')|(\b\d+\b)/g;

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(line.substring(lastIndex, match.index));
    }
    const [full, keyword, type, comment, str, num] = match;

    if (keyword) {
      parts.push(<span key={match.index} className="text-indigo-600 font-semibold">{keyword}</span>);
    } else if (type) {
      parts.push(<span key={match.index} className="text-sky-700 font-medium">{type}</span>);
    } else if (comment) {
      parts.push(<span key={match.index} className="text-slate-400 italic">{comment}</span>);
    } else if (str) {
      parts.push(<span key={match.index} className="text-emerald-700">{str}</span>);
    } else if (num) {
      parts.push(<span key={match.index} className="text-amber-700">{num}</span>);
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    parts.push(line.substring(lastIndex));
  }

  return parts.length > 0 ? parts : line;
}

export default function CodeViewer({
  code,
  filename,
  activeLine,
  dataStructure = 'bst',
  operation = 'insert',
  currentTrace
}) {
  const [activeTab, setActiveTab] = useState('code'); // 'code', 'pseudocode', 'flowchart', 'figurine'
  const [viewEngineSource, setViewEngineSource] = useState(false);
  const [copied, setCopied] = useState(false);
  const lineRefs = useRef({});
  const containerRef = useRef(null);

  // Retrieve algorithm knowledge for selected data structure & operation
  const dsKnowledge = algorithmKnowledge[dataStructure] || {};
  const currentAlgorithm = dsKnowledge[operation] || Object.values(dsKnowledge)[0] || null;

  // Choose which code to show: Clean Textbook code vs Full Tracer Source
  const displayedCode = (viewEngineSource || !currentAlgorithm)
    ? (code || '')
    : (currentAlgorithm.cleanCode || code || '');

  const lines = displayedCode.split('\n');

  // Auto-scroll active line in full source mode
  useEffect(() => {
    if (viewEngineSource && activeLine && lineRefs.current[activeLine]) {
      lineRefs.current[activeLine].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeLine, viewEngineSource]);

  const handleCopy = () => {
    let textToCopy = displayedCode;
    if (activeTab === 'pseudocode' && currentAlgorithm) {
      textToCopy = currentAlgorithm.pseudocode;
    }
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-border rounded-xl shadow-sm flex flex-col h-[520px] overflow-hidden">
      {/* Top Header & Navigation Tabs */}
      <div className="bg-slate-50 border-b border-border px-3 py-2 flex flex-wrap items-center justify-between gap-2">
        {/* Tab Buttons */}
        <div className="flex items-center space-x-1 bg-slate-200/60 p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'code'
                ? 'bg-white shadow-xs text-indigo-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>

          <button
            onClick={() => setActiveTab('pseudocode')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'pseudocode'
                ? 'bg-white shadow-xs text-indigo-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Pseudocode</span>
          </button>

          <button
            onClick={() => setActiveTab('flowchart')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'flowchart'
                ? 'bg-white shadow-xs text-indigo-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Flowchart</span>
          </button>

          <button
            onClick={() => setActiveTab('figurine')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'figurine'
                ? 'bg-white shadow-xs text-indigo-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Figurine & Concept</span>
          </button>
        </div>

        {/* Right utility buttons: Toggle Raw Source & Copy */}
        <div className="flex items-center space-x-2">
          {activeTab === 'code' && (
            <button
              onClick={() => setViewEngineSource((prev) => !prev)}
              className="text-[11px] text-slate-500 hover:text-slate-800 underline decoration-slate-300 font-mono transition-colors"
              title="Toggle between Clean Textbook Code and Tracer Engine Source"
            >
              {viewEngineSource ? 'View Textbook Code' : 'View Full Engine'}
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2 py-1 text-xs text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
            title="Copy Content"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content View */}
      <div className="flex-1 overflow-hidden relative">
        {/* TAB 1: C++ CODE */}
        {activeTab === 'code' && (
          <div
            ref={containerRef}
            className="h-full overflow-y-auto font-mono text-xs leading-relaxed bg-[#ffffff] select-text py-2"
          >
            {lines.map((lineContent, index) => {
              const lineNumber = index + 1;
              const isCurrent = viewEngineSource && lineNumber === activeLine;

              return (
                <div
                  key={lineNumber}
                  ref={(el) => (lineRefs.current[lineNumber] = el)}
                  className={`flex items-start px-2 py-0.5 transition-colors duration-150 ${
                    isCurrent
                      ? 'bg-amber-100/80 border-l-4 border-amber-500 font-semibold text-amber-950 shadow-sm'
                      : 'hover:bg-slate-50/70 text-slate-700'
                  }`}
                >
                  <span
                    className={`w-9 text-right pr-3 select-none font-mono text-[11px] ${
                      isCurrent ? 'text-amber-800 font-bold' : 'text-slate-300'
                    }`}
                  >
                    {lineNumber}
                  </span>
                  <pre className="flex-1 overflow-x-auto whitespace-pre font-mono text-[11.5px] leading-5">
                    {highlightCpp(lineContent)}
                  </pre>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: PSEUDOCODE */}
        {activeTab === 'pseudocode' && currentAlgorithm && (
          <div className="h-full overflow-y-auto p-4 bg-slate-50/60 font-mono text-xs leading-relaxed">
            <div className="bg-white border border-border rounded-xl p-4 shadow-2xs">
              <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5 pb-2 border-b border-slate-100">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Textbook Academic Pseudocode</span>
              </div>
              <pre className="whitespace-pre-wrap font-mono text-[12px] text-slate-800 leading-6 bg-slate-50/80 p-3 rounded-lg border border-slate-200">
                {currentAlgorithm.pseudocode}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 3: FLOWCHART */}
        {activeTab === 'flowchart' && (
          <AlgorithmFlowchart algorithmInfo={currentAlgorithm} />
        )}

        {/* TAB 4: FIGURINE & CONCEPT */}
        {activeTab === 'figurine' && (
          <AlgorithmFigurine
            algorithmInfo={currentAlgorithm}
            currentTrace={currentTrace}
          />
        )}
      </div>

      {/* Footer bar with current line pointer & citation */}
      <div className="bg-slate-50 border-t border-border px-3.5 py-1.5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span className="font-semibold text-slate-700">
            {currentAlgorithm?.title || `${dataStructure.toUpperCase()}`}
          </span>
        </div>
        <div className="text-slate-400">Standard Data Structures & Algorithms (C++)</div>
      </div>
    </div>
  );
}
