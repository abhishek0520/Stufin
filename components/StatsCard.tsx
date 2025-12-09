import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';

interface StatsCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
  currency: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, amount, type, currency }) => {
  let colorClass = '';
  let Icon = Wallet;

  switch (type) {
    case 'income':
      colorClass = 'text-green-600 dark:text-green-400';
      Icon = ArrowUpCircle;
      break;
    case 'expense':
      colorClass = 'text-red-600 dark:text-red-400';
      Icon = ArrowDownCircle;
      break;
    case 'balance':
      colorClass = amount >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400';
      Icon = Wallet;
      break;
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between transition-all hover:scale-[1.02]">
      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{title}</p>
        <h3 className={`text-xl font-bold mt-1 ${colorClass}`}>
          {currency}{amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h3>
      </div>
      <div className={`p-2 rounded-full bg-opacity-10 dark:bg-opacity-20 ${type === 'income' ? 'bg-green-100 dark:bg-green-900' : type === 'expense' ? 'bg-red-100 dark:bg-red-900' : 'bg-blue-100 dark:bg-blue-900'}`}>
        <Icon className={`w-5 h-5 ${colorClass}`} />
      </div>
    </div>
  );
};

export default StatsCard;