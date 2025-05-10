"use client";

import type { ThemeProviderProps } from "next-themes";
import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// 1. Define the Context Type
interface GlobalContextType {
  user: any | null;
  setUser: (user: any | null) => void;
}

// 2. Create the Context with a default value (can be undefined or initial state)
const GlobalContext = React.createContext<GlobalContextType | undefined>(undefined);

// 3. Create the Provider Component
export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const [user, setUser] = React.useState<string | null>("guest");
  const router = useRouter();

  // Value to be provided by the Context
  const globalContextValue: GlobalContextType = {
    user,
    setUser,
  };

  return (
    <GlobalContext.Provider value={globalContextValue}>
      <HeroUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </HeroUIProvider>
    </GlobalContext.Provider>
  );
}

// 4. Create a Custom Hook to use the Context (recommended)
export const useGlobal = () => {
  const context = React.useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used within a Providers component");
  }
  return context;
};

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}