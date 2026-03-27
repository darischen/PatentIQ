'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Grid, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email) {
      setError('Please enter your email');
      setLoading(false);
      return;
    }

    try {
      const resetUrl = `${process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL}/dbconnections/change_password?client_id=${process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}&connection=Username-Password-Authentication&email=${encodeURIComponent(email)}`;
      window.location.href = resetUrl;
    } catch (err) {
      setError('Failed to initiate password reset');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e2e8f0] flex items-center justify-center p-4 md:p-10 font-sans">
      <div className="w-full max-w-md">
        <div className="bg-white py-12 px-8 shadow-2xl rounded-[2.5rem]">
          {/* Header with Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#7c3aed] rounded-xl flex items-center justify-center shadow-lg shadow-purple-100">
              <Grid className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1e293b] leading-none">PatentIQ</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">IP Management Suite</p>
            </div>
          </div>

          {/* Reset Form */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1e293b] mb-2">Reset Password</h1>
            <p className="text-slate-500 text-sm">Enter your email to receive a password reset link</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#1e293b] mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                className="w-full px-4 py-3 border border-slate-200 text-[#1e293b] placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent disabled:bg-slate-50 disabled:cursor-not-allowed transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7c3aed] text-white py-3 rounded-xl font-bold text-base hover:bg-[#6d28d9] disabled:bg-[#8b5cf6] disabled:cursor-not-allowed transition-all shadow-xl shadow-purple-100 active:scale-[0.99]"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="w-full flex items-center justify-center gap-2 text-[#7c3aed] hover:text-[#6d28d9] font-semibold transition-colors"
            >
              <ArrowLeft size={18} />
              Back to login
            </button>
          </div>

          <div className="mt-8 text-slate-400 text-xs font-medium text-center">
            &copy; 2025 PatentIQ. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
