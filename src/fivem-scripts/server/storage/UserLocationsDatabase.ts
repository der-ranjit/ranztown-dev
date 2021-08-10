import { ensureDirSync } from "fs-extra";
import { relative, resolve } from "path";
import { UserSavedLocation } from "../../../angular-fivem-shared/serialization/UserSavedLocation";
import { ClientGetUserLocations, ClientSaveUserLocation, ServerUserLocationsUpdated } from "../../client-server-shared/events";
import { requestClientScreenshot } from "../../screenshot-basic/server";
import { Identifiers } from "../Identifiers";
import { ClientEventListener, ClientEvents, ServerEventsService } from "../ServerEventsService";
import { LowDatabase } from "./LowDatabase.abstract";

const resourcePath = resolve(GetResourcePath(GetCurrentResourceName()));
const uploadPath = resolve(resourcePath, "storage", "upload");
ensureDirSync(uploadPath);

@ClientEvents
export class UserLocationsDatabase extends LowDatabase<UserSavedLocation>{
    private static instance: UserLocationsDatabase | null = null;
    public static async getInstance(): Promise<UserLocationsDatabase> {
        if (!UserLocationsDatabase.instance) {
            const instance = new UserLocationsDatabase();
            await instance.initDatabase("userLocations.json");
            UserLocationsDatabase.instance = instance;
        }
        return UserLocationsDatabase.instance;
    }

    private events = ServerEventsService.getInstance();

    @ClientEventListener(ClientGetUserLocations)
    private async handleEmitUserLocations(event: ClientGetUserLocations, source: number) {
        this.emitUserLocations(source);
    }

    private async emitUserLocations(source: number) {
        const id = Identifiers.getFivemId(source);
        await this.read();
        const locations = this.database.chain.filter({userId: id}).value();
        this.events.emitNet(ServerUserLocationsUpdated, source, { locations });

    }

    @ClientEventListener(ClientSaveUserLocation)
    private async saveUserLocation(event: ClientSaveUserLocation, source: number) {
        const id = Identifiers.getFivemId(source);
        const location = event.data.location;
        const previewPath = await this.getClientScreenshot(id, location, source);
        // fix windows paths with replace
        const relativePreviewPath = relative(resourcePath, previewPath).replace(/\\/g, '/');;
        await this.read();
        this.entries.push({...location, userId: id, previewFilePath: relativePreviewPath});
        await this.write();
        this.emitUserLocations(source);
    }

    private async getClientScreenshot(id: string, location: UserSavedLocation, source: number): Promise<string> {
        return new Promise(resolve => {
            // TODO use correct generic export path
            requestClientScreenshot(source, {
                fileName: `${uploadPath}/${id}_${location.locationName}.jpg`
            }, function(error: any, data: any) {
                resolve(data);
            });
        })
    }
}
