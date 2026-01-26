"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "@/components/auth/profile-avatar";
import { LogIn } from "lucide-react";
import { isAdminEmail } from "@/server-actions/admin";

export const LoginButton = () => {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      isAdminEmail(session.user.email).then(setIsAdmin);
    }
  }, [session?.user?.email]);

  if (status === "loading") {
    return (
      <Button variant="outline" size="icon" disabled>
        <LogIn className="h-4 w-4" />
      </Button>
    );
  }

  if (session?.user) return <ProfileAvatar user={session.user} isAdmin={isAdmin} />;

  return (
    <Button onClick={() => signIn("google")} size="sm" className="gap-2">
      <LogIn className="h-4 w-4" />
      <span className="hidden sm:inline">Sign in</span>
    </Button>
  );
};