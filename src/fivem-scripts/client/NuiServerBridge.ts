import { GetFileServerBaseUrl } from "../../angular-fivem-shared/nui-events/callbacks";
import { NuiCallbackEvents, NuiCallbackListener } from "./NuiEventsService";

@NuiCallbackEvents
export class NuiServerBridge {
    private static instance: NuiServerBridge | null = null;
    public static getInstance(): NuiServerBridge {
        if (!NuiServerBridge.instance) {
            NuiServerBridge.instance = new NuiServerBridge();
        }
        return NuiServerBridge.instance;
    }

    @NuiCallbackListener(GetFileServerBaseUrl)
    private async getFileServerBaseUrl(event: GetFileServerBaseUrl) {
        return { baseUrl: `http://${GetCurrentServerEndpoint()}/${GetCurrentResourceName()}` };
    }
}
