#include <iostream>
#include <vector>
#include <string>
#include <chrono>
#include <sstream>

using namespace std;
using namespace std::chrono;

struct Event {
    vector<int> table;
    int active = -1;
    int line = 0;
    int updates = 0;
    string desc;
};

struct DPResult {
    string algorithm;
    vector<Event> events;
    int updates = 0;
    double runtimeMs = 0.0;
};

// Helper for arrays in JSON
string arrayToJSON(const vector<int>& arr) {
    if (arr.empty()) return "[]";
    stringstream ss;
    ss << "[";
    for (size_t i = 0; i < arr.size(); ++i) {
        if (arr[i] == -1) ss << "null";
        else ss << arr[i];
        if (i != arr.size() - 1) ss << ", ";
    }
    ss << "]";
    return ss.str();
}

string toJSON(const DPResult& res) {
    stringstream ss;
    ss << "{\n";
    ss << "  \"success\": true,\n";
    ss << "  \"algorithm\": \"" << res.algorithm << "\",\n";
    ss << "  \"data\": {\n";
    ss << "    \"statistics\": {\n";
    ss << "      \"updates\": " << res.updates << ",\n";
    ss << "      \"time_ms\": " << res.runtimeMs << "\n";
    ss << "    },\n";
    ss << "    \"events\": [\n";
    
    for (size_t k = 0; k < res.events.size(); ++k) {
        const auto& ev = res.events[k];
        ss << "      {\n";
        ss << "        \"table\": " << arrayToJSON(ev.table) << ",\n";
        ss << "        \"active\": " << ev.active << ",\n";
        ss << "        \"line\": " << ev.line << ",\n";
        ss << "        \"updates\": " << ev.updates << ",\n";
        
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

DPResult generate_fib(int n) {
    DPResult result;
    result.algorithm = "fibonacci";
    
    vector<int> table(n + 1, -1); // -1 represents null
    table[0] = 0;
    table[1] = 1;
    int updates = 2;
    
    Event ev1;
    ev1.table = table; ev1.active = 0; ev1.line = 0; ev1.updates = 1;
    ev1.desc = "Base case initialized: dp[0] = 0";
    result.events.push_back(ev1);
    
    Event ev2;
    ev2.table = table; ev2.active = 1; ev2.line = 0; ev2.updates = 2;
    ev2.desc = "Base case initialized: dp[1] = 1";
    result.events.push_back(ev2);
    
    for (int i = 2; i <= n; i++) {
        table[i] = table[i - 1] + table[i - 2];
        updates++;
        
        Event ev;
        ev.table = table; ev.active = i; ev.line = 2; ev.updates = updates;
        ev.desc = string("Computing dp[") + to_string(i) + "] = dp[" + to_string(i-1) + "] (" + to_string(table[i-1]) + ") + dp[" + to_string(i-2) + "] (" + to_string(table[i-2]) + ") = " + to_string(table[i]);
        result.events.push_back(ev);
    }
    
    result.updates = updates;
    return result;
}

DPResult generate_climb(int n) {
    DPResult result;
    result.algorithm = "climbing_stairs";
    
    vector<int> table(n + 1, -1);
    table[1] = 1;
    if(n >= 2) table[2] = 2;
    int updates = (n >= 2) ? 2 : 1;
    
    Event ev1;
    ev1.table = table; ev1.active = 1; ev1.line = 0; ev1.updates = 1;
    ev1.desc = "Base case initialized: 1 way to reach step 1";
    result.events.push_back(ev1);
    
    if (n >= 2) {
        Event ev2;
        ev2.table = table; ev2.active = 2; ev2.line = 0; ev2.updates = 2;
        ev2.desc = "Base case initialized: 2 ways to reach step 2";
        result.events.push_back(ev2);
    }
    
    for (int i = 3; i <= n; i++) {
        table[i] = table[i - 1] + table[i - 2];
        updates++;
        
        Event ev;
        ev.table = table; ev.active = i; ev.line = 2; ev.updates = updates;
        ev.desc = string("Computing dp[") + to_string(i) + "] = dp[" + to_string(i-1) + "] (" + to_string(table[i-1]) + ") + dp[" + to_string(i-2) + "] (" + to_string(table[i-2]) + ") = " + to_string(table[i]);
        result.events.push_back(ev);
    }
    
    result.updates = updates;
    return result;
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cout << R"({"success": false, "message": "Algorithm not provided."})" << endl;
        return 1;
    }
    
    string algorithm = argv[1];
    
    int n = 5;
    string nStr;
    if (getline(cin, nStr)) {
        if(!nStr.empty() && nStr.back() == '\r') nStr.pop_back();
        try {
            if(!nStr.empty()) {
                n = stoi(nStr);
            }
        } catch(...) {
            // ignore
        }
    }
    
    DPResult result;
    auto start = high_resolution_clock::now();
    
    if (algorithm == "fibonacci") {
        result = generate_fib(n);
    } else if (algorithm == "climbing_stairs") {
        result = generate_climb(n);
    } else {
        cout << R"({"success": false, "message": "Unknown dp algorithm."})" << endl;
        return 1;
    }
    
    auto end = high_resolution_clock::now();
    result.runtimeMs = duration<double, std::milli>(end - start).count();
    
    cout << toJSON(result) << endl;
    return 0;
}
