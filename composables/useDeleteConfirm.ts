interface IUseDeleteConfirm {
  deleteConfirmation: Ref<boolean>;
  deleteHandler: () => void;
}

export function useDeleteConfirm(deleteCb: () => void): IUseDeleteConfirm {
  const deleteConfirmation = ref(false);

  function deleteHandler() {
    if (deleteConfirmation.value) {
      deleteConfirmation.value = false;

      deleteCb();
    } else {
      deleteConfirmation.value = true;
    }
  }

  return {
    deleteConfirmation,
    deleteHandler,
  };
}
