import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Message } from "../../../../angular-fivem-shared/nui-events";
import { AppNuiEventsService } from "./nui-events.service";

/* https://github.com/angular/angular/issues/30497 */
/* Unique symbol to prevent naming collisions. Used to store functions marked by @NuiCallbackListener in target class */
const NuiMessageFunctions = Symbol("NuiMessageFunctions");
const eventService = AppNuiEventsService.getInstance();

export function NuiMessageEvents(target: any) {
    const originalInit = target.prototype.ngOnInit;
    const originalDestroy: Function | null = target.prototype.ngOnDestroy;

    // use ugly name to prevent name collisions
    target.prototype.___uiOnDestroy$ = new Subject();

    target.prototype.ngOnInit = function() {
        const nuiMessageFunctions = target.prototype[NuiMessageFunctions] ?? [];
        nuiMessageFunctions.forEach((eventType: any, functionName: string) => {
            const observable = eventService.getObservableForNuiMessage(eventType);
            observable.pipe(takeUntil(target.prototype.___uiOnDestroy$)).subscribe(async (event: any) => {
                this[functionName](event);
            })
        });
        originalInit?.apply(this);
    };

    target.prototype.ngOnDestroy = function() {
        target.prototype.___uiOnDestroy$.next();
        originalDestroy?.apply(this);
    };
}

/**
 * A decorated method will automatically execute when the specified EventType event emits.
 * When an EventType is provided, the decorated method must adhere strictly to the typings of that EventType;
 * typescripts IntelliSense will help with that.
 * internal: stores the names of decorated functions and their respective EventTypes in a map in the target,
 * so those functions can be executed when the provided EventType emits.
 */
 export function NuiMessageListener<T, D>(eventType: Message.MessageConstructor<T, D>) {
    return function(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<(event: T) => void>) {
        target[NuiMessageFunctions] = target[NuiMessageFunctions] || new Map();
        target[NuiMessageFunctions].set(propertyKey, eventType);
    }
}
