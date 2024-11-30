import { shallowMount } from '@vue/test-utils';
import SignUp from '@/components/SignUp.vue'; // 컴포넌트 경로에 맞게 수정

describe('SignUp.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(SignUp);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows an alert when passwords do not match', async () => {
    window.alert = jest.fn(); // alert 함수 모킹

    await wrapper.setData({
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password456',
      nickname: 'testnick'
    });

    wrapper.vm.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('비밀번호가 일치하지 않습니다.');
  });

  it('shows an alert when fields are empty', async () => {
    window.alert = jest.fn(); // alert 함수 모킹

    await wrapper.setData({
      username: '',
      password: '',
      confirmPassword: '',
      nickname: ''
    });

    wrapper.vm.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('모든 필드를 입력해 주세요.');
  });

  it('emits signupSuccess when form is valid', async () => {
    window.alert = jest.fn(); // alert 함수 모킹

    await wrapper.setData({
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password123',
      nickname: 'testnick'
    });

    wrapper.vm.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('회원가입이 완료되었습니다!');
    expect(wrapper.emitted().signupSuccess).toBeTruthy();
  });
});
