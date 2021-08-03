import { GetCurrentPlayerPosition, GetFileServerBaseUrl, GetUserLocations, IsAdmin, MovePlayerToLocation, SaveUserLocation } from "../../shared/nui-events/callbacks";
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

    @NuiCallbackListener(IsAdmin)
    private async getIsAdmin(event: IsAdmin) {
        emitNet("client:getIsAdmin");
        const promise = new Promise<boolean>(resolve => {
            onNet("server:emitIsAdmin", (isAdmin: boolean) => {
                resolve(isAdmin)
            })
        });
        const isAdmin = await promise;
        return { isAdmin }
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

    @NuiCallbackListener(GetFileServerBaseUrl)
    private async getFileServerBaseUrl(event: GetFileServerBaseUrl) {
        return { baseUrl: `http://${GetCurrentServerEndpoint()}/${GetCurrentResourceName()}` };
    }
}
