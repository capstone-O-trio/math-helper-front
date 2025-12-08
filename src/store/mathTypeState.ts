import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export interface MathTypeStateType {
  mathId: number;
  typeName: string;
  typeScript?: string;
}

export const mathTypeState = atom<MathTypeStateType>({
  key: "mathTypeState",
  default: {
    mathId: 0,
    typeName: "",
    typeScript: "",
  },
  effects_UNSTABLE: [persistAtom],
});
