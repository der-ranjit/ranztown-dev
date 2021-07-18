import { Observable } from "rxjs";

import { Events } from "./";

export abstract class EventsService {
    /* cache observables created for events */
    protected cachedObservables = new Map<string, Observable<any>>();

    public abstract emit<D, T extends Events.Event<D>>(eventType: { new(arg:D | null): T }, data: D | null): Promise<D | null>;

    public abstract on<D, T extends Events.Event<D>>(eventType: { new(arg: D | null): T}): Observable<T>;
}
