import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  Users, 
  Layers, 
  BarChart3, 
  Trophy, 
  AlertTriangle, 
  CheckCircle2, 
  Ban, 
  Edit3, 
  Activity, 
  Server, 
  Search,
  Check
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/common/Button';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([
    { id: 1, name: 'Alex Chen', email: 'alex@example.com', role: 'Admin', status: 'Active', joined: 'Jan 2026', xp: 4120 },
    { id: 2, name: 'Priya Sharma', email: 'priya@example.com', role: 'User', status: 'Active', joined: 'Feb 2026', xp: 2150 },
    { id: 3, name: 'Marcus Vance', email: 'marcus@example.com', role: 'User', status: 'Suspended', joined: 'Mar 2026', xp: 950 },
  ]);

  const handleToggleStatus = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' };
      }
      return u;
    }));
  };

  return (
    <AppLayout>
      <div className="space-y-6 py-2">

        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-danger/10 text-danger">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold font-poppins text-gray-900">Admin Control Panel</h1>
            </div>
            <p className="text-sm text-gray-500 font-inter mt-1">
              Centralized platform management, user moderation, algorithm registry, and system health metrics.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            {['users', 'algorithms', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold font-poppins capitalize transition-all ${
                  activeTab === tab ? 'bg-white text-primary shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xs space-y-1">
            <p className="text-xs font-medium text-gray-400 font-inter">Total Users</p>
            <h3 className="text-2xl font-bold font-poppins text-gray-900">12,450</h3>
            <span className="text-[11px] text-emerald-600 font-medium">+12% this month</span>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xs space-y-1">
            <p className="text-xs font-medium text-gray-400 font-inter">Active Visualizations</p>
            <h3 className="text-2xl font-bold font-poppins text-gray-900">48,200</h3>
            <span className="text-[11px] text-emerald-600 font-medium">+8% 60 FPS Engine</span>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xs space-y-1">
            <p className="text-xs font-medium text-gray-400 font-inter">Benchmarks Run</p>
            <h3 className="text-2xl font-bold font-poppins text-gray-900">8,910</h3>
            <span className="text-[11px] text-primary font-medium">Multi-Algorithm Suite</span>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xs space-y-1">
            <p className="text-xs font-medium text-gray-400 font-inter">System Health</p>
            <h3 className="text-2xl font-bold font-poppins text-emerald-600 flex items-center gap-1.5">
              <Server className="w-5 h-5 text-emerald-500" /> 99.9%
            </h3>
            <span className="text-[11px] text-gray-400 font-medium">Render & Vercel API Node</span>
          </div>
        </div>

        {/* User Management Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold font-poppins text-gray-900">Registered Platform Users</h3>
            <span className="text-xs text-gray-400 font-mono">Total {users.length} Users</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 font-poppins">
                <tr>
                  <th className="px-6 py-3 font-semibold">User</th>
                  <th className="px-6 py-3 font-semibold">Role</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">XP Score</th>
                  <th className="px-6 py-3 font-semibold">Joined Date</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold font-poppins text-gray-900">{u.name}</p>
                        <p className="text-[11px] text-gray-400">{u.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">{u.role}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">{u.xp} XP</td>
                    <td className="px-6 py-4 text-gray-500">{u.joined}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-poppins font-medium transition-all ${
                          u.status === 'Active'
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        {u.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppLayout>
  );
};

export default Admin;
