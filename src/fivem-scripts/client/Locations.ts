import * as Cfx from "fivem-js";
import { Vector3 } from "fivem-js";

import { NuiCB } from "../../angular-fivem-shared/nui-events/callbacks";
import { Nui } from "../../angular-fivem-shared/nui-events/messages";
import { UserSavedLocation } from "../../angular-fivem-shared/serialization/UserSavedLocation";
import { isVec3 } from "../../angular-fivem-shared/Vector";
import { Client, Server } from "../client-server-shared/events";
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

    @ServerEventListener(Server.Locations.UserLocationsUpdated)
    private handleServerUserLocationsUpdated(event: Server.Locations.UserLocationsUpdated) {
        this.nuiEvents.emitNuiMessage(Nui.Locations.UserLocationsUpdate, { locations: event.data.locations })
    }

    @NuiCallbackListener(NuiCB.Locations.GetUserLocations)
    private async onGetUserLocations(event: NuiCB.Locations.GetUserLocations): Promise<void> {
        this.events.emitNet(Client.Locations.GetUserLocations);
    }

    @NuiCallbackListener(NuiCB.Locations.SaveUserLocation)
    private async onSaveUserLocation(event: NuiCB.Locations.SaveUserLocation): Promise<void> {
        this.events.emitNet(Client.Locations.SaveUserLocation, {location: event.data.location});
    }

    @NuiCallbackListener(NuiCB.Locations.MovePlayerToLocation)
    private async onMovePlayerToLocation(event: NuiCB.Locations.MovePlayerToLocation): Promise<void> {
        this.movePlayerToLocation(event.data.location);
    }

    @NuiCallbackListener(NuiCB.Locations.GetCurrentPlayerPosition)
    private async onGetCurrentPlayerPosition(event: NuiCB.Locations.GetCurrentPlayerPosition) {
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

    @NuiCallbackListener(NuiCB.Locations.MovePlayerToCoords)
    public async teleportPlayer(event: NuiCB.Locations.MovePlayerToCoords) {
        if (isVec3(event?.data?.coords)) {
            Cfx.Game.PlayerPed.Position = Vector3.create(event.data.coords);
        }
    }

    @NuiCallbackListener(NuiCB.NoClip.SetNoClipAboveGround)
    public async setNoClipAboveGround(event: NuiCB.NoClip.SetNoClipAboveGround) {
        exports[GetCurrentResourceName()].SetNoClipAboveGround(event.data.active);
    }

    public getCurrentPlayerPosition(): NuiCB.Locations.PlayerPosition {
        const player = Cfx.Game.Player.Character;
        const target = player.isInAnyVehicle() ? player.CurrentVehicle: player;

        const {x, y, z} = target.Position;
        const heading = target.Heading;
        return {x, y, z, heading};
    }
}
