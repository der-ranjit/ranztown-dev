export abstract class AbstractMessage<D = void> {
    /* The name of the event. It is used to filter the specific event out of the NUI message bus */
    static eventName: string;

    /**
     * @param data - Optional data that can be sent with the message.
     */
    constructor(
        public data: D
    ){}
}
export type MessageConstructor<T, D> = { new (data: D): T}

export type NotificationData = { message: string };
export class Notification extends AbstractMessage<NotificationData> {
    static eventName = "notification"
}

export type setNuiVisibilityData = { nuiVisible: boolean };
export class setNuiVisibility extends AbstractMessage<setNuiVisibilityData> {
    static eventName = "setNuiVisibility"
}
