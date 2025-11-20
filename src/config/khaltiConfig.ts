import axios from 'axios';

export const KHALTI_CONFIG ={
    baseUrl: "https://khalti.com/api/v2/", // Sandbox environment URL
    secretKey: import.meta.env.VITE_KHALTI_SECRET_KEY ?? "", 
} as const;

export const KhaltiClient = axios.create({
    baseURL: KHALTI_CONFIG.baseUrl,
    headers: {
        Authorization: `key ${KHALTI_CONFIG.secretKey}`,
        "Content-Type": "application/json",
    }
})