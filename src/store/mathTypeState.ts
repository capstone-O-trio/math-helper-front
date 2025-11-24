import { atom } from "recoil";

export interface MathTypeStateType {
    mathId: number;
    typeName: string;
}

export const mathTypeState = atom<MathTypeStateType>({
    key: "mathTypeState",
    default: {
        mathId:0,
        typeName: "",
    }
})