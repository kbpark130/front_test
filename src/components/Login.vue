<template>
  <div class="login-container">
    <h2>로그인</h2>
    <form @submit.prevent="login">
      <input type="text" v-model="username" placeholder="아이디" required />
      <input
        type="password"
        v-model="password"
        placeholder="비밀번호"
        required
      />
      <button type="submit">로그인</button>
      <p>회원이 아니신가요? <a @click="goToSignUp">회원가입</a></p>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    login() {
      // 로그인 처리 로직
      console.log('로그인 시도:', this.username, this.password);
    },
    goToSignUp() {
      // 회원가입 페이지로 이동
      this.$router.push('/signup');
    },
  },
};
</script>

<style scoped>
.login-container {
  /* 스타일 추가 */
}
</style>
