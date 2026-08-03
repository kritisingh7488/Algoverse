import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Mail, 
  CheckCircle2, 
  Shield,
  Key
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import useAuthStore from '../store/authStore';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import ThemeToggle from '../components/common/ThemeToggle';

const Settings = () => {
  const { user, updateProfile, updatePassword, isLoading } = useAuthStore();
  
  // Profile state
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdSaved, setPwdSaved] = useState(false);
  const [pwdError, setPwdError] = useState(null);
  const [isPwdLoading, setIsPwdLoading] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSaved(false);
    
    const res = await updateProfile({ fullName, email });
    if (res.success) {
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } else {
      setProfileError(res.message);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPwdError(null);
    setPwdSaved(false);

    if (newPassword !== confirmPassword) {
      setPwdError("New passwords don't match");
      return;
    }

    if (newPassword.length < 8) {
      setPwdError("New password must be at least 8 characters");
      return;
    }

    setIsPwdLoading(true);
    const res = await updatePassword({ currentPassword, newPassword });
    setIsPwdLoading(false);

    if (res.success) {
      setPwdSaved(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPwdSaved(false), 3000);
    } else {
      setPwdError(res.message);
    }
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

        {/* Profile Information Form */}
        <form onSubmit={handleProfileSave}>
          <Card className="space-y-6">
            {profileSaved && (
              <div className="p-4 rounded-2xl bg-success/20 border border-success/30 text-textPrimary text-xs font-body font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" /> Profile updated successfully!
              </div>
            )}
            
            {profileError && (
              <div className="p-4 rounded-2xl bg-danger/20 border border-danger/30 text-textPrimary text-xs font-body font-bold flex items-center gap-2">
                <Shield className="w-4 h-4 text-danger" /> {profileError}
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
              <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
                Save Changes
              </Button>
            </div>
          </Card>
        </form>

        {/* Change Password Form */}
        <form onSubmit={handlePasswordSave}>
          <Card className="space-y-6">
            {pwdSaved && (
              <div className="p-4 rounded-2xl bg-success/20 border border-success/30 text-textPrimary text-xs font-body font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" /> Password updated successfully!
              </div>
            )}
            
            {pwdError && (
              <div className="p-4 rounded-2xl bg-danger/20 border border-danger/30 text-textPrimary text-xs font-body font-bold flex items-center gap-2">
                <Shield className="w-4 h-4 text-danger" /> {pwdError}
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-sm font-heading font-bold text-textPrimary border-b-2 border-borderTheme pb-2 flex items-center gap-2">
                <Key className="w-4 h-4" /> Security
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Current Password"
                    type="password"
                    placeholder="Leave blank if signed in with Google only"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <Input
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t-2 border-borderTheme flex justify-end">
              <Button type="submit" variant="primary" size="md" isLoading={isPwdLoading}>
                Update Password
              </Button>
            </div>
          </Card>
        </form>

      </div>
    </AppLayout>
  );
};

export default Settings;
