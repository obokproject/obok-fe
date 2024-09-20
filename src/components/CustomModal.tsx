// CustomModal.tsx
import React from "react";
import { Modal } from "react-bootstrap";

interface CustomModalProps {
  show: boolean;
  title: string;
  body: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string; // 확인 버튼 텍스트 커스터마이징 (옵션)
  cancelText?: string; // 취소 버튼 텍스트 커스터마이징 (옵션)
}

const CustomModal: React.FC<CustomModalProps> = ({
  show,
  title,
  body,
  onClose,
  onConfirm,
  confirmText = "확인",
  cancelText,
}) => {
  return (
    <Modal
      show={show}
      onHide={onClose}
      backdrop="static"
      keyboard={false}
      dialogClassName="modal-rounded"
    >
      <div className="rounded-xl overflow-hidden bg-white">
        <Modal.Header style={{ border: "none" }}>
          <Modal.Title className="font-bold ml-3">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer style={{ border: "none", justifyContent: "center" }}>
          {/* 취소 버튼은 cancelText가 있을 때만 렌더링 */}
          {cancelText && (
            <button
              onClick={onClose}
              className="m-1 w-[100px] rounded-full bg-gray-200 text-lg"
            >
              {cancelText}
            </button>
          )}
          <button
            className="w-[100px] rounded-full m-1 text-lg"
            onClick={onConfirm}
            style={{ backgroundColor: "#ffb561" }}
          >
            {confirmText}
          </button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default CustomModal;
