import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function AppHealthMonitor({ children }: Props) {
  return <>{children}</>;
}
