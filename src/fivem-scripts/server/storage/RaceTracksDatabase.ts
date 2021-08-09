import { v4 } from 'uuid';

import { Race } from "../../../angular-fivem-shared/Racing";
import { Identifiers } from "../Identifiers";
import { LowDatabase } from "./LowDatabase.abstract";

export class RaceTrackDatabase extends LowDatabase<Race>{
    private static instance: RaceTrackDatabase | null = null;
    public static async getInstance(): Promise<RaceTrackDatabase> {
        if (!RaceTrackDatabase.instance) {
            const instance = new RaceTrackDatabase();
            await instance.initDatabase("race_tracks.json");
            RaceTrackDatabase.instance = instance;
        }
        return RaceTrackDatabase.instance;
    }


    constructor() {
        super();
        onNet("client:saveRaceTrack", (race: Race) => this.saveRace(source, race));
        onNet("client:getRaceTracks", () => this.emitRaceTracks());
    }

    public async getTrackById(id: string): Promise<Race | null> {
        await this.read();
        const track = this.database.chain.find({id}).value();
        return track ?? null;
    }

    private async emitRaceTracks() {
        await this.read();
        const races = this.database.data?.entries;
        emitNet("server:emitRaceTracks", -1, races);
    }

    private async saveRace(source: number, race: Race) {
        const userId = Identifiers.getFivemId(source);
        const id = v4();
        await this.read();
        this.entries.push({...race, userId, id});
        await this.write();
        this.emitRaceTracks();
    }
}
