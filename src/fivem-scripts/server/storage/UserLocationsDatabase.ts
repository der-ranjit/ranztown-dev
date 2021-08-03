import { ensureDirSync } from "fs-extra";
import { relative, resolve } from "path";
import { UserSavedLocation } from "../../../angular-fivem-shared/storage/UserSavedLocation";
import { requestClientScreenshot } from "../../screenshot-basic/server";
import { Identifiers } from "../Identifiers";
import { LowDatabase } from "./LowDatabase.abstract";

const resourcePath = resolve(GetResourcePath(GetCurrentResourceName()));
const uploadPath = resolve(resourcePath, "storage", "upload");
ensureDirSync(uploadPath);

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


    constructor() {
        super();
        onNet("client:saveUserLocation", (location: UserSavedLocation) => this.saveUserLocation(source, location));
        onNet("client:getUserLocations", () => this.emitUserLocations(source));
    }

    private async emitUserLocations(source: number) {
        const id = Identifiers.getFivemId(source);
        await this.read();
        const locations = this.database.chain.filter({userId: id}).value();
        emitNet("server:userLocationsUpdated", source, locations);
    }

    private async saveUserLocation(source: number, location: UserSavedLocation) {
        const id = Identifiers.getFivemId(source);
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
