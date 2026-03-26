import React from 'react';
import { useAuthStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';

type Step = 'login' | 'register' | 'success' | 'forgot-password' | 'success-reset';

export default function Auth() {
  const [step, setStep] = React.useState<Step>('login');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const [form, setForm] = React.useState({ name: '', email: '', mobile: '', password: '' });

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const apiCall = async (endpoint: string, body: object) => {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let data: any;
    try { data = JSON.parse(text); }
    catch { throw new Error(`Server error: ${text.slice(0, 60)}...`); }
    if (!res.ok) throw new Error(data.error || 'Something went wrong');
    return data;
  };

  // --- Login ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const token = await userCredential.user.getIdToken();
      const result = await apiCall('/api/auth/login', { token });
      setAuth(result.user, result.token);
      navigate('/dashboard');
    } catch (err: any) { setError('Failed to log in: ' + err.message); }
    finally { setIsLoading(false); }
  };

  // --- Register: Create Account directly ---
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.mobile || !form.password) {
      return setError('All fields are required');
    }
    if (form.mobile.length !== 10) return setError('Enter a valid 10-digit mobile number');
    setIsLoading(true); setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const token = await userCredential.user.getIdToken();
      await apiCall('/api/auth/register', { name: form.name, email: form.email, mobile: form.mobile, token });
      setStep('success');
    } catch (err: any) { setError('Failed to register: ' + err.message); }
    finally { setIsLoading(false); }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true); setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      // login endpoint will automatically register if missing
      const apiRes = await apiCall('/api/auth/login', { token, name: result.user.displayName });
      setAuth(apiRes.user, apiRes.token);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Google Sign-in failed: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) return setError('Please enter your email address');
    setIsLoading(true); setError('');
    try {
      await sendPasswordResetEmail(auth, form.email);
      setStep('success-reset');
    } catch (err: any) {
      setError('Failed to send reset email: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fieldCls = 'w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all';
  const btnCls = 'w-full bg-[#3182CE] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-70';

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#3182CE] rounded-2xl shadow-lg shadow-blue-200 mb-4">
            <ShieldCheck className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">TelanganaOne</h1>
          <p className="text-gray-500 mt-2">Smart City Information Portal</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
          >
            {error && (
              <div className="mb-5 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            {/* ── LOGIN ── */}
            {step === 'login' && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <input className={fieldCls} placeholder="name@example.com" value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-bold text-gray-700">Password</label>
                      <button type="button" onClick={() => { setStep('forgot-password'); setError(''); }} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                        Forgot Password?
                      </button>
                    </div>
                    <input className={fieldCls} type="password" placeholder="••••••••" value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                  </div>
                  <button disabled={isLoading} className={btnCls}>
                    {isLoading ? <Loader2 className="animate-spin" /> : <><span>Sign In</span><ArrowRight size={20} /></>}
                  </button>
                </form>
                
                <div className="mt-4">
                  <button onClick={handleGoogleSignIn} disabled={isLoading} 
                    className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-70">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                  <button onClick={() => { setStep('register'); setError(''); }}
                    className="text-sm font-bold text-blue-600 hover:text-blue-700">
                    Don't have an account? Sign Up
                  </button>
                </div>
              </>
            )}

            {/* ── REGISTER FORM ── */}
            {step === 'register' && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h2>
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    <input className={fieldCls} placeholder="John Doe" value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <input className={fieldCls} placeholder="name@example.com" value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number</label>
                    <div className="flex gap-2">
                      <span className="flex items-center px-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 font-medium text-sm">+91</span>
                      <input className={fieldCls} placeholder="9876543210" maxLength={10} value={form.mobile}
                        onChange={e => setForm(f => ({ ...f, mobile: e.target.value.replace(/\D/g, '') }))} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                    <input className={fieldCls} type="password" placeholder="••••••••" value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                  </div>
                  <button disabled={isLoading} className={btnCls}>
                    {isLoading ? <Loader2 className="animate-spin" /> : <><span>Create Account</span><ArrowRight size={20} /></>}
                  </button>
                </form>

                <div className="mt-4">
                  <button onClick={handleGoogleSignIn} disabled={isLoading} 
                    className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-70">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Sign up with Google
                  </button>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                  <button onClick={() => { setStep('login'); setError(''); }}
                    className="text-sm font-bold text-blue-600 hover:text-blue-700">
                    Already have an account? Sign In
                  </button>
                </div>
              </>
            )}

            {/* ── SUCCESS ── */}
            {step === 'success' && (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="text-green-600 w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
                <p className="text-gray-500 mb-6">Your account has been created successfully.</p>
                <button onClick={() => { setStep('login'); setError(''); setForm({ name: '', email: '', mobile: '', password: '' }); }}
                  className={btnCls}>
                  Sign In Now <ArrowRight size={20} />
                </button>
              </div>
            )}

            {/* ── FORGOT PASSWORD ── */}
            {step === 'forgot-password' && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
                <p className="text-gray-500 mb-6 text-sm">Enter your email address and we'll send you a link to reset your password.</p>
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <input className={fieldCls} placeholder="name@example.com" value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <button disabled={isLoading} className={btnCls}>
                    {isLoading ? <Loader2 className="animate-spin" /> : <><span>Send Reset Link</span><ArrowRight size={20} /></>}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                  <button onClick={() => { setStep('login'); setError(''); }}
                    className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 w-full">
                    Back to Sign In
                  </button>
                </div>
              </>
            )}

            {/* ── SUCCESS RESET ── */}
            {step === 'success-reset' && (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <CheckCircle className="text-blue-600 w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
                <p className="text-gray-500 mb-6 text-sm">We've sent a password reset link to <strong>{form.email}</strong>.</p>
                <button onClick={() => { setStep('login'); setError(''); }}
                  className={btnCls}>
                  Back to Sign In
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">By continuing, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
}
