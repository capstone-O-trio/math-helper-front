import { useNavigate } from "react-router-dom";
import { Heading } from "../components/common/Heading";
import { Input } from "../components/common/Input";
import { Text } from "../components/common/Text";
import { Button } from "../components/common/Button";
import { useCallback, useState } from "react";
import { UserInfo } from "../api/type";
import { postSignup } from "../api/signup";
import { BackButton } from "../components/common/BackButton";

export const SignupPage: React.FC = () => {
  const naviagate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const signupDataForApi: UserInfo = {
      name: formData.name,
      password: formData.password,
    };

    try {
      // 회원가입 API 호출
      await postSignup(signupDataForApi);
      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      naviagate("/login");
    } catch (error) {
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    }

    setFormData({ name: "", password: "", passwordConfirm: "" });
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="absolute top-4 w-full">
        <BackButton
          onClick={() => {
            naviagate(-1);
          }}
          className="absolute left-8 top-1"
        />
        <Heading>회원가입</Heading>
      </div>
      <form
        className="w-[50%] h-full flex flex-col justify-center"
        onSubmit={handleSubmit}
      >
        <Text>아이디</Text>
        <Input
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
        />
        <Text className="mt-4">비밀번호</Text>
        <Input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        <Text className="mt-4">비밀번호 확인</Text>
        <Input
          name="passwordConfirm"
          type="password"
          value={formData.passwordConfirm}
          onChange={handleChange}
        />
        <Button
          type="submit"
          className="absolute bottom-16 right-10"
          disabled={
            !formData.name || !formData.password || !formData.passwordConfirm
          }
        >
          회원가입 완료
        </Button>
      </form>
    </div>
  );
};
