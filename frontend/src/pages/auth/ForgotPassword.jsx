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
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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

          <Button type="submit" isLoading={isLoading} className="w-full mt-6">
            Send Reset Link
          </Button>
          
          <div className="mt-6 text-center">
            <Link to="/login" className="text-[13px] font-heading font-bold text-textSecondary hover:text-textPrimary transition-colors focus:outline-none focus:underline">
              &larr; Back to Login
            </Link>
          </div>
        </form>
      ) : (
        <div className="text-center space-y-6 py-6 animate-[slideUp_0.4s_ease-out]">
          <div className="mx-auto w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center border border-success/30">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-[20px] font-heading font-bold text-textPrimary mb-2 tracking-tight">Check your email</h3>
            <p className="text-[14px] text-textSecondary leading-relaxed max-w-[280px] mx-auto font-body">
              If an account exists with that email, we've sent a password reset link.
            </p>
          </div>
          <div className="pt-6 mt-6 border-t border-borderTheme">
            <p className="text-[13px] text-textSecondary mb-4 font-body">Didn't receive the email?</p>
            <Button variant="outline" className="w-full" onClick={() => setIsSubmitted(false)}>
              Try Again
            </Button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
