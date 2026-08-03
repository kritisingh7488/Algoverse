#include <iostream>
#include <vector>
#include <string>
#include <chrono>
#include <sstream>

using namespace std;
using namespace std::chrono;

struct Event {
    int i = 0;
    int j = 0;
    vector<int> matches;
    vector<int> lps;
    int line = 0;
    string desc;
};

struct StringResult {
    string algorithm;
    vector<Event> events;
    int comparisons = 0;
    double runtimeMs = 0.0;
};

// Helper for arrays in JSON
string arrayToJSON(const vector<int>& arr) {
    if (arr.empty()) return "[]";
    stringstream ss;
    ss << "[";
    for (size_t i = 0; i < arr.size(); ++i) {
        ss << arr[i] << (i == arr.size() - 1 ? "" : ", ");
    }
    ss << "]";
    return ss.str();
}

string toJSON(const StringResult& res) {
    stringstream ss;
    ss << "{\n";
    ss << "  \"success\": true,\n";
    ss << "  \"algorithm\": \"" << res.algorithm << "\",\n";
    ss << "  \"data\": {\n";
    ss << "    \"statistics\": {\n";
    ss << "      \"comparisons\": " << res.comparisons << ",\n";
    ss << "      \"time_ms\": " << res.runtimeMs << "\n";
    ss << "    },\n";
    ss << "    \"events\": [\n";
    
    for (size_t k = 0; k < res.events.size(); ++k) {
        const auto& ev = res.events[k];
        ss << "      {\n";
        ss << "        \"i\": " << ev.i << ",\n";
        ss << "        \"j\": " << ev.j << ",\n";
        ss << "        \"matches\": " << arrayToJSON(ev.matches) << ",\n";
        ss << "        \"lps\": " << arrayToJSON(ev.lps) << ",\n";
        ss << "        \"line\": " << ev.line << ",\n";
        
        // Escape quotes in desc
        string cleanDesc = ev.desc;
        size_t pos = 0;
        while ((pos = cleanDesc.find("\"", pos)) != string::npos) {
            cleanDesc.replace(pos, 1, "\\\"");
            pos += 2;
        }
        
        ss << "        \"desc\": \"" << cleanDesc << "\"\n";
        ss << "      }" << (k == res.events.size() - 1 ? "" : ",") << "\n";
    }
    
    ss << "    ]\n";
    ss << "  }\n";
    ss << "}\n";
    return ss.str();
}

StringResult generate_naive(const string& text, const string& pattern) {
    StringResult result;
    result.algorithm = "naive";
    
    int n = text.length();
    int m = pattern.length();
    vector<int> matches;
    int comparisons = 0;
    
    for (int i = 0; i <= n - m; i++) {
        int j = 0;
        while (j < m) {
            comparisons++;
            Event event;
            event.i = i; 
            event.j = j; 
            event.matches = matches;
            event.lps = vector<int>();
            event.line = 2;
            event.desc = string("Comparing text[") + to_string(i + j) + "] ('" + text[i + j] + "') with pattern[" + to_string(j) + "] ('" + pattern[j] + "')";
            result.events.push_back(event);
            
            if (text[i + j] != pattern[j]) {
                break;
            }
            j++;
        }
        
        if (j == m) {
            matches.push_back(i);
            Event match_event;
            match_event.i = i;
            match_event.j = j;
            match_event.matches = matches;
            match_event.lps = vector<int>();
            match_event.line = 3; 
            match_event.desc = string("Full Pattern match found at index ") + to_string(i) + "!";
            result.events.push_back(match_event);
        }
    }
    
    Event final_event;
    final_event.i = n;
    final_event.j = 0;
    final_event.matches = matches;
    final_event.lps = vector<int>();
    final_event.line = 0;
    final_event.desc = string("Naive Search completed. Matches found: ") + to_string(matches.size());
    result.events.push_back(final_event);
    
    result.comparisons = comparisons;
    return result;
}

