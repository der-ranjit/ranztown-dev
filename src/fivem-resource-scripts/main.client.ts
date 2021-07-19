import { MenuControls } from "./client/MenuControls";
import { NuiEventsService } from "./client/NuiEventsService";
import { VehicleSpawner } from "./client/VehicleSpawner";

/* imported to tell the IDE about types */
import "@citizenfx/client";

const vehicleSpawner = VehicleSpawner.getInstance();
const eventsService = NuiEventsService.getInstance();
const menuControls = MenuControls.getInstance();
