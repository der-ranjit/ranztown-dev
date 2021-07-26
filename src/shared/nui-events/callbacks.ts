import { UserSavedLocation } from "../storage/UserSavedLocation";

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

export class SpawnVehicle extends AbstractCallback<{ model: string }> {}
export class SetControlsDisabled extends AbstractCallback<{ disabled: boolean }> {}

export class GetUserLocations extends AbstractCallback {}
export class SaveUserLocation extends AbstractCallback<{location: UserSavedLocation}> {}
export type PlayerPosition =  {x: number, y: number, z: number, heading: number};
export class GetCurrentPlayerPosition extends AbstractCallback<null, PlayerPosition> {}
export class MovePlayerToLocation extends AbstractCallback<{location: UserSavedLocation}> {}
export class FlyHigh extends AbstractCallback {}
export class GetFileServerBaseUrl extends AbstractCallback<null, {baseUrl: string}> {}
