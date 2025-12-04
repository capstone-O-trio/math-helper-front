import { useCallback, useEffect, useState } from "react";
import { Button } from "../components/common/Button";
import { Heading } from "../components/common/Heading";
import { Text } from "../components/common/Text";
import { getNewMaths, postImgGetType } from "../api/upload";
import { probInfoType } from "../type/type";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN_KEY } from "../utils/keys";
import { useSetRecoilState } from "recoil";
import { mathTypeState } from "store/mathTypeState";
import { GridLoader } from "react-spinners";

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [uploadedProbInfo, setUploadedProbInfo] = useState<probInfoType | null>(
    null
  );
  const setMathType = useSetRecoilState(mathTypeState);

  useEffect(() => {
    const interval = setInterval(async () => {
      //엑세스토큰 없으면 로그인 페이지로 이동
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (!accessToken) {
        alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
        navigate("/login");
      } else {
        //새로운 문제 확인 api
        const response = await getNewMaths();

        if (selectedFile == null && response.result !== null) {
          setPreviewUrl(response.result.image);

          //new 문제 정보 저장
          setUploadedProbInfo(response.result);
        }
      }
    }, 3000); // 3초마다 요청

    return () => clearInterval(interval);
  }, [navigate, selectedFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);

      setPreviewUrl(imageUrl);
      setSelectedFile(file);
    }
  }, []);

  const handleNext = async () => {
    setIsLoading(true);
    try {
      // 1) 새 파일을 사용자가 선택한 경우 → 업로드 먼저
      if (selectedFile) {
        const formdata = new FormData();
        formdata.append("imageFile", selectedFile);

        try {
          const response = await postImgGetType(formdata);

          // 업로드 성공 → recoil 저장하고 페이지 이동
          if (response.result) {
            setMathType({
              mathId: response.result.mathId,
              typeName: response.result.mathTypeDto.type_name,
              typeScript: response.result.typeScript,
            });
            setIsLoading(false);
            navigate("/select-template");
            return;
          }
        } catch (err) {
          alert("지원되지 않는 문제야!");
          return;
        }
      }

      // 2) 새 파일은 없지만 서버에 기존 이미지 있음 → 그대로 진행
      if (uploadedProbInfo) {
        setMathType({
          mathId: uploadedProbInfo.mathId,
          typeName: uploadedProbInfo.mathTypeDto.type_name,
          typeScript: uploadedProbInfo.typeScript,
        });
        navigate("/select-template");
        return;
      }

      alert("사진을 선택하거나 기존 문제가 올 때까지 기다려줘!");
    } catch (error) {
      alert("업로드 중 오류가 발생했어!");
    } finally {
      // 에러든 정상 종료든 무조건 로딩 OFF
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="absolute top-4 w-full">
        <Heading>문제 업로드</Heading>
      </div>
      <div className="w-[70%] max-w-[644px] h-[50%] max-h-[482px] flex flex-col items-center">
        <Text className="mr-auto flex justify-center bg-green-u text-white text-opacity-90  font-normal text-xl rounded-2xl rounded-bl-none w-[50%] min-w-[11rem] p-4 pb-7 pt-2 -mb-6">
          사진 찍기 및 업로드
        </Text>
        <div className="w-full h-full flex flex-col justify-center items-center bg-green-u rounded-2xl text-white">
          <input
            type="file"
            id="photo-input"
            accept="image/*"
            capture="environment"
            onChange={handleChange}
            className="hidden"
          />
          <label
            htmlFor="photo-input"
            className="cursor-pointer underline text-lg"
          >
            파일 선택하기
          </label>
          {previewUrl && (
            <div className="w-full h-[90%] flex flex-col justify-center items-center gap-4">
              <img
                src={previewUrl}
                alt="captured"
                className="max-w-[70%] max-h-[70%]"
              />
            </div>
          )}
        </div>
        <Button
          className="text-lg font-light w-full mt-3"
          disabled={previewUrl === null}
          onClick={handleNext}
        >
          {"이 사진으로 문제 풀기"}
        </Button>
      </div>
      {isLoading && (
        <GridLoader
          color={"#057A55"}
          loading
          size={25}
          speedMultiplier={1.5}
          className="absolute left-1/2 top-[130px] z-20 transform -translate-x-1/2 -translate-y-1/2"
        />
      )}
    </div>
  );
};
