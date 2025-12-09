import React, { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown, Mic, MicOff, Loader2, Sparkles, Pencil, X, Save } from 'lucide-react';
import { Transaction, TransactionType, Category } from '../types';
import { parseTransactionFromText } from '../services/gemini';

interface TransactionManagerProps {
  transactions: Transaction[];
  onAddTransaction: (t: Transaction) => void;
  onUpdateTransaction: (t: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  currency: string;
}

const TransactionManager: React.FC<TransactionManagerProps> = ({ transactions, onAddTransaction, onUpdateTransaction, onDeleteTransaction, currency }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState<Category>(Category.FOOD);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        handleVoiceInput(transcript);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        setIsProcessingVoice(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const handleVoiceInput = async (text: string) => {
    setIsProcessingVoice(true);
    try {
      const result = await parseTransactionFromText(text);
      if (result) {
        if (result.description) setDescription(result.description);
        if (result.amount) setAmount(result.amount.toString());
        if (result.type) setType(result.type as TransactionType);
        if (result.category) setCategory(result.category as Category);
      }
    } catch (error) {
      console.error("Failed to parse voice input", error);
    } finally {
      setIsProcessingVoice(false);
    }
  };

  const toggleListening = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      setIsListening(true);
      recognition.start();
    }
  };

  const startEditing = (t: Transaction) => {
    setEditingId(t.id);
    setDescription(t.description);
    setAmount(t.amount.toString());
    setType(t.type);
    setCategory(t.category);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setDescription('');
    setAmount('');
    setType(TransactionType.EXPENSE);
    setCategory(Category.FOOD);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    const transactionData = {
      description,
      amount: parseFloat(amount),
      type,
      category,
      date: new Date().toISOString()
    };

    if (editingId) {
      onUpdateTransaction({
        ...transactionData,
        id: editingId
      });
      cancelEditing();
    } else {
      onAddTransaction({
        ...transactionData,
        id: crypto.randomUUID()
      });
      setDescription('');
      setAmount('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 flex items-center">
            {editingId ? <Pencil className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" /> : <Plus className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />}
            {editingId ? 'Edit Transaction' : 'Add Transaction'}
          </h3>
          
          <div className="flex gap-2">
            {editingId && (
              <button
                type="button"
                onClick={cancelEditing}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <X className="w-3 h-3" /> Cancel
              </button>
            )}
            <button
              type="button"
              onClick={toggleListening}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                isListening 
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse' 
                  : isProcessingVoice
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              {isProcessingVoice ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" /> Processing...
                </>
              ) : isListening ? (
                <>
                  <MicOff className="w-3 h-3" /> Stop
                </>
              ) : (
                <>
                  <Mic className="w-3 h-3" /> Voice
                </>
              )}
            </button>
          </div>
        </div>

        {isProcessingVoice && (
          <div className="mb-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs p-2 rounded-lg flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            Gemini is analyzing your speech...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              required
              className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="Description (e.g. Coffee)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder={`Amount (${currency})`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div>
              <div className="flex rounded-lg bg-gray-200 dark:bg-gray-700 p-0.5">
                <button
                  type="button"
                  onClick={() => setType(TransactionType.INCOME)}
                  className={`flex-1 flex items-center justify-center py-1 text-xs font-medium rounded-md transition-all ${
                    type === TransactionType.INCOME 
                        ? 'bg-white dark:bg-gray-600 text-green-600 dark:text-green-400 shadow-sm' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                   Income
                </button>
                <button
                  type="button"
                  onClick={() => setType(TransactionType.EXPENSE)}
                  className={`flex-1 flex items-center justify-center py-1 text-xs font-medium rounded-md transition-all ${
                    type === TransactionType.EXPENSE 
                        ? 'bg-white dark:bg-gray-600 text-red-600 dark:text-red-400 shadow-sm' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                   Expense
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <select
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              {Object.values(Category).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
                type="submit"
                className={`flex-1 text-white py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2 ${
                editingId 
                    ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800' 
                    : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700'
                }`}
            >
                {editingId ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                {editingId ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="flex flex-col">
        <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-3 px-1">Recent Transactions</h3>
        <div className="flex-1 overflow-y-auto max-h-[400px] pr-1 space-y-2">
          {transactions.length === 0 ? (
            <div className="text-center text-gray-400 dark:text-gray-500 py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
              <p className="text-sm">No transactions yet.</p>
            </div>
          ) : (
            transactions.slice().reverse().map((t) => (
              <div 
                key={t.id} 
                className={`flex items-center justify-between p-2.5 rounded-lg border transition-all group ${
                   editingId === t.id 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700 shadow-sm' 
                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-full ${t.type === TransactionType.INCOME ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                     {t.type === TransactionType.INCOME ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">{t.description}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{t.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${t.type === TransactionType.INCOME ? 'text-green-600 dark:text-green-400' : 'text-gray-800 dark:text-gray-200'}`}>
                    {t.type === TransactionType.INCOME ? '+' : '-'}{currency}{t.amount.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <button 
                      onClick={() => startEditing(t)}
                      className={`p-1 rounded-md transition-colors ${
                        editingId === t.id 
                            ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40' 
                            : 'text-gray-300 dark:text-gray-600 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                      }`}
                      title="Edit"
                    >
                      <Pencil size={12} />
                    </button>
                    <button 
                      onClick={() => onDeleteTransaction(t.id)}
                      className="p-1 rounded-md text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionManager;