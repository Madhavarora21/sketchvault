"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, AtSign, Search } from "lucide-react";
import { searchCreator } from "@/actions/profile";

export default function CreatorSearch() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    setError("");

    startTransition(async () => {
      const res = await searchCreator(username);
      if (res.found) {
        router.push(`/u/${res.handle}`);
      } else {
        setError("No creator found with that username. Check the spelling and try again.");
      }
    });
  }

  const empty = !username.trim();

  return (
    <form onSubmit={submit} className="mt-5 text-left">
      <label htmlFor="creator-username" className="mb-1.5 block font-virgil text-sm font-bold text-[#1e1e1e]">
        Creator Username
      </label>

      <div className="relative">
        <AtSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#adb5bd]" />
        <input
          id="creator-username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError("");
          }}
          placeholder="username"
          autoComplete="off"
          maxLength={64}
          className="w-full border-2 border-[#1e1e1e] bg-white py-2.5 pl-10 pr-12 font-virgil text-base outline-none focus:border-brand"
          style={{ borderRadius: "8px 2px 6px 2px / 2px 6px 2px 8px" }}
        />
        <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#868e96]" />
      </div>

      {error && (
        <p className="mt-2 flex items-start gap-2 font-sans text-xs font-semibold text-[#e03131]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={empty || pending}
        className={`mt-3 flex w-full items-center justify-center gap-2 border-2 py-2.5 font-virgil text-base font-bold text-white transition-all ${
          empty || pending
            ? "cursor-not-allowed border-[#b2adec] bg-[#b2adec] shadow-[3px_3px_0px_0px_rgba(0,0,0,0.25)]"
            : "border-[#1e1e1e] bg-brand shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-brand-dark"
        }`}
        style={{ borderRadius: "8px 2px 6px 2px / 2px 6px 2px 8px" }}
      >
        <Search className="h-5 w-5" />
        {pending ? "Searching..." : "Search Profile"}
      </button>
    </form>
  );
}