import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import CustomModal from "./CustomModal";

interface Member {
  nickname: string;
  job: string;
  profile: string;
  role: "host" | "guest";
  deletedAt: string;
}
interface RoomInfoProps {
  uuid: string; // room uuid를 prop으로 받습니다.
  socket: Socket | null;
  members: Member[];
  isHost: boolean;
}

interface RoomData {
  title: string;
  user_id: number;
  member: number;
  maxMember: number;
  keywords: string[];
  duration: number; // 방 생성 시 설정한 제한 시간 (분)
  createdAt: Date;
  type: string;
  status: string;
  hostNickname: string; // 추가
  hostJob: string; // 추가
  hostProfileImage: string; // 추가
}

const RoomInfo: React.FC<RoomInfoProps> = ({
  uuid,
  socket,
  members,
  isHost,
}) => {
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false); // 나가기모달
  const [showRoomClosedModal, setShowRoomClosedModal] = useState(false); // 방 종료 모달 상태
  const [roomClosedMessage, setRoomClosedMessage] = useState(""); // 방 종료 메시지
  const [showExplainChatModal, setShowExplainChatModal] = useState(false);
  const [showExplainKanbanModal, setShowExplainKanbanModal] = useState(false);

  // 방 정보를 서버로부터 가져오는 useEffect
  useEffect(() => {
    if (socket) {
      socket.emit("getRoomInfo", uuid);

      const handleRoomInfo = (data: RoomData) => {
        setRoomData(data);

        // 방의 생성 시간과 남은 시간을 제대로 계산
        const now = new Date().getTime(); // 현재 시간 (밀리초)
        const createdAtTime = data.createdAt
          ? new Date(data.createdAt).getTime()
          : now; // 방 생성 시간 (밀리초)
        const totalDurationInSeconds = (data.duration || 0) * 60; // 제한 시간 (초)
        const elapsedTime = (now - createdAtTime) / 1000; // 방이 만들어진 후 경과된 시간 (초)

        const remainingTime = Math.max(totalDurationInSeconds - elapsedTime, 0);
        setTimeLeft(remainingTime); // 남은 시간 (초)
        if (remainingTime === 0) {
          setTimeLeft(0);
        }
      };

      socket.on("roomInfo", handleRoomInfo);
      socket.on("roomUpdated", () => socket.emit("getRoomInfo", uuid));

      return () => {
        socket.off("roomInfo", handleRoomInfo);
        socket.off("roomUpdated");
      };
    }
  }, [uuid, socket]);

  // 남은 시간을 1초마다 감소시키는 타이머
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0)); // 1초마다 시간 감소
      }, 1000);

      // 시스템 메시지를 보내는 로직 추가
      if (socket) {
        const roundedTimeLeft = Math.floor(timeLeft); // 소수점 제거
        let content = "";

        if (roundedTimeLeft === 300)
          content = "종료까지 시간이 5분 남았습니다.";
        else if (roundedTimeLeft === 180)
          content = "종료까지 시간이 3분 남았습니다.";
        else if (roundedTimeLeft === 60)
          content = "종료까지 시간이 1분 남았습니다.";
        else if (roundedTimeLeft === 30)
          content = "종료까지 시간이 30초 남았습니다.";
        else if (roundedTimeLeft === 0) content = "채팅이 종료되었습니다.";

        if (content) {
          socket.emit("message", { roomId: uuid, userId: 99999, content }); // 일반 메시지와 동일하게 전송

          // 1초 후 roomClosed 이벤트 전송
          if (roundedTimeLeft === 0) {
            setTimeout(() => {
              socket.emit("roomClosed", { roomId: uuid });
              console.log("Room closed event sent to the server.");
            }, 1000);
          }
        }
      }

      return () => clearInterval(timer); // 컴포넌트가 언마운트될 때 타이머 정리
    }
  }, [timeLeft, socket, uuid]);

  useEffect(() => {
    if (
      socket &&
      roomData &&
      roomData.status !== "open" &&
      members.length > 0
    ) {
      // 현재 호스트가 존재하는지 확인
      const hostExists = members.some(
        (member) => member.role === "host" && !member.deletedAt
      );

      // 호스트가 존재하지 않고 방 상태가 open이 아닐 때
      if (!hostExists) {
        console.log("Host is no longer present. Sending roomClosed event.");
        setTimeout(() => {
          socket.emit("roomClosed", { roomId: uuid });
          console.log("Room closed event sent to the server.");
        }, 1000); // 1초 지연 후 전송
      }
    }
  }, [members, roomData, socket, uuid]);

  // 서버에서 방이 닫혔다는 알림을 받았을 때 처리하는 useEffect 추가
  useEffect(() => {
    if (socket) {
      socket.on("serverRoomClosed", (data) => {
        setRoomClosedMessage(data.message); // 서버에서 받은 메시지를 설정
        setShowRoomClosedModal(true); // 방 종료 모달을 띄우기
      });

      return () => {
        socket.off("serverRoomClosed");
      };
    }
  }, [socket, navigate]);

  // 남은 시간을 분과 초로 변환하는 함수
  const formatTimeLeft = (seconds: number): string => {
    // 만약 시간이 0보다 작으면 0으로 고정
    if (seconds < 0) {
      seconds = 0;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}분 ${
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
    }초`;
  };

  // 나가기 버튼 클릭 핸들러
  const handleLeaveRoom = () => {
    setShowExitModal(true); // 모달을 열기
  };

  // 모달에서 확인을 눌렀을 때 실행되는 핸들러
  const handleConfirmLeave = () => {
    setShowExitModal(false); // 모달을 닫고 나가기 처리
    navigate("/main");
    setTimeout(() => {
      window.location.reload(); // 페이지 새로고침
    }, 100);
  };

  // 모달에서 확인 버튼을 눌렀을 때 방 닫기 처리
  const handleRoomClosedConfirm = () => {
    setShowRoomClosedModal(false); // 모달을 닫고
    navigate("/main"); // 메인 페이지로 리디렉션
  };

  // 도움말버튼눌렀을때 칸반보드와 챗보드 따로 처리
  const handleHelpClick = () => {
    if (roomData?.type === "kanban") {
      setShowExplainKanbanModal(true);
    } else {
      setShowExplainChatModal(true);
    }
  };

  // roomData가 null이면 로딩 상태를 표시
  if (!roomData) {
    return <div>Loading...</div>;
  }
  const currentMember = isHost
    ? members.find((m) => m.role === "host")
    : members[0];

  return (
    <>
      <div className="flex justify-between items-start p-[10px] rounded-[20px]">
        {/* 왼쪽 섹션: 방 제목, 호스트 정보 */}
        <div className="flex flex-col">
          <div className="flex items-center gap-[12px] pl-[10px]">
            <img
              src="/images/Union.png"
              alt="union"
              className="w-[24px] h-[24px] object-contain scale-125"
            />
            <h2 className="text-[#323232] text-[24px] font-bold leading-[36px] mt-1 font-['Noto Sans KR']">
              {roomData.title}
            </h2>
          </div>

          {/* 현재 사용자 프로필, 닉네임, 직업 정보 */}
          {currentMember && (
            <div className="flex items-center gap-[8px] mt-[10px]">
              <div className="w-[40px] h-[40px] relative">
                <img
                  src={roomData.hostProfileImage || "/images/user-profile.png"}
                  alt="profile"
                  className="w-full h-full rounded-full object-cover"
                />
                <img
                  src="/images/crown.png"
                  className="w-[16px] h-[16px] absolute -top-1 -right-1"
                  alt="Crown"
                />
              </div>
              <div className="w-[160px]">
                <div className="text-[16px] font-semibold text-[#323232] font-['Pretendard']">
                  {roomData.hostNickname}
                </div>
                <div
                  className={`text-[16px] font-semibold font-['Pretendard'] ${
                    roomData.type === "kanban"
                      ? "text-[#AF7606]"
                      : "text-[#A6046D]"
                  }`}
                >
                  {roomData.hostJob}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 중앙 섹션: 참여자 수, 남은 시간 */}
        <div className="flex flex-col items-start gap-[25px] pt-2">
          {/*  참여자 수 */}
          <div className="flex items-center gap-[8px]">
            <img
              src="/images/person.png"
              alt="person"
              className="w-[24px] h-[24px]"
            />
            <span className="text-[16px] font-bold text-[#323232] font-['Noto Sans KR']">
              {roomData.member}/{roomData.maxMember}
            </span>
          </div>

          {/* 남은 시간 */}
          <div className="flex items-center gap-[8px] ">
            <img
              src="/images/alarm.png"
              alt="alarm"
              className="w-[24px] h-[24px]"
            />
            <span className="text-[16px] font-bold text-[#323232] font-['Noto Sans KR']">
              {formatTimeLeft(timeLeft)}
            </span>
          </div>
        </div>

        {/* 방의 키워드 섹션 */}
        <div className="flex items-start gap-[10px] pt-2">
          {/* 아이콘 */}
          <div className="flex-shrink-0">
            <img
              src="/images/tags.png"
              alt="tags"
              className="w-[24px] h-[24px]"
            />
          </div>

          {/* 키워드 리스트 */}
          <div className="flex flex-col">
            {roomData.keywords.map((keyword, index) => (
              <span
                key={index}
                className="block text-[#323232] text-[16px] font-medium leading-[22.4px] font-['Noto Sans KR']"
              >
                #{keyword}
              </span>
            ))}
          </div>
        </div>

        {/* 오른쪽 섹션: 도움말, 나가기 버튼 */}
        <div className="flex flex-col gap-[10px] ">
          {/* 도움말 버튼 */}
          <button
            onClick={handleHelpClick}
            className={`w-full h-[32px] rounded-[30px] flex items-center justify-center m-2 ${
              roomData.type === "kanban" ? "bg-[#FFC107]" : "bg-[#E4606D]"
            }`}
          >
            <img
              src="/images/info-circle.png"
              alt="info"
              className="w-[16px] h-[16px]"
            />
            <span className="text-[#FCF8FC] text-[14px] font-bold font-['Pretendard'] m-1">
              도움말
            </span>
          </button>
          {/* 나가기 버튼 */}
          <button
            onClick={handleLeaveRoom}
            className={`w-full h-[32px] rounded-[30px] flex items-center justify-center m-2  ${
              roomData.type === "kanban" ? "bg-[#FFC107]" : "bg-[#E4606D]"
            }`}
          >
            <img
              src="/images/Logout.png"
              alt="logout"
              className="w-[16px] h-[16px]"
            />
            <span className="text-[#FCF8FC] text-[14px] font-bold font-['Pretendard'] m-1">
              나가기
            </span>
          </button>
        </div>
      </div>

      {/* 칸반 도움말 모달 */}
      {showExplainKanbanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[50px] p-10 min-w-md w-[600px]">
            <div className="mb-4 whitespace-pre-wrap">
              {`방장은 아이디어 카드를 드래그 앤 드랍해서 원하는 섹션으로 옮길 수 있습니다.

아이디어 카드는 한번에 3개까지만 만들 수 있어요!
4개넘게 만들기 위해선 방장이 카드를 옮겨줘야 합니다.

한 섹션에는 최대 20개까지의 카드만 있을 수 있습니다.`}
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setShowExplainKanbanModal(false)}
                className="w-[100px] rounded-full py-2 text-lg bg-[#ffb662] text-[#323232]"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 채팅 도움말 모달 */}
      {showExplainChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[50px] p-10 min-w-md w-[600px]">
            <div className="mb-4 whitespace-pre-wrap">
              {`# 를 써서 키워드를 생성 할 수 있습니다.
(예시: #키워드)

생성된 키워드는 키워드 색인창에 등록되고
등록된 키워드를 클릭해서 해당 키워드가 포함된 본문으로 이동 할 수 있습니다.
(중복 키워드 등록은 안돼요!)

생성된 키워드는 방장이 임의로 삭제 할 수 있습니다.
복구는 되지 않으니 신중하게!`}
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setShowExplainChatModal(false)}
                className="w-[100px] rounded-full py-2 text-lg bg-[#ffb662] text-[#323232]"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 나가기 모달 */}
      <CustomModal
        show={showExitModal}
        title="퇴장 하시겠습니까?"
        body="인원이 가득차면 재입장이 불가능 할 수 있습니다."
        onClose={() => setShowExitModal(false)} // 취소 버튼 클릭 시 모달 닫기
        onConfirm={handleConfirmLeave} // 확인 버튼 클릭 시 방 나가기 처리
        confirmText="확인"
        cancelText="취소"
      />

      {/* 방 종료 모달 - 취소 버튼 없이 확인 버튼만 */}
      <CustomModal
        show={showRoomClosedModal}
        title="방이 종료되었습니다"
        body={roomClosedMessage}
        onClose={handleRoomClosedConfirm} // 확인을 누르면 무조건 navigate
        onConfirm={handleRoomClosedConfirm} // 확인을 누르면 무조건 navigate
        confirmText="확인"
      />
    </>
  );
};

export default RoomInfo;
