# Razvery - 프론트엔드

"Razvery"는 실시간으로 아이디어를 공유하는 서비스입니다. 제한 시간이 있는 채팅과 포스트잇 보드 형태가 핵심 기능입니다.
<br>
관리자 백오피스 구축으로 직관적인 대시보드로 핵심 지표 실시간 모니터링이 가능하여 사용자 관리가 용이합니다.
<br>

### 목차

1. 프로젝트 소개
2. 팀 소개 및 링크
3. 프로젝트 기획(FE)
4. 기술 스택 및 라이브러리
5. 시현 영상(FE)
6. WBS(FE)
7. 폴더 구조
8. 페이지 및 URL 구조(FE)
9. 시퀀스 다이어그램(BE)
10. 클래스 다이어그램(BE)
11. ERD(BE)
12. AWS배포(BE)
13. 트러블 슈팅
14. 회고(BE)

## 팀 소개

- 기획팀: 김상윤, 윤상수
- 개발팀: 박초롱, 변윤석
  <br>
  링크 <br>
- url: [Razvery 🍓](https://razvery.link/) <br>
- Frontend: https://github.com/obokproject/razvery-fe <br>
- Backend: https://github.com/obokproject/be-test <br>

## 프로젝트 기획

- 경쟁사 분석<br>
- 기능정의서<br>
- 유저저니맵, 페르소나<br>
- 화면흐름도<br>
- [코딩 컨벤션/ 폴더구조/ GitHub 전략](https://mathdev-park.notion.site/GitHub-Flow-32f89991bd0442eca822662076da1a9c?pvs=4)

<br>

## 기술 스택 및 라이브러리

- <img src="https://img.shields.io/badge/REACT-61DAFB?style=for-the-badge&logo=react&logoColor=black">
- <img src="https://img.shields.io/badge/TailwindCSS-1572B6?style=for-the-badge&logo=TailwindCSS&logoColor=white">
- <img src="https://img.shields.io/badge/bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white">

## 시현영상

![video1](https://github.com/user-attachments/assets/da4bc760-0bbd-498a-9e8f-1a6e36ac02c7)
<br>

![video2](https://github.com/user-attachments/assets/5c08e161-8ed9-470b-89ad-38c8372d08b7)
<br>

## WBS

```mermaid
gantt
title 프로젝트 일정
dateFormat  YYYY-MM-DD

section 프로젝트관리
팀빌딩과 아이디어 도출 :a1, 2024-07-22, 5d
Kick-off Meeting     :a2, 2024-07-29, 5d

section 기획
아이데이션    :2024-08-01, 4d
린캔버스 :2024-08-04, 6d
경쟁사 분석 :2024-08-07, 2d
페르소나 유저저니맵 : 2024-08-07, 2d
정보구조도(IA) 작성 :2024-08-09, 1d
기능정의서 : 2024-08-010, 3d
정책정의서, 프로우차트 작성 : 2024-08-11, 6d
와이어프레임(화면 스케치) : 2024-08-16, 6d
와이어프레임(추가기획) 화면 확정 : 2024-08-21, 5d
프로토타입 및 중간발표: 2024-08-26, 5d
UI 디자인 : 2024-09-01, 5d

section QA
QA 계획수립 : 2024-09-04, 2d
작성 및 환경설정 :2024-09-05, 2d
시장 반응 테스트 :  2024-09-06, 2d
최종검토 및 릴리즈 : 2024-09-07, 2d

section 개발-아키텍처 설계
기술 스택 확정 :2024-08-16, 1d
구조 설계 :2024-08-19, 1d
개발 환경 설정 :2024-08-19, 1d

section 개발-백엔드
Express.js 서버 설정 :2024-08-20, 1d
데이터베이스 스키마 설계 :2024-08-20, 3d
소셜 로그인 구현 :2024-08-20, 3d
사용자 인증 및 세션 관리 :2024-08-20, 4d
채팅 기능 API 개발 :2024-08-22, 9d
칸반 보드 API 개발 :2024-08-29, 7d
Landingpage API 개발 :2024-08-25, 4d
Mainpage API 개발 :2024-08-25, 6d

section 개발-프론트엔드
React 초기 설정 :2024-08-20, 1d
component 구조 설계 :2024-08-20, 1d
component (Header,Footer,Modal) :2024-08-20, 2d
component(board관련) :2024-08-20, 2d
LoginModal 및 소셜 로그인 :2024-08-20, 3d
LandingPage interface :2024-08-26, 3d
ChatBoard interface(#keyword) :2024-08-22, 5d
MainPage interface :2024-08-26, 5d
KanbanBoard interface(section) :2024-08-29, 7d
UI/UX디자인 적용 및 최적화 :2024-08-29, 8d

section 통합 및 테스트
be-fe 통합 :2024-09-02, 4d
unit test 단위테스트 :2024-09-03, 4d
intergration test 통합테스트 :2024-09-07, 4d
성능 최적화 :2024-09-09, 2d

section 배포준비
AWS EC2, S3, RDS 설정 :2024-08-21, 1d
CI/CD 파이프라인 구축 :2024-08-22, 1d
Migration :2024-09-12, 2d

section 배포
스테이징 환경 배포 및 테스트 :2024-09-19, 2d
프로덕션 환경 배포 :2024-09-19, 2d
모니터링 도구 설정 및 로그 분석 :2024-09-19, 2d

section 추가구현
마이페이지 :2024-09-20, 4d
관리자페이지 :2024-09-20, 4d

section 마무리
문서화 (API 문서, 사용자 가이드) :2024-09-24, 2d
코드 리팩토링 :2024-09-24, 2d
프로젝트 회고 :2024-09-25, 1d
시현 및 발표준비 :2024-09-26, 2d
최종 발표 :milestone, 2024-09-30, 0d
```

<br>

## 폴더 구조

```bash
client/
├── github/  # GitHub 관련 설정. CI/CD 워크플로우
├── public/     # 정적 파일 (HTML, 이미지 등)
├── src/
│   ├── components/ # 재사용 가능한 React 컴포넌트
│   ├── contexts/   # AuthContext
│   ├── hooks/      # 커스텀 React Hooks
│   ├── pages/
│   │   ├── chatboard/  # 베리톡(채팅페이지)
│   │   ├── about/      # 소개페이지
│   │   ├── mypage/     # 마이페이지
│   │   ├── notfound/   # 404 Not Found 페이지
│   │   ├── kanbanboard/    # 베리보드(드래그앤드롭 페이지)
│   │   ├── landingpage/    # 랜딩페이지
│   │   └── mainpage/   # 메인페이지(보드, 톡 방들 만들거나 참여)
│   └── styles/     # 전역스타일 및 스타일 관련 파일
├── package.json
└── tsconfig.json
```

<br>

## 페이지 및 URL 구조

| 페이지      | URL             | 설명                                       | 주요 기능                                              |
| ----------- | --------------- | ------------------------------------------ | ------------------------------------------------------ |
| LandingPage | /               | 웹사이트의 메인 페이지, 로그인 및 입장하기 | - 서비스 소개<br>- 시작하기 버튼<br>- FAQ              |
| MainPage    | /main           | 로그인 후 메인 대시보드                    | - 사용자의 방 목록<br>- 새 방 만들기                   |
| ChatBoard   | /chat/:roomId   | 베리 톡(채팅방) 페이지                     | - 실시간 채팅<br>- 키워드 표시                         |
| KanbanBoard | /kanban/:roomId | 베리 보드(포스트잇) 페이지                 | - 섹션 별 카드<br>- 드래그 앤 드롭                     |
| MyPage      | /mypage         | 사용자 개인 정보 및 설정 페이지            | - 프로필 수정<br>- 활동 내역 확인                      |
| AboutPage   | /about          | 서비스 소개 및 정보 페이지                 | - 서비스 소개                                          |
| AdminPage   | /admin          | 관리자 페이지                              | - 유저 조회 및 소프트 삭제 <br>- 월별 사용자 유입 통계 |

<br>

## 트러블 슈팅

- 실시간 양방향 통신: Socket.io를 사용한 실시간 업데이트 구현
- 포스트잇 기능: react-dnd 사용, <br>
  다수의 사용자가 이동할 시에 socket안정성 문제는 호스트만 이동하는 것으로 전환
- React-beautiful-dnd가 적용되지 않는 문제: stricmode에서 적용되지 않아 제거 또는 주석처리함
- 페이지 이동시 스크롤이 고정되는 이슈 (푸터에서 페이지라우팅하면 하단에 고정)
  원인: React (SPA) Router의 기본 동작과 브라우저의 기본 동작의 충돌<br>
  해결: scrollto(0,0) 컴포넌트 추가함 <br>
  <br>
