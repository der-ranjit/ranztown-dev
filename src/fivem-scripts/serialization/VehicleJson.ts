import { Vehicle, VehicleModCollection } from "fivem-js";
import { EntityToJson } from "./EntityJson";
import { FivemJSON, isJsonProperty, toJsonProperty } from "../../shared/serialization/FivemJson";


// mix in other custom json types
type VehicleOverwrittenTypes = "Mods";
type VehicleWithCustomTypes = {
    Mods: ModsJSON
}
type CustomVehicleJSON = Omit<Vehicle, VehicleOverwrittenTypes> & VehicleWithCustomTypes;

export type VehicleJSON = FivemJSON<CustomVehicleJSON>

export function VehicleToJson(vehicle: Vehicle): VehicleJSON {
    const entityJSON = EntityToJson(vehicle);
    let result: VehicleJSON = {...entityJSON};
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
    result.Mods = toJsonProperty(ModsToJSON(vehicle.Mods), true);
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

export function isVehicleJSON(object: any): object is VehicleJSON {
    return object?.Mods?.value !== undefined && isModJSON(object.Mods.value);
}


export type ModsJSON = FivemJSON<VehicleModCollection>
export function ModsToJSON(mods: VehicleModCollection): ModsJSON {
    const result: ModsJSON = {};

    result.ColorCombination = toJsonProperty(mods.ColorCombination);
    result.ColorCombinationCount = toJsonProperty(mods.ColorCombinationCount);
    result.CustomPrimaryColor = toJsonProperty(mods.CustomPrimaryColor);
    result.CustomSecondaryColor = toJsonProperty(mods.CustomSecondaryColor);
    result.DashboardColor = toJsonProperty(mods.DashboardColor);
    result.HasAllNeonLights = toJsonProperty(mods.HasAllNeonLights);
    result.IsPrimaryColorCustom = toJsonProperty(mods.IsPrimaryColorCustom);
    result.IsSecondaryColorCustom = toJsonProperty(mods.IsSecondaryColorCustom);
    result.LicensePlate = toJsonProperty(mods.LicensePlate);
    result.LicensePlateStyle = toJsonProperty(mods.LicensePlateStyle);
    result.LicensePlateType = toJsonProperty(mods.LicensePlateType);
    result.Livery = toJsonProperty(mods.Livery);
    result.LiveryCount = toJsonProperty(mods.LiveryCount);
    result.NeonLightsColor = toJsonProperty(mods.NeonLightsColor);
    result.PearlescentColor = toJsonProperty(mods.PearlescentColor);
    result.PrimaryColor = toJsonProperty(mods.PrimaryColor);
    result.RimColor = toJsonProperty(mods.RimColor);
    result.SecondaryColor = toJsonProperty(mods.SecondaryColor);
    result.TireSmokeColor = toJsonProperty(mods.TireSmokeColor);
    result.TrimColor = toJsonProperty(mods.TrimColor);
    result.WheelType = toJsonProperty(mods.WheelType);
    result.WindowTint = toJsonProperty(mods.WindowTint);

    return result;
}

export function isModJSON(object: any): object is ModsJSON {
    return object?.RimColor !== undefined && isJsonProperty(object.RimColor);
}
