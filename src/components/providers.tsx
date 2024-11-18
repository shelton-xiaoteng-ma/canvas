"use client";

import QueryProviders from "./query-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Porviders = ({ children }: ProvidersProps) => {
  return <QueryProviders>{children}</QueryProviders>;
};
