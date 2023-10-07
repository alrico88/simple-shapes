export function usePagination<T>(
  items: Ref<T[]>,
  startOptions: {
    perPage?: number;
    resetOnChange?: boolean;
  } = {},
) {
  const defaults = {
    perPage: 50,
    resetOnChange: true,
  };

  const opts = Object.assign(defaults, startOptions);

  const totalRows = computed(() => items.value.length);
  const currentPage = ref(1);
  const perPage = ref(opts.perPage);

  const showPagination = computed(() => totalRows.value > perPage.value);

  function changeCurrentPage(pageNum: number): void {
    currentPage.value = pageNum;
  }

  if (opts.resetOnChange) {
    // Reset to first page if items change
    watch(items, () => {
      changeCurrentPage(1);
    });
  }

  const currentPageItems = computed(() => {
    const index = currentPage.value - 1;
    const start = index * perPage.value;
    const end = start + perPage.value;

    return items.value.slice(start, end);
  });

  return {
    totalRows,
    currentPage,
    perPage,
    changeCurrentPage,
    currentPageItems,
    showPagination,
  };
}
