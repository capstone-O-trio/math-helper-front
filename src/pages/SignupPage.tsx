import { useNavigate } from "react-router-dom";
import { Heading } from "../components/common/Heading";
import { Input } from "../components/common/Input";
import { Text } from "../components/common/Text";
import { Button } from "../components/common/Button";

export const SignupPage: React.FC = () => {
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
        <Heading>회원가입</Heading>
      </div>
      <div className="w-[50%] h-full flex flex-col justify-center">
        <Text>아이디</Text>
        <Input />
        <Text className="mt-4">비밀번호</Text>
        <Input />
        <Text className="mt-4">비밀번호 확인</Text>
        <Input />
      </div>
      <Button
        className="absolute bottom-16 right-10 w-[208px]"
        onClick={() => {
          naviagate("/login");
        }}
      >
        회원가입 완료
      </Button>
    </div>
  );
};
