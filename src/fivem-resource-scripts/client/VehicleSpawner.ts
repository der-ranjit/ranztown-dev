import * as Cfx from "fivem-js";

import { NuiService } from "./NuiService";
import { Events } from "../../events";

const RESPONSE_OK = { status: "VehicleSpawner: ok" };

export class VehicleSpawner {
    private static instance: VehicleSpawner | null = null;
    public static getInstance(): VehicleSpawner {
        if (!VehicleSpawner.instance) {
            VehicleSpawner.instance = new VehicleSpawner();
        }
        return VehicleSpawner.instance;
    }

    private nuiService = NuiService.getInstance();

    constructor() {
        this.initActions();
    }



    private initActions(): void {
        this.nuiService.createNuiCallbackListener("spawnCar", this.handleSpawnCarEvent.bind(this));
    }

    private async handleSpawnCarEvent(data: any, cb: Function): Promise<void> {
        await this.spawnCar(data.model);
        this.nuiService.sendMessage(Events.Notification, { message: `Spawned car: "${data.model}"` })
        cb(RESPONSE_OK);
    }

    public async spawnCar(model: string): Promise<void> {
        const playerCoords = Cfx.Game.PlayerPed.Position;
        const vehicle = await Cfx.World.createVehicle(new Cfx.Model(model), playerCoords, Cfx.Game.PlayerPed.Heading);
        Cfx.Game.PlayerPed.setIntoVehicle(vehicle, Cfx.VehicleSeat.Driver);
    }

}
