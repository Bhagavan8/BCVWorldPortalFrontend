export const API_BASE_URL = (() => {
  const env = import.meta.env?.VITE_API_BASE_URL;
  if (env && typeof env === 'string' && env.trim().length > 0) return env;
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:8081';
    }
    return window.location.origin;
  }
  return 'https://api.bcvworld.com';
})();
