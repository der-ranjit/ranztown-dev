import { resolve, } from "path";
import { ensureDirSync } from "fs-extra";
import { Low,  JSONFile } from "lowdb";
import { chain, CollectionChain } from "lodash";

interface DatabaseJSON<T> {
    entries: T[];
}
type TypedLowDatabase<T> = Low<DatabaseJSON<T>> & { chain: CollectionChain<T> };

const databaseRootPath = resolve(GetResourcePath(GetCurrentResourceName()), "storage");
ensureDirSync(databaseRootPath);

export abstract class LowDatabase<T> {
    protected database!: TypedLowDatabase<T>;

    protected async initDatabase<T>(filePath: string, initialData?: T) {
        const locationsDbPath = resolve(databaseRootPath, filePath);

        const adapter = new JSONFile<DatabaseJSON<T>>(locationsDbPath);
        const database: TypedLowDatabase<T> = new Low<DatabaseJSON<T>>(adapter) as any;
        // Read data from JSON file, this will set db.data content
        await database.read();
        const initData = initialData ? [initialData] : [];
        database.data = database.data || { entries: initData } as any;
        database.chain = chain(database.data?.entries);
        await database.write();
        this.database = database as any;
    }

    protected get entries() {
        return this.database.data!.entries;
    }

    protected async read() {
        await this.database.read();
        this.database.chain = chain(this.database.data?.entries);
    }

    protected async write() {
        await this.database.write();
    }
}
