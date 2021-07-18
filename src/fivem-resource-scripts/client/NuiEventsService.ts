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

    private nuiActive = false;
    protected cachedObservables = new Map<string, Observable<any>>()

    constructor() {
        super();
        this.init();
    }

    public emit<D, T extends Events.Event<D>>(eventType: { new(arg:D | null): T }, data: D | null): Promise<D | null> {
        const event = new eventType(data);
        SendNuiMessage(JSON.stringify({ type: event.name, data: event.data }))
        return Promise.resolve(null);
    }

    public on<D, T extends Events.Event<D>>(eventType: { new(arg: D | null): T}): Observable<T & {cb: (response: D | null) => void}> {
        const event = new eventType(null);
        if (!this.cachedObservables.has(event.name)) {
            RegisterNuiCallbackType(event.name);
            const nuiObservable = this.createObservableFromNuiCallback(event.name).pipe(
                map(_event => ({name: event.name, data: _event.data, cb: _event.cb}))
            );
            this.cachedObservables.set(event.name, nuiObservable)
        }
        return this.cachedObservables.get(event.name)!;
    };

    private init(): void {
        setTick(() => {
            if (Cfx.Game.isControlPressed(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.InteractionMenu)) {
                this.toggleNUI();
            }
            if (this.nuiActive) {
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.LookLeftRight, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.LookUpDown, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.MeleeAttackAlternate, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.VehicleMouseControlOverride, this.nuiActive);
            }
        })
    }

    public toggleNUI(): void {
        this.nuiActive = !this.nuiActive;
        SetNuiFocus(this.nuiActive, this.nuiActive);
        SetNuiFocusKeepInput(this.nuiActive);
    }

    private createObservableFromNuiCallback(eventName: string): Observable<NuiCallbackType> {
        return new Observable((observer: Observer<NuiCallbackType>) => {
            on(`__cfx_nui:${eventName}`, (data: any, cb: Function) => {
                observer.next({data, cb})
            });
        });
    }
}
