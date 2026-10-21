#ifndef TRACER_HPP
#define TRACER_HPP

#include <string>
#include <vector>
#include <sstream>
#include <iostream>

struct StepTrace {
    int step;
    std::string action;
    int codeLine;
    std::string explanation;
    std::vector<int> activeNodes;
    std::vector<int> comparedKeys;
    std::string stateJson; // Nested JSON of current data structure state
};

class Tracer {
private:
    std::vector<StepTrace> traces;
    int currentStep;

    static std::string escapeJson(const std::string& s) {
        std::ostringstream o;
        for (char c : s) {
            switch (c) {
                case '"': o << "\\\""; break;
                case '\\': o << "\\\\"; break;
                case '\b': o << "\\b"; break;
                case '\f': o << "\\f"; break;
                case '\n': o << "\\n"; break;
                case '\r': o << "\\r"; break;
                case '\t': o << "\\t"; break;
                default:
                    if ('\x00' <= c && c <= '\x1f') {
                        o << "\\u00" << std::hex << (int)c;
                    } else {
                        o << c;
                    }
            }
        }
        return o.str();
    }

public:
    Tracer() : currentStep(0) {}

    void clear() {
        traces.clear();
        currentStep = 0;
    }

    void addStep(const std::string& action, int codeLine, const std::string& explanation,
                 const std::vector<int>& activeNodes, const std::vector<int>& comparedKeys,
                 const std::string& stateJson) {
        currentStep++;
        StepTrace t;
        t.step = currentStep;
        t.action = action;
        t.codeLine = codeLine;
        t.explanation = explanation;
        t.activeNodes = activeNodes;
        t.comparedKeys = comparedKeys;
        t.stateJson = stateJson.empty() ? "{}" : stateJson;
        traces.push_back(t);
    }

    std::string dumpJson() const {
        std::ostringstream oss;
        oss << "{\n  \"totalSteps\": " << traces.size() << ",\n  \"traces\": [\n";
        for (size_t i = 0; i < traces.size(); ++i) {
            const auto& t = traces[i];
            oss << "    {\n";
            oss << "      \"step\": " << t.step << ",\n";
            oss << "      \"action\": \"" << escapeJson(t.action) << "\",\n";
            oss << "      \"codeLine\": " << t.codeLine << ",\n";
            oss << "      \"explanation\": \"" << escapeJson(t.explanation) << "\",\n";
            
            oss << "      \"activeNodes\": [";
            for (size_t j = 0; j < t.activeNodes.size(); ++j) {
                oss << t.activeNodes[j] << (j + 1 < t.activeNodes.size() ? ", " : "");
            }
            oss << "],\n";

            oss << "      \"comparedKeys\": [";
            for (size_t j = 0; j < t.comparedKeys.size(); ++j) {
                oss << t.comparedKeys[j] << (j + 1 < t.comparedKeys.size() ? ", " : "");
            }
            oss << "],\n";

            oss << "      \"state\": " << t.stateJson << "\n";
            oss << "    }" << (i + 1 < traces.size() ? ",\n" : "\n");
        }
        oss << "  ]\n}\n";
        return oss.str();
    }
};

#endif // TRACER_HPP
