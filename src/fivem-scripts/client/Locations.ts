import * as Cfx from "fivem-js";
import { Vector3 } from "fivem-js";
import { PlayerPosition } from "../../shared/nui-events/callbacks";
import { UserSavedLocation } from "../../shared/storage/UserSavedLocation";

export class Locations {
    private static instance: Locations | null = null;
    public static getInstance(): Locations {
        if (!Locations.instance) {
            Locations.instance = new Locations();
        }
        return Locations.instance;
    }

    public movePlayerToLocation(location: UserSavedLocation): void {
        const player = Cfx.Game.Player.Character;
        const target = player.isInAnyVehicle() ? player.CurrentVehicle: player;
        target.Position = new Vector3(location.x, location.y, location.z);
        target.Heading = location.heading;
        // set camera to look in direction of heading
        Cfx.GameplayCamera.RelativeHeading = 0;
    }

    public getCurrentPlayerPosition(): PlayerPosition {
        const player = Cfx.Game.Player.Character;
        const target = player.isInAnyVehicle() ? player.CurrentVehicle: player;

        const {x, y, z} = target.Position;
        const heading = target.Heading;
        return {x, y, z, heading};
    }
}
