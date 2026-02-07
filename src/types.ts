
export enum ExperienceLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export interface UserProfile {
  name: string;
  experience: ExperienceLevel;
  instruments: string[];
  goal: string;
  deviceId: string;
  hasOnboarded: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  status: 'locked' | 'available' | 'completed';
  color: string;
}
