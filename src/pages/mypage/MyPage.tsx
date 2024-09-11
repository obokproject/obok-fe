import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Form,
  Image,
  Row,
  Col,
  Tab,
  Tabs,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL || "";

// 활동 내역 타입 정의
interface Activity {
  id: number;
  title: string;
  type: "베리톡" | "베리보드";
  participants: number;
  date: string;
  entryTime: string;
}

const MyPage: React.FC = () => {
  const { user } = useAuth();
  const [nickname, setNickname] = useState("");
  const [job, setJob] = useState("");
  const [profile, setProfile] = useState<string | null>(user?.profile ?? null);

  const [activeTab, setActiveTab] = useState("profile");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  //활동내역 데이터 저장
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activities, setActivities] = useState<Activity[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [roomHistory, setRoomHistory] = useState<Activity[]>([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // 유효성 검사를 위한 상태 추가
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isNicknameValid, setIsNicknameValid] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isJobValid, setIsJobValid] = useState(true);

  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    setNickname(user?.nickname ?? "");
    setJob(user?.job ?? "");
    setProfile(user?.profile ?? null);
  }, [user]);

  // 컴포넌트 마운트 시 활동 내역 데이터 가져오기
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/auth/room-history`);
        setActivities(response.data);
        setRoomHistory(response.data); // roomHistory 상태도 업데이트
      } catch (err) {
        console.error("활동 내역을 불러오는데 실패했습니다:", err);
      }
    };

    fetchActivities();
  }, []);

  // 유효성 검사 함수
  const validateNickname = (value: string) => {
    const isValid = value.length >= 2 && value.length <= 10;
    setIsNicknameValid(isValid);
    return isValid;
  };

  const validateJob = (value: string) => {
    const isValid = value.length <= 12;
    setIsJobValid(isValid);
    return isValid;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 3 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(reader.result as string);
        console.log("업로드된 이미지 (base64):", reader.result); // base64 데이터 확인
      };
      reader.readAsDataURL(file);
    } else {
      alert("이미지 크기는 3MB 이하여야 합니다.");
    }
  };

  // 서버에 이미지 삭제 요청
  const handleImageDelete = () => {
    // try {
    //   const response = await fetch(`${apiUrl}/api/auth/profile-image`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ userId: user?.id }), // 현재 사용자 ID
    //   });

    //   if (!response.ok) {
    //     throw new Error("Failed to delete image");
    //   }

    //   // 서버 응답 확인
    //   const result = await response.json();

    //   if (result.success) {
    //     // 로컬 상태 업데이트
    //     setProfile(null);
    //     // 필요한 경우 사용자 정보 상태도 업데이트
    //     // setUser(prevUser => ({ ...prevUser, profileImage: null }));
    //   } else {
    //     throw new Error(result.message || "Failed to delete image");
    //   }
    // } catch (error) {
    //   console.error("Error deleting image:", error);
    //   // 사용자에게 에러 메시지 표시
    //   alert("이미지 삭제에 실패했습니다. 다시 시도해주세요.");
    // }
    setProfile(null);
    console.log("프로필상태 : ", profile);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateNickname(nickname) && validateJob(job)) {
      setShowConfirmModal(true);
    }
  };

  const confirmSave = async () => {
    if (validateNickname(nickname) && validateJob(job)) {
      try {
        let base64Image = profile;

        // 파일이 선택된 경우, FileReader로 base64 변환
        if (fileInputRef.current?.files?.[0]) {
          const file = fileInputRef.current.files[0];
          const reader = new FileReader();

          reader.onloadend = async () => {
            base64Image = reader.result as string; // base64로 변환된 이미지

            const payload = {
              id: user?.id,
              nickname,
              job,
              profile_image: base64Image, // base64로 변환된 이미지를 전송
            };

            console.log("전송할 데이터:", payload);

            const response = await fetch(`${apiUrl}/api/auth/update`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });

            if (!response.ok) {
              throw new Error("HTTP error!");
            }

            const data = await response.json();
            if (isMounted) {
              console.log("사용자 정보가 성공적으로 저장되었습니다:", data);
              setShowConfirmModal(false);
              navigate("/main");
              window.location.reload(); // 페이지 새로고침
            }
          };

          reader.readAsDataURL(file); // 파일을 base64로 변환
        } else {
          // 프로필 이미지가 없을 경우, 기존 profile 상태값으로 전송
          const payload = {
            id: user?.id,
            nickname,
            job,
            profile_image: base64Image, // 기존 base64 이미지 또는 null
          };

          console.log("전송할 데이터:", payload);

          const response = await fetch(`${apiUrl}/api/auth/update`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error("HTTP error!");
          }

          const data = await response.json();
          if (isMounted) {
            console.log("사용자 정보가 성공적으로 저장되었습니다:", data);
            setShowConfirmModal(false);
            navigate("/main");
            window.location.reload(); // 페이지 새로고침
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("사용자 정보 저장 중 오류가 발생했습니다:", error);
        }
      }
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
      {/* 마이페이지 제목 */}
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
        {/* 프로필 탭 */}
        <Tab eventKey="profile" title="프로필">
          <Row className="mb-4">
            <Col xs={12} md={6} className="text-center pt-[80px] pb-[80px]">
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
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  fileInputRef.current?.click(); // 클릭 시 파일 선택 창 열기
                }}
              >
                {profile ? (
                  <Image
                    src={profile}
                    roundedCircle
                    className=""
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <span
                    style={{
                      fontSize: "42px",
                      fontWeight: "bold",
                      color: "#9F9F9F",
                    }}
                  >
                    +
                  </span>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload} // 파일 선택 시 처리
                  style={{
                    opacity: 0, // 숨기기
                    position: "absolute", // 부모 안에 위치
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                  }}
                  accept="image/jpeg, image/png"
                  onClick={(e) => e.stopPropagation()} // 중복 호출 방지
                />

                {profile && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleImageDelete(); // 삭제 버튼 클릭 시 이미지 삭제
                    }}
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
                )}
              </div>
            </Col>
            <Col xs={12} md={6}>
              <Form>
                <div className="mb-3">
                  <Form.Label>
                    닉네임<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="">
                    <input
                      type="text"
                      placeholder="닉네임"
                      value={nickname}
                      onChange={(e) => {
                        if (e.target.value.length < 10) {
                          setNickname(e.target.value);
                          validateNickname(e.target.value);
                        }
                      }}
                      className={`form-control`}
                    />
                  </div>
                  <p>
                    한글 최대 10글자까지 입력가능합니다. 띄어쓰기, 특수문자
                    사용불가.
                  </p>
                </div>

                <div className="mb-3">
                  <Form.Label>직업</Form.Label>
                  <div className="">
                    <input
                      type="text"
                      placeholder="직업"
                      value={job}
                      onChange={(e) => {
                        setJob(e.target.value);
                        validateJob(e.target.value);
                      }}
                      maxLength={12}
                      className={`form-control`}
                    />
                  </div>
                  <p>
                    한글, 영어 사용가능 최대 8글자. 숫자, 특수문자 사용불가.
                  </p>
                </div>

                <div className="mb-3">
                  <Form.Label>이메일</Form.Label>
                  <div className="">
                    <Form.Control
                      type="email"
                      placeholder="example@email.com"
                      value={user?.email}
                      readOnly
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    onClick={handleSubmit}
                    className="w-[210px] h-[44px] font-bold rounded-full"
                    style={{ backgroundColor: "#ffb561" }}
                  >
                    저장
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
        {/* 활동 내역 탭 */}
        <Tab eventKey="history" title="활동 내역">
          <div className="bg-white h-[500px] shadow rounded-lg p-6">
            <div className="overflow-x-auto ">
              <table className="min-w-full border-collapse border border-gray-300 ">
                <thead>
                  <tr className="bg-gray-100 ">
                    <th className="px-4 py-2 text-center border border-gray-300">
                      방제목
                    </th>
                    <th className="px-4 py-2 text-center border border-gray-300">
                      종류
                    </th>
                    <th className="px-4 py-2 text-center border border-gray-300">
                      참여인원
                    </th>
                    <th className="px-4 py-2 text-center border border-gray-300">
                      날짜
                    </th>
                    <th className="px-4 py-2 text-center border border-gray-300">
                      입장시간
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* 활동 내역 데이터 매핑 */}
                  {roomHistory.length > 0 ? (
                    roomHistory.map((room, index) => (
                      <tr key={index} className="text-center">
                        <td className="px-2 py-2 border border-gray-300">
                          {room.title}
                        </td>
                        <td className="px-2 py-2 border border-gray-300">
                          {room.type}
                        </td>
                        <td className="px-2 py-2 border border-gray-300">
                          {room.participants}명
                        </td>
                        <td className="px-2 py-2 border border-gray-300">
                          {room.date}
                        </td>
                        <td className="px-2 py-2 border border-gray-300">
                          {room.entryTime}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        활동 내역이 없습니다.
                      </td>
                    </tr>
                  )}
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
