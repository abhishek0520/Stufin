import React, { useState } from 'react';
import { Sparkles, RefreshCw, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Transaction, Loan } from '../types';
import { getFinancialAdvice } from '../services/gemini';

interface AIAdvisorProps {
  transactions: Transaction[];
  loans: Loan[];
  currency: string;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ transactions, loans, currency }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetAdvice = async () => {
    setLoading(true);
    try {
      const result = await getFinancialAdvice(transactions, loans, currency);
      setAdvice(result);
    } catch (e) {
        setAdvice("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-xl shadow-lg p-4 text-white overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500 opacity-20 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <h2 className="text-lg font-bold font-marker tracking-wide">Financial Mentor</h2>
          </div>
          <button
            onClick={handleGetAdvice}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            {advice ? 'Refresh' : 'Get Tips'}
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10 min-h-[150px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full py-6 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-300" />
              <p className="text-sm text-indigo-200 animate-pulse">Analyzing...</p>
            </div>
          ) : advice ? (
            <div className="prose prose-invert prose-sm max-w-none text-sm">
              <ReactMarkdown>{advice}</ReactMarkdown>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-6 text-center text-indigo-200">
              <p className="mb-1 font-medium text-base">Want to be Financially Independent?</p>
              <p className="text-xs opacity-75 max-w-sm mx-auto">
                I can analyze your loans, income, and expenses to suggest debt-payoff strategies and investment tips.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;