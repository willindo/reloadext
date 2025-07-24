// @ts-check

// @ts-ignore
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx}", // ✅ Optional, only if exists
  ],
};
export const theme = {
  extend: {},
};
/**
 * @type {never[]}
 */
export const plugins = [];
