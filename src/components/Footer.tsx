import React from "react";
import { Container, Row, Col, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const familySites = [
    { name: "TMD", url: "http://tmdedu.com/" },
    { name: "강남구청", url: "https://www.gangnam.go.kr/" },
    { name: "서울시", url: "https://www.seoul.go.kr/" },
  ];

  return (
    <footer className="bg-gray-700 py-10 mt-auto">
      <Container>
        <Row className="align-items-center text-light">
          <Col md={5} className="mb-3 mb-md-0">
            <h5 className="mb-2">RazVery</h5>
            <p className="mb-0 small">
              사업자 등록번호: 773-82-00001 | 주소:서울시 강남구 역삼로 160 9층
            </p>
            <p className="mb-0 small">
              RazVery &copy; {currentYear} All rights reserved.
            </p>
          </Col>
          <Col md={3} className="mb-3 mb-md-0">
            <h6 className="mb-2">바로가기</h6>
            <ul>
              <li>
                <Link to="/about" className="text-light">
                  소개
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-light">
                  문의하기
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={3} className="mb-3 mb-md-0">
            <h6 className="mb-2">법적 고지</h6>
            <ul>
              <li>
                <Link to="/terms" className="text-light">
                  이용약관
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-light">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={1}>
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-light"
                id="dropdown-basic"
                size="sm"
              >
                Family Sites
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {familySites.map((site, index) => (
                  <Dropdown.Item
                    key={index}
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {site.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
