#ifndef GRAPH_HPP
#define GRAPH_HPP

#include <iostream>
#include <vector>
#include <string>
#include <queue>
#include <sstream>
#include <algorithm>
#include "tracer.hpp"

struct Edge {
    int u, v, weight;
    bool operator<(const Edge& other) const {
        return weight < other.weight;
    }
};

class Graph {
private:
    int numVertices;
    bool isDirected;
    std::vector<std::string> nodeLabels;
    std::vector<std::vector<int>> adjMatrix;
    std::vector<Edge> edgeList;
    Tracer& tracer;

    std::string getLabel(int idx) const {
        if (idx >= 0 && idx < (int)nodeLabels.size()) {
            return nodeLabels[idx];
        }
        return std::to_string(idx);
    }

    std::string getState(const std::vector<int>& visited = {},
                          const std::vector<std::pair<int, int>>& highlightedEdges = {},
                          const std::vector<int>& dist = {}) const {
        std::ostringstream oss;
        oss << "{\"type\": \"graph\", ";
        oss << "\"isDirected\": " << (isDirected ? "true" : "false") << ", ";
        oss << "\"numVertices\": " << numVertices << ", ";
        
        oss << "\"nodes\": [";
        for (int i = 0; i < numVertices; ++i) {
            oss << "{\"id\": " << i << ", \"label\": \"" << getLabel(i) << "\"}";
            if (i + 1 < numVertices) oss << ", ";
        }
        oss << "], ";

        oss << "\"edges\": [";
        for (size_t i = 0; i < edgeList.size(); ++i) {
            oss << "{\"u\": " << edgeList[i].u << ", \"v\": " << edgeList[i].v 
                << ", \"weight\": " << edgeList[i].weight << "}";
            if (i + 1 < edgeList.size()) oss << ", ";
        }
        oss << "], ";

        oss << "\"visited\": [";
        for (size_t i = 0; i < visited.size(); ++i) {
            oss << visited[i] << (i + 1 < visited.size() ? ", " : "");
        }
        oss << "], ";

        oss << "\"highlightedEdges\": [";
        for (size_t i = 0; i < highlightedEdges.size(); ++i) {
            oss << "{\"u\": " << highlightedEdges[i].first << ", \"v\": " << highlightedEdges[i].second << "}";
            if (i + 1 < highlightedEdges.size()) oss << ", ";
        }
        oss << "], ";

        oss << "\"distances\": [";
        for (size_t i = 0; i < dist.size(); ++i) {
            oss << dist[i] << (i + 1 < dist.size() ? ", " : "");
        }
        oss << "]}";

        return oss.str();
    }

    int findParent(int i, std::vector<int>& parent) {
        if (parent[i] == i) return i;
        return parent[i] = findParent(parent[i], parent);
    }

    void unionSets(int u, int v, std::vector<int>& parent, std::vector<int>& rank) {
        int rootU = findParent(u, parent);
        int rootV = findParent(v, parent);
        if (rootU != rootV) {
            if (rank[rootU] < rank[rootV]) {
                parent[rootU] = rootV;
            } else if (rank[rootU] > rank[rootV]) {
                parent[rootV] = rootU;
            } else {
                parent[rootV] = rootU;
                rank[rootU]++;
            }
        }
    }

public:
    Graph(int n, Tracer& t, bool directed = false, const std::vector<std::string>& labels = {})
        : numVertices(n), isDirected(directed), tracer(t) {
        adjMatrix.assign(n, std::vector<int>(n, 0));
        if (!labels.empty()) {
            nodeLabels = labels;
        } else {
            for (int i = 0; i < n; ++i) {
                if (n <= 26) {
                    nodeLabels.push_back(std::string(1, char('A' + i)));
                } else {
                    nodeLabels.push_back("V" + std::to_string(i));
                }
            }
        }
    }

    void addEdge(int u, int v, int weight = 1) {
        if (u >= 0 && u < numVertices && v >= 0 && v < numVertices) {
            adjMatrix[u][v] = weight;
            if (!isDirected) {
                adjMatrix[v][u] = weight;
            }
            edgeList.push_back({u, v, weight});
        }
    }

