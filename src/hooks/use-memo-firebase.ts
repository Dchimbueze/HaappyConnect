import { useMemo, type DependencyList } from 'react';
import type { Query, DocumentReference } from 'firebase/firestore';

// This hook is used to memoize Firebase queries and references.
// It prevents re-creating the query/reference on every render, which can cause infinite loops
// when used with hooks like useCollection or useDoc.
export function useMemoFirebase<T extends Query | DocumentReference | null>(
  factory: () => T,
  deps: DependencyList
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
}
