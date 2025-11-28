import { Text } from "components/common/Text";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";
import { mathTemplateState } from "store/mathTemplateState";
import { templateInfoType } from "type/type";

type TemplatePropsType = {
  temInfo: templateInfoType;
  mathId: number;
};

export const TemplateCard = ({ temInfo, mathId }: TemplatePropsType) => {
  const navigate = useNavigate();
  const setMathTemplate = useSetRecoilState(mathTemplateState);

  const handleClickTemplate = () => {
    // Recoil 전역변수 -  선택한 템플릿 정보 저장
    setMathTemplate({ mathId: mathId, templateId: temInfo.templateId });
    navigate("/hands-tracker/solve");
  };

  return (
    <button
      onClick={
        temInfo.isPossible
          ? handleClickTemplate
          : () => {
              toast("준비중인 템플릿입니다!");
            }
      }
      className="relative w-full max-w-xs min-w-min h-64 shadow-md rounded-3xl flex flex-col justify-center items-center gap-3"
    >
      <img src={temInfo.templateImage} alt="template img" className="w-[80%]" />
      {!temInfo.isPossible && (
        <div className="absolute inset-0 bg-[#E9E8EE]/50 rounded-3xl backdrop-blur-[1px] flex justify-center items-center">
          <img src="/asset/lock.png" alt="lock" className="w-16 opacity-100" />
        </div>
      )}
      <Text className=" font-normal">{temInfo.templateName}</Text>
    </button>
  );
};
