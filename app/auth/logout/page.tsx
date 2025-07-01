"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/userSlice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LogoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleLogout = async () => {
      // Sign out from NextAuth
      await signOut({ redirect: false });
      
      // Clear user data from Redux store
      dispatch(logout());
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        router.push("/");
      }, 2000);
    };

    handleLogout();
  }, [dispatch, router]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Logging Out</CardTitle>
          <CardDescription>
            You are being signed out of your account...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p>Redirecting you to the home page shortly.</p>
        </CardContent>
      </Card>
    </div>
  );
}