import * as Cfx from "fivem-js";
import { Vector3, WeaponHash } from "fivem-js";

import { NuiCB } from "../../angular-fivem-shared/nui-events/callbacks";
import { NuiCallbackEvents, NuiCallbackListener } from "./NuiEventsService";

@NuiCallbackEvents
export class FlyHigh {
    private static instance: FlyHigh | null = null;
    public static getInstance(): FlyHigh {
        if (!FlyHigh.instance) {
            FlyHigh.instance = new FlyHigh();
        }
        return FlyHigh.instance;
    }

    @NuiCallbackListener(NuiCB.FlyHigh.FlyHigh)
    public async flyHigh(event: NuiCB.FlyHigh.FlyHigh): Promise<void> {
        const playerPosition = Cfx.Game.PlayerPed.Position;
        Cfx.Game.PlayerPed.Position = new Vector3(playerPosition.x, playerPosition.y, playerPosition.z + 100);
        Cfx.Game.PlayerPed.giveWeapon(WeaponHash.Parachute, 1, false, true);
        //GiveWeaponToPed(GetPlayerPed(-1), GetHashKey("gadget_parachute"), 1, false, true)
        //SetPedComponentVariation(GetPlayerPed(-1), 5, 0, 0, 0);
    }
}
