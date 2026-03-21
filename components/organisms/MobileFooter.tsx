"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function MobileFooter() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isLures = pathname.startsWith("/lures");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[1000] bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around h-16">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 ${isHome ? "text-dark" : "text-text-tertiary"}`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link
          href="/lures"
          className={`flex flex-col items-center gap-1 ${isLures ? "text-dark" : "text-text-tertiary"}`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="text-xs font-medium">Lure</span>
        </Link>
        <button
          className="flex flex-col items-center gap-1 text-text-tertiary"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <span className="text-xs font-medium">Other</span>
        </button>
      </div>
    </nav>
  );
}
