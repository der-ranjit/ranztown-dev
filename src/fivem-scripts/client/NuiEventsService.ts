import { Observable, Observer } from "rxjs";

import { Callback, Message } from "../../angular-fivem-shared/nui-events";
import { DefaultCallbackResponse } from "../../angular-fivem-shared/nui-events/callbacks";

export class CfxNuiEventsService {
    private static instance: CfxNuiEventsService | null = null;
    public static getInstance(): CfxNuiEventsService {
        if (!CfxNuiEventsService.instance) {
            CfxNuiEventsService.instance = new CfxNuiEventsService();
        }
        return CfxNuiEventsService.instance;
    }

    private cachedEventObservables = new Map<string, Observable<any>>();

    public emitNuiMessage<D, T extends Message.AbstractMessage<D>>(
        eventType: Message.MessageConstructor<T,D>,
        data: D | null
    ): Promise<D | null> {
        SendNuiMessage(JSON.stringify({ type: eventType.name, data }))
        return Promise.resolve(null);
    }

    /* If possible, use the @NuiCallbackListener Decorator instead */
    public getObservableForNuiCallback<T,D,R>(nuiCallback: Callback.CallbackConstructor<T,D,R>): Observable<T> {
        const eventName = nuiCallback.name;
        if (!this.cachedEventObservables.has(eventName)) {
            RegisterNuiCallbackType(eventName);
            const nuiObservable = this.createObservableFromNuiCallback(nuiCallback);
            this.cachedEventObservables.set(eventName, nuiObservable)
        }
        return this.cachedEventObservables.get(eventName)!;
    }

    private createObservableFromNuiCallback<T,D,R>(nuiCallback: Callback.CallbackConstructor<T,D,R>): Observable<T> {
        const eventName = nuiCallback.name;
        return new Observable((observer: Observer<any>) => {
            on(`__cfx_nui:${eventName}`, (data: D, cb: Function) => {
                observer.next({
                    name: eventName,
                    data: data,
                    cb: cb
                })
            });
        });
    }
}

/* Unique symbol to prevent naming collisions. Used to store functions marked by @NuiCallbackListener in target class */
const NuiCallbackFunctions = Symbol("NuiCallbackFunctions");
/* generic constructor type for decorator */
type constructor = { new(...args: any[]): any };
const eventService = CfxNuiEventsService.getInstance();

/**
 *  Decorates a class so that the NuiCallbackListener decorator can be used on methods.
 */
export function NuiCallbackEvents<T extends constructor>(base: T) {
    return class NuiCallbackEventsEnabled extends base {
        constructor(...args: any[]) {
            super(args);

            const nuiCallbackFunctions = base.prototype[NuiCallbackFunctions] ?? [];
            nuiCallbackFunctions.forEach((eventType: any, functionName: string) => {
                const observable = eventService.getObservableForNuiCallback(eventType);
                observable.subscribe(async (event: any) => {
                    const result = await this[functionName](event) ?? DefaultCallbackResponse;
                    // make sure we always resolve the nui callback with some value
                    event.cb(result);
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
 export function NuiCallbackListener<T,D,R>(eventType: Callback.CallbackConstructor<T,D,R>) {
    return function(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<(event: T) => Promise<R>>) {
        target[NuiCallbackFunctions] = target[NuiCallbackFunctions] || new Map();
        target[NuiCallbackFunctions].set(propertyKey, eventType);
    }
}
