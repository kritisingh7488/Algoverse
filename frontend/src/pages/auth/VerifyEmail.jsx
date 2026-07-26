import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import Button from '../../components/common/Button';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  useEffect(() => {
    // Simulate verification API call
    const verifyToken = async () => {
      setTimeout(() => {
        setStatus('success');
      }, 2000);
    };

    if (token) {
      verifyToken();
    } else {
      setStatus('error');
    }
  }, [token]);

  return (
    <AuthLayout 
      title="Email Verification" 
      subtitle="Securing your AlgoVerse account."
    >
      <div className="py-6 text-center animate-[slideUp_0.4s_ease-out]">
        
        {status === 'verifying' && (
          <div className="space-y-6">
            <div className="mx-auto w-16 h-16 bg-primary/15 text-primary rounded-full flex items-center justify-center border border-primary/30 animate-pulse">
              <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-[20px] font-heading font-bold text-textPrimary mb-2 tracking-tight">Verifying your email</h3>
              <p className="text-[14px] text-textSecondary font-body">Please wait a moment while we confirm your address.</p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="mx-auto w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center border border-success/30">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-[20px] font-heading font-bold text-textPrimary mb-2 tracking-tight">Email Verified!</h3>
              <p className="text-[14px] text-textSecondary font-body mb-8">
                Your account is now fully active. You can continue to the dashboard.
              </p>
            </div>
            <Link to="/dashboard" className="block">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <div className="mx-auto w-16 h-16 bg-danger/20 text-danger rounded-full flex items-center justify-center border border-danger/30">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <h3 className="text-[20px] font-heading font-bold text-textPrimary mb-2 tracking-tight">Verification Failed</h3>
              <p className="text-[14px] text-textSecondary font-body mb-8">
                The link is invalid or has expired. Please request a new verification email.
              </p>
            </div>
            <Link to="/login" className="block">
              <Button variant="outline" className="w-full">Return to Login</Button>
            </Link>
          </div>
        )}

      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
