import { useLocation } from "react-router-dom";
import HandTracker from "../components/HandTracker";
import { probInfoType } from "../type/type";

export const HandTrackingPage: React.FC = () => {
  const location = useLocation();
  const { probInfo } = location.state as { probInfo: probInfoType | null };

  if (!probInfo) {
    return <div>문제 정보가 없습니다.</div>;
  }

  return (
    <div>
      {probInfo.entity}
      <HandTracker />
    </div>
  );
};
