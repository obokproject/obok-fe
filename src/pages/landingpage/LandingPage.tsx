import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "../../components/LoginModal";
import "../../styles/tailwind.css";
import { ArrowUp } from "react-bootstrap-icons";
import Header from "../../components/Header";
import { useAuth } from "../../contexts/AuthContext";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

// 슬라이드 이미지 데이터 (실제 이미지 URL로 교체 필요)
const slides = [
  { url: "https://picsum.photos/200/300", alt: "Image 1" },
  { url: "https://picsum.photos/200/301", alt: "Image 2" },
  { url: "https://picsum.photos/200/302", alt: "Image 3" },
  { url: "https://picsum.photos/200/303", alt: "Image 4" },
];

const LandingPage: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const { isLoggedIn, loginWithGoogle } = useAuth();
  const [current, setCurrent] = useState(0);
  const length = slides.length;
  const navigate = useNavigate();

  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);

  // 이미지 슬라이드
  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  // 스크롤 버튼 표시 로직
  useEffect(() => {
    const checkScrollTop = () => {
      setShowScrollTopButton(window.pageYOffset > window.innerHeight / 2);
    };

    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartButton = () => {
    isLoggedIn ? navigate("/main") : openLoginModal();
  };

  return (
    <>
      <Container fluid className="p-0">
        <main>
          <section className="py-5 text-center bg-light">
            <Container>
              <h1 className="display-6 mb-3">
                아이디어를 현실로 바꾸는 실시간 협업 플랫폼
              </h1>
              <p className="lead mb-4">모두와 함께 하는 브레인스토밍</p>
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartButton}
                className="d-grid gap-2 col-4 mx-auto"
              >
                시작하기
              </Button>
            </Container>
          </section>

          <section className="py-5">
            <Container>
              <div
                className="ratio ratio-16x9"
                style={{ maxWidth: "700px", margin: "0 auto" }}
              >
                <iframe
                  src="https://www.youtube.com/embed/BLFF1tla3qc"
                  title="서비스 소개 영상"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </Container>
          </section>

          <section className="py-5 mb-10 bg-red-200 text-center">
            <Container>
              <h2 className="mb-4">문제 해결</h2>
              <p>아이디어가 필요한데</p>
              <p>떠오르지 않아서 막막했던 경험</p>
              <p>한번씩 있지 않나요?</p>
              <p>그 막막했던 이유가</p>
              <p>혼자여서는 아니었을까요?</p>
              <p>Collecctive Intelligence</p>
              <p>집단 지성</p>
              <p>이제,</p>
              <p>함께 할 때입니다.</p>

              <Link to="/about" className="btn btn-outline-primary">
                자세히 알아보기
              </Link>
            </Container>
          </section>

          <section className="py-5 mb-10">
            <Container>
              <h2 className="flex justify-content-center after:"> 베리톡 </h2>
              <div
                className="position-relative"
                style={{ maxWidth: "800px", margin: "0 auto" }}
              >
                <IoIosArrowBack
                  className="position-absolute top-50 start-0 translate-middle-y"
                  style={{ cursor: "pointer", zIndex: 2 }}
                  size={30}
                  onClick={prevSlide}
                />
                <IoIosArrowForward
                  className="position-absolute top-50 end-0 translate-middle-y"
                  style={{ cursor: "pointer", zIndex: 2 }}
                  size={30}
                  onClick={nextSlide}
                />
                <Row className="justify-content-center">
                  {slides.map((slide, index) => (
                    <Col
                      key={index}
                      md={4}
                      className={`mb-3 ${
                        index === current ? "d-block" : "d-none"
                      }`}
                    >
                      <img
                        src={slide.url}
                        alt={slide.alt}
                        className="img-fluid rounded"
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            </Container>
          </section>
        </main>

        {showScrollTopButton && (
          <Button
            variant="primary"
            onClick={scrollTop}
            className="scroll-top-button"
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <ArrowUp size={24} />
          </Button>
        )}
        <LoginModal
          isOpen={showLoginModal}
          closeModal={closeLoginModal}
          loginWithGoogle={loginWithGoogle}
        />
      </Container>
    </>
  );
};

export default LandingPage;
