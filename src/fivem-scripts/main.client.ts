import { MenuControls } from "./client/MenuControls";
import { CfxNuiEventsService } from "./client/NuiEventsService";
import { VehicleSpawner } from "./client/VehicleSpawner";

/* imported to tell the IDE about types */
import "@citizenfx/client";

const vehicleSpawner = VehicleSpawner.getInstance();
const eventsService = CfxNuiEventsService.getInstance();
const menuControls = MenuControls.getInstance();
