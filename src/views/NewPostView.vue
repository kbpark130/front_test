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
  props: {
    postId: {
      type: String,
      default: null, // null일 경우 새 글 작성 모드로 간주
    },
  },
  data() {
    return {
      localTitle: '',
      localPhotos: [],
      localBusinessName: '',
      localContent: '',
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
  async created() {
    if (this.isEditMode) {
      await this.loadPostData();
    }
  },
  methods: {
    goBack() {
      this.$router.push('/posts');
    },
    handlePhotoUpload(event) {
      const files = Array.from(event.target.files);
      if (files.length > 2) {
        alert('사진은 최대 2개까지 업로드할 수 있습니다.');
        return;
      }
      this.localPhotos = files;
    },
    async loadPostData() {
      try {
        const response = await axios.get(`http://localhost:8080/posts/${this.postId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const post = response.data;

        this.localTitle = post.title;
        this.localPhotos = post.images || [];
        this.localBusinessName = post.restaurant;
        this.localContent = post.content;
      } catch (error) {
        console.error('게시글 데이터를 불러오는 중 오류가 발생했습니다:', error);
        alert('게시글 데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    },
    async submitPost() {
        const formData = new FormData();

        const post = {
          title: this.localTitle,
          content: this.localContent,
          restaurant: this.localBusinessName,
          hashTagIds: this.localHashTags || [] 
        };

    formData.append('post', new Blob([JSON.stringify(post)], { type: 'application/json' }));

    this.localPhotos.forEach((photo) => {
    formData.append('images', photo);
    });

    const url = this.isEditMode
      ? `http://localhost:8080/posts/${this.id}/update`
      : 'http://localhost:8080/posts/create';

    const method = this.isEditMode ? 'put' : 'post';

    try {
      // Axios 요청 로그 출력
      console.log('Authorization:', `Bearer ${localStorage.getItem('accessToken')}`);
      console.log('URL:', url);
      console.log('Method:', method);
      console.log('FormData:', formData);

      await axios({
        method,
        url,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Bearer 토큰 설정
        },
        data: formData,
      });

      alert(this.isEditMode ? '글 수정이 완료되었습니다!' : '글 작성이 완료되었습니다!');
      this.$router.push('/posts');
      } catch (error) {
      console.error('오류가 발생했습니다:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  },
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