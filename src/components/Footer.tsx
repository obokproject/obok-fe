import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Instagram } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="p-[40px] mt-auto h-[300px] bg-gray-100">
      <Container>
        <Row className="col-span-2">
          <Col md={8} className="mb-3 flex flex-column justify-between">
            <h5 className="mt-2 mb-4 text-xl">라즈베리</h5>
            <p className="mb-4 text-base font-medium">
              주소 : 서울시 강남구 역삼로 160 9층
            </p>
          </Col>
          <Col md={2} className="mb-3">
            <h6 className="mb-4">▼ 바로가기</h6>
            <ul>
              <li>
                <Link
                  to="https://www.instagram.com/razvery_/"
                  className="text-muted"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram />
                </Link>
              </li>
              <li className="mt-4">
                <Link
                  to="/about"
                  className="text-muted"
                  style={{ textDecoration: "none" }}
                >
                  소개
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={2} className="mb-3 mb-md-0">
            <h6 className="mb-4">▼ 법적 고지</h6>
            <ul>
              <li>
                <Link
                  to="https://glitter-juniper-6f6.notion.site/1b776b68933f4879ad42d758f324950a"
                  className="text-muted"
                  style={{ textDecoration: "none" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  이용약관
                </Link>
              </li>
              <li className="mt-4">
                <Link
                  to="https://glitter-juniper-6f6.notion.site/c1627b068c3d4453abe5fc9f56f49eb9"
                  className="text-muted"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </Col>
        </Row>
        <div className="flex justify-between items-center pr-[40px]">
          <p className="mb-4 text-sm">
            RazVery &copy; {currentYear} All rights reserved.
          </p>
          <div className="relative">
            <Link
              to="http://tmdedu.com/"
              className="flex items-center p-2 hover:text-gray-300 text-dark
               "
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              <div
                className="p-2 flex items-center bg-[#ffb561] rounded-full  "
                style={{ width: "136px" }}
              >
                Family Sites <Plus />
              </div>
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
