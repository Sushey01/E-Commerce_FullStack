// // ../config/khaltiConfig.ts
// import axios from "axios";

// // -------------------- Khalti configuration --------------------
// export const KHALTI_CONFIG = {
//   baseUrl: "https://dev.khalti.com/api/v2/epayment/initiate/", // no trailing slash!
//   secretKey: import.meta.env.VITE_KHALTI_SECRET_KEY ?? "", // from .env
// } as const;

// // -------------------- Pre-configured Axios client --------------------
// export const KhaltiClient = axios.create({
//   baseURL: KHALTI_CONFIG.baseUrl,
//   headers: {
//     Authorization: `Key ${KHALTI_CONFIG.secretKey}`,
//     "Content-Type": "application/json",
//   },
// });
