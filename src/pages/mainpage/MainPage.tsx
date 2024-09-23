import React, { useState, useEffect } from "react";
import { Container, Button, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useRoom } from "../../hooks/useRoom";
import CreateRoomModal from "../../components/CreateRoomModal";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import CustomModal from "../../components/CustomModal";

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const { rooms, fetchRooms, createRoom, loading, error } = useRoom(); // useRoom 훅을 통해 필요한 함수 및 상태 가져오기
  const [filter, setFilter] = useState<"all" | "chat" | "kanban">("all"); // 필터링 상태
  const [showCreateModal, setShowCreateModal] = useState(false); // 방 생성 모달 표시 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [roomsPerPage] = useState(9); // 페이지 당 방 개수 설정
  const [showFullModal, setShowFullModal] = useState<boolean>(false);

  // 컴포넌트가 마운트될 때 방 목록을 가져옴
  useEffect(() => {
    fetchRooms(); // API 호출을 통해 방 목록을 가져옴
  }, [fetchRooms]);

  // 방 목록 필터링
  const filteredRooms = rooms.filter(
    (room) => filter === "all" || room.type === filter
  );

  // 현재 페이지에 해당하는 방 목록 계산
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const totalPages = Math.max(
    Math.ceil(filteredRooms.length / roomsPerPage),
    1
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const calculateRemainingTime = (
    createdAt: string,
    duration: number
  ): number => {
    const now = new Date().getTime(); // 현재 시간을 밀리초로 반환
    const createdTime = new Date(createdAt).getTime(); // 생성 시간을 밀리초로 반환
    const endTime = createdTime + duration * 60000; // 종료 시간을 밀리초로 계산

    const remainingTimeInMinutes = Math.max(
      Math.floor((endTime - now) / 60000),
      0
    ); // 남은 시간을 분 단위로 계산
    return remainingTimeInMinutes;
  };

  // 방 생성 핸들러 함수
  const handleCreateRoom = async (roomData: any) => {
    console.log("Creating room with data:", roomData);
    try {
      const newRoomId = await createRoom(
        roomData.title, // 방 제목
        roomData.type, // 방 타입
        roomData.max_member, // 최대 인원
        roomData.duration, // 제한 시간
        roomData.keywords // 키워드
      );
      if (newRoomId) {
        setShowCreateModal(false);
        navigate(`/${roomData.type}/${newRoomId}`); // 생성된 방으로 이동
      }
    } catch (error) {
      console.error("Failed to create room:", error);
      // 추가적인 오류 메시지를 사용자에게 표시할 수 있음
    }
  };

  const handleJoinRoom = (room: {
    participants: number;
    max_member: number;
    type: any;
    uuid: any;
  }) => {
    if (room.participants >= room.max_member) {
      setShowFullModal(true); // 모달을 띄움
    } else {
      navigate(`/${room.type}/${room.uuid}`); // 방으로 이동
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center">
        <img src="https://a.top4top.net/p_1990j031.gif" alt="loading"></img>
      </div>
    ); // 로딩 중 표시
  if (error) return <div>Error: {error}</div>; // 에러 발생 시 표시

  return (
    <Container className="mt-[120px] font-sans">
      <div className="flex items-center text-[40px] font-[700]">
        <img
          src="/images/lightbulb.png"
          alt="light"
          style={{ height: "70px", width: "60px" }}
        ></img>
        베리 생각열매
      </div>
      <div className="mb-20 text-[32px] font-[400] ml-3">
        당신의 생각을 보여주세요.
      </div>
      <Row className="pl-[12px] items-center">
        <div className="flex items-center">
          <div>
            <Button
              variant={filter === "all" ? "primary" : "outline-primary"}
              onClick={() => {
                setFilter("all");
                setCurrentPage(1);
              }}
              className="me-3 text-[20px] font-[500] w-[60px] h-[41.334px] p-0"
              style={{
                backgroundColor: filter === "all" ? "#323232" : "#E9ECEF",
                borderColor: filter === "all" ? "#323232" : "#E9ECEF",
                color: filter === "all" ? "white" : "#323232",
                borderRadius: "30px",
              }}
            >
              전체
            </Button>
            <Button
              variant={filter === "chat" ? "primary" : "outline-primary"}
              onClick={() => {
                setFilter("chat");
                setCurrentPage(1);
              }}
              className="me-3 text-[20px] font-[500] p-0 h-fit"
              style={{
                backgroundColor: filter === "chat" ? "#FF8A8A" : "#E9ECEF",
                borderColor: filter === "chat" ? "#FF8A8A" : "#E9ECEF",
                color: filter === "chat" ? "#323232" : "#323232",
                borderRadius: "20px",
              }}
              data-bs-toggle="popover"
              data-bs-placement="top"
              title="브레인스토밍 채팅"
              data-bs-content="채팅"
            >
              <div className="w-[130px] p-3 h-[40px] flex gap-2 justify-center items-center">
                <img
                  src="/images/Vector.png"
                  alt="Vector"
                  className="w-[24px] h-[24px]"
                />
                베리 톡
              </div>
            </Button>{" "}
            <Button
              variant={filter === "kanban" ? "primary" : "outline-primary"}
              onClick={() => {
                setFilter("kanban");
                setCurrentPage(1);
              }}
              className="me-3 text-[20px] font-[500] p-0 h-fit"
              style={{
                backgroundColor: filter === "kanban" ? "#FFE27C" : "#E9ECEF",
                borderColor: filter === "kanban" ? "#FFE27C" : "#E9ECEF",
                color: filter === "kanban" ? "#323232" : "#323232",
                borderRadius: "20px",
              }}
              data-bs-toggle="popover"
              data-bs-placement="top"
              title="포스트잇 보드"
              data-bs-content="칸반보드 형태"
            >
              <div className="w-[130px] p-3 h-[40px] flex gap-2 justify-center items-center">
                <img
                  src="/images/layout-kanban.png"
                  alt="layout-kanban"
                  className="w-[24px] h-[24px]"
                />
                베리 보드
              </div>
            </Button>
          </div>
          <div className="flex flex-1"></div>
          <div className="flex w-fit right-0">
            <button
              className="text-[28px] font-[700] bg-[#FFB662] rounded-[30px] w-[160px] h-[56px] p-4 items-center flex"
              onClick={() => setShowCreateModal(true)}
            >
              만들기 十
            </button>
          </div>
        </div>
      </Row>
      <div className="flex justify-center items-center">
        <section className="bg-white w-[1400px] h-fit mt-10 pl-12 border-t-4 border-gray-300 pt-10 justify-center">
          {currentRooms.length > 0 ? (
            // 카드
            <div className="flex flex-wrap gap-x-6 gap-y-10 mb-4">
              {currentRooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-[18px] overflow-hidden flex flex-col justify-between"
                  style={{
                    width: "384px", // 한 줄에 3개의 카드를 고정
                    height: "216px", // 고정된 높이
                    boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <div className="pl-[16px] pr-[16px] pt-[8px] flex flex-col gap-2 relative">
                    <div className="text-[28px] font-[700] mb-2 flex flex-row justify-between items-center">
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap h-[42px] max-w-[300px]">
                        {room.title}
                      </div>

                      <div className="w-[24px] h-[24px]">
                        {room.type === "chat" ? (
                          <img
                            src="/images/Vector.png"
                            alt="Vector"
                            className="w-full"
                          />
                        ) : (
                          <img
                            src="/images/layout-kanban.png"
                            alt="layout-kanban"
                            className="w-full"
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-row justify-between items-center w-full mt-3 mb-2">
                      <div className="flex gap-1 text-[18px] font-[700] items-center">
                        <img
                          src="/images/crown-2.png"
                          alt="cronw-2"
                          className="w-full"
                          style={{ height: "20px", width: "20px" }}
                        />
                        {room.nickname}
                      </div>
                      <div className="font-[700] text-[18px] flex gap-1">
                        <img
                          src="/images/alarm.png"
                          alt="alarm"
                          className="w-full"
                          style={{ height: "24px", width: "24px" }}
                        />
                        <div>
                          남은 시간:{" "}
                          {calculateRemainingTime(
                            room.createdAt,
                            room.duration
                          )}
                          분
                        </div>
                      </div>
                    </div>
                    <div
                      className="pb-[8px] flex justify-between text-[14px] font-[400]"
                      style={{ minHeight: "24px" }}
                    >
                      <div className="flex-1">
                        {room.keywords
                          .map((keyword) => `#${keyword}`)
                          .join(" ")}
                      </div>
                      <div className="flex items-center text-[18px] font-[700] gap-2">
                        <img
                          src="/images/person.png"
                          alt="person"
                          style={{ height: "16px", width: "16px" }}
                        />
                        {room.participants}/{room.max_member}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`p-0 h-[42px] bottom-0 border-t-[1px] border-[#323232] ${
                      room.type === "chat" ? "bg-[#FF8A8A]" : "bg-[#FFE27C]"
                    }`}
                  >
                    <button
                      className={`w-full h-full bottom-0 right-0 left-0 p-0 font-[700] text-[18px] cursor-pointer ${
                        room.participants >= room.max_member
                          ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                          : room.type === "chat"
                          ? "bg-[#FF8A8A] text-[#323232]"
                          : "bg-[#FFE27C] text-[#323232]"
                      }`}
                      onClick={() => handleJoinRoom(room)}
                    >
                      참여하기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full flex justify-center mt-0">
              <p className="font-[30px] mt-[150px]">
                다들 생각중인가봐요...함께 새로운 주제로 대화해 볼까요?
              </p>
            </div>
          )}
        </section>
      </div>

      {/*페이지네이션*/}
      <section className="mt-[152px] mb-[130px]">
        <div className="flex justify-center items-center my-4">
          {/* 이전 버튼 */}
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full mx-2 ${
              currentPage === 1 ? "cursor-default" : "cursor-pointer"
            }`}
            style={{ pointerEvents: currentPage === 1 ? "none" : "auto" }}
          >
            <IoIosArrowBack />
          </button>

          {/* 페이지 번호 */}
          {[...Array(totalPages)].map((_, index) => {
            const pageIndex = index + 1;
            if (
              pageIndex === currentPage ||
              pageIndex === 1 ||
              pageIndex === totalPages ||
              pageIndex === currentPage - 1 ||
              pageIndex === currentPage + 1
            ) {
              return (
                <button
                  key={pageIndex}
                  onClick={() => paginate(pageIndex)}
                  className={`mx-1 px-3 py-1 text-[20px] ${
                    currentPage === pageIndex
                      ? "text-[#323232] font-bold"
                      : "text-gray-600"
                  }`}
                >
                  {pageIndex}
                </button>
              );
            } else if (
              pageIndex === currentPage - 2 ||
              pageIndex === currentPage + 2
            ) {
              return (
                <span
                  key={pageIndex}
                  className="mx-1 text-[20px] text-gray-600"
                >
                  ...
                </span>
              );
            }
            return null;
          })}

          {/* 다음 버튼 */}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full mx-2 ${
              currentPage === totalPages ? "cursor-default" : "cursor-pointer"
            }`}
            style={{
              pointerEvents: currentPage === totalPages ? "none" : "auto",
            }}
          >
            <IoIosArrowForward />
          </button>
        </div>
      </section>

      <CreateRoomModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onCreate={handleCreateRoom}
      />
      <CustomModal
        show={showFullModal}
        title="현재 방은 만석입니다."
        body=""
        onClose={() => setShowFullModal(false)} // 모달 닫기
        onConfirm={() => {
          setShowFullModal(false); // 모달 닫기
          window.location.reload(); // 새로고침
        }}
        confirmText="확인"
      />
    </Container>
  );
};

export default MainPage;
