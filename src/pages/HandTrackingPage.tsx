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
import { GridLoader } from "react-spinners";
import { Text } from "components/common/Text";
import { safeParse } from "utils/safeParser";
import { Heading } from "components/common/Heading";
import { TemplateCard } from "components/selectTemplate/TemplateCard";

export const HandTrackingPage: React.FC = () => {
  const navigate = useNavigate();

  const { mathId, templateInfo } = useRecoilValue(mathTemplateState);

  //type = solve or check
  const type = useParams().type;

  const [entityList, setEntityList] = useState();
  const [answerProps, setAnswerProps] = useState<MathProbSolveType>({
    probImage: "",
    answer: "",
    wrongList: [],
  });

  useEffect(() => {
    if (mathId === 0 || templateInfo.templateId === 0) {
      toast.error("템플릿을 불러오는데 에러가 발생했습니다. 다시 시도해주세요");
      navigate("/upload");
      return;
    }

    //템플릿 파라미터 가져오기
    async function getParams() {
      if (type !== "solve") return;
      try {
        const response = await postTemplateParam(
          mathId,
          templateInfo.templateId
        );
        let jsonResponse = safeParse(response.result.deploy);
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
          probImage: response.result.image,
          answer: response.result.answer,
          wrongList: [
            response.result.wrongAnswer1,
            response.result.wrongAnswer2 || "",
          ],
        });
      } catch (error) {
        alert(error);
      }
    }
    getAnswers();
  }, [mathId, navigate, templateInfo, type]);

  if (!entityList) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-4">
        <GridLoader
          color="#84E1BC"
          loading
          size={25}
          speedMultiplier={1.5}
        />
        <Text className=" font-normal mb-4">{"풀이 생성 중..."}</Text>
        <TemplateCard
          key={templateInfo.templateId}
          temInfo={templateInfo}
          mathId={mathId}
          forDisplay={true}
        />
      </div>
    );
  }

  if (type === "solve") {
    return (
      <div className="flex flex-col w-full h-full items-center">
        <Heading className="max-h-[6rem]">
          {"아래 풀이로 문제를 풀어보자!"}
        </Heading>
        <SolveTemContent
          templateId={templateInfo.templateId}
          entityList={entityList}
        />
      </div>
    );
  } else if (type === "check") {
    return (
      <div className="flex flex-col w-full h-full justify-center items-center">
        <Heading>{"이전 풀이를 바탕으로 정답을 맞춰보자!"}</Heading>
        <CheckTemContent
          probImage={answerProps?.probImage}
          answer={answerProps?.answer}
          wrongList={answerProps?.wrongList}
        />
      </div>
    );
  } else {
    return <div>잘못된 접근입니다.</div>;
  }
};
