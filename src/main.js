import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Vue Router 설정이 포함된 파일
import axios from 'axios';
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;

// 앱 생성 및 라우터 설정
const app = createApp(App);

app.use(router); // Vue Router 사용
app.mount('#app'); // id가 'app'인 요소에 앱을 마운트