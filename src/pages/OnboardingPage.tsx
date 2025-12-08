import React from "react";
import { Heading } from "../components/common/Heading";
import { Button } from "../components/common/Button";
import { TextButton } from "../components/common/TextButton";
import { useNavigate } from "react-router-dom";

export const OnboardingPage: React.FC = () => {
  const naviagate = useNavigate();
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <div className="flex flex-col gap-2 justify-center">
        <img src="/asset/Logo/logo.png" alt="Logo" />
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
    </div>
  );
};
