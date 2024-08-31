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
      <div className="flex items-center text-[40px] font-bold leading-[60px]">
        <img
          src="/images/mypage-pencil.png"
          alt="pencil"
          style={{ height: "40px", width: "40px" }}
        ></img>
        마이페이지
      </div>
      <div className="mb-20 text-[32px] font-[400] ml-3">
        당신을 알려주세요.
      </div>

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
                <div className="mb-3">
                  <Form.Label>
                    닉네임<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="">
                    <Form.Control
                      type="text"
                      placeholder={nickname}
                      value={nickname}
                      onChange={(e) => {
                        setNickname(e.target.value);
                        validateNickname(e.target.value);
                      }}
                      maxLength={20}
                      isInvalid={!isNicknameValid}
                    />
                  </div>
                </div>

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
                  </div>
                </div>

                <div className="mb-3">
                  <Form.Label>이메일</Form.Label>
                  <div className="">
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
                  </div>
                </div>

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
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">활동 내역</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">날짜</th>
                    <th className="px-4 py-2 text-left">형태</th>
                    <th className="px-4 py-2 text-left">방 제목</th>
                    <th className="px-4 py-2 text-left">참여인원</th>
                    <th className="px-4 py-2 text-left">시간 (분)</th>
                  </tr>
                </thead>
                <tbody>
                  {/*
                  // 사용자 정보 타입 정의 필요하고
                  // 활동내역 타입 정의 필요함
                  //사용자 정보과 활동내역 가져오는 함수 
                    interface UserInfo {
                    email: string;
                    profileImage: string;
                  }

                  // 활동 내역 타입 정의
                  interface Activity {
                    id: number;
                    activityDate: string;
                    activityType: '베리톡' | '베리보드';
                    roomTitle: string;
                    participants: number;
                    durationMinutes: number;
                  }

                    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
                    const [activities, setActivities] = useState<Activity[]>([]);
                    useEffect(() => {
                    setUserInfo({
                      email: 'user@example.com',
                          profileImage: '/api/placeholder/100/100'
                        });

                        setActivities([
                          { id: 1, activityDate: '2024-08-30 10:00', activityType: '베리톡', roomTitle: '아이디어 회의', participants: 5, durationMinutes: 60 },
                          { id: 2, activityDate: '2024-08-30 14:30', activityType: '베리보드', roomTitle: '프로젝트 기획', participants: 3, durationMinutes: 90 },
                          { id: 3, activityDate: '2024-08-31 09:15', activityType: '베리톡', roomTitle: '디자인 리뷰', participants: 4, durationMinutes: 45 },
                        ]);
                      }, []);
                    {activities.map((activity) => (
                    <tr key={activity.id} className="border-b">
                      <td className="px-4 py-2">{activity.activityDate}</td>
                      <td className="px-4 py-2">{activity.activityType}</td>
                      <td className="px-4 py-2">{activity.roomTitle}</td>
                      <td className="px-4 py-2">{activity.participants}</td>
                      <td className="px-4 py-2">{activity.durationMinutes}</td>
                    </tr>
                  ))} */}

                  <tr>
                    <td className="px-2">1</td>
                    <td className="px-2">2</td>
                    <td className="px-2">3</td>
                    <td className="px-2">4</td>
                    <td className="px-2">5</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
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
