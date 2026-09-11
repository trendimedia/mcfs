// components/auth-panel.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { authClient } from '@/lib/auth/client';

export default function AuthPanel() {
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  // Sign in state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInError, setSignInError] = useState('');
  const [signInLoading, setSignInLoading] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign up state
  const [name, setName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpError, setSignUpError] = useState('');
  const [signUpLoading, setSignUpLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError('');
    setSignInLoading(true);
    const { error } = await authClient.signIn.email({ email: signInEmail, password: signInPassword });
    setSignInLoading(false);
    if (error) {
      setSignInError(error.message ?? 'Invalid email or password');
      return;
    }
    router.push('/dashboard');
    router.refresh();
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError('');
    setSignUpLoading(true);
    const { error } = await authClient.signUp.email({ email: signUpEmail, password: signUpPassword, name });
    setSignUpLoading(false);
    if (error) {
      setSignUpError(error.message ?? 'Could not create account');
      return;
    }
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="bg-background flex min-h-screen w-full items-center justify-center p-4">
      <div className="relative w-full max-w-3xl min-h-[480px] overflow-hidden rounded-[2rem] shadow-2xl bg-white dark:bg-gray-900">
        {/* Sign In form */}
        <div
          className={`absolute top-0 left-0 h-full w-full md:w-1/2 flex items-center justify-center transition-all duration-700 ease-in-out
            ${isSignUp ? 'opacity-0 pointer-events-none md:translate-x-full' : 'opacity-100 z-20'}`}
        >
          <form onSubmit={handleSignIn} className="w-full max-w-sm px-8 py-10 space-y-4">
            <h1 className="text-2xl font-bold">Sign In</h1>
            <p className="text-sm text-muted-foreground">Sign in with Email &amp; Password</p>

            <input
              type="email"
              required
              placeholder="Email"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              className="w-full rounded-lg border bg-transparent px-3 py-2 shadow-sm outline-none focus:border-rose-600"
            />
            <div className="relative">
              <input
                type={showSignInPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                className="w-full rounded-lg border bg-transparent px-3 py-2 shadow-sm outline-none focus:border-rose-600"
              />
              <button
                type="button"
                onClick={() => setShowSignInPassword(!showSignInPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showSignInPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <a href="#" className="block text-sm text-muted-foreground hover:text-rose-600">
              Forgot password?
            </a>

            {signInError && <p className="text-sm text-rose-600">{signInError}</p>}

            <button
              type="submit"
              disabled={signInLoading}
              className="w-full rounded-full bg-rose-600 px-4 py-2.5 font-medium text-white hover:bg-rose-500 disabled:opacity-60"
            >
              {signInLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className="w-full text-sm text-muted-foreground hover:text-rose-600 md:hidden"
            >
              Don&apos;t have an account? Sign up
            </button>
          </form>
        </div>

        {/* Sign Up form */}
        <div
          className={`absolute top-0 left-0 h-full w-full md:w-1/2 flex items-center justify-center transition-all duration-700 ease-in-out
            ${isSignUp ? 'opacity-100 z-20 md:translate-x-full' : 'opacity-0 pointer-events-none'}`}
        >
          <form onSubmit={handleSignUp} className="w-full max-w-sm px-8 py-10 space-y-4">
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-sm text-muted-foreground">Sign up with your details</p>

            <input
              type="text"
              required
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border bg-transparent px-3 py-2 shadow-sm outline-none focus:border-rose-600"
            />
            <input
              type="email"
              required
              placeholder="Email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              className="w-full rounded-lg border bg-transparent px-3 py-2 shadow-sm outline-none focus:border-rose-600"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              className="w-full rounded-lg border bg-transparent px-3 py-2 shadow-sm outline-none focus:border-rose-600"
            />

            {signUpError && <p className="text-sm text-rose-600">{signUpError}</p>}

            <button
              type="submit"
              disabled={signUpLoading}
              className="w-full rounded-full bg-rose-600 px-4 py-2.5 font-medium text-white hover:bg-rose-500 disabled:opacity-60"
            >
              {signUpLoading ? 'Creating account...' : 'Sign Up'}
            </button>

            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className="w-full text-sm text-muted-foreground hover:text-rose-600 md:hidden"
            >
              Already have an account? Sign in
            </button>
          </form>
        </div>

        {/* Sliding overlay panel — desktop only */}
        <div
          className={`hidden md:block absolute top-0 h-full w-1/2 overflow-hidden transition-all duration-700 ease-in-out z-30
            ${isSignUp ? 'left-0 rounded-r-[8rem]' : 'left-1/2 rounded-l-[8rem]'}`}
        >
          <div
            className={`relative h-full w-[200%] bg-gradient-to-br from-rose-600 to-rose-800 text-white transition-transform duration-700 ease-in-out
              ${isSignUp ? 'translate-x-0' : '-translate-x-1/2'}`}
          >
            {/* Left panel content — shown when NOT signing up (overlay on right) */}
            <div
              className={`absolute top-0 left-0 h-full w-1/2 flex flex-col items-center justify-center text-center px-10 transition-opacity duration-500
                ${isSignUp ? 'opacity-0' : 'opacity-100'}`}
            >
              <h2 className="text-3xl font-bold mb-4">Hello!</h2>
              <p className="mb-8 text-white/90">Sign up now and enjoy all the features of MCFS.</p>
              <button
                onClick={() => setIsSignUp(true)}
                className="rounded-full border-2 border-white px-8 py-2.5 font-medium hover:bg-white hover:text-rose-600 transition-colors"
              >
                Sign Up
              </button>
            </div>

            {/* Right panel content — shown when signing up (overlay on left) */}
            <div
              className={`absolute top-0 right-0 h-full w-1/2 flex flex-col items-center justify-center text-center px-10 transition-opacity duration-500
                ${isSignUp ? 'opacity-100' : 'opacity-0'}`}
            >
              <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
              <p className="mb-8 text-white/90">Sign in with your email and password to continue.</p>
              <button
                onClick={() => setIsSignUp(false)}
                className="rounded-full border-2 border-white px-8 py-2.5 font-medium hover:bg-white hover:text-rose-600 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}