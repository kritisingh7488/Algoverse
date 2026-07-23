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
    
    // Basic validation
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
      navigate('/dashboard'); // Will create later
    }
  };

  return (
    <AuthLayout title="Create an Account" subtitle="Join AlgoVerse to master algorithms visually.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {(error || validationError) && (
          <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm text-center">
            {error || validationError}
          </div>
        )}
        
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
          placeholder="johndoe123"
          value={formData.username}
          onChange={handleChange}
          required
        />
        
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

        <div className="flex items-start mt-4 mb-6">
          <div className="flex items-center h-5">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
          </div>
          <div className="ml-2 text-sm">
            <label htmlFor="terms" className="text-gray-600">
              I agree to the <a href="#" className="font-medium text-primary hover:underline">Terms of Service</a> and <a href="#" className="font-medium text-primary hover:underline">Privacy Policy</a>.
            </label>
          </div>
        </div>

        <Button type="submit" isLoading={isLoading}>
          Create Account
        </Button>
      </form>
      
      <p className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary hover:text-secondary relative group">
          Sign In
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full"></span>
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;
