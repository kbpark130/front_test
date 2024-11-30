<template>
  <div class="new-post-container">
    <button @click="goBack" class="back-link">← 홈 화면으로 돌아가기</button>

    <div class="form-group">
      <label for="title">제목</label>
      <input type="text" id="title" v-model="localTitle" placeholder="제목을 입력하세요" />
    </div>

    <div class="photo-upload">
      <label for="photos">사진 선택 (최대 2개):</label>
      <input type="file" id="photos" @change="handlePhotoUpload" multiple accept="image/*" />
      <p>{{ photoCountMessage }}</p>
    </div>

    <div class="form-group">
      <label for="businessName">상호명 입력</label>
      <input type="text" id="businessName" v-model="localBusinessName" placeholder="상호명을 입력하세요" />
    </div>

    <div class="form-group">
      <label for="content">본문 작성</label>
      <textarea id="content" v-model="localContent" placeholder="본문을 입력하세요"></textarea>
    </div>

    <button @click="submitPost" class="submit-button">
      {{ isEditMode ? '수정 완료' : '작성 완료' }}
    </button>
  </div>
</template>

<script>
import axios from 'axios';
//import { EventBus } from '@/utils/eventBus';

export default {
  data() {
      return {
      localTitle: this.$route.query.title || '', // 쿼리로 전달된 제목
      localBusinessName: this.$route.query.restaurant || '', // 쿼리로 전달된 상호명
      localContent: this.$route.query.content || '', // 쿼리로 전달된 본문
      postId: this.$route.query.id || null, // 쿼리로 전달된 postId
      localPhotos: [], // 사진은 수정 불가능
    };
  },
  computed: {
    isEditMode() {
      return !!this.postId; // postId가 있으면 수정 모드
    },
    photoCountMessage() {
      return this.localPhotos.length > 0
        ? `사진 ${this.localPhotos.length}개 선택됨`
        : '사진을 선택해주세요.';
    },
  },
  created() {
    console.log('postId from query:', this.$route.query.id); // postId 확인
    this.postId = this.$route.query.id || null;
    if (this.isEditMode) {
      this.loadPostData();
    }
  },
  methods: {
    goBack() {
      this.$router.push('/posts');
    },
    handlePhotoUpload() {
      // 수정 모드에서는 사진을 업로드할 수 없으므로 알림을 표시
      if (this.isEditMode) {
        alert('사진 수정은 불가능합니다. 기존 사진만 유지됩니다.');
      } else {
        // 새 글 작성 시 사진 업로드 처리
        const files = Array.from(event.target.files);
        if (files.length > 2) {
          alert('사진은 최대 2개까지 업로드할 수 있습니다.');
          return;
        }
        this.localPhotos = files;
      }
    },
    async loadPostData() {
      try {
        const response = await axios.get(`http://localhost:8080/posts/${this.postId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const postData = response.data;
        this.localTitle = postData.title;
        this.localBusinessName = postData.restaurant;
        this.localContent = postData.content;
        // 추가적으로 필요한 데이터가 있다면 여기서 처리
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    },
    async submitPost() {
      const formData = new FormData();

      const post = {
        title: this.localTitle,
        content: this.localContent,
        restaurant: this.localBusinessName,
      };

      // 새로운 글 작성일 때
      if (!this.isEditMode) {
        // 해시태그가 없다면 빈 배열로 보내기
        post.hashTagIds = this.localHashTags || [];
      }

      formData.append('post', new Blob([JSON.stringify(post)], { type: 'application/json' }));

      // 사진은 수정 불가능하므로, 수정 모드일 때만 사진을 추가합니다.
      if (this.isEditMode) {
        this.localPhotos.forEach((photo) => {
          formData.append('images', photo);
        });
      }

      const url = this.isEditMode
        ? `http://localhost:8080/posts/${this.postId}/update` // 수정 요청 URL
        : 'http://localhost:8080/posts/create'; // 새로운 글 작성 요청 URL

      const method = this.isEditMode ? 'put' : 'post';

      try {
        await axios({
          method,
          url,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          data: formData,
        });

        alert(this.isEditMode ? '글 수정이 완료되었습니다!' : '글 작성이 완료되었습니다!');
        this.$router.push('/posts');
      } catch (error) {
        console.error('오류가 발생했습니다:', error);
        alert('오류가 발생했습니다. 다시 시도해주세요.');
      }
    },
  }
};
</script>

<style scoped>
/* 스타일은 그대로 유지 */
.new-post-container {
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  top: 50%;
  transform: translateY();
}

.back-link {
  display: inline-block;
  margin-bottom: 20px;
  padding: 8px 12px;
  color: #fff;
  background-color: #333;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
}

.back-link:hover {
  background-color: #535353;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.photo-upload {
  margin-bottom: 20px;
}

.submit-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #535353;
}
</style>