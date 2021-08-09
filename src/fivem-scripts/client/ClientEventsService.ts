import { Observer } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { AbstractEvent, EventConstructor } from "../client-server-shared/events";

export class ClientEventsService {
    private static instance: ClientEventsService | null = null;
    public static getInstance(): ClientEventsService {
        if (!ClientEventsService.instance) {
            ClientEventsService.instance = new ClientEventsService();
        }
        return ClientEventsService.instance;
    }

    private cachedServerEventObservables = new Map<string, Observable<any>>();

    /**
     * Emits an event to the server.
     * @param eventType
     * @param data
     * @returns
     */
    public emitNet<D, T extends AbstractEvent<D>>(
        eventType: EventConstructor<T,D>,
        data: D | null = null
    ): void {
        emitNet(eventType.name, data)
    }

    public getObservableForServerEvent<T,D>(serverEvent: EventConstructor<T,D>): Observable<T> {
        const eventName = serverEvent.name;
        if (!this.cachedServerEventObservables.has(eventName)) {
            const observable = this.createObservableFromServerEvent(serverEvent);
            this.cachedServerEventObservables.set(eventName, observable)
        }
        return this.cachedServerEventObservables.get(eventName)!;
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

/* Unique symbol to prevent naming collisions. Used to store functions marked by @ServerEventListener in target class */
const ServerEventListeners = Symbol("ServerEventListeners");
/* generic constructor type for decorator */
type constructor = { new(...args: any[]): any };
const eventService = ClientEventsService.getInstance();

/**
 *  Decorates a class so that the ServerEventListener decorator can be used on methods.
 */
export function ServerEvents<T extends constructor>(base: T) {
    return class ServerEventsEnabled extends base {
        constructor(...args: any[]) {
            super(args);

            const serverEventListeners = base.prototype[ServerEventListeners] ?? [];
            serverEventListeners.forEach((eventType: any, functionName: string) => {
                const observable = eventService.getObservableForServerEvent(eventType);
                observable.subscribe((event: any) => {
                    this[functionName](event);
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
 export function ServerEventListener<T,D>(eventType: EventConstructor<T,D>) {
    return function(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<(event: T) => any>) {
        target[ServerEventListeners] = target[ServerEventListeners] || new Map();
        target[ServerEventListeners].set(propertyKey, eventType);
    }
}
