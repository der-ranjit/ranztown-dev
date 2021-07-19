export abstract class Event<D, R = any> {
    abstract name: string;
    constructor(
        public data: D | null = null,
        public response: R | null = null
    ){}
}
