import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

interface RoomInfoProps {
  uuid: string; // room uuid를 prop으로 받습니다.
  socket: Socket | null;
}

interface RoomData {
  title: string;
  user_id: number;
  creator: {
    name: string;
    job: string;
    profile_image: string;
  };
  member: number;
  maxMember: number;
  keywords: string[];
  duration: number; // 방 생성 시 설정한 제한 시간 (분)
  createAt: Date;
  type: string;
}

const RoomInfo: React.FC<RoomInfoProps> = ({ uuid, socket }) => {
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

  return (
    <div className="flex max-h-[120px]">
      <div className="flex-grow flex flex-col">
        {/* 첫 번째 행: 주제, 참여자, 키워드 */}
        <div className="flex justify-between gap-[96px] mb-2">
          <h2 className="flex items-center gap-3 text-[24px] font-bold text-[#323232]">
            <img src="/images/Union.png" alt="union" className="w-6" />
            주제: {roomData.title}
          </h2>

          <div className="flex items-center text-[16px] font-bold text-[#323232]">
            <img src="/images/person.png" alt="person" className="mr-2" />
            참여자: {roomData.member}/{roomData.maxMember}
          </div>

          <div className="flex flex-wrap items-center">
            <img src="/images/tags.png" alt="tags" className="mr-2" />
            {roomData.keywords.map((keyword, index) => (
              <span
                key={index}
                className=" text-[#323232] px-2 py-1 mr-2 mb-2 text-[16px] font-bold"
              >
                #{keyword}
              </span>
            ))}
          </div>
        </div>

        {/* 두 번째 행: 주최자, 남은 시간 */}
        <div className="flex gap-[104px] items-center">
          <div className="flex items-center ">
            <div className="w-[83px] h-10 relative mr-2">
              <img
                src={roomData.creator.profile_image || "/default-profile.png"}
                alt={roomData.creator.name}
                className="w-10 h-10 bg-gray-300 rounded-full"
              />
              <img
                src="/images/crown.png"
                className="w-[15px] h-[15px] absolute top-0 right-0"
                alt="Crown"
              />
            </div>
            <div>
              <div className="text-lg font-bold">{roomData.creator.name}</div>
              <div className="text-sm text-blue-500">
                {roomData.creator.job}
              </div>
            </div>
          </div>

          <div className="flex items-center text-[16px] font-bold text-[#323232]">
            <img src="/images/alarm.png" alt="alarm" className="mr-2" />
            남은 시간: {formatTimeLeft(timeLeft)}
          </div>
        </div>
      </div>

      {/* 나가기 버튼 열 */}
      <div className="flex items-center ml-4">
        <button
          onClick={handleLeaveRoom}
          className="bg-[#FFC107] rounded-full hover:bg-gray-300 focus:outline-none w-[84px] h-[32px] text-[14px] flex items-center justify-center"
        >
          <div className="flex flex-row items-center">
            <img
              src="/images/logout.png"
              alt="logout"
              className="w-[16px] h-[16px]"
            />
            <a className="text-[#FCF8FC]" style={{ textDecoration: "none" }}>
              나가기
            </a>
          </div>
        </button>
      </div>
    </div>
  );
};

export default RoomInfo;
