import React, { useState, useEffect } from "react";
import {
  Container,
  Navbar,
  Nav,
  Button,
  Card,
  Row,
  Col,
  Modal,
  Form,
  Pagination,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useRoom } from "../../hooks/useRoom";
import CreateRoomModal from "../../components/CreateRoomModal";

interface Room {
  id: string;
  name: string;
  type: "chat" | "kanban";
  participants: string[];
}

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const { room, createRoom, fetchRoom } = useRoom();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filter, setFilter] = useState<"all" | "chat" | "kanban">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(6);

  useEffect(() => {
    // 실제 애플리케이션에서는 여기서 모든 룸 목록을 가져오는 API를 호출해야 합니다.
  }, []);

  useEffect(() => {
    setRooms(
      rooms.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      )
    );
  }, [rooms]);

  const handleCreateRoom = (roomData: any) => {
    const newRoomId = createRoom(roomData.topic, roomData.type);
    setRooms([
      ...rooms,
      {
        id: newRoomId,
        name: roomData.topic,
        type: roomData.type,
        participants: [],
      },
    ]);
    setShowCreateModal(false);
    navigate(`/${roomData.type}/${newRoomId}`);
  };

  const filteredRooms = rooms.filter(
    (room) => filter === "all" || room.type === filter
  );

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const totalPages = Math.max(
    Math.ceil(filteredRooms.length / roomsPerPage),
    1
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Container className="mt-4 ">
      <h3 className="mb-4"> 베리 생각열매 </h3>
      <h5 className="mb-20"> 당신의 생각을 보여주세요.</h5>
      <Row className="mb-4">
        <Col>
          <Button
            variant={filter === "all" ? "primary" : "outline-primary"}
            onClick={() => setFilter("all")}
            className="me-2"
            style={{
              backgroundColor: filter === "all" ? "black" : "lightgray",
              borderColor: filter === "all" ? "black" : "lightgray",
              color: filter === "all" ? "white" : "black",
              borderRadius: "20px",
            }}
          >
            전체{" "}
          </Button>
          <Button
            variant={filter === "chat" ? "primary" : "outline-primary"}
            onClick={() => setFilter("chat")}
            style={{
              backgroundColor: filter === "chat" ? "black" : "lightgray",
              borderColor: filter === "chat" ? "black" : "lightgray",
              color: filter === "chat" ? "white" : "black",
              borderRadius: "20px",
            }}
            data-bs-toggle="popover"
            data-bs-placement="top"
            title="브레인스토밍 채팅"
            data-bs-content="채팅"
          >
            베리 톡
          </Button>{" "}
          <Button
            variant={filter === "kanban" ? "primary" : "outline-primary"}
            onClick={() => setFilter("kanban")}
            style={{
              backgroundColor: filter === "kanban" ? "black" : "lightgray",
              borderColor: filter === "kanban" ? "black" : "lightgray",
              color: filter === "kanban" ? "white" : "black",
              borderRadius: "20px",
            }}
            data-bs-toggle="popover"
            data-bs-placement="top"
            title="포스트잇 보드"
            data-bs-content="칸반보드 형태"
          >
            베리 보드
          </Button>
        </Col>
        <Col className="text-end">
          <Button variant="secondary" onClick={() => setShowCreateModal(true)}>
            만들기 +
          </Button>
        </Col>
      </Row>
      <section className="bg-teal-50 h-[100vh] mt-10">
        <Row xs={1} md={2} lg={3} className="g-4 mb-4">
          {currentRooms.length > 0 ? (
            currentRooms.map((room) => (
              <Col key={room.id}>
                <Card>
                  <Card.Body>
                    <Card.Title>{room.name}</Card.Title>
                    <Card.Text>
                      타입: {room.type === "chat" ? "베리 톡" : "베리 보드"}
                      <br />
                      참여자: {room.participants.length}
                    </Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/${room.type}/${room.id}`)}
                    >
                      참여하기
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <p className="d-flex justify-content-center">
                현재 진행 중인 룸이 없습니다. 새로운 주제로 대화해 볼까요?
              </p>
            </Col>
          )}
        </Row>
      </section>
      <section className="">
        {/* Pagination */}
        <Row className="m-4">
          <Col className="d-flex justify-content-center">
            <Pagination>
              <Pagination.First
                onClick={() => paginate(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              />

              {[...Array(totalPages)].map((_, index) => {
                if (
                  index + 1 === currentPage ||
                  index + 1 === currentPage - 1 ||
                  index + 1 === currentPage + 1 ||
                  index + 1 === 1 ||
                  index + 1 === totalPages
                ) {
                  return (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  );
                } else if (
                  index + 1 === currentPage - 2 ||
                  index + 1 === currentPage + 2
                ) {
                  return <Pagination.Ellipsis key={index} />;
                }
                return null;
              })}

              <Pagination.Next
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => paginate(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </Col>
        </Row>
      </section>

      <CreateRoomModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onCreate={handleCreateRoom}
      />
    </Container>
  );
};

export default MainPage;
