#ifndef TRIE_HPP
#define TRIE_HPP

#include <iostream>
#include <string>
#include <map>
#include <sstream>
#include "tracer.hpp"

class TrieNode {
public:
    char ch;
    bool isEndOfWord;
    int id;
    std::map<char, TrieNode*> children;

    TrieNode(char character, int nodeId) 
        : ch(character), isEndOfWord(false), id(nodeId) {}
};

class Trie {
private:
    TrieNode* root;
    Tracer& tracer;
    int nextId;

    std::string serializeNode(TrieNode* node) const {
        if (!node) return "null";
        std::ostringstream oss;
        oss << "{\"id\": " << node->id << ", ";
        oss << "\"char\": \"" << (node->ch == '^' ? "ROOT" : std::string(1, node->ch)) << "\", ";
        oss << "\"isEnd\": " << (node->isEndOfWord ? "true" : "false") << ", ";
        oss << "\"children\": [";
        size_t idx = 0;
        for (const auto& pair : node->children) {
            oss << serializeNode(pair.second);
            if (idx + 1 < node->children.size()) oss << ", ";
            idx++;
        }
        oss << "]}";
        return oss.str();
    }

    std::string getState() const {
        std::ostringstream oss;
        oss << "{\"type\": \"trie\", \"root\": " << serializeNode(root) << "}";
        return oss.str();
    }

public:
    Trie(Tracer& t) : tracer(t), nextId(1) {
        root = new TrieNode('^', 0);
    }

    void insert(const std::string& word) {
        TrieNode* curr = root;
        tracer.addStep("TRIE_START_INSERT", 49,
                       "Starting insertion of word: \"" + word + "\" into Trie.",
                       {}, {}, getState());

        for (size_t i = 0; i < word.length(); ++i) {
            char c = word[i];
            if (curr->children.find(c) == curr->children.end()) {
                TrieNode* newNode = new TrieNode(c, nextId++);
                curr->children[c] = newNode;
                tracer.addStep("TRIE_CREATE_NODE", 57,
                               "Character '" + std::string(1, c) + "' not found. Created new branch node.",
                               {newNode->id}, {}, getState());
            } else {
                tracer.addStep("TRIE_MATCH_CHAR", 61,
                               "Character '" + std::string(1, c) + "' already exists. Advancing along existing prefix path.",
                               {curr->children[c]->id}, {}, getState());
            }
            curr = curr->children[c];
        }

        curr->isEndOfWord = true;
        tracer.addStep("TRIE_MARK_END", 69,
                       "Marked node '" + std::string(1, curr->ch) + "' as End-of-Word (terminating \"" + word + "\").",
                       {curr->id}, {}, getState());
    }

    bool search(const std::string& word) {
        TrieNode* curr = root;
        tracer.addStep("TRIE_SEARCH_START", 76,
                       "Searching for word: \"" + word + "\" in Trie.",
                       {}, {}, getState());

        for (size_t i = 0; i < word.length(); ++i) {
            char c = word[i];
            if (curr->children.find(c) == curr->children.end()) {
                tracer.addStep("TRIE_SEARCH_FAIL", 83,
                               "Character '" + std::string(1, c) + "' missing. Word \"" + word + "\" not found.",
                               {}, {}, getState());
                return false;
            }
            curr = curr->children[c];
            tracer.addStep("TRIE_SEARCH_STEP", 89,
                           "Matched character '" + std::string(1, c) + "'.",
                           {curr->id}, {}, getState());
        }

        bool found = curr->isEndOfWord;
        if (found) {
            tracer.addStep("TRIE_SEARCH_SUCCESS", 96,
                           "Word \"" + word + "\" found successfully in Trie!",
                           {curr->id}, {}, getState());
        } else {
            tracer.addStep("TRIE_PREFIX_ONLY", 100,
                           "Prefix \"" + word + "\" exists, but not flagged as an independent word.",
                           {curr->id}, {}, getState());
        }
        return found;
    }
};

#endif // TRIE_HPP
