const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 20;

export function getPagination(searchParams: URLSearchParams) {
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? DEFAULT_PAGE_SIZE);

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit =
    Number.isFinite(limit) && limit > 0 && limit <= MAX_PAGE_SIZE ? limit : DEFAULT_PAGE_SIZE;

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
  };
}
