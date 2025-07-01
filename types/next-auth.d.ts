import "next-auth";
import { UserPreferences } from "@/store/slices/userSlice";

declare module "next-auth" {
  interface User {
    id: string;
    preferences?: UserPreferences;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      preferences?: UserPreferences;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    preferences?: UserPreferences;
  }
}