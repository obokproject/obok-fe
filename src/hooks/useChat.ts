import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

interface Room {
  id: string;
  name: string;
  type: "chat" | "kanban";
  participants: string[];
}

export const useRoom = (initialRoomId?: string) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoom = useCallback(async (roomId: string) => {
    setLoading(true);
    try {
      // 실제 API 호출을 여기에 구현합니다.
      // const response = await api.getRoom(roomId);
      // setRoom(response.room);

      // 임시 데이터:
      setRoom({
        id: roomId,
        name: `Room ${roomId}`,
        type: "chat",
        participants: ["user1", "user2"],
      });
    } catch (err) {
      setError("Failed to fetch room data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialRoomId) {
      fetchRoom(initialRoomId);
    }
  }, [initialRoomId, fetchRoom]);

  const createRoom = useCallback(
    (name: string, type: "chat" | "kanban"): string => {
      const newRoomId = uuidv4();
      const newRoom: Room = {
        id: newRoomId,
        name,
        type,
        participants: [],
      };
      setRoom(newRoom);
      return newRoomId;
    },
    []
  );

  const joinRoom = useCallback(
    async (userId: string) => {
      if (!room) return;
      // 실제 방 참여 로직을 여기에 구현합니다.
      // await api.joinRoom(room.id, userId);
      setRoom((prevRoom) => {
        if (!prevRoom) return null;
        return {
          ...prevRoom,
          participants: [...prevRoom.participants, userId],
        };
      });
    },
    [room]
  );

  const leaveRoom = useCallback(
    async (userId: string) => {
      if (!room) return;
      // 실제 방 나가기 로직을 여기에 구현합니다.
      // await api.leaveRoom(room.id, userId);
      setRoom((prevRoom) => {
        if (!prevRoom) return null;
        return {
          ...prevRoom,
          participants: prevRoom.participants.filter((id) => id !== userId),
        };
      });
    },
    [room]
  );

  return { room, loading, error, createRoom, fetchRoom, joinRoom, leaveRoom };
};
