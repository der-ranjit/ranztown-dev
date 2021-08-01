import { Vector3 } from "fivem-js";

export interface Vector2 {
    x: number;
    y: number;
}

export class Vector3Ext extends Vector3 {
    public static addMultiple(...vectors: Vector3[]): Vector3 {
        if (vectors.length ===  0) {
            return new Vector3(0, 0, 0);
        }
        let result = Vector3.clone(vectors[0]);
        for (let i = 0; i < vectors.length; i++) {
            const nextVector = vectors[i + 1];
            if (nextVector) {
                result = Vector3.add(result, nextVector);
            }
        }
        return result;
    }
}
