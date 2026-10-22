#ifndef BINARY_TREE_HPP
#define BINARY_TREE_HPP

#include <iostream>
#include <string>
#include <vector>
#include <sstream>
#include <queue>
#include <stack>
#include <algorithm>
#include "tracer.hpp"

// Textbook Binary Tree representation (Varsha Patil - Chapter 7)
// Each node has Data, Lchild, Rchild and unique id for visualization.
class TreeNode {
public:
    int data;
    int id;
    TreeNode* left;
    TreeNode* right;

    TreeNode(int val, int nodeId) : data(val), id(nodeId), left(nullptr), right(nullptr) {}
};

class BinaryTree {
private:
    TreeNode* root;
    Tracer& tracer;
    int nextId;

    std::string serializeNode(TreeNode* node) const {
        if (!node) return "null";
        std::ostringstream oss;
        oss << "{\"id\": " << node->id
            << ", \"val\": " << node->data
            << ", \"left\": " << serializeNode(node->left)
            << ", \"right\": " << serializeNode(node->right) << "}";
        return oss.str();
    }

    std::string getState() const {
        std::ostringstream oss;
        oss << "{\"type\": \"tree\", \"root\": " << serializeNode(root) << "}";
        return oss.str();
    }

public:
    BinaryTree(Tracer& t) : root(nullptr), tracer(t), nextId(1) {}

    ~BinaryTree() {
        destroy(root);
    }

    void destroy(TreeNode* node) {
        if (node) {
            destroy(node->left);
            destroy(node->right);
            delete node;
        }
    }

    // Insert level-order (complete / breadth-first placement)
    void insertLevelOrder(int val) {
        if (!root) {
            root = new TreeNode(val, nextId++);
            tracer.addStep("ALLOCATE_ROOT", 20,
                           "Created root TreeNode with value " + std::to_string(val) + " (address allocated).",
                           {root->data}, {val}, getState());
            return;
        }

        std::queue<TreeNode*> q;
        q.push(root);

        tracer.addStep("START_INSERT", 25,
                       "Level-order searching for first vacant left or right child position to insert " + std::to_string(val) + ".",
                       {root->data}, {val}, getState());

        while (!q.empty()) {
            TreeNode* curr = q.front();
            q.pop();

            tracer.addStep("INSPECT_NODE", 30,
                           "Inspecting node " + std::to_string(curr->data) + " for available child link.",
                           {curr->data}, {curr->data}, getState());

            if (!curr->left) {
                curr->left = new TreeNode(val, nextId++);
                tracer.addStep("ATTACH_LEFT", 35,
                               "Linked new TreeNode " + std::to_string(val) + " as Left Child of parent " + std::to_string(curr->data) + ".",
                               {curr->left->data, curr->data}, {val}, getState());
                break;
            } else {
                q.push(curr->left);
            }

            if (!curr->right) {
                curr->right = new TreeNode(val, nextId++);
                tracer.addStep("ATTACH_RIGHT", 40,
                               "Linked new TreeNode " + std::to_string(val) + " as Right Child of parent " + std::to_string(curr->data) + ".",
                               {curr->right->data, curr->data}, {val}, getState());
                break;
            } else {
                q.push(curr->right);
            }
        }
    }

