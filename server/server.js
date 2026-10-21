const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const ENGINE_PATH = path.resolve(__dirname, '../cpp_engine/dsa_engine.exe');
const INCLUDE_DIR = path.resolve(__dirname, '../cpp_engine/include');

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    engineAvailable: fs.existsSync(ENGINE_PATH),
    timestamp: new Date().toISOString()
  });
});

// Run C++ engine endpoint
app.post('/api/run', (req, res) => {
  const { ds, op, data } = req.body;

  if (!ds || !op) {
    return res.status(400).json({ error: 'Missing ds or op parameter' });
  }

  const args = [
    '--ds', String(ds),
    '--op', String(op),
    '--data', String(data || '')
  ];

  console.log(`[C++ Engine Call] ${ENGINE_PATH} ${args.join(' ')}`);

  const proc = spawn(ENGINE_PATH, args);

  let stdoutData = '';
  let stderrData = '';

  proc.stdout.on('data', (chunk) => {
    stdoutData += chunk.toString();
  });

  proc.stderr.on('data', (chunk) => {
    stderrData += chunk.toString();
  });

  proc.on('close', (code) => {
    if (code !== 0) {
      console.error(`[C++ Engine Error] Code ${code}: ${stderrData}`);
      return res.status(500).json({
        error: 'C++ Engine execution failed',
        code,
        stderr: stderrData
      });
    }

    try {
      const parsed = JSON.parse(stdoutData.trim());
      res.json(parsed);
    } catch (err) {
      console.error('[JSON Parse Error]', err, stdoutData);
      res.status(500).json({
        error: 'Failed to parse C++ engine JSON output',
        raw: stdoutData
      });
    }
  });

  proc.on('error', (err) => {
    console.error('[Process Error]', err);
    res.status(500).json({ error: err.message });
  });
});

// Get textbook C++ source code endpoint
app.get('/api/code/:ds', (req, res) => {
  const ds = req.params.ds.toLowerCase();
  const fileMap = {
    bst: 'bst.hpp',
    avl: 'avl.hpp',
    heap: 'heap.hpp',
    heapsort: 'heap.hpp',
    graph: 'graph.hpp',
    btree: 'btree.hpp',
    trie: 'trie.hpp'
  };

  const filename = fileMap[ds];
  if (!filename) {
    return res.status(404).json({ error: 'Data structure code not found' });
  }

  const filepath = path.join(INCLUDE_DIR, filename);
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: 'File does not exist' });
  }

  const content = fs.readFileSync(filepath, 'utf8');
  res.json({ ds, filename, code: content });
});

app.listen(PORT, () => {
  console.log(`DSA Visualizer Backend running on http://localhost:${PORT}`);
});
