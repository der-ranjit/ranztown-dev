/* Shared Data Types available for nui and fivem project. */

export abstract class Event<D> {
    abstract name: string;
    constructor(public data: D | null = null){}
}

export type SpawnVehicleData = { model: string };
export class SpawnVehicle extends Event<SpawnVehicleData> {
    name = "spawnVehicle"
}

export type GetAvailableVehicleNamesData = { vehicleNames: string[] }
export class GetAvailableVehicleNames extends Event<GetAvailableVehicleNamesData> {
    name = "getAvailableVehicleNames";
}

export type NotificationData = { message: string };
export class Notification extends Event<NotificationData> {
    name = "notification"
}
