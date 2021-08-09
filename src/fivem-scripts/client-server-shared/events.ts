export abstract class AbstractEvent<D = void> {
    /**
     * @param data - Optional data to sent with the event.
     */
    constructor(
        public data: D
    ){}
}
export type EventConstructor<T, D> = { new (data: D): T}
