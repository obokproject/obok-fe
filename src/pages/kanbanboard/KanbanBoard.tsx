import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import RoomInfo from "../../components/RoomInfo";
import MemberList from "../../components/MemberList";
import { randomBytes } from "crypto";

// 칸반 보드의 각 카드를 나타내는 인터페이스
interface KanbanCard {
  id: string; // 카드의 고유 식별자
  content: string; // 카드의 내용
  user: User; // 카드 작성자의 프로필 이미지 URL
}

// 칸반 보드의 각 열(column)을 나타내는 인터페이스
interface KanbanColumn {
  id: string; // 열의 고유 식별자
  title: string; // 열의 제목 (예: "생성", "고민", "채택")
  cards: KanbanCard[]; // 해당 열에 속한 카드들의 배열
}

// KanbanBoard 컴포넌트의 props 인터페이스
interface KanbanBoardProps {
  roomId: string; // 현재 방의 ID
  keywords: string[]; // 하이라이트할 키워드 배열
}

interface User {
  id: number;
  nickname: string;
  profile_image: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ roomId, keywords }) => {
  // 칸반 보드의 상태를 관리하는 state
  const [columns, setColumns] = useState<KanbanColumn[]>([
    { id: "column-1", title: "생성", cards: [] },
    { id: "column-2", title: "고민", cards: [] },
    { id: "column-3", title: "채택", cards: [] },
  ]);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [addingCardTo, setAddingCardTo] = useState<string | null>(null);
  const [newCardContent, setNewCardContent] = useState("");

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // 드래그 앤 드롭이 끝났을 때 실행되는 함수
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // 유효하지 않은 목적지인 경우 (예: 보드 밖으로 드래그) 함수 종료
    if (!destination) return;

    // 같은 열 내에서의 이동
    if (source.droppableId === destination.droppableId) {
      const column = columns.find((col) => col.id === source.droppableId);
      if (column) {
        const newCards = Array.from(column.cards);
        const [reorderedItem] = newCards.splice(source.index, 1);
        newCards.splice(destination.index, 0, reorderedItem);

        // 상태 업데이트
        const newColumns = columns.map((col) =>
          col.id === source.droppableId ? { ...col, cards: newCards } : col
        );

        setColumns(newColumns);
      }
    } else {
      // 다른 열로의 이동
      const sourceColumn = columns.find((col) => col.id === source.droppableId);
      const destColumn = columns.find(
        (col) => col.id === destination.droppableId
      );
      if (sourceColumn && destColumn) {
        const sourceCards = Array.from(sourceColumn.cards);
        const destCards = Array.from(destColumn.cards);
        const [movedItem] = sourceCards.splice(source.index, 1);
        destCards.splice(destination.index, 0, movedItem);

        // 상태 업데이트
        const newColumns = columns.map((col) => {
          if (col.id === source.droppableId) {
            return { ...col, cards: sourceCards };
          }
          if (col.id === destination.droppableId) {
            return { ...col, cards: destCards };
          }
          return col;
        });

        setColumns(newColumns);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 새 카드를 추가하는 함수
  const addCard = (columnId: string, content: string) => {
    if (content.trim() && currentUser) {
      const newCard: KanbanCard = {
        id: Date.now().toString(),
        content: content,
        user: currentUser,
      };
      const newColumns = columns.map((col) =>
        col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
      );
      setColumns(newColumns);
      setAddingCardTo(null);
      setNewCardContent("");
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddCardClick = (columnId: string) => {
    setAddingCardTo(columnId);
    setNewCardContent("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCardContent(e.target.value.slice(0, 10));
  };

  const handleCardInputKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    columnId: string
  ) => {
    if (e.key === "Enter" && newCardContent.trim()) {
      addCard(columnId, newCardContent);
    } else if (e.key === "Escape") {
      setAddingCardTo(null);
    }
  };

  //입력 필드 외부 클릭 시 입력 모드를 취소
  const handleClickOutside = (e: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
      setAddingCardTo(null);
    }
  };

  // 현재 사용자 정보를 가져오는 함수 (실제 구현 필요)
  const fetchCurrentUser = async () => {
    // TODO: 백엔드 API를 호출하여 현재 로그인한 사용자 정보를 가져옴
    try {
      const response = await fetch("/api/currentUser");
      const userData = await response.json();
      setCurrentUser(userData);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      // 에러 처리 로직 추가 (예: 사용자에게 알림)
    }
  };

  return (
    <Container fluid className="h-100 d-flex flex-column">
      {/* Kanban board layout starts here */}
      <Row className="flex-grow-1">
        <Col className="d-flex flex-column border-4 ml-3 border-yellow-200 p-2 rounded-lg bg-yellow-50">
          <DragDropContext onDragEnd={onDragEnd}>
            {/* Row to contain all columns */}
            <Row className="flex-grow-1">
              {columns.map((column) => (
                <Col key={column.id}>
                  {/* Column title */}
                  <div className="border-red-200 rounded-2xl border-3 d-flex justify-center m-1 pt-3 bg-white">
                    <h5 className="text-center mb-3">{column.title}</h5>
                  </div>
                  {/* Droppable area for cards */}
                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="kanban-column"
                        style={{
                          minHeight: "500px", // Minimum height for column
                        }}
                      >
                        {/* Map through cards in the column */}
                        {column.cards.map((card, index) => (
                          <Draggable
                            key={card.id}
                            draggableId={card.id}
                            index={index}
                          >
                            {(provided) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="mb-2"
                                style={{
                                  backgroundColor: "#fef68a", // Lighter yellow for Post-it note effect
                                  borderColor: "#fdd835", // Darker yellow for border
                                  boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow for lifted effect
                                }}
                              >
                                {/* Card content with user info */}
                                <Card.Body className="d-flex align-items-center">
                                  <img
                                    src={card.user.profile_image}
                                    alt={`${card.user.nickname}'s profile`}
                                    style={{
                                      width: "30px",
                                      height: "30px",
                                      borderRadius: "50%",
                                      marginRight: "10px",
                                    }}
                                  />
                                  <div>
                                    <Card.Text>{card.content}</Card.Text>
                                    <small className="text-muted">
                                      {card.user.nickname}
                                    </small>
                                  </div>
                                </Card.Body>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {/* Conditionally render the input field if a card is being added */}
                        {addingCardTo === column.id ? (
                          <Card
                            className="mb-2"
                            style={{
                              backgroundColor: "#fef68a",
                              borderColor: "#fdd835",
                              boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <Card.Body className="d-flex flex-column">
                              <Form.Control
                                ref={inputRef}
                                type="text"
                                placeholder="새 카드 내용 (10자 이내)"
                                value={newCardContent}
                                onChange={handleCardInputChange}
                                onKeyDown={(e) =>
                                  handleCardInputKeyPress(e, column.id)
                                }
                                style={{
                                  backgroundColor: "inherit", // Maintain Post-it background
                                  border: "none", // Remove default border
                                  boxShadow: "none", // Remove shadow
                                  marginBottom: "5px", // Space before character count
                                }}
                              />
                              <small
                                style={{
                                  alignSelf: "flex-end",
                                  color: "#666",
                                  fontSize: "12px",
                                  marginTop: "auto",
                                }}
                              >
                                {newCardContent.length}/10
                              </small>
                            </Card.Body>
                          </Card>
                        ) : (
                          /* Button to add new card */
                          <div className="d-flex justify-content-center">
                            <button
                              className="btn"
                              onClick={() => handleAddCardClick(column.id)}
                              style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                color: "#333",
                                backgroundColor: "#fff",
                                padding: "10px 20px",
                                borderRadius: "5px",
                                textDecoration: "none",

                                borderColor: "#ddd",
                                borderStyle: "solid",

                                cursor: "pointer",
                              }}
                            >
                              + 카드 추가
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </Col>
              ))}
            </Row>
          </DragDropContext>
        </Col>
        <Col md={3} className="border-left">
          <MemberList />
        </Col>
      </Row>
      <Row>
        <Col>
          <RoomInfo
            title="Sample Room Title"
            creator={{ name: "Creator Name", job: "Creator Job" }}
            participants={5}
            maxParticipants={10}
            openTime="09:00"
            closeTime="18:00"
            keywords={keywords}
            duration={60}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default KanbanBoard;
