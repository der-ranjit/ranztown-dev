import { Injectable } from "@angular/core";
import { fromEvent, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";

import { Message } from "../../shared/nui-events";

@Injectable({providedIn: "root"})
export class AppNuiEventsService {
    /* cache observables created for events */
    protected cachedObservables = new Map<string, Observable<any>>();
    // get parent resource name by call to GetParentResourceName()
    private parentResourceName = "testmenu";

    public async emitNuiCallback<R, D, T extends Message.Base<D,R>>(
        eventType: { new(data: D | null, response: R | null): T},
        data: D | null
    ): Promise<R | null>{
        const event = new eventType(data, null);
        const result = await fetch(`https://${this.parentResourceName}/${event.name}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: event.data != null ? JSON.stringify(event.data) : null
        });
        return result.json();
    }

    public onNuiMessage<D, T extends Message.Base<D>>(eventType: { new(arg: D | null): T}): Observable<T> {
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
