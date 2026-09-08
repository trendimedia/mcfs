'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useActionState, useState } from 'react';

import { login } from '@/app/actions/auth';

export default function LoginForm1() {
  const [showPassword, setShowPassword] = useState(false);

  const [state, formAction, isPending] = useActionState(login, {});

  return (
    <main className="bg-background flex min-h-screen w-full flex-col items-center justify-center sm:px-4">
      <div className="w-full space-y-4 sm:max-w-md">
        <div className="text-center">
          <img
            src="https://mileslegend.sirv.com/logo-1.png"
            alt="Mfcs Logo"
            width={80}
            className="mx-auto animate-pulse"
          />

          <div className="mt-5 space-y-2">
            <h3 className="text-2xl font-bold sm:text-3xl">
              Log in to your account
            </h3>

            <p className="mt-8">
              Don&apos;t have an account?{' '}
              <a
                href="#"
                className="font-medium text-rose-600 hover:text-rose-500"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>

        <div className="space-y-6 p-4 py-6 shadow sm:rounded-lg sm:p-6">
          <div className="relative">
            <span className="bg-secondary block h-px w-full"></span>

            <p className="absolute inset-x-0 -top-2 mx-auto inline-block w-fit px-2 text-sm">
              Or continue with
            </p>
          </div>

          <form className="space-y-5" action={formAction}>
            <div>
              <label className="font-medium">Email</label>

              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="mt-2 w-full rounded-lg border bg-transparent px-3 py-2 shadow-sm outline-none focus:border-rose-600"
              />
            </div>

            <div className="relative">
              <label className="font-medium">Password</label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  required
                  className="mt-2 w-full rounded-lg border bg-transparent px-3 py-2 shadow-sm outline-none focus:border-rose-600"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                  className="absolute inset-y-0 right-0 mt-2 mr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-secondary" />
                  ) : (
                    <Eye size={20} className="text-secondary" />
                  )}
                </button>
              </div>
            </div>

            {state.error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
              >
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-rose-600 px-4 py-2 font-medium text-white duration-150 hover:bg-rose-500 active:bg-rose-600 disabled:opacity-60"
            >
              {isPending ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <div className="text-center">
          <a href="#" className="hover:text-rose-600">
            Forgot password?
          </a>
        </div>
      </div>
    </main>
  );
}

