
export interface WordData {
  word: string;
  pronunciation: string;
  literalMeaning: string;
  definition: string;
  example: string;
  exampleTranslation: string;
}

export interface VocabularyData {
  'مقدماتی': WordData[];
  'متوسط': WordData[];
  'پیشرفته': WordData[];
}

export type Level = 'مقدماتی' | 'متوسط' | 'پیشرفته';

export enum AppView {
  LEVEL_SELECT,
  INPUT,
  LOADING,
  RESULTS,
  QUIZ,
}

export interface QuizQuestion {
  word: string;
  definition: string;
  options: {
    text: string;
    correct: boolean;
  }[];
}

declare global {
    interface Window {
        pdfjsLib: any;
    }
}
