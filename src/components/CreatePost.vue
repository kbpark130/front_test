<template>
  <div>
    <h1>신규 블로그 생성</h1>
    <form @submit.prevent="createPost">
      <input v-model="title" placeholder="제목" />
      <textarea v-model="content" placeholder="블로그 내용"></textarea>
      <button type="submit">추가</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      content: '',
    };
  },
  methods: {
    createPost() {
      // Post ���� ���� (���÷� Local Storage ���)
      const posts = JSON.parse(localStorage.getItem('posts')) || [];
      const newPost = {
        id: Date.now(),
        title: this.title,
        content: this.content,
      };
      posts.push(newPost);
      localStorage.setItem('posts', JSON.stringify(posts));
      this.$router.push('/');
    },
  },
};
</script>
