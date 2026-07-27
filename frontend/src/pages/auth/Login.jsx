import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import useAuthStore from '../../store/authStore';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { login, googleLogin, isLoading, error } = useAuthStore();

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        callback: handleGoogleResponse,
      });
      
      const googleButton = document.getElementById('google-signin-button');
      if (googleButton) {
        window.google.accounts.id.renderButton(googleButton, {
          theme: 'outline',
          size: 'large',
          width: '380',
          text: 'signin_with',
        });
      }
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      if (!response.credential) {
        console.error('No credential in response');
        return;
      }

      const decoded = JSON.parse(atob(response.credential.split('.')[1]));
      const { success } = await googleLogin(response.credential, {
        fullName: decoded.name,
        email: decoded.email,
        avatar: decoded.picture,
      });

      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Google login error:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
    if (success) {
      navigate('/dashboard'); 
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Log in to continue your learning journey.">
      <form onSubmit={handleSubmit} className="mt-4 space-y-5">
        {error && (
          <div className="p-3 bg-danger/10 border border-danger/30 rounded-xl text-danger text-[13px] text-center font-bold font-body animate-[slideUp_0.3s_ease-out]">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
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
          
          <div className="relative">
            <div className="absolute right-0 top-0 mt-0.5">
              <Link to="/forgot-password" className="text-[12px] font-bold text-textSecondary hover:text-primary transition-colors focus:outline-none focus:underline font-body">
                Forgot password?
              </Link>
            </div>
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
          </div>
        </div>

        <div className="flex items-center -mt-1 mb-6 group w-max">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 bg-card border-borderTheme text-primary focus:ring-primary rounded-[4px] cursor-pointer transition-colors"
          />
          <label htmlFor="remember-me" className="ml-2.5 block text-[13px] text-textSecondary cursor-pointer group-hover:text-textPrimary transition-colors font-body">
            Remember me
          </label>
        </div>

        <Button type="submit" isLoading={isLoading} className="w-full">
          Sign In
        </Button>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-borderTheme" />
          </div>
          <div className="relative flex justify-center text-[11px] font-heading font-bold tracking-wider">
            <span className="px-3 bg-card text-textSecondary uppercase">OR CONTINUE WITH</span>
          </div>
        </div>

        <div id="google-signin-button" className="w-full"></div>
      </form>
      
      <p className="mt-8 text-center text-[13px] text-textSecondary font-body">
        Don't have an account?{' '}
        <Link to="/signup" className="font-heading font-bold text-textPrimary hover:text-primary transition-colors">
          Sign Up &rarr;
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
