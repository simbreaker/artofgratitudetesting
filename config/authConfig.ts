/**
 * Authentication configuration for Art of Gratitude tests.
 * Prefer loading sensitive data from environment variables or secret stores.
 */
export const authConfig = {
  baseUrl: process.env.BASE_URL ?? 'https://www.theartofgratitude.org',
  email: process.env.EMAIL ?? 'dixit.bedi@gmail.com',
  password: process.env.PASSWORD ?? 'kFaeFUXpYap2wn',
};


