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
  onCreate: (roomData: any) => void; // onCreate 함수가 방 생성 후 호출됩니다.
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  show,
  onHide,
  onCreate,
}) => {
  const [roomType, setRoomType] = useState<"chat" | "kanban">("chat");
  const [title, setTitle] = useState(""); // topic을 title로 변경
  const [maxMember, setMaxMember] = useState(4); // participants를 maxMember로 변경
  const [duration, setDuration] = useState(5);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState("");

  const handleCreate = () => {
    onCreate({
      type: roomType,
      title, // title로 전달
      max_member: maxMember, // max_member로 전달
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

        <Form>
          <Form.Group className="mb-3">
            <div className="d-flex bg-light">
              <Form.Label
                className="mb-0 p-2 bg-secondary text-white rounded-start"
                style={{ width: "80px", minWidth: "80px" }}
              >
                주제
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="공유하고 싶은 주제를 정해보세요(20자)"
                value={title} // topic을 title로 변경
                onChange={(e) => setTitle(e.target.value)}
                maxLength={20}
                className="bg-secondary text-white no-focus-outline"
                style={{ outline: "none", boxShadow: "none" }}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <div className="d-flex bg-light rounded">
              <Form.Label
                className="mb-0 p-2 bg-secondary text-white rounded-start"
                style={{ width: "80px", minWidth: "80px" }}
              >
                키워드
              </Form.Label>
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
                  className="border-0 bg-light"
                  style={{ outline: "none", boxShadow: "none" }}
                />
                <Button
                  variant="outline-secondary"
                  onClick={addKeyword}
                  disabled={keywords.length >= 3}
                >
                  추가
                </Button>
              </InputGroup>
            </div>
          </Form.Group>

          <Row className="mb-3">
            <Col xs={6}>
              <Form.Group>
                <div className="d-flex bg-light rounded">
                  <Form.Label
                    className="mb-0 p-2 bg-secondary text-white rounded-start"
                    style={{ width: "80px", minWidth: "80px" }}
                  >
                    인원
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min={2}
                    max={10}
                    value={maxMember} // participants를 maxMember로 변경
                    onChange={(e) => setMaxMember(Number(e.target.value))}
                    style={{ outline: "none", boxShadow: "none" }}
                  />
                </div>
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group>
                <div className="d-flex bg-light rounded">
                  <Form.Label
                    className="mb-0 p-2 bg-secondary text-white rounded-start"
                    style={{ width: "120px", minWidth: "120px" }}
                  >
                    제한 시간 (분)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min={5}
                    max={20}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    style={{ outline: "none", boxShadow: "none" }}
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

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
