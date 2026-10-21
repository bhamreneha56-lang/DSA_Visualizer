/**
 * Utility to calculate 2D and 3D positions for tree structures
 */

export function calculateTreeLayout(root, width = 800, height = 500) {
  if (!root) return { nodes: [], links: [] };

  const nodes = [];
  const links = [];

  function getDepth(node) {
    if (!node) return 0;
    return 1 + Math.max(getDepth(node.left), getDepth(node.right));
  }

  const maxDepth = getDepth(root);
  const verticalSpacing = Math.min(90, (height - 120) / Math.max(1, maxDepth));

  function traverse(node, depth, leftBound, rightBound, parent = null) {
    if (!node) return;

    const x = (leftBound + rightBound) / 2;
    const y = 60 + depth * verticalSpacing;

    const nodeItem = {
      id: node.id || `node-${node.val}`,
      val: node.val,
      height: node.height,
      bf: node.bf,
      depth,
      x,
      y,
      z: (maxDepth - depth) * 40, // 3D elevation
      raw: node
    };

    nodes.push(nodeItem);

    if (parent) {
      links.push({
        source: parent,
        target: nodeItem,
        id: `${parent.id}->${nodeItem.id}`
      });
    }

    if (node.left) {
      traverse(node.left, depth + 1, leftBound, x, nodeItem);
    }
    if (node.right) {
      traverse(node.right, depth + 1, x, rightBound, nodeItem);
    }
  }

  traverse(root, 0, 40, width - 40);
  return { nodes, links, maxDepth };
}

export function calculateHeapLayout(arr, heapSize, width = 800, height = 450) {
  if (!arr || arr.length === 0) return { nodes: [], links: [] };

  const nodes = [];
  const links = [];
  const n = heapSize !== undefined && heapSize !== -1 ? heapSize : arr.length;

  function getDepth(count) {
    return Math.floor(Math.log2(count)) + 1;
  }

  const maxDepth = getDepth(Math.max(1, n));
  const verticalSpacing = Math.min(85, (height - 100) / Math.max(1, maxDepth));

  for (let i = 0; i < n; i++) {
    const level = Math.floor(Math.log2(i + 1));
    const levelStart = Math.pow(2, level) - 1;
    const posInLevel = i - levelStart;
    const itemsInLevel = Math.pow(2, level);

    const segmentWidth = (width - 80) / itemsInLevel;
    const x = 40 + segmentWidth * (posInLevel + 0.5);
    const y = 60 + level * verticalSpacing;

    const nodeItem = {
      id: `heap-${i}-${arr[i]}`,
      idx: i,
      val: arr[i],
      depth: level,
      x,
      y,
      z: (maxDepth - level) * 40
    };

    nodes.push(nodeItem);

    // Left child
    const leftIdx = 2 * i + 1;
    if (leftIdx < n) {
      links.push({
        sourceIdx: i,
        targetIdx: leftIdx
      });
    }

    // Right child
    const rightIdx = 2 * i + 2;
    if (rightIdx < n) {
      links.push({
        sourceIdx: i,
        targetIdx: rightIdx
      });
    }
  }

  // Map links source/target
  const mappedLinks = links.map(l => ({
    source: nodes[l.sourceIdx],
    target: nodes[l.targetIdx],
    id: `heap-${l.sourceIdx}->${l.targetIdx}`
  })).filter(l => l.source && l.target);

  return { nodes, links: mappedLinks, maxDepth };
}

export function calculateGraphLayout(graphData, width = 800, height = 500) {
  if (!graphData || !graphData.nodes) return { nodes: [], links: [] };

  const num = graphData.nodes.length;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.36;

  const nodes = graphData.nodes.map((node, i) => {
    const angle = (2 * Math.PI * i) / num - Math.PI / 2;
    return {
      id: node.id,
      label: node.label,
      val: node.label,
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      z: Math.sin(angle) * 30
    };
  });

  const links = (graphData.edges || []).map((e, idx) => {
    const source = nodes[e.u];
    const target = nodes[e.v];
    return {
      id: `edge-${e.u}-${e.v}-${idx}`,
      u: e.u,
      v: e.v,
      source,
      target,
      weight: e.weight
    };
  });

  return { nodes, links };
}

export function calculateBTreeLayout(root, width = 860, height = 500) {
  if (!root || !root.keys || root.keys.length === 0) return { nodes: [], links: [] };

  const nodes = [];
  const links = [];

  function getDepth(node) {
    if (!node) return 0;
    if (!node.children || node.children.length === 0) return 1;
    return 1 + Math.max(...node.children.map(getDepth));
  }

  const maxDepth = getDepth(root);
  const verticalSpacing = Math.min(100, (height - 120) / Math.max(1, maxDepth));

  function computeSubtreeWidth(node) {
    if (!node) return 0;
    const numKeys = node.keys ? node.keys.length : 1;
    const selfWidth = Math.max(64, numKeys * 40 + 16);
    node._selfWidth = selfWidth;
    node._selfHeight = 36;

    if (!node.children || node.children.length === 0) {
      node._subtreeWidth = selfWidth + 24;
      return node._subtreeWidth;
    }

    let childrenWidth = 0;
    for (const child of node.children) {
      childrenWidth += computeSubtreeWidth(child);
    }
    node._subtreeWidth = Math.max(selfWidth + 24, childrenWidth + (node.children.length - 1) * 16);
    return node._subtreeWidth;
  }

  computeSubtreeWidth(root);

  function assignPositions(node, depth, leftBound, rightBound, parent = null) {
    if (!node) return;

    const x = (leftBound + rightBound) / 2;
    const y = 60 + depth * verticalSpacing;

    const nodeItem = {
      id: `btree-${node.id}`,
      nodeId: node.id,
      keys: node.keys || [],
      val: (node.keys || []).join(', '),
      isLeaf: node.isLeaf,
      width: node._selfWidth,
      height: node._selfHeight,
      depth,
      x,
      y,
      z: (maxDepth - depth) * 40,
      raw: node
    };

    nodes.push(nodeItem);

    if (parent) {
      links.push({
        source: parent,
        target: nodeItem,
        id: `${parent.id}->${nodeItem.id}`
      });
    }

    if (node.children && node.children.length > 0) {
      let curLeft = leftBound;
      const totalSubtree = node.children.reduce((acc, c) => acc + c._subtreeWidth, 0);
      const availableSpace = rightBound - leftBound;
      const scale = availableSpace >= totalSubtree ? 1 : availableSpace / totalSubtree;

      for (const child of node.children) {
        const segWidth = child._subtreeWidth * scale;
        assignPositions(child, depth + 1, curLeft, curLeft + segWidth, nodeItem);
        curLeft += segWidth;
      }
    }
  }

  const initialWidth = Math.max(width - 80, root._subtreeWidth);
  const startLeft = Math.max(40, (width - initialWidth) / 2);
  assignPositions(root, 0, startLeft, startLeft + initialWidth);

  return { nodes, links, maxDepth };
}
