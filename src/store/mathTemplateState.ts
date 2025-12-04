import { atom } from "recoil";
import { templateInfoType } from "type/type";

export interface MathTemplateStateType {
  mathId: number;
  templateInfo: templateInfoType;
}

export const mathTemplateState = atom<MathTemplateStateType>({
  key: "mathTemplateState",
  default: {
    mathId: 0,
    templateInfo: {
      templateId: 0,
      templateName: "",
      templateScript: "",
      isPossible: true,
      templateImage: "",
    },
  },
});
