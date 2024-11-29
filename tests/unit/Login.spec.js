import { shallowMount } from '@vue/test-utils';
import Login from '../../src/components/Login.vue';

/**
 * @jest-environment jsdom
 */
describe('Login.vue', () => {
  it('sets the correct default data', () => {
    expect(typeof Login.data).toBe('function');
    const defaultData = Login.data();
    expect(defaultData.username).toBe('');
    expect(defaultData.password).toBe('');
  });
});
