import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_URL: z.string().url().default('http://localhost:3000'),
  DATABASE_URL: z.string().optional(),
  AUTH_SECRET: z.string().optional(),
  AUTH_URL: z.string().url().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
  ADMIN_PATH: z.string().startsWith('/').default('/admin'),
  EMAIL_PROVIDER: z.enum(['resend', 'smtp', 'console']).default('console'),
  EMAIL_FROM: z.string().optional(),
  EMAIL_TO_STAFF: z.string().email().optional(),
  RESEND_API_KEY: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().default('919967990081'),
  NEXT_PUBLIC_BUSINESS_PHONE: z.string().default('+919967990081'),
  NEXT_PUBLIC_BUSINESS_EMAIL: z.string().email().default('admin@surfacerepair.in'),
  NEXT_PUBLIC_GOOGLE_TRANSLATE_ENABLED: z.enum(['true', 'false']).default('true'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables. See lib/env.ts and .env.example.');
}

export const env = parsed.data;
