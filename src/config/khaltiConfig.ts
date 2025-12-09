// Khalti configuration (client-safe)
// NOTE: Do NOT include secret keys in client-side code. Use server-side endpoints
// for any operations that require Khalti secret keys.

export const KHALTI_CONFIG = {
	// Base API URL (no trailing slash). Use dev or live endpoint as needed.
	baseUrl: import.meta.env.VITE_KHALTI_BASE_URL ?? "https://dev.khalti.com/api/v2",
	// Public key is safe to keep on client-side for initiating payment flows
	publicKey: import.meta.env.VITE_KHALTI_PUBLIC_KEY ?? "",
} as const;

// If you need a server-side client using the secret key, create an API route
// on your server that calls Khalti using the secret key (read from server env).
