type DefaultResponse = "done"
export abstract class AbstractCallback<D, R = DefaultResponse> {
    /* The name of the event. It is used to filter the specific event out of the NUI message bus */
    abstract name: string;

    /**
     * @param data - Optional data that is sent with the callback message.
     * @param response - Optional response data that the emitter of this event can receive.
     * @param cb - do not use, internal: the Nui message bus expects all callback messages to resolve with a callback.
     */
    constructor(
        public data: D | null = null,
        public response: R | null = null,
        public cb: (response: R ) => void
    ){}
}

export type SpawnVehicleData = { model: string };
export class SpawnVehicle extends AbstractCallback<SpawnVehicleData> {
    name = "spawnVehicle"
}
