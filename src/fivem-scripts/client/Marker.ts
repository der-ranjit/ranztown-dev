import { MarkerType } from "fivem-js/lib/enums/MarkerType";
import { Color } from "fivem-js/lib/utils/Color";
import { Vector3 } from "fivem-js/lib/utils/Vector3";

export interface Marker {
    type: MarkerType,
    position: Vector3,
    direction: Vector3,
    rotation: Vector3,
    scale: Vector3,
    color: Color,
    bobUpAndDown?: boolean,
    faceCamera?: boolean,
    rotateY?: boolean,
    textureDict?: string,
    textureName?: string,
    drawOnEntity?: boolean
}
