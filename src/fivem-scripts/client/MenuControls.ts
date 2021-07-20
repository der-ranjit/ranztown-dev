import * as Cfx from "fivem-js";

import { Callback, Message } from "../../shared/nui-events";
import { SetControlsDisabledData } from "../../shared/nui-events/callbacks";
import { CfxNuiEventsService, NuiCallbackEvents, NuiCallbackListener } from "./NuiEventsService";

@NuiCallbackEvents
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

    private controlsDisabled = false;


    constructor() {
        this.initControls();
    }

    @NuiCallbackListener(Callback.SetControlsDisabled)
    public async setControlsDisabled(data: SetControlsDisabledData): Promise<void> {
        this.controlsDisabled = data.disabled;
    }

    private initControls(): void {
        setTick(() => {
            // open on F1
            if (Cfx.Game.isControlPressed(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.ReplayStartStopRecording) && !this.nuiActivating) {
                this.enableNUI();
                this.nuiActivating = true;
            }
            // close on ESC
            if (this.nuiActive && Cfx.Game.isControlPressed(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.ReplayToggleTimeline)) {
                this.disableNUI();
            }
            if (this.nuiActive) {
                if(this.controlsDisabled) {
                    DisableAllControlActions(0);
                } else {
                    EnableAllControlActions(0);
                    this.disableControlsForMenu()
                }

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

    private enableNUI(): void {
        this.nuiActive = true;
        SetNuiFocus(true, true);
        SetNuiFocusKeepInput(true);
        this.events.emitNuiMessage(Message.setNuiVisibility, { nuiVisible: true });
        setTimeout(() => this.nuiActivating = false, this.nuiDebounceMS)
    }

    private disableNUI(): void {
        SetNuiFocus(false, false);
        SetNuiFocusKeepInput(false);
        this.events.emitNuiMessage(Message.setNuiVisibility, { nuiVisible: false });
        // setTimeout to disable controls some longer; in case esc is pressed the pause menu would open
        setTimeout(() => {
            this.nuiActive = false;
            this.nuiActivating = false;
        }, 300)
    }

    private disableControlsForMenu(): void {
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
}
