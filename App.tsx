import React, { useState, useEffect } from 'react';
import { LayoutDashboard, LogOut, Calculator, Globe, Banknote, CreditCard, BarChart3, Sun, Moon } from 'lucide-react';
import StatsCard from './components/StatsCard';
import ExpenseChart from './components/ExpenseChart';
import TransactionManager from './components/TransactionManager';
import LoanManager from './components/LoanManager';
import AIAdvisor from './components/AIAdvisor';
import LandingPage from './components/LandingPage';
import Profile from './components/Profile';
import { LoginPage, RegisterPage, ResetPasswordPage } from './components/Auth';
import Logo from './components/Logo';
import { Transaction, TransactionType, UserProfile, Loan, Category, LoanType } from './types';

type ViewState = 'landing' | 'login' | 'register' | 'dashboard' | 'profile' | 'reset-password';
type TabState = 'transactions' | 'loans';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [authError, setAuthError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>('₹'); // Default to Rupee
  const [activeTab, setActiveTab] = useState<TabState>('transactions');
  
  // Theme State
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Initialize Theme from LocalStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('stufin_theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !savedTheme) {
      // Auto-detect if no preference saved
      setDarkMode(true);
    }
  }, []);

  // Apply Theme Class to Body/Container
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('stufin_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('stufin_theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // --- MOCK AUTHENTICATION & DATABASE SYSTEM ---
  // Default user: Abhishek Raj
  const DEFAULT_USER: UserProfile = {
    name: "Abhishek Raj",
    email: "abhishekraj906032@gmail.com",
    phone: "+91 90603 2XXXX",
    age: 20,
    location: "Bhopal, India",
    bio: "Student pursuing financial independence. Focused on reducing EMI burden and increasing savings.",
    avatarUrl: "https://ui-avatars.com/api/?name=Abhishek+Raj&background=6366f1&color=fff",
    password: "#Abhi1234" 
  };

  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER);

  // Load users from LocalStorage on mount to simulate a database
  useEffect(() => {
    const storedUsers = localStorage.getItem('studentfin_users');
    let users = [];
    if (storedUsers) {
      users = JSON.parse(storedUsers);
    }
    
    // Ensure default user exists in "Database"
    let usersUpdated = false;
    const defaultUserExists = users.find((u: UserProfile) => u.email === DEFAULT_USER.email);
    if (!defaultUserExists) {
      users.push(DEFAULT_USER);
      usersUpdated = true;
      
      // Initialize default data for default user if not present
      const dbKey = `studentfin_data_${DEFAULT_USER.email}`;
      if (!localStorage.getItem(dbKey)) {
          const defaultData = {
              transactions: [
                {
                  id: '1',
                  description: 'Part-time Internship',
                  amount: 8000,
                  type: TransactionType.INCOME,
                  category: Category.OTHER,
                  date: new Date().toISOString()
                },
                {
                  id: '2',
                  description: 'PG Rent',
                  amount: 3500,
                  type: TransactionType.EXPENSE,
                  category: Category.HOUSING,
                  date: new Date().toISOString()
                },
                {
                  id: '3',
                  description: 'Mess Fees',
                  amount: 2500,
                  type: TransactionType.EXPENSE,
                  category: Category.FOOD,
                  date: new Date().toISOString()
                },
              ],
              loans: [
                {
                    id: '101',
                    name: 'Education Loan',
                    totalAmount: 200000,
                    paidAmount: 20000,
                    interestRate: 8.5,
                    monthlyEMI: 2500,
                    startDate: new Date().toISOString(),
                    type: LoanType.BANK_LOAN
                }
              ]
          };
          localStorage.setItem(dbKey, JSON.stringify(defaultData));
      }
    }

    if (usersUpdated) {
        localStorage.setItem('studentfin_users', JSON.stringify(users));
    }

    // --- SESSION CHECK (Remember Me) ---
    const sessionEmail = localStorage.getItem('studentfin_session');
    if (sessionEmail) {
        const returningUser = users.find((u: UserProfile) => u.email === sessionEmail);
        if (returningUser) {
            setUserProfile(returningUser);
            loadUserData(returningUser.email);
            setCurrentView('dashboard');
        }
    }

  }, []);

  const handleLogin = (email: string, password: string, rememberMe: boolean) => {
    setAuthError(null);
    const storedUsers = JSON.parse(localStorage.getItem('studentfin_users') || '[]');
    const user = storedUsers.find((u: UserProfile) => u.email.toLowerCase() === email.toLowerCase());

    if (user) {
      if (user.password === password) {
          setUserProfile(user);
          loadUserData(user.email);
          setCurrentView('dashboard');

          if (rememberMe) {
              localStorage.setItem('studentfin_session', email);
          } else {
              localStorage.removeItem('studentfin_session');
          }

      } else {
          setAuthError("Incorrect password. Please try again or reset it.");
      }
    } else {
      setAuthError("Account not found. Please create a new account.");
    }
  };

  const handleRegister = (newUser: UserProfile) => {
    const storedUsers = JSON.parse(localStorage.getItem('studentfin_users') || '[]');
    const userExists = storedUsers.find((u: UserProfile) => u.email.toLowerCase() === newUser.email.toLowerCase());
    
    if (userExists) {
        setUserProfile(userExists);
        loadUserData(userExists.email);
    } else {
        const updatedUsers = [...storedUsers, newUser];
        localStorage.setItem('studentfin_users', JSON.stringify(updatedUsers));
        setUserProfile(newUser);
        setTransactions([]);
        setLoans([]);
    }
    setCurrentView('dashboard');
    // Clear session on new register unless we explicitly want to remember new signups
    localStorage.removeItem('studentfin_session'); 
  };

  const handlePasswordReset = (email: string, newPassword: string) => {
    const storedUsers = JSON.parse(localStorage.getItem('studentfin_users') || '[]');
    const updatedUsers = storedUsers.map((u: UserProfile) => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        return { ...u, password: newPassword };
      }
      return u;
    });
    localStorage.setItem('studentfin_users', JSON.stringify(updatedUsers));
    setCurrentView('login');
    setAuthError(null); // Clear any previous errors
  };

  const handleUpdateUserProfile = (updatedUser: UserProfile) => {
    setUserProfile(updatedUser);
    
    // Update persistence
    const storedUsers = JSON.parse(localStorage.getItem('studentfin_users') || '[]');
    const updatedUsers = storedUsers.map((u: UserProfile) => {
        if (u.email === updatedUser.email) {
            return updatedUser;
        }
        return u;
    });
    localStorage.setItem('studentfin_users', JSON.stringify(updatedUsers));
  };

  // ----------------------------------

  // State for Transactions & Loans
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);

  // DB LOADER
  const loadUserData = (email: string) => {
      const dbKey = `studentfin_data_${email}`;
      const data = localStorage.getItem(dbKey);
      if (data) {
          const parsed = JSON.parse(data);
          setTransactions(parsed.transactions || []);
          setLoans(parsed.loans || []);
      } else {
          setTransactions([]);
          setLoans([]);
      }
  };

  // DB SAVER
  useEffect(() => {
      if (currentView === 'dashboard' || currentView === 'profile') {
          const dbKey = `studentfin_data_${userProfile.email}`;
          const data = {
              transactions,
              loans
          };
          localStorage.setItem(dbKey, JSON.stringify(data));
      }
  }, [transactions, loans, userProfile, currentView]);


  // --- FINANCIAL CALCULATIONS ---
  
  // 1. Transaction Income & Expenses
  const transactionIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const transactionExpense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);
  
  // 2. Loan & Debt Calculations
  const bankLoans = loans.filter(l => l.type === LoanType.BANK_LOAN);
  const borrowedLoans = loans.filter(l => l.type === LoanType.BORROWED_FROM_PEER);
  const lentLoans = loans.filter(l => l.type === LoanType.LENT_TO_PEER);

  // "Borrowed Amount" (New loans taken) -> Treated as Income
  const totalBorrowedAmount = borrowedLoans.reduce((sum, l) => sum + l.totalAmount, 0);
  
  // "Lend Amount" (New loans given) -> Treated as Expense
  const totalLentAmount = lentLoans.reduce((sum, l) => sum + l.totalAmount, 0);

  // "Monthly EMI" -> Treated as Expense (Projected)
  const totalMonthlyEMI = loans.reduce((sum, l) => sum + l.monthlyEMI, 0);

  // "Borrowed Paid" (Repaying debt) -> Treated as Expense
  const totalBorrowedPaid = borrowedLoans.reduce((sum, l) => sum + l.paidAmount, 0);

  // "Lent Recovered" (Getting money back) -> Treated as Income
  const totalLentRecovered = lentLoans.reduce((sum, l) => sum + l.paidAmount, 0);

  // --- FINAL TOTALS ---
  const totalIncome = transactionIncome + totalBorrowedAmount + totalLentRecovered;
  const totalExpense = transactionExpense + totalLentAmount + totalMonthlyEMI + totalBorrowedPaid;
  const balance = totalIncome - totalExpense;

  // Outstanding amounts for display
  const totalOutstandingDebt = 
    bankLoans.reduce((sum, l) => sum + (l.totalAmount - l.paidAmount), 0) + 
    borrowedLoans.reduce((sum, l) => sum + (l.totalAmount - l.paidAmount), 0);

  const totalOutstandingLent = lentLoans.reduce((sum, l) => sum + (l.totalAmount - l.paidAmount), 0);


  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions(prev => [...prev, newTransaction]);
  };

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleAddLoan = (newLoan: Loan) => {
    setLoans(prev => [...prev, newLoan]);
  };

  const handleUpdateLoan = (updatedLoan: Loan) => {
    setLoans(prev => prev.map(l => l.id === updatedLoan.id ? updatedLoan : l));
  };

  const handleDeleteLoan = (id: string) => {
    setLoans(prev => prev.filter(l => l.id !== id));
  };

  const navigateToDashboard = () => setCurrentView('dashboard');
  const navigateToLogin = () => { setAuthError(null); setCurrentView('login'); };
  const navigateToRegister = () => setCurrentView('register');
  const navigateToResetPassword = () => setCurrentView('reset-password');
  // Logs out and goes to landing
  const navigateToLanding = () => { 
      localStorage.removeItem('studentfin_session');
      setCurrentView('landing');
  };
  const navigateToProfile = () => setCurrentView('profile');

  // View Routing
  if (currentView === 'landing') {
    return (
      <LandingPage 
        onLogin={navigateToLogin} 
        onRegister={navigateToRegister}
        onDemo={() => {
            // For Demo, just load default user data without persistence warnings or checks
            setUserProfile(DEFAULT_USER);
            loadUserData(DEFAULT_USER.email);
            setCurrentView('dashboard');
        }}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      />
    );
  }

  if (currentView === 'login') {
    return (
      <LoginPage 
        onSuccess={handleLogin}
        onNavigateAlternate={navigateToRegister}
        onNavigateReset={navigateToResetPassword}
        onBack={navigateToLanding}
        error={authError}
      />
    );
  }

  if (currentView === 'register') {
    return (
      <RegisterPage 
        onSuccess={handleRegister}
        onNavigateAlternate={navigateToLogin}
        onBack={navigateToLanding}
      />
    );
  }

  if (currentView === 'reset-password') {
    return (
      <ResetPasswordPage
        onSuccess={handlePasswordReset}
        onBack={navigateToLogin}
      />
    );
  }

  if (currentView === 'profile') {
    return (
      <div className="min-h-screen pb-20 dark:bg-gray-950 transition-colors duration-300">
        <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={navigateToDashboard}>
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
               <button onClick={navigateToDashboard} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors">
                  <LayoutDashboard className="w-5 h-5" />
               </button>
            </div>
          </div>
        </div>
      </nav>
        <Profile 
            user={userProfile} 
            onBack={navigateToDashboard} 
            onUpdateUser={handleUpdateUserProfile}
        />
      </div>
    )
  }

  // Dashboard View
  return (
    <div className="min-h-screen pb-20 dark:bg-gray-950 transition-colors duration-300">
      {/* Navbar */}
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={navigateToLanding}>
              <Logo className="w-8 h-8" />
              <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight font-marker">STUFIN</span>
            </div>
            <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <button 
                  onClick={toggleTheme} 
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                  title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Currency Selector */}
                <div className="relative group hidden sm:flex items-center">
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700">
                        <Globe className="w-3.5 h-3.5" />
                        <select 
                            value={currency} 
                            onChange={(e) => setCurrency(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 cursor-pointer outline-none appearance-none pr-4 font-sans text-xs dark:bg-gray-800 dark:text-gray-200"
                            style={{ backgroundImage: 'none' }}
                        >
                            <option value="$">USD ($)</option>
                            <option value="₹">INR (₹)</option>
                            <option value="€">EUR (€)</option>
                            <option value="£">GBP (£)</option>
                        </select>
                    </div>
                </div>

                <div className="hidden md:flex flex-col items-end mr-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{userProfile.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{userProfile.location}</span>
                </div>
                <button 
                  onClick={navigateToProfile}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                >
                  <img src={userProfile.avatarUrl} alt="User" className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700 shadow-sm" />
                  <span className="text-sm font-medium hidden sm:block">Profile</span>
                </button>
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
                <button 
                  onClick={navigateToLanding}
                  className="text-gray-500 dark:text-gray-400 hover:text-red-600 flex items-center gap-1 text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* 1. TOP SECTION: Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard title="Monthly Income" amount={totalIncome} type="income" currency={currency} />
          <StatsCard title="Monthly Expenses" amount={totalExpense} type="expense" currency={currency} />
          <StatsCard title="Net Balance" amount={balance} type="balance" currency={currency} />
          
          {/* Loan & Debt Summary Cards - Manual Dark Mode styling */}
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30 transition-transform hover:scale-[1.02] flex items-center justify-between">
             <div>
                <p className="text-xs font-semibold text-red-500 dark:text-red-400 uppercase tracking-wide">Total Debt</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">{currency}{totalOutstandingDebt.toLocaleString()}</h3>
             </div>
             <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/40 bg-opacity-20">
                <CreditCard className="w-5 h-5 text-red-600 dark:text-red-400" />
             </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900/30 transition-transform hover:scale-[1.02] flex items-center justify-between">
             <div>
                <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">Money Lend</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">{currency}{totalOutstandingLent.toLocaleString()}</h3>
             </div>
             <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/40 bg-opacity-20">
                <Banknote className="w-5 h-5 text-green-600 dark:text-green-400" />
             </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30 transition-transform hover:scale-[1.02] flex items-center justify-between">
             <div>
                <p className="text-xs font-semibold text-orange-500 dark:text-orange-400 uppercase tracking-wide">Monthly EMI</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">{currency}{totalMonthlyEMI.toLocaleString()}</h3>
             </div>
             <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/40 bg-opacity-20">
                <Calculator className="w-5 h-5 text-orange-600 dark:text-orange-400" />
             </div>
          </div>
        </div>

        {/* 2. MAIN SECTION: Finance Hub (Transactions & Loans) moved to top */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col transition-colors duration-300">
            {/* Tabs Header */}
            <div className="flex border-b border-gray-100 dark:border-gray-800">
                <button
                    onClick={() => setActiveTab('transactions')}
                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors relative ${
                        activeTab === 'transactions' 
                            ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20' 
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                >
                    <Banknote className="w-4 h-4" />
                    Transactions
                    {activeTab === 'transactions' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-500"></div>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('loans')}
                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors relative ${
                        activeTab === 'loans' 
                            ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20' 
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                >
                    <CreditCard className="w-4 h-4" />
                    Loans & Debts
                    {activeTab === 'loans' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-500"></div>
                    )}
                </button>
            </div>

            {/* Tab Content */}
            <div className="p-4">
                {activeTab === 'transactions' ? (
                    <TransactionManager 
                        transactions={transactions} 
                        onAddTransaction={handleAddTransaction}
                        onUpdateTransaction={handleUpdateTransaction}
                        onDeleteTransaction={handleDeleteTransaction}
                        currency={currency}
                    />
                ) : (
                    <LoanManager 
                        loans={loans}
                        onAddLoan={handleAddLoan}
                        onUpdateLoan={handleUpdateLoan}
                        onDeleteLoan={handleDeleteLoan}
                        currency={currency}
                    />
                )}
            </div>
        </div>

        {/* 3. CHART SECTION: Financial Breakdown moved below Hub */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col transition-colors duration-300">
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                Financial Breakdown
            </h3>
            <div className="flex-1 flex items-center justify-center min-h-[300px]">
                {/* Updated chart to show all info */}
                <ExpenseChart 
                    summary={{
                        income: totalIncome,
                        expenses: totalExpense, // Showing total including repayments
                        balance: balance,
                        debt: totalOutstandingDebt,
                        lent: totalOutstandingLent,
                        emi: totalMonthlyEMI
                    }}
                    currency={currency} 
                    darkMode={darkMode}
                />
            </div>
        </div>

        {/* 4. BOTTOM SECTION: AI Mentor */}
        <div className="w-full">
            <AIAdvisor transactions={transactions} loans={loans} currency={currency} />
        </div>

      </main>
    </div>
  );
};

export default App;