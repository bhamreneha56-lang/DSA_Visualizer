#include <iostream>
#include <string>
#include <vector>
#include <sstream>
#include <map>
#include <algorithm>
#include <tuple>
#include "../include/tracer.hpp"
#include "../include/binary_tree.hpp"
#include "../include/bst.hpp"
#include "../include/avl.hpp"
#include "../include/heap.hpp"
#include "../include/graph.hpp"
#include "../include/btree.hpp"

// Utility to trim whitespace
static inline std::string trim(const std::string& s) {
    size_t start = s.find_first_not_of(" \t\r\n");
    if (start == std::string::npos) return "";
    size_t end = s.find_last_not_of(" \t\r\n");
    return s.substr(start, end - start + 1);
}

// Utility to split comma-separated numbers
std::vector<int> parseNumbers(const std::string& input) {
    std::vector<int> nums;
    std::stringstream ss(input);
    std::string item;
    while (std::getline(ss, item, ',')) {
        item = trim(item);
        if (!item.empty()) {
            try {
                nums.push_back(std::stoi(item));
            } catch (...) {}
        }
    }
    return nums;
}

// Utility to split string by delimiter
std::vector<std::string> splitString(const std::string& s, char delim) {
    std::vector<std::string> res;
    std::stringstream ss(s);
    std::string item;
    while (std::getline(ss, item, delim)) {
        item = trim(item);
        if (!item.empty()) res.push_back(item);
    }
    return res;
}

struct ParsedEdge {
    std::string u;
    std::string v;
    int weight;
};

ParsedEdge parseSingleEdge(std::string s) {
    s = trim(s);
    // Replace "->" with "-"
    size_t arrPos = s.find("->");
    if (arrPos != std::string::npos) {
        s.replace(arrPos, 2, "-");
    }

    std::string u = "", v = "";
    int w = 1;
    size_t colon = s.find(':');
    if (colon != std::string::npos) {
        std::string uv = s.substr(0, colon);
        std::string ws = s.substr(colon + 1);
        try { w = std::stoi(trim(ws)); } catch (...) { w = 1; }
        size_t dash = uv.find('-');
        if (dash != std::string::npos) {
            u = trim(uv.substr(0, dash));
            v = trim(uv.substr(dash + 1));
        } else {
            size_t comma = uv.find(',');
            if (comma != std::string::npos) {
                u = trim(uv.substr(0, comma));
                v = trim(uv.substr(comma + 1));
            }
        }
    } else {
        size_t pOpen = s.find('(');
        size_t pClose = s.find(')');
        if (pOpen != std::string::npos && pClose != std::string::npos && pClose > pOpen) {
            std::string ws = s.substr(pOpen + 1, pClose - pOpen - 1);
            try { w = std::stoi(trim(ws)); } catch (...) { w = 1; }
            s = s.substr(0, pOpen);
        }
        size_t dash = s.find('-');
        if (dash != std::string::npos) {
            u = trim(s.substr(0, dash));
            v = trim(s.substr(dash + 1));
        } else {
            auto parts = splitString(s, ',');
            if (parts.size() >= 2) {
                u = parts[0];
                v = parts[1];
                if (parts.size() >= 3) {
                    try { w = std::stoi(parts[2]); } catch (...) { w = 1; }
                }
            }
        }
    }
    return {u, v, w};
}

