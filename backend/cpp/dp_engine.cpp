#include <iostream>
#include <vector>
#include <string>
#include <chrono>
#include <sstream>
#include <cmath>
#include <algorithm>

using namespace std;
using namespace std::chrono;

struct Event {
    string type;          // "call", "return", "table_update", "variable_update", "memo_hit", "memo_store"
    vector<int> table;
    int active = -1;
    int line = 0;
    int val = 0;
    string desc;
    vector<int> stack;
    int prev2 = -1;
    int prev = -1;
    int curr = -1;
};

struct DPResult {
    string algorithm;
    string approach;
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
    ss << "  \"approach\": \"" << res.approach << "\",\n";
    ss << "  \"data\": {\n";
    ss << "    \"statistics\": {\n";
    ss << "      \"updates\": " << res.updates << ",\n";
    ss << "      \"time_ms\": " << res.runtimeMs << "\n";
    // Adding mock stats standard keys
    ss << "    },\n";
    ss << "    \"events\": [\n";
    
    for (size_t k = 0; k < res.events.size(); ++k) {
        const auto& ev = res.events[k];
        ss << "      {\n";
        ss << "        \"type\": \"" << ev.type << "\",\n";
        ss << "        \"table\": " << arrayToJSON(ev.table) << ",\n";
        ss << "        \"active\": " << ev.active << ",\n";
        ss << "        \"line\": " << ev.line << ",\n";
        ss << "        \"val\": " << ev.val << ",\n";
        ss << "        \"stack\": " << arrayToJSON(ev.stack) << ",\n";
        ss << "        \"vars\": {\"prev2\": " << ev.prev2 << ", \"prev\": " << ev.prev << ", \"curr\": " << ev.curr << "},\n";
        
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

// ----------------------------------------------------
// 1. FIBONACCI
// ----------------------------------------------------
DPResult run_fibonacci(int n, string approach) {
    DPResult res;
    res.algorithm = "fibonacci";
    res.approach = approach;
    vector<int> table(n + 1, -1);
    vector<int> callStack;

    if (approach == "recursive") {
        auto run_rec = [&](auto self, int i) -> int {
            callStack.push_back(i);
            Event ev1;
            ev1.type = "call"; ev1.active = i; ev1.line = 1; ev1.stack = callStack;
            ev1.desc = "solve(" + to_string(i) + ") called recursively.";
            res.events.push_back(ev1);

            if (i <= 1) {
                Event ev2;
                ev2.type = "base_case"; ev2.active = i; ev2.line = 2; ev2.val = i; ev2.stack = callStack;
                ev2.desc = "solve(" + to_string(i) + ") reached base case, returning " + to_string(i);
                res.events.push_back(ev2);
                callStack.pop_back();
                return i;
            }

            int val = self(self, i - 1) + self(self, i - 2);
            callStack.pop_back();

            Event ev3;
            ev3.type = "return"; ev3.active = i; ev3.line = 3; ev3.val = val; ev3.stack = callStack;
            ev3.desc = "solve(" + to_string(i) + ") returned " + to_string(val);
            res.events.push_back(ev3);
            return val;
        };
        run_rec(run_rec, n);
    } 
    else if (approach == "memoization") {
        auto run_memo = [&](auto self, int i) -> int {
            callStack.push_back(i);
            Event ev1;
            ev1.type = "memo_lookup"; ev1.active = i; ev1.line = 1; ev1.stack = callStack;
            ev1.desc = "Checking memo cache for index " + to_string(i);
            res.events.push_back(ev1);

            if (i <= 1) {
                table[i] = i;
                Event ev2;
                ev2.type = "base_case"; ev2.active = i; ev2.line = 2; ev2.val = i; ev2.table = table; ev2.stack = callStack;
                ev2.desc = "Base case solve(" + to_string(i) + ") set -> " + to_string(i);
                res.events.push_back(ev2);
                callStack.pop_back();
                return i;
            }

            if (table[i] != -1) {
                Event ev2;
                ev2.type = "memo_hit"; ev2.active = i; ev2.line = 3; ev2.val = table[i]; ev2.table = table; ev2.stack = callStack;
                ev2.desc = "Cache hit! solve(" + to_string(i) + ") already computed: " + to_string(table[i]);
                res.events.push_back(ev2);
                callStack.pop_back();
                return table[i];
            }

            int val = self(self, i - 1) + self(self, i - 2);
            table[i] = val;
            res.updates++;
            callStack.pop_back();

            Event ev3;
            ev3.type = "memo_store"; ev3.active = i; ev3.line = 4; ev3.val = val; ev3.table = table; ev3.stack = callStack;
            ev3.desc = "Storing computation in memo: memo[" + to_string(i) + "] = " + to_string(val);
            res.events.push_back(ev3);
            return val;
        };
        run_memo(run_memo, n);
    } 
    else if (approach == "tabulation") {
        table[0] = 0;
        res.updates = 1;
        
        Event ev1;
        ev1.type = "table_update"; ev1.active = 0; ev1.line = 1; ev1.val = 0; ev1.table = table;
        ev1.desc = "Initialized base case dp[0] = 0";
        res.events.push_back(ev1);

        if (n >= 1) {
            table[1] = 1;
            res.updates = 2;
            Event ev2;
            ev2.type = "table_update"; ev2.active = 1; ev2.line = 2; ev2.val = 1; ev2.table = table;
            ev2.desc = "Initialized base case dp[1] = 1";
            res.events.push_back(ev2);
        }

        for (int i = 2; i <= n; i++) {
            table[i] = table[i - 1] + table[i - 2];
            res.updates++;
            Event ev;
            ev.type = "table_update"; ev.active = i; ev.line = 4; ev.val = table[i]; ev.table = table;
            ev.desc = "Updating DP table: dp[" + to_string(i) + "] = dp[" + to_string(i-1) + "] + dp[" + to_string(i-2) + "] = " + to_string(table[i]);
            res.events.push_back(ev);
        }
    } 
    else if (approach == "space-optimized") {
        int prev2 = 0, prev = 1;
        Event ev1;
        ev1.type = "variable_update"; ev1.line = 1; ev1.prev2 = prev2; ev1.prev = prev; ev1.curr = 0;
        ev1.desc = "Initialized optimized state: prev2 = 0, prev = 1";
        res.events.push_back(ev1);

        for (int i = 2; i <= n; i++) {
            int curr = prev + prev2;
            prev2 = prev;
            prev = curr;
            res.updates++;
            Event ev;
            ev.type = "variable_update"; ev.line = 4; ev.prev2 = prev2; ev.prev = prev; ev.curr = curr;
            ev.desc = "Updated iteration i = " + to_string(i) + ": curr = " + to_string(curr);
            res.events.push_back(ev);
        }
    }

    int final_val = 0;
    if (approach == "space-optimized") {
        if (n == 0) final_val = 0;
        else if (n == 1) final_val = 1;
        else final_val = res.events.back().prev;
    } else {
        final_val = table[n];
    }

    Event ev_final;
    ev_final.type = "solution_complete";
    ev_final.val = final_val;
    ev_final.desc = "Calculation complete. Final Fibonacci value: " + to_string(final_val);
    res.events.push_back(ev_final);

    return res;
}

// ----------------------------------------------------
// 2. CLIMBING STAIRS
// ----------------------------------------------------
DPResult run_climbing_stairs(int n, string approach) {
    DPResult res;
    res.algorithm = "climbing-stairs";
    res.approach = approach;
    vector<int> table(n + 1, -1);
    vector<int> callStack;
    int updates = 0;

    if (approach == "recursive") {
        auto run_rec = [&](auto self, int i) -> int {
            callStack.push_back(i);
            Event ev1;
            ev1.type = "call"; ev1.active = i; ev1.line = 1; ev1.stack = callStack;
            ev1.desc = "climb(" + to_string(i) + ") called recursively.";
            res.events.push_back(ev1);

            if (i <= 1) {
                Event ev2;
                ev2.type = "base_case"; ev2.active = i; ev2.line = 2; ev2.val = 1; ev2.stack = callStack;
                ev2.desc = "climb(" + to_string(i) + ") reached base case -> 1 way";
                res.events.push_back(ev2);
                callStack.pop_back();
                return 1;
            }

            int val = self(self, i - 1) + self(self, i - 2);
            callStack.pop_back();

            Event ev3;
            ev3.type = "return"; ev3.active = i; ev3.line = 3; ev3.val = val; ev3.stack = callStack;
            ev3.desc = "climb(" + to_string(i) + ") returned " + to_string(val);
            res.events.push_back(ev3);
            return val;
        };
        run_rec(run_rec, n);
    }
    else if (approach == "memoization") {
        auto run_memo = [&](auto self, int i) -> int {
            callStack.push_back(i);
            Event ev1;
            ev1.type = "memo_lookup"; ev1.active = i; ev1.line = 1; ev1.stack = callStack;
            ev1.desc = "Checking cache for stair " + to_string(i);
            res.events.push_back(ev1);

            if (i <= 1) {
                table[i] = 1;
                Event ev2;
                ev2.type = "base_case"; ev2.active = i; ev2.line = 2; ev2.val = 1; ev2.table = table; ev2.stack = callStack;
                ev2.desc = "Base case: memo[" + to_string(i) + "] = 1";
                res.events.push_back(ev2);
                callStack.pop_back();
                return 1;
            }

            if (table[i] != -1) {
                Event ev2;
                ev2.type = "memo_hit"; ev2.active = i; ev2.line = 3; ev2.val = table[i]; ev2.table = table; ev2.stack = callStack;
                ev2.desc = "Cache hit! climb(" + to_string(i) + ") = " + to_string(table[i]);
                res.events.push_back(ev2);
                callStack.pop_back();
                return table[i];
            }

            int val = self(self, i - 1) + self(self, i - 2);
            table[i] = val;
            updates++;
            callStack.pop_back();

            Event ev3;
            ev3.type = "memo_store"; ev3.active = i; ev3.line = 4; ev3.val = val; ev3.table = table; ev3.stack = callStack;
            ev3.desc = "Storing memo[" + to_string(i) + "] = " + to_string(val);
            res.events.push_back(ev3);
            return val;
        };
        run_memo(run_memo, n);
    }
    else if (approach == "tabulation") {
        table[0] = 1;
        table[1] = 1;
        updates = 2;

        Event ev1;
        ev1.type = "table_update"; ev1.active = 0; ev1.line = 1; ev1.val = 1; ev1.table = table;
        ev1.desc = "Base case dp[0] = 1 way (start step)";
        res.events.push_back(ev1);

        Event ev2;
        ev2.type = "table_update"; ev2.active = 1; ev2.line = 2; ev2.val = 1; ev2.table = table;
        ev2.desc = "Base case dp[1] = 1 way to step 1";
        res.events.push_back(ev2);

        for (int i = 2; i <= n; i++) {
            table[i] = table[i - 1] + table[i - 2];
            updates++;
            Event ev;
            ev.type = "table_update"; ev.active = i; ev.line = 4; ev.val = table[i]; ev.table = table;
            ev.desc = "dp[" + to_string(i) + "] = dp[" + to_string(i-1) + "] + dp[" + to_string(i-2) + "] = " + to_string(table[i]);
            res.events.push_back(ev);
        }
    }
    else if (approach == "space-optimized") {
        int prev2 = 1, prev = 1;
        Event ev1;
        ev1.type = "variable_update"; ev1.line = 1; ev1.prev2 = prev2; ev1.prev = prev; ev1.curr = 0;
        ev1.desc = "Space optimized climb initialized: prev2 = 1, prev = 1";
        res.events.push_back(ev1);

        for (int i = 2; i <= n; i++) {
            int curr = prev + prev2;
            prev2 = prev;
            prev = curr;
            updates++;
            Event ev;
            ev.type = "variable_update"; ev.line = 4; ev.prev2 = prev2; ev.prev = prev; ev.curr = curr;
            ev.desc = "Step i = " + to_string(i) + " resolved: curr = " + to_string(curr);
            res.events.push_back(ev);
        }
    }

    int final_val = 0;
    if (approach == "space-optimized") {
        if (n == 0) final_val = 1;
        else if (n == 1) final_val = 1;
        else final_val = res.events.back().prev;
    } else {
        final_val = table[n];
    }

    Event ev_final;
    ev_final.type = "solution_complete";
    ev_final.val = final_val;
    ev_final.desc = "Calculation complete. Total ways to climb: " + to_string(final_val);
    res.events.push_back(ev_final);

    res.updates = updates;
    return res;
}

// ----------------------------------------------------
// 3. HOUSE ROBBER I
// ----------------------------------------------------
DPResult run_house_robber_i(const vector<int>& nums, string approach) {
    int n = nums.size();
    DPResult res;
    res.algorithm = "house-robber-i";
    res.approach = approach;
    vector<int> table(n, -1);
    vector<int> callStack;

    if (approach == "recursive") {
        auto run_rec = [&](auto self, int i) -> int {
            if (i < 0) return 0;
            callStack.push_back(i);
            Event ev1;
            ev1.type = "call"; ev1.active = i; ev1.line = 1; ev1.stack = callStack;
            ev1.desc = "rob(" + to_string(i) + ") checking houses.";
            res.events.push_back(ev1);

            int rob = nums[i] + self(self, i - 2);
            int skip = self(self, i - 1);
            int val = max(rob, skip);
            callStack.pop_back();

            Event ev2;
            ev2.type = "return"; ev2.active = i; ev2.line = 3; ev2.val = val; ev2.stack = callStack;
            ev2.desc = "rob(" + to_string(i) + ") decided max(rob: " + to_string(rob) + ", skip: " + to_string(skip) + ") -> " + to_string(val);
            res.events.push_back(ev2);
            return val;
        };
        run_rec(run_rec, n - 1);
    } 
    else if (approach == "memoization") {
        auto run_memo = [&](auto self, int i) -> int {
            if (i < 0) return 0;
            callStack.push_back(i);
            Event ev1;
            ev1.type = "memo_lookup"; ev1.active = i; ev1.line = 1; ev1.stack = callStack;
            ev1.desc = "Checking memo cache for index " + to_string(i);
            res.events.push_back(ev1);

            if (table[i] != -1) {
                Event ev2;
                ev2.type = "memo_hit"; ev2.active = i; ev2.line = 2; ev2.val = table[i]; ev2.table = table; ev2.stack = callStack;
                ev2.desc = "Cache hit for house " + to_string(i) + " -> " + to_string(table[i]);
                res.events.push_back(ev2);
                callStack.pop_back();
                return table[i];
            }

            int rob = nums[i] + self(self, i - 2);
            int skip = self(self, i - 1);
            int val = max(rob, skip);
            table[i] = val;
            res.updates++;
            callStack.pop_back();

            Event ev3;
            ev3.type = "memo_store"; ev3.active = i; ev3.line = 4; ev3.val = val; ev3.table = table; ev3.stack = callStack;
            ev3.desc = "Stored memo[" + to_string(i) + "] = " + to_string(val);
            res.events.push_back(ev3);
            return val;
        };
        run_memo(run_memo, n - 1);
    } 
    else if (approach == "tabulation") {
        if (n == 0) return res;
        table[0] = nums[0];
        res.updates = 1;
        Event ev1;
        ev1.type = "table_update"; ev1.active = 0; ev1.line = 1; ev1.val = table[0]; ev1.table = table;
        ev1.desc = "Base case: dp[0] = " + to_string(nums[0]) + " (rob first house)";
        res.events.push_back(ev1);

        if (n > 1) {
            table[1] = max(nums[0], nums[1]);
            res.updates++;
            Event ev2;
            ev2.type = "table_update"; ev2.active = 1; ev2.line = 2; ev2.val = table[1]; ev2.table = table;
            ev2.desc = "Base case: dp[1] = max(house 0, house 1) -> " + to_string(table[1]);
            res.events.push_back(ev2);
        }

        for (int i = 2; i < n; i++) {
            table[i] = max(table[i - 1], nums[i] + table[i - 2]);
            res.updates++;
            Event ev;
            ev.type = "table_update"; ev.active = i; ev.line = 4; ev.val = table[i]; ev.table = table;
            ev.desc = "House " + to_string(i) + ": max(skip: " + to_string(table[i-1]) + ", rob: " + to_string(nums[i] + table[i-2]) + ") = " + to_string(table[i]);
            res.events.push_back(ev);
        }
    } 
    else if (approach == "space-optimized") {
        if (n == 0) return res;
        int prev2 = 0, prev = nums[0];
        Event ev1;
        ev1.type = "variable_update"; ev1.line = 1; ev1.prev2 = prev2; ev1.prev = prev; ev1.curr = 0;
        ev1.desc = "Space optimized robber initialized: prev2 = 0, prev = " + to_string(prev);
        res.events.push_back(ev1);

        for (int i = 1; i < n; i++) {
            int curr = max(prev, nums[i] + prev2);
            prev2 = prev;
            prev = curr;
            res.updates++;
            Event ev;
            ev.type = "variable_update"; ev.line = 4; ev.prev2 = prev2; ev.prev = prev; ev.curr = curr;
            ev.desc = "Iteration i = " + to_string(i) + ": decided max value -> " + to_string(curr);
            res.events.push_back(ev);
        }
    }

    int final_val = 0;
    if (!res.events.empty()) {
        if (approach == "space-optimized") {
            final_val = res.events.back().prev;
        } else {
            final_val = res.events.back().val;
        }
    }
    Event ev_final;
    ev_final.type = "solution_complete";
    ev_final.val = final_val;
    ev_final.desc = "Calculation complete. Maximum money: " + to_string(final_val);
    res.events.push_back(ev_final);

    return res;
}

// ----------------------------------------------------
// 4. HOUSE ROBBER II
// ----------------------------------------------------
DPResult run_house_robber_ii(const vector<int>& nums, string approach) {
    DPResult res;
    res.algorithm = "house-robber-ii";
    res.approach = approach;
    int n = nums.size();
    if (n == 0) return res;
    if (n == 1) {
        Event ev;
        ev.type = "solution_complete"; ev.val = nums[0]; ev.desc = "Only 1 house available. Robbing it yields: " + to_string(nums[0]);
        res.events.push_back(ev);
        return res;
    }

    // Run House Robber I on 0 to n-2
    vector<int> range1(nums.begin(), nums.end() - 1);
    DPResult res1 = run_house_robber_i(range1, approach);
    
    // Run House Robber I on 1 to n-1
    vector<int> range2(nums.begin() + 1, nums.end());
    DPResult res2 = run_house_robber_i(range2, approach);

    // Merge events
    for (auto& ev : res1.events) {
        ev.desc = "[Subproblem 1: Excluding Last House] " + ev.desc;
        res.events.push_back(ev);
    }
    for (auto& ev : res2.events) {
        ev.desc = "[Subproblem 2: Excluding First House] " + ev.desc;
        res.events.push_back(ev);
    }

    int finalAns = max(res1.events.empty() ? 0 : res1.events.back().val, res2.events.empty() ? 0 : res2.events.back().val);
    Event evFinal;
    evFinal.type = "solution_complete";
    evFinal.val = finalAns;
    evFinal.desc = "House Robber II Circular decision complete. max(Subproblem 1, Subproblem 2) = " + to_string(finalAns);
    res.events.push_back(evFinal);

    res.updates = res1.updates + res2.updates;
    return res;
}

// ----------------------------------------------------
// 5. DECODE WAYS
// ----------------------------------------------------
DPResult run_decode_ways(string s, string approach) {
    DPResult res;
    res.algorithm = "decode-ways";
    res.approach = approach;
    int n = s.size();
    if (n == 0) return res;
    vector<int> table(n + 1, -1);
    vector<int> callStack;

    if (approach == "recursive") {
        auto run_rec = [&](auto self, int i) -> int {
            callStack.push_back(i);
            Event ev1;
            ev1.type = "call"; ev1.active = i; ev1.line = 1; ev1.stack = callStack;
            ev1.desc = "decode(" + to_string(i) + ") evaluating ways.";
            res.events.push_back(ev1);

            if (i >= n) {
                callStack.pop_back();
                return 1;
            }
            if (s[i] == '0') {
                callStack.pop_back();
                return 0;
            }

            int ways = self(self, i + 1);
            if (i + 1 < n) {
                int val = (s[i] - '0') * 10 + (s[i+1] - '0');
                if (val >= 10 && val <= 26) {
                    ways += self(self, i + 2);
                }
            }
            callStack.pop_back();

            Event ev2;
            ev2.type = "return"; ev2.active = i; ev2.line = 3; ev2.val = ways; ev2.stack = callStack;
            ev2.desc = "decode(" + to_string(i) + ") calculated total ways -> " + to_string(ways);
            res.events.push_back(ev2);
            return ways;
        };
        run_rec(run_rec, 0);
    } 
    else if (approach == "memoization") {
        auto run_memo = [&](auto self, int i) -> int {
            callStack.push_back(i);
            Event ev1;
            ev1.type = "memo_lookup"; ev1.active = i; ev1.line = 1; ev1.stack = callStack;
            ev1.desc = "Checking memo lookup for index " + to_string(i);
            res.events.push_back(ev1);

            if (i >= n) {
                table[i] = 1;
                callStack.pop_back();
                return 1;
            }
            if (table[i] != -1) {
                Event ev2;
                ev2.type = "memo_hit"; ev2.active = i; ev2.line = 2; ev2.val = table[i]; ev2.stack = callStack;
                ev2.desc = "Cache hit! memo[" + to_string(i) + "] = " + to_string(table[i]);
                res.events.push_back(ev2);
                callStack.pop_back();
                return table[i];
            }
            if (s[i] == '0') {
                table[i] = 0;
                callStack.pop_back();
                return 0;
            }

            int ways = self(self, i + 1);
            if (i + 1 < n) {
                int val = (s[i] - '0') * 10 + (s[i+1] - '0');
                if (val >= 10 && val <= 26) {
                    ways += self(self, i + 2);
                }
            }
            table[i] = ways;
            res.updates++;
            callStack.pop_back();

            Event ev3;
            ev3.type = "memo_store"; ev3.active = i; ev3.line = 4; ev3.val = ways; ev3.table = table; ev3.stack = callStack;
            ev3.desc = "Stored memo[" + to_string(i) + "] = " + to_string(ways);
            res.events.push_back(ev3);
            return ways;
        };
        run_memo(run_memo, 0);
    } 
    else if (approach == "tabulation") {
        table[n] = 1;
        res.updates = 1;
        Event ev1;
        ev1.type = "table_update"; ev1.active = n; ev1.line = 1; ev1.val = 1; ev1.table = table;
        ev1.desc = "Base case dp[n] = 1 initialized.";
        res.events.push_back(ev1);

        for (int i = n - 1; i >= 0; i--) {
            if (s[i] == '0') {
                table[i] = 0;
            } else {
                table[i] = table[i + 1];
                if (i + 1 < n) {
                    int val = (s[i] - '0') * 10 + (s[i+1] - '0');
                    if (val >= 10 && val <= 26) {
                        table[i] += table[i + 2];
                    }
                }
            }
            res.updates++;
            Event ev;
            ev.type = "table_update"; ev.active = i; ev.line = 4; ev.val = table[i]; ev.table = table;
            ev.desc = "dp[" + to_string(i) + "] calculated as " + to_string(table[i]) + " decoding options.";
            res.events.push_back(ev);
        }
    } 
    else if (approach == "space-optimized") {
        int next2 = 1, next1 = (s[n-1] == '0' ? 0 : 1);
        Event ev1;
        ev1.type = "variable_update"; ev1.line = 1; ev1.prev2 = next2; ev1.prev = next1; ev1.curr = 0;
        ev1.desc = "Space optimized variables initialized: next2 = 1, next1 = " + to_string(next1);
        res.events.push_back(ev1);

        for (int i = n - 2; i >= 0; i--) {
            int curr = 0;
            if (s[i] != '0') {
                curr = next1;
                int val = (s[i] - '0') * 10 + (s[i+1] - '0');
                if (val >= 10 && val <= 26) {
                    curr += next2;
                }
            }
            next2 = next1;
            next1 = curr;
            res.updates++;
            Event ev;
            ev.type = "variable_update"; ev.line = 4; ev.prev2 = next2; ev.prev = next1; ev.curr = curr;
            ev.desc = "Decoding step for index " + to_string(i) + " yields ways: " + to_string(curr);
            res.events.push_back(ev);
        }
    }

    int final_val = 0;
    if (!res.events.empty()) {
        if (approach == "space-optimized") {
            final_val = res.events.back().prev;
        } else {
            final_val = res.events.back().val;
        }
    }
    Event ev_final;
    ev_final.type = "solution_complete";
    ev_final.val = final_val;
    ev_final.desc = "Calculation complete. Total decode ways: " + to_string(final_val);
    res.events.push_back(ev_final);

    return res;
}

// ----------------------------------------------------
// 6. COIN CHANGE & 7. MINIMUM COINS
// ----------------------------------------------------
DPResult run_coin_change(const vector<int>& coins, int amount, string approach, bool findMin) {
    DPResult res;
    res.algorithm = findMin ? "minimum-coins" : "coin-change";
    res.approach = approach;
    vector<int> table(amount + 1, findMin ? 1e9 : 0);
    vector<int> callStack;

    if (approach == "recursive") {
        auto run_rec = [&](auto self, int rem) -> int {
            if (rem == 0) return findMin ? 0 : 1;
            if (rem < 0) return findMin ? 1e9 : 0;
            callStack.push_back(rem);
            Event ev1;
            ev1.type = "call"; ev1.active = rem; ev1.line = 1; ev1.stack = callStack;
            ev1.desc = "Solving subproblem for remainder amount " + to_string(rem);
            res.events.push_back(ev1);

            int val = findMin ? 1e9 : 0;
            for (int coin : coins) {
                int sub = self(self, rem - coin);
                if (findMin) {
                    if (sub != 1e9) val = min(val, 1 + sub);
                } else {
                    val += sub;
                }
            }
            callStack.pop_back();

            Event ev2;
            ev2.type = "return"; ev2.active = rem; ev2.line = 3; ev2.val = val; ev2.stack = callStack;
            ev2.desc = "Resolved amount " + to_string(rem) + " -> value " + to_string(val);
            res.events.push_back(ev2);
            return val;
        };
        run_rec(run_rec, amount);
    } 
    else if (approach == "memoization") {
        table[0] = findMin ? 0 : 1;
        auto run_memo = [&](auto self, int rem) -> int {
            if (rem == 0) return findMin ? 0 : 1;
            if (rem < 0) return findMin ? 1e9 : 0;
            callStack.push_back(rem);
            Event ev1;
            ev1.type = "memo_lookup"; ev1.active = rem; ev1.line = 1; ev1.stack = callStack;
            ev1.desc = "Memo lookup for remainder amount " + to_string(rem);
            res.events.push_back(ev1);

            if (table[rem] != (findMin ? 1e9 : 0) && table[rem] != -1) {
                Event ev2;
                ev2.type = "memo_hit"; ev2.active = rem; ev2.line = 2; ev2.val = table[rem]; ev2.table = table; ev2.stack = callStack;
                ev2.desc = "Cache hit for amount " + to_string(rem) + " -> " + to_string(table[rem]);
                res.events.push_back(ev2);
                callStack.pop_back();
                return table[rem];
            }

            int val = findMin ? 1e9 : 0;
            for (int coin : coins) {
                int sub = self(self, rem - coin);
                if (findMin) {
                    if (sub != 1e9) val = min(val, 1 + sub);
                } else {
                    val += sub;
                }
            }
            table[rem] = val;
            res.updates++;
            callStack.pop_back();

            Event ev3;
            ev3.type = "memo_store"; ev3.active = rem; ev3.line = 4; ev3.val = val; ev3.table = table; ev3.stack = callStack;
            ev3.desc = "Stored memo[" + to_string(rem) + "] = " + to_string(val);
            res.events.push_back(ev3);
            return val;
        };
        run_memo(run_memo, amount);
    } 
    else if (approach == "tabulation") {
        table.assign(amount + 1, findMin ? 1e9 : 0);
        table[0] = findMin ? 0 : 1;
        res.updates = 1;
        Event ev1;
        ev1.type = "table_update"; ev1.active = 0; ev1.line = 1; ev1.val = table[0]; ev1.table = table;
        ev1.desc = "Base case dp[0] = " + to_string(table[0]) + " initialized.";
        res.events.push_back(ev1);

        if (findMin) {
            for (int i = 1; i <= amount; i++) {
                for (int coin : coins) {
                    if (i >= coin) {
                        if (table[i - coin] != 1e9) {
                            table[i] = min(table[i], 1 + table[i - coin]);
                        }
                    }
                }
                res.updates++;
                Event ev;
                ev.type = "table_update"; ev.active = i; ev.line = 4; ev.val = table[i]; ev.table = table;
                ev.desc = "dp[" + to_string(i) + "] computed minimum coins: " + to_string(table[i]);
                res.events.push_back(ev);
            }
        } else {
            for (int coin : coins) {
                for (int i = coin; i <= amount; i++) {
                    table[i] += table[i - coin];
                    res.updates++;
                    Event ev;
                    ev.type = "table_update"; ev.active = i; ev.line = 4; ev.val = table[i]; ev.table = table;
                    ev.desc = "Using coin " + to_string(coin) + ": dp[" + to_string(i) + "] updated to " + to_string(table[i]) + " combinations";
                    res.events.push_back(ev);
                }
            }
        }
    } 
    else if (approach == "space-optimized") {
        // Coin Change is not space optimized in 1D easily since it's already 1D. We mark as NA.
        Event ev;
        ev.type = "solution_complete";
        ev.desc = "Space optimization not directly applicable for 1D Coin Change - Tabulation is already O(W) optimal.";
        res.events.push_back(ev);
    }

    return res;
}

// ----------------------------------------------------
// 8. PERFECT SQUARES
// ----------------------------------------------------
DPResult run_perfect_squares(int n, string approach) {
    DPResult res;
    res.algorithm = "perfect-squares";
    res.approach = approach;
    vector<int> table(n + 1, 1e9);
    vector<int> callStack;

    if (approach == "recursive") {
        auto run_rec = [&](auto self, int rem) -> int {
            if (rem == 0) return 0;
            callStack.push_back(rem);
            Event ev1;
            ev1.type = "call"; ev1.active = rem; ev1.line = 1; ev1.stack = callStack;
            ev1.desc = "Finding perfect squares for sum " + to_string(rem);
            res.events.push_back(ev1);

            int val = 1e9;
            for (int i = 1; i * i <= rem; i++) {
                val = min(val, 1 + self(self, rem - i * i));
            }
            callStack.pop_back();

            Event ev2;
            ev2.type = "return"; ev2.active = rem; ev2.line = 3; ev2.val = val; ev2.stack = callStack;
            ev2.desc = "Minimum squares for sum " + to_string(rem) + " is " + to_string(val);
            res.events.push_back(ev2);
            return val;
        };
        run_rec(run_rec, n);
    } 
    else if (approach == "memoization") {
        table[0] = 0;
        auto run_memo = [&](auto self, int rem) -> int {
            if (rem == 0) return 0;
            callStack.push_back(rem);
            Event ev1;
            ev1.type = "memo_lookup"; ev1.active = rem; ev1.line = 1; ev1.stack = callStack;
            ev1.desc = "Checking cache for perfect squares of " + to_string(rem);
            res.events.push_back(ev1);

            if (table[rem] != 1e9) {
                Event ev2;
                ev2.type = "memo_hit"; ev2.active = rem; ev2.line = 2; ev2.val = table[rem]; ev2.table = table; ev2.stack = callStack;
                ev2.desc = "Cache hit for sum " + to_string(rem) + " -> " + to_string(table[rem]);
                res.events.push_back(ev2);
                callStack.pop_back();
                return table[rem];
            }

            int val = 1e9;
            for (int i = 1; i * i <= rem; i++) {
                val = min(val, 1 + self(self, rem - i * i));
            }
            table[rem] = val;
            res.updates++;
            callStack.pop_back();

            Event ev3;
            ev3.type = "memo_store"; ev3.active = rem; ev3.line = 4; ev3.val = val; ev3.table = table; ev3.stack = callStack;
            ev3.desc = "Stored memo[" + to_string(rem) + "] = " + to_string(val);
            res.events.push_back(ev3);
            return val;
        };
        run_memo(run_memo, n);
    } 
    else if (approach == "tabulation") {
        table[0] = 0;
        res.updates = 1;
        Event ev1;
        ev1.type = "table_update"; ev1.active = 0; ev1.line = 1; ev1.val = 0; ev1.table = table;
        ev1.desc = "Base case dp[0] = 0 perfect squares.";
        res.events.push_back(ev1);

        for (int i = 1; i <= n; i++) {
            for (int j = 1; j * j <= i; j++) {
                table[i] = min(table[i], 1 + table[i - j * j]);
            }
            res.updates++;
            Event ev;
            ev.type = "table_update"; ev.active = i; ev.line = 4; ev.val = table[i]; ev.table = table;
            ev.desc = "dp[" + to_string(i) + "] updated: " + to_string(table[i]) + " perfect square sums.";
            res.events.push_back(ev);
        }
    } 
    else if (approach == "space-optimized") {
        Event ev;
        ev.type = "solution_complete";
        ev.desc = "Space optimization not applicable - requires O(N) memory to access arbitrary j*j subproblems.";
        res.events.push_back(ev);
    }

    return res;
}

// ----------------------------------------------------
// 9. INTEGER BREAK
// ----------------------------------------------------
DPResult run_integer_break(int n, string approach) {
    DPResult res;
    res.algorithm = "integer-break";
    res.approach = approach;
    vector<int> table(n + 1, -1);
    vector<int> callStack;

    if (approach == "recursive") {
        auto run_rec = [&](auto self, int rem) -> int {
            if (rem <= 2) return 1;
            callStack.push_back(rem);
            Event ev1;
            ev1.type = "call"; ev1.active = rem; ev1.line = 1; ev1.stack = callStack;
            ev1.desc = "Breaking integer value " + to_string(rem);
            res.events.push_back(ev1);

            int val = 0;
            for (int i = 1; i < rem; i++) {
                val = max({val, i * (rem - i), i * self(self, rem - i)});
            }
            callStack.pop_back();

            Event ev2;
            ev2.type = "return"; ev2.active = rem; ev2.line = 3; ev2.val = val; ev2.stack = callStack;
            ev2.desc = "Max product for breaking " + to_string(rem) + " is " + to_string(val);
            res.events.push_back(ev2);
            return val;
        };
        run_rec(run_rec, n);
    } 
    else if (approach == "memoization") {
        table[1] = 1;
        auto run_memo = [&](auto self, int rem) -> int {
            if (rem <= 2) return 1;
            callStack.push_back(rem);
            Event ev1;
            ev1.type = "memo_lookup"; ev1.active = rem; ev1.line = 1; ev1.stack = callStack;
            ev1.desc = "Checking cache for breaking " + to_string(rem);
            res.events.push_back(ev1);

            if (table[rem] != -1) {
                Event ev2;
                ev2.type = "memo_hit"; ev2.active = rem; ev2.line = 2; ev2.val = table[rem]; ev2.table = table; ev2.stack = callStack;
                ev2.desc = "Cache hit: memo[" + to_string(rem) + "] = " + to_string(table[rem]);
                res.events.push_back(ev2);
                callStack.pop_back();
                return table[rem];
            }

            int val = 0;
            for (int i = 1; i < rem; i++) {
                val = max({val, i * (rem - i), i * self(self, rem - i)});
            }
            table[rem] = val;
            res.updates++;
            callStack.pop_back();

            Event ev3;
            ev3.type = "memo_store"; ev3.active = rem; ev3.line = 4; ev3.val = val; ev3.table = table; ev3.stack = callStack;
            ev3.desc = "Stored memo[" + to_string(rem) + "] = " + to_string(val);
            res.events.push_back(ev3);
            return val;
        };
        run_memo(run_memo, n);
    } 
    else if (approach == "tabulation") {
        table[1] = 1;
        res.updates = 1;
        Event ev1;
        ev1.type = "table_update"; ev1.active = 1; ev1.line = 1; ev1.val = 1; ev1.table = table;
        ev1.desc = "Base case dp[1] = 1 initialized.";
        res.events.push_back(ev1);

        for (int i = 2; i <= n; i++) {
            for (int j = 1; j < i; j++) {
                table[i] = max({table[i], j * (i - j), j * table[i - j]});
            }
            res.updates++;
            Event ev;
            ev.type = "table_update"; ev.active = i; ev.line = 4; ev.val = table[i]; ev.table = table;
            ev.desc = "dp[" + to_string(i) + "] computed max split: " + to_string(table[i]);
            res.events.push_back(ev);
        }
    } 
    else if (approach == "space-optimized") {
        Event ev;
        ev.type = "solution_complete";
        ev.desc = "Space optimization not applicable - requires O(N) memory to access all split parts.";
        res.events.push_back(ev);
    }

    return res;
}

// ----------------------------------------------------
// 10. FROG JUMP
// ----------------------------------------------------
DPResult run_frog_jump(const vector<int>& heights, string approach) {
    int n = heights.size();
    DPResult res;
    res.algorithm = "frog-jump";
    res.approach = approach;
    vector<int> table(n, -1);
    vector<int> callStack;

    if (approach == "recursive") {
        auto run_rec = [&](auto self, int i) -> int {
            if (i == 0) return 0;
            callStack.push_back(i);
            Event ev1;
            ev1.type = "call"; ev1.active = i; ev1.line = 1; ev1.stack = callStack;
            ev1.desc = "frog_jump(" + to_string(i) + ") checking energy cost.";
            res.events.push_back(ev1);

            int left = self(self, i - 1) + abs(heights[i] - heights[i-1]);
            int right = 1e9;
            if (i > 1) {
                right = self(self, i - 2) + abs(heights[i] - heights[i-2]);
            }
            int val = min(left, right);
            callStack.pop_back();

            Event ev2;
            ev2.type = "return"; ev2.active = i; ev2.line = 3; ev2.val = val; ev2.stack = callStack;
            ev2.desc = "frog_jump(" + to_string(i) + ") resolved min cost -> " + to_string(val);
            res.events.push_back(ev2);
            return val;
        };
        run_rec(run_rec, n - 1);
    } 
    else if (approach == "memoization") {
        table[0] = 0;
        auto run_memo = [&](auto self, int i) -> int {
            if (i == 0) return 0;
            callStack.push_back(i);
            Event ev1;
            ev1.type = "memo_lookup"; ev1.active = i; ev1.line = 1; ev1.stack = callStack;
            ev1.desc = "Memo lookup for index " + to_string(i);
            res.events.push_back(ev1);

            if (table[i] != -1) {
                Event ev2;
                ev2.type = "memo_hit"; ev2.active = i; ev2.line = 2; ev2.val = table[i]; ev2.table = table; ev2.stack = callStack;
                ev2.desc = "Cache hit for position " + to_string(i) + " -> " + to_string(table[i]);
                res.events.push_back(ev2);
                callStack.pop_back();
                return table[i];
            }

            int left = self(self, i - 1) + abs(heights[i] - heights[i-1]);
            int right = 1e9;
            if (i > 1) {
                right = self(self, i - 2) + abs(heights[i] - heights[i-2]);
            }
            int val = min(left, right);
            table[i] = val;
            res.updates++;
            callStack.pop_back();

            Event ev3;
            ev3.type = "memo_store"; ev3.active = i; ev3.line = 4; ev3.val = val; ev3.table = table; ev3.stack = callStack;
            ev3.desc = "Stored memo[" + to_string(i) + "] = " + to_string(val);
            res.events.push_back(ev3);
            return val;
        };
        run_memo(run_memo, n - 1);
    } 
    else if (approach == "tabulation") {
        if (n == 0) return res;
        table[0] = 0;
        res.updates = 1;
        Event ev1;
        ev1.type = "table_update"; ev1.active = 0; ev1.line = 1; ev1.val = 0; ev1.table = table;
        ev1.desc = "Base case dp[0] = 0 cost initialized.";
        res.events.push_back(ev1);

        for (int i = 1; i < n; i++) {
            int left = table[i-1] + abs(heights[i] - heights[i-1]);
            int right = 1e9;
            if (i > 1) {
                right = table[i-2] + abs(heights[i] - heights[i-2]);
            }
            table[i] = min(left, right);
            res.updates++;
            Event ev;
            ev.type = "table_update"; ev.active = i; ev.line = 4; ev.val = table[i]; ev.table = table;
            ev.desc = "dp[" + to_string(i) + "] updated: min(jump1: " + to_string(left) + ", jump2: " + to_string(right) + ") = " + to_string(table[i]);
            res.events.push_back(ev);
        }
    } 
    else if (approach == "space-optimized") {
        if (n == 0) return res;
        int prev2 = 0, prev = 0;
        Event ev1;
        ev1.type = "variable_update"; ev1.line = 1; ev1.prev2 = prev2; ev1.prev = prev; ev1.curr = 0;
        ev1.desc = "Optimized storage start: prev2 = 0, prev = 0";
        res.events.push_back(ev1);

        for (int i = 1; i < n; i++) {
            int left = prev + abs(heights[i] - heights[i-1]);
            int right = 1e9;
            if (i > 1) {
                right = prev2 + abs(heights[i] - heights[i-2]);
            }
            int curr = min(left, right);
            prev2 = prev;
            prev = curr;
            res.updates++;
            Event ev;
            ev.type = "variable_update"; ev.line = 4; ev.prev2 = prev2; ev.prev = prev; ev.curr = curr;
            ev.desc = "Step " + to_string(i) + ": sliding calculation curr energy = " + to_string(curr);
            res.events.push_back(ev);
        }
    }

    int final_val = 0;
    if (!res.events.empty()) {
        if (approach == "space-optimized") {
            final_val = res.events.back().prev;
        } else {
            final_val = res.events.back().val;
        }
    }
    Event ev_final;
    ev_final.type = "solution_complete";
    ev_final.val = final_val;
    ev_final.desc = "Calculation complete. Minimum energy cost: " + to_string(final_val);
    res.events.push_back(ev_final);

    return res;
}

// ----------------------------------------------------
// MAIN ROUTER
// ----------------------------------------------------
int main(int argc, char* argv[]) {
    if (argc < 2) {
        cout << R"({"success": false, "message": "Algorithm not provided."})" << endl;
        return 1;
    }
    
    string algorithm = argv[1];
    string approach = "tabulation";
    if (argc >= 3) {
        approach = argv[2];
    }
    
    DPResult result;
    auto start = high_resolution_clock::now();
    
    if (algorithm == "fibonacci") {
        int n = 5;
        cin >> n;
        result = run_fibonacci(n, approach);
    } 
    else if (algorithm == "climbing-stairs" || algorithm == "climbing") {
        int n = 5;
        cin >> n;
        result = run_climbing_stairs(n, approach);
    } 
    else if (algorithm == "house-robber-i") {
        int s = 0;
        if (cin >> s) {
            vector<int> nums(s);
            for (int i = 0; i < s; i++) cin >> nums[i];
            result = run_house_robber_i(nums, approach);
        }
    } 
    else if (algorithm == "house-robber-ii") {
        int s = 0;
        if (cin >> s) {
            vector<int> nums(s);
            for (int i = 0; i < s; i++) cin >> nums[i];
            result = run_house_robber_ii(nums, approach);
        }
    } 
    else if (algorithm == "decode-ways") {
        string s;
        if (cin >> s) {
            result = run_decode_ways(s, approach);
        }
    } 
    else if (algorithm == "coin-change") {
        int amount = 0, size = 0;
        if (cin >> amount >> size) {
            vector<int> coins(size);
            for (int i = 0; i < size; i++) cin >> coins[i];
            result = run_coin_change(coins, amount, approach, false);
        }
    } 
    else if (algorithm == "minimum-coins") {
        int amount = 0, size = 0;
        if (cin >> amount >> size) {
            vector<int> coins(size);
            for (int i = 0; i < size; i++) cin >> coins[i];
            result = run_coin_change(coins, amount, approach, true);
        }
    } 
    else if (algorithm == "perfect-squares") {
        int n = 5;
        cin >> n;
        result = run_perfect_squares(n, approach);
    } 
    else if (algorithm == "integer-break") {
        int n = 5;
        cin >> n;
        result = run_integer_break(n, approach);
    } 
    else if (algorithm == "frog-jump") {
        int s = 0;
        if (cin >> s) {
            vector<int> heights(s);
            for (int i = 0; i < s; i++) cin >> heights[i];
            result = run_frog_jump(heights, approach);
        }
    } 
    else {
        cout << R"({"success": false, "message": "Unknown dp algorithm."})" << endl;
        return 1;
    }
    
    auto end = high_resolution_clock::now();
    result.runtimeMs = duration<double, std::milli>(end - start).count();
    
    cout << toJSON(result) << endl;
    return 0;
}
