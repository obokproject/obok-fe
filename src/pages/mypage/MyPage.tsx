import React, { useState, useRef } from "react";
import {
  Container,
  Form,
  Image,
  Row,
  Col,
  Tab,
  Tabs,
  Modal,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const MyPage: React.FC = () => {
  const [nickname, setNickname] = useState("");
  const [job, setJob] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  // 유효성 검사를 위한 상태 추가
  const [isNicknameValid, setIsNicknameValid] = useState(true);
  const [isJobValid, setIsJobValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);

  // 유효성 검사 함수
  const validateNickname = (value: string) => {
    const isValid = value.length >= 2 && value.length <= 20;
    setIsNicknameValid(isValid);
    return isValid;
  };

  const validateJob = (value: string) => {
    const isValid = value.length <= 12;
    setIsJobValid(isValid);
    return isValid;
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(value);
    setIsEmailValid(isValid);
    return isValid;
  };

  // TODO: 필요한가?
  // const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setNickname(event.target.value);
  //   validateNickname(event.target.value);
  // };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 3 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("이미지 크기는 3MB 이하여야 합니다.");
    }
  };

  const handleImageDelete = () => {
    setProfileImage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      validateNickname(nickname) &&
      validateJob(job) &&
      validateEmail(email)
    ) {
      setShowConfirmModal(true);
    }
  };

  const confirmSave = () => {
    try {
      //   // API 요청을 통해 사용자 정보를 저장하는 로직
      //   const response = await fetch("/api/users/me", {
      //     method: "PUT",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${localStorage.getItem("token")}`,
      //     },
      //     body: JSON.stringify({
      //       nickname,
      //       job,
      //       email,
      //       profileImage,
      //     }),
      //   });

      //   if (!response.ok) {
      //     throw new Error("HTTP error!");
      //   }

      //   const data = await response.json();
      //   console.log("사용자 정보가 성공적으로 저장되었습니다:", data);

      setShowConfirmModal(false);
      navigate("/"); // 이전 페이지로 이동
    } catch (error) {
      console.error("사용자 정보 저장 중 오류가 발생했습니다:", error);
      // 여기에 사용자에게 오류 메시지를 표시하는 로직을 추가할 수 있습니다.
    }
  };

  const handleLogout = async () => {
    try {
      await logout(); // AuthContext에서 제공하는 logout 함수를 호출합니다.
      navigate("/"); // 로그아웃 후 랜딩 페이지로 리다이렉트합니다.
    } catch (error) {
      console.error("로그아웃 중 오류가 발생했습니다:", error);
    }
  };

  return (
    <Container className="py-5">
      <h1
        className="mb-4 text-center"
        style={{ fontSize: "28px", fontWeight: "bold" }}
      >
        마이페이지
      </h1>
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => k && setActiveTab(k)}
        className="mb-4"
        style={{ paddingLeft: "50px" }}
      >
        <Tab eventKey="profile" title="프로필">
          <Row className="mb-4">
            <Col xs={12} md={6} className="text-center mb-4">
              <div
                style={{
                  width: "240px",
                  height: "240px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto 1rem",
                  position: "relative",
                }}
              >
                {profileImage ? (
                  <Image
                    src={profileImage}
                    roundedCircle
                    className=""
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                  />
                ) : (
                  <button
                    className="btn"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      fontSize: "42px",
                      fontWeight: "bold",
                      color: "#9F9F9F",
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                    }}
                  >
                    +
                  </button>
                )}
                <button
                  onClick={handleImageDelete}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src="/images/mypage-x-circle.png"
                    alt="Delete"
                    width="24"
                    height="24"
                  />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                  accept="image/jpeg, image/png"
                />
              </div>
            </Col>
            <Col xs={12} md={6}>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>
                    닉네임<span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="닉네임"
                    value={nickname}
                    onChange={(e) => {
                      setNickname(e.target.value);
                      validateNickname(e.target.value);
                    }}
                    maxLength={20}
                    isInvalid={!isNicknameValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    닉네임은 2~20자 사이여야 합니다.
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="mb-3">
                  <Form.Label>직업</Form.Label>
                  <div className="">
                    <Form.Control
                      type="text"
                      placeholder="직업"
                      value={job}
                      onChange={(e) => {
                        setJob(e.target.value);
                        validateJob(e.target.value);
                      }}
                      maxLength={12}
                      isInvalid={!isJobValid}
                    />
                    {!isJobValid && <span className="text-red">X</span>}
                  </div>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label>이메일</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      validateEmail(e.target.value);
                    }}
                    isInvalid={!isEmailValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    유효한 이메일 주소를 입력해주세요.
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex justify-content-end">
                  <button
                    onClick={handleSubmit}
                    className="w-[210px] h-[44px] font-bold rounded-full"
                    style={{ backgroundColor: "#ffb561" }}
                  >
                    정보 저장
                  </button>
                </div>
              </Form>
            </Col>
          </Row>
          <div className="text-center mt-5">
            <button
              className="w-[160px] h-[56px] font-bold rounded-full bg-gray-200"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </div>
        </Tab>
        <Tab eventKey="history" title="참여 내역">
          {/* 참여 내역 컨텐츠 */}
        </Tab>
      </Tabs>

      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-rounded"
      >
        <div className="rounded-xl overflow-hidden bg-white">
          <Modal.Header style={{ border: "none" }}>
            <Modal.Title className="font-bold ml-3 ">
              저장하시겠습니까?
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="">
            정보를 저장하고 이전페이지로 이동합니다.
          </Modal.Body>
          <Modal.Footer style={{ border: "none", justifyContent: "center" }}>
            <button
              onClick={() => setShowConfirmModal(false)}
              className="m-1 w-[100px] rounded-full bg-gray-200 text-lg"
            >
              취소
            </button>
            <button
              className="w-[100px] rounded-full m-1 text-lg"
              onClick={confirmSave}
              style={{ backgroundColor: "#ffb561" }}
            >
              확인
            </button>
          </Modal.Footer>
        </div>
      </Modal>
    </Container>
  );
};

export default MyPage;
