import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Visualizer2D from './components/Visualizer2D';
import Visualizer3D from './components/Visualizer3D';
import Controls from './components/Controls';
import CodeViewer from './components/CodeViewer';
import DeductionPanel from './components/DeductionPanel';

export default function App() {
  const [dataStructure, setDataStructure] = useState('avl');
  const [operation, setOperation] = useState('insert');
  const [inputData, setInputData] = useState('25,20,30,10,22,5');
  const [nodeShape, setNodeShape] = useState('circle');
  const [viewMode, setViewMode] = useState('2d');

  // Graph state (separated nodes, edges, weights, directed)
  const [graphDirected, setGraphDirected] = useState(false);
  const [graphNodes, setGraphNodes] = useState('A, B, C, D, E, F');
  const [graphEdges, setGraphEdges] = useState('A-B:4, A-C:2, B-C:1, B-D:5, C-D:8, C-E:10, D-E:2, D-F:6, E-F:3');
  const [graphStartNode, setGraphStartNode] = useState('A');

  // BST Delete Target state
  const [deleteTarget, setDeleteTarget] = useState('20');

  const [traces, setTraces] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [cppCode, setCppCode] = useState('');
  const [filename, setFilename] = useState('avl.hpp');

  const timerRef = useRef(null);

  const buildGraphPayload = (
    directed = graphDirected,
    nodes = graphNodes,
    edges = graphEdges,
    start = graphStartNode
  ) => {
    return `${directed ? '1' : '0'}|${nodes}|${edges}|${start}`;
  };

  // Fetch C++ textbook code when data structure changes
  const fetchCppCode = async (ds) => {
    try {
      const res = await fetch(`/api/code/${ds}`);
      if (res.ok) {
        const data = await res.json();
        setCppCode(data.code);
        setFilename(data.filename);
      }
    } catch (err) {
      console.error('Error fetching C++ code:', err);
    }
  };

  // Run C++ Engine via Backend Bridge
  const runEngine = async (ds = dataStructure, op = operation, data = null) => {
    setIsLoading(true);
    setIsPlaying(false);

    let payload = data;
    if (payload === null || payload === undefined) {
      if (ds === 'graph') {
        payload = buildGraphPayload();
      } else if (ds === 'bst' && op === 'delete') {
        payload = `${inputData};${deleteTarget}`;
      } else {
        payload = inputData;
      }
    }

    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ds, op, data: payload })
      });
      if (!res.ok) throw new Error('C++ engine failed');
      const json = await res.json();
      setTraces(json.traces || []);
      setCurrentStepIndex(0);
    } catch (err) {
      console.error('Error running C++ engine:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCppCode('avl');
    runEngine('avl', 'insert', '25,20,30,10,22,5');
  }, []);

  // Handle data structure switch
  const handleSelectDS = (newDS) => {
    setDataStructure(newDS);
    let defaultOp = 'insert';
    let defaultData = '25,20,30,10,22,5';

    if (newDS === 'heapsort') {
      defaultOp = 'max';
      defaultData = '12,11,13,5,6,7';
    } else if (newDS === 'graph') {
      defaultOp = 'dijkstra';
      defaultData = buildGraphPayload();
    } else if (newDS === 'btree') {
      defaultOp = 'insert';
      defaultData = '10,20,5,6,12,30,7,17';
    }

    setOperation(defaultOp);
    setInputData(defaultData);
    fetchCppCode(newDS);
    runEngine(newDS, defaultOp, defaultData);
  };

  // Playback loop
  useEffect(() => {
    if (isPlaying) {
      const interval = 1300 / speed;
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev + 1 < traces.length) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, interval);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, traces.length]);

  // Stepper handlers
  const handlePlayPause = () => setIsPlaying((prev) => !prev);
  const handleStepNext = () => {
    setIsPlaying(false);
    if (currentStepIndex + 1 < traces.length) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };
  const handleStepPrev = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };
  const handleJumpToEnd = () => {
    setIsPlaying(false);
    if (traces.length > 0) {
      setCurrentStepIndex(traces.length - 1);
    }
  };
  const handleSeek = (stepNumber) => {
    setIsPlaying(false);
    setCurrentStepIndex(Math.max(0, Math.min(traces.length - 1, stepNumber - 1)));
  };

  const handleApplyPreset = (presetKey) => {
    if (presetKey === 'graph-sample-undirected') {
      setGraphDirected(false);
      setGraphNodes('A, B, C, D, E, F');
      setGraphEdges('A-B:4, A-C:2, B-C:1, B-D:5, C-D:8, C-E:10, D-E:2, D-F:6, E-F:3');
      setGraphStartNode('A');
      runEngine('graph', operation, '0|A, B, C, D, E, F|A-B:4, A-C:2, B-C:1, B-D:5, C-D:8, C-E:10, D-E:2, D-F:6, E-F:3|A');
    } else if (presetKey === 'graph-sample-directed') {
      setGraphDirected(true);
      setGraphNodes('A, B, C, D');
      setGraphEdges('A->B:4, A->C:2, B->D:5, C->D:1');
      setGraphStartNode('A');
      runEngine('graph', operation, '1|A, B, C, D|A->B:4, A->C:2, B->D:5, C->D:1|A');
    } else if (presetKey === 'graph-triangle') {
      setGraphDirected(false);
      setGraphNodes('A, B, C');
      setGraphEdges('A-B:3, B-C:4, A-C:5');
      setGraphStartNode('A');
      runEngine('graph', operation, '0|A, B, C|A-B:3, B-C:4, A-C:5|A');
    } else {
      setInputData(presetKey);
      runEngine(dataStructure, operation, presetKey);
    }
  };

  const currentTrace = traces[currentStepIndex] || null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Header Bar */}
      <Header
        dataStructure={dataStructure}
        onSelectDS={handleSelectDS}
        operation={operation}
        onSelectOp={(op) => {
          setOperation(op);
          runEngine(dataStructure, op);
        }}
        inputData={inputData}
        onChangeInput={setInputData}
        onRunEngine={() => runEngine()}
        isLoading={isLoading}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        nodeShape={nodeShape}
        onChangeNodeShape={setNodeShape}
        onApplyPreset={handleApplyPreset}
        // Graph props
        graphDirected={graphDirected}
        onChangeGraphDirected={(directed) => {
          setGraphDirected(directed);
          runEngine('graph', operation, buildGraphPayload(directed));
        }}
        graphNodes={graphNodes}
        onChangeGraphNodes={setGraphNodes}
        graphEdges={graphEdges}
        onChangeGraphEdges={setGraphEdges}
        graphStartNode={graphStartNode}
        onChangeGraphStartNode={setGraphStartNode}
        // BST Delete target prop
        deleteTarget={deleteTarget}
        onChangeDeleteTarget={setDeleteTarget}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 flex flex-col space-y-4">
        {/* Top Split: Canvas Visualizer (Left) vs Synchronized C++ Code Viewer (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Visualizer Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            {viewMode === '2d' ? (
              <Visualizer2D
                currentTrace={currentTrace}
                nodeShape={nodeShape}
                dataStructure={dataStructure}
              />
            ) : (
              <Visualizer3D
                currentTrace={currentTrace}
                nodeShape={nodeShape}
              />
            )}

            {/* Stepper & Playback Controls Bar */}
            <Controls
              currentStep={currentStepIndex + 1}
              totalSteps={traces.length}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onStepNext={handleStepNext}
              onStepPrev={handleStepPrev}
              onReset={handleReset}
              onJumpToEnd={handleJumpToEnd}
              onSeek={handleSeek}
              speed={speed}
              onSpeedChange={setSpeed}
            />
          </div>

          {/* Code Viewer & Deduction Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-3">
            {/* Synchronized C++ Code Inspector */}
            <CodeViewer
              code={cppCode}
              filename={filename}
              activeLine={currentTrace?.codeLine}
              dataStructure={dataStructure}
            />

            {/* Step-by-Step Mathematical Solver Panel */}
            <DeductionPanel
              currentTrace={currentTrace}
              dataStructure={dataStructure}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-3 text-center text-xs text-slate-500">
        DSA Step-by-Step Visualizer • Developed with React & Native C++ Core Engine
      </footer>
    </div>
  );
}
