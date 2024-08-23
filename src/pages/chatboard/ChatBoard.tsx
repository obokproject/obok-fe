import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useRoom } from "../../hooks/useRoom"; // 방 정보를 가져오는 custom hook
import { useAuth } from "../../contexts/AuthContext"; // 사용자 인증 context
import ChatKeyword from "../../components/ChatKeyword"; // 채팅 키워드 컴포넌트
import MemberList from "../../components/MemberList"; // 멤버 리스트 컴포넌트
import RoomInfo from "../../components/RoomInfo"; // 방 정보 컴포넌트
import io from "socket.io-client"; // socket.io-client 라이브러리

interface ChatBoardProps {
  roomId: string;
}

const ChatBoard: React.FC<ChatBoardProps> = ({ roomId }) => {
  const { user } = useAuth(); // 현재 로그인된 사용자 정보 가져오기
  const { room, loading, error, fetchRoom, joinRoom, leaveRoom } =
    useRoom(roomId); // 방 정보 훅

  const [messages, setMessages] = useState<any[]>([]); // 메시지 상태
  const [newMessage, setNewMessage] = useState(""); // 새로운 메시지 상태
  const [keywords, setKeywords] = useState<{ [key: string]: number }>({}); // 키워드 상태
  const [highlightedMessageIndex, setHighlightedMessageIndex] = useState<
    number | null
  >(null); // 강조된 메시지 인덱스 상태
  const chatContainerRef = useRef<HTMLDivElement>(null); // 채팅 컨테이너 참조
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]); // 메시지 참조 배열
  const inputRef = useRef<HTMLTextAreaElement>(null); // 입력창 참조

  const maxChars = 80; // 최대 문자 수

  // socket.io 연결 설정
  const socket = useRef<ReturnType<typeof io> | null>(null); // socket.io 연결을 관리하는 ref

  // 방 정보 및 메시지 로드, WebSocket 연결 설정
  useEffect(() => {
    if (roomId && user) {
      fetchRoom(roomId); // 방 정보 로드

      // WebSocket 연결 초기화
      socket.current = io("http://localhost:5000", {
        transports: ["websocket"], // WebSocket을 우선 사용
      });

      // WebSocket 서버에 연결 성공시
      socket.current.on("connect", () => {
        console.log("Connected to the WebSocket server");
        socket.current?.emit("joinRoom", { roomId, userId: user.id }); // 방에 참여
        console.log("Joined room:", roomId); // 추가된 콘솔 로그
      });

      // 서버로부터 메시지 수신
      socket.current.on("message", (message) => {
        console.log("Received message:", message); // 메시지 수신 로그
        setMessages((prevMessages) => [...prevMessages, message]); // 메시지를 상태에 추가
      });

      // 컴포넌트 언마운트 시 WebSocket 연결 해제
      return () => {
        if (socket.current) {
          socket.current.disconnect(); // WebSocket 연결 해제
        }
      };
    }
  }, [roomId, user]); // roomId와 user가 변경될 때마다 실행

  // 사용자가 메시지를 전송할 때 호출되는 함수
  const handleSendMessage = () => {
    if (newMessage.trim() === "" || !user) return; // 메시지가 비어있거나 사용자가 없으면 반환

    if (!socket.current || !socket.current.connected) {
      console.error("Socket.io is not connected."); // WebSocket이 연결되지 않은 경우 에러 로그
      return;
    }

    const message = {
      roomId: roomId, // 현재 방의 UUID
      userId: user.id, // 현재 사용자의 ID
      content: newMessage, // 입력한 메시지 내용
    };
    console.log("Sending message:", message); // 추가된 콘솔 로그
    socket.current.emit("message", message); // 메시지를 서버로 전송
    setNewMessage(""); // 입력창 초기화
  };

  // 특정 키워드를 클릭했을 때 해당 메시지로 스크롤하는 함수
  const scrollToMessage = (keyword: string) => {
    const messageIndex = keywords[keyword]; // 키워드에 해당하는 메시지 인덱스 찾기
    if (messageRefs.current[messageIndex] && chatContainerRef.current) {
      const messageElement = messageRefs.current[messageIndex]; // 해당 메시지 요소
      const chatContainer = chatContainerRef.current; // 채팅 컨테이너 요소

      if (messageElement && chatContainer) {
        const messageRect = messageElement.getBoundingClientRect();
        const containerRect = chatContainer.getBoundingClientRect();

        const offset =
          messageRect.top - containerRect.top + chatContainer.scrollTop; // 스크롤 위치 계산

        chatContainer.scrollTo({
          top: offset,
          behavior: "smooth", // 부드러운 스크롤
        });

        setHighlightedMessageIndex(messageIndex); // 해당 메시지를 강조 표시
        setTimeout(() => {
          setHighlightedMessageIndex(null); // 일정 시간 후 강조 해제
        }, 1000); // 1초 후 강조 표시 해제
      }
    }
  };

  // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]); // messages가 변경될 때마다 실행

  if (loading) return <div>Loading...</div>; // 로딩 중 표시
  if (error) return <div>Error: {error}</div>; // 에러 발생 시 표시
  if (!room) return <div>Room not found</div>; // 방 정보가 없을 때 표시

  return (
    <div>
      <h1>{room.name}</h1> {/* 방 이름 표시 */}
      <p>Type: {room.type}</p> {/* 방 타입 표시 */}
      <p>Participants: {room.participants.join(", ")}</p>{" "}
      {/* 참가자 목록 표시 */}
      {/* 채팅 기능 구현 */}
      <div className="flex flex-col h-screen">
        <div className="flex flex-1 overflow-hidden">
          <div className="flex flex-col w-full p-4 bg-gray-100">
            <div className="flex-1 overflow-y-auto" ref={chatContainerRef}>
              {messages.map((msg, index) => {
                const showProfile =
                  index === 0 || messages[index - 1].user_id !== msg.user_id;

                return (
                  <div
                    key={index}
                    ref={(el) => (messageRefs.current[index] = el)}
                    className={`flex items-start mb-2 ${
                      highlightedMessageIndex === index
                        ? "bg-yellow-100 border border-yellow-300"
                        : ""
                    }`}
                  >
                    {showProfile && (
                      <div className="flex items-center mr-4">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      </div>
                    )}
                    <div className="flex flex-col">
                      {showProfile && (
                        <div className="flex items-center mb-1">
                          <span className="font-bold text-lg text-blue-500 mr-2">
                            {msg.user_id}
                          </span>
                        </div>
                      )}
                      <div className={`${showProfile ? "" : "ml-14"}`}>
                        <p className="text-gray-700">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center border-t p-4 bg-white">
              <textarea
                placeholder="내용을 입력해주세요."
                className="flex-1 border border-gray-300 rounded-lg p-2 text-gray-700 resize-none overflow-hidden"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(); // 메시지 전송
                  }
                }}
                ref={inputRef}
                rows={1}
                maxLength={maxChars}
              />
              <span className="ml-2 text-sm text-gray-500">
                {newMessage.length} / {maxChars}
              </span>
              <button
                onClick={handleSendMessage}
                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
              >
                전송
              </button>
            </div>
          </div>

          <div className="flex flex-col w-96 p-4 border border-gray-300">
            <div className="h-4/5 overflow-y-auto border-b border-gray-300">
              <MemberList /> {/* 멤버 리스트 표시 */}
            </div>
            <div className="flex-1 overflow-y-auto pt-4 border-t border-gray-300">
              <ChatKeyword
                keywords={Object.keys(keywords)} // 키워드 전달
                onKeywordClick={scrollToMessage} // 키워드 클릭 시 메시지로 스크롤
              />
            </div>
          </div>
        </div>

        <div className="w-full p-4">
          <RoomInfo
            title="주제"
            creator={{ name: "기획자", job: "기획자" }}
            participants={6}
            maxParticipants={6}
            openTime="2024-08-15 10:00"
            closeTime="2024-08-15 10:30"
            keywords={["콜택시", "반차"]}
            duration={60}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBoard;
