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

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isUpload, setIsUpload] = useState(false);

  const [uploadedProbInfo, setUploadedProbInfo] = useState<probInfoType | null>(
    null
  );

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
          setIsUpload(true);
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
      setIsUpload(false);
    }
  }, []);

  const handleUpload = async () => {
    const formdata = new FormData();
    if (!selectedFile) {
      alert("업로드할 사진을 선택해주세요.");
      return;
    }

    if (selectedFile) {
      formdata.append("imageFile", selectedFile);
    }

    try {
      const response = await postImgGetType(formdata);

      setUploadedProbInfo(response.result);
      setIsUpload(true);
    } catch (error) {
      alert("지원되지 않는 수학 문제 유형이야. 히히 미안해!");
      return;
    }
  };
  
  const setMathType = useSetRecoilState(mathTypeState);
  const navigateToNextPage = () => {
    if (uploadedProbInfo) {
      setMathType({mathId: uploadedProbInfo.mathId, typeName: uploadedProbInfo.mathTypeDto.type_name});
      navigate("/select-template");
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
              <Button
                className="text-lg font-light"
                disabled={isUpload}
                onClick={handleUpload}
              >
                {isUpload ? "문제 업로드 완료!" : "이 문제 업로드하기"}
              </Button>
            </div>
          )}
        </div>
      </div>
      <Button
        className="fixed bottom-16 right-10"
        disabled={!isUpload}
        onClick={navigateToNextPage}
      >
        풀이 선택 하기
      </Button>
    </div>
  );
};
