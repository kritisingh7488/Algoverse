import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call for now
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your email to receive a password reset link."
    >
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="mt-4">
          <Input
            label="Email Address"
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button type="submit" isLoading={isLoading} className="mt-8">
            Send Reset Link
          </Button>
          
          <div className="mt-8 text-center">
            <Link to="/login" className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors focus:outline-none focus:underline">
              &larr; Back to Login
            </Link>
          </div>
        </form>
      ) : (
        <div className="text-center space-y-6 py-6 animate-[slideUp_0.4s_ease-out]">
          <div className="mx-auto w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(74,222,128,0.2)]">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-[20px] font-semibold text-gray-900 mb-2 tracking-tight font-poppins">Check your email</h3>
            <p className="text-[14px] text-gray-500 leading-relaxed max-w-[280px] mx-auto font-inter">
              If an account exists with that email, we've sent a password reset link.
            </p>
          </div>
          <div className="pt-8 mt-6 border-t border-gray-100">
            <p className="text-[13px] text-gray-500 mb-4">Didn't receive the email?</p>
            <Button variant="outline" onClick={() => setIsSubmitted(false)}>
              Try Again
            </Button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
