import { Vehicle, VehicleModCollection } from "fivem-js";
import { EntityToJson } from "./EntityJson";
import { FivemJSON, isJsonProperty, toJsonProperty } from "../../shared/serialization/FivemJson";
// import { createModTypeSlots, ModTypeSlot } from "./ModTypeSlots";


// mix in other custom json types
type VehicleOverwrittenTypes = "Mods";
type VehicleWithCustomTypes = {
    Mods: VehicleModCollectionJSON
}
type CustomVehicleJSON = Omit<Vehicle, VehicleOverwrittenTypes> & VehicleWithCustomTypes;

export function isVehicleJSON(object: any): object is VehicleJSON {
    return isVehicleModCollectionJSON(object?.Mods?.value);
}
export type VehicleJSON = FivemJSON<CustomVehicleJSON>
export function VehicleToJson(vehicle: Vehicle): VehicleJSON {
    const entityJSON = EntityToJson(vehicle);
    let result: VehicleJSON = { ...entityJSON };
    // result.ClassType = vehicle.ClassType;
    // result.Doors = vehicle.Doors;
    // result.Driver = vehicle.Driver;
    // result.LandingGearState = vehicle.LandingGearState;
    // result.LockStatus = vehicle.LockStatus;
    // result.Occupants = vehicle.Occupants;
    // result.Passengers = vehicle.Passengers;
    // result.RadioStation = vehicle.RadioStation;
    // result.RoofState = vehicle.RoofState;
    // result.TowedVehicle = vehicle.TowedVehicle;
    // result.Wheels = vehicle.Wheels;
    // result.Windows = vehicle.Windows;
    result.Acceleration = toJsonProperty(vehicle.Acceleration);
    result.AlarmTimeLeft = toJsonProperty(vehicle.AlarmTimeLeft);
    result.AreBrakeLightsOn = toJsonProperty(vehicle.AreBrakeLightsOn);
    result.AreHighBeamsOn = toJsonProperty(vehicle.AreHighBeamsOn);
    result.AreLightsOn = toJsonProperty(vehicle.AreLightsOn);
    result.BodyHealth = toJsonProperty(vehicle.BodyHealth);
    result.CanBeVisiblyDamaged = toJsonProperty(vehicle.CanBeVisiblyDamaged);
    result.CanBreak = toJsonProperty(vehicle.CanBreak);
    result.CanDeformWheels = toJsonProperty(vehicle.CanDeformWheels);
    result.CanEngineDegrade = toJsonProperty(vehicle.CanEngineDegrade);
    result.CanTiresBurst = toJsonProperty(vehicle.CanTiresBurst);
    result.CanWheelsBreak = toJsonProperty(vehicle.CanWheelsBreak);
    result.ClassDisplayName = toJsonProperty(vehicle.ClassDisplayName);
    result.CurrentGear = toJsonProperty(vehicle.CurrentGear);
    result.CurrentRPM = toJsonProperty(vehicle.CurrentRPM);
    result.DirtLevel = toJsonProperty(vehicle.DirtLevel);
    result.DisplayName = toJsonProperty(vehicle.DisplayName);
    result.DropsMoneyOnExplosion = toJsonProperty(vehicle.DropsMoneyOnExplosion);
    result.EngineHealth = toJsonProperty(vehicle.EngineHealth);
    result.EnginePowerMultiplier = toJsonProperty(vehicle.EnginePowerMultiplier);
    result.EngineTorqueMultiplier = toJsonProperty(vehicle.EngineTorqueMultiplier);
    result.FuelLevel = toJsonProperty(vehicle.FuelLevel);
    result.Gravity = toJsonProperty(vehicle.Gravity);
    result.HasBombBay = toJsonProperty(vehicle.HasBombBay);
    result.HasRoof = toJsonProperty(vehicle.HasRoof);
    result.HighGear = toJsonProperty(vehicle.HighGear);
    result.IsAlarmSet = toJsonProperty(vehicle.IsAlarmSet);
    result.IsAlarmSounding = toJsonProperty(vehicle.IsAlarmSounding);
    result.IsAxlesStrong = toJsonProperty(vehicle.IsAxlesStrong);
    result.IsBurnoutForced = toJsonProperty(vehicle.IsBurnoutForced);
    result.IsConvertible = toJsonProperty(vehicle.IsConvertible);
    result.IsDamaged = toJsonProperty(vehicle.IsDamaged);
    result.IsDriveable = toJsonProperty(vehicle.IsDriveable);
    result.IsEngineOnFire = toJsonProperty(vehicle.IsEngineOnFire);
    result.IsEngineRunning = toJsonProperty(vehicle.IsEngineRunning);
    result.IsEngineStarting = toJsonProperty(vehicle.IsEngineStarting);
    result.IsFrontBumperBrokenOff = toJsonProperty(vehicle.IsFrontBumperBrokenOff);
    result.IsHandbrakeForcedOn = toJsonProperty(vehicle.IsHandbrakeForcedOn);
    result.IsInBurnout = toJsonProperty(vehicle.IsInBurnout);
    result.IsInteriorLightOn = toJsonProperty(vehicle.IsInteriorLightOn);
    result.IsLeftHeadLightBroken = toJsonProperty(vehicle.IsLeftHeadLightBroken);
    result.IsLeftIndicatorLightOn = toJsonProperty(vehicle.IsLeftIndicatorLightOn);
    result.IsOnAllWheels = toJsonProperty(vehicle.IsOnAllWheels);
    result.IsRadioEnabled = toJsonProperty(vehicle.IsRadioEnabled);
    result.IsRearBumperBrokenOff = toJsonProperty(vehicle.IsRearBumperBrokenOff);
    result.IsRightHeadLightBroken = toJsonProperty(vehicle.IsRightHeadLightBroken);
    result.IsRightIndicatorLightOn = toJsonProperty(vehicle.IsRightIndicatorLightOn);
    result.IsSearchLightOn = toJsonProperty(vehicle.IsSearchLightOn);
    result.IsSirenActive = toJsonProperty(vehicle.IsSirenActive);
    result.IsSirenSilent = toJsonProperty(vehicle.IsSirenSilent);
    result.IsStolen = toJsonProperty(vehicle.IsStolen);
    result.IsStopped = toJsonProperty(vehicle.IsStopped);
    result.IsStoppedAtTrafficLights = toJsonProperty(vehicle.IsStoppedAtTrafficLights);
    result.IsTaxiLightOn = toJsonProperty(vehicle.IsTaxiLightOn);
    result.IsWanted = toJsonProperty(vehicle.IsWanted);
    result.LightsMultiplier = toJsonProperty(vehicle.LightsMultiplier);
    result.MaxBraking = toJsonProperty(vehicle.MaxBraking);
    result.MaxTraction = toJsonProperty(vehicle.MaxTraction);
    result.Mods = toJsonProperty(VehicleModCollectionToJSON(vehicle.Mods), true);
    result.NeedsToBeHotwired = toJsonProperty(vehicle.NeedsToBeHotwired);
    result.NumberPlate = toJsonProperty(vehicle.NumberPlate);
    result.OilLevel = toJsonProperty(vehicle.OilLevel);
    result.PassengerCapacity = toJsonProperty(vehicle.PassengerCapacity);
    result.PassengerCount = toJsonProperty(vehicle.PassengerCount);
    result.PetrolTankHealth = toJsonProperty(vehicle.PetrolTankHealth);
    result.PreviouslyOwnedByPlayer = toJsonProperty(vehicle.PreviouslyOwnedByPlayer);
    result.ProvidesCover = toJsonProperty(vehicle.ProvidesCover);
    result.RespotTimer = toJsonProperty(vehicle.RespotTimer);
    result.Speed = toJsonProperty(vehicle.Speed);
    result.SteeringAngle = toJsonProperty(vehicle.SteeringAngle);
    result.SteeringScale = toJsonProperty(vehicle.SteeringScale);
    result.Strong = toJsonProperty(vehicle.Strong);
    result.TowingCraneRaisedAmount = toJsonProperty(vehicle.TowingCraneRaisedAmount);
    result.WheelSpeed = toJsonProperty(vehicle.WheelSpeed);

    return result;
}


