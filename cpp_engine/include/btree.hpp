#ifndef BTREE_HPP
#define BTREE_HPP

#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include "tracer.hpp"

class BTreeNode {
public:
    std::vector<int> keys;
    std::vector<BTreeNode*> children;
    bool isLeaf;
    int id;

    BTreeNode(bool leaf, int nodeId) : isLeaf(leaf), id(nodeId) {}
};

class BTree {
private:
    BTreeNode* root;
    int t; // Minimum degree (each node can have at most 2*t - 1 keys)
    Tracer& tracer;
    int nextId;

    std::string serializeNode(BTreeNode* node) const {
        if (!node) return "null";
        std::ostringstream oss;
        oss << "{\"id\": " << node->id << ", ";
        oss << "\"isLeaf\": " << (node->isLeaf ? "true" : "false") << ", ";
        oss << "\"keys\": [";
        for (size_t i = 0; i < node->keys.size(); ++i) {
            oss << node->keys[i] << (i + 1 < node->keys.size() ? ", " : "");
        }
        oss << "], ";
        oss << "\"children\": [";
        for (size_t i = 0; i < node->children.size(); ++i) {
            oss << serializeNode(node->children[i]);
            if (i + 1 < node->children.size()) oss << ", ";
        }
        oss << "]}";
        return oss.str();
    }

    std::string getState() const {
        std::ostringstream oss;
        oss << "{\"type\": \"btree\", \"t\": " << t << ", \"root\": " << serializeNode(root) << "}";
        return oss.str();
    }

    void splitChild(BTreeNode* parent, int i, BTreeNode* child) {
        BTreeNode* z = new BTreeNode(child->isLeaf, nextId++);
        int medianKey = child->keys[t - 1];

        tracer.addStep("SPLIT_NODE", 48,
                       "Node capacity reached (2t-1 = " + std::to_string(2 * t - 1) + " keys). Splitting around median key " + 
                       std::to_string(medianKey) + ". Moving median up to parent.",
                       {medianKey}, {}, getState());

        // Copy right half of keys to z
        for (int j = t; j < 2 * t - 1; ++j) {
            z->keys.push_back(child->keys[j]);
        }

        // If not leaf, copy right half of children to z
        if (!child->isLeaf) {
            for (int j = t; j < 2 * t; ++j) {
                z->children.push_back(child->children[j]);
            }
            child->children.resize(t);
        }

        child->keys.resize(t - 1);

        parent->children.insert(parent->children.begin() + i + 1, z);
        parent->keys.insert(parent->keys.begin() + i, medianKey);

        tracer.addStep("SPLIT_COMPLETE", 71,
                       "Split complete. Parent now contains keys " + serializeKeys(parent->keys) + ".",
                       {medianKey}, {}, getState());
    }

    void insertNonFull(BTreeNode* node, int key) {
        int i = node->keys.size() - 1;

        if (node->isLeaf) {
            tracer.addStep("INSERT_LEAF", 79,
                           "Inserting key " + std::to_string(key) + " into sorted position in leaf node.",
                           {key}, {}, getState());

            node->keys.push_back(0);
            while (i >= 0 && node->keys[i] > key) {
                node->keys[i + 1] = node->keys[i];
                i--;
            }
            node->keys[i + 1] = key;

            tracer.addStep("INSERT_KEY_SUCCESS", 89,
                           "Leaf node updated: keys = " + serializeKeys(node->keys),
                           {key}, {}, getState());
        } else {
            while (i >= 0 && node->keys[i] > key) {
                i--;
            }
            i++;

            tracer.addStep("TRAVERSE_CHILD", 98,
                           "Key " + std::to_string(key) + " routes to child " + std::to_string(i) + ".",
                           {key}, {}, getState());

            if ((int)node->children[i]->keys.size() == 2 * t - 1) {
                splitChild(node, i, node->children[i]);
                if (key > node->keys[i]) {
                    i++;
                }
            }
            insertNonFull(node->children[i], key);
        }
    }

    static std::string serializeKeys(const std::vector<int>& keys) {
        std::ostringstream oss;
        oss << "[";
        for (size_t i = 0; i < keys.size(); ++i) {
            oss << keys[i] << (i + 1 < keys.size() ? ", " : "");
        }
        oss << "]";
        return oss.str();
    }

public:
    BTree(int degree, Tracer& tr) : root(nullptr), t(degree), tracer(tr), nextId(1) {}

    void insert(int key) {
        if (!root) {
            root = new BTreeNode(true, nextId++);
            root->keys.push_back(key);
            tracer.addStep("INIT_BTREE_ROOT", 129,
                           "Created B-Tree root node with key " + std::to_string(key) + ".",
                           {key}, {}, getState());
            return;
        }

        if ((int)root->keys.size() == 2 * t - 1) {
            BTreeNode* s = new BTreeNode(false, nextId++);
            s->children.push_back(root);
            tracer.addStep("ROOT_FULL_SPLIT", 138,
                           "Root node full! Increasing B-Tree height by creating new root and splitting child.",
                           {}, {}, getState());
            splitChild(s, 0, root);
            int i = 0;
            if (s->keys[0] < key) i++;
            insertNonFull(s->children[i], key);
            root = s;
        } else {
            insertNonFull(root, key);
        }
    }
};

#endif // BTREE_HPP
