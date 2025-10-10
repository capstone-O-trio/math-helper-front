import { useCallback, useState } from "react";
import { Button } from "../components/common/Button";
import { Heading } from "../components/common/Heading";
import { Text } from "../components/common/Text";
import { postUpload } from "../api/upload";

export const UploadPage: React.FC = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUpload, setIsUpload] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);

      setPreviewUrl(imageUrl);
      setSelectedFile(file);
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
      const response = await postUpload(formdata);
      console.log("Upload successful:", response);
      setIsUpload(true);

      // 새로 받아온 이미지 URL로 previewUrl 업데이트
      //setPreviewUrl(response.result.image);
      //console.log(response.result.image);
      //만약 계속인터발로 받아오면 previewUrl 자동으로 바뀌니까 이거 안해도될듯

      //여기서 response에서 문제 관련 넘겨줄 값들 저장해놓고 -> handsTracking 인자로 넘기기
      //아냐 여기서 받는게 아니라 위에서 그냥 계속 받아야함
    } catch (error) {
      console.error("Upload failed:", error);
      alert("문제 업로드에 실패했습니다. 다시 시도해주세요.");
      return;
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
      <Button className="fixed bottom-16 right-10" disabled={!isUpload}>
        문제 풀러 가기
      </Button>
    </div>
  );
};
