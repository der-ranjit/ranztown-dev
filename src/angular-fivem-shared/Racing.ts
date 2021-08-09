import type { Color } from "fivem-js";
import { Vec3 } from "fivem-js/lib/utils/Vector3";

export interface Race {
    /* set by server */
    id: string;
    /* set by server */
    userId: string;
    name: string;
    description: string;
    defaultRounds: number;
    checkpointPositions: CheckpointPosition[];
}

export interface CheckpointPosition {
    position: Vec3;
    heading: number;
    clipToGround: boolean;
    radius: number;
    color: Color
}
