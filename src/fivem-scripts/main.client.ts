/* imported to tell the IDE about types */
import "@citizenfx/client";
// init screen-shot basic script
import "./screenshot-basic/client";

import { MenuControls } from "./client/MenuControls";
import { CfxNuiEventsService } from "./client/NuiEventsService";
import { VehicleSpawner } from "./client/VehicleSpawner";
import { PedSpawner } from "./client/PedSpawner";
import { NuiServerBridge } from "./client/NuiServerBridge";
import { EntityManager } from "./client/EntityManager";
import { FlyHigh } from "./client/FlyHigh";

const vehicleSpawner = VehicleSpawner.getInstance();
const pedSpawner = PedSpawner.getInstance();
const eventsService = CfxNuiEventsService.getInstance();
const menuControls = MenuControls.getInstance();
const nuiServerBridge = NuiServerBridge.getInstance();
const entityManager = EntityManager.getInstance();
const flyHigh = FlyHigh.getInstance();

