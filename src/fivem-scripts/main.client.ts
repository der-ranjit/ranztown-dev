/* imported to tell the IDE about types */
import "@citizenfx/client";
// init screen-shot basic script
import "./screenshot-basic/client";

import { MenuControls } from "./client/MenuControls";
import { CfxNuiEventsService } from "./client/NuiEventsService";
import { VehicleManager } from "./client/VehicleManager";
import { PedSpawner } from "./client/PedSpawner";
import { NuiServerBridge } from "./client/NuiServerBridge";
import { EntityManager } from "./client/EntityManager";
import { FlyHigh } from "./client/FlyHigh";
import { bootstrap } from "./client-server-shared/bootstrap";

const bootstrapped = [
    MenuControls,
    CfxNuiEventsService,
    VehicleManager,
    PedSpawner,
    NuiServerBridge,
    EntityManager,
    FlyHigh
];

bootstrap(bootstrapped);

