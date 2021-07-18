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
        RegisterNuiCallbackType("spawnCar");
        on(`__cfx_nui:spawnCar`, async (data: {model: string}, cb: any) => {
            await this.spawnCar(data.model);
            // notify nui about spawned car
            this.nuiService.sendMessage(Events.Notification, { message: `Spawned car: "${data.model}"` })
            cb(RESPONSE_OK);
        });
    }

    public async spawnCar(model: string): Promise<void> {
        const playerCoords = Cfx.Game.PlayerPed.Position;
        const vehicle = await Cfx.World.createVehicle(new Cfx.Model(model), playerCoords, Cfx.Game.PlayerPed.Heading);
        Cfx.Game.PlayerPed.setIntoVehicle(vehicle, Cfx.VehicleSeat.Driver);
    }

}
