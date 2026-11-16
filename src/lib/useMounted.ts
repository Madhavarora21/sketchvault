import { useSyncExternalStore } from "react";

// Server par false, browser me true. localStorage padhne se pehle isse check karte hain.
export function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}