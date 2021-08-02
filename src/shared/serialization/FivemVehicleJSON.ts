import type { LicensePlateStyle, LicensePlateType, VehicleColor, VehicleModType, VehicleWheelType, VehicleWindowTint } from "fivem-js/lib/enums/Vehicle";
import type { Color } from "fivem-js/lib/utils/Color";

import { FivemEntityJSON } from "./FivemEntityJSON";
import { FivemJSONProperty } from "./FivemJSON";
import { isFivemJSONProperty } from "./FivemJSON";

export function isFivemVehicleJSON(object: any): object is FivemVehicleJSON {
    return isFivemModCollectionJSON(object?.Mods?.value);
}
export interface FivemVehicleJSON extends FivemEntityJSON {
    // ClassType: FivemJSONProperty<VehicleClass>;
    // Doors: FivemJSONProperty<VehicleDoorCollection>;
    // Driver(): FivemJSONProperty<Ped>;
    // LandingGearState: FivemJSONProperty<VehicleLandingGearState>;
    // LockStatus: FivemJSONProperty<VehicleLockStatus>;
    // Occupants: FivemJSONProperty<Ped[]>;
    // Passengers: FivemJSONProperty<Ped[]>;
    // RadioStation: FivemJSONProperty<RadioStation | null>;
    // RoofState: FivemJSONProperty<VehicleRoofState>;
    // TowedVehicle: FivemJSONProperty<Vehicle>;
    // Wheels: FivemJSONProperty<VehicleWheelCollection>;
    // Windows: FivemJSONProperty<VehicleWindowCollection>;

    Acceleration?: FivemJSONProperty<number>;
    AlarmTimeLeft?: FivemJSONProperty<number>;
    AreBrakeLightsOn?: FivemJSONProperty<boolean | null>;
    AreHighBeamsOn?: FivemJSONProperty<boolean>;
    AreLightsOn?: FivemJSONProperty<boolean>;
    BodyHealth?: FivemJSONProperty<number>;
    CanBeVisiblyDamaged?: FivemJSONProperty<boolean | null>;
    CanBreak?: FivemJSONProperty< boolean | null>;
    CanDeformWheels?: FivemJSONProperty<boolean | null>;
    CanEngineDegrade?: FivemJSONProperty<boolean | null>;
    CanTiresBurst?: FivemJSONProperty<boolean>;
    CanWheelsBreak?: FivemJSONProperty<boolean | null>;
    ClassDisplayName?: FivemJSONProperty<string>;
    CurrentGear?: FivemJSONProperty<number>;
    CurrentRPM?: FivemJSONProperty<number>;
    DirtLevel?: FivemJSONProperty<number>;
    DisplayName?: FivemJSONProperty<string>;
    DropsMoneyOnExplosion?: FivemJSONProperty<boolean | null>;
    EngineHealth?: FivemJSONProperty<number>;
    EnginePowerMultiplier?: FivemJSONProperty<number | null>;
    EngineTorqueMultiplier?: FivemJSONProperty<number | null>;
    FuelLevel?: FivemJSONProperty<number>;
    Gravity?: FivemJSONProperty<number>;
    HasBombBay?: FivemJSONProperty<boolean>;
    HasRoof?: FivemJSONProperty<boolean>;
    HighGear?: FivemJSONProperty<number>;
    IsAlarmSet?: FivemJSONProperty<boolean>;
    IsAlarmSounding?: FivemJSONProperty<boolean>;
    IsAxlesStrong?: FivemJSONProperty<boolean | null>;
    IsBurnoutForced?: FivemJSONProperty<boolean | null>;
    IsConvertible?: FivemJSONProperty<boolean>;
    IsDamaged?: FivemJSONProperty<boolean>;
    IsDriveable?: FivemJSONProperty<boolean>;
    IsEngineOnFire?: FivemJSONProperty<boolean>;
    IsEngineRunning?: FivemJSONProperty<boolean>;
    IsEngineStarting?: FivemJSONProperty<boolean>;
    IsFrontBumperBrokenOff?: FivemJSONProperty<boolean>;
    IsHandbrakeForcedOn?: FivemJSONProperty<boolean>;
    IsInBurnout?: FivemJSONProperty<boolean>;
    IsInteriorLightOn?: FivemJSONProperty<boolean>;
    IsLeftHeadLightBroken?: FivemJSONProperty<boolean>;
    IsLeftIndicatorLightOn?: FivemJSONProperty<boolean>;
    IsOnAllWheels?: FivemJSONProperty<boolean>;
    IsRadioEnabled?: FivemJSONProperty<boolean>;
    IsRearBumperBrokenOff?: FivemJSONProperty<boolean>;
    IsRightHeadLightBroken?: FivemJSONProperty<boolean>;
    IsRightIndicatorLightOn?: FivemJSONProperty<boolean>;
    IsSearchLightOn?: FivemJSONProperty<boolean>;
    IsSirenActive?: FivemJSONProperty<boolean>;
    IsSirenSilent?: FivemJSONProperty<boolean | null>;
    IsStolen?: FivemJSONProperty<boolean>;
    IsStopped?: FivemJSONProperty<boolean>;
    IsStoppedAtTrafficLights?: FivemJSONProperty<boolean>;
    IsTaxiLightOn?: FivemJSONProperty<boolean>;
    IsWanted?: FivemJSONProperty<boolean>;
    LightsMultiplier?: FivemJSONProperty<number | null>;
    MaxBraking?: FivemJSONProperty<number>;
    MaxTraction?: FivemJSONProperty<number>;
    Mods?: FivemJSONProperty<FivemModCollectionJSON>;
    NeedsToBeHotwired?: FivemJSONProperty<boolean>;
    NumberPlate?: FivemJSONProperty<string>;
    OilLevel?: FivemJSONProperty<number>;
    PassengerCapacity?: FivemJSONProperty<number>;
    PassengerCount?: FivemJSONProperty<number>;
    PetrolTankHealth?: FivemJSONProperty<number>;
    PreviouslyOwnedByPlayer?: FivemJSONProperty<boolean>;
    ProvidesCover?: FivemJSONProperty<boolean | null>;
    RespotTimer?: FivemJSONProperty<number | null>;
    Speed?: FivemJSONProperty<number>;
    SteeringAngle?: FivemJSONProperty<number>;
    SteeringScale?: FivemJSONProperty<number>;
    Strong?: FivemJSONProperty< boolean | null>;
    TowingCraneRaisedAmount?: FivemJSONProperty<number | null>;
    WheelSpeed?: FivemJSONProperty<number>;
}

