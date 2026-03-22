"use client";

import Header from "./Header";
import SearchBar from "./SearchBar";
import StickyHeader, { StickyHeaderProvider } from "./StickyHeader";

interface PageHeaderProps {
  children?: React.ReactNode;
}

export default function PageHeader({ children }: PageHeaderProps) {
  return (
    <StickyHeaderProvider>
      <StickyHeader>
        <Header />
        <SearchBar />
      </StickyHeader>
      {children}
    </StickyHeaderProvider>
  );
}
