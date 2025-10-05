import { Button } from "../components/common/Botton";
import { TextButton } from "../components/common/TextButton";

export const OnboardingPage: React.FC = () => {
  return (
    <div>
      Onboarding Page
      <Button>I am Buttton!!</Button>
      <Button disabled>I am Not Buttton!!</Button>
      <TextButton>Text button</TextButton>
    </div>
  );
};
