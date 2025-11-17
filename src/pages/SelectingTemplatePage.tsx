import { Button } from "components/common/Button";
import { Text } from "components/common/Text";
import { TemplateCard } from "components/selectTemplate/TemplateCard";

export type TEMPLATE_INFO = {
  id: number;
  templateName: string; //사과로 더해보기
  templateImage: string; //미리보기 이미지
  available: boolean; //이용 가능한지아닌지(구현?)
};

const tem_list: TEMPLATE_INFO[] = [
  {
    id: 0,
    templateName: "사과로 더해보기",
    templateImage: "미리보기 이미지",
    available: true,
  },
  {
    id: 1,
    templateName: "사과 나누기",
    templateImage: "미리보기 이미지",
    available: false,
  },
  {
    id: 2,
    templateName: "저울",
    templateImage: "미리보기 이미지",
    available: false,
  },
];

export const SelectingTemplatePage = () => {
  return (
    <div>
      <Text>풀이를 선택해봐!</Text>
      {tem_list.map((template) => {
        return <TemplateCard temInfo={template} />;
      })}
      <Button>문제 풀기</Button>
    </div>
  );
};
