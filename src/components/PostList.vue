<template>
  <div class="sidebar">
    <input
      type="text"
      v-model="searchQuery"
      placeholder="검색어를 입력하세요"
    />
    <ul class="post-list">
      <li v-for="post in filteredPosts" :key="post.id">{{ post.title }}</li>
    </ul>
    <button @click="createNewPost">New Post</button>
  </div>
</template>

<script>
export default {
  props: ['posts'],
  data() {
    return {
      searchQuery: '',
    };
  },
  computed: {
    filteredPosts() {
      return this.posts.filter((post) => post.title.includes(this.searchQuery));
    },
  },
  methods: {
    createNewPost() {
      // 새 글 작성 로직
      console.log('New Post 클릭됨');
    },
  },
};
</script>

<style scoped>
.sidebar {
  /* 스타일 추가 */
}
</style>
