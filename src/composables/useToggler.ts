import { ref } from 'vue';

export function useToggler(initialState: boolean) {
  const status = ref(initialState);

  function toggle(): void {
    status.value = !status.value;
  }

  function turn(newStatus: boolean): void {
    status.value = newStatus;
  }

  return {
    status,
    toggle,
    turn,
  };
}
