import { User } from "../../../angular-fivem-shared/serialization/User";
import { Client, Server } from "../../client-server-shared/events";
import { LOCALHOST, Identifiers } from "../Identifiers";
import { ClientEventListener, ClientEvents, ServerEventsService } from "../ServerEventsService";
import { LowDatabase } from "./LowDatabase.abstract";

@ClientEvents
export class AdminDatabase extends LowDatabase<User>{
    private static instance: AdminDatabase | null = null;
    public static async getInstance(): Promise<AdminDatabase> {
        if (!AdminDatabase.instance) {
            const instance = new AdminDatabase();
            await instance.initDatabase("admins.json");
            AdminDatabase.instance = instance;
        }
        return AdminDatabase.instance;
    }

    private events = ServerEventsService.getInstance();

    @ClientEventListener(Client.AdminTools.GetIsAdmin)
    private async emitIsAdmin(event: Client.AdminTools.GetIsAdmin, source: number) {
        const id = Identifiers.getFivemId(source);
        await this.read();
        const isAdminInDatabase = !!this.database.chain.find({userId: id}).value();
        const isLocalHost = Identifiers.getIp(source).indexOf(LOCALHOST) !== -1;
        this.events.emitNet(Server.AdminTools.EmitIsAdmin, source, {isAdmin: isAdminInDatabase || isLocalHost});
    }
}
