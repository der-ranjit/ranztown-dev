import * as Cfx from "fivem-js";

let nuiActive = false;

RegisterCommand(
    'adder',
    async (source:any, args:any) => {
        const playerCoords = Cfx.Game.PlayerPed.Position;
        const vehicle = await Cfx.World.createVehicle(new Cfx.Model('adder'), playerCoords, 4);
        Cfx.Game.PlayerPed.setIntoVehicle(vehicle, Cfx.VehicleSeat.Driver);
    },
    false,
);

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
