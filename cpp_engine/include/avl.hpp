#ifndef AVL_HPP
#define AVL_HPP

#include <iostream>
#include <string>
#include <algorithm>
#include <sstream>
#include <vector>
#include "tracer.hpp"

class AVLNode {
public:
    int data;
    int id;
    int height;
    AVLNode* left;
    AVLNode* right;

    AVLNode(int val, int nodeId) 
        : data(val), id(nodeId), height(1), left(nullptr), right(nullptr) {}
};

class AVLTree {
private:
    AVLNode* root;
    Tracer& tracer;
    int nextId;

    int getHeight(AVLNode* node) const {
        return node ? node->height : 0;
    }

    int getBalanceFactor(AVLNode* node) const {
        return node ? (getHeight(node->left) - getHeight(node->right)) : 0;
    }

    void updateHeight(AVLNode* node) {
        if (node) {
            node->height = 1 + std::max(getHeight(node->left), getHeight(node->right));
        }
    }

    std::string serializeNode(AVLNode* node) const {
        if (!node) return "null";
        std::ostringstream oss;
        int bf = getBalanceFactor(node);
        oss << "{\"id\": " << node->id 
            << ", \"val\": " << node->data 
            << ", \"height\": " << node->height
            << ", \"bf\": " << bf
            << ", \"left\": " << serializeNode(node->left)
            << ", \"right\": " << serializeNode(node->right) << "}";
        return oss.str();
    }

    std::string getState() const {
        std::ostringstream oss;
        oss << "{\"type\": \"avl\", \"root\": " << serializeNode(root) << "}";
        return oss.str();
    }

    AVLNode* rightRotate(AVLNode* y) {
        AVLNode* x = y->left;
        AVLNode* T2 = x->right;

        tracer.addStep("ROTATE_RIGHT", 48,
                       "Executing Right Rotation (LL Rotation) on node " + std::to_string(y->data) + 
                       ". Node " + std::to_string(x->data) + " becomes new subtree root.",
                       {y->data, x->data}, {}, getState());

        x->right = y;
        y->left = T2;

        updateHeight(y);
        updateHeight(x);

        tracer.addStep("ROTATION_COMPLETE", 58,
                       "Right rotation finished. Recalculated heights: Node " + std::to_string(y->data) + 
                       " height = " + std::to_string(y->height) + ", Node " + std::to_string(x->data) + 
                       " height = " + std::to_string(x->height) + ".",
                       {x->data}, {}, getState());

        return x;
    }

    AVLNode* leftRotate(AVLNode* x) {
        AVLNode* y = x->right;
        AVLNode* T2 = y->left;

        tracer.addStep("ROTATE_LEFT", 67,
                       "Executing Left Rotation (RR Rotation) on node " + std::to_string(x->data) + 
                       ". Node " + std::to_string(y->data) + " becomes new subtree root.",
                       {x->data, y->data}, {}, getState());

        y->left = x;
        x->right = T2;

        updateHeight(x);
        updateHeight(y);

        tracer.addStep("ROTATION_COMPLETE", 77,
                       "Left rotation finished. Recalculated heights: Node " + std::to_string(x->data) + 
                       " height = " + std::to_string(x->height) + ", Node " + std::to_string(y->data) + 
                       " height = " + std::to_string(y->height) + ".",
                       {y->data}, {}, getState());

        return y;
    }

