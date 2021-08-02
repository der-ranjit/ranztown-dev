import { Vehicle, VehicleModCollection } from "fivem-js";

import { EntityToJSON } from "./EntityToJSON";
import { READ_ONLY, toFivemJSONProperty, WRITE_ONLY } from "../../shared/serialization/FivemJSON";
import { FivemModCollectionJSON, FivemVehicleJSON, ModTypeSlot, ModTypeValue } from "../../shared/serialization/FivemVehicleJSON";

export function VehicleToJSON(vehicle: Vehicle): FivemVehicleJSON {
    const entityJSON = EntityToJSON(vehicle);
    let result: FivemVehicleJSON = { ...entityJSON };
    // result.ClassType = vehicle.ClassType; READ_ONLY
    // result.Doors = vehicle.Doors; READ_ONLY
    // result.Driver = vehicle.Driver; READ_ONLY
    // result.LandingGearState = vehicle.LandingGearState;
    // result.LockStatus = vehicle.LockStatus;
    // result.Occupants = vehicle.Occupants; READ_ONLY
    // result.Passengers = vehicle.Passengers; READ_ONLY
    // result.RadioStation = vehicle.RadioStation; WRITE_ONLY
    // result.RoofState = vehicle.RoofState;
    // result.TowedVehicle = vehicle.TowedVehicle; READ_ONLY
    // result.Wheels = vehicle.Wheels; READ_ONLY
    // result.Windows = vehicle.Windows; READ_ONLY
    result.Acceleration = toFivemJSONProperty(vehicle.Acceleration, READ_ONLY);
    result.AlarmTimeLeft = toFivemJSONProperty(vehicle.AlarmTimeLeft);
    result.AreBrakeLightsOn = toFivemJSONProperty(vehicle.AreBrakeLightsOn, WRITE_ONLY);
    result.AreHighBeamsOn = toFivemJSONProperty(vehicle.AreHighBeamsOn);
    result.AreLightsOn = toFivemJSONProperty(vehicle.AreLightsOn);
    result.BodyHealth = toFivemJSONProperty(vehicle.BodyHealth);
    result.CanBeVisiblyDamaged = toFivemJSONProperty(vehicle.CanBeVisiblyDamaged, WRITE_ONLY);
    result.CanBreak = toFivemJSONProperty(vehicle.CanBreak);
    result.CanDeformWheels = toFivemJSONProperty(vehicle.CanDeformWheels, WRITE_ONLY);
    result.CanEngineDegrade = toFivemJSONProperty(vehicle.CanEngineDegrade, WRITE_ONLY);
    result.CanTiresBurst = toFivemJSONProperty(vehicle.CanTiresBurst);
    result.CanWheelsBreak = toFivemJSONProperty(vehicle.CanWheelsBreak, WRITE_ONLY);
    result.ClassDisplayName = toFivemJSONProperty(GetLabelText(vehicle.ClassDisplayName));
    result.CurrentGear = toFivemJSONProperty(vehicle.CurrentGear, READ_ONLY);
    result.CurrentRPM = toFivemJSONProperty(vehicle.CurrentRPM);
    result.DirtLevel = toFivemJSONProperty(vehicle.DirtLevel);
    result.DisplayName = toFivemJSONProperty(GetLabelText(vehicle.DisplayName), READ_ONLY);
    result.DropsMoneyOnExplosion = toFivemJSONProperty(vehicle.DropsMoneyOnExplosion, WRITE_ONLY);
    result.EngineHealth = toFivemJSONProperty(vehicle.EngineHealth);
    result.EnginePowerMultiplier = toFivemJSONProperty(vehicle.EnginePowerMultiplier, WRITE_ONLY);
    result.EngineTorqueMultiplier = toFivemJSONProperty(vehicle.EngineTorqueMultiplier, WRITE_ONLY);
    result.FuelLevel = toFivemJSONProperty(vehicle.FuelLevel);
    result.Gravity = toFivemJSONProperty(vehicle.Gravity);
    result.HasBombBay = toFivemJSONProperty(vehicle.HasBombBay, READ_ONLY);
    result.HasRoof = toFivemJSONProperty(vehicle.HasRoof, READ_ONLY);
    result.HighGear = toFivemJSONProperty(vehicle.HighGear);
    result.IsAlarmSet = toFivemJSONProperty(vehicle.IsAlarmSet);
    result.IsAlarmSounding = toFivemJSONProperty(vehicle.IsAlarmSounding, READ_ONLY);
    result.IsAxlesStrong = toFivemJSONProperty(vehicle.IsAxlesStrong, WRITE_ONLY);
    result.IsBurnoutForced = toFivemJSONProperty(vehicle.IsBurnoutForced, WRITE_ONLY);
    result.IsConvertible = toFivemJSONProperty(vehicle.IsConvertible, READ_ONLY);
    result.IsDamaged = toFivemJSONProperty(vehicle.IsDamaged, READ_ONLY);
    result.IsDriveable = toFivemJSONProperty(vehicle.IsDriveable);
    result.IsEngineOnFire = toFivemJSONProperty(vehicle.IsEngineOnFire, READ_ONLY);
    result.IsEngineRunning = toFivemJSONProperty(vehicle.IsEngineRunning);
    result.IsEngineStarting = toFivemJSONProperty(vehicle.IsEngineStarting);
    result.IsFrontBumperBrokenOff = toFivemJSONProperty(vehicle.IsFrontBumperBrokenOff, READ_ONLY);
    result.IsHandbrakeForcedOn = toFivemJSONProperty(vehicle.IsHandbrakeForcedOn);
    result.IsInBurnout = toFivemJSONProperty(vehicle.IsInBurnout, READ_ONLY);
    result.IsInteriorLightOn = toFivemJSONProperty(vehicle.IsInteriorLightOn);
    result.IsLeftHeadLightBroken = toFivemJSONProperty(vehicle.IsLeftHeadLightBroken, READ_ONLY);
    result.IsLeftIndicatorLightOn = toFivemJSONProperty(vehicle.IsLeftIndicatorLightOn);
    result.IsOnAllWheels = toFivemJSONProperty(vehicle.IsOnAllWheels, READ_ONLY);
    result.IsRadioEnabled = toFivemJSONProperty(vehicle.IsRadioEnabled);
    result.IsRearBumperBrokenOff = toFivemJSONProperty(vehicle.IsRearBumperBrokenOff, READ_ONLY);
    result.IsRightHeadLightBroken = toFivemJSONProperty(vehicle.IsRightHeadLightBroken, READ_ONLY);
    result.IsRightIndicatorLightOn = toFivemJSONProperty(vehicle.IsRightIndicatorLightOn);
    result.IsSearchLightOn = toFivemJSONProperty(vehicle.IsSearchLightOn);
    result.IsSirenActive = toFivemJSONProperty(vehicle.IsSirenActive);
    result.IsSirenSilent = toFivemJSONProperty(vehicle.IsSirenSilent, WRITE_ONLY);
    result.IsStolen = toFivemJSONProperty(vehicle.IsStolen);
    result.IsStopped = toFivemJSONProperty(vehicle.IsStopped, READ_ONLY);
    result.IsStoppedAtTrafficLights = toFivemJSONProperty(vehicle.IsStoppedAtTrafficLights, READ_ONLY);
    result.IsTaxiLightOn = toFivemJSONProperty(vehicle.IsTaxiLightOn);
    result.IsWanted = toFivemJSONProperty(vehicle.IsWanted);
    result.LightsMultiplier = toFivemJSONProperty(vehicle.LightsMultiplier, WRITE_ONLY);
    result.MaxBraking = toFivemJSONProperty(vehicle.MaxBraking, READ_ONLY);
    result.MaxTraction = toFivemJSONProperty(vehicle.MaxTraction, READ_ONLY);
    result.Mods = toFivemJSONProperty(VehicleModCollectionToJSON(vehicle.Mods), READ_ONLY);
    result.NeedsToBeHotwired = toFivemJSONProperty(vehicle.NeedsToBeHotwired);
    result.NumberPlate = toFivemJSONProperty(vehicle.NumberPlate);
    result.OilLevel = toFivemJSONProperty(vehicle.OilLevel);
    result.PassengerCapacity = toFivemJSONProperty(vehicle.PassengerCapacity, READ_ONLY);
    result.PassengerCount = toFivemJSONProperty(vehicle.PassengerCount, READ_ONLY);
    result.PetrolTankHealth = toFivemJSONProperty(vehicle.PetrolTankHealth);
    result.PreviouslyOwnedByPlayer = toFivemJSONProperty(vehicle.PreviouslyOwnedByPlayer);
    result.ProvidesCover = toFivemJSONProperty(vehicle.ProvidesCover, WRITE_ONLY);
    result.RespotTimer = toFivemJSONProperty(vehicle.RespotTimer, WRITE_ONLY);
    result.Speed = toFivemJSONProperty(vehicle.Speed);
    result.SteeringAngle = toFivemJSONProperty(vehicle.SteeringAngle);
    result.SteeringScale = toFivemJSONProperty(vehicle.SteeringScale);
    result.Strong = toFivemJSONProperty(vehicle.Strong, WRITE_ONLY);
    result.TowingCraneRaisedAmount = toFivemJSONProperty(vehicle.TowingCraneRaisedAmount, WRITE_ONLY);
    result.WheelSpeed = toFivemJSONProperty(vehicle.WheelSpeed, READ_ONLY);

    return result;
}

