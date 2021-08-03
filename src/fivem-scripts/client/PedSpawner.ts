import { CfxNuiEventsService, NuiCallbackListener, NuiCallbackEvents } from "./NuiEventsService";
import { Callback, Message } from "../../angular-fivem-shared/nui-events";
import { sleep } from "../../angular-fivem-shared/utils";

@NuiCallbackEvents
export class PedSpawner {
    private static instance: PedSpawner | null = null;
    public static getInstance(): PedSpawner {
        if (!PedSpawner.instance) {
            PedSpawner.instance = new PedSpawner();
        }
        return PedSpawner.instance;
    }

    private eventsService = CfxNuiEventsService.getInstance();

    @NuiCallbackListener(Callback.ChangePed)
    private async handleChangePedEvent(event: Callback.ChangePed): Promise<void> {
        const data = event.data;
        if (data != null) {
            let message = `Change Ped: "${data.ped}"`;
            try {
                await this.changePed(data.ped);
            } catch (error) {
                message = `PedSpawner: tried to change unavailable ped "${data.ped}"`
                console.warn(message)
            }
            this.eventsService.emitNuiMessage(Message.Notification, { message });
        }
    }

    public async changePed(ped: string): Promise<void> {
        const model = GetHashKey(ped)
        RequestModel(model)
        while (!HasModelLoaded(model)) {
            RequestModel(model)
            await sleep();
        }
        SetPlayerModel(PlayerId(), model)
    }
}
