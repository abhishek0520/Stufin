import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, TransactionType, Category, Loan } from "../types";

// Initialize the Gemini AI client
// Note: API Key must be provided via environment variable process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes the user's financial transactions and loans to provide personalized advice.
 * Focuses on Financial Independence.
 */
export const getFinancialAdvice = async (transactions: Transaction[], loans: Loan[] = [], currency: string = '$'): Promise<string> => {
  if (transactions.length === 0 && loans.length === 0) {
    return "Please add some income, expenses, or loan details so I can analyze your path to financial independence!";
  }

  // Prepare the data summary for the AI
  const income = transactions.filter(t => t.type === TransactionType.INCOME);
  const expenses = transactions.filter(t => t.type === TransactionType.EXPENSE);
  
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
  
  const totalDebt = loans.reduce((sum, l) => sum + (l.totalAmount - l.paidAmount), 0);
  const totalMonthlyEMI = loans.reduce((sum, l) => sum + l.monthlyEMI, 0);

  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const prompt = `
    You are a financial mentor for a college student named Abhishek (age 20) living in Bhopal. 
    Your goal is to guide them towards **Financial Independence**.
    
    Analyze the following financial data (Currency: ${currency}):

    **Monthly Cash Flow:**
    - Total Income: ${currency}${totalIncome.toFixed(2)}
    - Total Expenses (excluding Loans): ${currency}${totalExpense.toFixed(2)}
    - Net Balance: ${currency}${(totalIncome - totalExpense).toFixed(2)}

    **Debt Profile:**
    - Total Outstanding Debt: ${currency}${totalDebt.toFixed(2)}
    - Total Monthly EMI Obligations: ${currency}${totalMonthlyEMI.toFixed(2)}
    - Active Loans: ${loans.map(l => `${l.name} (${l.interestRate}% Interest)`).join(', ') || "None"}

    **Expense Breakdown:**
    ${Object.entries(expensesByCategory).map(([cat, amount]) => `- ${cat}: ${currency}${amount.toFixed(2)}`).join('\n')}

    **Instructions:**
    1. **Debt Strategy**: If they have loans, suggest a repayment strategy (e.g., Avalanche vs Snowball). If high interest, prioritize that.
    2. **Spending Habits**: Identify areas to cut costs to increase the "Gap" (Income - Expense).
    3. **Investment**: Suggest small, safe investment habits suitable for a 20-year-old student (e.g., SIPs, Emergency Fund) to start wealth compounding.
    4. **Financial Independence**: Give a specific tip on how to reach financial independence faster based on their current numbers.
    5. Keep the tone encouraging but realistic. Format with Markdown (Bold, Lists).
    6. Always use the symbol '${currency}' for money values in your response.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a savvy, motivational financial coach.",
      }
    });

    return response.text || "I couldn't generate advice at this moment. Please try again.";
  } catch (error) {
    console.error("Error generating advice:", error);
    return "Sorry, I encountered an error while analyzing your finances. Please ensure your API key is configured correctly.";
  }
};

/**
 * Parses natural language text into a structured transaction object.
 */
export const parseTransactionFromText = async (text: string): Promise<Partial<Transaction> | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Extract transaction details from this text: "${text}".`,
      config: {
        systemInstruction: `You are a financial data parser. 
        Extract the description, amount, type (INCOME or EXPENSE), and category from the text.
        
        Rules:
        - Categories must be one of: ${Object.values(Category).join(', ')}.
        - If category is unclear, infer it based on description (e.g., 'burger' -> Food & Dining).
        - If type is unclear, default to EXPENSE.
        - Return strictly JSON.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            type: { type: Type.STRING, enum: [TransactionType.INCOME, TransactionType.EXPENSE] },
            category: { type: Type.STRING, enum: Object.values(Category) },
          },
          required: ["description", "amount", "type", "category"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Partial<Transaction>;
    }
    return null;
  } catch (error) {
    console.error("Error parsing transaction text:", error);
    return null;
  }
};