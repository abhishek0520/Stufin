import React from 'react';
import { ArrowRight, PieChart, Sparkles, Wallet, Sun, Moon } from 'lucide-react';
import Logo from './Logo';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
  onDemo: () => void;
  darkMode: boolean;
  toggleTheme: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onRegister, onDemo, darkMode, toggleTheme }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans selection:bg-indigo-100 selection:text-indigo-700 transition-colors duration-300">
      {/* Navbar for Landing */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <Logo className="w-8 h-8" />
           <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight font-marker">STUFIN</span>
        </div>
        <div className="flex items-center gap-4">
            <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
            >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={onLogin} 
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg"
            >
              Sign In
            </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-8 border border-indigo-100 dark:border-indigo-800 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Powered by Gemini 2.5
         </div>
         
         <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8 leading-tight animate-fade-in-up delay-100">
            Master Your Money <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              While You Study
            </span>
         </h1>
         
         <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-200">
            STUFIN is the intelligent finance companion designed specifically for students. Track expenses, visualize habits, and get actionable AI advice to build wealth early.
         </p>
         
         <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
           <button 
              onClick={onRegister}
              className="group bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20 hover:bg-indigo-700 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2"
           >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
           </button>
           <button 
              onClick={onDemo}
              className="px-8 py-4 rounded-full font-bold text-lg text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
           >
              View Demo
           </button>
         </div>
      </div>

      {/* Features Grid */}
      <div className="bg-gray-50 dark:bg-gray-900 py-24 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Everything you need to grow</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">We combine simple tracking with powerful AI to give you a complete picture of your financial health.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              <FeatureCard 
                 icon={<Wallet className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />}
                 title="Smart Tracking"
                 desc="Effortlessly log income and expenses. Categorize your spending to see exactly where your money goes every month."
              />
              <FeatureCard 
                 icon={<Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />}
                 title="AI Financial Mentor"
                 desc="Get personalized, actionable advice from our Gemini-powered advisor. It analyzes your habits to help you save more."
              />
              <FeatureCard 
                 icon={<PieChart className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
                 title="Visual Insights"
                 desc="Understand your financial health at a glance with beautiful, interactive charts and real-time balance summaries."
              />
           </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 py-12 transition-colors duration-300">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex justify-center items-center gap-2 mb-4 opacity-50">
                <Logo className="w-6 h-6 grayscale" />
                <span className="font-bold font-marker text-gray-900 dark:text-gray-500">STUFIN</span>
            </div>
            <p className="text-gray-400 mb-4">&copy; {new Date().getFullYear()} STUFIN Inc. Built for the future.</p>
            <div className="flex justify-center gap-6 text-sm text-gray-500">
               <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">Privacy</span>
               <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">Terms</span>
               <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">Contact</span>
            </div>
         </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:shadow-indigo-50 dark:hover:shadow-indigo-900/20 hover:-translate-y-1 transition-all duration-300">
     <div className="bg-gray-50 dark:bg-gray-750 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
        {icon}
     </div>
     <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
     <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;