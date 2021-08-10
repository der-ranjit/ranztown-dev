import { Observable, Observer } from "rxjs";
import { AbstractEvent, EventConstructor } from "../client-server-shared/events";

export class ServerEventsService {
    private static instance: ServerEventsService | null = null;
    public static getInstance(): ServerEventsService {
        if (!ServerEventsService.instance) {
            ServerEventsService.instance = new ServerEventsService();
        }
        return ServerEventsService.instance;
    }

    private cachedClientEventObservables = new Map<string, Observable<any>>();

    /**
     * Emits an event to a client or an array of clients.
     * @param eventType
     * @param data
     * @returns
     */
    public emitNet<D, T extends AbstractEvent<D>>(
        eventType: EventConstructor<T,D>,
        clientIds: number | number[],
        data: D | null = null
    ): void {
        if (typeof clientIds === "number") {
            emitNet(eventType.name, clientIds, data);
        } else if (Array.isArray(clientIds)) {
            for (let id of clientIds) {
                emitNet(eventType.name, id, data);
            }
        }
    }

    public getObservableForClientEvent<T,D>(clientEvent: EventConstructor<T,D>): Observable<T> {
        const eventName = clientEvent.name;
        if (!this.cachedClientEventObservables.has(eventName)) {
            const observable = this.createObservableFromServerEvent(clientEvent);
            this.cachedClientEventObservables.set(eventName, observable)
        }
        return this.cachedClientEventObservables.get(eventName)!;
    }

    private createObservableFromServerEvent<T,D>(serverEvent: EventConstructor<T,D>): Observable<T> {
        const eventName = serverEvent.name;
        return new Observable((observer: Observer<any>) => {
            onNet(`${eventName}`, (data: D) => {
                observer.next({
                    name: eventName,
                    data
                })
            });
        });
    }
}

/* Unique symbol to prevent naming collisions. Used to store functions marked by @ClientEventListener in target class */
const ClientEventListeners = Symbol("ClientEventListeners");
/* generic constructor type for decorator */
type constructor = { new(...args: any[]): any };
const eventService = ServerEventsService.getInstance();

/**
 *  Decorates a class so that the ClientEventListener decorator can be used on methods.
 */
export function ClientEvents<T extends constructor>(base: T) {
    return class ServerEventsEnabled extends base {
        constructor(...args: any[]) {
            super(args);

            const serverEventListeners = base.prototype[ClientEventListeners] ?? [];
            serverEventListeners.forEach((eventType: any, functionName: string) => {
                const observable = eventService.getObservableForClientEvent(eventType);
                observable.subscribe((event: any) => {
                    this[functionName](event, source);
                })
            });
        }
    }
}

/**
 * A decorated method will automatically execute when the specified EventType event emits.
 * When an EventType is provided, the decorated method must adhere strictly to the typings of that EventType;
 * typescripts IntelliSense will help with that.
 * internal: stores the names of decorated functions and their respective EventTypes in a map in the target,
 * so those functions can be executed when the provided EventType emits.
 */
 export function ClientEventListener<T,D>(eventType: EventConstructor<T,D>) {
    return function(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<(event: T, source: number) => any>) {
        target[ClientEventListeners] = target[ClientEventListeners] || new Map();
        target[ClientEventListeners].set(propertyKey, eventType);
    }
}
