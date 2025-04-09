import { RetryLoopOptions } from "./types";

function retryLoop<T, Params extends any[]>(
  fn: (...args: Params) => Promise<T>,
  options: RetryLoopOptions<T> = {}
) {
  return (...args: Params): Promise<T> => {
    const {
      retries = 3,
      delay = 500,
      onError,
      onSuccess,
      onRetry,
      shouldRetry = () => true,
    } = options;

    const executeWithRetry = async (attempt: number = 0): Promise<T> => {
      try {
        const result = await fn(...args);
        onSuccess?.(result);
        return result;
      } catch (error) {
        onError?.(error);
        if (!shouldRetry(error) || attempt >= retries - 1) throw error;
        onRetry?.(attempt + 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return executeWithRetry(attempt + 1);
      }
    };

    return executeWithRetry();
  };
}

export default retryLoop;
