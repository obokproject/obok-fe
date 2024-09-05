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
    <div className="bg-white p-4 rounded-lg shadow-md m-1 mb-4 border border-black">
      <div className="flex flex-wrap justify-between items-start">
        {/* 주제 및 제안자 정보 */}
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
          <h2 className="text-xl font-bold mb-2">주제: {roomData.title}</h2>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-300 rounded-full mr-2 relative">
              <img
                src={roomData.creator.profile_image || "default-profile.png"}
                alt={roomData.creator.name}
                className="w-10 h-10 bg-gray-300 rounded-full mr-2"
              />
              <img
                src="/images/crown.png"
                className="w-[15px] h-[15px] bg-opacity-100 absolute top-0 right-0"
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
        </div>

        {/* 참여자 및 시간 정보 */}
        <div className="flex flex-col items-center w-1/3 text-center">
          <div className="text-sm text-gray-500 mb-2">
            참여자: {roomData.member}/{roomData.maxMember}
          </div>

          <div className="text-xl text-gray-500 mt-2">
            남은 시간: {formatTimeLeft(timeLeft)}
          </div>
        </div>

        {/* 키워드 정보 및 나가기 버튼 */}
        <div className="w-full md:w-1/3">
          <div className="flex flex-wrap justify-end mb-2">
            {roomData.keywords.map((keyword, index) => (
              <span
                key={index}
                className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full mr-2 mb-2 text-sm"
              >
                #{keyword}
              </span>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleLeaveRoom}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
            >
              나가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomInfo;
