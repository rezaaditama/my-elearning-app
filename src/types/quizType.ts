export type RawQuestion = {
  category: string;
  type: 'multiple' | 'boolean';
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

export type Question = {
  id: string;
  type: 'multiple' | 'boolean';
  question: string;
  choices: string[];
  correctAnswer?: string;
};
