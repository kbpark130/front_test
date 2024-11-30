import { shallowMount } from '@vue/test-utils';
import CreatePost from '@/components/CreatePost.vue';

// localStorage 모킹 설정
jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => JSON.stringify([]));
jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});

describe('CreatePost.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(CreatePost, {
      global: {
        mocks: {
          $router: {
            push: jest.fn()
          }
        }
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('sets the correct default data', () => {
    expect(wrapper.vm.title).toBe('');
    expect(wrapper.vm.content).toBe('');
  });

  it('creates a new post', async () => {
    wrapper.setData({
      title: 'Test Title',
      content: 'Test Content'
    });

    await wrapper.vm.createPost();

    const posts = JSON.parse(localStorage.setItem.mock.calls[0][1]);
    
    expect(posts).toEqual([
      {
        id: expect.any(Number), // `Date.now()`가 생성한 숫자를 매칭합니다.
        title: 'Test Title',
        content: 'Test Content'
      }
    ]);

    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/');
  });
});
