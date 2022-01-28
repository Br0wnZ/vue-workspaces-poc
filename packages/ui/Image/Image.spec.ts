import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from "vitest";

import Image from './Image.vue'

describe('Image', () => {
  it('Render', () => {
    const wrapper = shallowMount(Image, {
      propsData: { }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})