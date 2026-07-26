import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import useAuthStore from '../../store/authStore';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (validationError) setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 8) {
      setValidationError('Password must be at least 8 characters long');
      return;
    }

    const success = await register({
      fullName: formData.fullName,
      username: formData.username,
      email: formData.email,
      password: formData.password
    });

    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <AuthLayout title="Create an Account" subtitle="Join AlgoVerse to master algorithms visually.">
      <form onSubmit={handleSubmit} className="mt-4">
        {(error || validationError) && (
          <div className="mb-5 p-3 bg-danger/10 border border-danger/30 rounded-xl text-danger text-[13px] text-center font-bold font-body animate-[slideUp_0.3s_ease-out]">
            {error || validationError}
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-4">
          <Input
            label="Full Name"
            id="fullName"
            name="fullName"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <Input
            label="Username"
            id="username"
            name="username"
            placeholder="johndoe"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-4 mt-2">
          <Input
            label="Email Address"
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Input
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-start mt-3 mb-8 group">
          <div className="flex items-center h-5">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 bg-card border-borderTheme text-primary focus:ring-primary rounded-[4px] mt-0.5 cursor-pointer transition-colors"
            />
          </div>
          <div className="ml-2.5 text-[12px] leading-relaxed text-textSecondary font-body">
            <label htmlFor="terms" className="cursor-pointer group-hover:text-textPrimary transition-colors">
              I agree to the <a href="#" className="font-bold text-textPrimary hover:text-primary transition-colors">Terms of Service</a> and <a href="#" className="font-bold text-textPrimary hover:text-primary transition-colors">Privacy Policy</a>.
            </label>
          </div>
        </div>

        <Button type="submit" isLoading={isLoading} className="w-full">
          Create Account
        </Button>
      </form>
      
      <p className="mt-8 text-center text-[13px] text-textSecondary font-body">
        Already have an account?{' '}
        <Link to="/login" className="font-heading font-bold text-textPrimary hover:text-primary transition-colors">
          Sign In &rarr;
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;
