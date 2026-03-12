"use client";

import * as React from "react";

export type TocItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

const TocContext = React.createContext<{
  items: TocItem[];
  setItems: (items: TocItem[]) => void;
}>({ items: [], setItems: () => {} });

export function TocProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<TocItem[]>([]);
  return (
    <TocContext.Provider value={{ items, setItems }}>
      {children}
    </TocContext.Provider>
  );
}

export function useToc() {
  return React.useContext(TocContext);
}
