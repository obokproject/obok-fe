import React, { useState, useEffect, useRef } from "react";
import { useRoom } from "../../hooks/useChat"; // 방 정보를 가져오는 custom hook
import { useAuth } from "../../contexts/AuthContext"; // 사용자 인증 context
import ChatKeyword from "../../components/ChatKeyword"; // 채팅 키워드 컴포넌트
import RoomInfo from "../../components/RoomInfo"; // 방 정보 컴포넌트
import MemberList from "../../components/MemberList"; // 멤버리스트 컴포넌트
import io from "socket.io-client"; // socket.io-client 라이브러리
import { Loader } from "lucide-react";

const apiUrl = process.env.REACT_APP_API_URL || "";

interface ChatBoardProps {
  roomId: string;
}

// // 키워드 추출 함수 정의
// const extractKeywords = (content: string): string[] => {
//   const regex = /#[^\s#]+/g;
//   return content.match(regex) || [];
// };

const ChatBoard: React.FC<ChatBoardProps> = ({ roomId }) => {
  const { user } = useAuth(); // 현재 로그인된 사용자 정보 가져오기
  const { room, loading, error, fetchRoom } = useRoom(roomId); // 방 정보 훅

  const [messages, setMessages] = useState<any[]>([]); // 메시지 상태
  const [newMessage, setNewMessage] = useState(""); // 새로운 메시지 상태
  const [systemMessages, setSystemMessages] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [keywords, setKeywords] = useState<{ [key: string]: number }>({}); // 키워드 상태
  const [highlightedMessageIndex, setHighlightedMessageIndex] = useState<
    number | null
  >(null); // 강조된 메시지 인덱스 상태
  const [members, setMembers] = useState<any[]>([]); // 멤버 상태
  const [isHost, setIsHost] = useState<boolean>(false); // 호스트 여부 상태
  const chatContainerRef = useRef<HTMLDivElement>(null); // 채팅 컨테이너 참조
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]); // 메시지 참조 배열
  const inputRef = useRef<HTMLTextAreaElement>(null); // 입력창 참조

  const maxChars = 80; // 최대 문자 수

  // socket.io 연결 설정
  const socket = useRef<ReturnType<typeof io> | null>(null); // socket.io 연결을 관리하는 ref

  const [roomHostId, setroomHostId] = useState<number | null>(null); // 호스트의 ID를 상태로 관리

  // 방 정보 및 메시지 로드, WebSocket 연결 설정
  useEffect(() => {
    if (roomId && user) {
      fetchRoom(roomId); // 방 정보 로드

      // WebSocket 연결 초기화
      socket.current = io(`${apiUrl}`, {
        transports: ["websocket"], // WebSocket을 우선 사용
      });

      // WebSocket 서버에 연결 성공시
      socket.current.on("connect", () => {
        socket.current?.emit("joinRoom", { roomId, userId: user.id }); // 방에 참여

        // 초기 시스템 메시지 추가

        setSystemMessages([
          {
            content: "라즈베리는 건전한 채팅 문화를 지향합니다.",
            position: "top",
          },
        ]);
      });

      // 서버로부터 realRoom 데이터를 수신
      socket.current?.on("realRoom", (realRoom) => {
        // roomHostId 상태 업데이트
        setroomHostId(realRoom.userId);
      });

      // 서버로부터 메시지 수신
      socket.current?.on("message", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // 남은 시간 알림을 위한 이벤트 리스너 추가
      socket.current?.on("timeRemaining", (time: number) => {
        let content = "";
        if (time === 300) content = "종료까지 시간이 5분 남았습니다.";
        else if (time === 180) content = "종료까지 시간이 3분 남았습니다.";
        else if (time === 60) content = "종료까지 시간이 1분 남았습니다.";
        else if (time === 30) content = "종료까지 시간이 30초 남았습니다.";

        if (content) {
          setSystemMessages((prevMessages) => [
            ...prevMessages,
            { content, position: "bottom" },
          ]);
        }
      });

      // 서버로부터 멤버 업데이트 수신
      socket.current.on("memberUpdate", (updatedMembers) => {
        setMembers(updatedMembers); // 멤버 리스트를 상태에 저장

        // updatedMembers가 배열이 아닌 경우 예외 처리
        const intervalId = setInterval(() => {
          if (Array.isArray(updatedMembers)) {
            const currentUser = updatedMembers.find(
              (member) => member.userId === user.id
            );

            setIsHost(currentUser?.role === "host");
            clearInterval(intervalId); // 배열로 확인되면 더 이상 재시도하지 않음
          } else {
          }
        }, 500); // 0.5초 간격으로 배열 여부를 계속 확인
      });

      // 이전 메시지 및 키워드, 멤버 수신
      socket.current.on("previousMessages", (prevMessages) => {
        setMessages(prevMessages);
      });

      socket.current.on("previousMembers", (members) => {
        setMembers(members); // 이전 멤버 리스트 상태에 저장
      });

      // 컴포넌트 언마운트 시 WebSocket 연결 해제
      return () => {
        if (socket.current) {
          socket.current.disconnect(); // WebSocket 연결 해제
        }
      };
    }
  }, [roomId, user, fetchRoom]); // roomId와 user가 변경될 때마다 실행

  // 특정 키워드를 클릭했을 때 해당 메시지로 스크롤하는 함수 수정
  const scrollToMessage = (keyword: string, retryCount = 0) => {
    socket.current?.emit(
      "keywordClick",
      { roomId, keyword },
      (response: any) => {
        if (response.success) {
          const message = response.message;

          const messageIndex = messages.findIndex(
            (msg) => msg.id === message.id
          );

          if (messageIndex !== -1) {
            const messageElement = messageRefs.current[messageIndex];
            const chatContainer = chatContainerRef.current;

            if (messageElement && chatContainer) {
              const messageRect = messageElement.getBoundingClientRect();
              const containerRect = chatContainer.getBoundingClientRect();

              const offset =
                messageRect.top - containerRect.top + chatContainer.scrollTop;

              chatContainer.scrollTo({
                top: offset,
                behavior: "smooth",
              });

              // 해당 메시지에 하이라이트 효과를 적용
              setHighlightedMessageIndex(messageIndex);

              // 1초 후 하이라이트 해제
              setTimeout(() => {
                setHighlightedMessageIndex(null);
              }, 1000);
            }
          }
        } else {
          console.error("Failed to find message:", response.error);

          // 재시도 로직 (최대 재시도 횟수 설정)
          if (retryCount < 3) {
            setTimeout(() => {
              scrollToMessage(keyword, retryCount + 1); // 재시도
            }, 2000); // 2초 후에 재시도
          } else {
            console.error("Max retry attempts reached.");
          }
        }
      }
    );
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

  if (loading)
    return (
      <div className="flex justify-center items-center">
        <Loader /> Loading...
      </div>
    ); // 로딩 중 표시
  if (error) return <div>Error: {error}</div>; // 에러 발생 시 표시
  if (!room) return <div>Room not found</div>; // 방 정보가 없을 때 표시

  return (
    <div className="container bg-white w-[1178px] h-[720px] flex flex-col mt-[40px] mb-[40px] ">
      <div className="flex-1 flex overflow-hidden">
        {/* 채팅 영역(1)과 방 정보(4) */}
        <div className="flex flex-col flex-grow pr-4">
          <div className="flex flex-col flex-1 bg-white border-2 border-[#A6046D] overflow-hidden rounded-[20px]">
            {/* 채팅 영역 */}
            <div
              className="flex-1 overflow-y-auto m-4 flex flex-col max-w-full"
              ref={chatContainerRef}
            >
              <div className="w-full h-fit flex justify-center items-center gap-1">
                <div className="w-[131px] py-1 flex flex-col justify-start items-start gap-2.5">
                  <div className="self-stretch h-0 border-t border-solid border-[#9F9F9F] mb-[20px]"></div>
                </div>
                {systemMessages
                  .filter((msg) => msg.position === "top")
                  .map((msg, index) => (
                    <div
                      key={`system-top-${index}`}
                      className="flex justify-center mb-4 top-0"
                    >
                      <span className="flex justify-center text-[#9F9F9F] text-lg font-bold break-words">
                        {msg.content}
                      </span>
                    </div>
                  ))}
                <div className="w-[131px] py-1 flex flex-col justify-start items-start gap-2.5">
                  <div className="self-stretch h-0 border-t border-solid border-[#9F9F9F] mb-[20px]"></div>
                </div>
              </div>

              {messages.map((msg, index) => {
                if (msg.isSystem && msg.position === "bottom") {
                  return null;
                }
                // 기존의 일반 메시지 렌더링 코드
                const showProfile =
                  index === 0 || messages[index - 1].user_id !== msg.user_id;

                return (
                  <div
                    key={msg.id} // key로 메시지 ID 사용
                    ref={(el) => {
                      messageRefs.current[index] = el;
                    }}
                    className={`flex items-start h-fit rounded-[20px] max-w-full break-words ${
                      highlightedMessageIndex === index
                        ? "bg-yellow-100 border border-yellow-300"
                        : "bg-white"
                    } ${showProfile ? "mt-4" : "mt-1"}`} // pt-4 또는 pt-1을 조건부로 적용
                  >
                    {/* 시스템 메시지와 일반 메시지 구분 */}
                    {msg.user_id === 99999 ? ( // 시스템 메시지 여부 확인
                      <div className="flex items-center justify-center w-full py-2 bg-white">
                        <div className="flex items-center justify-center w-full">
                          <div className="border-t w-[131px] border-gray-400"></div>{" "}
                          {/* 왼쪽 수평선 */}
                          <div className="flex justify-center px-2 text-[#9F9F9F] font-semibold">
                            {" "}
                            {/* 텍스트 스타일 */}
                            {msg.content}
                          </div>
                          <div className="border-t border-gray-400 w-[131px]"></div>{" "}
                          {/* 오른쪽 수평선 */}
                        </div>
                      </div>
                    ) : (
                      <>
                        {showProfile && (
                          <div className="flex items-center mr-4 pt-1 relative">
                            <img
                              src={msg.profile || "/images/user-profile.png"} // 프로필 이미지 추가 (기본 이미지 설정)
                              alt="User Profile"
                              className="min-w-10 min-h-10 w-10 h-10 bg-gray-300 rounded-full"
                            />

                            {roomHostId === msg.user_id && (
                              <img
                                src="/images/crown.png"
                                className="w-[15px] h-[15px] bg-opacity-100 absolute top-0 right-0"
                                alt="crown"
                              />
                            )}
                          </div>
                        )}
                        <div className="flex flex-col h-fit max-w-full">
                          {showProfile && (
                            <div className="flex items-center min-w-fit min-h-fit max-w-full">
                              <span className="font-bold text-lg mr-2">
                                <span className="text-[#323232] mr-1 text-[16px] font-[700]">
                                  {msg.nickname}
                                </span>
                                {"     "}
                                <span className="text-[#A6046D] text-[16px] font-500]">
                                  {msg.job}
                                </span>{" "}
                                {/* 닉네임과 직업에 다른 색상 적용 */}
                              </span>
                            </div>
                          )}
                          <div
                            className={`${
                              showProfile ? "" : "ml-14"
                            } mb-0 h-[25px]"`}
                          >
                            <p className="text-gray-700 mb-0 max-w-[680px] break-words">
                              {msg.content}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
              {systemMessages
                .filter((msg) => msg.position === "bottom")
                .map((msg, index) => (
                  <div
                    key={`system-bottom-${index}`}
                    className="flex justify-center mt-auto sticky bottom-0 z-10"
                  >
                    <span className="bg-gray-200 text-[#9F9F9F] px-3 py-1 rounded-full text-sm">
                      {msg.content}
                    </span>
                  </div>
                ))}
            </div>
            <div className="p-4">
              <div className="flex items-center bg-white rounded-[30px] border-[1px] border-[#BD2130] p-[2px] h-fit">
                {/* 프로필 이미지 추가 */}
                <img
                  src={user?.profile || "/images/user-profile.png"} // 사용자 프로필 이미지 추가
                  alt="User Profile"
                  className="w-10 h-10 bg-gray-300 rounded-full mr-4"
                />
                <textarea
                  placeholder="내용을 입력해주세요."
                  className="flex-1 bg-transparent border-none text-gray-700 resize-none focus:outline-none"
                  value={newMessage}
                  onChange={(e) => {
                    if (e.target.value.length <= maxChars) {
                      setNewMessage(e.target.value);
                    }
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto"; // 높이를 초기화
                    target.style.height = `${target.scrollHeight}px`; // 입력 내용에 맞게 높이 조정
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();

                      if (e.shiftKey) {
                        // Shift+Enter 시 새로운 메시지로 나누기
                        handleSendMessage(); // 메시지 전송
                        setNewMessage(""); // 입력창 비우기
                      } else {
                        // Enter 시 기존 메시지 전송
                        handleSendMessage(); // 메시지 전송
                        setNewMessage(""); // 입력창 비우기
                      }
                    }
                  }}
                  ref={inputRef}
                  rows={1}
                  maxLength={maxChars}
                />

                {/* 글자 수 카운트 표시 */}
                <div className="text-[16px] text-black">
                  {newMessage.length}/{maxChars}
                </div>
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-transparent text-red-400 rounded-lg hover:bg-red-100 focus:outline-none"
                >
                  <img
                    src={"/images/arrow-return-left.png"}
                    alt="arrow-return-left"
                    className="w-full h-full bg-white"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 방 정보(4) */}
          <div className="w-full p-4 border-2 border-[#A6046D] rounded-[20px] bg-white mt-2">
            {members.length > 0 ? (
              <RoomInfo
                uuid={roomId}
                socket={socket.current}
                members={members}
                isHost={isHost}
              />
            ) : (
              <div>로딩 중...</div>
            )}
          </div>
        </div>

        {/* 멤버 리스트(2)와 키워드 영역(3) */}
        <div className="flex flex-col w-[280px] bg-white rounded-tr-lg border-2 border-none">
          <div className="h-1/2 overflow-y-auto px-[9px] py-[17px] border-2 border-[#A6046D] rounded-[20px]">
            <div className="flex-1 overflow-y-auto p-2">
              {members.length > 0 ? (
                <MemberList members={members} />
              ) : (
                <div>멤버 데이터를 로드 중입니다...</div>
              )}
            </div>
          </div>
          <div className="h-[360px] overflow-y-auto pt-2">
            <ChatKeyword
              roomId={roomId}
              socket={socket.current}
              onKeywordClick={scrollToMessage} // 키워드 클릭 시 메시지로 스크롤
              isHost={isHost} // 호스트의 ID를 전달
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBoard;