    void bfs(int startNode) {
        if (startNode < 0 || startNode >= numVertices) startNode = 0;
        std::vector<bool> visited(numVertices, false);
        std::vector<int> visitedOrder;
        std::vector<std::pair<int, int>> treeEdges;
        std::queue<int> q;

        visited[startNode] = true;
        q.push(startNode);
        visitedOrder.push_back(startNode);

        tracer.addStep("BFS_START", 98,
                       "Starting Breadth-First Search from vertex " + getLabel(startNode) + ". Enqueued to queue.",
                       {startNode}, {}, getState(visitedOrder, treeEdges));

        while (!q.empty()) {
            int u = q.front();
            q.pop();

            tracer.addStep("BFS_DEQUEUE", 106,
                           "Dequeued vertex " + getLabel(u) + ". Exploring unvisited adjacent vertices.",
                           {u}, {}, getState(visitedOrder, treeEdges));

            for (int v = 0; v < numVertices; ++v) {
                if (adjMatrix[u][v] > 0) {
                    if (!visited[v]) {
                        visited[v] = true;
                        q.push(v);
                        visitedOrder.push_back(v);
                        treeEdges.push_back({u, v});

                        tracer.addStep("BFS_DISCOVER", 118,
                                       "Discovered vertex " + getLabel(v) + 
                                       " via edge (" + getLabel(u) + (isDirected ? " -> " : " - ") + 
                                       getLabel(v) + "). Enqueued.",
                                       {v}, {u, v}, getState(visitedOrder, treeEdges));
                    }
                }
            }
        }

        tracer.addStep("BFS_COMPLETE", 128,
                       "BFS traversal completed. All reachable vertices visited.",
                       {}, {}, getState(visitedOrder, treeEdges));
    }

    void dfsHelper(int u, std::vector<bool>& visited, std::vector<int>& visitedOrder, 
                   std::vector<std::pair<int, int>>& treeEdges) {
        visited[u] = true;
        visitedOrder.push_back(u);

        tracer.addStep("DFS_VISIT", 137,
                       "DFS visited vertex " + getLabel(u) + ". Recursing deeper into adjacent neighbors.",
                       {u}, {}, getState(visitedOrder, treeEdges));

        for (int v = 0; v < numVertices; ++v) {
            if (adjMatrix[u][v] > 0 && !visited[v]) {
                treeEdges.push_back({u, v});
                tracer.addStep("DFS_EXPLORE_EDGE", 144,
                               "Exploring unvisited edge (" + getLabel(u) + (isDirected ? " -> " : " - ") + 
                               getLabel(v) + ").",
                               {v}, {u, v}, getState(visitedOrder, treeEdges));
                dfsHelper(v, visited, visitedOrder, treeEdges);
            }
        }
    }

    void dfs(int startNode) {
        if (startNode < 0 || startNode >= numVertices) startNode = 0;
        std::vector<bool> visited(numVertices, false);
        std::vector<int> visitedOrder;
        std::vector<std::pair<int, int>> treeEdges;

        tracer.addStep("DFS_START", 157,
                       "Starting Depth-First Search from vertex " + getLabel(startNode) + ".",
                       {startNode}, {}, getState(visitedOrder, treeEdges));

        dfsHelper(startNode, visited, visitedOrder, treeEdges);

        tracer.addStep("DFS_COMPLETE", 164,
                       "DFS traversal finished.",
                       {}, {}, getState(visitedOrder, treeEdges));
    }

    void dijkstra(int startNode) {
        if (startNode < 0 || startNode >= numVertices) startNode = 0;
        const int INF = 999999;
        std::vector<int> dist(numVertices, INF);
        std::vector<bool> sptSet(numVertices, false);
        std::vector<int> visitedOrder;
        std::vector<std::pair<int, int>> treeEdges;

        dist[startNode] = 0;

        tracer.addStep("DIJKSTRA_START", 178,
                       "Initialized Dijkstra's Shortest Path from source vertex " + 
                       getLabel(startNode) + ". Set dist[" + getLabel(startNode) + 
                       "] = 0, all other vertices = INF.",
                       {startNode}, {}, getState(visitedOrder, treeEdges, dist));

        for (int count = 0; count < numVertices - 1; ++count) {
            int u = -1;
            int minDist = INF;
            for (int v = 0; v < numVertices; ++v) {
                if (!sptSet[v] && dist[v] < minDist) {
                    minDist = dist[v];
                    u = v;
                }
            }

            if (u == -1) break;
            sptSet[u] = true;
            visitedOrder.push_back(u);

            tracer.addStep("DIJKSTRA_PICK_MIN", 198,
                           "Selected unvisited vertex " + getLabel(u) + 
                           " with minimum known distance " + std::to_string(dist[u]) + ".",
                           {u}, {}, getState(visitedOrder, treeEdges, dist));

            for (int v = 0; v < numVertices; ++v) {
                if (!sptSet[v] && adjMatrix[u][v] > 0 && dist[u] != INF) {
                    int newDist = dist[u] + adjMatrix[u][v];
                    if (newDist < dist[v]) {
                        tracer.addStep("DIJKSTRA_RELAX", 207,
                                       "Edge Relaxation on (" + getLabel(u) + (isDirected ? " -> " : " - ") + 
                                       getLabel(v) + "): Old dist = " + 
                                       (dist[v] == INF ? "INF" : std::to_string(dist[v])) + 
                                       " -> New dist = dist[" + getLabel(u) + "] + " + 
                                       std::to_string(adjMatrix[u][v]) + " = " + std::to_string(newDist) + ".",
                                       {v}, {u, v}, getState(visitedOrder, treeEdges, dist));
                        dist[v] = newDist;
                        treeEdges.push_back({u, v});
                    }
                }
            }
        }

        tracer.addStep("DIJKSTRA_COMPLETE", 222,
                       "Dijkstra shortest path calculation completed.",
                       {}, {}, getState(visitedOrder, treeEdges, dist));
    }

