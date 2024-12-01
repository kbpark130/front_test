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

    <!-- 해시태그 선택 영역 추가 -->
    <div class="form-group">
      <label>나이층</label>
      <select v-model="selectedAgeTags" multiple>
        <option v-for="tag in ageTags" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
      </select>
    </div>

    <div class="form-group">
      <label>종류</label>
      <select v-model="selectedCategoryTags" multiple>
        <option v-for="tag in categoryTags" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
      </select>
    </div>

    <div class="form-group">
      <label>방문목적</label>
      <select v-model="selectedPurposeTags" multiple>
        <option v-for="tag in purposeTags" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
      </select>
    </div>

    <div class="form-group">
      <label>편의기능</label>
      <select v-model="selectedUtilityTags" multiple>
        <option v-for="tag in utilityTags" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
      </select>
    </div>

    <div class="form-group">
      <label>지역</label>
      <select v-model="selectedRegionTags" multiple>
        <option v-for="tag in regionTags" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
      </select>
    </div>

    <button @click="submitPost" class="submit-button">
      {{ isEditMode ? '수정 완료' : '작성 완료' }}
    </button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      localTitle: this.$route.query.title || '',
      localBusinessName: this.$route.query.restaurant || '',
      localContent: this.$route.query.content || '',
      postId: this.$route.query.id || null,
      localPhotos: [],
      // 태그 관련 데이터 추가
      selectedAgeTags: [],
      selectedCategoryTags: [],
      selectedPurposeTags: [],
      selectedUtilityTags: [],
      selectedRegionTags: [],
      ageTags: [
        { id: 1, name: '10대-20대' },
        { id: 2, name: '30대-40대' },
        { id: 3, name: '50대-60대' },
      ],
      categoryTags: [
        { id: 4, name: '한식' },
        { id: 5, name: '중식' },
        { id: 6, name: '일식' },
        { id: 7, name: '카페' },
      ],
      purposeTags: [
        { id: 8, name: '아침' },
        { id: 9, name: '점심' },
        { id: 10, name: '저녁' },
        { id: 11, name: '여행' },
        { id: 12, name: '가족외식' },
      ],
      utilityTags: [
        { id: 13, name: '주차' },
        { id: 14, name: '24시간영업' },
      ],
      regionTags: [
        { id: 15, name: '서울' },
        { id: 16, name: '경기' },
        { id: 17, name: '인천' },
      ],
    };
  },
  computed: {
    isEditMode() {
      return !!this.postId;
    },
    photoCountMessage() {
      return this.localPhotos.length > 0
        ? `사진 ${this.localPhotos.length}개 선택됨`
        : '사진을 선택해주세요.';
    },
  },
  created() {
    console.log('postId from query:', this.$route.query.id);
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
      if (this.isEditMode) {
        alert('사진 수정은 불가능합니다. 기존 사진만 유지됩니다.');
      } else {
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

      if (!this.isEditMode) {
        post.hashTagIds = [
          ...this.selectedAgeTags,
          ...this.selectedCategoryTags,
          ...this.selectedPurposeTags,
          ...this.selectedUtilityTags,
          ...this.selectedRegionTags,
        ];
      }

      formData.append('post', new Blob([JSON.stringify(post)], { type: 'application/json' }));

      if (!this.isEditMode) {
        this.localPhotos.forEach((photo) => {
          formData.append('images', photo);
        });
      }

      const url = this.isEditMode
        ? `http://localhost:8080/posts/${this.postId}/update`
        : 'http://localhost:8080/posts/create';

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
  .form-group textarea,
  .form-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>