export function isFivemModCollectionJSON(object: any): object is FivemModCollectionJSON {
    return isFivemJSONProperty(object?.RimColor);
}
export class FivemModCollectionJSON {
    ColorCombination?: FivemJSONProperty<number>;
    ColorCombinationCount?: FivemJSONProperty<number>;
    CustomPrimaryColor?: FivemJSONProperty<Color>;
    CustomSecondaryColor?: FivemJSONProperty<Color>;
    DashboardColor?: FivemJSONProperty<VehicleColor | null>;
    HasAllNeonLights?: FivemJSONProperty<boolean>;
    IsPrimaryColorCustom?: FivemJSONProperty<boolean>;
    IsSecondaryColorCustom?: FivemJSONProperty<boolean>;
    LicensePlate?: FivemJSONProperty<string>;
    LicensePlateStyle?: FivemJSONProperty<LicensePlateStyle>;
    LicensePlateType?: FivemJSONProperty<LicensePlateType>;
    Livery?: FivemJSONProperty<number>;
    LiveryCount?: FivemJSONProperty<number>;
    ModTypeSlots?: FivemJSONProperty<ModTypeSlot[]>;
    NeonLightsColor?: FivemJSONProperty<Color>;
    PearlescentColor?: FivemJSONProperty<VehicleColor>;
    PrimaryColor?: FivemJSONProperty<VehicleColor>;
    RimColor?: FivemJSONProperty<VehicleColor>;
    SecondaryColor?: FivemJSONProperty<VehicleColor>;
    TireSmokeColor?: FivemJSONProperty<Color>;
    TrimColor?: FivemJSONProperty<VehicleColor | null>;
    WheelType?: FivemJSONProperty<VehicleWheelType>;
    WindowTint?: FivemJSONProperty<VehicleWindowTint>;
}

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
