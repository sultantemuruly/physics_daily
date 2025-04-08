"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <p>Welcome, {session.user?.name}!</p>
        <Button variant={"default"} onClick={() => signOut()}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <Button variant={"default"} onClick={() => signIn("google")}>
      Sign in with Google
    </Button>
  );
}
