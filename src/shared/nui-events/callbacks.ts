export abstract class AbstractCallback<D = void, R = void> {
    /**
     * @param data - Optional data that is sent with the callback message.
     * @param response - Optional response data that the emitter of this event can receive.
     * @param cb - The Nui message bus expects all callback messages to resolve with a non-empty value.
     */
    constructor(
        public data: D,
        public response: R,
        public cb: (response: R ) => void
    ){}
}
export type CallbackConstructor<T, D, R> = { new (data: D, response: R, cb: (response: R) => void): T}

export type SpawnVehicleData = { model: string };
export class SpawnVehicle extends AbstractCallback<SpawnVehicleData> {}

export type SetControlsDisabledData = { disabled: boolean };
export class SetControlsDisabled extends AbstractCallback<SetControlsDisabledData> {}