StringResult generate_kmp(const string& text, const string& pattern) {
    StringResult result;
    result.algorithm = "kmp";
    
    int n = text.length();
    int m = pattern.length();
    vector<int> matches;
    vector<int> lps(m, 0);
    int comparisons = 0;
    
    // Compute LPS
    int len = 0;
    int p = 1;
    while (p < m) {
        if (pattern[p] == pattern[len]) {
            len++;
            lps[p] = len;
            p++;
        } else {
            if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[p] = 0;
                p++;
            }
        }
    }
    
    Event lps_event;
    lps_event.i = 0;
    lps_event.j = 0;
    lps_event.matches = matches;
    lps_event.lps = lps;
    lps_event.line = 0;
    lps_event.desc = "Computed LPS Table for pattern.";
    result.events.push_back(lps_event);
    
    int i = 0;
    int j = 0;
    
    while (i < n) {
        comparisons++;
        Event event;
        event.i = i;
        event.j = j;
        event.matches = matches;
        event.lps = lps;
        event.line = 2;
        event.desc = string("Comparing text[") + to_string(i) + "] ('" + text[i] + "') with pattern[" + to_string(j) + "] ('" + pattern[j] + "')";
        result.events.push_back(event);
        
        if (pattern[j] == text[i]) {
            i++;
            j++;
        }
        
        if (j == m) {
            matches.push_back(i - j);
            Event match_event;
            match_event.i = i;
            match_event.j = lps[j - 1];
            match_event.matches = matches;
            match_event.lps = lps;
            match_event.line = 3; 
            match_event.desc = string("Full Pattern match found at index ") + to_string(i - j) + "! Fallback j = lps[" + to_string(j - 1) + "]";
            result.events.push_back(match_event);
            j = lps[j - 1];
        } else if (i < n && pattern[j] != text[i]) {
            if (j != 0) {
                int oldJ = j;
                j = lps[j - 1];
                Event fallback_event;
                fallback_event.i = i;
                fallback_event.j = j;
                fallback_event.matches = matches;
                fallback_event.lps = lps;
                fallback_event.line = 5;
                fallback_event.desc = string("Mismatch! Fallback pattern index j from ") + to_string(oldJ) + " to lps[" + to_string(oldJ - 1) + "] = " + to_string(j);
                result.events.push_back(fallback_event);
            } else {
                i++;
                Event adv_event;
                adv_event.i = i;
                adv_event.j = 0;
                adv_event.matches = matches;
                adv_event.lps = lps;
                adv_event.line = 6;
                adv_event.desc = string("Mismatch at j=0. Advancing text index i to ") + to_string(i);
                result.events.push_back(adv_event);
            }
        }
    }
    
    Event final_event;
    final_event.i = n;
    final_event.j = 0;
    final_event.matches = matches;
    final_event.lps = lps;
    final_event.line = 0;
    final_event.desc = string("KMP Search completed. Matches found: ") + to_string(matches.size());
    result.events.push_back(final_event);
    
    result.comparisons = comparisons;
    return result;
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cout << R"({"success": false, "message": "Algorithm not provided."})" << endl;
        return 1;
    }
    
    string algorithm = argv[1];
    string text, pattern;
    
    if (!getline(cin, text) || !getline(cin, pattern)) {
        cout << R"({"success": false, "message": "Failed to read text and pattern."})" << endl;
        return 1;
    }
    
    // Trim potential trailing \r from getline
    if(!text.empty() && text.back() == '\r') text.pop_back();
    if(!pattern.empty() && pattern.back() == '\r') pattern.pop_back();
    
    StringResult result;
    auto start = high_resolution_clock::now();
    
    if (algorithm == "naive") {
        result = generate_naive(text, pattern);
    } else if (algorithm == "kmp") {
        result = generate_kmp(text, pattern);
    } else {
        cout << R"({"success": false, "message": "Unknown string algorithm."})" << endl;
        return 1;
    }
    
    auto end = high_resolution_clock::now();
    result.runtimeMs = duration<double, std::milli>(end - start).count();
    
    cout << toJSON(result) << endl;
    return 0;
}
