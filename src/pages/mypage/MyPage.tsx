import React, { useState, useRef } from "react";
import {
  Container,
  Form,
  Button,
  Image,
  Row,
  Col,
  Tab,
  Tabs,
  Modal,
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

  const handleSubmit = () => {
    setShowConfirmModal(true);
  };

  const confirmSave = () => {
    // 여기에 저장 로직 구현
    setShowConfirmModal(false);
    // 메인 페이지로 이동 로직 구현
  };

  const handleLogout = async () => {
    try {
      await logout(); // AuthContext에서 제공하는 logout 함수를 호출합니다.
      navigate("/"); // 로그아웃 후 랜딩 페이지로 리다이렉트합니다.
    } catch (error) {
      console.error("로그아웃 중 오류가 발생했습니다:", error);
      // 여기에 사용자에게 오류 메시지를 표시하는 로직을 추가할 수 있습니다.
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
        className="mb-4 justify-content-center"
      >
        <Tab eventKey="profile" title="프로필">
          <Row className="mb-4">
            <Col xs={12} md={6} className="text-center mb-4">
              {profileImage ? (
                <Image
                  src={profileImage}
                  roundedCircle
                  width={240}
                  height={240}
                  className="mb-3 shadow"
                />
              ) : (
                <div
                  style={{
                    width: 240,
                    height: 240,
                    backgroundColor: "#f0f0f0",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "72px",
                    margin: "0 auto 1rem",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {nickname ? nickname.charAt(0) : "U"}
                </div>
              )}
              <div>
                <Button
                  variant="outline-primary"
                  onClick={() => fileInputRef.current?.click()}
                  className="me-2"
                >
                  사진 추가
                </Button>
                <Button variant="outline-danger" onClick={handleImageDelete}>
                  사진 삭제
                </Button>
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
                  <Form.Label>닉네임</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="닉네임"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={20}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>직업</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="직업"
                    value={job}
                    onChange={(e) => setJob(e.target.value)}
                    maxLength={12}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>이메일</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  className="w-100"
                >
                  정보 저장
                </Button>
              </Form>
            </Col>
          </Row>
          <div className="text-center mt-5">
            <Button variant="outline-secondary" onClick={handleLogout}>
              로그아웃
            </Button>
          </div>
        </Tab>
        <Tab eventKey="history" title="참여 내역">
          {/* 참여 내역 컨텐츠 */}
        </Tab>
      </Tabs>

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>정보를 저장하고 메인페이지로 이동합니다.</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            취소
          </Button>
          <Button variant="primary" onClick={confirmSave}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyPage;
