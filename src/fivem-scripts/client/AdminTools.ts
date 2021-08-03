import { IsAdmin } from "../../angular-fivem-shared/nui-events/callbacks";
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

    @NuiCallbackListener(IsAdmin)
    private async OnGetIsAdmin(event: IsAdmin) {
        emitNet("client:getIsAdmin");
        const promise = new Promise<boolean>(resolve => {
            onNet("server:emitIsAdmin", (isAdmin: boolean) => {
                resolve(isAdmin)
            })
        });
        const isAdmin = await promise;
        return { isAdmin }
    }
}
