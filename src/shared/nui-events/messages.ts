export abstract class AbstractMessage<D = void> {
    /**
     * @param data - Optional data that can be sent with the message.
     */
    constructor(
        public data: D
    ){}
}
export type MessageConstructor<T, D> = { new (data: D): T}

export class Notification extends AbstractMessage<{ message: string }> {}
export class SetNuiVisibility extends AbstractMessage<{ nuiVisible: boolean }> {}
