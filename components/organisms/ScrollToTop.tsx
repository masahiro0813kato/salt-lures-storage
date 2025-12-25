'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useStickyHeader } from './StickyHeader';

export default function ScrollToTop() {
  const [buttonActive, setButtonActive] = useState(false);
  const { isForceVisible, toggleVisibility } = useStickyHeader();

  useEffect(() => {
    const handleScroll = () => {
      const top = 100; // topから100pxスクロールしたらボタン登場
      const scroll = window.scrollY;
      setButtonActive(scroll >= top);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    toggleVisibility();
  };

  if (!buttonActive) return null;

  return (
    <div
      onClick={handleClick}
      className="fixed bottom-4 right-2 w-12 h-12 bg-accent-green rounded-full
                 flex items-center justify-center cursor-pointer
                 shadow-[0_8px_16px_rgba(0,0,0,0.5)]
                 transform scale-100 active:scale-110 transition-transform duration-100
                 animate-bounce-in"
      style={{
        backgroundImage: "url('/images/common/icon-search.svg')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '50% 50%',
      }}
    >
      <Image
        src="/images/common/icon-search.svg"
        alt={isForceVisible ? "ヘッダーを隠す" : "ヘッダーを表示"}
        width={24}
        height={24}
        className="opacity-0"
      />
    </div>
  );
}
