import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  InputGroup,
  ButtonGroup,
  Row,
  Col,
} from "react-bootstrap";

interface CreateRoomModalProps {
  show: boolean;
  onHide: () => void;
  onCreate: (roomData: any) => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  show,
  onHide,
  onCreate,
}) => {
  const [roomType, setRoomType] = useState<"chat" | "kanban">("chat");
  const [topic, setTopic] = useState("");
  const [participants, setParticipants] = useState(4);
  const [duration, setDuration] = useState(5);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState("");

  const handleCreate = () => {
    onCreate({
      type: roomType,
      topic,
      participants,
      duration,
      keywords,
    });
    onHide();
  };

  const addKeyword = () => {
    if (
      currentKeyword &&
      keywords.length < 3 &&
      !keywords.includes(currentKeyword)
    ) {
      setKeywords([...keywords, currentKeyword]);
      setCurrentKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      id="staticBackdrop"
      backdrop="static"
      keyboard={false}
      aria-labelledby="staticBackdropLabel"
    >
      <Modal.Header>
        <Modal.Title className="w-100 text-center">프로젝트 만들기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ButtonGroup className="mb-3 d-flex justify-content-center">
          <Button
            variant="secondary"
            active={roomType === "chat"}
            onClick={() => setRoomType("chat")}
          >
            베리 톡
          </Button>
          <Button
            variant="secondary"
            active={roomType === "kanban"}
            onClick={() => setRoomType("kanban")}
          >
            베리 보드
          </Button>
        </ButtonGroup>

        <div className="flex flex-row bg-gray-300 rounded-md overflow-hidden ">
          <div className="bg-gray-300 flex items-center justify-center pt-3 ">
            <p className="text-gray-700 border-r-4 w-20 font-semibold pl-1 h-full">
              주제
            </p>
          </div>
          <div className="flex-grow">
            <input
              type="text"
              className="w-full px-3 py-2 bg-gray-300 text-gray-700 focus:outline-none"
              placeholder="공유하고 싶은 주제를 입력하세요"
            />
          </div>
        </div>

        <Form>
          <Form.Group className="mb-3 flex flex-row">
            <Form.Label className="w-20">주제</Form.Label>
            <Form.Control
              type="text"
              placeholder="공유하고 싶은 주제를 정해보세요(20자)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              maxLength={20}
            />
          </Form.Group>

          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>인원</Form.Label>
                <Form.Control
                  type="number"
                  min={2}
                  max={10}
                  value={participants}
                  onChange={(e) => setParticipants(Number(e.target.value))}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>제한 시간 (분)</Form.Label>
                <Form.Control
                  type="number"
                  min={5}
                  max={20}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>키워드</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="#키워드 입력 (2-8자, 최대 3개)"
                value={currentKeyword}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const filteredValue = inputValue.replace(
                    /[^a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ]/g,
                    ""
                  );
                  setCurrentKeyword(filteredValue);
                }}
                maxLength={8}
              />
              <Button
                variant="outline-secondary"
                onClick={addKeyword}
                disabled={keywords.length >= 3}
              >
                추가
              </Button>
            </InputGroup>
          </Form.Group>

          <div className="mt-2">
            {keywords.map((keyword, index) => (
              <Button
                key={index}
                variant="outline-primary"
                className="me-2 mb-2"
                onClick={() => removeKeyword(keyword)}
              >
                #{keyword} ✕
              </Button>
            ))}
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="secondary" onClick={onHide}>
          취소
        </Button>
        <Button variant="primary" onClick={handleCreate}>
          만들기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateRoomModal;
