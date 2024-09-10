import React, { useState, useEffect, useRef } from "react";
import { useRoom } from "../../hooks/useRoom"; //방 정보를 가져오는 hook
import { useAuth } from "../../contexts/AuthContext"; // 사용자 인증
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import RoomInfo from "../../components/RoomInfo";
import MemberList from "../../components/MemberList";
import io from "socket.io-client"; // socket.io-client 라이브러리

const apiUrl = process.env.REACT_APP_API_URL || "";

// 칸반 보드의 각 카드를 나타내는 인터페이스
interface KanbanCard {
  id: string; // 카드의 고유 식별자
  content: string; // 카드의 내용
  profile: string; // 카드 작성자의 프로필 이미지 URL
  userId: string; //
}

// 칸반 보드의 각 열(Section)을 나타내는 인터페이스
interface KanbanSection {
  id: string; // 열의 고유 식별자
  title: string; // 열의 제목 (예: "생성", "고민", "채택")
  cards: KanbanCard[]; // 해당 열에 속한 카드들의 배열
}

// KanbanBoard 컴포넌트의 props 인터페이스
interface KanbanBoardProps {
  roomId: string; // 현재 방의 ID
}

const SECTIONS: KanbanSection[] = [
  { id: "생성", title: "생성", cards: [] },
  { id: "고민", title: "고민", cards: [] },
  { id: "채택", title: "채택", cards: [] },
];

