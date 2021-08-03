import { GetFileServerBaseUrl } from "../../angular-fivem-shared/nui-events/callbacks";
import { NuiCallbackEvents, NuiCallbackListener } from "./NuiEventsService";

@NuiCallbackEvents
export class ClientConfiguration {
    private static instance: ClientConfiguration | null = null;
    public static getInstance(): ClientConfiguration {
        if (!ClientConfiguration.instance) {
            ClientConfiguration.instance = new ClientConfiguration();
        }
        return ClientConfiguration.instance;
    }

    @NuiCallbackListener(GetFileServerBaseUrl)
    private async getFileServerBaseUrl(event: GetFileServerBaseUrl) {
        return { baseUrl: `http://${GetCurrentServerEndpoint()}/${GetCurrentResourceName()}` };
    }
}
