"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export default function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [term, setTerm] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQ = searchParams.get("q") ?? "";
      if (term === currentQ) return;

      const params = new URLSearchParams(searchParams.toString());
      if (term.trim()) {
        params.set("q", term.trim());
      } else {
        params.delete("q");
      }

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [term, pathname, router, searchParams]);

  return (
    <div className="relative w-full sm:w-64">
      <input
        type="text"
        placeholder="Filter by title or details..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 pl-8 text-xs text-neutral-100 placeholder-neutral-500 focus:border-neutral-600 focus:outline-none"
      />
      <svg
        className={`absolute left-2.5 top-2 h-3.5 w-3.5 ${
          isPending ? "text-blue-400 animate-pulse" : "text-neutral-500"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
        />
      </svg>
    </div>
  );
}