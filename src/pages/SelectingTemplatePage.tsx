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
    <>
      <div className="absolute top-6 w-full">
        <BackButton onClick={goBack} className="absolute left-8 top-1" />
        <Heading>{"풀이를 선택해봐yo!"}</Heading>
      </div>
      <div className="absolute top-20 left-1/2 -translate-x-1/2 flex gap-2">
        <Text>{"이 문제는"}</Text>
        <Text className="font-bold">{typeName}</Text>
        <Text>{"유형이에요."}</Text>
        <TextButton onClick={goBack}>{"아닌 것 같나요?!"}</TextButton>
      </div>
      <div className="h-full flex flex-col justify-center items-center">
        <div
          className={`
      w-[80%] max-w-[1100px] max-h-[80%] overflow-auto p-1
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
    </>
  );
};
