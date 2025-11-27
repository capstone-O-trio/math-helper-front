declare namespace WaterComparision {
    export type ObjectKind = "cupA" | "cupB" | "other" | "fillRatio";

    export interface WaterState {
        capacity: number;
        volume: number;
        innerWidth: number;
        innerHeight: number;
        tiltStartRad?: number;
        tiltMaxRad?: number;
        maxFlowPerSec?: number;
    }

    export interface SceneObject {
        id: string;
        kind: ObjectKind;
        x: number;
        y: number;
        width: number;
        height: number;
        rotation?: number;
        src: string;
        isObj?: boolean;
        value?: number;
        water?: WaterState;
    }

    export interface WaterMeta {
        capacity: number;
        volume: number;
        innerWidth: number;
        innerHeight: number;
        tiltStartRad?: number;
        tiltMaxRad?: number;
        maxFlowPerSec?: number;
        role?: "source" | "target";
    }

    export interface StreamInfo {
        x: number;
        y: number;
        length: number;
        active: boolean;
        thickness: number;
    }

    export interface Entity {
    cupHeight: number;
    cupName: string;
    cupWidth: number;
    waterHeight: number;
  }
}
