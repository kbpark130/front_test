<template>
  <div class="post-board">
    <div class="post-card" v-for="post in posts" :key="post.id">
      <img :src="post.image" alt="Post Image" />
      <h3>{{ post.title }}</h3>
      <p>{{ post.likes }} ❤️</p>
      <p>by {{ post.author }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['posts'],
};
</script>

<style scoped>
.post-board {
  /* 스타일 추가 */
}
.post-card {
  /* 스타일 추가 */
}
</style>
