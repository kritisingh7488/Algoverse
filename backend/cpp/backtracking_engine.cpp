#include <iostream>
#include <vector>
#include <string>
#include <chrono>
#include <sstream>

using namespace std;
using namespace std::chrono;

struct Event {
    vector<vector<int>> grid;
    int row = -1;
    int col = -1;
    int backtracks = 0;
    string desc;
};

struct BacktrackingResult {
    string algorithm;
    vector<Event> events;
    int backtracks = 0;
    double runtimeMs = 0.0;
};

// Helper for 2D array to JSON
string gridToJSON(const vector<vector<int>>& grid) {
    if (grid.empty()) return "[]";
    stringstream ss;
    ss << "[";
    for (size_t i = 0; i < grid.size(); ++i) {
        ss << "[";
        for (size_t j = 0; j < grid[i].size(); ++j) {
            ss << grid[i][j] << (j == grid[i].size() - 1 ? "" : ", ");
        }
        ss << "]" << (i == grid.size() - 1 ? "" : ", ");
    }
    ss << "]";
    return ss.str();
}

string toJSON(const BacktrackingResult& res) {
    stringstream ss;
    ss << "{\n";
    ss << "  \"success\": true,\n";
    ss << "  \"algorithm\": \"" << res.algorithm << "\",\n";
    ss << "  \"data\": {\n";
    ss << "    \"statistics\": {\n";
    ss << "      \"backtracks\": " << res.backtracks << ",\n";
    ss << "      \"time_ms\": " << res.runtimeMs << "\n";
    ss << "    },\n";
    ss << "    \"events\": [\n";
    
    for (size_t k = 0; k < res.events.size(); ++k) {
        const auto& ev = res.events[k];
        ss << "      {\n";
        ss << "        \"grid\": " << gridToJSON(ev.grid) << ",\n";
        ss << "        \"row\": " << ev.row << ",\n";
        ss << "        \"col\": " << ev.col << ",\n";
        ss << "        \"backtracks\": " << ev.backtracks << ",\n";
        
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

bool isSafe(const vector<vector<int>>& grid, int row, int col, int N) {
    for (int i = 0; i < row; i++) if (grid[i][col] == 1) return false;
    for (int i = row, j = col; i >= 0 && j >= 0; i--, j--) if (grid[i][j] == 1) return false;
    for (int i = row, j = col; i >= 0 && j < N; i--, j++) if (grid[i][j] == 1) return false;
    return true;
}

bool solveNQueens(vector<vector<int>>& grid, int row, int N, int& countBacktracks, BacktrackingResult& result) {
    if (row == N) {
        Event ev;
        ev.grid = grid;
        ev.row = N;
        ev.col = -1;
        ev.backtracks = countBacktracks;
        ev.desc = "Solution Found! All " + to_string(N) + " Queens placed safely.";
        result.events.push_back(ev);
        return true;
    }

    for (int col = 0; col < N; col++) {
        grid[row][col] = 1;
        
        Event ev1;
        ev1.grid = grid;
        ev1.row = row;
        ev1.col = col;
        ev1.backtracks = countBacktracks;
        ev1.desc = "Trying Queen at row " + to_string(row) + ", col " + to_string(col) + "...";
        result.events.push_back(ev1);

        if (isSafe(grid, row, col, N)) {
            Event ev2;
            ev2.grid = grid;
            ev2.row = row;
            ev2.col = col;
            ev2.backtracks = countBacktracks;
            ev2.desc = "Safe position at row " + to_string(row) + ", col " + to_string(col) + ". Moving to next row.";
            result.events.push_back(ev2);
            
            if (solveNQueens(grid, row + 1, N, countBacktracks, result)) {
                return true;
            }
        }

        // Backtrack
        grid[row][col] = 0;
        countBacktracks++;
        
        Event ev3;
        ev3.grid = grid;
        ev3.row = row;
        ev3.col = col;
        ev3.backtracks = countBacktracks;
        ev3.desc = "Conflict! Backtracking queen from row " + to_string(row) + ", col " + to_string(col) + ".";
        result.events.push_back(ev3);
    }
    return false;
}

BacktrackingResult generate_nqueens(int N) {
    BacktrackingResult result;
    result.algorithm = "nqueens";
    
    vector<vector<int>> grid(N, vector<int>(N, 0));
    int countBacktracks = 0;
    
    solveNQueens(grid, 0, N, countBacktracks, result);
    
    result.backtracks = countBacktracks;
    return result;
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cout << R"({"success": false, "message": "Algorithm not provided."})" << endl;
        return 1;
    }
    
    string algorithm = argv[1];
    
    int size = 4;
    string sizeStr;
    if (getline(cin, sizeStr)) {
        if(!sizeStr.empty() && sizeStr.back() == '\r') sizeStr.pop_back();
        try {
            if(!sizeStr.empty()) {
                size = stoi(sizeStr);
            }
        } catch(...) {
            // ignore
        }
    }
    
    BacktrackingResult result;
    auto start = high_resolution_clock::now();
    
    if (algorithm == "nqueens") {
        result = generate_nqueens(size);
    } else {
        cout << R"({"success": false, "message": "Unknown backtracking algorithm."})" << endl;
        return 1;
    }
    
    auto end = high_resolution_clock::now();
    result.runtimeMs = duration<double, std::milli>(end - start).count();
    
    cout << toJSON(result) << endl;
    return 0;
}
