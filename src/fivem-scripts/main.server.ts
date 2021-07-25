/* imported to tell the IDE about types */
import "@citizenfx/server";
import { UserLocationsDatabase } from "./server/storage/UserLocationsDatabase";

init();

async function init() {
    const userLocationsDatabase = await UserLocationsDatabase.getInstance();
}
