export interface RetryLoopOptions<T> {
  retries?: number;
  delay?: number;
  onError?: (error: unknown) => void;
  shouldRetry?: (error: unknown) => boolean;
  onSuccess?: (result: T) => void;
  onRetry?: (attempt: number) => void;
}
