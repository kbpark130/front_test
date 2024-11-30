import { shallowMount } from '@vue/test-utils';
import EditPost from '@/components/EditPost.vue'; // 컴포넌트 경로에 맞게 수정

// localStorage 모킹 설정
jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
  if (key === 'posts') {
    return JSON.stringify([
      { id: 1, title: 'Old Title', content: 'Old Content' },
      { id: 2, title: 'Another Post', content: 'Another Content' }
    ]);
  }
  return null;
});
jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});

describe('EditPost.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(EditPost, {
      global: {
        mocks: {
          $route: {
            params: { id: 1 }
          },
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

  it('loads the post on created', () => {
    expect(wrapper.vm.id).toBe(1);
    expect(wrapper.vm.title).toBe('Old Title');
    expect(wrapper.vm.content).toBe('Old Content');
  });

  it('updates the post', async () => {
    wrapper.setData({
      title: 'Updated Title',
      content: 'Updated Content'
    });

    await wrapper.vm.updatePost();

    const updatedPosts = JSON.parse(localStorage.setItem.mock.calls[0][1]);

    expect(updatedPosts).toEqual([
      { id: 1, title: 'Updated Title', content: 'Updated Content' },
      { id: 2, title: 'Another Post', content: 'Another Content' }
    ]);
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/');
  });
});
