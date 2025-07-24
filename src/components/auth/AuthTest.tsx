"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthTest() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="p-4 bg-yellow-100 text-yellow-800 rounded">Loading...</div>;
  }

  if (status === "error") {
    return <div className="p-4 bg-red-100 text-red-800 rounded">Error loading session</div>;
  }

  if (session) {
    return (
      <div className="p-4 bg-green-100 text-green-800 rounded">
        <p>Signed in as: {session.user?.email}</p>
        <button
          onClick={() => signOut()}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-100 text-blue-800 rounded">
      <p>Not signed in</p>
      <button
        onClick={() => signIn("google")}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Sign In with Google
      </button>
    </div>
  );
} 