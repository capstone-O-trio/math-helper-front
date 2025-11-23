import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { postTemplateParam } from "api/template";
import { CheckTemContent } from "features/handTracking/CheckTemContent";
import { SolveTemContent } from "features/handTracking/SolveTemContent";
import { getMathResult } from "api/upload";
import { MathProbSolveType } from "features/handTracking/types/problemTypes";
import { useRecoilValue } from "recoil";
import { mathTemplateState } from "store/mathTemplateState";

export const HandTrackingPage: React.FC = () => {
  const navigate = useNavigate();

  const { mathId, templateId } = useRecoilValue(mathTemplateState);

  //type = solve or check
  const type = useParams().type;

  const [entityList, setEntityList] = useState();
  const [answerProps, setAnswerProps] = useState<MathProbSolveType>({
    probImage: "",
    answer: "",
    wrongList: [],
  });

  useEffect(() => {
    if (mathId === 0 || templateId === 0) {
      toast.error("템플릿을 불러오는데 에러가 발생했습니다. 다시 시도해주세요");
      navigate("/upload");
      return;
    }

    //템플릿 파라미터 가져오기
    async function getParams() {
      if (type !== "solve") return;
      try {
        const response = await postTemplateParam(mathId, templateId);
        const jsonResponse = JSON.parse(response.result.deploy);
        setEntityList(jsonResponse);
      } catch (error) {
        alert(error);
      }
    }
    getParams();

    //정오답 결과 가져오기
    async function getAnswers() {
      if (type !== "check") return;
      try {
        const response = await getMathResult(mathId);
        if (!response) return;
        setAnswerProps({
          probImage: response.problemImage,
          answer: response.answer,
          wrongList: response.wrongAnswers,
        });
        console.log("정오답 결과: ", response.result);
      } catch (error) {
        alert(error);
      }
    }
    getAnswers();
  }, [mathId, navigate, templateId, type]);

  if (!entityList) {
    return <div>잠시만 기다려봐</div>;
  }

  if (type === "solve") {
    return <SolveTemContent templateId={templateId} entityList={entityList} />;
  } else if (type === "check") {
    //체크면 체크 가져오기
    return (
      <CheckTemContent
        probImage={answerProps?.probImage}
        answer={answerProps?.answer}
        wrongList={answerProps?.wrongList}
      />
    );
  } else {
    return <div>잘못된 접근입니다.</div>;
  }
};
