export abstract class AbstractMessage<Data> {
    /* The name of the event. It is used to filter the specific event out of the NUI message bus */
    abstract name: string;

    /**
     * @param data - Optional data that can be sent with the message.
     */
    constructor(
        public data: Data | null = null
    ){}
}

export type NotificationData = { message: string };
export class Notification extends AbstractMessage<NotificationData> {
    name = "notification"
}

export type setNuiVisibilityData = { nuiVisible: boolean };
export class setNuiVisibility extends AbstractMessage<setNuiVisibilityData> {
    name = "setNuiVisibility"
}
