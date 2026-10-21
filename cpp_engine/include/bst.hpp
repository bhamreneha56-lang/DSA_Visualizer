#ifndef BST_HPP
#define BST_HPP

#include <iostream>
#include <string>
#include <vector>
#include <sstream>
#include "tracer.hpp"

class BSTNode {
public:
    int data;
    int id;
    BSTNode* left;
    BSTNode* right;

    BSTNode(int val, int nodeId) : data(val), id(nodeId), left(nullptr), right(nullptr) {}
};

class BST {
private:
    BSTNode* root;
    Tracer& tracer;
    int nextId;

    std::string serializeNode(BSTNode* node) const {
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

    BSTNode* insertRec(BSTNode* node, int val) {
        if (!node) {
            return new BSTNode(val, nextId++);
        }

        tracer.addStep("COMPARE", 46,
                       "Comparing input value " + std::to_string(val) + " with current node " + std::to_string(node->data) + ".",
                       {node->data}, {val, node->data}, getState());

        if (val < node->data) {
            tracer.addStep("TRAVERSE", 49,
                           "Since " + std::to_string(val) + " < " + std::to_string(node->data) + ", traverse to left child.",
                           {node->data}, {val, node->data}, getState());
            if (!node->left) {
                node->left = new BSTNode(val, nextId++);
                tracer.addStep("INSERT_NODE", 42,
                               "Created new node with value " + std::to_string(val) + " and linked to parent " + std::to_string(node->data) + " (left child).",
                               {val}, {}, getState());
            } else {
                node->left = insertRec(node->left, val);
            }
        } else if (val > node->data) {
            tracer.addStep("TRAVERSE", 53,
                           "Since " + std::to_string(val) + " > " + std::to_string(node->data) + ", traverse to right child.",
                           {node->data}, {val, node->data}, getState());
            if (!node->right) {
                node->right = new BSTNode(val, nextId++);
                tracer.addStep("INSERT_NODE", 42,
                               "Created new node with value " + std::to_string(val) + " and linked to parent " + std::to_string(node->data) + " (right child).",
                               {val}, {}, getState());
            } else {
                node->right = insertRec(node->right, val);
            }
        } else {
            tracer.addStep("DUPLICATE_IGNORED", 57,
                           "Value " + std::to_string(val) + " already exists in BST. Duplicates not inserted.",
                           {node->data}, {val, node->data}, getState());
        }
        return node;
    }

    BSTNode* insertSilentRec(BSTNode* node, int val) {
        if (!node) return new BSTNode(val, nextId++);
        if (val < node->data) node->left = insertSilentRec(node->left, val);
        else if (val > node->data) node->right = insertSilentRec(node->right, val);
        return node;
    }

    BSTNode* findMin(BSTNode* node) {
        BSTNode* curr = node;
        while (curr && curr->left != nullptr) {
            tracer.addStep("FIND_MIN", 68,
                           "Traversing left to locate smallest element in right subtree: " + std::to_string(curr->left->data),
                           {curr->left->data}, {}, getState());
            curr = curr->left;
        }
        return curr;
    }

    BSTNode* deleteRec(BSTNode* node, int val) {
        if (!node) {
            tracer.addStep("NOT_FOUND", 76,
                           "Value " + std::to_string(val) + " not found in BST.",
                           {}, {val}, getState());
            return nullptr;
        }

        tracer.addStep("COMPARE", 81,
                       "Comparing deletion key " + std::to_string(val) + " with node " + std::to_string(node->data),
                       {node->data}, {val, node->data}, getState());

        if (val < node->data) {
            node->left = deleteRec(node->left, val);
        } else if (val > node->data) {
            node->right = deleteRec(node->right, val);
        } else {
            // Found node to delete
            tracer.addStep("FOUND_TARGET", 88,
                           "Found node " + std::to_string(val) + " for deletion. Checking child cases.",
                           {node->data}, {}, getState());

            // Case 1: Leaf node (no children)
            if (!node->left && !node->right) {
                tracer.addStep("DELETE_LEAF", 93,
                               "Node " + std::to_string(val) + " is a leaf node. Deleting directly.",
                               {node->data}, {}, getState());
                delete node;
                return nullptr;
            }
            // Case 2: One child (right only)
            else if (!node->left) {
                tracer.addStep("DELETE_ONE_CHILD", 100,
                               "Node " + std::to_string(val) + " has only right child " + std::to_string(node->right->data) + ". Replacing with right child.",
                               {node->right->data}, {}, getState());
                BSTNode* temp = node->right;
                delete node;
                return temp;
            }
            // Case 2: One child (left only)
            else if (!node->right) {
                tracer.addStep("DELETE_ONE_CHILD", 108,
                               "Node " + std::to_string(val) + " has only left child " + std::to_string(node->left->data) + ". Replacing with left child.",
                               {node->left->data}, {}, getState());
                BSTNode* temp = node->left;
                delete node;
                return temp;
            }
            // Case 3: Two children
            else {
                tracer.addStep("DELETE_TWO_CHILDREN", 116,
                               "Node " + std::to_string(val) + " has two children. Finding inorder successor (minimum of right subtree).",
                               {node->data}, {}, getState());
                BSTNode* successor = findMin(node->right);
                tracer.addStep("SWAP_SUCCESSOR", 120,
                               "Inorder successor is " + std::to_string(successor->data) + ". Copying value and deleting successor node.",
                               {node->data, successor->data}, {}, getState());
                node->data = successor->data;
                node->right = deleteRec(node->right, successor->data);
            }
        }
        return node;
    }

    void inorderRec(BSTNode* node, std::vector<int>& path) {
        if (!node) return;
        inorderRec(node->left, path);
        path.push_back(node->data);
        tracer.addStep("VISIT_INORDER", 132,
                       "Visited node " + std::to_string(node->data) + " (Inorder: L-D-R). Current sequence: " + listToString(path),
                       {node->data}, {}, getState());
        inorderRec(node->right, path);
    }

    void preorderRec(BSTNode* node, std::vector<int>& path) {
        if (!node) return;
        path.push_back(node->data);
        tracer.addStep("VISIT_PREORDER", 140,
                       "Visited node " + std::to_string(node->data) + " (Preorder: D-L-R). Current sequence: " + listToString(path),
                       {node->data}, {}, getState());
        preorderRec(node->left, path);
        preorderRec(node->right, path);
    }

    void postorderRec(BSTNode* node, std::vector<int>& path) {
        if (!node) return;
        postorderRec(node->left, path);
        postorderRec(node->right, path);
        path.push_back(node->data);
        tracer.addStep("VISIT_POSTORDER", 148,
                       "Visited node " + std::to_string(node->data) + " (Postorder: L-R-D). Current sequence: " + listToString(path),
                       {node->data}, {}, getState());
    }

    static std::string listToString(const std::vector<int>& list) {
        std::ostringstream oss;
        oss << "[";
        for (size_t i = 0; i < list.size(); ++i) {
            oss << list[i] << (i + 1 < list.size() ? ", " : "");
        }
        oss << "]";
        return oss.str();
    }

    void destroyRec(BSTNode* node) {
        if (!node) return;
        destroyRec(node->left);
        destroyRec(node->right);
        delete node;
    }

public:
    BST(Tracer& t) : root(nullptr), tracer(t), nextId(1) {}

    ~BST() {
        destroyRec(root);
    }

    void insert(int val) {
        if (!root) {
            root = new BSTNode(val, nextId++);
            tracer.addStep("INSERT_NODE", 42,
                           "Created new node with value " + std::to_string(val) + " as BST root.",
                           {val}, {}, getState());
        } else {
            root = insertRec(root, val);
        }
    }

    void insertSilent(int val) {
        root = insertSilentRec(root, val);
    }

    void remove(int val) {
        root = deleteRec(root, val);
        tracer.addStep("DELETE_FINAL", 125,
                       "Deletion operation completed for key " + std::to_string(val) + ".",
                       {}, {}, getState());
    }

    bool search(int val) {
        BSTNode* curr = root;
        while (curr) {
            tracer.addStep("SEARCH_COMPARE", 182,
                           "Searching: Comparing key " + std::to_string(val) + " with node " + std::to_string(curr->data),
                           {curr->data}, {val, curr->data}, getState());
            if (val == curr->data) {
                tracer.addStep("SEARCH_FOUND", 186,
                               "Key " + std::to_string(val) + " successfully found!",
                               {curr->data}, {}, getState());
                return true;
            } else if (val < curr->data) {
                curr = curr->left;
            } else {
                curr = curr->right;
            }
        }
        tracer.addStep("SEARCH_NOT_FOUND", 195,
                       "Key " + std::to_string(val) + " not present in BST.",
                       {}, {val}, getState());
        return false;
    }

    void traverseInorder() {
        std::vector<int> path;
        inorderRec(root, path);
    }

    void traversePreorder() {
        std::vector<int> path;
        preorderRec(root, path);
    }

    void traversePostorder() {
        std::vector<int> path;
        postorderRec(root, path);
    }
};

#endif // BST_HPP
