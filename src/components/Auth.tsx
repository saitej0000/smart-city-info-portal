import React from 'react';
import { useAuthStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Loader2, Mail, Phone, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Steps: 'login' | 'register' | 'email-otp' | 'mobile-otp' | 'success'
type Step = 'login' | 'register' | 'email-otp' | 'mobile-otp' | 'success';

const OTPInput = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <input
    type="text"
    inputMode="numeric"
    maxLength={6}
    value={value}
    onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
    className="w-full text-center text-3xl font-bold tracking-[1rem] px-4 py-4 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
    placeholder="------"
  />
);

export default function Auth() {
  const [step, setStep] = React.useState<Step>('login');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [otp, setOtp] = React.useState('');
  const [resendCooldown, setResendCooldown] = React.useState(0);

  // Form fields
  const [form, setForm] = React.useState({ name: '', email: '', mobile: '', password: '' });

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  // Cooldown timer
  React.useEffect(() => {
    if (resendCooldown > 0) {
      const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendCooldown]);

  const apiCall = async (endpoint: string, body: object) => {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let data: any;
    try { data = JSON.parse(text); }
    catch { throw new Error(`Server returned non-JSON: ${text.slice(0, 60)}...`); }
    if (!res.ok) throw new Error(data.error || 'Something went wrong');
    return data;
  };

  // --- Login ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setError('');
    try {
      const result = await apiCall('/api/auth/login', { email: form.email, password: form.password });
      setAuth(result.user, result.token);
      navigate('/dashboard');
    } catch (err: any) { setError(err.message); }
    finally { setIsLoading(false); }
  };

  // --- Register Step 1: Send Mobile OTP ---
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.mobile || !form.password) {
      return setError('All fields are required');
    }
    if (form.mobile.length !== 10) return setError('Enter a valid 10-digit mobile number');
    setIsLoading(true); setError('');
    try {
      await apiCall('/api/auth/send-mobile-otp', { mobile: form.mobile });
      setOtp('');
      setResendCooldown(60);
      setStep('mobile-otp');
    } catch (err: any) { setError(err.message); }
    finally { setIsLoading(false); }
  };

  // --- Register Step 2: Verify Mobile OTP → Create Account ---
  const handleVerifyMobile = async () => {
    if (otp.length !== 6) return setError('Enter the 6-digit OTP');
    setIsLoading(true); setError('');
    try {
      await apiCall('/api/auth/verify-mobile-otp', { mobile: form.mobile, code: otp });
      await apiCall('/api/auth/register', { name: form.name, email: form.email, mobile: form.mobile, password: form.password });
      setStep('success');
    } catch (err: any) { setError(err.message); }
    finally { setIsLoading(false); }
  };

  const handleResend = async () => {
    setError(''); setResendCooldown(60);
    try {
      await apiCall('/api/auth/send-mobile-otp', { mobile: form.mobile });
    } catch (err: any) { setError(err.message); }
  };

  const fieldCls = 'w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all';
  const btnCls = 'w-full bg-[#3182CE] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-70';

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#3182CE] rounded-2xl shadow-lg shadow-blue-200 mb-4">
            <ShieldCheck className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">CivicPulse</h1>
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
            {/* Error */}
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
                    <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                    <input className={fieldCls} type="password" placeholder="••••••••" value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                  </div>
                  <button disabled={isLoading} className={btnCls}>
                    {isLoading ? <Loader2 className="animate-spin" /> : <><span>Sign In</span><ArrowRight size={20} /></>}
                  </button>
                </form>
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
                    {isLoading ? <Loader2 className="animate-spin" /> : <><span>Continue</span><ArrowRight size={20} /></>}
                  </button>
                </form>
                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                  <button onClick={() => { setStep('login'); setError(''); }}
                    className="text-sm font-bold text-blue-600 hover:text-blue-700">
                    Already have an account? Sign In
                  </button>
                </div>
              </>
            )}

            {/* ── MOBILE OTP ── */}
            {step === 'mobile-otp' && (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-50 rounded-xl"><Phone className="text-green-600" size={24} /></div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Verify Mobile</h2>
                    <p className="text-sm text-gray-500">OTP sent to <strong>+91 {form.mobile}</strong></p>
                  </div>
                </div>
                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex-1 h-1.5 bg-blue-500 rounded-full" />
                  <div className="flex-1 h-1.5 bg-blue-500 rounded-full" />
                </div>
                <div className="space-y-4">
                  <OTPInput value={otp} onChange={v => { setOtp(v); setError(''); }} />
                  <button disabled={isLoading || otp.length !== 6} onClick={handleVerifyMobile} className={btnCls}>
                    {isLoading ? <Loader2 className="animate-spin" /> : <><span>Verify & Create Account</span><ArrowRight size={20} /></>}
                  </button>
                  <button onClick={handleResend} disabled={resendCooldown > 0}
                    className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400">
                    {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
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
                <p className="text-gray-500 mb-6">Your email and mobile have been verified successfully.</p>
                <button onClick={() => { setStep('login'); setError(''); setForm({ name: '', email: '', mobile: '', password: '' }); }}
                  className={btnCls}>
                  Sign In Now <ArrowRight size={20} />
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
