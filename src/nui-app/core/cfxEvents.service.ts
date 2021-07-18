import { Injectable } from "@angular/core";
import { fromEvent, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";

import { Events } from "../../shared/events";
import { EventsService } from "../../shared/events/EventsService";

@Injectable({providedIn: "root"})
export class CfxEventsService extends EventsService {
    // get parent resource name by call to GetParentResourceName()
    private parentResourceName = "testmenu";

    public async emit<D, T extends Events.Event<D>>(eventType: { new(arg:D | null): T }, data: D | null): Promise<D | null>{
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

    public on<D, T extends Events.Event<D>>(eventType: { new(arg: D | null): T}): Observable<T> {
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
