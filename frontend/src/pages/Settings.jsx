import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Mail, 
  CheckCircle2, 
  Shield 
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import useAuthStore from '../store/authStore';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import ThemeToggle from '../components/common/ThemeToggle';

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
        <Card className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-primary/15 text-primary border border-primary/30">
              <SettingsIcon className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-2xl font-heading font-bold text-textPrimary">Account & Theme Settings</h1>
              <p className="text-xs font-body text-textSecondary">Manage profile preferences, theme appearance, and security.</p>
            </div>
          </div>
          <ThemeToggle />
        </Card>

        {/* Form Box */}
        <form onSubmit={handleSave}>
          <Card className="space-y-6">
            {saved && (
              <div className="p-4 rounded-2xl bg-success/20 border border-success/30 text-textPrimary text-xs font-body font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" /> Settings updated successfully!
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-sm font-heading font-bold text-textPrimary border-b-2 border-borderTheme pb-2">Profile Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  icon={User}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <Input
                  label="Email Address"
                  type="email"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4 border-t-2 border-borderTheme flex justify-end">
              <Button type="submit" variant="primary" size="md">
                Save Changes
              </Button>
            </div>
          </Card>
        </form>

      </div>
    </AppLayout>
  );
};

export default Settings;
