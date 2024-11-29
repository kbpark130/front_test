<template>
  <div class="signup-container">
    <h1>회원가입</h1>
    <div class="signup-form">
      <div class="form-header">회원 기본 정보</div>

      <label for="userId">아이디:</label>
      <input
        type="text"
        id="userId"
        v-model="userId"
        placeholder="4~8자 영문 대소문자와 숫자로만 입력"
      />

      <label for="password">비밀번호:</label>
      <input
        type="password"
        id="password"
        v-model="password"
        placeholder="4~8자 영문 대소문자와 숫자로만 입력"
      />

      <label for="confirmPassword">비밀번호 확인:</label>
      <input
        type="password"
        id="confirmPassword"
        v-model="confirmPassword"
        placeholder="비밀번호를 다시 입력"
      />

      <label for="username">닉네임:</label>
      <input
        type="text"
        id="username"
        v-model="username"
        placeholder="사용할 닉네임을 입력"
      />

      <button @click="signup">완료</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      userId: '',
      password: '',
      confirmPassword: '',
      username: ''
    };
  },
  methods: {
    async signup() {
      if (this.password !== this.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      if (this.userId && this.password && this.username) {
        try {
          const requestBody = {
            userId: this.userId,
            password: this.password,
            confirmPassword: this.confirmPassword,
            username: this.username,
            agree: "true"
          };
          const response = await axios.post('http://localhost:8080/api/user', requestBody);
          if (response.data.success) {
            alert('회원가입이 완료되었습니다!');
            this.$router.push('/');
          } else {
            alert('회원가입에 실패했습니다.');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('회원가입 중 오류가 발생했습니다.');
        }
      } else {
        alert('모든 필드를 입력해 주세요.');
      }
    },
  },
};

</script>

<style scoped>
/* 기존 스타일 동일 */
.signup-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f8f8;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.signup-form {
  background-color: #e0e0e0;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  text-align: left;
}

.form-header {
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 0.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #555;
}
</style>