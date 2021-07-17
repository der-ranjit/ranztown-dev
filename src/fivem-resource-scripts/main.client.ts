import * as Cfx from "fivem-js";

const RESPONSE_OK = { status: "ok" };

let nuiActive = false;

RegisterNuiCallbackType("spawnCar");
on(`__cfx_nui:spawnCar`, async (data: {model: string}, cb: any) => {
    const playerCoords = Cfx.Game.PlayerPed.Position;
    const vehicle = await Cfx.World.createVehicle(new Cfx.Model(data.model), playerCoords, Cfx.Game.PlayerPed.Heading);
    Cfx.Game.PlayerPed.setIntoVehicle(vehicle, Cfx.VehicleSeat.Driver);
    // notify nui about spawned car
    SendNuiMessage(JSON.stringify({ type: "notification", message: `Spawned car: "${data.model}"`}))
    cb(RESPONSE_OK);
});

function toggleNUI(): void {
    nuiActive = !nuiActive;
    SetNuiFocus(nuiActive, nuiActive);
    SetNuiFocusKeepInput(nuiActive);
}

setTick(() => {
    if (IsControlPressed(0, 244)) {
        toggleNUI();
    }
    if (nuiActive) {
        // LookLeftRight
        DisableControlAction(0, 1, nuiActive);
        // LookUpDown
        DisableControlAction(0, 2, nuiActive);
        // MeleeAttackAlternate
        DisableControlAction(0, 142, nuiActive);
        // VehicleMouseControlOverride
        DisableControlAction(0, 106, nuiActive);
    }
})

