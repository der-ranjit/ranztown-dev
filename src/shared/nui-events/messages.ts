export abstract class AbstractMessage<D = void> {
    /**
     * @param data - Optional data that can be sent with the message.
     */
    constructor(
        public data: D
    ){}
}
export type MessageConstructor<T, D> = { new (data: D): T}

export type NotificationData = { message: string };
export class Notification extends AbstractMessage<NotificationData> {}

export type setNuiVisibilityData = { nuiVisible: boolean };
export class setNuiVisibility extends AbstractMessage<setNuiVisibilityData> {}
