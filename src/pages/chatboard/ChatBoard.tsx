import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useRoom } from "../../hooks/useChat"; // 방 정보를 가져오는 custom hook
import { useAuth } from "../../contexts/AuthContext"; // 사용자 인증 context
import ChatKeyword from "../../components/ChatKeyword"; // 채팅 키워드 컴포넌트
import RoomInfo from "../../components/RoomInfo"; // 방 정보 컴포넌트
import io from "socket.io-client"; // socket.io-client 라이브러리

interface ChatBoardProps {
  roomId: string;
}

// 키워드 추출 함수 정의
const extractKeywords = (content: string): string[] => {
  const regex = /#[^\s#]+/g;
  return content.match(regex) || [];
};

const ChatBoard: React.FC<ChatBoardProps> = ({ roomId }) => {
  const { user } = useAuth(); // 현재 로그인된 사용자 정보 가져오기
  const { room, loading, error, fetchRoom } = useRoom(roomId); // 방 정보 훅

  const [messages, setMessages] = useState<any[]>([]); // 메시지 상태
  const [newMessage, setNewMessage] = useState(""); // 새로운 메시지 상태
  const [keywords, setKeywords] = useState<{ [key: string]: number }>({}); // 키워드 상태
  const [highlightedMessageIndex, setHighlightedMessageIndex] = useState<
    number | null
  >(null); // 강조된 메시지 인덱스 상태
  const [members, setMembers] = useState<any[]>([]); // 멤버 상태
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
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];

          // 메시지에 포함된 키워드를 찾아서 인덱스 매핑
          const keywordsInMessage = extractKeywords(message.content);
          setKeywords((prevKeywords) => {
            const newKeywords = { ...prevKeywords };
            keywordsInMessage.forEach((keyword: string) => {
              newKeywords[keyword] = updatedMessages.length - 1; // 새로운 메시지의 인덱스
            });
            return newKeywords;
          });

          return updatedMessages;
        });
      });

      // 서버로부터 멤버 업데이트 수신
      socket.current.on("memberUpdate", (updatedMembers) => {
        console.log("Received member update:", updatedMembers); // 로그로 데이터 확인
        setMembers(updatedMembers); // 멤버 리스트를 상태에 저장
      });

      // 이전 메시지 및 키워드, 멤버 수신
      socket.current.on("previousMessages", (prevMessages) => {
        setMessages(prevMessages);

        // 이전 키워드를 다시 매핑
        socket.current?.on("previousKeywords", (keywords: string[]) => {
          const keywordObject: { [key: string]: number } = {};
          keywords.forEach((keyword) => {
            const messageIndex = prevMessages.findIndex((msg: any) =>
              msg.content.includes(keyword)
            );
            if (messageIndex !== -1) {
              keywordObject[keyword] = messageIndex;
            }
          });
          setKeywords(keywordObject); // 키워드를 올바른 형식으로 변환하여 상태에 저장
        });
      });

      socket.current.on("previousMembers", (members) => {
        console.log(
          "Received previous members:",
          JSON.stringify(members, null, 2)
        );
        setMembers(members); // 이전 멤버 리스트 상태에 저장
      });

      // 컴포넌트 언마운트 시 WebSocket 연결 해제
      return () => {
        if (socket.current) {
          socket.current.disconnect(); // WebSocket 연결 해제
        }
      };
    }
  }, [roomId, user]); // roomId와 user가 변경될 때마다 실행

  // 특정 키워드를 클릭했을 때 해당 메시지로 스크롤하는 함수
  const scrollToMessage = (keyword: string) => {
    // 모든 메시지 인덱스 찾기
    const messageIndexes = messages
      .map((msg, index) => (msg.content.includes(keyword) ? index : -1))
      .filter((index) => index !== -1);

    if (messageIndexes.length > 0) {
      const messageIndex = messageIndexes[0]; // 첫 번째 인덱스 선택

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

          // 해당 메시지에 하이라이트 효과를 적용
          setHighlightedMessageIndex(messageIndex);

          // 1초 후 하이라이트 해제
          setTimeout(() => {
            setHighlightedMessageIndex(null);
          }, 1000);
        }
      } else {
        console.error("Message element not found for keyword:", keyword);
      }
    } else {
      console.error("Message index not found for keyword:", keyword);
    }
  };

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
    <div className="bg-pink-50 h-screen flex flex-col p-4">
      <div className="flex-1 flex overflow-hidden">
        {/* 채팅 영역(1)과 방 정보(4) */}
        <div className="flex flex-col w-3/4 pr-4">
          <div className="flex flex-col flex-1 bg-white rounded-tl-lg border-2 border-pink-200 overflow-hidden">
            {/* 채팅 영역 */}
            <div className="flex-1 overflow-y-auto p-4" ref={chatContainerRef}>
              {messages.map((msg, index) => {
                const showProfile =
                  index === 0 || messages[index - 1].user_id !== msg.user_id;

                return (
                  <div
                    key={index}
                    ref={(el) => {
                      messageRefs.current[index] = el;
                    }}
                    className={`flex items-start mb-2 p-2 rounded-lg ${
                      highlightedMessageIndex === index
                        ? "bg-yellow-100 border border-yellow-300"
                        : "bg-white"
                    }`}
                  >
                    {showProfile && (
                      <div className="flex items-center mr-4">
                        <img
                          src={msg.profile || "default-profile.png"} // 프로필 이미지 추가 (기본 이미지 설정)
                          alt="User Profile"
                          className="w-10 h-10 bg-gray-300 rounded-full"
                        />
                      </div>
                    )}
                    <div className="flex flex-col">
                      {showProfile && (
                        <div className="flex items-center mb-1">
                          <span className="font-bold text-lg text-blue-500 mr-2">
                            {msg.nickname} {msg.job} {/* 닉네임과 직업 표시 */}
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
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center bg-white rounded-full border-2 border-red-400 px-4 py-2">
                {/* 프로필 이미지 추가 */}
                <img
                  src={user?.profile} // 사용자 프로필 이미지 추가
                  alt="User Profile"
                  className="w-10 h-10 bg-gray-300 rounded-full mr-4"
                />
                <textarea
                  placeholder="내용을 입력해주세요."
                  className="flex-1 bg-transparent border-none text-gray-700 resize-none focus:outline-none"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  ref={inputRef}
                  rows={1}
                  maxLength={maxChars}
                />
                <button
                  onClick={handleSendMessage}
                  className="ml-2 p-2 bg-transparent text-red-400 rounded-lg hover:bg-red-100 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* 방 정보(4) */}
          <div className="mt-4">
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

        {/* 멤버 리스트(2)와 키워드 영역(3) */}
        <div className="flex flex-col w-1/4 bg-white rounded-tr-lg border-2 border-pink-200">
          <div className="h-1/2 overflow-y-auto p-4 border-b border-pink-200">
            <div className="flex-1 overflow-y-auto p-2">
              {members && members.length > 0 ? (
                members.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center mb-4 p-2 bg-pink-50 rounded-lg border border-pink-200"
                  >
                    <img
                      src={member.profile || "default-profile.png"}
                      alt={member.nickname}
                      className="w-10 h-10 bg-gray-300 rounded-full mr-2"
                    />
                    <div>
                      <div className="text-lg font-bold">{member.nickname}</div>
                      <div className="text-sm text-gray-500">{member.job}</div>
                      <div className="text-sm text-gray-700">
                        {member.role === "host" && " (Host)"}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center">멤버 로딩중...</div>
              )}
            </div>
          </div>
          <div className="h-1/2 overflow-y-auto p-4">
            <ChatKeyword
              roomId={roomId}
              socket={socket.current}
              onKeywordClick={scrollToMessage} // 키워드 클릭 시 메시지로 스크롤
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBoard;
