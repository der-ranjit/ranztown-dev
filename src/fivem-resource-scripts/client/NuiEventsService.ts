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
    private nuiActivating = false;
    /* the game is too fast and registers the menu key multiple times, toggling it more than one time. debounce! */
    private nuiDebounceMS = 500;

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

    private init(): void {
        setTick(() => {
            if (Cfx.Game.isControlPressed(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.InteractionMenu) && !this.nuiActivating) {
                this.toggleNUI();
                this.nuiActivating = true;
            }
            if (this.nuiActive && Cfx.Game.isControlPressed(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.FrontendCancel)) {
                this.disableNUI();
            }
            if (this.nuiActive) {
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.LookLeftRight, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.LookUpDown, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.MoveLeftRight, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.MoveUpDown, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.VehicleExit, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.MeleeAttackAlternate, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.VehicleMouseControlOverride, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.VehicleHorn, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.Enter, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.VehicleRadioWheel, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.VehicleNextRadio, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.VehiclePrevRadio, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.WeaponWheelUpDown, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.WeaponWheelLeftRight, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.WeaponWheelNext, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.WeaponWheelPrev, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.NextWeapon, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.PrevWeapon, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.SelectNextWeapon, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.SelectPrevWeapon, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.VehicleSelectNextWeapon, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.SelectWeapon, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.CharacterWheel, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.Duck, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.FrontendPauseAlternate, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.FrontendPause, this.nuiActive);
            }
        })
    }

    public toggleNUI(): void {
        this.nuiActive = !this.nuiActive;
        SetNuiFocus(this.nuiActive, this.nuiActive);
        SetNuiFocusKeepInput(this.nuiActive);
        this.emit(Events.setNuiVisibility, {nuiVisible: this.nuiActive});
        setTimeout(() => this.nuiActivating = false, this.nuiDebounceMS)
    }

    public disableNUI(): void {
        SetNuiFocus(false, false);
        SetNuiFocusKeepInput(false);
        this.emit(Events.setNuiVisibility, {nuiVisible: false});
        // setTimeout to disable controls some longer; in case esc is pressed the pause menu would open
        setTimeout(() => {
            this.nuiActive = false;
            this.nuiActivating = false;
        }, 300)
    }

    private createObservableFromNuiCallback(eventName: string): Observable<NuiCallbackType> {
        return new Observable((observer: Observer<NuiCallbackType>) => {
            on(`__cfx_nui:${eventName}`, (data: any, cb: Function) => {
                observer.next({data, cb})
            });
        });
    }
}
