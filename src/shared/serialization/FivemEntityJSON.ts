import type { Quaternion } from "fivem-js/lib/utils/Quaternion";
import type { Vector3 } from "fivem-js/lib/utils/Vector3";

import { FivemJSONProperty } from "./FivemJSON";

export function isFivemEntityJSON(object: any): object is FivemEntityJSON {
    return typeof object?.Handle?.value === "number";
}
export interface FivemEntityJSON {
    [key: string]: FivemJSONProperty<any> | undefined;
    // AttachedBlip?: FivemJSONProperty<Blip>;
    // Bones?: FivemJSONProperty<EntityBoneCollection>;
    Handle?: FivemJSONProperty<number>;
    HasCollided?: FivemJSONProperty<boolean>;
    HasGravity?: FivemJSONProperty<boolean | null>;
    Heading?: FivemJSONProperty<number>;
    Health?: FivemJSONProperty<number>;
    HeightAboveGround?: FivemJSONProperty<number>;
    IsCollisionEnabled?: FivemJSONProperty<boolean>;
    IsInAir?: FivemJSONProperty<boolean>;
    IsInWater?: FivemJSONProperty<boolean>;
    IsInvincible?: FivemJSONProperty<boolean | null>;
    IsOccluded?: FivemJSONProperty<boolean>;
    IsOnFire?: FivemJSONProperty<boolean>;
    IsOnScreen?: FivemJSONProperty<boolean>;
    IsOnlyDamagedByPlayer?: FivemJSONProperty<boolean | null>;
    IsPersistent?: FivemJSONProperty<boolean>;
    IsPositionFrozen?: FivemJSONProperty<boolean | null>;
    IsRecordingCollisions?: FivemJSONProperty<boolean | null>;
    IsUpright?: FivemJSONProperty<boolean>;
    IsUpsideDown?: FivemJSONProperty<boolean>;
    IsVisible?: FivemJSONProperty<boolean>;
    LodDistance?: FivemJSONProperty<number>;
    MaxHealth?: FivemJSONProperty<number>;
    MaxSpeed?: FivemJSONProperty<number | null>;
    // Model?: FivemJSONProperty<Model>;
    NetworkId?: FivemJSONProperty<number>;
    Opacity?: FivemJSONProperty<number>;
    Position?: FivemJSONProperty<Vector3>;
    PositionNoOffset?: FivemJSONProperty<Vector3 | null>;
    Quaternion?: FivemJSONProperty<Quaternion>;
    Rotation?: FivemJSONProperty<Vector3>;
    RotationVelocity?: FivemJSONProperty<Vector3>;
    SubmersionLevel?: FivemJSONProperty<number>;
    Velocity?: FivemJSONProperty<Vector3>;
}
