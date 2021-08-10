import { BlipSprite } from "fivem-js/lib/enums/Blip";
import { CheckpointIcon } from "fivem-js/lib/enums/Checkpoint";
import { Vector3 } from "fivem-js/lib/utils/Vector3";

import { EditRaceAddTempPosition, EditRaceSave, EditRaceStopEdit } from "../../../angular-fivem-shared/nui-events/callbacks";
import { CheckpointPosition, Race } from "../../../angular-fivem-shared/Racing";
import { ClientSaveRaceTrack } from "../../client-server-shared/events";
import { ClientEventsService } from "../ClientEventsService";
import { NuiCallbackEvents, NuiCallbackListener } from "../NuiEventsService";
import { RaceCheckpoint, RingTripleArrowGroundHeight } from "./Checkpoint";

/**
 * Adds temporary checkpoints and blips to the creating players minimap and world
 */


@NuiCallbackEvents
export class EditRaceMode {
    private static instance: EditRaceMode | null = null;
    public static getInstance(): EditRaceMode {
        if (!EditRaceMode.instance) {
            EditRaceMode.instance = new EditRaceMode();
        }
        return EditRaceMode.instance;
    }

    private events = ClientEventsService.getInstance();

    private editModeBlipHandles: number[] = [];
    private editModeCheckpointHandles: number[] = [];

    @NuiCallbackListener(EditRaceStopEdit)
    public async editRaceStopEdit(event: EditRaceStopEdit) {
        this.stopEditRace();
    }

    @NuiCallbackListener(EditRaceAddTempPosition)
    public async handleEditRaceAddTempPositionEvent(event: EditRaceAddTempPosition) {
        if (event.data.position) {
            this.addTempCheckpointPosition(event.data);
        }
    }

    @NuiCallbackListener(EditRaceSave)
    private async onSaveRace(event: EditRaceSave): Promise<void> {
        this.events.emitNet(ClientSaveRaceTrack, { track: event.data.track });
    }

    public stopEditRace() {
        this.editModeBlipHandles.forEach(handle => RemoveBlip(handle));
        this.editModeBlipHandles = [];
        this.editModeCheckpointHandles.forEach(handle => DeleteCheckpoint(handle));
        this.editModeCheckpointHandles = [];
    }

    private startEditRace(race: Race) {
        this.stopEditRace();
        for (let checkpointPosition of race.checkpointPositions) {
            this.addTempCheckpointPosition(checkpointPosition);
        }
    }

    private addTempCheckpointPosition(checkpointPosition: CheckpointPosition) {
        const {x, y, z} = checkpointPosition.position;
        const blipHandle = AddBlipForCoord(x, y, z);
        if (this.editModeBlipHandles.length === 0) {
            // start point
            SetBlipSprite(blipHandle, BlipSprite.RaceCar);
        } else if (this.editModeBlipHandles.length > 0) {
            // set new checkpoint as finish
            // TODO map checkpointPosition color to blip colors
            SetBlipColour(blipHandle, 0);
            SetBlipSprite(blipHandle, BlipSprite.RaceFinish);

            // set previous non-start checkpoints to normal
            if (this.editModeBlipHandles.length > 1) {
                const previousBlipHandle  = this.editModeBlipHandles[this.editModeBlipHandles.length - 1];
                if (blipHandle) {
                    SetBlipSprite(previousBlipHandle, BlipSprite.Standard);
                }
            }
        }
        this.editModeBlipHandles.push(blipHandle);

        const tempCheckpointPosition = Vector3.create(checkpointPosition.position);
        if (checkpointPosition.clipToGround) {
            const position = tempCheckpointPosition;
            const [_ , topZ] = GetGroundZFor_3dCoord(position.x, position.y, position.z, false);
            const groundOffset = RingTripleArrowGroundHeight;
            if (position.z - topZ > 0) {
                position.z = topZ + groundOffset;
            }
        }
        const tempCheckpoint = RaceCheckpoint.CreateCheckpoint(
            CheckpointIcon.RingTripleArrow,
            tempCheckpointPosition,
            new Vector3(0, 0, 0),
            checkpointPosition.radius,
            checkpointPosition.color
        );
        this.editModeCheckpointHandles.push(tempCheckpoint);
    }
}
