"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/zg-login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={pending}
      className="flex w-full items-center justify-between rounded-lg border border-line px-3 py-2 text-xs text-muted transition-colors hover:border-danger/40 hover:text-danger disabled:opacity-60"
    >
      <span>{pending ? "Signing out…" : "Sign out"}</span>
      <span aria-hidden>⏻</span>
    </button>
  );
}
