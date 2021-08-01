import { Vec3 } from "fivem-js/lib/utils/Vector3";

export interface Vector2 {
    x: number;
    y: number;
}

export function isVec3(value: any): value is Vec3 {
    return value != null && value !== undefined && typeof value.x === "number"
        && typeof value.y === "number"
        && typeof value.z === "number";
}
