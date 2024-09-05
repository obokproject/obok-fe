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

// const SERVER_URL =
//   process.env.REACT_APP_NODE_ENV_PROD || process.env.REACT_APP_NODE_ENV;

// 칸반 보드의 각 카드를 나타내는 인터페이스
interface KanbanCard {
  id: string; // 카드의 고유 식별자
  content: string; // 카드의 내용
  profile: string; // 카드 작성자의 프로필 이미지 URL
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
  const [room, setRoom] = useState<any>(null);
  const { loading, error, fetchRoom } = useRoom(roomId); // 방 정보 훅
  const [sections, setSections] = useState<KanbanSection[]>(SECTIONS);
  const [newCardContent, setNewCardContent] = useState("");
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [creator, setCreator] = useState({ name: "", job: "" });
  const [userRole, setUserRole] = useState<string>("guest");

  // socket.io 연결 설정
  const socket = useRef<ReturnType<typeof io> | null>(null); // socket.io 연결을 관리하는 ref
  const inputRef = useRef<HTMLInputElement>(null);

  // useEffect hook: roomId, user가 변경될 때만 useEffect hook을 실행
  useEffect(() => {
    if (roomId && user) {
      fetchRoom(roomId);

      // WebSocket 연결 초기화
      // socket.current = io(SERVER_URL as string, {
      //   transports: ["websocket"],
      // });

      socket.current = io("http://localhost:5000", {
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
          console.log("Received member update:", updatedMembers);
          setMembers(updatedMembers);
        });

        socket.current?.on("roomInfo", (info) => {
          console.log(">>>>>>>>>>>>>>>>");
          console.log(info);
          console.log("info : '" + info + "'");
          setRoom(info);
          setCreator(info.creator || { name: "", job: "" });

          // 사용자의 role 설정
          const currentUserMember = info.members.find(
            (member: any) => member.id === user.id
          );
          setUserRole(currentUserMember?.role || "guest");
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

      // // creator 정보 설정
      // if (room && room.User) {
      //   setCreator({
      //     name: room.User.username || "",
      //     job: room.User.job || "",
      //   });
      // }

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
    if (userRole !== "host") return;
    const { source, destination } = result;

    // 유효하지 않은 목적지인 경우 (예: 보드 밖으로 드래그) 함수 종료
    if (!destination) return;

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
      const newCard: KanbanCard = {
        id: Date.now().toString(),
        content: content,
        profile: user.profile,
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
    setNewCardContent(e.target.value.slice(0, 80));
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
  // 카드 삭제 핸들러
  const deleteCard = (sectionId: string, cardId: string) => {
    if (userRole !== "host") return;

    const newSections = sections.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            cards: section.cards.filter((card) => card.id !== cardId),
          }
        : section
    );

    setSections(newSections);
    socket.current?.emit("boardUpdate", { roomId, sections: newSections });
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
                              key={card.id}
                              draggableId={card.id}
                              index={index}
                              isDragDisabled={userRole !== "host"}
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
                                  {userRole === "host" && (
                                    <button
                                      onClick={() =>
                                        deleteCard(section.id, card.id)
                                      }
                                      className="ml-2 text-red-500 hover:text-red-700"
                                    >
                                      X
                                    </button>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}

                          {section.id === "생성" &&
                            (isAddingCard ? (
                              <div className="mb-2 bg-yellow-200 border border-yellow-300 rounded shadow-md p-2">
                                <input
                                  ref={inputRef}
                                  type="text"
                                  placeholder="새 카드 내용 (80자 이내)"
                                  value={newCardContent}
                                  onChange={handleCardInputChange}
                                  onKeyDown={handleCardInputKeyPress}
                                  className="w-full bg-transparent border-none focus:outline-none"
                                />
                                <small className="text-gray-600 text-right block">
                                  {newCardContent.length} / 7
                                </small>
                              </div>
                            ) : (
                              <div className="flex justify-center">
                                <button
                                  onClick={handleAddCardClick}
                                  className="bg-white text-gray-800 font-bold py-2 px-4 rounded border border-gray-300 hover:bg-gray-100"
                                >
                                  + 카드 추가
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

        <div className="w-full p-4 border-2 border-yellow-200 rounded-[20px] bg-white">
          <RoomInfo uuid={roomId} socket={socket.current} />
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
