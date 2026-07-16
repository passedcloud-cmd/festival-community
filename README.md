# 🌸 LocalHub (서울) - 실시간 봄꽃 축제 혼잡도 커뮤니티
 
> 이 프로젝트는 서울 지역의 주민과 관광객들이 공공데이터와 실시간 사용자 제보를 바탕으로 벚꽃 축제 현장의 혼잡도를 실시간으로 파악하고, AI 비서를 통해 축제 정보를 맞춤형으로 안내받을 수 있는 **서버리스(Serverless) 정적 SPA 커뮤니티**입니다.

---

## 🔗 1. 데모 및 배포 링크
* **실시간 배포 URL:** [👉 https://festival-community.netlify.app/](https://festival-community.netlify.app/) 

---

## 🛠️ 2. 기술 스택 (Tech Stack)
* **Frontend:** Vue.js 3 (Vite), Leaflet.js (지도 시각화)
* **Database:** Browser LocalStorage (No-DB 단일 클라이언트 데이터 저장소)
* **AI Engine:** Google Gemini 1.5 Flash API (무료 티어 및 정적 SPA 직접 통신 구현)
* **Deployment:** Netlify

---

## 🚀 3. 실행 방법 (Quick Start) - 가장 중요!

이 프로젝트를 처음 다운로드한 사람도 아래 단계를 그대로 따라 하면 로컬 컴퓨터에서 즉시 실행할 수 있습니다.

### ⭐ 저장소 복제 및 패키지 설치
```bash
# 1. 프로젝트 복제
git clone https://github.com/passedcloud-cmd/festival-community

# 2. 필수 의존성 패키지 설치
npm install

# 3. 환경 변수 설정
.env.example 파일 참고해서 본인의 API 첨부

# 4. 로컬 개발 서버 구동
npm run dev

---

## 📌 4. 구현 기능 (MVP 기준)
익명 커뮤니티 게시판 CRUD ( O )
OpenAI 챗봇 ( X ) -> 반복되는 오류로 Gemini로 대체
서울 축제 데이터 연동 ( O )
Netlify 배포 ( O )
산출물 작성 ( O )
축제 테마별 카테고리 분류 ( O )
집단지성 혼잡도 제보 ( O )
실시간 혼잡도 지도 시각화 ( O )
게시글 검색 및 태그 ( O )

---

## 📂 5. 프로젝트 폴더 구조
```Plaintext
├── src/
│   ├── assets/
│   │   └── data/
│   │       └── 서울_축제공연행사.json      # 73개 공공데이터 원본 (챗봇 지식베이스)
│   ├── components/
│   │   ├── FestivalMap.vue             # [지도] 4월 3일 5대장 필터링 및 실시간 마커 연동 컴포넌트
│   │   └── ChatbotWidget.vue           # [AI] Gemini API 기반 가이드라인 주입형 챗봇 컴포넌트
│   ├── App.vue
│   └── main.js
├── .env                                # Gemini API 키 저장용 환경 변수 파일 (Git 관리 대상 제외)
├── .env.example                        # 환경 변수 구조 가이드용 백업 파일 (Git 업로드용)
└── README.md
```

---

## 👥 6. 팀 구성 및 역할
- 윤정현
  - JSON 데이터 연동
  - 메인 화면
  - 공통 컴포넌트
- 김정연
  - 익명 게시판 CRUD
  - localStorage
  - 게시글 검색 및 태그
- 양원석
  - AI 챗봇
  - Leaflet 지도
  - 혼잡도 시각화
 
---

## 🤝 7. 협업 방식 및 팀 그라운드 룰
- 데일리 스크럼
  - 매일 짧은 스크럼으로 진행 상황과 이슈 공유
- 갈등 해결 규칙
  - 의견 충돌 시 근거 기반 논의 후 다수결로 신속 결정
- 역할 분담 원칙
  - 강점 기반 역할 분담 + 상호 리뷰로 책임 공유
