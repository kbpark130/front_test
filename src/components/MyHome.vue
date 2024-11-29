<template>
  <div>
    <h1>새로운 블로그를 작성하세요~!</h1>
    <router-link to="/create">신규 블로그 추가</router-link>
    <div v-for="post in posts" :key="post.id">
      <router-link :to="'/post/' + post.id">{{ post.title }}</router-link>
      <router-link :to="'/edit/' + post.id">업데이트</router-link>
      <button @click="deletePost(post.id)">삭제</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      posts: [],
    };
  },
  created() {
    this.loadPosts();
  },
  methods: {
    loadPosts() {
      this.posts = JSON.parse(localStorage.getItem('posts')) || [];
    },
    deletePost(id) {
      this.posts = this.posts.filter((post) => post.id !== id);
      localStorage.setItem('posts', JSON.stringify(this.posts));
    },
  },
};
</script>
