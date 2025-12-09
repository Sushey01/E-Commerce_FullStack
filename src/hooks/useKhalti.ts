import axios from "axios";
import { useState } from "react";
import { KHALTI_CONFIG } from "../config/khaltiConfig";

const ENABLE_KHALTI = import.meta.env.VITE_ENABLE_KHALTI === "true";

export interface KhaltiPaymentRequest {
    amount:number; // Amount in paisa (e.g., 1000 paisa = 10 NPR)
    purchase_order_id:string; // Unique order ID from your system`
    purchase_order_name:string; // Name or description of the order
    return_url:string; // URL to redirect after payment
    website_url:string; // Your website URL
    customer_info:{
        name:string;
        email:string;
        phone:string;
    };
}

export interface KhaltiPaymentInitiateResponse {
    pidx:string; // Payment transaction ID
    payment_url:string; // URL to redirect user for payment
}


export interface KhaltiPaymentLookupResponse {
    transaction_id:string;
    status: "Completed" | "Pending" | "Failed";
    total_amount:number;
    purchase_order_id:string;
    purchase_order_name:string;
    mobile?:string;
}

type UseKhaltiOptions = {
    onSuccess?: (response: KhaltiPaymentLookupResponse) => void;
    onError?:(error:Error)=>void;
    autoRedirect?:boolean;
};


export function useKhalti({
    onSuccess,
    onError,
    autoRedirect = true,
}: UseKhaltiOptions = {}) {
    // Hook implementation here
    const [pidx, setPidx] = useState<string | null>(null);
    const [initiationError, setInitiationError] = useState<Error | null>(null);
    const [statusError, setStatusError] = useState<Error |null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // If Khalti is disabled, provide no-op implementations to avoid runtime errors
    if (!ENABLE_KHALTI || !KHALTI_CONFIG.publicKey) {
        const noop = async () => {
            console.warn("Khalti is disabled via environment. initiate() is a no-op.");
            return null;
        };
        return {
            initiate: noop,
            checkPaymentStatus: async () => { console.warn("Khalti disabled: checkPaymentStatus() no-op"); return null; },
            pidx: null,
            initiationError: null,
            statusError: null,
            isLoading: false,
        };
    }

    const initiate = async (data: KhaltiPaymentRequest) => {
        setIsLoading(true);
        setInitiationError(null);
 try {
    const response = await axios.post<KhaltiPaymentInitiateResponse>(
        `${KHALTI_CONFIG.baseUrl}/epayment/initiate/`,
        data
    );

    const khaltiPaymentResponse = response.data;
    setPidx(khaltiPaymentResponse.pidx);

    if (autoRedirect) {
        window.location.href = khaltiPaymentResponse.payment_url;
    }

    return khaltiPaymentResponse;
 } catch (error) {
    setInitiationError(error as Error);
    onError?.(error as Error);

 } finally {
    setIsLoading(false);
 }
};

const checkPaymentStatus = async () => {
    if (!pidx) {
        throw new Error("Payment ID not found");
    }

    setIsLoading(true);
    setStatusError(null);

    try {
        const response = await axios.post<KhaltiPaymentLookupResponse>(
            `${KHALTI_CONFIG.baseUrl}/epayment/lookup/`,
            {pidx}
        );


        const khaltiPaymentStatus = response.data;
        if (khaltiPaymentStatus.status === "Completed") {
            onSuccess?.(khaltiPaymentStatus);
        }

        return khaltiPaymentStatus;
    } catch (error) {
        setStatusError(error as Error);
        onError?.(error as Error);
    } finally {
        setIsLoading(false);
    }
};

return {
    initiate,
    checkPaymentStatus,
    pidx,
    initiationError,
    statusError,
    isLoading,
}
}