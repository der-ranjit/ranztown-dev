import { UserSavedLocation } from "../../../shared/storage/UserSavedLocation";
import { ServerUtils } from "../utils";
import { LowDatabase } from "./LowDatabase.abstract";

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
        const id = ServerUtils.getFivemId(source);
        await this.read();
        const locations = this.database.chain.filter({userId: id}).value();
        emitNet("server:userLocationsUpdated", source, locations);
    }

    private async saveUserLocation(source: number, location: UserSavedLocation) {
        const id = ServerUtils.getFivemId(source);
        await this.read();
        this.entries.push({...location, userId: id});
        await this.write();
        this.emitUserLocations(source);
    }
}
