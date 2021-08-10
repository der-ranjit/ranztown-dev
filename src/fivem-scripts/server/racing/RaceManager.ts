import { ClientLoadTrackIDForAllPlayers, ServerLoadTrack } from "../../client-server-shared/events";
import { ClientEventListener, ClientEvents, ServerEventsService } from "../ServerEventsService";
import { RaceTrackDatabase } from "../storage/RaceTracksDatabase";

@ClientEvents
export class RaceManager {
    private static instance: RaceManager | null = null;
    public static async getInstance(): Promise<RaceManager> {
        if (!RaceManager.instance) {
            const instance = new RaceManager();
            RaceManager.instance = instance;
        }
        return RaceManager.instance;
    }

    private serverEvents = ServerEventsService.getInstance();

    @ClientEventListener(ClientLoadTrackIDForAllPlayers)
    private async loadTrackIDForAllPlayers(event: ClientLoadTrackIDForAllPlayers, source: number) {
        const tracksDatabase = await RaceTrackDatabase.getInstance();
        const track = await tracksDatabase.getTrackById(event.data.id);
        if (track != null) {
            this.serverEvents.emitNet(ServerLoadTrack, -1, { track });
        }
    }
}
