import { getTemplateList } from "api/template";
import { BackButton } from "components/common/BackButton";
import { Button } from "components/common/Button";
import { Heading } from "components/common/Heading";
import { Text } from "components/common/Text";
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

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="absolute top-6 w-full">
        <BackButton
          onClick={() => {
            navigate(-1);
          }}
          className="absolute left-8 top-1"
        />
        <Heading>{"풀이를 선택해봐!"}</Heading>
      </div>
      <div className="flex">
        <Text>{"이게 맞는 유형인가요? 모달여기로 옮기기"}</Text>
        <Button>{"아닌거같아요!"}</Button>
      </div>
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
  );
};
