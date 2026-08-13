const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type CommandExecutorOptions = {
  maxCachedResults?: number;
};

/**
 * Serializes state-changing commands and remembers their exact result.
 *
 * Retries with the same UUID observe the original canonical revision. The
 * action stays behind one queue even when several HTTP requests arrive in the
 * same event-loop turn.
 */
export class SerializedCommandExecutor<Result> {
  #tail: Promise<void> = Promise.resolve();
  #results = new Map<string, Result>();
  #order: string[] = [];
  #maxCachedResults: number;

  constructor(options: CommandExecutorOptions = {}) {
    this.#maxCachedResults = options.maxCachedResults ?? 256;
    if (!Number.isSafeInteger(this.#maxCachedResults) || this.#maxCachedResults < 1) {
      throw new RangeError("maxCachedResults must be a positive safe integer");
    }
  }

  execute(commandId: string, action: () => Result | Promise<Result>): Promise<Result> {
    const normalized = commandId.trim().toLowerCase();
    if (normalized !== "" && !uuidPattern.test(normalized)) {
      return Promise.reject(new TypeError("commandId must be a UUID"));
    }

    const execution = this.#tail.then(async () => {
      if (normalized !== "" && this.#results.has(normalized)) {
        return structuredClone(this.#results.get(normalized) as Result);
      }
      const result = await action();
      if (normalized !== "") {
        this.#results.set(normalized, structuredClone(result));
        this.#order.push(normalized);
        if (this.#order.length > this.#maxCachedResults) {
          const expired = this.#order.shift();
          if (expired !== undefined) this.#results.delete(expired);
        }
      }
      return structuredClone(result);
    });
    this.#tail = execution.then(() => undefined, () => undefined);
    return execution;
  }
}
