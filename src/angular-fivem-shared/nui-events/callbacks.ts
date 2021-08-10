import { VehicleModType } from "fivem-js/lib/enums/Vehicle";
import { Vec3 } from "fivem-js/lib/utils/Vector3";

import { UserSavedLocation } from "../serialization/UserSavedLocation";
import { FivemEntityJSON } from "../serialization/FivemEntityJSON";
import { FivemVehicleJSON } from "../serialization/FivemVehicleJSON";
import { CheckpointPosition, Race } from "../Racing";

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

export namespace NuiCB {
    export namespace Main {
        export const DefaultCallbackResponse = "no-value"
        export class SetControlsDisabled extends AbstractCallback<{ disabled: boolean }> {}
    }

    export namespace ClientConfiguration {
        export class GetFileServerBaseUrl extends AbstractCallback<null, {baseUrl: string}> {}
    }

    export namespace AdminTools {
        export class IsAdmin extends AbstractCallback <null, { isAdmin: boolean }> {}
    }

    export namespace VehicleManager {
        export class GetPlayerVehicleData extends AbstractCallback<null, FivemVehicleJSON | null> {}
        export class ChangeVehicleColor extends AbstractCallback<{primaryColor: string, secondaryColor: string}> {}
        export class UpdateVehicleMod extends AbstractCallback<{vehicleHandle: number, modType: VehicleModType, modValue: number}> {}
        export class SpawnVehicle extends AbstractCallback<{ model: string }> {}
    }

    export namespace PedManager {
        export class ChangePed extends AbstractCallback<{ ped: string }> {}
    }

    export namespace EntityManager {
        export type EntityType = "no entity" | "ped" | "vehicle" | "object";
        export class GetEntityDataAtNuiCursor extends AbstractCallback<null, FivemEntityJSON | null> {}
        export class GetEntityData extends AbstractCallback<{handle: number}, FivemEntityJSON | null> {}
        export class DeleteEntity extends AbstractCallback<{handle: number}> {}
        export class UpdateEntity extends AbstractCallback<{propertyPaths: string[], value: any, handle: number}> {}
    }

    export namespace Racing {
        export class StartRace extends AbstractCallback<{race: Race}> {}
        export class StopRace extends AbstractCallback {}
        export class EditRaceAddTempPosition extends AbstractCallback<CheckpointPosition> {}
        export class EditRaceStopEdit extends AbstractCallback {}
        export class EditRaceSave extends AbstractCallback<{track: Race}> {}
        export class LoadTrackIDForAllPlayers extends AbstractCallback<{id: string}> {}
        export class GetRaceTracks extends AbstractCallback {}
    }

    export namespace Locations {
        export class GetUserLocations extends AbstractCallback {}
        export class SaveUserLocation extends AbstractCallback<{location: UserSavedLocation}> {}
        export type PlayerPosition =  {x: number, y: number, z: number, heading: number};
        export class GetCurrentPlayerPosition extends AbstractCallback<null, PlayerPosition> {}
        export class MovePlayerToLocation extends AbstractCallback<{location: UserSavedLocation}> {}
        export class MovePlayerToCoords extends AbstractCallback<{coords: Vec3}> {}
    }

    export namespace NoClip {
        export class SetNoClipAboveGround extends AbstractCallback<{active: boolean}> {}
    }

    export namespace FlyHigh {
        export class FlyHigh extends AbstractCallback {}
    }
}



