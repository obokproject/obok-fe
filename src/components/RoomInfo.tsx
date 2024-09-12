import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

interface Member {
  nickname: string;
  job: string;
  profile: string;
  role: "host" | "guest";
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

      return () => clearInterval(timer); // 컴포넌트가 언마운트될 때 타이머 정리
    }
  }, [timeLeft]);

  // 남은 시간을 분과 초로 변환하는 함수
  const formatTimeLeft = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}분 ${
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
    }초`;
  };

  const handleLeaveRoom = () => {
    const confirmed = window.confirm("채팅방을 나가시겠습니까?");
    if (confirmed) {
      navigate("/main");
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
    <div
      className={`flex justify-between gap-0 items-start p-[10px] pl-[10px] rounded-[20px] ${
        roomData.type === "kanban" ? "bg-[#fffcef]" : "bg-white"
      }`}
    >
      {/* 1행 1열: 방의 제목 섹션 */}
      <div className="flex flex-col h-full">
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

        {/* 1행 2열: 현재 사용자 프로필, 닉네임, 직업 정보 */}
        {currentMember && (
          <div className="flex items-center gap-[8px] mt-[10px]">
            <div className="w-[40px] h-[40px] relative">
              <img
                src={currentMember.profile || "/images/user-profile.png"}
                alt="profile"
                className="w-full h-full rounded-full object-cover"
              />
              {isHost && (
                <img
                  src="/images/crown.png"
                  className="w-[16px] h-[16px] absolute -top-1 -right-1"
                  alt="Crown"
                />
              )}
            </div>
            <div className="w-[160px]">
              <div className="text-[16px] font-semibold text-[#323232] font-['Pretendard']">
                {currentMember.nickname}
              </div>
              <div
                className={`text-[16px] font-semibold font-['Pretendard'] ${
                  roomData.type === "kanban"
                    ? "text-[#AF7606]"
                    : "text-[#A6046D]"
                }`}
              >
                {currentMember.job}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 1행 2열 */}
      <div className="flex flex-col items-start h-full gap-[25px] pt-2">
        {/* 1행 2열 1행: 참여자 수 */}
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

        {/* 1행 2열 2행: 남은 시간 */}
        <div className="flex items-center gap-[8px] mt-[10px]">
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

      {/* 1행 3열: 방의 키워드 섹션 */}
      <div className="flex items-start gap-[10px] h-full pt-2">
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

      {/* 1행 4열: 나가기 버튼 */}
      <div className="flex flex-col justify-end h-full mr-[10px]">
        <div className="w-[100px] p-[8px] mt-[50px]">
          <button
            onClick={handleLeaveRoom}
            className={`w-full h-[32px] rounded-[30px] flex items-center justify-center gap-[5px] ${
              roomData.type === "kanban" ? "bg-[#FFC107]" : "bg-[#E4606D]"
            }`}
          >
            <img
              src="/images/Logout.png"
              alt="logout"
              className="w-[16px] h-[16px]"
            />
            <span className="text-[#FCF8FC] text-[14px] font-bold font-['Pretendard']">
              나가기
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomInfo;
