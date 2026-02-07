import { QuizQuestion, Lesson } from './types';

export const INITIAL_ASSESSMENT: QuizQuestion[] = [
  {
    id: 1,
    question: "What does 'Bull Market' mean?",
    options: ["Prices are falling", "Prices are rising", "Prices are flat", "No trades happening"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Which of these is used to limit losses in a trade?",
    options: ["Take Profit", "Leverage", "Stop Loss", "Market Order"],
    correctAnswer: 2
  },
  {
    id: 3,
    question: "What is 'Leverage' in trading?",
    options: ["Borrowing funds to increase position size", "Investing only your cash", "Closing a trade early", "A type of crypto"],
    correctAnswer: 0
  },
  {
    id: 4,
    question: "What is the primary purpose of 'Technical Analysis'?",
    options: ["Reading news", "Analyzing balance sheets", "Studying price charts and patterns", "Watching TV"],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "What is the 'Spread'?",
    options: ["The total profit", "Difference between buy and sell price", "A type of jam", "The market opening time"],
    correctAnswer: 1
  }
];

export const MOCK_LESSONS: Lesson[] = [
  { id: '1', title: 'Risk vs Reward Mastery', duration: '15 mins', status: 'available', color: '#ff00ff' },
  { id: '2', title: 'Stop Loss Basics for Pros', duration: '10 mins', status: 'completed', color: '#bf00ff' },
  { id: '3', title: 'Trading Psychology 101', duration: '20 mins', status: 'available', color: '#ff9100' },
  { id: '4', title: 'Advanced Chart Patterns', duration: '25 mins', status: 'locked', color: '#ffff00' },
  { id: '5', title: 'Crypto Market Cycles', duration: '15 mins', status: 'locked', color: '#00ffff' }
];

export const KPIS = [
  { label: 'Lessons Completed', value: '12', icon: '🎓', color: 'pink' },
  { label: 'Trades Analysed', value: '48', icon: '📊', color: 'orange' },
  { label: 'Chat Count', value: '124', icon: '💬', color: 'purple' },
  { label: 'Quiz Score', value: '88%', icon: '🔥', color: 'yellow' },
];

export const MOCK_TRADE = {
  instrument: 'BTC/USD',
  customInstrument: '',
  tradeType: 'Buy',
  timeframe: '15 minutes',
  entryPrice: 42000,
  exitPrice: 41850,
  stopLoss: 41900,
  reason: 'Breakout on 15m with strong volume',
  description: '',
};

export const SUGGESTED_LESSONS = [
  { id: '1', title: 'Risk vs Reward Basics', desc: 'Understand favourable ratios and position sizing.' },
  { id: '2', title: 'Planning Trades with Intent', desc: 'Document entry, exit and the reasoning before entry.' },
  { id: '3', title: 'Managing Losses Emotionally', desc: 'Techniques to reduce emotional reactions after losses.' },
];
