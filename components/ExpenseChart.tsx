import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface FinancialChartProps {
  summary: {
    income: number;
    expenses: number;
    balance: number;
    debt: number;
    lent: number;
    emi: number;
  };
  currency: string;
  darkMode?: boolean;
}

const FinancialChart: React.FC<FinancialChartProps> = ({ summary, currency, darkMode }) => {
  const data = [
    { name: 'Income', amount: summary.income, color: '#10b981' }, // Green
    { name: 'Lend', amount: summary.lent, color: '#34d399' },   // Light Green
    { name: 'Balance', amount: summary.balance, color: '#3b82f6' }, // Blue
    { name: 'Expense', amount: summary.expenses, color: '#ef4444' }, // Red
    { name: 'Debt', amount: summary.debt, color: '#b91c1c' },   // Dark Red
    { name: 'EMI', amount: summary.emi, color: '#f97316' },     // Orange
  ];

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#374151" : "#e5e7eb"} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }} 
            dy={10}
          />
          <YAxis 
            hide={false}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: darkMode ? '#6b7280' : '#9ca3af' }}
            tickFormatter={(value) => `${currency}${value >= 1000 ? (value/1000).toFixed(1) + 'k' : value}`}
          />
          <Tooltip 
            cursor={{ fill: darkMode ? '#1f2937' : '#f3f4f6' }}
            formatter={(value: number) => [`${currency}${value.toLocaleString()}`, 'Amount']}
            contentStyle={{ 
                borderRadius: '12px', 
                border: darkMode ? '1px solid #374151' : 'none', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                color: darkMode ? '#f3f4f6' : '#111827'
            }}
          />
          <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={40}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialChart;