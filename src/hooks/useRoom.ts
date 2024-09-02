import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios"; // axios를 사용하여 API 호출

interface Room {
  id: number;
  uuid: string;
  title: string; // 방의 제목
  type: "chat" | "kanban";
  participants: number; // 참가자 수
  max_member: number;
  duration: number;
  status: string;
  keywords: string[];
  user_id: number; // 방을 생성한 사용자의 ID
  nickname: string; // 방을 생성한 사용자의 닉네임
  createdAt: string;
}

export const useRoom = (initialRoomId?: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [room, setRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/main");
      setRooms(response.data);
    } catch (err) {
      setError("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRoom = useCallback(async (roomId: string) => {
    setLoading(true);
    try {
      // 실제 API 호출을 여기에 구현합니다.
      // const response = await axios.get(`${roomId}`);
      // setRoom(response.data);
      // 임시 데이터:
      // setRoom({
      //   id: roomId,
      //   name: `Room ${roomId}`,
      //   type: "chat",
      //   participants: ["user1", "user2"],
      // });
    } catch (err) {
      setError("Failed to fetch room data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialRoomId) {
      fetchRoom(initialRoomId);
    } else {
      fetchRooms(); // 초기 로드 시 모든 방 목록을 가져옴
    }
  }, [initialRoomId, fetchRoom, fetchRooms]);

  const createRoom = useCallback(
    async (
      title: string,
      type: "chat" | "kanban",
      max_member: number,
      duration: number,
      keywords: string[] // 키워드 목록 추가
    ) => {
      try {
        const newRoomId = uuidv4(); // 프론트에서 UUID 생성
        const response = await axios.post("/main", {
          uuid: newRoomId,
          title,
          type,
          max_member, // 사용자가 입력한 값을 그대로 사용
          duration, // 사용자가 입력한 값을 그대로 사용
          keywords,
        });
        setRooms([...rooms, response.data]); // 새로 생성된 방을 목록에 추가
        return newRoomId; // uuid를 반환하여 페이지 이동에 사용
      } catch (err) {
        setError("Failed to create room");
        return null;
      }
    },
    [rooms]
  );

  // const joinRoom = useCallback(
  //   async (userId: string) => {
  //     if (!room) return;
  //     // 실제 방 참여 로직을 여기에 구현합니다.
  //     // await api.joinRoom(room.id, userId);
  //     setRoom((prevRoom) => {
  //       if (!prevRoom) return null;
  //       return {
  //         ...prevRoom,
  //         participants: [...prevRoom.participants, userId],
  //       };
  //     });
  //   },
  //   [room]
  // );

  // const leaveRoom = useCallback(
  //   async (userId: string) => {
  //     if (!room) return;
  //     // 실제 방 나가기 로직을 여기에 구현합니다.
  //     // await api.leaveRoom(room.id, userId);
  //     setRoom((prevRoom) => {
  //       if (!prevRoom) return null;
  //       return {
  //         ...prevRoom,
  //         participants: prevRoom.participants.filter((id) => id !== userId),
  //       };
  //     });
  //   },
  //   [room]
  // );

  return { room, rooms, loading, error, createRoom, fetchRoom, fetchRooms };
};
