import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Instagram } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const linkClasses =
    "inline-block text-[#323232] hover:text-blue-600 hover:scale-110 transform transition-all duration-200 no-underline";

  return (
    <footer className="p-[40px] mt-auto h-[300px] bg-gray-100">
      <Container>
        <Row>
          <Col md={8} className="mb-4">
            <h5 className="mt-2 mb-4 text-xl font-bold">라즈베리</h5>
            <p className="mb-4 text-base font-medium">
              서울시 강남구 역삼로 160 9층
            </p>
          </Col>
          <Col md={2} className="mb-3">
            <h6 className="mb-4 font-bold">바로가기</h6>
            <ul className="space-y-4">
              <li>
                <Link
                  to="https://www.instagram.com/razvery_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClasses}
                >
                  <Instagram className="hover:scale-125" />
                </Link>
              </li>
              <li>
                <Link to="/about" className={linkClasses}>
                  소개
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={2} className="mb-3">
            <h6 className="mb-4 font-bold"> 법적 고지</h6>
            <ul className="space-y-4">
              <li>
                <Link
                  to="https://glitter-juniper-6f6.notion.site/1b776b68933f4879ad42d758f324950a"
                  className={linkClasses}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  to="https://glitter-juniper-6f6.notion.site/c1627b068c3d4453abe5fc9f56f49eb9"
                  className="text-[#323232] hover:text-blue-600 transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </Col>
        </Row>
        <div className="flex justify-between items-center mt-8">
          <p className="text-sm">
            RazVery &copy; {currentYear} All rights reserved.
          </p>
          <div className="relative">
            <Link
              to="http://tmdedu.com/"
              className="flex items-center p-2 hover:text-blue-500
              no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div
                className="pr-2 flex pl-3 pt-2 pb-2 items-center bg-[#ffb561] rounded-full"
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
