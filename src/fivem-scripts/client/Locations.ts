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
        player.Position = new Vector3(location.x, location.y, location.z);
        player.Heading = location.heading;
        Cfx.GameplayCamera.RelativeHeading = 0;
    }

    public getCurrentPlayerPosition(): PlayerPosition {
        const player = Cfx.Game.Player.Character;
        const position = player.Position;
        return {
            x: position.x,
            y: position.y,
            z: position.z,
            heading: player.Heading
        }
    }
}
