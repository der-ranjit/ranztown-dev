import * as Cfx from "fivem-js";
import { Vector3 } from "fivem-js";
import { MovePlayerToCoords, PlayerPosition } from "../../angular-fivem-shared/nui-events/callbacks";
import { UserSavedLocation } from "../../angular-fivem-shared/storage/UserSavedLocation";
import { isVec3 } from "../../angular-fivem-shared/Vector";
import { NuiCallbackEvents, NuiCallbackListener } from "./NuiEventsService";

@NuiCallbackEvents
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

    @NuiCallbackListener(MovePlayerToCoords)
    public async teleportPlayer(event: MovePlayerToCoords) {
        if (isVec3(event?.data?.coords)) {
            Cfx.Game.PlayerPed.Position = Vector3.create(event.data.coords);
        }
    }
}
