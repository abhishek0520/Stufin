import React, { useRef } from 'react';
import { Mail, Phone, Calendar, User, Camera, Award, ShieldCheck, TrendingUp, QrCode, Wallet } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileProps {
  user: UserProfile;
  onBack: () => void;
  onUpdateUser: (user: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onBack, onUpdateUser }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        // Limit file size to 2MB to prevent localStorage quotas issues
        if (file.size > 2 * 1024 * 1024) {
            alert("File is too large! Please upload an image smaller than 2MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            onUpdateUser({ ...user, avatarUrl: base64String });
        };
        reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 text-sm font-medium flex items-center gap-1 transition-colors"
        >
          ← Back to Dashboard
        </button>
        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-bold uppercase tracking-wider">
           Active Student
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: ID Card Style */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-xl text-white overflow-hidden relative">
                {/* Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black opacity-10 rounded-full -ml-16 -mb-16 blur-xl"></div>

                <div className="p-6 text-center relative z-10">
                    {/* Hidden File Input */}
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />

                    {/* Avatar Container with Hover Effect */}
                    <div 
                        className="w-28 h-28 mx-auto rounded-full border-4 border-white/30 shadow-lg overflow-hidden mb-4 relative group cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                        title="Click to change photo"
                    >
                        <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <Camera className="text-white w-8 h-8" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold font-marker tracking-wide">{user.name}</h2>
                    <p className="text-indigo-200 text-sm mt-1">{user.location}</p>
                    
                    <div className="mt-6 flex justify-center gap-4">
                         <div className="text-center">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1 backdrop-blur-sm">
                                <Award className="w-5 h-5 text-yellow-300" />
                            </div>
                            <p className="text-[10px] uppercase font-bold opacity-80">Level 5</p>
                         </div>
                         <div className="text-center">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1 backdrop-blur-sm">
                                <ShieldCheck className="w-5 h-5 text-green-300" />
                            </div>
                            <p className="text-[10px] uppercase font-bold opacity-80">Verified</p>
                         </div>
                    </div>
                </div>

                <div className="bg-black/20 p-4 backdrop-blur-md flex justify-between items-center">
                    <div>
                        <p className="text-[10px] uppercase opacity-60">Member Since</p>
                        <p className="font-mono text-sm">2023</p>
                    </div>
                    <QrCode className="w-8 h-8 opacity-80" />
                </div>
            </div>

            {/* Contact Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition-colors">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-sm uppercase tracking-wide">Contact Details</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                            <Mail className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-200 break-all">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                            <Phone className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{user.phone}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-3">
                        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                            <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Age</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{user.age} Years</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Details & Stats */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Bio Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 relative overflow-hidden transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 dark:text-gray-100">
                    <User size={100} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Student Bio</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed relative z-10">{user.bio}</p>
            </div>

            {/* Financial Health Stats (Gamified) */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
                <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Financial Health Score
                </h3>
                
                <div className="mb-6">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Overall Score</span>
                        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">78<span className="text-sm text-gray-400 font-normal">/100</span></span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">You are doing better than 65% of students in your age group!</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center border border-green-100 dark:border-green-900/30">
                        <p className="text-xs text-green-700 dark:text-green-300 font-semibold mb-1">Savings</p>
                        <p className="font-bold text-gray-900 dark:text-white">Good</p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 text-center border border-orange-100 dark:border-orange-900/30">
                        <p className="text-xs text-orange-700 dark:text-orange-300 font-semibold mb-1">Debt</p>
                        <p className="font-bold text-gray-900 dark:text-white">Moderate</p>
                    </div>
                     <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center border border-blue-100 dark:border-blue-900/30">
                        <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold mb-1">Budgeting</p>
                        <p className="font-bold text-gray-900 dark:text-white">Excellent</p>
                    </div>
                     <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center border border-purple-100 dark:border-purple-900/30">
                        <p className="text-xs text-purple-700 dark:text-purple-300 font-semibold mb-1">Investment</p>
                        <p className="font-bold text-gray-900 dark:text-white">Beginner</p>
                    </div>
                </div>
            </div>

            {/* Badges / Achievements */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Achievements</h3>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-600 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                        <div className="bg-yellow-100 dark:bg-yellow-900/40 p-1.5 rounded-full">
                            <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Debt Free</span>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-full border border-indigo-100 dark:border-indigo-900/40">
                        <div className="bg-indigo-100 dark:bg-indigo-900/40 p-1.5 rounded-full">
                            <Wallet className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="text-sm font-medium text-indigo-900 dark:text-indigo-200">Budget Master</span>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-600 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                        <div className="bg-green-100 dark:bg-green-900/40 p-1.5 rounded-full">
                            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">First Investment</span>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;