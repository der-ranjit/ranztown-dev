/* Shared Data Types available for nui and fivem project. */

export abstract class Event<D = any> {
    abstract name: string;
    constructor(public data?: D){}
}

type SpawnCarData = { model: string };
export class SpawnCar extends Event<SpawnCarData> {
    name = "spawnCar"
}

type NotificationData = { message: string };
export class Notification extends Event<NotificationData> {
    name = "notification"
}
