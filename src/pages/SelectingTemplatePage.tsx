import { BackButton } from "components/common/BackButton";
import { Heading } from "components/common/Heading";
import { TemplateCard } from "components/selectTemplate/TemplateCard";
import { useNavigate } from "react-router-dom";
import { templateInfoType } from "type/type";

const tem_list: templateInfoType[] = [
  {
    templateId: 0,
    templateName: "사과로 더해보기",
    templateImage: "/asset/temExample.png",
    isPossible: true,
  },
  {
    templateId: 1,
    templateName: "사과 나누기",
    templateImage: "/asset/temExample.png",
    isPossible: false,
  },
  {
    templateId: 2,
    templateName: "저울",
    templateImage: "/asset/temExample.png",
    isPossible: false,
  },
  {
    templateId: 4,
    templateName: "사과로 더해보기",
    templateImage: "/asset/temExample.png",
    isPossible: true,
  },
  {
    templateId: 2,
    templateName: "저울",
    templateImage: "/asset/temExample.png",
    isPossible: false,
  },
  {
    templateId: 4,
    templateName: "사과로 더해보기",
    templateImage: "/asset/temExample.png",
    isPossible: true,
  },
  {
    templateId: 2,
    templateName: "저울",
    templateImage: "/asset/temExample.png",
    isPossible: false,
  },
  {
    templateId: 4,
    templateName: "사과로 더해보기",
    templateImage: "/asset/temExample.png",
    isPossible: true,
  },
  {
    templateId: 2,
    templateName: "저울",
    templateImage: "/asset/temExample.png",
    isPossible: false,
  },
  {
    templateId: 4,
    templateName: "사과로 더해보기",
    templateImage: "/asset/temExample.png",
    isPossible: true,
  },
];

export const SelectingTemplatePage = () => {
  const navigate = useNavigate();
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
      <div className="grid grid-cols-3 gap-9 max-h-[75%] w-[80%] max-w-[1100px] overflow-scroll p-1">
        {tem_list.map((template) => (
          <TemplateCard temInfo={template} />
        ))}
      </div>
    </div>
  );
};
