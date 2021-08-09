import { RaceTrackDatabase } from "../storage/RaceTracksDatabase";

export class RaceManager {
    private static instance: RaceManager | null = null;
    public static async getInstance(): Promise<RaceManager> {
        if (!RaceManager.instance) {
            const instance = new RaceManager();
            RaceManager.instance = instance;
        }
        return RaceManager.instance;
    }


    constructor() {
        onNet("client:loadTrackIDForAllPlayers", (id: string) => this.loadTrackIDForAllPlayers(id));
    }

    private async loadTrackIDForAllPlayers(id: string) {
        const tracksDatabase = await RaceTrackDatabase.getInstance();
        const track = await tracksDatabase.getTrackById(id);
        if (track != null) {
            emitNet("server:loadTrack", -1, track)
        }
    }
}
