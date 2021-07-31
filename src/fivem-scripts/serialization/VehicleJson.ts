import { Entity, Vehicle } from "fivem-js";
import { FivemJSON, OmitClass, toJsonProperty } from "./FivemJson";

// create type without super class Entity
type ExclusiveVehicleProperties = OmitClass<Vehicle, Entity>;
// mix in other custom json types
type VehicleOverwrites = ""
type CustomVehicleJSON = Omit<ExclusiveVehicleProperties, VehicleOverwrites>;

export type VehicleJSON = FivemJSON<CustomVehicleJSON>

export function VehicleToJson(vehicle: Vehicle): VehicleJSON {
    let result: VehicleJSON = {};
    // result.ClassType = vehicle.ClassType;
    // result.Doors = vehicle.Doors;
    // result.Driver = vehicle.Driver;
    // result.LandingGearState = vehicle.LandingGearState;
    // result.LockStatus = vehicle.LockStatus;
    // result.Mods = vehicle.Mods;
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

// export function ModsToJSON(mods: VehicleModCollection): Partial<VehicleModCollection> {
//     const result:any = {};

//     result.ColorCombination = mods.ColorCombination;
//     result.ColorCombinationCount = mods.ColorCombinationCount;
//     result.CustomPrimaryColor = mods.CustomPrimaryColor;
//     result.CustomSecondaryColor = mods.CustomSecondaryColor;
//     result.DashboardColor = mods.DashboardColor;
//     result.HasAllNeonLights = mods.HasAllNeonLights;
//     result.IsPrimaryColorCustom = mods.IsPrimaryColorCustom;
//     result.IsSecondaryColorCustom = mods.IsSecondaryColorCustom;
//     result.LicensePlate = mods.LicensePlate;
//     result.LicensePlateStyle = mods.LicensePlateStyle;
//     result.LicensePlateType = mods.LicensePlateType;
//     result.Livery = mods.Livery;
//     result.LiveryCount = mods.LiveryCount;
//     result.NeonLightsColor = mods.NeonLightsColor;
//     result.PearlescentColor = mods.PearlescentColor;
//     result.PrimaryColor = mods.PrimaryColor;
//     result.RimColor = mods.RimColor;
//     result.SecondaryColor = mods.SecondaryColor;
//     result.TireSmokeColor = mods.TireSmokeColor;
//     result.TrimColor = mods.TrimColor;
//     result.WheelType = mods.WheelType;
//     result.WheelType = mods.WheelType;
//     result.WindowTint = mods.WindowTint;

//     return result;
// }