function VehicleModCollectionToJSON(modCollection: VehicleModCollection): FivemModCollectionJSON {
    const result: FivemModCollectionJSON = {};

    result.ModTypeSlots = toFivemJSONProperty(ModCollectionToModTypeSlots(modCollection));
    result.ColorCombination = toFivemJSONProperty(modCollection.ColorCombination);
    result.ColorCombinationCount = toFivemJSONProperty(modCollection.ColorCombinationCount, READ_ONLY);
    result.CustomPrimaryColor = toFivemJSONProperty(modCollection.CustomPrimaryColor);
    result.CustomSecondaryColor = toFivemJSONProperty(modCollection.CustomSecondaryColor);
    result.DashboardColor = toFivemJSONProperty(modCollection.DashboardColor, WRITE_ONLY);
    result.HasAllNeonLights = toFivemJSONProperty(modCollection.HasAllNeonLights, READ_ONLY);
    result.IsPrimaryColorCustom = toFivemJSONProperty(modCollection.IsPrimaryColorCustom, READ_ONLY);
    result.IsSecondaryColorCustom = toFivemJSONProperty(modCollection.IsSecondaryColorCustom, READ_ONLY);
    result.LicensePlate = toFivemJSONProperty(modCollection.LicensePlate);
    result.LicensePlateStyle = toFivemJSONProperty(modCollection.LicensePlateStyle);
    result.LicensePlateType = toFivemJSONProperty(modCollection.LicensePlateType, READ_ONLY);
    result.Livery = toFivemJSONProperty(modCollection.Livery);
    result.LiveryCount = toFivemJSONProperty(modCollection.LiveryCount, READ_ONLY);
    result.NeonLightsColor = toFivemJSONProperty(modCollection.NeonLightsColor);
    result.PearlescentColor = toFivemJSONProperty(modCollection.PearlescentColor);
    result.PrimaryColor = toFivemJSONProperty(modCollection.PrimaryColor);
    result.RimColor = toFivemJSONProperty(modCollection.RimColor);
    result.SecondaryColor = toFivemJSONProperty(modCollection.SecondaryColor);
    result.TireSmokeColor = toFivemJSONProperty(modCollection.TireSmokeColor);
    result.TrimColor = toFivemJSONProperty(modCollection.TrimColor, WRITE_ONLY);
    result.WheelType = toFivemJSONProperty(modCollection.WheelType);
    result.WindowTint = toFivemJSONProperty(modCollection.WindowTint);

    return result;
}

function ModCollectionToModTypeSlots(modCollection: VehicleModCollection): ModTypeSlot[] {
    const modTypeSlots: ModTypeSlot[] = [];

    // fivem-does not provide a getter (；′⌒`)
    const vehicle = (<any>modCollection)._owner?.Handle;
    // not setting the mod-kit will prevent getting all available mods
    if (vehicle) {
        SetVehicleModKit(vehicle, 0);
    }
    const modSlots = modCollection.getAllMods();
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

