import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, Loader2, ArrowRight, AlertCircle, CheckCircle, User, MapPin, Calendar, LayoutGrid } from 'lucide-react';
import { UserProfile } from '../types';
import Logo from './Logo';

interface LoginProps {
  onSuccess: (email: string, password: string, rememberMe: boolean) => void;
  onNavigateAlternate: () => void;
  onNavigateReset: () => void;
  onBack: () => void;
  error?: string | null;
}

export const LoginPage: React.FC<LoginProps> = ({ onSuccess, onNavigateAlternate, onNavigateReset, onBack, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess(email, password, rememberMe);
    }, 800);
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative overflow-hidden flex-col justify-between p-12 text-white">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 opacity-20 rounded-full blur-3xl -ml-16 -mb-16"></div>
         
         <div className="relative z-10 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-8">
               <Logo variant="light" className="w-10 h-10" />
               <span className="text-2xl font-bold font-marker tracking-wider">STUFIN</span>
            </div>
         </div>

         <div className="relative z-10 max-w-lg space-y-6 animate-fade-in-up delay-100">
            <h1 className="text-5xl font-extrabold leading-tight">
               Master your wallet,<br/> 
               <span className="text-indigo-200">ace your future.</span>
            </h1>
            <p className="text-lg text-indigo-100 opacity-90">
               Join thousands of students who are taking control of their student loans, daily expenses, and savings goals with AI-powered insights.
            </p>
         </div>

         <div className="relative z-10 text-sm opacity-60 animate-fade-in-up delay-200">
            © {new Date().getFullYear()} STUFIN Inc.
         </div>
      </div>

      {/* Right Panel - Form (Dark Mode / Inverse) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-gray-900 relative">
        <button 
           onClick={onBack} 
           className="absolute top-8 right-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
        >
           Back to Home <ArrowRight className="w-4 h-4" />
        </button>

        <div className="w-full max-w-md space-y-8 animate-slide-in-right">
           <div className="text-center lg:text-left">
              <div className="lg:hidden flex justify-center mb-4">
                 <Logo variant="light" className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Welcome back!</h2>
              <p className="mt-2 text-gray-400">Please enter your details to sign in.</p>
           </div>

           {error && (
             <div className="bg-red-900/50 border-l-4 border-red-500 text-red-200 p-4 rounded-r-lg flex items-center gap-3 animate-pulse">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
                <p className="text-sm font-medium">{error}</p>
             </div>
           )}

           <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                 <div className="relative group">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">Email</label>
                    <div className="relative">
                       <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                       <input
                         type="email"
                         required
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-white placeholder-gray-500"
                         placeholder="student@university.edu"
                       />
                    </div>
                 </div>

                 <div className="relative group">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">Password</label>
                    <div className="relative">
                       <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                       <input
                         type="password"
                         required
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-white placeholder-gray-500"
                         placeholder="••••••••"
                       />
                    </div>
                 </div>
              </div>

              <div className="flex items-center justify-between">
                 <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-indigo-500 focus:ring-indigo-400 border-gray-600 rounded cursor-pointer bg-gray-700"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300 cursor-pointer">
                      Remember me
                    </label>
                 </div>
                 <button 
                   type="button" 
                   onClick={onNavigateReset}
                   className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                 >
                   Forgot password?
                 </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-900/20 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
              </button>
           </form>

           <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900 text-gray-500">Don't have an account?</span>
              </div>
           </div>

           <button
              onClick={onNavigateAlternate}
              className="w-full flex justify-center py-3.5 px-4 border border-gray-700 rounded-xl text-sm font-bold text-gray-300 bg-gray-800 hover:bg-gray-700 hover:border-gray-600 transition-all"
           >
              Create Account
           </button>
        </div>
      </div>
    </div>
  );
};

interface RegisterProps {
  onSuccess: (user: UserProfile) => void;
  onNavigateAlternate: () => void;
  onBack: () => void;
}

export const RegisterPage: React.FC<RegisterProps> = ({ onSuccess, onNavigateAlternate, onBack }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const newUser: UserProfile = {
        name,
        email,
        phone: "+1 (555) 000-0000",
        age: parseInt(age) || 20,
        location: city || "Unknown City",
        bio: "Student exploring financial independence.",
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`,
        password: password
      };
      onSuccess(newUser);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-950 relative overflow-hidden flex-col justify-between p-12 text-white">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-gray-900 to-black opacity-80"></div>
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 opacity-20 rounded-full blur-3xl -mr-32 -mt-32"></div>
         
         <div className="relative z-10 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-8">
               <Logo variant="light" className="w-10 h-10" />
               <span className="text-2xl font-bold font-marker tracking-wider">STUFIN</span>
            </div>
         </div>

         <div className="relative z-10 max-w-lg space-y-6 animate-fade-in-up delay-100">
            <h1 className="text-5xl font-extrabold leading-tight">
               Start your journey <br/> 
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">to financial freedom.</span>
            </h1>
            <div className="flex gap-4 mt-8">
               <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
                  <div className="font-bold text-2xl mb-1 text-white">Track</div>
                  <div className="text-sm opacity-70 text-gray-300">Expenses & Loans</div>
               </div>
               <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
                  <div className="font-bold text-2xl mb-1 text-white">Learn</div>
                  <div className="text-sm opacity-70 text-gray-300">From AI Mentor</div>
               </div>
            </div>
         </div>

         <div className="relative z-10 text-sm opacity-60 animate-fade-in-up delay-200">
            © {new Date().getFullYear()} STUFIN Inc.
         </div>
      </div>

      {/* Right Panel - Form (Dark Mode) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-gray-900 relative overflow-y-auto">
        <button 
           onClick={onBack} 
           className="absolute top-8 right-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
        >
           Back to Home <ArrowRight className="w-4 h-4" />
        </button>

        <div className="w-full max-w-lg space-y-6 animate-slide-in-right my-auto">
           <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
              <p className="mt-2 text-gray-400">It only takes a minute to get started.</p>
           </div>

           <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div className="relative">
                     <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">Full Name</label>
                     <div className="relative">
                       <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                       <input
                         type="text"
                         required
                         value={name}
                         onChange={(e) => setName(e.target.value)}
                         className="w-full pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-gray-500"
                         placeholder="John Doe"
                       />
                     </div>
                 </div>
                 
                 <div className="relative">
                     <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">Age</label>
                     <div className="relative">
                       <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                       <input
                         type="number"
                         required
                         value={age}
                         onChange={(e) => setAge(e.target.value)}
                         className="w-full pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-gray-500"
                         placeholder="20"
                       />
                     </div>
                 </div>
              </div>

              <div className="relative">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-gray-500"
                      placeholder="you@example.com"
                    />
                  </div>
              </div>

              <div className="relative">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-gray-500"
                      placeholder="City, Country"
                    />
                  </div>
              </div>

              <div className="relative">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-gray-500"
                      placeholder="Create a strong password"
                    />
                  </div>
              </div>

              <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-900/20 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
                  </button>
              </div>
           </form>

           <div className="text-center mt-6">
             <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <button
                    onClick={onNavigateAlternate}
                    className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                    Sign in
                </button>
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

interface ResetPasswordProps {
  onSuccess: (email: string, newPassword: string) => void;
  onBack: () => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordProps> = ({ onSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess(email, newPassword);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
       <div className="bg-gray-800 w-full max-w-md rounded-2xl shadow-xl border border-gray-700 overflow-hidden animate-fade-in-up">
          <div className="bg-indigo-600 p-6 text-center text-white">
             <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
                 <LayoutGrid className="w-6 h-6 text-white" />
             </div>
             <h2 className="text-2xl font-bold">Reset Password</h2>
             <p className="text-indigo-100 text-sm mt-1">Get back into your account</p>
          </div>
          
          <div className="p-8">
             {step === 1 ? (
                <form className="space-y-5" onSubmit={handleSendCode}>
                   <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Email address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-gray-400"
                        placeholder="you@example.com"
                      />
                   </div>
                   <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-900/20 transition-all flex justify-center"
                   >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Code"}
                   </button>
                </form>
             ) : (
                <form className="space-y-5" onSubmit={handleReset}>
                   <div className="bg-green-900/30 p-3 rounded-lg flex items-center gap-2 text-green-400 text-sm border border-green-800">
                      <CheckCircle className="w-5 h-5" />
                      Code sent! Enter new password.
                   </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-gray-400"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-gray-400"
                      placeholder="••••••••"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-900/20 transition-all flex justify-center"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
                  </button>
                </form>
             )}
             
             <div className="mt-6 text-center">
                <button onClick={onBack} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                    Cancel and go back
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};