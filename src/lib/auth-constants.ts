// Force set the JWT_SECRET directly to ensure consistency
// This is a workaround for Next.js environment variable inconsistency
const hardcodedJWTSecret = "Secret";

// Explicitly overwrite process.env to ensure consistency
if (typeof process !== 'undefined' && process.env) {
  process.env.JWT_SECRET = hardcodedJWTSecret;
}

// Shared authentication constants
export const JWT_SECRET = hardcodedJWTSecret;
export const JWT_COOKIE_NAME = 'auth-token';
export const JWT_EXPIRES_IN = '7d'; 