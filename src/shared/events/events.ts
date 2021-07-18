/* Shared Data Types available for nui and fivem project. */

export abstract class Event<D, R = any> {
    abstract name: string;
    constructor(
        public data: D | null = null,
        public response: R | null = null){}
}

export type SpawnVehicleData = { model: string };
export class SpawnVehicle extends Event<SpawnVehicleData> {
    name = "spawnVehicle"
}

export type NotificationData = { message: string };
export class Notification extends Event<NotificationData> {
    name = "notification"
}
