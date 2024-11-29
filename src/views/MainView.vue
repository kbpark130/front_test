//사용자 닉네임 불러오는 버전
<template>
  <div class="main-container">
    <!-- 상단 사용자 정보 및 마이페이지 버튼 -->
    <div class="user-info" v-if="currentUser">
      <span class="username">@{{ currentUser }}</span>
      <button @click="goToMyPage">마이페이지</button>
    </div>

    <h1 class="title">맛집블로그</h1>
    <div class="search-bar-container">
      <input type="text" v-model="searchQuery" placeholder="검색어를 입력하세요" />
      <button @click="goToNewPost">New Post</button>
    </div>

    <div class="post-board">
      <div class="post-card" v-for="post in filteredPosts" :key="post.postId">
        <div class="profile">
          <span class="nickname">@{{ post.postWriter }}</span>
        </div>
        <router-link :to="{ name: 'Visiting', params: { id: post.postId } }" class="post-title">{{ post.title }}</router-link>
        <img 
          :src="post.postImage ? `data:image/png;base64,${post.postImage}` : 'default-image.png'" 
          alt="Post Image" 
          class="post-image" 
        />
        <h3 class="store-name">{{ post.restaurant }}</h3>
        <p class="likes">💜 Like {{ post.likes || 0 }}</p>
        <div class="hash-tags">
          <span v-for="tag in post.hashTags" :key="tag.hashTagId" class="hash-tag">
            {{ tag.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import EventBus from '@/utils/eventBus';

export default {
  data() {
    return {
      searchQuery: '',
      posts: [],
      likeCounts: {}, // postId를 키로 좋아요 개수를 저장
      currentUser: localStorage.getItem('currentUser') || null,
    };
  },
  created() {
    EventBus.on('updateCurrentUser', (username) => {
      this.currentUser = username;
      localStorage.setItem('currentUser', username); // localStorage 동기화
    });
  },
  beforeUnmount() {
  EventBus.off('updateCurrentUser'); // 구독 해제
  },
  mounted() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    };
    axios.get('http://localhost:8080/posts/list', { headers })
      .then(response => {
        console.log('서버 응답 데이터:', response.data); // 응답 데이터 출력
        this.posts = Array.isArray(response.data.content) ? response.data.content : [];
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생', error);
        this.posts = []; // 오류 발생 시 빈 배열로 초기화
      });
  },
  computed: {
    filteredPosts() {
      if (!Array.isArray(this.posts)) {
        return [];
      }
      return this.posts.filter(
        (post) =>
          post.restaurant.includes(this.searchQuery) ||
          post.title.includes(this.searchQuery)
      );
    },
  },
  methods: {
    async fetchLikeCount(postId) {
      try {
        const response = await axios.get(`http://localhost:8080/posts/${postId}/like-count`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // JWT 토큰 사용
          }
        });
        // 좋아요 개수를 저장
        this.$set(this.likeCounts, postId, response.data.likeCount || 0);
      } catch (error) {
        console.error(`Error fetching like count for post ${postId}:`, error);
        this.$set(this.likeCounts, postId, 0); // 오류 발생 시 0으로 초기화
      }
    },
    async fetchAllLikeCounts() {
      // 모든 게시글에 대해 fetchLikeCount 호출
      for (const post of this.posts) {
        await this.fetchLikeCount(post.postId);
      }
    },
    goToNewPost() {
      this.$router.push('/posts/create'); // 글 작성 화면으로 이동
    },
    goToMyPage() {
      this.$router.push('/mypage');
    },
  },
};
</script>

<style scoped>
.main-container {
  text-align: center;
  padding: 20px;
}

.user-info {
  text-align: right;
}

input {
  padding: 8px;
  font-size: 16px;
}

.title {
  font-size: 2rem;
  margin-bottom: 10px;
}

.search-bar-container {
  display: flex;
  justify-content: center; /* 컨테이너 안의 검색바와 버튼을 수평으로 정렬 */
  align-items: center; /* 컨테이너 안의 요소를 수직으로 정렬 */
  margin-bottom: 20px;
  width: 100%; /* 컨테이너 너비를 화면 크기에 맞춤 */
  max-width: 600px; /* 검색바와 버튼을 포함한 최대 너비 */
  margin: 0 auto; /* 컨테이너 자체를 화면 중앙에 배치 */
}

.search-bar-container input {
  flex: 1; /* 컨테이너의 가로 공간을 검색바가 채우도록 설정 */
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-width: 600px; /* 검색바 최대 너비 */
}

.search-bar-container button {
  margin-left: 10px; /* 버튼과 검색바 간격 조정 */
  padding: 8px 16px;
  font-size: 1rem;
  background-color: black;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}


.post-board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* 그리드 레이아웃 */
  gap: 60px; /* 항목 간 간격 */
  justify-items: center; /* 그리드 항목 가운데 정렬 */
  padding: 20px;
}

.post-card {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  width: 100%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s;
}

.post-card:hover {
  transform: scale(1.05); /* 마우스 호버 시 카드 확대 */
}

.profile {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.profile-image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
}

.nickname {
  font-weight: bold;
}

.post-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  margin-bottom: 10px;
  display: block;
}

.post-title:hover {
  color: #007bff;
}

.post-image {
  width: 200px; /* 원하는 너비 */
  height: 200px; /* 원하는 높이 */
  object-fit: cover; /* 이미지 비율을 유지하며 영역에 맞춤 */
  background-color: #f0f0f0; /* 빈 공간이 생길 경우 배경 색상 */
  border-radius: 8px;
}

.store-name {
  font-size: 1.2rem;
  margin: 5px 0;
  color: #555;
}

.likes {
  font-size: 1rem;
  color: #888;
}

.hash-tags {
  margin-top: 10px;
}

.hash-tag {
  display: inline-block;
  background-color: #f1f1f1;
  padding: 5px 10px;
  margin: 5px;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #333;
}

button {
  margin-left: 10px;
  padding: 8px 16px;
  background-color: black;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: gray;
}
</style>
