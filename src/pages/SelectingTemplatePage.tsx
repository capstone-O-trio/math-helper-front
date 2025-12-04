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
    templateName: "준비중..",
    isPossible: false,
    templateImage: "/asset/temExample.png",
    templateScript:
      "이 풀이는 준비중입니다!",
  },
];

export const SelectingTemplatePage = () => {
  const navigate = useNavigate();
  const [temList, setTemList] = useState(defaultList);

  const { mathId, typeName, typeScript } = useRecoilValue(mathTypeState);

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
      <div className="flex flex-col gap-2 justify-center items-center">
        <Text className="font-light max-w-[60%]">{typeScript}</Text>
        <TextButton onClick={goBack}>{"이 유형이 아닌 것 같나요?!"}</TextButton>
      </div>
      <div className="mt-10 h-[80%] max-h-[80%] flex flex-col items-center overflow-auto gap-5 p-5">
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
  );
};
