import * as Cfx from "fivem-js";

import { CfxNuiEventsService, NuiCallbackListener, NuiCallbackEvents } from "./NuiEventsService";
import { Callback, Message } from "../../shared/nui-events";
import { SpawnVehicleData } from "../../shared/nui-events/callbacks";

@NuiCallbackEvents
export class VehicleSpawner {
    private static instance: VehicleSpawner | null = null;
    public static getInstance(): VehicleSpawner {
        if (!VehicleSpawner.instance) {
            VehicleSpawner.instance = new VehicleSpawner();
        }
        return VehicleSpawner.instance;
    }

    private eventsService = CfxNuiEventsService.getInstance();

    @NuiCallbackListener(Callback.SpawnVehicle)
    private async handleSpawnVehicleEvent(data: SpawnVehicleData): Promise<void> {
        if (data != null) {
            await this.spawnVehicle(data.model);
            this.eventsService.emitNuiMessage(Message.Notification, { message: `Spawned vehicle: "${data.model}"` });
        }
    }

    public async spawnVehicle(model: string): Promise<void> {
        const playerCoords = Cfx.Game.PlayerPed.Position;
        const vehicle = await Cfx.World.createVehicle(new Cfx.Model(model), playerCoords, Cfx.Game.PlayerPed.Heading);
        Cfx.Game.PlayerPed.setIntoVehicle(vehicle, Cfx.VehicleSeat.Driver);
        vehicle.RadioStation = Cfx.RadioStation.RadioOff;
    }

}
