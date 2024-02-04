export type Vector2 = [number, number]
export type Vector3 = [number, number, number]
export type Vector4 = [number, number, number, number]

export const toVector3Object = (vector: Vector3 | Vector4) => {
    return {
        x: vector[0],
        y: vector[1],
        z: vector[2]
    }
}

export const toVector4Object = (vector: Vector4) => {
    return {
        x: vector[0],
        y: vector[1],
        z: vector[2],
        w: vector[3],
    };
};

export const toVectorNorm = (vector: Vector3) => {
    return Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2]);
};

export const multVector3 = (vector: Vector3, value: number): Vector3 => {
    return [vector[0] * value, vector[1] * value, vector[2] * value];
};

export const mult2Vector3 = (vector1: Vector3, vector2: Vector3): Vector3 => {
    return [vector1[0] * vector2[0], vector1[1] * vector2[1], vector1[2] * vector2[2]];
};

export const addVector3 = (vector: Vector3, value: number): Vector3 => {
    return [vector[0] + value, vector[1] + value, vector[2] + value];
};

export const add2Vector3 = (vector1: Vector3, vector2: Vector3): Vector3 => {
    return [vector1[0] + vector2[0], vector1[1] + vector2[1], vector1[2] + vector2[2]];
};

export const fromVector3Object = ({ x, y, z }: { x: number; y: number; z: number }): Vector3 => {
    return [x, y, z];
};

export const fromVector4Object = ({ x, y, z, w }: { x: number; y: number; z: number; w: number }): Vector4 => {
    return [x, y, z, w];
};