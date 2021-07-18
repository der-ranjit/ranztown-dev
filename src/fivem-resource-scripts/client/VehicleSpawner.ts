import * as Cfx from "fivem-js";

import { NuiEventsService } from "./NuiEventsService";
import { Events } from "../../shared/events";

export class VehicleSpawner {
    private static instance: VehicleSpawner | null = null;
    public static getInstance(): VehicleSpawner {
        if (!VehicleSpawner.instance) {
            VehicleSpawner.instance = new VehicleSpawner();
        }
        return VehicleSpawner.instance;
    }

    private eventsService = NuiEventsService.getInstance();

    constructor() {
        this.initListeners();
    }

    private initListeners(): void {
        this.eventsService.on(Events.SpawnVehicle).subscribe(event => this.handleSpawnVehicleEvent(event.data, event.cb));
    }

    private async handleSpawnVehicleEvent(data: Events.SpawnVehicleData | null,cb: Function): Promise<void> {
        if (data != null) {
            await this.spawnVehicle(data.model);
            this.eventsService.emit(Events.Notification, { message: `Spawned vehicle: "${data.model}"` })
            cb(null);
        }
    }

    public async spawnVehicle(model: string): Promise<void> {
        const playerCoords = Cfx.Game.PlayerPed.Position;
        const vehicle = await Cfx.World.createVehicle(new Cfx.Model(model), playerCoords, Cfx.Game.PlayerPed.Heading);
        Cfx.Game.PlayerPed.setIntoVehicle(vehicle, Cfx.VehicleSeat.Driver);
    }

}
