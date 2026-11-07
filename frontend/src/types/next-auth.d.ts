import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isConfirmed: boolean;
      subscriptionActive: boolean;
      expiresAt?: string;
      customerId?: string;
      subscriptionId?: string;
      canceled: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    isConfirmed: boolean;
    subscriptionActive: boolean;
    expiresAt?: string;
    customerId?: string;
    subscriptionId?: string;
    canceled: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isConfirmed: boolean;
    subscriptionActive: boolean;
    expiresAt?: string | null;
    customerId?: string | null;
    subscriptionId?: string | null;
    canceled: boolean;
  }
}
