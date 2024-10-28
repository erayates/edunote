"use client";

import { Button } from "./ui/button";
import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export const LogoutButton: React.FC = () => {
  const { signOut } = useClerk();

  const onSignOut = () => {
    signOut({ redirectUrl: "/sign-in" });
  };

  return (
    <Button variant="destructive" onClick={onSignOut}>
      <LogOut /> Logout
    </Button>
  );
};
