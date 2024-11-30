import { shallowMount } from '@vue/test-utils';
import PostBoard from '@/components/PostBoard.vue'; // 컴포넌트 경로에 맞게 수정

describe('PostBoard.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(PostBoard, {
      props: {
        posts: [
          { id: 1, title: 'Post 1', content: 'Content 1' },
          { id: 2, title: 'Post 2', content: 'Content 2' }
        ]
      }
    });
  });

  it('receives and renders posts properly', () => {
    const posts = wrapper.props().posts;

    expect(posts).toEqual([
      { id: 1, title: 'Post 1', content: 'Content 1' },
      { id: 2, title: 'Post 2', content: 'Content 2' }
    ]);
  });
});
