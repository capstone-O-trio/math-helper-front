import { Button } from "components/common/Button";
import { Text } from "components/common/Text";
import Modal from "react-modal";

type MODAL_PROPS = {
  isOpenModal: boolean;
  comment: string;
  onClose: () => void;
};

const customModalStyles: ReactModal.Styles = {
  overlay: {
    backgroundColor: " rgba(0, 0, 0, 0.4)",
    width: "100%",
    height: "100vh",
    zIndex: "100",
    position: "fixed",
    top: "0",
    left: "0",
  },
  content: {
    width: "750px", 
    height: "500px",
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

export const CommentaryModal = (modalProps: MODAL_PROPS) => (
  <Modal
    isOpen={modalProps.isOpenModal}
    contentLabel="CommentaryModal"
    onRequestClose={modalProps.onClose}
    style={customModalStyles}
    appElement={document.getElementById("root")!}
    className=" p-4 h-[80%]"
  >
    <div className="flex flex-col gap-3 justify-center h-full">
      <div className=" flex flex-col items-center justify-center">
          <Text className=" font-extralight line-clamp-4 w-[60%] text-left">{modalProps.comment}</Text>   
      </div>

      <div className="absolute bottom-7 flex justify-center items-center w-full gap-2">
        <Text className=" font-thin">{"10초 후에 해설이 닫힙니다."}</Text>
        <Button className=" font-normal text-lg w-20" onClick={modalProps.onClose}>{"닫기"}</Button>
      </div>
    </div>
  </Modal>
);

export default CommentaryModal;