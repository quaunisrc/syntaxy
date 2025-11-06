export class SyntaxySignal<T> {
  #value: T;
  #subscribers: Set<(value: T) => void> = new Set();

  constructor(initialValue: T) {
    this.#value = initialValue;
  }

  get value(): T {
    return this.#value;
  }

  set(newValue: T) {
    if (this.#value !== newValue) {
      this.#value = newValue;
      this.#subscribers.forEach((cb) => cb(newValue));
    }
  }

  subscribe(callback: (value: T) => void): () => void {
    this.#subscribers.add(callback);

    return () => this.#subscribers.delete(callback);
  }
}
