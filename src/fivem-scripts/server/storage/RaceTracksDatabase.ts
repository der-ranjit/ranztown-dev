import { v4 } from 'uuid';

import { Race } from "../../../angular-fivem-shared/Racing";
import { Client, Server } from '../../client-server-shared/events';
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

    @ClientEventListener(Client.Racing.GetRaceTracks)
    private async handleClientGetRaceTracks(event: Client.Racing.GetRaceTracks, source: number) {
        this.emitRaceTracks();
    }

    @ClientEventListener(Client.Racing.SaveRaceTrack)
    private async saveRace(event: Client.Racing.SaveRaceTrack, source: number, ) {
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
            this.serverEvents.emitNet(Server.Racing.EmitRaceTracks, -1, { tracks });
        }
    }
}
