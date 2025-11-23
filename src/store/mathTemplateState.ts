import { atom } from "recoil";

export interface MathTemplateStateType {
  mathId: number;
  templateId: number;
}

export const mathTemplateState = atom<MathTemplateStateType>({
  key: "mathTemplateState",
  default: {
    mathId: 0,
    templateId: 0,
  },
});
