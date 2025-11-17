import { getTemplateList } from "api/template";
import { BackButton } from "components/common/BackButton";
import { Heading } from "components/common/Heading";
import { TemplateCard } from "components/selectTemplate/TemplateCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { templateInfoType } from "type/type";

const defaultList: templateInfoType[] = [
  {
    templateId: 0,
    templateName: "풀이 불가능!",
    isPossible: false,
    templateImage: "/asset/temExample.png",
  }
];

export const SelectingTemplatePage = () => {
  const navigate = useNavigate();
  const [temList, setTemList] = useState(defaultList);

  useEffect(() => {
    async function fetch() {
      const data = await getTemplateList("한자리수 덧셈");
      const temList: templateInfoType[] = data.result.templates;
      setTemList(temList);
    }
    fetch();
  }, []);

  return (
    <div className="h-full flex justify-center items-center">
      <div className="absolute top-4 w-full">
        <BackButton
          onClick={() => {
            navigate(-1);
          }}
          className="absolute left-8 top-1"
        />
        <Heading>풀이를 선택해봐!</Heading>
      </div>
      <div
        className={`
      w-[80%] max-w-[1100px] max-h-[75%] overflow-auto p-1
      ${
        temList.length >= 3
          ? "grid grid-cols-3 gap-9"
          : "flex items-center gap-6 w-full justify-center"
      }
    `}
      >
        {temList.map((template) => (
          <TemplateCard temInfo={template} />
        ))}
      </div>
    </div>
  );
};
