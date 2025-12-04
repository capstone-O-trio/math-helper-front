import { getTemplateList } from "api/template";
import { BackButton } from "components/common/BackButton";
import { Heading } from "components/common/Heading";
import { Text } from "components/common/Text";
import { TextButton } from "components/common/TextButton";
import { TemplateCard } from "components/selectTemplate/TemplateCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { mathTypeState } from "store/mathTypeState";
import { templateInfoType } from "type/type";

const defaultList: templateInfoType[] = [
  {
    templateId: 0,
    templateName: "풀이 불가능!",
    isPossible: false,
    templateImage: "/asset/temExample.png",
    templateScript: "이 템플릿은 준비중입니다준비중입니다준비중입니다준비중입니다준비중입니다!",
  },
];

export const SelectingTemplatePage = () => {
  const navigate = useNavigate();
  const [temList, setTemList] = useState(defaultList);

  const { mathId, typeName } = useRecoilValue(mathTypeState);

  useEffect(() => {
    async function fetch() {
      const data = await getTemplateList(typeName);
      const temList: templateInfoType[] = data.result.templates;
      setTemList(temList);
    }
    fetch();
  }, [typeName]);

  const goBack = () => {
    navigate("/upload");
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="h-20">
        <BackButton onClick={goBack} className="absolute left-8 top-5" />
        <Heading>{"풀이를 선택해봐요!"}</Heading>
      </div>
      <div className="flex gap-2 justify-center items-center">
        <Text>{"이 문제는"}</Text>
        <Text className="font-bold">{typeName}</Text>
        <Text>{"유형이에요."}</Text>
        <TextButton onClick={goBack}>
          {"이 유형이 아닌 것 같나요?!"}
        </TextButton>
      </div>
      <div className="h-full flex flex-col justify-center items-center">
        <div
          className={`
      w-[80%] max-w-[1100px] h-full overflow-auto p-5
      ${
        temList.length >= 2
          ? "grid grid-cols-2 gap-3"
          : "flex items-center gap-6 w-full justify-center"
      }
      `}
        >
          {temList.length === 0 && <div>{"가능한 풀이가 없습니다."}</div>}
          {temList.map((template) => (
            <TemplateCard
              key={template.templateId}
              temInfo={template}
              mathId={mathId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
