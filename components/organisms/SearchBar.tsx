"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface SuggestLure {
  id: number;
  url_code: string;
  lure_name_ja: string;
  lure_name_en: string;
  lure_maker?: {
    lure_maker_name_en: string;
  };
}

interface SearchBarProps {
  latestSearchKey?: string;
}

export default function SearchBar({ latestSearchKey = "" }: SearchBarProps) {
  const router = useRouter();
  const [searchKey, setSearchKey] = useState(latestSearchKey);
  const [suggestLures, setSuggestLures] = useState<SuggestLure[]>([]);
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    if (isShow) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isShow]);

  const getSuggestLures = async (value: string) => {
    if (value.length === 0) {
      setSuggestLures([]);
      return;
    }
    try {
      const response = await fetch(`/api/v1/suggest?search=${value}`);
      const data = await response.json();
      setSuggestLures(data.suggestions || []);
    } catch (error) {
      console.error("Search error:", error);
      setSuggestLures([]);
    }
  };

  const searchLures = () => {
    setIsShow(false);
    router.push(`/lures?search=${searchKey}`);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchKey(value);

    // 入力があれば自動的にサジェストを表示
    if (value.length > 0) {
      setIsShow(true);
      getSuggestLures(value);
    } else {
      setIsShow(false);
      setSuggestLures([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchLures();
    }
  };

  const handleClear = () => {
    setSearchKey("");
    setSuggestLures([]);
    router.push("/lures");
  };

  return (
    <div className="relative block">
      <section className="w-full py-4 px-[0.85rem]">
        <div className="relative">
          <input
            type="text"
            id="searchLures"
            name="searchLures"
            value={searchKey}
            onChange={handleInput}
            onClick={() => setIsShow(true)}
            onKeyPress={handleKeyPress}
            placeholder="ルアー名 メーカーで検索"
            className="w-full py-4 pl-12 pr-4 rounded-full text-dark focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-0"
          />
          <span
            className="block w-6 h-6 absolute top-1/2 -translate-y-1/2 left-4 cursor-pointer"
            onClick={() => {
              if (isShow) {
                setIsShow(false);
              }
            }}
          >
            {!isShow ? (
              <Image
                src="/images/common/icon-search.svg"
                alt="検索"
                width={24}
                height={24}
              />
            ) : (
              <Image
                src="/images/common/icon-arrow-left.svg"
                alt="キャンセル"
                width={24}
                height={24}
              />
            )}
          </span>
          {isShow && (
            <span
              className="block w-6 h-6 absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer active:scale-150 transition-transform duration-100"
              onClick={handleClear}
            >
              <Image
                src="/images/common/icon-searchClose.svg"
                alt="クリア"
                width={24}
                height={24}
              />
            </span>
          )}
        </div>
      </section>
      {isShow && (
        <section
          className="w-full bg-bg-primary absolute transition-opacity duration-200"
          style={{ height: "calc(100vh - 146px)" }}
        >
          <p className="text-white px-4 py-2">検索</p>
          <ul>
            {suggestLures.map((item) => (
              <li key={item.id} className="text-white">
                <Link
                  href={`/lures/${item.id}-${item.url_code}`}
                  className="flex items-end gap-2 px-4 py-4 border-b-[0.5px] border-text-tertiary bg-no-repeat bg-[right_1rem_center] hover:bg-bg-secondary active:bg-bg-secondary"
                  style={{
                    backgroundImage:
                      "url('/images/common/icon-arrow-right.svg')",
                  }}
                  onClick={() => setIsShow(false)}
                >
                  <div className="text-xs text-text-tertiary">
                    {item.lure_maker?.lure_maker_name_en}
                  </div>
                  <div className="text-base">{item.lure_name_ja}</div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
