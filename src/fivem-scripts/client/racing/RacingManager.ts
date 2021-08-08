import { CheckpointIcon, Game } from "fivem-js";
import { Vec3, Vector3 } from "fivem-js/lib/utils/Vector3";

import { StartRace, StopRace } from "../../../angular-fivem-shared/nui-events/callbacks";
import {  CheckpointPosition, Race } from "../../../angular-fivem-shared/Racing";
import { NuiCallbackEvents, NuiCallbackListener } from "../NuiEventsService";
import { RaceCheckpoint } from "./Checkpoint";
import { EditRaceMode } from "./EditRaceMode";

@NuiCallbackEvents
export class RacingManager {
    private static instance: RacingManager | null = null;
    public static getInstance(): RacingManager {
        if (!RacingManager.instance) {
            RacingManager.instance = new RacingManager();
        }
        return RacingManager.instance;
    }

    private editRaceMode = EditRaceMode.getInstance();

    private activeRaceName: string | null = null;
    private activeRaceTickHandler: number | null = null;
    private raceStartPosition: CheckpointPosition | null = null;
    private raceCheckpoints: RaceCheckpoint[] = [];
    private activeCheckpointIndex = -1;
    private currentRoundIndex = -1;

    private isRaceActive(): boolean {
        return this.activeRaceName !== null && this.activeRaceName !== "";
    }

    private get currentCheckpoint(): RaceCheckpoint | null {
        return this.raceCheckpoints[this.activeCheckpointIndex] ?? null;
    }

    @NuiCallbackListener(StartRace)
    public async handleStartRaceEvent(event: StartRace) {
        if (this.isRaceActive()) {
            console.log(`there already is an active race: ${this.activeRaceName}`);
            return;
        }
        if (!event.data.race) {
            return;
        }
        const race = event.data.race;
        this.startRace(race);
    }

    @NuiCallbackListener(StopRace)
    public async stopRace(event: StopRace) {
       this.stopActiveRace();
    }

    private startRace(race: Race) {
        this.editRaceMode.stopEditRace();

        this.activeRaceName = race.name;
        this.raceStartPosition = race.checkpointPositions[0];
        this.raceCheckpoints = this.createCheckpointsForRace(race);
        this.activeCheckpointIndex = 0;
        this.currentCheckpoint?.show();
        this.activeRaceTickHandler = setTick(() => this.raceLoop());
        this.movePlayerToStartPosition();
    }

    private movePlayerToStartPosition() {
        if (this.raceStartPosition) {
            const target = Game.PlayerPed.isInAnyVehicle() ? Game.PlayerPed.CurrentVehicle : Game.PlayerPed;
            target.Position = Vector3.create(this.raceStartPosition.position);
            target.Heading = this.raceStartPosition.heading;
        }
    }

    private stopActiveRace() {
        console.log(`stopping race: ${this.activeRaceName}`);
        this.activeRaceName = null;
        this.currentRoundIndex = -1;
        this.currentCheckpoint?.hide();
        this.activeCheckpointIndex = -1;
        this.raceCheckpoints = [];
        this.raceStartPosition = null;

        if (this.activeRaceTickHandler != null) {
            clearTick(this.activeRaceTickHandler);
            this.activeRaceTickHandler = null;
        }
    }

    private createCheckpointsForRace(race: Race): RaceCheckpoint[] {
        const racePositions = race.checkpointPositions.slice();
        // if rounds is > 1, just append the same checkpoints each time to create loops
        if (race.defaultRounds > 1) {
            for (let i = 1; i < race.defaultRounds; i++) {
                const copy = racePositions.slice();
                racePositions.push(...copy);
            }
        }

        const resultCheckpoints: RaceCheckpoint[] = [];
        // ignore starting point of race
        for (let i = 1; i < racePositions.length; i++) {
            const startPoint = racePositions[i];
            const targetPoint = racePositions[i + 1];
            let checkpoint: RaceCheckpoint;
            if (targetPoint !== undefined) {
                checkpoint = new RaceCheckpoint(
                    Vector3.create(startPoint.position),
                    Vector3.create(targetPoint.position), {
                        clipToGround: startPoint.clipToGround,
                        radius: startPoint.radius,
                        color: startPoint.color
                    }
                );
            } else {
                checkpoint = new RaceCheckpoint(
                    Vector3.create(startPoint.position),
                    // finish checkpoint has no target
                    new Vector3(0, 0, 0),{
                        icon: CheckpointIcon.CylinderCheckerboard,
                        clipToGround: startPoint.clipToGround,
                        radius: startPoint.radius,
                        color: startPoint.color
                    }
                );
            }
            resultCheckpoints.push(checkpoint);
        }

        return resultCheckpoints;
    }

    private raceLoop() {
        if (this.currentCheckpoint) {
            const checkpointHit = Game.PlayerPed.Position.distance(this.currentCheckpoint.position) < this.currentCheckpoint.radius;
            if (checkpointHit) {
                this.currentCheckpoint.hide()

                this.activeCheckpointIndex++;

                if (!this.currentCheckpoint) {
                    // play finish line sound
                    PlaySoundFrontend(-1, "Checkpoint_Finish", "DLC_AW_Frontend_Sounds", false);
                    this.stopActiveRace();
                } else {
                    // play checkpoint hit sound
                    PlaySoundFrontend(-1, "Checkpoint_Lap", "DLC_AW_Frontend_Sounds", false);
                    this.currentCheckpoint.show();
                }
            }
        }
    }
}
