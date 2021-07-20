import { Injectable } from "@angular/core";
import { fromEvent, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";

import { Callback, Message } from "../../shared/nui-events";
import { CallbackConstructorType } from "../../shared/nui-events/callbacks";
import { getEventName } from "../../shared/nui-events/utils";

@Injectable({providedIn: "root"})
export class AppNuiEventsService {
    /* cache observables created for events */
    protected cachedObservables = new Map<string, Observable<any>>();
    // get parent resource name by call to GetParentResourceName()
    private parentResourceName = "testmenu";

    public async emitNuiCallback<R, D, T extends Callback.AbstractCallback<D,R>>(
        eventType: CallbackConstructorType<T, D, R>,
        data: D | null
    ): Promise<R>{
        const result = await fetch(`https://${this.parentResourceName}/${getEventName(eventType)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: data != null ? JSON.stringify(data) : null
        });
        return result.json();
    }

    public onNuiMessage<D, T extends Message.AbstractMessage<D>>(eventType: { new(arg: D | null): T}): Observable<T> {
        const eventName = getEventName(eventType);
        if (!this.cachedObservables.has(eventName)) {
            const observable = fromEvent(window, "message").pipe(
                filter((messageEvent: any) => messageEvent.data.type === eventName),
                map(messageEvent => { return { name: messageEvent.data.type, data: messageEvent.data.data } })
            );
            this.cachedObservables.set(eventName, observable)
        }
        return this.cachedObservables.get(eventName)!;
    }
}
