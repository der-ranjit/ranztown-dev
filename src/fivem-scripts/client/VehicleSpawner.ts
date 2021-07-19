import * as Cfx from "fivem-js";

import { CfxNuiEventsService } from "./NuiEventsService";
import { Callback, Message } from "../../shared/nui-events";

export class VehicleSpawner {
    private static instance: VehicleSpawner | null = null;
    public static getInstance(): VehicleSpawner {
        if (!VehicleSpawner.instance) {
            VehicleSpawner.instance = new VehicleSpawner();
        }
        return VehicleSpawner.instance;
    }

    private eventsService = CfxNuiEventsService.getInstance();

    constructor() {
        this.initListeners();
    }

    private initListeners(): void {
        this.eventsService.onNuiCallback(Callback.SpawnVehicle).subscribe(this.handleSpawnVehicleEvent.bind(this));
    }

    private async handleSpawnVehicleEvent(event: Callback.SpawnVehicle): Promise<void> {
        if (event.data != null) {
            await this.spawnVehicle(event.data.model);
            this.eventsService.emitNuiMessage(Message.Notification, { message: `Spawned vehicle: "${event.data.model}"` });
            event.cb("done");
        }
    }

    public async spawnVehicle(model: string): Promise<void> {
        const playerCoords = Cfx.Game.PlayerPed.Position;
        const vehicle = await Cfx.World.createVehicle(new Cfx.Model(model), playerCoords, Cfx.Game.PlayerPed.Heading);
        Cfx.Game.PlayerPed.setIntoVehicle(vehicle, Cfx.VehicleSeat.Driver);
    }

}
