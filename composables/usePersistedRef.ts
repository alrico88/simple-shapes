import { get, set } from "idb-keyval";

export function usePersistedRef<T>(storageKey: string, initialValue: T) {
  const valRef = ref(initialValue);

  onMounted(async () => {
    const stored = await get(storageKey);

    if (stored) {
      valRef.value = JSON.parse(stored);
    }
  });

  watch(
    valRef,
    (val) => {
      set(storageKey, JSON.stringify(val));
    },
    {
      deep: true,
    },
  );

  return valRef;
}
