import type { ChildrenProps } from '@/types/common';
import TanStackProvider from './TanStack.provider';

export default function AppProvider({ children }: ChildrenProps) {
  return <TanStackProvider>{children}</TanStackProvider>;
}
