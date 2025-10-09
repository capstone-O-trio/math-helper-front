import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Heading } from "../components/common/Heading";
import { Input } from "../components/common/Input";
import { Text } from "../components/common/Text";
import { TextButton } from "../components/common/TextButton";
import { useCallback, useState } from "react";
import { postLogin } from "../api/login";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../utils/keys";

export const LoginPage: React.FC = () => {
  const naviagate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
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

    const loginDataForApi = {
      name: formData.name,
      password: formData.password,
    };

    try {
      const response = await postLogin(loginDataForApi);
      //토큰 로컬스토리지에 저장
      localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
      alert("로그인이 완료되었습니다. 업로드 페이지로 이동합니다.");

      naviagate("/upload");
    } catch (error) {
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    }

    setFormData({ name: "", password: "" });
  };
  return (
    <form
      className="w-full h-full flex flex-col items-center"
      onSubmit={handleSubmit}
    >
      <div className="absolute top-4 w-full">
        <button
          type="button"
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
      </div>
      <div className="absolute bottom-8 right-10 flex flex-col gap-1 w-[208px]">
        <Button type="submit" disabled={!formData.name || !formData.password}>
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
    </form>
  );
};