int main(int argc, char* argv[]) {
    std::string ds = "bst";
    std::string op = "insert";
    std::string data = "20,10,30,5,15";

    for (int i = 1; i < argc; ++i) {
        std::string arg = argv[i];
        if (arg == "--ds" && i + 1 < argc) {
            ds = argv[++i];
        } else if (arg == "--op" && i + 1 < argc) {
            op = argv[++i];
        } else if (arg == "--data" && i + 1 < argc) {
            data = argv[++i];
        }
    }

    Tracer tracer;

    if (ds == "binary_tree" || ds == "binarytree" || ds == "bt") {
        BinaryTree bt(tracer);
        std::vector<int> vals = parseNumbers(data);
        if (vals.empty()) {
            vals = {1, 2, 3, 4, 5, 6, 7};
        }
        if (op == "insert") {
            for (int v : vals) {
                bt.insertLevelOrder(v);
            }
        } else if (op == "inorder") {
            for (int v : vals) bt.insertSilent(v);
            bt.traverseInorder();
        } else if (op == "preorder") {
            for (int v : vals) bt.insertSilent(v);
            bt.traversePreorder();
        } else if (op == "postorder") {
            for (int v : vals) bt.insertSilent(v);
            bt.traversePostorder();
        } else if (op == "bfs" || op == "levelorder") {
            for (int v : vals) bt.insertSilent(v);
            bt.traverseBFS();
        } else if (op == "count_nodes") {
            for (int v : vals) bt.insertSilent(v);
            bt.countNodes();
        } else if (op == "count_leaves") {
            for (int v : vals) bt.insertSilent(v);
            bt.countLeaves();
        } else if (op == "height") {
            for (int v : vals) bt.insertSilent(v);
            bt.treeHeight();
        } else if (op == "mirror") {
            for (int v : vals) bt.insertSilent(v);
            bt.mirrorTree();
        }
    } else if (ds == "bst") {
        BST bst(tracer);
        std::vector<int> vals = parseNumbers(data);
        if (op == "insert") {
            for (int v : vals) {
                bst.insert(v);
            }
        } else if (op == "inorder") {
            for (int v : vals) bst.insertSilent(v);
            bst.traverseInorder();
        } else if (op == "preorder") {
            for (int v : vals) bst.insertSilent(v);
            bst.traversePreorder();
        } else if (op == "postorder") {
            for (int v : vals) bst.insertSilent(v);
            bst.traversePostorder();
        } else if (op == "delete" && !vals.empty()) {
            int target = vals.back();
            std::vector<int> treeVals = vals;
            size_t semi = data.find(';');
            if (semi != std::string::npos) {
                std::string targetStr = data.substr(semi + 1);
                try {
                    target = std::stoi(trim(targetStr));
                } catch (...) {}
                treeVals = parseNumbers(data.substr(0, semi));
            }
            for (int v : treeVals) bst.insertSilent(v);
            bst.remove(target);
        }
    } else if (ds == "avl") {
        AVLTree avl(tracer);
        std::vector<int> vals = parseNumbers(data);
        for (int v : vals) {
            avl.insert(v);
        }
    } else if (ds == "heap" || ds == "heapsort") {
        std::vector<int> vals = parseNumbers(data);
        bool isMin = (op == "min");
        Heap h(isMin, tracer);
        if (ds == "heapsort") {
            h.heapSort(vals);
        } else {
            h.buildHeap(vals);
        }
    } else if (ds == "graph") {
        bool isDirected = false;
        std::vector<std::string> nodeLabels;
        std::vector<ParsedEdge> parsedEdges;
        std::string startLabel = "A";

        // Check format: isDirected|nodes|edges|start
        if (data.find('|') != std::string::npos) {
            auto parts = splitString(data, '|');
            if (parts.size() >= 1) {
                std::string dirStr = parts[0];
                isDirected = (dirStr == "1" || dirStr == "true" || dirStr == "directed");
            }
            if (parts.size() >= 2) {
                nodeLabels = splitString(parts[1], ',');
            }
            if (parts.size() >= 3) {
                auto edgeItems = splitString(parts[2], ',');
                for (const auto& item : edgeItems) {
                    ParsedEdge pe = parseSingleEdge(item);
                    if (!pe.u.empty() && !pe.v.empty()) {
                        parsedEdges.push_back(pe);
                    }
                }
            }
            if (parts.size() >= 4) {
                startLabel = trim(parts[3]);
            }
        } else if (!trim(data).empty()) {
            // Edges only or comma-separated
            auto edgeItems = splitString(data, ',');
            for (const auto& item : edgeItems) {
                ParsedEdge pe = parseSingleEdge(item);
                if (!pe.u.empty() && !pe.v.empty()) {
                    parsedEdges.push_back(pe);
                }
            }
        }

        // If nodes empty, deduce from edges or fallback to default standard 6-vertex graph
        if (nodeLabels.empty() && parsedEdges.empty()) {
            // Default sample graph
            isDirected = false;
            nodeLabels = {"A", "B", "C", "D", "E", "F"};
            parsedEdges = {
                {"A", "B", 4}, {"A", "C", 2}, {"B", "C", 1},
                {"B", "D", 5}, {"C", "D", 8}, {"C", "E", 10},
                {"D", "E", 2}, {"D", "F", 6}, {"E", "F", 3}
            };
            startLabel = "A";
        } else if (nodeLabels.empty()) {
            // Collect unique nodes from edges
            for (const auto& pe : parsedEdges) {
                if (std::find(nodeLabels.begin(), nodeLabels.end(), pe.u) == nodeLabels.end()) {
                    nodeLabels.push_back(pe.u);
                }
                if (std::find(nodeLabels.begin(), nodeLabels.end(), pe.v) == nodeLabels.end()) {
                    nodeLabels.push_back(pe.v);
                }
            }
            std::sort(nodeLabels.begin(), nodeLabels.end());
        }

        // Map label to index
        std::map<std::string, int> labelToIdx;
        for (size_t i = 0; i < nodeLabels.size(); ++i) {
            labelToIdx[nodeLabels[i]] = (int)i;
        }

        int startIdx = 0;
        if (labelToIdx.find(startLabel) != labelToIdx.end()) {
            startIdx = labelToIdx[startLabel];
        }

        Graph g((int)nodeLabels.size(), tracer, isDirected, nodeLabels);
        for (const auto& pe : parsedEdges) {
            if (labelToIdx.find(pe.u) != labelToIdx.end() && labelToIdx.find(pe.v) != labelToIdx.end()) {
                g.addEdge(labelToIdx[pe.u], labelToIdx[pe.v], pe.weight);
            }
        }

        if (op == "bfs") {
            g.bfs(startIdx);
        } else if (op == "dfs") {
            g.dfs(startIdx);
        } else if (op == "dijkstra") {
            g.dijkstra(startIdx);
        } else if (op == "kruskal") {
            g.kruskalMST();
        } else if (op == "prim") {
            g.primMST(startIdx);
        }
    } else if (ds == "btree") {
        int degree = 2; // default minimum degree t = 2 (Order 2*t = 4)
        std::string numbersData = data;

        // Check if degree is passed as degree|numbers or t=...
        size_t pipePos = data.find('|');
        if (pipePos != std::string::npos) {
            std::string degStr = data.substr(0, pipePos);
            numbersData = data.substr(pipePos + 1);
            try {
                int d = std::stoi(degStr);
                if (d >= 2) degree = d;
            } catch (...) {}
        }

        BTree btree(degree, tracer);
        std::vector<int> vals = parseNumbers(numbersData);
        for (int v : vals) {
            btree.insert(v);
        }
    }

    std::cout << tracer.dumpJson() << std::endl;
    return 0;
}
