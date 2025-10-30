import z from 'zod';

//Validasi user login
export const userSchemas = z.object({
  email: z.string().min(1, 'Email wajib diisi').email('Email tidak valid'),
  fullname: z.string().min(1, 'Nama wajib diisi'),
  loggedAt: z.string().optional(),
});

export type IUser = z.infer<typeof userSchemas>;
