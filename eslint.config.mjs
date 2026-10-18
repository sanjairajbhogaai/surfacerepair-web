import nextVitals from 'eslint-config-next/core-web-vitals';

export default [
  ...nextVitals,
  {
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['@prisma/client', '@/lib/db'], message: 'Prisma only in lib/db.ts and lib/data/*.' },
        ],
      }],
      'no-restricted-properties': ['error', {
        object: 'process',
        property: 'env',
        message: 'Use lib/env.ts instead of process.env.',
      }],
      'no-console': ['error', { allow: ['error'] }],
    },
  },
  {
    files: ['lib/db.ts', 'lib/data/**/*.ts'],
    rules: { 'no-restricted-imports': 'off' },
  },
  {
    files: ['lib/env.ts', 'lib/utils/logger.ts'],
    rules: { 'no-restricted-properties': 'off', 'no-console': 'off' },
  },
];
