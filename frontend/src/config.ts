export const config = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  API_KEY: import.meta.env.VITE_API_KEY,
} as const;

export type Config = typeof config;
