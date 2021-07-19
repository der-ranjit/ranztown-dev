import * as Cfx from "fivem-js";
import { Observable, Observer } from "rxjs";
import { map} from "rxjs/operators";

import { Events } from "../../shared/events";
import { EventsService } from "../../shared/events/EventsService";

type NuiCallbackType = { data: any, cb: Function };

export class NuiEventsService extends EventsService {
    private static instance: NuiEventsService | null = null;
    public static getInstance(): NuiEventsService {
        if (!NuiEventsService.instance) {
            NuiEventsService.instance = new NuiEventsService();
        }
        return NuiEventsService.instance;
    }

    protected cachedObservables = new Map<string, Observable<any>>()

    public emit<D, T extends Events.Event<D>>(eventType: { new(arg:D | null): T }, data: D | null): Promise<D | null> {
        const event = new eventType(data);
        SendNuiMessage(JSON.stringify({ type: event.name, data: event.data }))
        return Promise.resolve(null);
    }

    public on<R, D, T extends Events.Event<D, R>>(
        eventType: { new(data: D | null, response: R | null): T}
    ): Observable<T & {cb: (response: R | null) => void}> {
        const event = new eventType(null, null);
        if (!this.cachedObservables.has(event.name)) {
            RegisterNuiCallbackType(event.name);
            const nuiObservable = this.createObservableFromNuiCallback(event.name).pipe(
                map(_event => ({name: event.name, data: _event.data, cb: _event.cb}))
            );
            this.cachedObservables.set(event.name, nuiObservable)
        }
        return this.cachedObservables.get(event.name)!;
    };

    private createObservableFromNuiCallback(eventName: string): Observable<NuiCallbackType> {
        return new Observable((observer: Observer<NuiCallbackType>) => {
            on(`__cfx_nui:${eventName}`, (data: any, cb: Function) => {
                observer.next({data, cb})
            });
        });
    }
}