const KanbanBoard: React.FC<KanbanBoardProps> = ({ roomId }) => {
  // 칸반 보드의 상태를 관리하는 state
  const { user } = useAuth(); // 현재 로그인된 사용자 정보 가져오기
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isHost, setIsHost] = useState<boolean>(false); // 호스트 여부 상태
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [room, setRoom] = useState<any>(null);
  // const [userRole, setUserRole] = useState<string>("guest");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading, error, fetchRoom } = useRoom(roomId); // 방 정보 훅
  const [sections, setSections] = useState<KanbanSection[]>(SECTIONS);
  const [newCardContent, setNewCardContent] = useState("");
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [members, setMembers] = useState<any[]>([]);

  // socket.io 연결 설정
  const socket = useRef<ReturnType<typeof io> | null>(null); // socket.io 연결을 관리하는 ref
  const inputRef = useRef<HTMLInputElement>(null);

  // useEffect hook: roomId, user가 변경될 때만 useEffect hook을 실행
  useEffect(() => {
    if (roomId && user) {
      fetchRoom(roomId);

      socket.current = io(`${apiUrl}`, {
        transports: ["websocket"],
      });

      // WebSocket 서버에 연결 성공시
      socket.current.on("connect", () => {
        console.log("Connected to the WebSocket server");
        socket.current?.emit("joinRoom", { roomId, userId: user.id });
      });

      // 이벤트 리스너 설정
      const setupSocketListeners = () => {
        socket.current?.on("boardUpdate", (updatedSections) => {
          console.log("Received board update:", updatedSections);
          setSections(updatedSections);
        });
        //이전 보드 불러오기
        socket.current?.on("previousBoardData", (prevSections) => {
          console.log("Received previous board data:", prevSections);
          setSections(prevSections);
        });
        //멤버 수신
        socket.current?.on("memberUpdate", (updatedMembers) => {
          console.log("Received member update:", updatedMembers); // 로그로 데이터 확인

          // updatedMembers가 배열이 아닌 경우 예외 처리
          const intervalId = setInterval(() => {
            if (Array.isArray(updatedMembers)) {
              setMembers(updatedMembers); // 멤버 리스트를 상태에 저장
              const currentUser = updatedMembers.find(
                (member) => member.userId === user.id
              );
              setIsHost(currentUser?.role === "host");
              clearInterval(intervalId); // 배열로 확인되면 더 이상 재시도하지 않음
            } else {
              console.log("Waiting for updatedMembers to become an array...");
            }
          }, 500); // 0.5초 간격으로 배열 여부를 계속 확인
        });

        socket.current?.on("roomInfo", (info) => {
          setRoom(info);
        });

        // 에러 처리 로직
        socket.current?.on("connect_error", (error) => {
          console.error("Connection error:", error);
        });

        // 재연결 성공 시 로직
        socket.current?.on("reconnect", (attemptNumber) => {
          console.log("Reconnected on attempt: ", attemptNumber);
        });
      };

      setupSocketListeners();

      return () => {
        if (socket.current) {
          socket.current.off("boardUpdate");
          socket.current.off("previousBoardData");
          socket.current.off("memberUpdate");
          socket.current.off("roomInfo");
          socket.current.off("connect_error");
          socket.current.off("reconnect");
          socket.current.disconnect(); // WebSocket 연결 해제
        }
      };
    }
  }, [roomId, user, fetchRoom]); // roomId와 user가 변경될 때마다 실행

  // 드래그 앤 드롭이 끝났을 때 실행되는 함수
  const onDragEnd = (result: DropResult) => {
    console.log(result);
    const { source, destination } = result;

    // 유효하지 않은 목적지인 경우 (예: 보드 밖으로 드래그) 함수 종료
    if (!destination) return;

    // 호스트만 카드 이동 가능
    if (!isHost) {
      alert("호스트만 카드를 이동할 수 있습니다.");
      return;
    }

    const newSections = Array.from(sections);
    const sourceSection = newSections.find(
      (section) => section.id === source.droppableId
    );
    const destSection = newSections.find(
      (section) => section.id === destination.droppableId
    );

    if (sourceSection && destSection) {
      const [movedCard] = sourceSection.cards.splice(source.index, 1);
      destSection.cards.splice(destination.index, 0, movedCard);
      setSections(newSections);

      socket.current?.emit("boardUpdate", { roomId, sections: newSections });
    }
  };

  // 새 카드 추가 함수
  const addCard = (content: string) => {
    if (content.trim() && user) {
      const creationSection = sections.find((section) => section.id === "생성");
      if (!creationSection) return;

      // 1인당 2개 카드 제한 확인
      const userCardCount = creationSection.cards.filter(
        (card) => card.userId === user.id
      ).length;
      if (userCardCount > 2) {
        alert("생성 섹션에는 1인당 최대 2개의 카드만 추가할 수 있습니다.");
        setIsAddingCard(false);
        setNewCardContent("");
        return;
      }

      // 생성 섹션 7개 카드 제한 확인
      if (creationSection.cards.length > 7) {
        alert("생성 섹션에는 최대 7개의 카드만 추가할 수 있습니다.");
        setIsAddingCard(false);
        setNewCardContent("");
        return;
      }

      const newCard: KanbanCard = {
        id: Date.now().toString(),
        content: content,
        profile: user.profile,
        userId: user.id,
      };

      const newSections = sections.map((section) =>
        section.id === "생성"
          ? { ...section, cards: [...section.cards, newCard] }
          : section
      );

      setSections(newSections);
      setIsAddingCard(false);
      setNewCardContent("");

      // 서버에 새 카드 추가 이벤트 전송
      socket.current?.emit("addCard", {
        roomId,
        sectionId: "생성",
        card: newCard,
      });
    }
  };

  // 카드 추가 버튼 클릭 핸들러
  const handleAddCardClick = () => {
    setIsAddingCard(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // 카드 내용 입력 핸들러
  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCardContent(e.target.value.slice(0, 10));
  };
  // 카드 입력 키 이벤트 핸들러
  const handleCardInputKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && newCardContent.trim()) {
      addCard(newCardContent);
    } else if (e.key === "Escape") {
      setIsAddingCard(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container w-[1177px] h-[718px] mx-auto px-4  mt-5 mb-[120px] flex flex-grow">
      <div className="flex flex-col w-[100%]">
        <div className="flex-grow border-2 border-yellow-200 bg-yellow-50 p-2 mb-2 rounded-[20px]">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-10 relative">
              {sections.map((section, index) => (
                <div key={section.id} className="flex-1 px-2">
                  <div className="border-2 border-yellow-200 rounded-[20px] flex justify-center m-1 pt-3 bg-white">
                    <h5 className="text-center mb-3">{section.title}</h5>
                  </div>
                  <div className="relative flex gap-10">
                    <Droppable droppableId={section.id}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="min-h-[500px] flex-1 overflow-auto"
                        >
                          {section.cards.map((card, index) => (
                            <Draggable
                              key={String(card.id)}
                              draggableId={String(card.id)}
                              index={index}
                              isDragDisabled={!isHost}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="mb-2 bg-yellow-100 border border-yellow-300 rounded shadow-md p-2 flex items-center"
                                >
                                  <p className="flex-grow">{card.content}</p>
                                  <img
                                    src={card.profile}
                                    alt="User profile"
                                    className="w-8 h-8 rounded-full ml-2"
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}

                          {section.id === "생성" &&
                            (isAddingCard ? (
                              <div className="mb-2 bg-yellow-200 border border-yellow-300 rounded shadow-md p-2 h-[51px]">
                                <input
                                  ref={inputRef}
                                  type="text"
                                  placeholder="새 카드 내용 (10자 이내)"
                                  value={newCardContent}
                                  onChange={handleCardInputChange}
                                  onKeyDown={handleCardInputKeyPress}
                                  className="w-full bg-transparent border-none focus:outline-none"
                                />
                              </div>
                            ) : (
                              <div className="flex justify-center">
                                <button
                                  onClick={handleAddCardClick}
                                  className="bg-white py-2 px-4 rounded border border-gray-300 hover:bg-gray-100 w-24"
                                >
                                  <img
                                    src="/images/Vector-Stroke.png"
                                    alt="addcard-button"
                                  />
                                </button>
                              </div>
                            ))}
                        </div>
                      )}
                    </Droppable>
                    {index < sections.length - 1 && (
                      <div className="absolute top-0 bottom-0 right-[-20px] w-px bg-yellow-300"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </DragDropContext>
        </div>

        <div className="w-full border-2 border-yellow-200 rounded-[20px] bg-white">
          <RoomInfo
            uuid={roomId}
            socket={socket.current}
            members={members}
            isHost={isHost}
          />
        </div>
      </div>
      <div className="flex flex-col w-[280px] h-full ml-2 border-2 border-yellow-200 rounded-[20px] bg-white">
        <div className="flex-1 overflow-y-auto p-4">
          <MemberList members={members} />
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
