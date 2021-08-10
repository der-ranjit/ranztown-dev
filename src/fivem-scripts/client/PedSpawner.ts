import { CfxNuiEventsService, NuiCallbackListener, NuiCallbackEvents } from "./NuiEventsService";
import { sleep } from "../../angular-fivem-shared/utils";
import { Nui } from "../../angular-fivem-shared/nui-events/messages";
import { NuiCB } from "../../angular-fivem-shared/nui-events/callbacks";

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

    @NuiCallbackListener(NuiCB.PedManager.ChangePed)
    private async handleChangePedEvent(event: NuiCB.PedManager.ChangePed): Promise<void> {
        const data = event.data;
        if (data != null) {
            let message = `Change Ped: "${data.ped}"`;
            try {
                await this.changePed(data.ped);
            } catch (error) {
                message = `PedSpawner: tried to change unavailable ped "${data.ped}"`
                console.warn(message)
            }
            this.eventsService.emitNuiMessage(Nui.Main.Notification, { message });
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
