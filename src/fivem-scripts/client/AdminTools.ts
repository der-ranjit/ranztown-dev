import { take } from "rxjs/operators";

import { NuiCB } from "../../angular-fivem-shared/nui-events/callbacks";
import { Client, Server } from "../client-server-shared/events";
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

    @NuiCallbackListener(NuiCB.AdminTools.IsAdmin)
    private async handleGetIsAdmin(event: NuiCB.AdminTools.IsAdmin) {
        this.events.emitNet(Client.AdminTools.GetIsAdmin);
        const serverEvent$ = this.events.getObservableForServerEvent(Server.AdminTools.EmitIsAdmin);
        const eventResult = await serverEvent$.pipe(take(1)).toPromise();
        return { isAdmin: eventResult.data.isAdmin }
    }
}
