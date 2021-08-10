import { take } from "rxjs/operators";
import { IsAdmin } from "../../angular-fivem-shared/nui-events/callbacks";
import { ClientGetIsAdmin, ServerEmitIsAdmin } from "../client-server-shared/events";
import { ClientEventsService } from "./ClientEventsService";
import { NuiCallbackEvents, NuiCallbackListener } from "./NuiEventsService";

@NuiCallbackEvents
export class AdminTools {
    private static instance: AdminTools | null = null;
    public static getInstance(): AdminTools {
        if (!AdminTools.instance) {
            AdminTools.instance = new AdminTools();
        }
        return AdminTools.instance;
    }

    private events = ClientEventsService.getInstance();

    @NuiCallbackListener(IsAdmin)
    private async handleGetIsAdmin(event: IsAdmin) {
        this.events.emitNet(ClientGetIsAdmin);
        const serverEvent$ = this.events.getObservableForServerEvent(ServerEmitIsAdmin);
        const eventResult = await serverEvent$.pipe(take(1)).toPromise();
        return { isAdmin: eventResult.data.isAdmin }
    }
}
