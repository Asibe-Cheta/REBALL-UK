"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthTest() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="p-4 bg-yellow-900 text-yellow-200 rounded border border-yellow-700">Loading...</div>;
  }

  if (status === "error") {
    return <div className="p-4 bg-red-900 text-red-200 rounded border border-red-700">Error loading session</div>;
  }

  if (session) {
    return (
      <div className="p-4 bg-green-900 text-green-200 rounded border border-green-700">
        <p>Signed in as: {session.user?.email}</p>
        <button
          onClick={() => signOut()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-900 text-blue-200 rounded border border-blue-700">
      <p>Not signed in</p>
      <button
        onClick={() => signIn("google")}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Sign In with Google
      </button>
    </div>
  );
} 