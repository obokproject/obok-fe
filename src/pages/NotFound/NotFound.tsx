import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate("/"); // 버튼을 누르면 바로 홈으로 이동
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>404 - 페이지를 찾을 수 없습니다</h1>
      <p>잘못된 경로입니다. 홈으로 이동하려면 아래 버튼을 눌러주세요.</p>
      <button onClick={handleConfirm}>
        <div className="border-2 w-24 p-2 rounded-lg">이동</div>
      </button>
    </div>
  );
};

export default NotFound;
