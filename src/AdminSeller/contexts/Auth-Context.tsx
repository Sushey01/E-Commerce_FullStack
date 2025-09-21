import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "admin" | "seller" | "pending_seller";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface SellerRequest {
  id: string;
  email: string;
  name: string;
  businessName: string;
  businessType: string;
  description: string;
  phone: string;
  status: "pending" | "approved" | "rejected";
  requestDate: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  requestSellerAccess: (
    requestData: Omit<SellerRequest, "id" | "status" | "requestDate">
  ) => Promise<boolean>;
  getSellerRequests: () => SellerRequest[];
  approveSellerRequest: (requestId: string) => void;
  rejectSellerRequest: (requestId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers = [
  {
    email: "admin@company.com",
    password: "admin123",
    role: "admin" as UserRole,
  },
  {
    email: "seller1@company.com",
    password: "seller123",
    role: "seller" as UserRole,
  },
  {
    email: "seller2@company.com",
    password: "seller123",
    role: "seller" as UserRole,
  },
  {
    email: "john@company.com",
    password: "password",
    role: "pending_seller" as UserRole,
  },
  { email: "admin@demo.com", password: "demo", role: "admin" as UserRole },
];

const mockSellerRequests: SellerRequest[] = [
  {
    id: "req1",
    email: "john@company.com",
    name: "John Doe",
    businessName: "John's Electronics",
    businessType: "Electronics",
    description: "Selling quality electronics and gadgets",
    phone: "+1234567890",
    status: "pending",
    requestDate: "2024-01-15",
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sellerRequests, setSellerRequests] =
    useState<SellerRequest[]>(mockSellerRequests);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const storedRequests = localStorage.getItem("sellerRequests");
    if (storedRequests) {
      setSellerRequests(JSON.parse(storedRequests));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check credentials against mock database
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: foundUser.email,
        name: foundUser.email.split("@")[0],
        role: foundUser.role,
      };

      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const requestSellerAccess = async (
    requestData: Omit<SellerRequest, "id" | "status" | "requestDate">
  ): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newRequest: SellerRequest = {
      ...requestData,
      id: Math.random().toString(36).substr(2, 9),
      status: "pending",
      requestDate: new Date().toISOString().split("T")[0],
    };

    const updatedRequests = [...sellerRequests, newRequest];
    setSellerRequests(updatedRequests);
    localStorage.setItem("sellerRequests", JSON.stringify(updatedRequests));

    // Add user as pending seller
    mockUsers.push({
      email: requestData.email,
      password: "temp123", // In real app, this would be handled differently
      role: "pending_seller",
    });

    setIsLoading(false);
    return true;
  };

  const getSellerRequests = (): SellerRequest[] => {
    return sellerRequests.filter((req) => req.status === "pending");
  };

  const approveSellerRequest = (requestId: string) => {
    const updatedRequests = sellerRequests.map((req) =>
      req.id === requestId ? { ...req, status: "approved" as const } : req
    );
    setSellerRequests(updatedRequests);
    localStorage.setItem("sellerRequests", JSON.stringify(updatedRequests));

    // Update user role in mock database
    const request = sellerRequests.find((req) => req.id === requestId);
    if (request) {
      const userIndex = mockUsers.findIndex((u) => u.email === request.email);
      if (userIndex !== -1) {
        mockUsers[userIndex].role = "seller";
      }
    }
  };

  const rejectSellerRequest = (requestId: string) => {
    const updatedRequests = sellerRequests.map((req) =>
      req.id === requestId ? { ...req, status: "rejected" as const } : req
    );
    setSellerRequests(updatedRequests);
    localStorage.setItem("sellerRequests", JSON.stringify(updatedRequests));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        requestSellerAccess,
        getSellerRequests,
        approveSellerRequest,
        rejectSellerRequest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
