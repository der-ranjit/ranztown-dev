/* imported to tell the IDE about types */
import "@citizenfx/server";
// init screen-shot basic script
import "./screenshot-basic/server";

import { AdminDatabase } from "./server/storage/AdminsDatabase";
import { UserLocationsDatabase } from "./server/storage/UserLocationsDatabase";
import { bootstrap } from "./client-server-shared/bootstrap";
import { RaceTrackDatabase } from "./server/storage/RaceTracksDatabase";

const bootstrapped = [
    AdminDatabase,
    UserLocationsDatabase,
    RaceTrackDatabase
];

bootstrap(bootstrapped);
