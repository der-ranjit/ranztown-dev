import { Race } from "../../angular-fivem-shared/Racing";
import { UserSavedLocation } from "../../angular-fivem-shared/serialization/UserSavedLocation";

export abstract class AbstractEvent<D = void> {
    /**
     * @param data - Optional data to sent with the event.
     */
    constructor(
        public data: D
    ){}
}
export type EventConstructor<T, D> = { new (data: D): T}

export class ClientLoadTrackIDForAllPlayers extends AbstractEvent<{id: string}> {}
export class ClientSaveRaceTrack extends AbstractEvent<{track: Race}> {}
export class ClientGetRaceTracks extends AbstractEvent {}
export class ClientGetIsAdmin extends AbstractEvent {}
export class ClientGetUserLocations extends AbstractEvent {}
export class ClientSaveUserLocation extends AbstractEvent<{location: UserSavedLocation}> {}

export class ServerEmitIsAdmin extends AbstractEvent<{isAdmin: boolean}> {}
export class ServerLoadTrack extends AbstractEvent<{track: Race}> {}
export class ServerEmitRaceTracks extends AbstractEvent<{tracks: Race[]}> {}
export class ServerUserLocationsUpdated extends AbstractEvent<{locations: UserSavedLocation[]}> {}
