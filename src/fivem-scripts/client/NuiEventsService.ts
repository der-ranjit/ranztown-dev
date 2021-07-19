import { Observable, Observer } from "rxjs";
import { map} from "rxjs/operators";

import { Callback, Message } from "../../shared/nui-events";

type NuiCallbackType = { data: any, cb: Function };

export class CfxNuiEventsService {
    private static instance: CfxNuiEventsService | null = null;
    public static getInstance(): CfxNuiEventsService {
        if (!CfxNuiEventsService.instance) {
            CfxNuiEventsService.instance = new CfxNuiEventsService();
        }
        return CfxNuiEventsService.instance;
    }

    private cachedObservables = new Map<string, Observable<any>>()

    public emitNuiMessage<D, T extends Message.AbstractMessage<D>>(eventType: { new(arg:D | null): T }, data: D | null): Promise<D | null> {
        const event = new eventType(data);
        SendNuiMessage(JSON.stringify({ type: event.name, data: event.data }))
        return Promise.resolve(null);
    }

    public onNuiCallback<R, D, T extends Callback.AbstractCallback<D, R>>(
        eventType: { new(data: D | null, response: R, cb: (response: R) => void): T}
    ): Observable<T> {
        // event is only created to get the correct name; this is ugly but :shrug:
        const mockCb = (r: R) => {};
        const event = new eventType(null, null as any, mockCb);
        if (!this.cachedObservables.has(event.name)) {
            RegisterNuiCallbackType(event.name);
            const nuiObservable = this.createObservableFromNuiCallback(event.name).pipe(
                // create object of type Callback
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
