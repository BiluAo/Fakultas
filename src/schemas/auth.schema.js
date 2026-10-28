import z from 'zod';

const passwordSchema = z
    .string()
    .trim()
    .min(8, 'Password minimal 8 karakter')
    .refine((value) => Buffer.byteLength(value, 'utf8') <= 72,
        {
            error: "Password maksimal 72 byte UTF-8"
        })


export const registerSchema = z.object({
    name: z.string().trim().min(3, 'Name minimal 3 karakter'),
    email: z.email(),
    password: passwordSchema,
})
export const loginSchema = z.object({
    email: z.email(),
    password: passwordSchema,
})