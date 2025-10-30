import { z } from 'zod';

export const questionSchema = z.object({
  id: z.string(),
  type: z.union([z.literal('multiple'), z.literal('boolean')]),
  question: z.string(),
  choices: z.array(z.string()),
  correctAnswer: z.string().optional(),
});

export const answerSchema = z.object({
  questionIdx: z.number().int(),
  selected: z.string(),
  correct: z.string().optional(),
  isCorrect: z.boolean(),
  answeredAt: z.number().int(),
});

export const quizResumeSchema = z.object({
  questions: z.array(questionSchema),
  answers: z.array(answerSchema).optional(),
  currentIndex: z.number().int().min(0),
  endTimestamp: z.number().int(),
  createdAt: z.string(),
  totalTime: z.number().int(),
});

export type QuizResume = z.infer<typeof quizResumeSchema>;
