import { Injectable } from "@angular/core";
import { fromEvent, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";

import { Events } from "../../events";

@Injectable({providedIn: "root"})
export class FiveMClientService {
    // get parent resource name by call to GetParentResourceName()
    private parentResourceName = "testmenu";

    /* cache observables created for events */
    private eventObservables = new Map<string, Observable<any>>();

    public async invoke(eventName: string, data: any): Promise<any>{
        const result = await fetch(`https://${this.parentResourceName}/${eventName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(data)
        });
        return result.json();
    }

    public getEventObservable<D, T extends Events.Event<D>>(eventType: { new(arg?: D): T}): Observable<T> {
        const event = new eventType();
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
