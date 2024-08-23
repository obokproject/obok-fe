import React from "react";
import { Link } from "react-router-dom";

interface LoginModalProps {
  isOpen: boolean;
  closeModal: () => void;
  loginWithGoogle: () => Promise<void>;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  closeModal,
  loginWithGoogle,
}) => {
  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex={-1}
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
    >
      <div
        className="modal-dialog modal-dialog-centered "
        role="document"
        style={{ width: "640px", maxWidth: "640px" }}
      >
        <div
          className="modal-content position-relative"
          style={{
            borderRadius: "50px",
            width: "100%",
            height: "216px",
            maxWidth: "none",
          }}
        >
          <button
            type="button"
            className="btn-close position-absolute"
            aria-label="Close"
            onClick={closeModal}
            style={{
              top: "10px",
              right: "20px",
              fontSize: "24px",
              cursor: "pointer",
              zIndex: 1,
            }}
          ></button>
          <div
            className="modal-body d-flex flex-column justify-content-center align-items-center"
            style={{ paddingTop: "20px" }}
          >
            <img
              src="/images/google-login-button.png"
              onClick={handleGoogleLogin}
              alt="google-login-button"
              style={{
                cursor: "pointer",
                height: "40px",
                marginBottom: "60px",
              }}
            />
            <p className="text-xs  text-muted">
              로그인함으로써 정책 및 약관에 동의합니다.
            </p>
            <div>
              <Link to="/terms" className="text-xs mx-2 text-muted ">
                서비스 이용약관
              </Link>
              <Link to="/privacy" className="text-xs mx-2 text-muted ">
                개인정보 처리방침
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
