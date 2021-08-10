import { v4 } from 'uuid';

import { Race } from "../../../angular-fivem-shared/Racing";
import { ClientGetRaceTracks, ClientSaveRaceTrack, ServerEmitRaceTracks } from '../../client-server-shared/events';
import { Identifiers } from "../Identifiers";
import { ClientEventListener, ClientEvents, ServerEventsService } from '../ServerEventsService';
import { LowDatabase } from "./LowDatabase.abstract";

@ClientEvents
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

    private serverEvents = ServerEventsService.getInstance();

    public async getTrackById(id: string): Promise<Race | null> {
        await this.read();
        const track = this.database.chain.find({id}).value();
        return track ?? null;
    }

    @ClientEventListener(ClientGetRaceTracks)
    private async handleClientGetRaceTracks(event: ClientGetRaceTracks, source: number) {
        this.emitRaceTracks();
    }

    @ClientEventListener(ClientSaveRaceTrack)
    private async saveRace(event: ClientSaveRaceTrack, source: number, ) {
        const userId = Identifiers.getFivemId(source);
        const id = v4();
        await this.read();
        this.entries.push({...event.data.track, userId, id});
        await this.write();
        this.emitRaceTracks();
    }

    private async emitRaceTracks() {
        await this.read();
        const tracks = this.database.data?.entries;
        if (tracks) {
            this.serverEvents.emitNet(ServerEmitRaceTracks, -1, { tracks });
        }
    }
}
