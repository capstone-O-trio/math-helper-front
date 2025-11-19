import Modal from "react-modal";

type MODAL_PROPS = {
  isOpenModal: boolean;
  contentString: string;
  onTypeChecked: () => void;
  onTypeWrong: () => void;
};

export const TypeCheckModal = (modalProps: MODAL_PROPS) => (
  <Modal
    isOpen={modalProps.isOpenModal}
    contentLabel="Type Checking"
    onRequestClose={modalProps.onTypeChecked}
  >
    <p>{modalProps.contentString}</p>
    <button onClick={modalProps.onTypeChecked}>{"넹 맞습니다!"}</button>
    <button onClick={modalProps.onTypeWrong}>{"아닌데요?"}</button>
  </Modal>
);

export default TypeCheckModal;
