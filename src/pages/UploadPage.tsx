import { useState } from "react";
import { Button } from "../components/common/Button";
import { Heading } from "../components/common/Heading";

export const UploadPage: React.FC = () => {
  const [photo, setPhoto] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setPhoto(imageUrl);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="absolute top-4 w-full">
        <Heading>문제 업로드</Heading>
      </div>
      <div className="flex justify-center bg-green-100 rounded-3xl w-[50%] p-4 pb-7 pt-2 -m-6">
        사진 찍기 / 올리기
      </div>
      <div className="w-[70%] max-w-[644px] h-[50%] max-h-[482px] flex flex-col justify-center items-center bg-green-u rounded-3xl text-white">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleChange}
        />
        {photo && <img src={photo} alt="captured" />}
      </div>
      <Button className="fixed bottom-16 right-10 w-[208px]">
        문제 풀러 가기
      </Button>
    </div>
  );
};