    AVLNode* insertRec(AVLNode* node, int val) {
        if (!node) {
            return new AVLNode(val, nextId++);
        }

        tracer.addStep("COMPARE", 92,
                       "Comparing " + std::to_string(val) + " with current node " + std::to_string(node->data),
                       {node->data}, {val, node->data}, getState());

        if (val < node->data) {
            if (!node->left) {
                node->left = new AVLNode(val, nextId++);
                tracer.addStep("INSERT_NODE", 87,
                               "Inserted new node " + std::to_string(val) + " (Height = 1, BF = 0) as left child of " + std::to_string(node->data) + ".",
                               {val}, {}, getState());
            } else {
                node->left = insertRec(node->left, val);
            }
        } else if (val > node->data) {
            if (!node->right) {
                node->right = new AVLNode(val, nextId++);
                tracer.addStep("INSERT_NODE", 87,
                               "Inserted new node " + std::to_string(val) + " (Height = 1, BF = 0) as right child of " + std::to_string(node->data) + ".",
                               {val}, {}, getState());
            } else {
                node->right = insertRec(node->right, val);
            }
        } else {
            tracer.addStep("DUPLICATE_KEY", 100,
                           "Key " + std::to_string(val) + " already exists. Duplicates not permitted in AVL Tree.",
                           {node->data}, {val}, getState());
            return node;
        }

        updateHeight(node);
        int balance = getBalanceFactor(node);

        tracer.addStep("CALCULATE_BF", 108,
                       "Node " + std::to_string(node->data) + " updated: Height = " + std::to_string(node->height) + 
                       ", Balance Factor BF = h(L) - h(R) = " + std::to_string(getHeight(node->left)) + " - " + 
                       std::to_string(getHeight(node->right)) + " = " + std::to_string(balance) + ".",
                       {node->data}, {}, getState());

        // LL Case: Left Left Imbalance (balance > 1 and key < node->left->data)
        if (balance > 1 && val < node->left->data) {
            tracer.addStep("DETECT_IMBALANCE", 116,
                           "Imbalance detected at node " + std::to_string(node->data) + " (BF = " + std::to_string(balance) + 
                           "). Left-Left (LL) condition: requires Single Right Rotation.",
                           {node->data, node->left->data}, {}, getState());
            return rightRotate(node);
        }

        // RR Case: Right Right Imbalance (balance < -1 and key > node->right->data)
        if (balance < -1 && val > node->right->data) {
            tracer.addStep("DETECT_IMBALANCE", 124,
                           "Imbalance detected at node " + std::to_string(node->data) + " (BF = " + std::to_string(balance) + 
                           "). Right-Right (RR) condition: requires Single Left Rotation.",
                           {node->data, node->right->data}, {}, getState());
            return leftRotate(node);
        }

        // LR Case: Left Right Imbalance (balance > 1 and key > node->left->data)
        if (balance > 1 && val > node->left->data) {
            tracer.addStep("DETECT_IMBALANCE", 132,
                           "Imbalance detected at node " + std::to_string(node->data) + " (BF = " + std::to_string(balance) + 
                           "). Left-Right (LR) condition: requires Double Rotation (Left on " + 
                           std::to_string(node->left->data) + ", then Right on " + std::to_string(node->data) + ").",
                           {node->data, node->left->data}, {}, getState());
            node->left = leftRotate(node->left);
            return rightRotate(node);
        }

        // RL Case: Right Left Imbalance (balance < -1 and key < node->right->data)
        if (balance < -1 && val < node->right->data) {
            tracer.addStep("DETECT_IMBALANCE", 142,
                           "Imbalance detected at node " + std::to_string(node->data) + " (BF = " + std::to_string(balance) + 
                           "). Right-Left (RL) condition: requires Double Rotation (Right on " + 
                           std::to_string(node->right->data) + ", then Left on " + std::to_string(node->data) + ").",
                           {node->data, node->right->data}, {}, getState());
            node->right = rightRotate(node->right);
            return leftRotate(node);
        }

        return node;
    }

    void destroyRec(AVLNode* node) {
        if (!node) return;
        destroyRec(node->left);
        destroyRec(node->right);
        delete node;
    }

public:
    AVLTree(Tracer& t) : root(nullptr), tracer(t), nextId(1) {}

    ~AVLTree() {
        destroyRec(root);
    }

    void insert(int val) {
        if (!root) {
            root = new AVLNode(val, nextId++);
            tracer.addStep("INSERT_NODE", 87,
                           "Inserted new node " + std::to_string(val) + " as AVL root (Height = 1, BF = 0).",
                           {val}, {}, getState());
        } else {
            root = insertRec(root, val);
            tracer.addStep("INSERT_COMPLETE", 160,
                           "Completed insertion of key " + std::to_string(val) + " into AVL Tree.",
                           {val}, {}, getState());
        }
    }
};

#endif // AVL_HPP
