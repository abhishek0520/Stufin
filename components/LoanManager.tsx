import React, { useState } from 'react';
import { Plus, Trash2, Landmark, Calculator, Users, HandCoins, ArrowDownLeft, ArrowUpRight, Check, X } from 'lucide-react';
import { Loan, LoanType } from '../types';

interface LoanManagerProps {
  loans: Loan[];
  onAddLoan: (loan: Loan) => void;
  onUpdateLoan: (loan: Loan) => void;
  onDeleteLoan: (id: string) => void;
  currency: string;
}

const LoanManager: React.FC<LoanManagerProps> = ({ loans, onAddLoan, onUpdateLoan, onDeleteLoan, currency }) => {
  const [name, setName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [monthlyEMI, setMonthlyEMI] = useState('');
  const [loanType, setLoanType] = useState<LoanType>(LoanType.BANK_LOAN);

  const [payingLoanId, setPayingLoanId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !totalAmount) return;

    const newLoan: Loan = {
      id: crypto.randomUUID(),
      name,
      totalAmount: parseFloat(totalAmount),
      paidAmount: 0,
      interestRate: parseFloat(interestRate) || 0,
      monthlyEMI: parseFloat(monthlyEMI) || 0,
      startDate: new Date().toISOString(),
      type: loanType
    };

    onAddLoan(newLoan);
    // Reset form
    setName('');
    setTotalAmount('');
    setInterestRate('');
    setMonthlyEMI('');
  };

  const handlePaymentSubmit = (loan: Loan) => {
    const amount = paymentAmount;
    if (isNaN(amount) || amount <= 0) return;

    const updatedLoan = {
      ...loan,
      paidAmount: Math.min(loan.totalAmount, loan.paidAmount + amount)
    };
    onUpdateLoan(updatedLoan);
    setPayingLoanId(null);
    setPaymentAmount(0);
  };

  const startPayment = (loan: Loan) => {
      setPayingLoanId(loan.id);
      setPaymentAmount(0); // Start at 0 or suggest an EMI?
  };

  // Calculations
  const bankLoans = loans.filter(l => l.type === LoanType.BANK_LOAN);
  const borrowedLoans = loans.filter(l => l.type === LoanType.BORROWED_FROM_PEER);
  const lentLoans = loans.filter(l => l.type === LoanType.LENT_TO_PEER);

  // Total Liabilities (Bank + Borrowed)
  const totalLiabilities = 
    bankLoans.reduce((sum, l) => sum + (l.totalAmount - l.paidAmount), 0) + 
    borrowedLoans.reduce((sum, l) => sum + (l.totalAmount - l.paidAmount), 0);

  // Total Assets (Money I lent that hasn't been paid back)
  const totalAssets = lentLoans.reduce((sum, l) => sum + (l.totalAmount - l.paidAmount), 0);

  const totalMonthlyEMI = bankLoans.reduce((sum, l) => sum + l.monthlyEMI, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards - Compact */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-red-50 dark:bg-red-900/20 p-2.5 rounded-lg border border-red-100 dark:border-red-900/30 text-center">
            <p className="text-[10px] font-bold text-red-500 dark:text-red-400 uppercase tracking-wide">Total Debt</p>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{currency}{totalLiabilities.toLocaleString()}</h4>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-2.5 rounded-lg border border-green-100 dark:border-green-900/30 text-center">
            <p className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wide">Money Lend</p>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{currency}{totalAssets.toLocaleString()}</h4>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 p-2.5 rounded-lg border border-orange-100 dark:border-orange-900/30 text-center">
            <p className="text-[10px] font-bold text-orange-500 dark:text-orange-400 uppercase tracking-wide">Monthly EMI</p>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{currency}{totalMonthlyEMI.toLocaleString()}</h4>
        </div>
      </div>

      {/* Loan Form - Compact */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden transition-colors">
        {/* Decorative Graffiti */}
        <div className="absolute top-0 right-0 opacity-5 dark:opacity-10 pointer-events-none transform rotate-12">
            <HandCoins size={80} className="text-gray-900 dark:text-gray-100" />
        </div>

        <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
          {loanType === LoanType.BANK_LOAN && <Landmark className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
          {loanType === LoanType.BORROWED_FROM_PEER && <ArrowDownLeft className="w-4 h-4 text-red-600 dark:text-red-400" />}
          {loanType === LoanType.LENT_TO_PEER && <ArrowUpRight className="w-4 h-4 text-green-600 dark:text-green-400" />}
          Add Record
        </h3>

        {/* Type Selector */}
        <div className="flex p-0.5 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3">
            <button
                type="button"
                onClick={() => setLoanType(LoanType.BANK_LOAN)}
                className={`flex-1 py-1 text-[10px] sm:text-xs font-medium rounded-md transition-all ${
                    loanType === LoanType.BANK_LOAN 
                        ? 'bg-white dark:bg-gray-600 text-indigo-700 dark:text-indigo-300 shadow-sm' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
            >
                Bank Loan
            </button>
            <button
                type="button"
                onClick={() => setLoanType(LoanType.BORROWED_FROM_PEER)}
                className={`flex-1 py-1 text-[10px] sm:text-xs font-medium rounded-md transition-all ${
                    loanType === LoanType.BORROWED_FROM_PEER 
                        ? 'bg-white dark:bg-gray-600 text-red-600 dark:text-red-400 shadow-sm' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
            >
                Borrowed
            </button>
            <button
                type="button"
                onClick={() => setLoanType(LoanType.LENT_TO_PEER)}
                className={`flex-1 py-1 text-[10px] sm:text-xs font-medium rounded-md transition-all ${
                    loanType === LoanType.LENT_TO_PEER 
                        ? 'bg-white dark:bg-gray-600 text-green-600 dark:text-green-400 shadow-sm' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
            >
                Lend (Given)
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 relative z-10">
          <div>
            <input
              type="text"
              required
              className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder={loanType === LoanType.BANK_LOAN ? "Loan Name" : "Person Name"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div>
            <input
              type="number"
              required
              min="0"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder={`Total Amount (${currency})`}
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
            />
          </div>

          {loanType === LoanType.BANK_LOAN && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    placeholder="Interest Rate (%)"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    placeholder={`EMI (${currency})`}
                    value={monthlyEMI}
                    onChange={(e) => setMonthlyEMI(e.target.value)}
                  />
                </div>
              </div>
          )}

          <button
            type="submit"
            className={`w-full text-white py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2 ${
                loanType === LoanType.LENT_TO_PEER 
                ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800' 
                : loanType === LoanType.BORROWED_FROM_PEER 
                    ? 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800'
                    : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Record
          </button>
        </form>
      </div>

      {/* List */}
      <div className="flex flex-col">
        <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-3 px-1">Active Records</h3>
        <div className="space-y-3">
          {loans.length === 0 ? (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500 flex flex-col items-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                <Users className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No loans or debts recorded.</p>
            </div>
          ) : (
            loans.map((loan) => {
              const remaining = loan.totalAmount - loan.paidAmount;
              const isFullyPaid = remaining <= 0;
              const progressPercent = (loan.paidAmount / loan.totalAmount) * 100;
              
              const isPaying = payingLoanId === loan.id;

              return (
              <div key={loan.id} className={`border rounded-lg p-3 bg-white dark:bg-gray-800 shadow-sm relative overflow-hidden transition-all ${
                  isFullyPaid ? 'opacity-70 bg-gray-50 dark:bg-gray-800/50' : ''
              } ${
                  loan.type === LoanType.LENT_TO_PEER 
                    ? 'border-green-100 dark:border-green-900/40 hover:border-green-300 dark:hover:border-green-700' 
                    : loan.type === LoanType.BORROWED_FROM_PEER 
                        ? 'border-red-100 dark:border-red-900/40 hover:border-red-300 dark:hover:border-red-700' 
                        : 'border-indigo-100 dark:border-indigo-900/40 hover:border-indigo-300 dark:hover:border-indigo-700'
              }`}>
                {/* Type Badge */}
                <div className={`absolute top-0 right-0 px-2 py-0.5 text-[9px] font-bold uppercase rounded-bl-md ${
                     loan.type === LoanType.LENT_TO_PEER 
                        ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' 
                        : loan.type === LoanType.BORROWED_FROM_PEER 
                            ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' 
                            : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                }`}>
                    {loan.type === LoanType.BANK_LOAN ? 'Bank' : loan.type === LoanType.BORROWED_FROM_PEER ? 'Borrowed' : 'Lend'}
                </div>

                <div className="flex justify-between items-start mb-2 mt-1">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {loan.name}
                        {isFullyPaid && <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[9px] px-1.5 py-0.5 rounded-full">Closed</span>}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {loan.type === LoanType.BANK_LOAN ? (
                          <>
                            <span>{loan.interestRate}%</span>
                            <span>•</span>
                            <span>{currency}{loan.monthlyEMI}/mo</span>
                          </>
                      ) : (
                          <span className="italic">P2P</span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => onDeleteLoan(loan.id)}
                    className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors pt-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mt-2 mb-2">
                    <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-gray-500 dark:text-gray-400">
                             {loan.type === LoanType.LENT_TO_PEER ? 'Recovered' : 'Paid'}: {currency}{loan.paidAmount.toLocaleString()}
                        </span>
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                            {Math.round(progressPercent)}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                        <div 
                            className={`h-full rounded-full ${
                                loan.type === LoanType.LENT_TO_PEER ? 'bg-green-500 dark:bg-green-400' : 'bg-indigo-500 dark:bg-indigo-400'
                            }`}
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                </div>
                
                {/* Visual Amount & Action */}
                <div className="mt-2 flex justify-between items-end">
                    <div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">Remaining</div>
                        <div className={`text-base font-bold ${
                             loan.type === LoanType.LENT_TO_PEER ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        } ${isFullyPaid ? 'line-through opacity-50' : ''}`}>
                            {currency}{remaining.toLocaleString()}
                        </div>
                    </div>
                    
                    {!isFullyPaid && (
                        <div className="flex flex-col items-end w-full max-w-[180px]">
                             {!isPaying ? (
                                <button 
                                    onClick={() => startPayment(loan)}
                                    className={`px-2.5 py-1 rounded text-[10px] font-bold text-white shadow-sm transition-transform active:scale-95 ${
                                        loan.type === LoanType.LENT_TO_PEER 
                                            ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800' 
                                            : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800'
                                    }`}
                                >
                                    {loan.type === LoanType.LENT_TO_PEER ? 'Recover' : 'Pay'}
                                </button>
                             ) : (
                                <div className="flex flex-col gap-2 w-full animate-fade-in-up bg-gray-50 dark:bg-gray-700 p-2 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="range"
                                            min="0"
                                            max={remaining}
                                            value={paymentAmount}
                                            onChange={(e) => setPaymentAmount(Number(e.target.value))}
                                            className="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400"
                                        />
                                    </div>
                                    
                                    <div className="flex items-center gap-1">
                                        <input 
                                            type="number" 
                                            className="w-full px-1.5 py-1 text-xs border border-gray-300 dark:border-gray-500 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold"
                                            value={paymentAmount}
                                            onChange={(e) => setPaymentAmount(Number(e.target.value))}
                                            placeholder="Amt"
                                        />
                                        <button 
                                            onClick={() => handlePaymentSubmit(loan)}
                                            className="p-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 flex-shrink-0"
                                        >
                                            <Check size={14} />
                                        </button>
                                        <button 
                                            onClick={() => setPayingLoanId(null)}
                                            className="p-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-500 flex-shrink-0"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                             )}
                        </div>
                    )}
                </div>
              </div>
            )})
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanManager;