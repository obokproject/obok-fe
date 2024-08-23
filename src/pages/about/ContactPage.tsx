import React, { useState } from "react";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import axios from "axios";

const sendEmailToAdmin = async (data: {
  email: string;
  nickname: string;
  type: string;
  content: string;
}) => {
  const response = await axios.post("/api/send", data);
  return response.data;
};

const ContactPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [inquiryType, setInquiryType] = useState("");
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSending(true);
    setSendResult(null);

    try {
      await sendEmailToAdmin({
        email,
        nickname,
        type: inquiryType,
        content,
      });
      setSendResult("이메일이 성공적으로 전송되었습니다.");
      // 폼 초기화
      setEmail("");
      setNickname("");
      setContent("");
      setInquiryType("");
    } catch (error) {
      setSendResult("이메일 전송에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <h2 className="text-center mt-5 mb-4">문의하기</h2>
          <div className="p-4 border rounded">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>이메일</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>닉네임</Form.Label>
                <Form.Control
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>문의 유형</Form.Label>
                <Form.Select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  required
                >
                  <option value="">선택해주세요</option>
                  <option value="general">일반 문의</option>
                  <option value="technical">기술 지원</option>
                  <option value="billing">결제 문의</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>문의 내용</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button variant="primary" type="submit" disabled={isSending}>
                  {isSending ? "전송 중..." : "이메일 보내기"}
                </Button>
              </div>
            </Form>
          </div>
          {sendResult && (
            <Alert
              variant={sendResult.includes("성공") ? "success" : "danger"}
              className="mt-3"
            >
              {sendResult}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ContactPage;
