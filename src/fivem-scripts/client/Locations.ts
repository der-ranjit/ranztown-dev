import * as Cfx from "fivem-js";
import { Vector3 } from "fivem-js";

import { GetCurrentPlayerPosition, GetUserLocations, MovePlayerToCoords, MovePlayerToLocation, PlayerPosition,
         SaveUserLocation, SetNoClipAboveGround } from "../../angular-fivem-shared/nui-events/callbacks";
import { UserLocationsUpdate } from "../../angular-fivem-shared/nui-events/messages";
import { UserSavedLocation } from "../../angular-fivem-shared/serialization/UserSavedLocation";
import { isVec3 } from "../../angular-fivem-shared/Vector";
import { ClientGetUserLocations, ClientSaveUserLocation, ServerUserLocationsUpdated } from "../client-server-shared/events";
import { ClientEventsService, ServerEventListener, ServerEvents } from "./ClientEventsService";
import { CfxNuiEventsService, NuiCallbackEvents, NuiCallbackListener } from "./NuiEventsService";

@NuiCallbackEvents
@ServerEvents
export class Locations {
    private static instance: Locations | null = null;
    public static getInstance(): Locations {
        if (!Locations.instance) {
            Locations.instance = new Locations();
        }
        return Locations.instance;
    }

    private nuiEvents = CfxNuiEventsService.getInstance();
    private events = ClientEventsService.getInstance();

    @ServerEventListener(ServerUserLocationsUpdated)
    private handleServerUserLocationsUpdated(event: ServerUserLocationsUpdated) {
        this.nuiEvents.emitNuiMessage(UserLocationsUpdate, { locations: event.data.locations })
    }

    @NuiCallbackListener(GetUserLocations)
    private async onGetUserLocations(event: GetUserLocations): Promise<void> {
        this.events.emitNet(ClientGetUserLocations);
    }

    @NuiCallbackListener(SaveUserLocation)
    private async onSaveUserLocation(event: SaveUserLocation): Promise<void> {
        this.events.emitNet(ClientSaveUserLocation, {location: event.data.location});
    }

    @NuiCallbackListener(MovePlayerToLocation)
    private async onMovePlayerToLocation(event: MovePlayerToLocation): Promise<void> {
        this.movePlayerToLocation(event.data.location);
    }

    @NuiCallbackListener(GetCurrentPlayerPosition)
    private async onGetCurrentPlayerPosition(event: GetCurrentPlayerPosition) {
        return this.getCurrentPlayerPosition();
    }

    public movePlayerToLocation(location: UserSavedLocation): void {
        const player = Cfx.Game.Player.Character;
        const target = player.isInAnyVehicle() ? player.CurrentVehicle: player;
        target.Position = new Vector3(location.x, location.y, location.z);
        target.Heading = location.heading;
        // set camera to look in direction of heading
        Cfx.GameplayCamera.RelativeHeading = 0;
    }

    @NuiCallbackListener(MovePlayerToCoords)
    public async teleportPlayer(event: MovePlayerToCoords) {
        if (isVec3(event?.data?.coords)) {
            Cfx.Game.PlayerPed.Position = Vector3.create(event.data.coords);
        }
    }

    @NuiCallbackListener(SetNoClipAboveGround)
    public async setNoClipAboveGround(event: SetNoClipAboveGround) {
        exports[GetCurrentResourceName()].SetNoClipAboveGround(event.data.active);
    }

    public getCurrentPlayerPosition(): PlayerPosition {
        const player = Cfx.Game.Player.Character;
        const target = player.isInAnyVehicle() ? player.CurrentVehicle: player;

        const {x, y, z} = target.Position;
        const heading = target.Heading;
        return {x, y, z, heading};
    }
}
