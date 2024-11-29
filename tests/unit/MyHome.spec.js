import { shallowMount } from '@vue/test-utils';
import MyHome from '../../src/components/MyHome.vue';

describe('MyHome.vue', () => {
  let wrapper;

  beforeEach(() => {
    // localStorage mock 설정
    Storage.prototype.getItem = jest.fn(() => JSON.stringify([
      { id: 1, title: '첫 번째 포스트' },
      { id: 2, title: '두 번째 포스트' },
    ]));
    Storage.prototype.setItem = jest.fn();

    // 컴포넌트 마운트
    wrapper = shallowMount(MyHome);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('loads posts from localStorage on created', () => {
    expect(wrapper.vm.posts).toEqual([
      { id: 1, title: '첫 번째 포스트' },
      { id: 2, title: '두 번째 포스트' },
    ]);
  });

  it('deletes a post', async () => {
    await wrapper.vm.deletePost(1);
    expect(wrapper.vm.posts).toEqual([{ id: 2, title: '두 번째 포스트' }]);
    expect(localStorage.setItem).toHaveBeenCalledWith('posts', JSON.stringify([{ id: 2, title: '두 번째 포스트' }]));
  });
});
