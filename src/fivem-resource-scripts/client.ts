let nuiActive = false;

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
