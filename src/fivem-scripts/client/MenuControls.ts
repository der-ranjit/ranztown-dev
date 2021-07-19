import * as Cfx from "fivem-js";

import { Events } from "../../shared/events";
import { CfxNuiEventsService } from "./NuiEventsService";

export class MenuControls {
    private static instance: MenuControls | null = null;
    public static getInstance(): MenuControls {
        if (!MenuControls.instance) {
            MenuControls.instance = new MenuControls();
        }
        return MenuControls.instance;
    }

    private events = CfxNuiEventsService.getInstance();
    private nuiActive = false;
    private nuiActivating = false;
    /* the game is too fast and registers the menu key multiple times, toggling it more than one time. debounce! */
    private nuiDebounceMS = 500;


    constructor() {
        this.initControls();
    }

    private initControls(): void {
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
            // allow looking around when right mouse is pressed in vehicle
            const isAiming = Cfx.Game.isControlPressed(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.VehicleAim)
                || Cfx.Game.isControlPressed(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.Aim)
            if (this.nuiActive && isAiming) {
                EnableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.LookLeftRight, true);
                EnableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.LookUpDown, true);
            }
        })
    }

    private toggleNUI(): void {
        this.nuiActive = !this.nuiActive;
        SetNuiFocus(this.nuiActive, this.nuiActive);
        SetNuiFocusKeepInput(this.nuiActive);
        this.events.emitNuiMessage(Events.setNuiVisibility, { nuiVisible: this.nuiActive });
        setTimeout(() => this.nuiActivating = false, this.nuiDebounceMS)
    }

    private disableNUI(): void {
        SetNuiFocus(false, false);
        SetNuiFocusKeepInput(false);
        this.events.emitNuiMessage(Events.setNuiVisibility, { nuiVisible: false });
        // setTimeout to disable controls some longer; in case esc is pressed the pause menu would open
        setTimeout(() => {
            this.nuiActive = false;
            this.nuiActivating = false;
        }, 300)
    }
}
