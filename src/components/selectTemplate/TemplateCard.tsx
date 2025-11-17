import { Text } from "components/common/Text";
import { templateInfoType } from "type/type";

type TemplatePropsType = {
  temInfo: templateInfoType;
};

export const TemplateCard = ({ temInfo }: TemplatePropsType) => {
  return (
    <button className="relative w-full max-w-xs min-w-min h-64 shadow-md rounded-3xl flex flex-col justify-center items-center gap-3">
      <img
        src={temInfo.templateImage}
        alt="template img"
        className="w-[80%]"
      />
      {!temInfo.isPossible && (
        <div className="absolute inset-0 bg-[#E9E8EE]/50 rounded-3xl backdrop-blur-[1px] flex justify-center items-center">
          <img src="/asset/lock.png" alt="lock" className="w-16 opacity-100" />
        </div>
      )}
      <Text className=" font-normal">{temInfo.templateName}</Text>
    </button>
  );
};
