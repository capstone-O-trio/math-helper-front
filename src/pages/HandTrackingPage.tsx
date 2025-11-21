import { useLocation, useNavigate } from "react-router-dom";
import { HandTracker } from "../features/handTracking/components/HandTracker";
import {
  mathProbInfoType,
  probEntityType,
} from "../features/handTracking/types/problemTypes";
import { useEffect } from "react";
import { postTemplateParam } from "api/template";
import { toast } from "react-toastify";

// 임시 데이터 -> 이후 수정해야 함
const entity1: probEntityType = {
  kind: "apple",
  count: 2,
  image: null,
};
const entity2: probEntityType = {
  kind: "apple",
  count: 6,
  image: null,
};

const DEFAULT_PROB_INFO: mathProbInfoType = {
  mathId: 0,
  probText: "2+3",
  answer: 8,
  probType: "addition",
  probTemplate: "appleAddition",
  entityList: [entity1, entity2],
};

export const HandTrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mathId = (location.state as { mathId?: number })?.mathId || 0;
  const templateId = (location.state as { templateId: number }).templateId || 0;

  useEffect(() => {
    if (mathId === 0 && templateId === 0) {
      toast.error("템플릿을 불러오는데 에러가 발생했습니다. 다시 시도해주세요");
      navigate(-1);
    }
    async function getParams() {
      const response = await postTemplateParam(mathId, templateId);
      console.log(response.result);
      try {
        const jsonResponse = JSON.parse(response.result);
        console.log(jsonResponse);
      } catch (error) {
        alert(error);
      }
    }
    getParams();
  }, [mathId, navigate, templateId]);

  //여기서 원래 handsTracker 컴포넌트 불러야함 근데 mathProbInfo에서 너무많은 정보를 모아서 넘김- > 리팩토링해야할듯.. 지금이렇게 api를 나눠놓은 의미가 없음
  return <div>dd</div>;
};
