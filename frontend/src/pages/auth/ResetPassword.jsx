import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const ResetPassword = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call using the token
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }, 1500);
  };

  return (
    <AuthLayout 
      title="Create New Password" 
      subtitle="Your new password must be different from previously used passwords."
    >
      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="mt-4">
          {error && (
            <div className="mb-5 p-3 bg-danger/10 border border-danger/30 rounded-xl text-danger text-[13px] text-center font-bold font-body animate-[slideUp_0.3s_ease-out]">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <Input
              label="New Password"
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Input
              label="Confirm New Password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full mt-6 mb-4">
            Reset Password
          </Button>
        </form>
      ) : (
        <div className="text-center space-y-6 py-6 animate-[slideUp_0.4s_ease-out]">
          <div className="mx-auto w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center border border-success/30">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-[20px] font-heading font-bold text-textPrimary mb-2 tracking-tight">Password Reset!</h3>
            <p className="text-[14px] text-textSecondary leading-relaxed font-body">
              Your password has been successfully reset. Redirecting to login...
            </p>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default ResetPassword;
