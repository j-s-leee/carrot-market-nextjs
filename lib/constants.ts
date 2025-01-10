export const PASSWORD_REGEX = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);
export const PASSWORD_REGEX_ERROR =
  "password must contain at least one lowercase, UPPERCASE, number, special characters like !@#$%^&*";
export const PASSWORD_MIN_LENGTH = 4;
export const PAGE_SIZE = 2;
export const CLOUDFLARE_DELIVERY_URL =
  "https://imagedelivery.net/bSedi-l5zkspGX-IBYZTyw/";
export const SUPABASE_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRteWxmb2hkdG5nc3NnYmxjc2xwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4Mjk2MDIsImV4cCI6MjA1MTQwNTYwMn0.s581KYj42dDHuJFjDGBWrV5Y2Bd3buH652BB4JhrYR0";
export const SUPABASE_URL = "https://tmylfohdtngssgblcslp.supabase.co";

export const CLOUDFLARE_API_URL =
  "https://api.cloudflare.com/client/v4/accounts/";
