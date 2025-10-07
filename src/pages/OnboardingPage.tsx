import React from "react";
import { Heading } from "../components/common/Heading";
import { Button } from "../components/common/Button";
import { TextButton } from "../components/common/TextButton";
import { useNavigate } from "react-router-dom";

export const OnboardingPage: React.FC = () => {
  const naviagate = useNavigate();
  return (
    <>
      <div className="w-full h-full flex items-center justify-center">
        <Heading>쏙수학</Heading>
      </div>
      <div className="absolute bottom-8 right-10 flex flex-col gap-1 w-[12rem]">
        <Button
          onClick={() => {
            naviagate("/login");
          }}
        >
          시작하기
        </Button>
        <TextButton
          onClick={() => {
            naviagate("/signup");
          }}
        >
          아직 계정이 없나요?
        </TextButton>
      </div>
    </>
  );
};
