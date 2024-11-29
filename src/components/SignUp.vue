<template>
  <div class="signup-component">
    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="username">아이디:</label>
        <input type="text" id="username" v-model="username" />
      </div>

      <div class="form-group">
        <label for="password">비밀번호:</label>
        <input type="password" id="password" v-model="password" />
      </div>

      <div class="form-group">
        <label for="confirmPassword">비밀번호 확인:</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" />
      </div>

      <div class="form-group">
        <label for="nickname">닉네임:</label>
        <input type="text" id="nickname" v-model="nickname" />
      </div>

      <button type="submit">가입하기</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      nickname: '', // 닉네임 추가
    };
  },
  methods: {
    onSubmit() {
      if (this.password !== this.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      if (this.username && this.password && this.nickname) {
        alert('회원가입이 완료되었습니다!');
        this.$emit('signupSuccess');
      } else {
        alert('모든 필드를 입력해 주세요.');
      }
    },
  },
};
</script>

<style scoped>
/* 스타일 추가 */
.signup-component {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #333;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #555;
}
</style>
