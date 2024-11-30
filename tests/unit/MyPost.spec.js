import { shallowMount } from '@vue/test-utils';
import MyPost from '@/components/MyPost.vue'; // 컴포넌트 경로에 맞게 수정

// localStorage 모킹 설정
jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
  if (key === 'posts') {
    return JSON.stringify([
      { id: 1, title: 'Existing Post', content: 'This is an existing post content' },
      { id: 2, title: 'Another Post', content: 'Another post content' }
    ]);
  }
  return null;
});

describe('MyPost.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(MyPost, {
      global: {
        mocks: {
          $route: {
            params: { id: 1 }
          }
        }
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('loads the post on created', () => {
    expect(wrapper.vm.post.id).toBe(1);
    expect(wrapper.vm.post.title).toBe('Existing Post');
    expect(wrapper.vm.post.content).toBe('This is an existing post content');
  });

  it('handles non-existing post', () => {
    const nonExistingWrapper = shallowMount(MyPost, {
      global: {
        mocks: {
          $route: {
            params: { id: 999 }
          }
        }
      }
    });

    expect(nonExistingWrapper.vm.post.title).toBe('Post not found');
    expect(nonExistingWrapper.vm.post.content).toBe('');
  });
});
