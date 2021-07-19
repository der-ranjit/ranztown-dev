import { Observable, Observer } from "rxjs";
import { map} from "rxjs/operators";

import { Message } from "../../shared/nui-events";

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

    public emitNuiMessage<D, T extends Message.Base<D>>(eventType: { new(arg:D | null): T }, data: D | null): Promise<D | null> {
        const event = new eventType(data);
        SendNuiMessage(JSON.stringify({ type: event.name, data: event.data }))
        return Promise.resolve(null);
    }

    public onNuiCallback<R, D, T extends Message.Base<D, R>>(
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
