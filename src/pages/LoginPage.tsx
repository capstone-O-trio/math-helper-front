import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Heading } from "../components/common/Heading";
import { Input } from "../components/common/Input";
import { Text } from "../components/common/Text";
import { TextButton } from "../components/common/TextButton";

export const LoginPage: React.FC = () => {
  const naviagate = useNavigate();
  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="absolute top-4 w-full">
        <button
          className="absolute left-8 top-1"
          onClick={() => {
            naviagate(-1);
          }}
        >
          이전
        </button>
        <Heading>로그인</Heading>
      </div>
      <div className="w-[50%] h-full flex flex-col justify-center">
        <Text>아이디</Text>
        <Input />
        <Text className="mt-4">비밀번호</Text>
        <Input />
      </div>
      <div className="absolute bottom-8 right-10 flex flex-col gap-1 w-[208px]">
        <Button
          onClick={() => {
            naviagate("/upload");
          }}
        >
          로그인완료
        </Button>
        <TextButton
          onClick={() => {
            naviagate("/signup");
          }}
        >
          아직 계정이 없나요?
        </TextButton>
      </div>
    </div>
  );
};
