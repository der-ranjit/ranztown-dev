import { Injectable } from "@angular/core";
import { fromEvent, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";

import { Events } from "../../shared/events";

@Injectable({providedIn: "root"})
export class FiveMClientService {
    // get parent resource name by call to GetParentResourceName()
    private parentResourceName = "testmenu";

    /* cache observables created for events */
    private eventObservables = new Map<string, Observable<any>>();

    public async invoke<D, T extends Events.Event<D>>(eventType: { new(arg:D | null): T }, data: D | null): Promise<D | null>{
        const event = new eventType(data);
        const result = await fetch(`https://${this.parentResourceName}/${event.name}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: event.data != null ? JSON.stringify(event.data) : null
        });
        return result.json();
    }

    public getEventObservable<D, T extends Events.Event<D>>(eventType: { new(arg: D | null): T}): Observable<T> {
        const event = new eventType(null);
        if (!this.eventObservables.has(event.name)) {
            const observable = fromEvent(window, "message").pipe(
                filter((messageEvent: any) => messageEvent.data.type === event.name),
                map(messageEvent => { return { name: messageEvent.data.type, data: messageEvent.data.data } })
            );
            this.eventObservables.set(event.name, observable)
        }
        return this.eventObservables.get(event.name)!;
    }
}
