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

export namespace Client {
    export namespace Racing {
        export class LoadTrackIDForAllPlayers extends AbstractEvent<{id: string}> {}
        export class SaveRaceTrack extends AbstractEvent<{track: Race}> {}
        export class GetRaceTracks extends AbstractEvent {}
    }

    export namespace Locations {
        export class GetUserLocations extends AbstractEvent {}
        export class SaveUserLocation extends AbstractEvent<{location: UserSavedLocation}> {}
    }

    export namespace AdminTools {
        export class GetIsAdmin extends AbstractEvent {}
    }
}

export namespace Server {
    export namespace AdminTools {
        export class EmitIsAdmin extends AbstractEvent<{isAdmin: boolean}> {}
    }

    export namespace Racing {
        export class LoadTrack extends AbstractEvent<{track: Race}> {}
        export class EmitRaceTracks extends AbstractEvent<{tracks: Race[]}> {}
    }

    export namespace Locations {
        export class UserLocationsUpdated extends AbstractEvent<{locations: UserSavedLocation[]}> {}
    }
}