    void insertSilent(int val) {
        if (!root) {
            root = new TreeNode(val, nextId++);
            return;
        }
        std::queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            TreeNode* curr = q.front();
            q.pop();
            if (!curr->left) {
                curr->left = new TreeNode(val, nextId++);
                return;
            } else {
                q.push(curr->left);
            }
            if (!curr->right) {
                curr->right = new TreeNode(val, nextId++);
                return;
            } else {
                q.push(curr->right);
            }
        }
    }

    // Traversal: Inorder (L-D-R)
    void traverseInorder() {
        tracer.addStep("START_INORDER", 50,
                       "Starting recursive Inorder Traversal: Left Subtree -> Data (Visit) -> Right Subtree (L-D-R).",
                       {}, {}, getState());
        inorderRec(root);
        tracer.addStep("FINISH_INORDER", 55,
                       "Inorder traversal complete.",
                       {}, {}, getState());
    }

    void inorderRec(TreeNode* node) {
        if (!node) return;
        inorderRec(node->left);
        tracer.addStep("VISIT_NODE", 60,
                       "Inorder: Visited node " + std::to_string(node->data) + " (L-D-R).",
                       {node->data}, {node->data}, getState());
        inorderRec(node->right);
    }

    // Traversal: Preorder (D-L-R)
    void traversePreorder() {
        tracer.addStep("START_PREORDER", 65,
                       "Starting recursive Preorder Traversal: Data (Visit) -> Left Subtree -> Right Subtree (D-L-R).",
                       {}, {}, getState());
        preorderRec(root);
        tracer.addStep("FINISH_PREORDER", 70,
                       "Preorder traversal complete.",
                       {}, {}, getState());
    }

    void preorderRec(TreeNode* node) {
        if (!node) return;
        tracer.addStep("VISIT_NODE", 75,
                       "Preorder: Visited root node " + std::to_string(node->data) + " (D-L-R).",
                       {node->data}, {node->data}, getState());
        preorderRec(node->left);
        preorderRec(node->right);
    }

    // Traversal: Postorder (L-R-D)
    void traversePostorder() {
        tracer.addStep("START_POSTORDER", 80,
                       "Starting recursive Postorder Traversal: Left Subtree -> Right Subtree -> Data (Visit) (L-R-D).",
                       {}, {}, getState());
        postorderRec(root);
        tracer.addStep("FINISH_POSTORDER", 85,
                       "Postorder traversal complete.",
                       {}, {}, getState());
    }

    void postorderRec(TreeNode* node) {
        if (!node) return;
        postorderRec(node->left);
        postorderRec(node->right);
        tracer.addStep("VISIT_NODE", 90,
                       "Postorder: Visited node " + std::to_string(node->data) + " after both subtrees (L-R-D).",
                       {node->data}, {node->data}, getState());
    }

    // Breadth-First Search (Level Order Traversal) - Section 7.7.6 / Program Code 7.9
    void traverseBFS() {
        if (!root) {
            tracer.addStep("BFS_EMPTY", 95, "Tree is empty. Level order traversal ends.", {}, {}, getState());
            return;
        }

        tracer.addStep("START_BFS", 100,
                       "Starting Breadth-First Traversal (BFS) using FIFO Queue Q (Varsha Patil Program Code 7.9).",
                       {root->data}, {}, getState());

        std::queue<TreeNode*> q;
        q.push(root);

        while (!q.empty()) {
            TreeNode* curr = q.front();
            q.pop();

            tracer.addStep("BFS_VISIT", 105,
                           "Queue pop -> Visited node " + std::to_string(curr->data) + ". Enqueueing existing children.",
                           {curr->data}, {curr->data}, getState());

            if (curr->left) {
                q.push(curr->left);
                tracer.addStep("BFS_ENQUEUE_LEFT", 110,
                               "Enqueued Left Child " + std::to_string(curr->left->data) + " of node " + std::to_string(curr->data) + " into Queue.",
                               {curr->left->data, curr->data}, {}, getState());
            }
            if (curr->right) {
                q.push(curr->right);
                tracer.addStep("BFS_ENQUEUE_RIGHT", 115,
                               "Enqueued Right Child " + std::to_string(curr->right->data) + " of node " + std::to_string(curr->data) + " into Queue.",
                               {curr->right->data, curr->data}, {}, getState());
            }
        }

        tracer.addStep("FINISH_BFS", 120, "BFS Level-Order traversal completed.", {}, {}, getState());
    }

    // Count Nodes - Section 7.8.1 (Varsha Patil)
    int countNodes() {
        tracer.addStep("START_COUNT_NODES", 125,
                       "Computing total node count: CountNode(Root) = 1 + CountNode(Left) + CountNode(Right).",
                       {}, {}, getState());
        int total = countNodesRec(root);
        tracer.addStep("FINISH_COUNT_NODES", 130,
                       "Total Node Count = " + std::to_string(total) + ".",
                       {}, {total}, getState());
        return total;
    }

    int countNodesRec(TreeNode* node) {
        if (!node) return 0;
        tracer.addStep("COUNT_NODE_ENTER", 132,
                       "Counting node " + std::to_string(node->data) + ".",
                       {node->data}, {}, getState());
        int l = countNodesRec(node->left);
        int r = countNodesRec(node->right);
        int subtotal = 1 + l + r;
        tracer.addStep("COUNT_NODE_SUBTOTAL", 135,
                       "Subtree at node " + std::to_string(node->data) + " has 1 + " + std::to_string(l) + " + " + std::to_string(r) + " = " + std::to_string(subtotal) + " nodes.",
                       {node->data}, {subtotal}, getState());
        return subtotal;
    }

    // Count Leaf Nodes - Section 7.8.2 (Varsha Patil)
    int countLeaves() {
        tracer.addStep("START_COUNT_LEAVES", 140,
                       "Computing leaf node count: node with Left == NULL and Right == NULL yields 1.",
                       {}, {}, getState());
        int total = countLeavesRec(root);
        tracer.addStep("FINISH_COUNT_LEAVES", 145,
                       "Total Leaf Node Count = " + std::to_string(total) + ".",
                       {}, {total}, getState());
        return total;
    }

    int countLeavesRec(TreeNode* node) {
        if (!node) return 0;
        if (!node->left && !node->right) {
            tracer.addStep("FOUND_LEAF", 150,
                           "Node " + std::to_string(node->data) + " has no children -> Leaf node counted (+1).",
                           {node->data}, {1}, getState());
            return 1;
        }
        int l = countLeavesRec(node->left);
        int r = countLeavesRec(node->right);
        return l + r;
    }

    // Tree Height - Section 7.8.3 (Varsha Patil)
    int treeHeight() {
        tracer.addStep("START_TREE_HEIGHT", 160,
                       "Computing Tree Height: maximum path length = 1 + max(Height(Left), Height(Right)).",
                       {}, {}, getState());
        int h = heightRec(root);
        tracer.addStep("FINISH_TREE_HEIGHT", 165,
                       "Computed Tree Height = " + std::to_string(h) + ".",
                       {}, {h}, getState());
        return h;
    }

    int heightRec(TreeNode* node) {
        if (!node) return 0;
        tracer.addStep("HEIGHT_INSPECT", 170,
                       "Inspecting height of subtree at node " + std::to_string(node->data) + ".",
                       {node->data}, {}, getState());
        int hl = heightRec(node->left);
        int hr = heightRec(node->right);
        int h = 1 + std::max(hl, hr);
        tracer.addStep("HEIGHT_RESOLVE", 175,
                       "Subtree at node " + std::to_string(node->data) + ": height = 1 + max(" + std::to_string(hl) + ", " + std::to_string(hr) + ") = " + std::to_string(h) + ".",
                       {node->data}, {h}, getState());
        return h;
    }

    // Mirror Binary Tree - Section 7.8.4 (Varsha Patil)
    void mirrorTree() {
        tracer.addStep("START_MIRROR", 180,
                       "Generating Mirror (Replica / Tree Interchange) by recursively swapping Left and Right subtrees.",
                       {}, {}, getState());
        mirrorRec(root);
        tracer.addStep("FINISH_MIRROR", 185,
                       "Mirror tree generation completed.",
                       {}, {}, getState());
    }

    void mirrorRec(TreeNode* node) {
        if (!node) return;
        tracer.addStep("MIRROR_SWAP", 190,
                       "Swapping Left Child and Right Child of node " + std::to_string(node->data) + ".",
                       {node->data}, {}, getState());
        TreeNode* tmp = node->left;
        node->left = node->right;
        node->right = tmp;

        tracer.addStep("MIRROR_AFTER_SWAP", 195,
                       "Node " + std::to_string(node->data) + " children swapped. Recursing on new left & right subtrees.",
                       {node->data}, {}, getState());

        mirrorRec(node->left);
        mirrorRec(node->right);
    }
};

#endif // BINARY_TREE_HPP
