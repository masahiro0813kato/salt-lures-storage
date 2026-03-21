"use client";

import { useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function DetailPageHeader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const isComposingRef = useRef(false);

  const handleSearch = useCallback(() => {
    const value = inputRef.current?.value || "";
    inputRef.current?.blur();
    router.push(`/lures?search=${value}`);
  }, [router]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isComposingRef.current) {
        handleSearch();
      }
    };

    const onCompositionStart = () => {
      isComposingRef.current = true;
    };

    const onCompositionEnd = () => {
      isComposingRef.current = false;
    };

    input.addEventListener("keydown", onKeyDown);
    input.addEventListener("compositionstart", onCompositionStart);
    input.addEventListener("compositionend", onCompositionEnd);

    return () => {
      input.removeEventListener("keydown", onKeyDown);
      input.removeEventListener("compositionstart", onCompositionStart);
      input.removeEventListener("compositionend", onCompositionEnd);
    };
  }, [handleSearch]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[1000] bg-bg-primary">
      <header className="p-4 hidden md:flex items-center">
        <div className="flex-shrink-0">
          <Link href="/">
            <Image
              src="/images/common/logo-sll.svg"
              alt="SLL Logo"
              width={120}
              height={40}
              priority
              fetchPriority="high"
              style={{ width: '120px', height: '40px' }}
            />
          </Link>
        </div>
        <nav className="flex-1 flex items-center justify-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-sm text-white hover:text-accent-green transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Home
          </Link>
          <Link href="/lures" className="flex items-center gap-2 text-sm text-white hover:text-accent-green transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Lure
          </Link>
        </nav>
        <div className="flex-shrink-0">
          <button className="text-white hover:text-accent-green transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>
      <header className="p-4 md:hidden">
        <Link href="/lures">
          <Image
            src="/images/common/logo-sll.svg"
            alt="SLL Logo"
            width={120}
            height={40}
            priority
            fetchPriority="high"
            style={{ width: '120px', height: '40px' }}
          />
        </Link>
      </header>
      <section className="w-full pb-4 px-[0.85rem]">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            enterKeyHint="search"
            placeholder="ルアー名 メーカーで検索"
            className="w-full py-4 pl-12 pr-4 rounded-full text-dark focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-0"
          />
          <span className="block w-6 h-6 absolute top-1/2 -translate-y-1/2 left-4">
            <Image
              src="/images/common/icon-search.svg"
              alt="検索"
              width={24}
              height={24}
            />
          </span>
        </div>
      </section>
    </div>
  );
}