    void kruskalMST() {
        std::vector<Edge> sortedEdges = edgeList;
        std::sort(sortedEdges.begin(), sortedEdges.end());

        std::vector<int> parent(numVertices);
        std::vector<int> rank(numVertices, 0);
        for (int i = 0; i < numVertices; ++i) parent[i] = i;

        std::vector<std::pair<int, int>> mstEdges;
        int totalWeight = 0;

        tracer.addStep("KRUSKAL_START", 238,
                       "Kruskal's Algorithm: Sorted all " + std::to_string(sortedEdges.size()) + 
                       " edges by weight in ascending order. Initialized Disjoint Set Forest.",
                       {}, {}, getState({}, mstEdges));

        for (const auto& edge : sortedEdges) {
            int rootU = findParent(edge.u, parent);
            int rootV = findParent(edge.v, parent);

            tracer.addStep("KRUSKAL_CHECK_EDGE", 246,
                           "Inspecting lowest weight edge (" + getLabel(edge.u) + " - " + 
                           getLabel(edge.v) + ") with weight " + std::to_string(edge.weight) + ".",
                           {edge.u, edge.v}, {}, getState({}, mstEdges));

            if (rootU != rootV) {
                mstEdges.push_back({edge.u, edge.v});
                totalWeight += edge.weight;
                unionSets(rootU, rootV, parent, rank);

                tracer.addStep("KRUSKAL_ADD_EDGE", 255,
                               "Edge (" + getLabel(edge.u) + " - " + 
                               getLabel(edge.v) + ") connects two disjoint components without creating a cycle. Added to MST. Total Weight = " + 
                               std::to_string(totalWeight) + ".",
                               {edge.u, edge.v}, {}, getState({}, mstEdges));
            } else {
                tracer.addStep("KRUSKAL_CYCLE_DISCARD", 262,
                               "Vertices " + getLabel(edge.u) + " and " + 
                               getLabel(edge.v) + " are already connected. Discarded to prevent cycle.",
                               {edge.u, edge.v}, {}, getState({}, mstEdges));
            }

            if (mstEdges.size() == (size_t)(numVertices - 1)) break;
        }

        tracer.addStep("KRUSKAL_COMPLETE", 271,
                       "Minimum Spanning Tree formed with " + std::to_string(mstEdges.size()) + 
                       " edges and total weight " + std::to_string(totalWeight) + ".",
                       {}, {}, getState({}, mstEdges));
    }

    void primMST(int startNode = 0) {
        if (startNode < 0 || startNode >= numVertices) startNode = 0;
        std::vector<bool> inMST(numVertices, false);
        std::vector<int> key(numVertices, 999999);
        std::vector<int> parent(numVertices, -1);
        std::vector<std::pair<int, int>> mstEdges;

        key[startNode] = 0;

        tracer.addStep("PRIM_START", 285,
                       "Prim's Algorithm: Starting MST growth from root vertex " + 
                       getLabel(startNode) + ".",
                       {startNode}, {}, getState({}, mstEdges));

        for (int count = 0; count < numVertices; ++count) {
            int u = -1;
            int minKey = 999999;
            for (int v = 0; v < numVertices; ++v) {
                if (!inMST[v] && key[v] < minKey) {
                    minKey = key[v];
                    u = v;
                }
            }

            if (u == -1) break;
            inMST[u] = true;

            if (parent[u] != -1) {
                mstEdges.push_back({parent[u], u});
                tracer.addStep("PRIM_ADD_VERTEX", 305,
                               "Added vertex " + getLabel(u) + " to MST via edge (" + 
                               getLabel(parent[u]) + " - " + getLabel(u) + 
                               ") with weight " + std::to_string(adjMatrix[parent[u]][u]) + ".",
                               {u, parent[u]}, {}, getState({}, mstEdges));
            }

            for (int v = 0; v < numVertices; ++v) {
                if (adjMatrix[u][v] > 0 && !inMST[v] && adjMatrix[u][v] < key[v]) {
                    key[v] = adjMatrix[u][v];
                    parent[v] = u;
                    tracer.addStep("PRIM_UPDATE_KEY", 316,
                                   "Updated cut edge to vertex " + getLabel(v) + 
                                   ": minimum connection weight is now " + std::to_string(adjMatrix[u][v]) + 
                                   " from vertex " + getLabel(u) + ".",
                                   {v}, {u, v}, getState({}, mstEdges));
                }
            }
        }

        tracer.addStep("PRIM_COMPLETE", 328,
                       "Prim's MST construction completed.",
                       {}, {}, getState({}, mstEdges));
    }
};

#endif // GRAPH_HPP
