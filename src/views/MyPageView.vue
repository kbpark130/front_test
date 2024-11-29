<!-- HTML -->
<template>
    <div class="my-page">
      <!-- 홈 화면으로 돌아가기 버튼 -->
      <div class="new-post-container">
        <a @click="goToMainView" class="back-link"> ← 홈 화면으로 돌아가기</a>
      </div>
  
      <!-- 상단 제목 -->
      <header class="header">
        <h1>MY PAGE</h1>
        <p>{{ userId }}</p>
      </header>
  
  
      <!-- 박스 리스트 -->
  <div class="box-container">
    <div v-for="(box, index) in boxes" :key="index"
         :class="['box', { 'bold-text': box.type === 'written' || box.type === 'saved', active: selectedBox === index }]"
         @click="selectBox(index)">
          <!-- 아이콘 있는 경우 -->
          <template v-if="box.icon">
            <img :src="box.icon" alt="Icon" class="icon" />
            <span>{{ box.name }}</span>
          </template>
          <!-- 아이콘 없는 경우 -->
          <template v-else>
            <span>{{ box.emoji }} {{ box.name }}</span>
          </template>
        </div>
      </div>
  <!-- 박스 컨테이너 닫는 태그 -->
  
  
      <!-- 전체게시판 -->
      <div class="board-title">
        <span class="red-text">전체게시판</span>
        <span class="black-text">검색결과</span>
        <button @click="confirmDelete" class="delete-button">🗑️ 삭제</button>
      </div>
  
      <!-- 게시판 테이블 -->
      <div class="board-container">
        <table class="board-table">
          <thead>
            <tr>
              <th>선택</th>
              <th>번호</th>
              <th>제목</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredItems" :key="index">
              <td><input type="checkbox" v-model="selectedItems" :value="item.id" /></td>
              <td>{{ filteredItems.length - index }}</td>
              <td>{{ item.title }}</td>
            </tr>
          </tbody>
        </table>
      </div> <!-- 게시판 컨테이너 닫는 태그 -->
  
      <!-- 삭제 확인 모달 -->
      <div v-if="showDeleteModal" class="modal">
        <div class="modal-content">
          <p>정말로 삭제하시겠습니까?</p>
          <button @click="deleteItems" tabindex="0">확인</button>
          <button @click="showDeleteModal = false" tabindex="0">취소</button>
        </div>
      </div>
    </div> <!-- 모달 및 루트 my-page 닫는 태그 -->
  </template>
  
  <!-- JavaScript -->
  <script>
  import { ref, computed } from "vue";
  import { useRouter } from "vue-router";
  import storeIcon from "@/assets/storeicon.png";
  import bookmarkIcon from "@/assets/bookmarkicon.png";
  //import { EventBus } from '@/utils/eventBus';
  
  
  export default {
    setup() { // Composition API 코드
      const router = useRouter();
      const userId = ref("@puppy"); // 사용자 ID
      const selectedBox = ref(0); // 첫 번째 박스를 기본 선택
      const showDeleteModal = ref(false); 
      const selectedItems = ref([]); // 체크박스에서 선택된 아이템의 ID 목록을 저장
  
      // 박스 데이터
      const boxes = ref([
    { name: "내가 작성한 글", type: "written", icon: storeIcon },
    { name: "내가 쓴 댓글", type: "comments", icon: "", emoji: "✍", },
    { name: "내가 좋아요 누른 글", type: "liked", icon: "", emoji: "🩷", },
    { name: "내가 저장한 글", type: "saved", icon: bookmarkIcon },
   
  ]);
  
      // 게시물 데이터 (예시 데이터)
      const items = ref([
        { id: 1, title: "뒤김 소보로의 도시 대전에서 만난 '소보로김밥'", type: "written" },
        { id: 2, title: "수원 행궁동 맛집 '로우파이브' 후기", type: "written" },
        { id: 3, title: "수원역 카페 '라이크노아더' 디저트딸기 티라미수 추천!", type: "written" },
        { id: 4, title: "행궁동 술집 와인 마시기 좋은 '오브제' 데이트장소", type: "written" },
        { id: 5, title: "[수원 장안구 맛집] '보영만두' 북문본점", type: "written" },
        { id: 6, title: "경기대 맛집 / 족발 맛집 / '사또통족발 경기본점'", type: "written" },
        { id: 7, title: "상수 합정브런치카페 [해옫] 프렌치토스트 감성 데이트", type: "written" },
        { id: 8, title: "[해방촌 피자오] 데이트하기 좋은 피맥 맛집", type: "written" },
        { id: 9, title: "[속초 이조면옥] 3대천왕 나왔던 막국수 맛집", type: "written" },
        { id: 10, title: "[르다] 한강뷰 파인다이닝 레스토랑", type: "written" },
        { id: 11, title: "#이재모피자 #부산_필수코스 #남포동맛집", type: "written" },
        { id: 12, title: "인천 동암 맛집  '할매닭한마리'", type: "written" },
        { id: 13, title: "베이글 맛집 #코끼리베이글", type: "written" },
        { id: 14, title: "[연남동 서식당] 60년 역사의 소갈비집", type: "written" },
        { id: 15, title: "샤이니 태민의 단골집 [압구정 대감왕족발]", type: "written" },
        { id: 16, title: "[경복궁 미락치킨] 유해진도 먹고 갈 알~싸한 마늘치킨 맛집", type: "written" },
        { id: 17, title: "[논현동 프로간장새우 본점] 간장새우의 전설이 시작된 곳", type: "written" },
        { id: 18, title: "와 진짜 여긴 꼭 가봐야겠어요! 🍽️✨ 사진만 봐도 군침 도네요! 😋", type: "comments" },
        { id: 19, title: "여기 다녀온 적 있는데 진짜 맛있더라고요! ❤️ 다음엔 OO 메뉴도 드셔보세요~", type: "comments" },
        { id: 20, title: "여기 주차는 편한가요? 꼭 가보고 싶어서 물어봐요!", type: "comments" },
        { id: 21, title: "혹시 가격대는 어땠나요? 참고하려고요!", type: "comments" },
        { id: 22, title: "사진 너무 잘 찍으셨네요! 음식이 더 맛있어 보이게 만드는 마법 같은 포스팅이에요!", type: "comments" },
        { id: 23, title: "이거 보니 바로 배달 주문하고 싶어요. 🛵🍕 너무 맛있어 보입니다!", type: "comments" },
        { id: 24, title: "포스팅 퀄리티 대박이에요! 읽는 재미까지 최고입니다. 👍", type: "comments" },
        { id: 25, title: "이 정도면 맛집 홍보 대사 하셔야겠어요! 😎", type: "comments" },
        { id: 26, title: "여기 어릴 때 부모님이랑 갔던 곳인데 아직도 핫하네요! 추억 돋아요.", type: "comments" },
        { id: 27, title: "덕분에 주말 계획 생겼어요! 좋은 정보 감사합니다.", type: "comments" },
        { id: 28, title: "SNS 공유 완료! 친구들 다 초대해서 가볼게요!", type: "comments" },
        { id: 29, title: "여기 진짜 👉👌🔥💯!", type: "comments" },
        { id: 30, title: "진짜 미쳤다… 이건 못 참죠. 이번 주 내내 여기 생각날 것 같아요.", type: "comments" },
        { id: 31, title: "몇 년 전에 다녀왔던 곳인데 맛 그대로인가요? 갑자기 가고 싶어졌어요!", type: "comments" },
        { id: 32, title: "이 포스팅은… 제 다이어트를 방해했습니다. 🍩🍔😂 하지만 행복해요!", type: "comments" },
        { id: 33, title: "🩷 서울 기사식당 투어: 양지식당에서 만난 소울푸드", type: "liked" }, // 이 밑으론 존재X 식당
        { id: 34, title: "🩷 이른 아침을 채우는 청진옥 해장국 이야기", type: "liked" },
        { id: 35, title: "🩷 강릉 초당순두부 골목에서 찾은 최고의 한입", type: "liked" },
        { id: 36, title: "🩷 대구 10대 맛집: 복어 불고기부터 찜갈비까지", type: "liked" },
        { id: 37, title: "🩷 인천 동암역 할매닭한마리, 여기가 진짜 국물 맛집!", type: "liked" },
        { id: 38, title: "🩷 전주 한옥마을 비빔밥 맛집: 진정한 한식의 풍미!", type: "liked" },
        { id: 39, title: "🩷 제주 흑돼지의 진가를 만나다: 돈사돈 맛집 리뷰", type: "liked" },
        { id: 40, title: "🩷 우도 땅콩아이스크림부터 회국수까지, 제주 별미 여행", type: "liked" },
        { id: 41, title: "🩷 대구 단지보쌈의 부드럽고 촉촉한 보쌈 한 상", type: "liked" },
        { id: 42, title: "🩷 서울 미슐랭 맛집 탐방: 강북구의 히든 보석", type: "liked" },
        { id: 43, title: "🩷 부산에서 만난 소울푸드: 곰장어의 진수", type: "liked" },
        { id: 44, title: "광장시장에서 발견한 인생 떡볶이, 어디까지 먹어봤니?", type: "saved" },
        { id: 45, title: "종로 삼계탕 골목, 진한 국물의 깊이에 빠지다", type: "saved" },
        { id: 46, title: "평창 송어축제에서 맛본 송어회, 이건 꼭 먹어야 해! 🐟", type: "saved" },
        { id: 47, title: "전주 콩나물국밥의 진수, 이 집은 다릅니다!", type: "saved" },
        { id: 48, title: "안동 찜닭 골목 투어: 짭조름한 찜닭의 매력", type: "saved" },
        { id: 49, title: "충주 사과맛집, 디저트 카페에서 맛본 상큼함 🍎", type: "saved" },
      ]);
  
      // 현재 선택된 박스의 타입에 맞게 게시물을 필터링
      const filteredItems = computed(() =>
        items.value.filter(item => {
          if (selectedBox.value === null) return []; // 박스가 선택되지 않은 경우 빈 배열 반환
          return item.type === boxes.value[selectedBox.value].type;
        })
      );
  
      // 박스 선택 함수
      const selectBox = index => {
        selectedBox.value = index;
        selectedItems.value = []; // 체크된 선택 초기화
      };
  
      // 삭제 확인 모달 열기(삭제 버튼 클릭 시 삭제 확인 창 표시)
      const confirmDelete = () => {
        if (selectedItems.value.length > 0) {
          showDeleteModal.value = true;
        } else {
          alert("삭제할 항목을 선택해주세요.");
        }
      };
  
    // 삭제 실행 함수
  const deleteItems = () => {
    items.value = items.value.filter(
      (item) => !selectedItems.value.includes(item.id)
    );
    selectedItems.value = [];
    showDeleteModal.value = false;
  };
  
      // 홈으로 이동
      const goToMainView = () => {
        router.push("/posts"); // 라우터를 사용하여 메인 화면으로 이동
      };
  
      return {
        userId,
        boxes,
        items,
        selectedBox,
        filteredItems,
        selectedItems,
        showDeleteModal,
        selectBox,
        confirmDelete,
        deleteItems,
        goToMainView,
      };
    },
  };
  </script>
  
  <!-- CSS -->
  <style scoped>
  .my-page {
    width: 100%; /* 브라우저 전체 너비 */
    max-width: 1200px;
    min-height: 100vh; /* 브라우저 높이와 동일하거나 그 이상 */
    display: flex;
    flex-direction: column;
    margin: auto;
    font-family: Arial, sans-serif;
  }
  
  .new-post-container {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    position: relative;
  }
  
  .back-link {
    font-size: 14px;
    cursor: pointer;
    color: #000;
    text-decoration: none;
    right: 10px;
  }
  
  .back-link:hover {
    text-decoration: underline;
    color: #000;
  }
  
  .header {
    text-align: center;
    margin-top: 40px;
    margin-bottom: 0;
    font-family: "Georgia", serif;
    font-size: 36px;
    font-weight: bold;
  }
  
  .header p {
    font-size: 30px;
    margin-top: -10px;
  }
  
  /* 박스 컨테이너 */
  .box-container {
    width: 100%;
    max-width: 1200px; /* 최대 너비 설정 */
    display: flex;
    justify-content: center;
    gap: 15px;
    margin: 20px auto; /* 가운데 정렬 */
    padding: 10px; /* 패딩 추가 */
  }
  
  .box {
    flex: 1 0 200px;
    max-width: 1200px;
    padding: 15px;
    margin: 20px auto;
    text-align: center;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-weight: normal; /* 기본적으로 글씨 두께는 normal */
  }
  
  /* 특정 박스만 글씨 두껍게 */
  .box.bold-text {
    font-weight: bold; /* 글씨 두께를 bold로 설정 */
  }
  
  .box.active {
    background-color: #000;
    color: white;
    font-weight: bold;
  }
  
  .box:hover {
    background-color: #d0d0d0;
  }
  
  /* 보드 타이틀 */
  .board-title {
    width: 100%; /* 너비 100% */
    max-width: 1200px; /* 최대 너비 설정 */
    margin: 20px auto; /* 상하 마진은 20px, 좌우 마진은 자동 */
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
  
  .red-text {
    color: red;
    font-weight: bold;
    font-size: 20px;
  
  }
  
  .black-text {
    color: black;
    font-size: 19px;
  }
  
  .delete-button {
    margin-left: auto;
    background: none;
    border: none;
    color: black;
    font-size: 16px;
    cursor: pointer;
  }
  
  .delete-button:hover {
    color: red;
  }
  
  .icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    object-fit: contain;
  }
  
  .box span {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
  }
  
  /* 박스 컨테이너 */
  .box-container {
    width: 100%;
    max-width: 1200px; /* 최대 너비 설정 */
    display: flex;
    justify-content: center;
    gap: 15px;
    margin: 20px auto; /* 가운데 정렬 */
    padding: 10px; /* 패딩 추가 */
  }
  
  
  
  .board-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    
  }
  
  .board-table th,
  .board-table td {
    border: 1px solid #ddd;
    padding: 12px;
    line-height: 1.5;
    font-size: 14px;
    vertical-align: middle;
    text-align: center; /* 가운데 정렬 추가 */
  }
  
  .board-table th:nth-child(1),
  .board-table td:nth-child(1) {
    width: 7%;
  }
  
  .board-table th:nth-child(2),
  .board-table td:nth-child(2) {
    width: 8%;
  }
  
  .board-table th:nth-child(3),
  .board-table td:nth-child(3) {
    width: 70%;
  }
  
  .board-table th {
    background-color: #f0f0f0;
    font-weight: bold;
  }
  
  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
  }
  
  .image-button {
    display: flex;
    align-items: center;
    background-color: #000;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .image-button .icon {
    width: 20px; /* 아이콘 크기 조절 */
    height: 20px; /* 아이콘 크기 조절 */
    margin-right: 10px; /* 아이콘과 텍스트 간격 */
  }
  
  /* 기존 박스 스타일 유지, 활성화 시 아이콘 색상 변경 */
  .box.active .icon {
    filter: invert(100%); /* 색상을 반전 */
  }
  
  </style>