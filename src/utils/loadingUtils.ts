/**
 * Loading Utilities
 * Prevents flashing loading states and provides better UX
 */

const MIN_LOADING_DURATION = 150; // ms

/**
 * Ensures loading state is shown for a minimum duration
 * Prevents flashing loading indicators for fast operations
 *
 * @param promise - The async operation to execute
 * @param minDuration - Minimum duration to show loading (default: 150ms)
 * @returns Promise that resolves with the operation result
 *
 * @example
 * ```typescript
 * const loadData = async () => {
 *   setIsLoading(true);
 *   try {
 *     const data = await withMinLoadingDuration(fetchData());
 *     setData(data);
 *   } finally {
 *     setIsLoading(false);
 *   }
 * };
 * ```
 */
export async function withMinLoadingDuration<T>(
  promise: Promise<T>,
  minDuration: number = MIN_LOADING_DURATION
): Promise<T> {
  const startTime = Date.now();

  try {
    const result = await promise;
    const elapsed = Date.now() - startTime;

    // If operation was too fast, wait for remaining time
    if (elapsed < minDuration) {
      await new Promise(resolve => setTimeout(resolve, minDuration - elapsed));
    }

    return result;
  } catch (error) {
    const elapsed = Date.now() - startTime;

    // Still enforce minimum duration even on error
    if (elapsed < minDuration) {
      await new Promise(resolve => setTimeout(resolve, minDuration - elapsed));
    }

    throw error;
  }
}

/**
 * Hook-friendly version that manages loading state automatically
 *
 * @param asyncFn - The async function to execute
 * @param minDuration - Minimum duration to show loading (default: 150ms)
 * @returns Wrapped function that enforces minimum loading duration
 *
 * @example
 * ```typescript
 * const handleRefresh = useMinLoadingDuration(async () => {
 *   const data = await fetchData();
 *   setData(data);
 * });
 * ```
 */
export function wrapWithMinLoading<T extends (...args: any[]) => Promise<any>>(
  asyncFn: T,
  minDuration: number = MIN_LOADING_DURATION
): T {
  return (async (...args: any[]) => {
    return withMinLoadingDuration(asyncFn(...args), minDuration);
  }) as T;
}

/**
 * Debounced loading wrapper
 * Prevents showing loading state for operations that complete very quickly
 * Only shows loading if operation takes longer than threshold
 *
 * @param promise - The async operation to execute
 * @param setLoading - Loading state setter
 * @param threshold - Time before showing loading (default: 200ms)
 * @param minDuration - Minimum duration once shown (default: 150ms)
 *
 * @example
 * ```typescript
 * await withDebouncedLoading(
 *   fetchQuickData(),
 *   setIsLoading,
 *   200, // Only show loading if takes longer than 200ms
 *   150  // But once shown, keep it for at least 150ms
 * );
 * ```
 */
export async function withDebouncedLoading<T>(
  promise: Promise<T>,
  setLoading: (loading: boolean) => void,
  threshold: number = 200,
  minDuration: number = MIN_LOADING_DURATION
): Promise<T> {
  let loadingStartTime: number | null = null;
  let loadingTimeout: NodeJS.Timeout | null = null;

  // Schedule showing loading indicator after threshold
  loadingTimeout = setTimeout(() => {
    loadingStartTime = Date.now();
    setLoading(true);
  }, threshold);

  try {
    const result = await promise;

    // Clear the timeout if operation completed before threshold
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }

    // If loading was shown, ensure minimum duration
    if (loadingStartTime) {
      const elapsed = Date.now() - loadingStartTime;
      if (elapsed < minDuration) {
        await new Promise(resolve => setTimeout(resolve, minDuration - elapsed));
      }
      setLoading(false);
    }

    return result;
  } catch (error) {
    // Clear timeout and hide loading on error
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }

    if (loadingStartTime) {
      const elapsed = Date.now() - loadingStartTime;
      if (elapsed < minDuration) {
        await new Promise(resolve => setTimeout(resolve, minDuration - elapsed));
      }
      setLoading(false);
    }

    throw error;
  }
}
