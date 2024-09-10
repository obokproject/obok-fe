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
  createAt: Date;
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
        const createdAtTime = new Date(data.createAt).getTime(); // 방 생성 시간 (밀리초)
        const totalDurationInSeconds = data.duration * 60; // 제한 시간 (초)
        const elapsedTime = (now - createdAtTime) / 1000; // 방이 만들어진 후 경과된 시간 (초)

        const remainingTime = totalDurationInSeconds - elapsedTime; // 남은 시간 (초)

        if (remainingTime > 0) {
          setTimeLeft(remainingTime); // 남은 시간 설정
        } else {
          setTimeLeft(0); // 시간이 다 지나면 0으로 설정
        }
      };

      const handleRoomError = (error: any) => {
        console.error("Error fetching room data:", error);
      };

      socket.on("roomInfo", handleRoomInfo);
      socket.on("roomError", handleRoomError);

      const refreshRoomInfo = () => {
        socket.emit("getRoomInfo", uuid); // 방 정보 다시 요청
      };

      socket.on("roomUpdated", refreshRoomInfo); // 서버에서 roomUpdated 이벤트 수신

      return () => {
        socket.off("roomInfo", handleRoomInfo);
        socket.off("roomError", handleRoomError);
        socket.off("roomUpdated", refreshRoomInfo); // 이벤트 클린업
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
    <div className="flex justify-between items-end gap-[40px] p-[10px]">
      <div className="flex-grow flex flex-col gap-[5px]">
        {/* 첫 번째 행: 주제, 참여자, 키워드 (변경 없음) */}
        <div className="h-[48px] flex justify-between items-center">
          <div className="flex items-center gap-[12px]">
            <img
              src="/images/Union.png"
              alt="union"
              className="w-[18px] h-[24px] object-contain"
            />
            <h2 className="text-[#323232] text-[24px] font-bold leading-[36px] font-['Noto Sans KR']">
              {roomData.title}
            </h2>
          </div>
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
          <div className="flex items-center gap-[4px]">
            <img
              src="/images/tags.png"
              alt="tags"
              className="w-[24px] h-[24px]"
            />
            {roomData.keywords.map((keyword, index) => (
              <span
                key={index}
                className="text-[#323232] text-[16px] font-medium leading-[22.4px] font-['Noto Sans KR']"
              >
                #{keyword}
              </span>
            ))}
          </div>
        </div>
        {/* 두 번째 행: 현재 사용자 정보, 남은 시간 */}
        <div className="flex justify-start items-center gap-[104px]">
          {currentMember && (
            <div className="flex items-center gap-[8px]">
              <div className="w-[40px] h-[40px] relative">
                <img
                  src={currentMember.profile || "/default-profile.png"}
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
                <div className="text-[16px] font-semibold text-[#AF7606] font-['Pretendard']">
                  {currentMember.job}
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-[8px]">
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
      </div>

      {/* 나가기 버튼 */}
      <div className="w-[100px] p-[8px]">
        <button
          onClick={handleLeaveRoom}
          className="w-full h-[32px] bg-[#FFC107] rounded-[30px] flex items-center justify-center gap-[5px]"
        >
          <img
            src="/images/logout.png"
            alt="logout"
            className="w-[16px] h-[16px]"
          />
          <span className="text-[#FCF8FC] text-[14px] font-bold font-['Pretendard']">
            나가기
          </span>
        </button>
      </div>
    </div>
  );
};

export default RoomInfo;
