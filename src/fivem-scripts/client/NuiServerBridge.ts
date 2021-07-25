import { GetCurrentPlayerPosition, GetUserLocations, MovePlayerToLocation, SaveUserLocation } from "../../shared/nui-events/callbacks";
import { UserLocationsUpdate } from "../../shared/nui-events/messages";
import { UserSavedLocation } from "../../shared/storage/UserSavedLocation";
import { Locations } from "./Locations";
import { CfxNuiEventsService, NuiCallbackEvents, NuiCallbackListener } from "./NuiEventsService";

@NuiCallbackEvents
export class NuiServerBridge {
    private static instance: NuiServerBridge | null = null;
    public static getInstance(): NuiServerBridge {
        if (!NuiServerBridge.instance) {
            NuiServerBridge.instance = new NuiServerBridge();
        }
        return NuiServerBridge.instance;
    }

    private events = CfxNuiEventsService.getInstance();
    private locations = Locations.getInstance();

    constructor() {
        onNet("server:userLocationsUpdated", (locations: UserSavedLocation[]) => {
            this.events.emitNuiMessage(UserLocationsUpdate, { locations })
        });
    }

    @NuiCallbackListener(GetUserLocations)
    private async getUserLocations(event: GetUserLocations): Promise<void> {
        emitNet("client:getUserLocations");
    }


    @NuiCallbackListener(SaveUserLocation)
    private async saveUserLocation(event: SaveUserLocation): Promise<void> {
        emitNet("client:saveUserLocation", event.data.location);
    }

    @NuiCallbackListener(MovePlayerToLocation)
    private async movePlayerToLocation(event: MovePlayerToLocation): Promise<void> {
        this.locations.movePlayerToLocation(event.data.location);
    }

    @NuiCallbackListener(GetCurrentPlayerPosition)
    private async getCurrentPlayerPosition(event: GetCurrentPlayerPosition) {
        return this.locations.getCurrentPlayerPosition();
    }
}