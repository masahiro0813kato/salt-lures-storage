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
      <header className="p-4">
        <Link href="/lures">
          <Image
            src="/images/common/logo-sll.svg"
            alt="SLL Logo"
            width={120}
            height={40}
            priority
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
