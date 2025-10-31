import { useLocation } from "react-router-dom";
import { probInfoType } from "../type/type";
import { HandTracker } from "../components/HandTracker";

export const HandTrackingPage: React.FC = () => {
  const location = useLocation();
  const { probInfo } = location.state as { probInfo: probInfoType | null };

  if (!probInfo) {
    return <div>문제 정보가 없습니다.</div>;
  }

  return (
    <div>
      <HandTracker
        mathId={probInfo.mathId}
        probType={probInfo.probType}
        entity={probInfo.entity}
        count1={probInfo.count1}
        count2={probInfo.count2}
        problem={probInfo.problem}
        answer={probInfo.answer}
        wrongAnswer={probInfo.wrongAnswer}
      />
    </div>
  );
};
