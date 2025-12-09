export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum Category {
  FOOD = 'Food & Dining',
  TRANSPORT = 'Transportation',
  HOUSING = 'Housing & Rent',
  ENTERTAINMENT = 'Entertainment',
  UTILITIES = 'Utilities',
  EDUCATION = 'Education',
  SHOPPING = 'Shopping',
  SAVINGS = 'Savings & Investments',
  HEALTH = 'Health & Fitness',
  DEBT = 'Debt & Loans',
  OTHER = 'Other'
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string;
}

export enum LoanType {
  BANK_LOAN = 'BANK_LOAN',
  BORROWED_FROM_PEER = 'BORROWED_FROM_PEER',
  LENT_TO_PEER = 'LENT_TO_PEER'
}

export interface Loan {
  id: string;
  name: string;
  totalAmount: number;
  paidAmount: number;
  interestRate: number; // 0 for most peer loans
  monthlyEMI: number; // 0 for one-time payments
  startDate: string;
  type: LoanType;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface AdviceResponse {
  advice: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  age: number;
  location: string;
  bio: string;
  avatarUrl: string;
  password?: string; 
}