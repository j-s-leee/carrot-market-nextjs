export const PASSWORD_REGEX = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);
export const PASSWORD_REGEX_ERROR =
  "password must contain at least one lowercase, UPPERCASE, number, special characters like !@#$%^&*";
export const PASSWORD_MIN_LENGTH = 4;
export const PAGE_SIZE = 2;
export const CLOUDFLARE_DELIVERY_URL =
  "https://imagedelivery.net/bSedi-l5zkspGX-IBYZTyw/";
