import { Button } from "components/common/Button";
import Modal from "react-modal";

type MODAL_PROPS = {
  isOpenModal: boolean;
  templateId: number;
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

export const TutorialModal = (modalProps: MODAL_PROPS) => (
  <Modal
    isOpen={modalProps.isOpenModal}
    contentLabel="TutorialModal"
    onRequestClose={modalProps.onClose}
    style={customModalStyles}
    appElement={document.getElementById("root")!}
    className=" p-4 flex flex-col gap-3"
  >
    <div className=" flex flex-col items-center justify-center">
      <img src={`/asset/tutorial/tem${modalProps.templateId}.gif`} alt="tutorial" />
    </div>

    <div className="flex justify-center items-center w-full gap-2">
      <Button className=" font-normal text-lg" onClick={modalProps.onClose}>{"닫기"}</Button>
    </div>
  </Modal>
);

export default TutorialModal;