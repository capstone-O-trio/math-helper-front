import { useLocation } from "react-router-dom";
import { HandTracker } from "../features/handTracking/components/HandTracker";
import { mathProbInfoType, probEntityType } from "../features/handTracking/types/problemTypes";

// 임시 데이터 -> 이후 수정해야 함
const entity1:probEntityType = {
  kind: "apple",
  count: 3,
  image: null
}
const entity2:probEntityType = {
  kind: "apple",
  count: 5,
  image: null
}

const DEFAULT_PROB_INFO: mathProbInfoType = {
  mathId:0,
  probText:"2+3",
  answer: 8,
  probType:"subtraction",
  probTemplate:"disappear",
  entityList: [entity1, entity2]
};

export const HandTrackingPage: React.FC = () => {
  const location = useLocation();
  const mathProbInfo: mathProbInfoType = (location.state as { mathProbInfo?: mathProbInfoType })?.mathProbInfo || DEFAULT_PROB_INFO;

  if (!mathProbInfo) {
    return <div>문제 정보가 없습니다.</div>;
  }

  return (
    <div>
      <HandTracker
        mathId={mathProbInfo.mathId}
        probText={mathProbInfo.probText}
        answer={mathProbInfo.answer}
        probType={mathProbInfo.probType}
        probTemplate={mathProbInfo.probTemplate}
        entityList={mathProbInfo.entityList}
      />
    </div>
  );
};
