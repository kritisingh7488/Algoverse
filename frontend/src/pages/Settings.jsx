import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  Bell, 
  Moon, 
  CheckCircle2, 
  Shield 
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import useAuthStore from '../store/authStore';
import Button from '../components/common/Button';

const Settings = () => {
  const { user } = useAuthStore();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AppLayout>
      <div className="space-y-6 py-2 max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-3">
          <span className="p-2 rounded-xl bg-primary/10 text-primary">
            <SettingsIcon className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold font-poppins text-gray-900">Account Settings</h1>
            <p className="text-xs text-gray-500 font-inter">Manage profile preferences, password security, and notifications.</p>
          </div>
        </div>

        {/* Form Box */}
        <form onSubmit={handleSave} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          {saved && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Settings updated successfully!
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-sm font-bold font-poppins text-gray-900 border-b border-gray-100 pb-2">Profile Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 font-poppins">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-inter focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 font-poppins">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-inter focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <Button type="submit" variant="primary" className="px-6 py-2.5 text-xs shadow-md shadow-primary/20">
              Save Changes
            </Button>
          </div>
        </form>

      </div>
    </AppLayout>
  );
};

export default Settings;
