/* imported to tell the IDE about types */
import "@citizenfx/client";
// init screen-shot basic script
import "./screenshot-basic/client";

import { MenuControls } from "./client/MenuControls";
import { CfxNuiEventsService } from "./client/NuiEventsService";
import { VehicleManager } from "./client/VehicleManager";
import { PedSpawner } from "./client/PedSpawner";
import { ClientConfiguration } from "./client/ClientConfiguration";
import { EntityManager } from "./client/EntityManager";
import { FlyHigh } from "./client/FlyHigh";
import { bootstrap } from "./client-server-shared/bootstrap";
import { AdminTools } from "./client/AdminTools";
import { Locations } from "./client/Locations";

const bootstrapped = [
    MenuControls,
    CfxNuiEventsService,
    VehicleManager,
    PedSpawner,
    ClientConfiguration,
    EntityManager,
    FlyHigh,
    AdminTools,
    Locations
];

bootstrap(bootstrapped);

