'use client';

import { useScrollDirection } from '@/hooks/useScrollDirection';
import { ReactNode, createContext, useContext, useState, useEffect } from 'react';

interface StickyHeaderContextType {
  isForceVisible: boolean;
  toggleVisibility: () => void;
  setForceVisible: (visible: boolean) => void;
  isSearching: boolean;
  setIsSearching: (searching: boolean) => void;
}

const StickyHeaderContext = createContext<StickyHeaderContextType | undefined>(undefined);

export function useStickyHeader() {
  const context = useContext(StickyHeaderContext);
  if (!context) {
    throw new Error('useStickyHeader must be used within StickyHeaderProvider');
  }
  return context;
}

interface StickyHeaderProviderProps {
  children: ReactNode;
}

export function StickyHeaderProvider({ children }: StickyHeaderProviderProps) {
  const [isForceVisible, setIsForceVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const toggleVisibility = () => {
    setIsForceVisible((prev) => !prev);
  };

  const setForceVisible = (visible: boolean) => {
    setIsForceVisible(visible);
  };

  return (
    <StickyHeaderContext.Provider value={{ isForceVisible, toggleVisibility, setForceVisible, isSearching, setIsSearching }}>
      {children}
    </StickyHeaderContext.Provider>
  );
}

interface StickyHeaderProps {
  children: ReactNode;
}

export default function StickyHeader({ children }: StickyHeaderProps) {
  const { scrollDirection, isVisible: isScrollVisible } = useScrollDirection();
  const { isForceVisible, setForceVisible, isSearching } = useStickyHeader();
  const [lastScrollY, setLastScrollY] = useState(0);

  // 下スクロール時に強制表示を解除（実際にスクロールが発生した場合のみ）
  // 検索中は無効化
  useEffect(() => {
    const handleScroll = () => {
      // 検索中はスクロールイベントを無視
      if (isSearching) return;

      const currentScrollY = window.scrollY;

      // 実際にスクロール位置が変わり、かつ下方向の場合のみ解除
      if (currentScrollY > lastScrollY && currentScrollY > 100 && isForceVisible) {
        setForceVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isForceVisible, isSearching, setForceVisible]);

  const isVisible = isForceVisible || isScrollVisible;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[1000] bg-bg-primary transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {children}
    </div>
  );
}
