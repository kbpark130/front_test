<template>
  <div class="visiting-post-view">
    <div class="left-banner">
      <router-link to="/posts" class="back-link">🏠 홈 화면으로 돌아가기</router-link>
      <div class="comments-section">
        <p class="likes" @click="likePost">▼ 💜 Like {{ post.likes }}</p>
        <div class="comment" v-for="comment in comments" :key="comment.commentId">
          <span class="nickname">@{{ comment.commentWriter }}</span>

          <!-- 수정 모드일 때와 아닐 때를 구분 -->
          <div v-if="editMode === comment.commentId">
            <input v-model="editedComment" />
            <button @click="saveComment(comment.commentId)">저장</button>
            <button @click="cancelEdit">취소</button>
          </div>
          <p v-else class="comment-text">{{ comment.content }}</p>

          <!-- 댓글 작성자일 경우에만 수정 및 삭제 버튼 표시, 수정 중일 때는 숨김 -->
          <div v-if="isAuthor(comment) && editMode !== comment.commentId" class="comment-actions">
            <button @click="editComment(comment.commentId)">✏️</button>
            <button @click="deleteComment(comment.commentId)">🗑️</button>
          </div>
        </div>

        <div class="add-comment">
          <input v-model="newComment" placeholder="댓글을 입력해주세요." />
          <button @click="addComment">등록</button>
        </div>
      </div>
    </div>

    <div class="post-content">
      <div v-if="isPostAuthor" class="post-actions">
        <button @click="navigateToEdit">수정</button>
        <button @click="deletePost">삭제</button>
      </div>
      <p class="author">@{{ post.postWriter }}</p>
      <h1 class="title">{{ post.title }}</h1>
      <div class="images">
        <!-- postImage가 Base64 문자열로 처리 -->
        <img v-if="post.postImage" :src="'data:image/png;base64,' + post.postImage" class="post-image" />
      </div>
      <h3 class="store-name">{{ post.restaurant }}</h3>
      <p class="body">{{ post.content }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import EventBus from '@/utils/eventBus';

export default {
  data() {
    return {
      post: {},
      comments: [],
      newComment: '',
      editMode: null,
      editedComment: '',
      currentUser: localStorage.getItem('currentUser') || '', // 초기값 설정
      isLiking: false // 좋아요 처리 상태 확인
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
  computed: {
    isPostAuthor() {
      return this.post.postWriter === this.currentUser;
    },
  },
  async mounted() {
    const postId = this.$route.params.id; // URL 파라미터에서 ID를 가져옵니다.
    console.log("postId:", postId);  // console에 postId 값 출력
    // postId가 undefined일 경우, 오류 메시지 출력
    if (!postId) {
      console.error("postId가 제대로 전달되지 않았습니다.");
    }
    await this.fetchPostData(postId);
    await this.fetchComments(postId);
  },
  methods: {
    async fetchPostData(postId) {
      try {
        const response = await axios.get(`http://localhost:8080/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        this.post = response.data;
        console.log("post data:", this.post);  // 서버에서 받은 데이터 확인
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    },
    async fetchComments(postId) {
      try {
        const response = await axios.get(`http://localhost:8080/posts/${postId}/comment/list`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        this.comments = response.data.content;
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },
    isAuthor(comment) {
      return comment.commentWriter === this.currentUser;
    },
    
    async addComment() {
      if (!this.post.postId) {
        console.error('Post ID is not available!');
        return;
      }
      axios.post(`http://localhost:8080/posts/${this.post.postId}/comment/create`, { content: this.newComment }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        }
      })
      .then(response => {
        console.log('댓글 작성 성공:', response.data);
        this.comments.push(response.data); // 댓글을 맨 앞에 추가 (순서에 따라 push도 가능)
        this.newComment = ''; // 입력 필드 초기화
      })
      .catch(error => {
        console.error('댓글 작성 오류:', error.response);
        if (error.response) {
          // 서버의 오류 응답을 확인
          console.log('서버 응답 상태 코드:', error.response.status);
          console.log('서버 응답 내용:', error.response.data);
        } else if (error.request) {
          // 요청은 보내졌지만 응답이 없을 경우
          console.log('요청 보내졌지만 응답 없음:', error.request);
        } else {
          // 요청 설정 오류
          console.log('Axios 요청 설정 오류:', error.message);
        }
      });
    },
    editComment(id) {
      const comment = this.comments.find((c) => c.commentId === id);
      this.editMode = id;
      this.editedComment = comment.content;
    },
    saveComment(id) {
      const comment = this.comments.find((c) => c.commentId === id);
      if (this.editedComment.trim()) {
        comment.content = this.editedComment;
        this.editMode = null;
        this.editedComment = '';
      }
    },
    cancelEdit() {
      this.editMode = null;
      this.editedComment = '';
    },
    deleteComment(id) {
      this.comments = this.comments.filter((c) => c.commentId !== id);
    },
    navigateToEdit() {
      this.$router.push({
        name: 'NewPost',  // NewPostView.vue로 라우팅
        query: {
          id: this.post.postId, // ID를 query로 전달
          title: this.post.title,
          restaurant: this.post.restaurant,
          content: this.post.content,
        },
      });
    },
    deletePost() {
      if (confirm('정말로 이 글을 삭제하시겠습니까?')) {
        axios.delete(`http://localhost:8080/posts/${this.post.postId}/delete`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        })
          .then(() => {
            console.log('Post deleted');
            this.$router.push({ name: 'Main' }); // 삭제 후 홈으로 이동
          })
          .catch((error) => {
            console.error('Error deleting post:', error);
          });
      }
    },
    likePost() {
      if (this.isLiking) return; // 이미 요청 중이라면 아무것도 하지 않음
      this.isLiking = true;

      axios
        .post(
          `http://localhost:8080/posts/${this.post.id}/like`,
          { username: this.currentUser },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        )
        .then((response) => {
          this.post.likes = response.data.likes;
        })
        .catch((error) => {
          console.error('좋아요 처리 실패:', error);
        })
        .finally(() => {
          this.isLiking = false; // 요청 완료 후 상태 초기화
        });
    },
  },
};
</script>

<style scoped>
.visiting-post-view {
  display: flex;
  padding: 20px;
}

.left-banner {
  width: 250px;
  margin-right: 20px;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 8px;
}

.back-link {
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
  color: #333;
  text-decoration: none;
}

.comments-section {
  margin-top: 10px;
}

.likes {
  font-weight: bold;
  margin-bottom: 10px;
}

.comment {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.profile-image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
}

.nickname {
  font-weight: bold;
  margin-right: 8px;
}

.comment-text {
  flex: 1;
}

.comment-actions button {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 5px;
}

.add-comment {
  display: flex;
  margin-top: 10px;
}

.add-comment input {
  flex: 1;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-comment button {
  margin-left: 5px;
  padding: 5px 10px;
  background-color: black;
  color: white;
  border: none;
  cursor: pointer;
}

.post-content {
  flex: 1;
}

.post-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.post-actions button {
  background-color: black;
  color: white;
  border: none;
  padding: 5px 10px;
  margin-left: 5px;
  cursor: pointer;
}

.author {
  font-size: 14px;
  color: #555;
}

.title {
  font-size: 30px;
  margin: 20px 0;
  text-align: center;
  background-color: #f0f0f0;
  padding: 20px;
  display: inline-block;
}

.images {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.post-image {
  width: 40%;
  border-radius: 5px;
}

.store-name {
  font-size: 25px;
  margin: 10px 0;
}

.body {
  font-size: 20px;
  line-height: 1.5;
}

.new-post {
  margin-top: 20px;
}

.new-post input,
.new-post textarea {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.new-post button {
  padding: 10px 20px;
  background-color: black;
  color: white;
  border: none;
  cursor: pointer;
}
</style>