import type { VehicleModCollection, VehicleModType } from "fivem-js";

export interface ModTypeSlot {
    slotType: VehicleModType,
    slotValues: ModTypeValue[]
    slotValueCount: number;
    slotVariation: boolean;
}
export interface ModTypeValue {
    displayName: string | null;
    value: number;
}
export function createModTypeSlots(modCollection: VehicleModCollection): ModTypeSlot[] {
    const modTypeSlots: ModTypeSlot[] = [];

    const modSlots = modCollection.getAllMods();
    // Set the modkit so we can modify the car.
    //   SetVehicleModKit(modSlots[0].Vehicle.Handle, 0);

    for (let slot of modSlots) {
        const slotType = slot.ModType;
        const slotValues: ModTypeValue[] = [{
            displayName: "stock",
            value: -1
        }];
        for (let i = 0; i < slot.ModCount - 1; i++) {
            const modSlotValueName = GetLabelText(GetModTextLabel(slot.Vehicle.Handle, slot.ModType, i));
            slotValues.push({
                displayName: modSlotValueName,
                value: i
            });
        }
        const slotValueCount = slot.ModCount;
        const slotVariation = slot.Variation
        modTypeSlots.push({
            slotType,
            slotValueCount,
            slotValues,
            slotVariation
        })
    }

    return modTypeSlots;
}
