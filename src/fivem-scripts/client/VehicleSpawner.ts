import * as Cfx from "fivem-js";

import { CfxNuiEventsService, NuiCallbackListener, NuiCallbackEvents } from "./NuiEventsService";
import { Callback, Message } from "../../shared/nui-events";
import { Color } from "fivem-js";

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
        if (data != null) {
            const primary = this.cssHexStringToRgb(event.data.primaryColor);
            const secondary = this.cssHexStringToRgb(event.data.secondaryColor);
            // TODO error handling
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

    private cssHexStringToRgb(cssHexString: string) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cssHexString);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      }

}
