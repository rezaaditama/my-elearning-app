import z from 'zod';

export const quizConfigSchema = z.object({
  amount: z
    .number()
    .int()
    .min(1, 'Minimal 1 soal')
    .max(50, 'Maksimal dapat memilih 50 soal'),
  category: z.number().nullable(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  type: z.enum(['multiple', 'boolean']),
  totalTime: z.number().int().min(5, 'Minimal 5 Menit'),
});

export type quizConfig = z.infer<typeof quizConfigSchema>;
