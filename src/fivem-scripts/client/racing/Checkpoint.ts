import { BlipSprite, CheckpointIcon, Color, Vector3 } from "fivem-js";
import { Vec3 } from "fivem-js/lib/utils/Vector3";

export const RingTripleArrowGroundHeight = 2.5;

export interface OptionalRaceCheckpointArgs {
    icon?: CheckpointIcon;
    radius?: number;
    color?: Color;
    clipToGround?: boolean;
}

export class RaceCheckpoint {
    public static CreateCheckpoint(
        icon: CheckpointIcon,
        position: Vec3,
        targetPosition: Vec3,
        radius: number,
        color: Color,
        reserved = 0
    ): number {
        return CreateCheckpoint(
            icon,
            position.x,
            position.y,
            position.z,
            targetPosition.x,
            targetPosition.y,
            targetPosition.z,
            radius,
            color.r,
            color.g,
            color.b,
            color.a,
            reserved
        )
    };
    public handle: number | null = null;
    public icon: CheckpointIcon;
    public radius: number;
    public color: Color;

    private blipHandle: number | null = null;
    private nextBlipHandle: number | null = null;

    constructor(
        public position: Vector3,
        public targetPosition: Vector3,
        {
            icon = CheckpointIcon.RingTripleArrow,
            radius = 10,
            color = Color.white,
            clipToGround = false
        }: OptionalRaceCheckpointArgs = {}
    ) {
        this.icon = icon;
        this.radius = radius;
        this.color = color;
        if (clipToGround) {
            const [_ , topZ] = GetGroundZFor_3dCoord(position.x, position.y, position.z, false);
            const groundOffset = this.icon === CheckpointIcon.RingTripleArrow ? RingTripleArrowGroundHeight : 0;
            if (position.z - topZ > 0) {
                position.z = topZ + groundOffset;
            }
        }
    }

    public show() {
        const handle = CreateCheckpoint(
            this.icon,
            this.position.x,
            this.position.y,
            this.position.z,
            this.targetPosition.x,
            this.targetPosition.y,
            this.targetPosition.z,
            this.radius,
            this.color.r,
            this.color.g,
            this.color.b,
            this.color.a,
            0
        )
        this.handle = handle;

        this.blipHandle = AddBlipForCoord(this.position.x, this.position.y, this.position.z);
        SetBlipScale(this.blipHandle, 1.2);
        SetBlipRoute(this.blipHandle,  true);

        if (this.hasTarget()) {
            this.nextBlipHandle = AddBlipForCoord(this.targetPosition.x, this.targetPosition.y, this.targetPosition.z);
            SetBlipScale(this.nextBlipHandle, 0.9);
        } else {
            // TODO rework; don't do this here
            // when no target is set just assume it is a finish checkpoint
            SetBlipSprite(this.blipHandle, BlipSprite.RaceFinish);
        }
    }

    public hide() {
        if (this.handle) {
            DeleteCheckpoint(this.handle);
        }
        if (this.blipHandle) {
            RemoveBlip(this.blipHandle);
        }
        if (this.nextBlipHandle) {
            RemoveBlip(this.nextBlipHandle);
        }
    }

    private hasTarget(): boolean {
        const {x, y, z} = this.targetPosition;
        return !(x === 0 && y === 0 && z === 0);
    }
}
