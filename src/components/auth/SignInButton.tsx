"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function SignInButton() {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-white font-poppins">
          Welcome, {session.user.name}!
        </span>
        <button
          onClick={() => signOut()}
          className="bg-white text-primary-900 px-4 py-2 rounded-lg font-poppins font-semibold hover:bg-primary-100 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="bg-white text-primary-900 px-6 py-2 rounded-lg font-poppins font-semibold hover:bg-primary-100 transition-colors"
    >
      Sign In with Google
    </button>
  );
} 