<template>
  <div>
    <h1>{{ post.title }}</h1>
    <p>{{ post.content }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      post: {}
    };
  },
  created() {
    this.loadPost();
  },
  methods: {
    loadPost() {
      const postId = this.$route.params.id;
      const posts = JSON.parse(localStorage.getItem('posts')) || [];
      this.post = posts.find(post => post.id == postId) || { title: 'Post not found', content: '' };
    }
  }
};
</script>
