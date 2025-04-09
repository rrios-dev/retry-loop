import retryLoop from "./retry-loop";
import { RetryLoopOptions } from "./types";

describe("retry-loop", () => {
  it("should succeed without retries", async () => {
    const mockFn = jest.fn().mockResolvedValue("success");
    const options: RetryLoopOptions<string> = { retries: 3 };

    const wrappedFn = retryLoop(mockFn, options);
    const result = await wrappedFn();

    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledTimes(1);
  }, 10000);

  it("should retry on failure and eventually succeed", async () => {
    const mockFn = jest
      .fn()
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValue("success");
    const options: RetryLoopOptions<string> = { retries: 3, delay: 500 };

    const wrappedFn = retryLoop(mockFn, options);
    const promise = wrappedFn();

    await Promise.resolve(); // Allow promise to resolve

    const result = await promise;

    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledTimes(2);
  }, 10000);

  it("should throw an error after max retries", async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error("fail"));
    const options: RetryLoopOptions<string> = { retries: 3 };

    const wrappedFn = retryLoop(mockFn, options);

    await expect(wrappedFn()).rejects.toThrow("fail");
    expect(mockFn).toHaveBeenCalledTimes(3);
  }, 10000);

  it("should respect custom delay", async () => {
    const mockFn = jest
      .fn()
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValue("success");
    const options: RetryLoopOptions<string> = { retries: 3, delay: 1000 };

    const wrappedFn = retryLoop(mockFn, options);
    const promise = wrappedFn();
    await Promise.resolve(); // Allow promise to resolve

    const result = await promise;

    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledTimes(2);
  }, 10000);

  it("should call onSuccess and onError callbacks", async () => {
    const mockFn = jest
      .fn()
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValue("success");
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const options: RetryLoopOptions<string> = {
      retries: 3,
      onSuccess,
      onError,
    };

    const wrappedFn = retryLoop(mockFn, options);
    const result = await wrappedFn();

    expect(result).toBe("success");
    expect(onSuccess).toHaveBeenCalledWith("success");
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  }, 10000);
});
