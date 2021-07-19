import { Injectable } from "@angular/core";
import { fromEvent, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";

import { Callback, Message } from "../../shared/nui-events";

@Injectable({providedIn: "root"})
export class AppNuiEventsService {
    /* cache observables created for events */
    protected cachedObservables = new Map<string, Observable<any>>();
    // get parent resource name by call to GetParentResourceName()
    private parentResourceName = "testmenu";

    public async emitNuiCallback<R, D, T extends Callback.AbstractCallback<D,R>>(
        eventType: { new(data: D | null, response: R, cb: (response: R) => void): T},
        data: D | null
    ): Promise<R>{
        // create event with provided data; because of typing we need a cb - this is ugly but :shrug:
        const mockCb = (r: R) => {};
        const event = new eventType(data, null as any, mockCb);
        const result = await fetch(`https://${this.parentResourceName}/${event.name}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: event.data != null ? JSON.stringify(event.data) : null
        });
        return result.json();
    }

    public onNuiMessage<D, T extends Message.AbstractMessage<D>>(eventType: { new(arg: D | null): T}): Observable<T> {
       // event is only created to get the name of the event
        const event = new eventType(null);
        if (!this.cachedObservables.has(event.name)) {
            const observable = fromEvent(window, "message").pipe(
                filter((messageEvent: any) => messageEvent.data.type === event.name),
                map(messageEvent => { return { name: messageEvent.data.type, data: messageEvent.data.data } })
            );
            this.cachedObservables.set(event.name, observable)
        }
        return this.cachedObservables.get(event.name)!;
    }
}
