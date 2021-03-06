import { Race } from "../Racing";
import { UserSavedLocation } from "../serialization/UserSavedLocation";

export abstract class AbstractMessage<D = void> {
    /**
     * @param data - Optional data that can be sent with the message.
     */
    constructor(
        public data: D
    ){}
}
export type MessageConstructor<T, D> = { new (data: D): T}

export namespace Nui {
    export namespace Locations {
        export class UserLocationsUpdate extends AbstractMessage<{ locations: UserSavedLocation[] }> {}
    }

    export namespace Main {
        export class Notification extends AbstractMessage<{ message: string }> {}
        export type NuiMode = "menu" | "inspector" | "inactive";
        export class SetNuiMode extends AbstractMessage<{ nuiMode: NuiMode }> {}
    }

    export namespace Racing {
        export class RaceTracksUpdated extends AbstractMessage<{raceTracks: Race[]}> {}
    }
}