export function isVehicleModCollectionJSON(object: any): object is VehicleModCollectionJSON {
    return isJsonProperty(object?.RimColor);
}
type CustomVehicleModCollection = VehicleModCollection /* & {
    ModTypeSlots: ModTypeSlot[]
} */;
type VehicleModCollectionJSON = FivemJSON<CustomVehicleModCollection>
function VehicleModCollectionToJSON(modCollection: VehicleModCollection): VehicleModCollectionJSON {
    const result: VehicleModCollectionJSON = {};

    // result.ModTypeSlots = toJsonProperty(createModTypeSlots(modCollection));
    result.ColorCombination = toJsonProperty(modCollection.ColorCombination);
    result.ColorCombinationCount = toJsonProperty(modCollection.ColorCombinationCount, true);
    result.CustomPrimaryColor = toJsonProperty(modCollection.CustomPrimaryColor);
    result.CustomSecondaryColor = toJsonProperty(modCollection.CustomSecondaryColor);
    result.DashboardColor = toJsonProperty(modCollection.DashboardColor);
    result.HasAllNeonLights = toJsonProperty(modCollection.HasAllNeonLights, true);
    result.IsPrimaryColorCustom = toJsonProperty(modCollection.IsPrimaryColorCustom, true);
    result.IsSecondaryColorCustom = toJsonProperty(modCollection.IsSecondaryColorCustom, true);
    result.LicensePlate = toJsonProperty(modCollection.LicensePlate);
    result.LicensePlateStyle = toJsonProperty(modCollection.LicensePlateStyle);
    result.LicensePlateType = toJsonProperty(modCollection.LicensePlateType, true);
    result.Livery = toJsonProperty(modCollection.Livery);
    result.LiveryCount = toJsonProperty(modCollection.LiveryCount, true);
    result.NeonLightsColor = toJsonProperty(modCollection.NeonLightsColor);
    result.PearlescentColor = toJsonProperty(modCollection.PearlescentColor);
    result.PrimaryColor = toJsonProperty(modCollection.PrimaryColor);
    result.RimColor = toJsonProperty(modCollection.RimColor);
    result.SecondaryColor = toJsonProperty(modCollection.SecondaryColor);
    result.TireSmokeColor = toJsonProperty(modCollection.TireSmokeColor);
    result.TrimColor = toJsonProperty(modCollection.TrimColor);
    result.WheelType = toJsonProperty(modCollection.WheelType);
    result.WindowTint = toJsonProperty(modCollection.WindowTint);

    return result;
}
