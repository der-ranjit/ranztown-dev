import * as Cfx from "fivem-js";

import { CfxNuiEventsService, NuiCallbackListener, NuiCallbackEvents } from "./NuiEventsService";
import { Callback, Message } from "../../shared/nui-events";
import { Color } from "fivem-js";
import { cssHexStringToRgb } from "../Colors";
import { GetPlayerVehicleData } from "../../shared/nui-events/callbacks";
import { VehicleToJSON } from "../serialization/VehicleToJSON";

@NuiCallbackEvents
export class VehicleManager {
    private static instance: VehicleManager | null = null;
    public static getInstance(): VehicleManager {
        if (!VehicleManager.instance) {
            VehicleManager.instance = new VehicleManager();
        }
        return VehicleManager.instance;
    }

    private eventsService = CfxNuiEventsService.getInstance();

    @NuiCallbackListener(Callback.SpawnVehicle)
    private async handleSpawnVehicleEvent(event: Callback.SpawnVehicle): Promise<void> {
        const data = event.data;
        if (data != null) {
            let message = `Spawned vehicle: "${data.model}"`;
            try {
                await this.spawnVehicle(data.model);
            } catch (error) {
                message = `VehicleSpawner: tried to spawn unavailable vehicle "${data.model}"`
                console.warn(message)
            }
            this.eventsService.emitNuiMessage(Message.Notification, { message });
        }
    }

    @NuiCallbackListener(Callback.ChangeVehicleColor)
    private async handleChangeVehicleColorEvent(event: Callback.ChangeVehicleColor): Promise<void> {
        const data = event.data;
        if (data != null && Cfx.Game.PlayerPed.isInAnyVehicle()) {
            const primary = cssHexStringToRgb(event.data.primaryColor);
            const secondary = cssHexStringToRgb(event.data.secondaryColor);
            const playerVehicle = Cfx.Game.PlayerPed.CurrentVehicle;
            // TODO alpha (rgba)
            if (primary != null) {
                playerVehicle.Mods.CustomPrimaryColor = Color.fromRgb(primary.r, primary.g, primary.b);
            }
            if (secondary !=  null) {
                playerVehicle.Mods.CustomSecondaryColor = Color.fromRgb(secondary.r, secondary.g, secondary.b);

            }
        }
    }

    @NuiCallbackListener(Callback.UpdateVehicleMod)
    private async handleUpdateVehicleModEvent(event: Callback.UpdateVehicleMod): Promise<void> {
        const data = event.data;
        if (data != null) {
            SetVehicleMod(data.vehicleHandle, data.modType, data.modValue, false);
        }
    }

    @NuiCallbackListener(GetPlayerVehicleData)
    public async getPlayerVehicleData(event: GetPlayerVehicleData) {
        if (Cfx.Game.PlayerPed.isInAnyVehicle()) {
            const vehicle = Cfx.Game.PlayerPed.CurrentVehicle;
            return VehicleToJSON(vehicle);
        } else {
            return null;
        }
    }

    public async spawnVehicle(model: string, replace = true): Promise<void> {
        const player = Cfx.Game.PlayerPed;
        const playerCoords = player.Position;
        // TODO proper error handling
        const vehicle = await Cfx.World.createVehicle(new Cfx.Model(model), playerCoords, Cfx.Game.PlayerPed.Heading);
        if (vehicle) {
            if (replace && player.isInAnyVehicle()) {
                player.CurrentVehicle.delete();
            }
            Cfx.Game.PlayerPed.setIntoVehicle(vehicle, Cfx.VehicleSeat.Driver);
        }
        vehicle.RadioStation = Cfx.RadioStation.RadioOff;
    }
}
