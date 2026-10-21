#ifndef HEAP_HPP
#define HEAP_HPP

#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>
#include "tracer.hpp"

class Heap {
private:
    std::vector<int> arr;
    bool isMinHeap;
    Tracer& tracer;

    std::string getState(int heapSize = -1, int sortedBoundary = -1) const {
        if (heapSize == -1) heapSize = arr.size();
        std::ostringstream oss;
        oss << "{\"type\": \"heap\", ";
        oss << "\"isMin\": " << (isMinHeap ? "true" : "false") << ", ";
        oss << "\"heapSize\": " << heapSize << ", ";
        oss << "\"sortedBoundary\": " << sortedBoundary << ", ";
        oss << "\"array\": [";
        for (size_t i = 0; i < arr.size(); ++i) {
            oss << arr[i] << (i + 1 < arr.size() ? ", " : "");
        }
        oss << "]}";
        return oss.str();
    }

public:
    Heap(bool minHeap, Tracer& t) : isMinHeap(minHeap), tracer(t) {}

    void reheapUp(int idx) {
        int parent = (idx - 1) / 2;
        while (idx > 0) {
            tracer.addStep("COMPARE_PARENT", 35,
                           "Comparing child arr[" + std::to_string(idx) + "] = " + std::to_string(arr[idx]) + 
                           " with parent arr[" + std::to_string(parent) + "] = " + std::to_string(arr[parent]) + ".",
                           {arr[idx], arr[parent]}, {arr[idx], arr[parent]}, getState());

            bool needsSwap = isMinHeap ? (arr[idx] < arr[parent]) : (arr[idx] > arr[parent]);
            if (needsSwap) {
                tracer.addStep("REHEAP_UP_SWAP", 42,
                               "Violated heap property. Swapping arr[" + std::to_string(idx) + "] (" + 
                               std::to_string(arr[idx]) + ") with arr[" + std::to_string(parent) + "] (" + 
                               std::to_string(arr[parent]) + ").",
                               {arr[idx], arr[parent]}, {}, getState());

                std::swap(arr[idx], arr[parent]);
                idx = parent;
                parent = (idx - 1) / 2;
            } else {
                tracer.addStep("REHEAP_UP_SATISFIED", 51,
                               "Heap property satisfied for node " + std::to_string(arr[idx]) + ". ReheapUp complete.",
                               {arr[idx]}, {}, getState());
                break;
            }
        }
    }

    void reheapDown(int idx, int n) {
        int target = idx;
        int left = 2 * idx + 1;
        int right = 2 * idx + 2;

        if (isMinHeap) {
            if (left < n && arr[left] < arr[target]) target = left;
            if (right < n && arr[right] < arr[target]) target = right;
        } else {
            if (left < n && arr[left] > arr[target]) target = left;
            if (right < n && arr[right] > arr[target]) target = right;
        }

        if (target != idx) {
            tracer.addStep("REHEAP_DOWN_SWAP", 72,
                           "ReheapDown: Swapping parent arr[" + std::to_string(idx) + "] (" + 
                           std::to_string(arr[idx]) + ") with " + 
                           (target == left ? "left child" : "right child") + " arr[" + std::to_string(target) + 
                           "] (" + std::to_string(arr[target]) + ").",
                           {arr[idx], arr[target]}, {}, getState(n));

            std::swap(arr[idx], arr[target]);
            reheapDown(target, n);
        } else {
            tracer.addStep("REHEAP_DOWN_SATISFIED", 82,
                           "Subtree at index " + std::to_string(idx) + " satisfies heap property.",
                           {arr[idx]}, {}, getState(n));
        }
    }

    void insert(int val) {
        arr.push_back(val);
        int idx = arr.size() - 1;
        tracer.addStep("INSERT_ARRAY_END", 90,
                       "Appended key " + std::to_string(val) + " at end of array index " + std::to_string(idx) + 
                       ". Initiating ReheapUp.",
                       {val}, {}, getState());
        reheapUp(idx);
    }

    void buildHeap(const std::vector<int>& input) {
        arr = input;
        int n = arr.size();
        tracer.addStep("BUILD_HEAP_START", 99,
                       "Starting bottom-up heap construction for " + std::to_string(n) + " elements.",
                       {}, {}, getState(n));

        for (int i = n / 2 - 1; i >= 0; --i) {
            tracer.addStep("HEAPIFY_SUBTREE", 104,
                           "Heapifying internal subtree with root at index " + std::to_string(i) + 
                           " (value: " + std::to_string(arr[i]) + ").",
                           {arr[i]}, {}, getState(n));
            reheapDown(i, n);
        }
    }

    void heapSort(const std::vector<int>& input) {
        buildHeap(input);
        int n = arr.size();

        tracer.addStep("SORT_START", 115,
                       "Heap constructed successfully. Commencing Heap Sort phase by repeatedly extracting root.",
                       {}, {}, getState(n));

        for (int i = n - 1; i > 0; --i) {
            tracer.addStep("SORT_EXTRACT_ROOT", 120,
                           "Swapping current maximum root arr[0] (" + std::to_string(arr[0]) + 
                           ") to sorted position at index " + std::to_string(i) + " (" + std::to_string(arr[i]) + ").",
                           {arr[0], arr[i]}, {}, getState(i + 1, i));

            std::swap(arr[0], arr[i]);

            tracer.addStep("REHEAP_REDUCED", 127,
                           "Reduced heap boundary to index " + std::to_string(i - 1) + 
                           ". Running ReheapDown on new root arr[0] (" + std::to_string(arr[0]) + ").",
                           {arr[0]}, {}, getState(i, i));

            reheapDown(0, i);
        }

        tracer.addStep("SORT_COMPLETE", 135,
                       "Heap Sort complete! Array is now completely sorted in ascending order.",
                       {}, {}, getState(0, 0));
    }
};

#endif // HEAP_HPP
