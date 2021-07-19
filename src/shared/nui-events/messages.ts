/* Shared Data Types available for nui and fivem project. */

export abstract class Base<D, R = any> {
    abstract name: string;
    constructor(
        public data: D | null = null,
        public response: R | null = null
    ){}
}

export type SpawnVehicleData = { model: string };
export class SpawnVehicle extends Base<SpawnVehicleData> {
    name = "spawnVehicle"
}

export type NotificationData = { message: string };
export class Notification extends Base<NotificationData> {
    name = "notification"
}

export type setNuiVisibilityData = { nuiVisible: boolean };
export class setNuiVisibility extends Base<setNuiVisibilityData> {
    name = "setNuiVisibility"
}
