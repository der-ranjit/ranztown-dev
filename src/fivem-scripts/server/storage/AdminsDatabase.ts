import { User } from "../../../shared/storage/User";
import { LOCALHOST, ServerUtils } from "../utils";
import { LowDatabase } from "./LowDatabase.abstract";

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


    constructor() {
        super();
        onNet("client:getIsAdmin", () => this.emitIsAdmin(source));
    }

    private async emitIsAdmin(source: number) {
        const id = ServerUtils.getFivemId(source);
        await this.read();
        const isAdminInDatabase = !!this.database.chain.find({userId: id}).value();
        const isLocalHost = ServerUtils.getIp(source).indexOf(LOCALHOST) !== -1;
        emitNet("server:emitIsAdmin", source, isAdminInDatabase || isLocalHost);
    }
}