import { Button } from "components/common/Button";
import { Heading } from "components/common/Heading";
import { Text } from "components/common/Text";
import Modal from "react-modal";

type MODAL_PROPS = {
  isOpenModal: boolean;
  contentString: string;
  onTypeChecked: () => void;
  onTypeWrong: () => void;
};

const customModalStyles: ReactModal.Styles = {
  overlay: {
    backgroundColor: " rgba(0, 0, 0, 0.4)",
    width: "100%",
    height: "100vh",
    zIndex: "10",
    position: "fixed",
    top: "0",
    left: "0",
  },
  content: {
    width: "360px",
    height: "250px",
    zIndex: "150",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "10px",
    boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
    backgroundColor: "white",
    justifyContent: "center",
    overflow: "auto",
  },
};

export const TypeCheckModal = (modalProps: MODAL_PROPS) => (
  <Modal
    isOpen={modalProps.isOpenModal}
    contentLabel="Type Checking Modal"
    onRequestClose={modalProps.onTypeChecked}
    style={customModalStyles}
    appElement={document.getElementById("root")!}
    className=" p-4 flex flex-col gap-3"
  >
    <div className=" flex flex-col items-center justify-center">
      <Text>{"이 문제가 "}</Text>
      <Heading className=" font-normal">{modalProps.contentString}</Heading>
      <Text>{" 유형이 맞나요? "}</Text>
    </div>

    <div className="flex justify-center items-center w-full gap-2">
      <Button className=" font-normal text-lg" onClick={modalProps.onTypeChecked}>{"맞아요!"}</Button>
      <Button className=" font-normal text-lg" onClick={modalProps.onTypeWrong}>{"아니요ㅠ"}</Button>
    </div>
  </Modal>
);

export default TypeCheckModal;
